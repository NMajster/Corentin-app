import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Signature manquante" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Erreur vérification webhook:", err);
      return NextResponse.json(
        { error: "Signature invalide" },
        { status: 400 }
      );
    }

    // Gérer les différents événements
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Paiement réussi:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Paiement échoué:", paymentIntent.id);
        break;
      }

      default:
        console.log(`Événement non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur webhook Stripe:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();
  
  if (!supabase) {
    console.error("Supabase admin non configuré");
    return;
  }

  const email = session.customer_email || session.metadata?.email;
  const prenom = session.metadata?.prenom || "";
  const nom = session.metadata?.nom || "";
  const telephone = session.metadata?.telephone || "";

  // Enregistrer le paiement
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
      stripe_customer_id: session.customer as string,
      amount: (session.amount_total || 0) / 100, // Convertir centimes en euros
      currency: session.currency?.toUpperCase() || "EUR",
      status: "completed",
      payment_type: "entretien_initial",
      email: email,
      metadata: {
        prenom,
        nom,
        telephone,
      },
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (paymentError) {
    console.error("Erreur enregistrement paiement:", paymentError);
    return;
  }

  console.log("Paiement enregistré:", payment?.id);

  // Vérifier si un utilisateur existe avec cet email
  const { data: existingUser } = await supabase
    .from("profils_clients")
    .select("user_id")
    .eq("email", email)
    .single();

  if (existingUser) {
    // Lier le paiement à l'utilisateur
    await supabase
      .from("payments")
      .update({ user_id: existingUser.user_id })
      .eq("id", payment.id);
  }

  console.log(`Paiement traité pour ${email}: ${session.amount_total! / 100}€`);
}
