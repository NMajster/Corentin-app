"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  ChevronLeft,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Cal, { getCalApi } from "@calcom/embed-react";

function CalendarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Vérifier le paiement Stripe
  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId) {
        setError("Session de paiement invalide");
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
        const data = await response.json();

        if (data.success && data.paid) {
          setVerified(true);
          setCustomerEmail(data.email || "");
          setCustomerName(data.name || "");
        } else {
          setError("Le paiement n'a pas été confirmé");
        }
      } catch {
        setError("Erreur lors de la vérification du paiement");
      } finally {
        setVerifying(false);
      }
    }

    verifyPayment();
  }, [sessionId]);

  // Initialiser Cal.com
  useEffect(() => {
    if (!verified) return;

    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: false,
        layout: "month_view",
      });

      // Écouter quand le RDV est confirmé
      cal("on", {
        action: "bookingSuccessful",
        callback: (e: unknown) => {
          const event = e as { data?: { booking?: { startTime?: string } } };
          const bookingData = event?.data?.booking;
          // Rediriger vers la confirmation
          router.push(
            `/rendez-vous/confirmation?email=${encodeURIComponent(customerEmail)}&name=${encodeURIComponent(customerName)}&booked=true&date=${bookingData?.startTime || ""}`
          );
        },
      });
    })();
  }, [verified, customerEmail, customerName, router]);

  // État de chargement - Vérification du paiement
  if (verifying) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-serif font-bold mb-2">Vérification du paiement...</h2>
            <p className="text-muted-foreground">Merci de patienter quelques instants</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Erreur
  if (error || !verified) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-serif font-bold mb-2">Erreur</h2>
            <p className="text-muted-foreground mb-6">{error || "Paiement non vérifié"}</p>
            <Link href="/rendez-vous">
              <Button>Réessayer</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Afficher Cal.com
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Défense des Épargnants"
                width={140}
                height={56}
                className="h-12 w-auto"
              />
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Paiement confirmé */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Paiement confirmé !</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Choisissez votre créneau
          </h1>
          <p className="text-muted-foreground">
            Sélectionnez la date et l&apos;heure qui vous conviennent le mieux
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-green-700">Informations</span>
          </div>
          <div className="w-12 h-0.5 bg-green-500" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-green-700">Paiement</span>
          </div>
          <div className="w-12 h-0.5 bg-primary" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              3
            </div>
            <span className="text-sm font-medium">Calendrier</span>
          </div>
        </div>

        {/* Cal.com embed */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Cal
              calLink="cabinet-majster/entretien-preliminaire"
              calOrigin="https://app.cal.eu"
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
              config={{
                layout: "month_view",
                theme: "light",
                name: customerName,
                email: customerEmail,
              }}
            />
          </CardContent>
        </Card>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Après avoir choisi votre créneau, vous recevrez un email de confirmation avec les détails du rendez-vous.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function CalendarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    }>
      <CalendarContent />
    </Suspense>
  );
}

