import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID requis" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        email: session.customer_email,
        metadata: session.metadata,
      });
    } else {
      return NextResponse.json({
        success: false,
        status: session.payment_status,
      });
    }
  } catch (error) {
    console.error("Erreur vérification session:", error);
    return NextResponse.json(
      { error: "Session invalide" },
      { status: 400 }
    );
  }
}



