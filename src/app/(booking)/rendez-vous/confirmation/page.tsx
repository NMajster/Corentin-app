"use client";

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
  Phone,
  Mail,
  Download,
  CalendarPlus,
} from "lucide-react";

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  
  const dateParam = searchParams.get("date");
  const timeParam = searchParams.get("time");
  const typeParam = searchParams.get("type") as "visio" | "telephone" | null;
  const emailParam = searchParams.get("email");

  if (!dateParam || !timeParam || !typeParam) {
    return null;
  }

  const selectedDate = new Date(dateParam);

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Générer le lien calendrier (Google Calendar)
  const generateCalendarLink = () => {
    const startDate = new Date(selectedDate);
    const [hours, minutes] = timeParam.split(":");
    startDate.setHours(parseInt(hours), parseInt(minutes), 0);
    
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 45);

    const formatDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "");

    const title = encodeURIComponent("Consultation - Défense des Épargnants");
    const details = encodeURIComponent(
      `Consultation initiale avec Me. Nathanaël MAJSTER\n\nType: ${typeParam === "visio" ? "Visioconférence" : "Téléphone"}\nDurée: 45 minutes\n\nPrésentez votre situation de fraude bancaire.`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${details}`;
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
            Rendez-vous confirmé !
          </h1>
          <p className="text-muted-foreground">
            Un email de confirmation a été envoyé à <strong>{emailParam}</strong>
          </p>
        </div>

        {/* Détails du RDV */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="font-serif font-bold text-xl mb-6 text-center">
              Votre consultation
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold capitalize">{formatFullDate(selectedDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Heure</p>
                  <p className="font-semibold">{timeParam} - 45 minutes</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  {typeParam === "visio" ? (
                    <Video className="w-6 h-6 text-primary" />
                  ) : (
                    <Phone className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type de consultation</p>
                  <p className="font-semibold">
                    {typeParam === "visio" ? "Visioconférence" : "Appel téléphonique"}
                  </p>
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

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <a href={generateCalendarLink()} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full h-14">
              <CalendarPlus className="w-5 h-5 mr-2" />
              Ajouter au calendrier
            </Button>
          </a>
          <Button variant="outline" className="w-full h-14">
            <Download className="w-5 h-5 mr-2" />
            Télécharger le récapitulatif
          </Button>
        </div>

        {/* Info prochaines étapes */}
        <Card className="bg-primary text-white">
          <CardContent className="p-6">
            <h3 className="font-serif font-bold text-lg mb-4">
              Prochaines étapes
            </h3>
            <ul className="space-y-3 text-white/90">
              <li className="flex items-start gap-3">
                <Badge className="bg-white/20 text-white mt-0.5">1</Badge>
                <span>
                  {typeParam === "visio" 
                    ? "Vous recevrez un lien de visioconférence par email 1h avant le rendez-vous"
                    : "Nous vous appellerons au numéro indiqué à l'heure du rendez-vous"
                  }
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Badge className="bg-white/20 text-white mt-0.5">2</Badge>
                <span>
                  Préparez les documents relatifs à votre fraude (relevés, captures d&apos;écran, échanges avec la banque)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Badge className="bg-white/20 text-white mt-0.5">3</Badge>
                <span>
                  Notez les dates clés et montants concernés pour faciliter l&apos;entretien
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

