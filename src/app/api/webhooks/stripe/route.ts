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

  if (!email) {
    console.error("Email manquant dans la session Stripe");
    return;
  }

  // 1. Vérifier si l'utilisateur existe déjà dans auth.users
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find(u => u.email === email);

  let userId: string;

  if (existingUser) {
    // L'utilisateur existe déjà
    userId = existingUser.id;
    console.log(`Utilisateur existant trouvé: ${userId}`);
  } else {
    // 2. Créer un nouvel utilisateur avec un mot de passe temporaire
    const tempPassword = crypto.randomUUID();
    
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // Confirmer l'email automatiquement
      user_metadata: {
        prenom,
        nom,
        telephone,
        full_name: `${prenom} ${nom}`.trim(),
      },
    });

    if (createError || !newUser.user) {
      console.error("Erreur création utilisateur:", createError);
      return;
    }

    userId = newUser.user.id;
    console.log(`Nouvel utilisateur créé: ${userId}`);

    // 3. Créer le profil client
    const { error: profileError } = await supabase.from("profils_clients").insert({
      user_id: userId,
    });

    if (profileError) {
      console.error("Erreur création profil:", profileError);
    }

    // 4. Créer le dossier initial
    const { error: dossierError } = await supabase.from("dossiers").insert({
      user_id: userId,
      statut: "nouveau",
      type_contentieux: "fraude_bancaire",
    });

    if (dossierError) {
      console.error("Erreur création dossier:", dossierError);
    }

    // 5. Envoyer un magic link pour que l'utilisateur définisse son mot de passe
    const { error: resetError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/dossier`,
      },
    });

    if (resetError) {
      console.error("Erreur envoi magic link:", resetError);
    } else {
      console.log(`Magic link envoyé à ${email}`);
    }
  }

  // 6. Enregistrer le paiement
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      user_id: userId,
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
      stripe_customer_id: session.customer as string,
      amount: (session.amount_total || 0) / 100,
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

  console.log(`Paiement traité pour ${email}: ${session.amount_total! / 100}€ (Payment ID: ${payment?.id})`);
}
