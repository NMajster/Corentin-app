import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Session ID manquant" },
        { status: 400 }
      );
    }

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        paid: true,
        email: session.customer_email || session.metadata?.email,
        name: session.metadata?.prenom 
          ? `${session.metadata.prenom} ${session.metadata.nom || ""}`
          : "",
      });
    }

    return NextResponse.json({
      success: true,
      paid: false,
      status: session.payment_status,
    });
  } catch (error) {
    console.error("Erreur vérification Stripe:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}
