import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialiser Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, prenom, nom } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email requis" },
        { status: 400 }
      );
    }

    // Créer la session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Entretien Initial",
              description: "Entretien de 45 minutes avec un avocat spécialisé en fraude bancaire",
            },
            unit_amount: 9000, // 90€ en centimes
          },
          quantity: 1,
        },
      ],
      metadata: {
        email,
        prenom: prenom || "",
        nom: nom || "",
        type: "entretien_initial",
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/rendez-vous/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/rendez-vous/paiement?canceled=true`,
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error("Erreur Stripe Checkout:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement" },
      { status: 500 }
    );
  }
}



