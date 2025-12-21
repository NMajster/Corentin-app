"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  CheckCircle,
  Calendar,
  Clock,
  Video,
  Mail,
  CalendarPlus,
  Loader2,
} from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  
  const emailParam = searchParams.get("email");
  const nameParam = searchParams.get("name");
  const dateParam = searchParams.get("date");
  const booked = searchParams.get("booked");

  // Si pas de paramètres, afficher un message générique
  const hasBooking = booked === "true";

  // Parser la date si disponible
  let formattedDate = "";
  let formattedTime = "";
  if (dateParam) {
    try {
      const date = new Date(dateParam);
      formattedDate = date.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      formattedTime = date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      // Ignorer les erreurs de parsing
    }
  }

  // Générer le lien Google Calendar
  const generateCalendarLink = () => {
    if (!dateParam) return "#";
    
    try {
      const startDate = new Date(dateParam);
      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + 45);

      const formatDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "");

      const title = encodeURIComponent("Consultation - Défense des Épargnants");
      const details = encodeURIComponent(
        `Consultation initiale avec Me. Nathanaël MAJSTER\n\nDurée: 45 minutes\n\nPrésentez votre situation de fraude bancaire.`
      );

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${details}`;
    } catch {
      return "#";
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
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

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Success icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            {hasBooking ? "Rendez-vous confirmé !" : "Paiement confirmé !"}
          </h1>
          {emailParam && (
            <p className="text-muted-foreground">
              Un email de confirmation a été envoyé à <strong>{emailParam}</strong>
            </p>
          )}
        </div>

        {/* Détails du RDV */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="font-serif font-bold text-xl mb-6 text-center">
              Votre consultation
            </h2>

            <div className="space-y-4">
              {nameParam && (
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-semibold">{nameParam}</p>
                  </div>
                </div>
              )}

              {formattedDate && (
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold capitalize">{formattedDate}</p>
                  </div>
                </div>
              )}

              {formattedTime && (
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Heure</p>
                    <p className="font-semibold">{formattedTime} - 45 minutes</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type de consultation</p>
                  <p className="font-semibold">Visioconférence ou téléphone</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
              <p className="text-sm text-center">
                <strong className="text-accent">Paiement reçu :</strong>{" "}
                <span className="font-serif font-bold">90€ TTC</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ajouter au calendrier si date disponible */}
        {formattedDate && (
          <div className="mb-6">
            <a href={generateCalendarLink()} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full h-12">
                <CalendarPlus className="w-5 h-5 mr-2" />
                Ajouter au calendrier
              </Button>
            </a>
          </div>
        )}

        {/* Appel à l'action - Import de pièces */}
        <Card className="bg-emerald-50 border-emerald-200 mb-4">
          <CardContent className="p-6">
            <h3 className="font-serif font-bold text-lg mb-3 text-emerald-700">
              ✨ Préparez votre entretien dès maintenant
            </h3>
            <p className="text-foreground mb-4">
              Pour un entretien efficace, <strong>importez vos pièces</strong> dans votre espace client. 
              Plus votre dossier sera complet, plus l&apos;avocat pourra vous conseiller précisément.
            </p>
            <Link href="/dashboard/pieces">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Importer mes pièces maintenant
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Lien discret vers l'espace */}
        <p className="text-center text-sm text-muted-foreground mb-6">
          Vous pourrez reprendre l&apos;import à tout moment depuis{" "}
          <Link href="/dashboard" className="text-primary hover:underline font-medium">
            votre espace personnel
          </Link>
        </p>

        {/* Info prochaines étapes */}
        <Card className="bg-primary text-white">
          <CardContent className="p-6">
            <h3 className="font-serif font-bold text-lg mb-4">
              Conseils pour vos pièces
            </h3>
            <ul className="space-y-3 text-white/90">
              <li className="flex items-start gap-3">
                <Badge className="bg-white/20 text-white mt-0.5">1</Badge>
                <span>
                  <strong>Scannez proprement</strong> vos documents (photos nettes, lisibles, pas de flou)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Badge className="bg-white/20 text-white mt-0.5">2</Badge>
                <span>
                  <strong>Ordre chronologique</strong> : classez vos pièces par date (les plus anciennes en premier)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Badge className="bg-white/20 text-white mt-0.5">3</Badge>
                <span>
                  <strong>Décrivez chaque pièce</strong> : ajoutez une courte description pour aider l&apos;avocat (ex: "Relevé BNP octobre 2024 - virement frauduleux de 3000€")
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Badge className="bg-white/20 text-white mt-0.5">4</Badge>
                <span>
                  <strong>Rédigez un résumé</strong> : dates clés, montants, chronologie des faits. Soyez concis et factuel.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Retour */}
        <div className="text-center mt-8">
          <Link href="/">
            <Button variant="ghost">
              Retour à l&apos;accueil
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
