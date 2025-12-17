"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Euro,
  Video,
  Phone,
  CheckCircle,
  Calendar,
  User,
  CreditCard,
} from "lucide-react";

// Types
type TimeSlot = {
  time: string;
  available: boolean;
};

type DaySlots = {
  date: Date;
  slots: TimeSlot[];
};

export default function BookingPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<"visio" | "telephone">("visio");

  // Générer les créneaux pour la semaine
  const weekDays = useMemo(() => {
    const days: DaySlots[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 5; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);

      // Pas de créneaux pour les jours passés
      if (date < today) {
        days.push({ date, slots: [] });
        continue;
      }

      // Générer des créneaux (simulé - en prod viendrait de Supabase)
      const slots: TimeSlot[] = [];
      const hours = ["09:00", "09:45", "10:30", "11:15", "14:00", "14:45", "15:30", "16:15", "17:00"];
      
      hours.forEach((time) => {
        // Simuler quelques créneaux indisponibles aléatoirement
        const available = Math.random() > 0.3;
        slots.push({ time, available });
      });

      days.push({ date, slots });
    }
    return days;
  }, [currentWeekStart]);

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newDate >= today) {
      setCurrentWeekStart(newDate);
      setSelectedDate(null);
      setSelectedTime(null);
    }
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    // Limiter à 4 semaines dans le futur
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 28);
    if (newDate <= maxDate) {
      setCurrentWeekStart(newDate);
      setSelectedDate(null);
      setSelectedTime(null);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  };

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", { 
      weekday: "long", 
      day: "numeric", 
      month: "long", 
      year: "numeric" 
    });
  };

  const handleSelectSlot = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const selectedDaySlots = selectedDate
    ? weekDays.find((d) => d.date.toDateString() === selectedDate.toDateString())?.slots || []
    : [];

  const canProceed = selectedDate && selectedTime;

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
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Retour au site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Titre */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Prendre rendez-vous
          </h1>
          <p className="text-muted-foreground">
            Consultation initiale avec Me. Nathanaël MAJSTER, avocat et ancien magistrat
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Info consultation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Consultation initiale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span>45 minutes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Euro className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">90€ TTC</span>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium mb-3">Type de consultation :</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => setConsultationType("visio")}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                        consultationType === "visio"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Video className={`w-5 h-5 ${consultationType === "visio" ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="text-left">
                        <p className="font-medium">Visioconférence</p>
                        <p className="text-xs text-muted-foreground">Via notre plateforme sécurisée</p>
                      </div>
                      {consultationType === "visio" && (
                        <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                      )}
                    </button>
                    <button
                      onClick={() => setConsultationType("telephone")}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                        consultationType === "telephone"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Phone className={`w-5 h-5 ${consultationType === "telephone" ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="text-left">
                        <p className="font-medium">Téléphone</p>
                        <p className="text-xs text-muted-foreground">Nous vous appelons</p>
                      </div>
                      {consultationType === "telephone" && (
                        <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground">
                    Cette consultation permet d&apos;analyser votre situation et d&apos;évaluer 
                    les chances de succès de votre dossier.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne centrale - Calendrier */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-serif text-lg capitalize">
                    {formatMonth(currentWeekStart)}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToPreviousWeek}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToNextWeek}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Grille des jours */}
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {weekDays.map((day) => {
                    const isSelected = selectedDate?.toDateString() === day.date.toDateString();
                    const hasSlots = day.slots.some((s) => s.available);
                    const isPast = day.slots.length === 0;

                    return (
                      <button
                        key={day.date.toISOString()}
                        onClick={() => hasSlots && setSelectedDate(day.date)}
                        disabled={!hasSlots}
                        className={`p-3 rounded-xl text-center transition-all ${
                          isSelected
                            ? "bg-primary text-white"
                            : hasSlots
                            ? "bg-white border-2 border-border hover:border-primary"
                            : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                        }`}
                      >
                        <p className="text-xs uppercase opacity-70">
                          {formatDate(day.date).split(" ")[0]}
                        </p>
                        <p className="text-lg font-bold">
                          {day.date.getDate()}
                        </p>
                        {hasSlots && !isPast && (
                          <p className={`text-xs mt-1 ${isSelected ? "text-white/80" : "text-green-600"}`}>
                            {day.slots.filter((s) => s.available).length} dispo
                          </p>
                        )}
                        {isPast && (
                          <p className="text-xs mt-1">Passé</p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Créneaux horaires */}
                {selectedDate ? (
                  <div>
                    <h3 className="font-semibold mb-4">
                      Créneaux disponibles le {formatFullDate(selectedDate)}
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {selectedDaySlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => slot.available && handleSelectSlot(selectedDate, slot.time)}
                          disabled={!slot.available}
                          className={`py-3 px-4 rounded-lg font-medium transition-all ${
                            selectedTime === slot.time
                              ? "bg-accent text-primary ring-2 ring-accent ring-offset-2"
                              : slot.available
                              ? "bg-white border-2 border-border hover:border-accent hover:bg-accent/5"
                              : "bg-muted text-muted-foreground line-through cursor-not-allowed"
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Sélectionnez une date pour voir les créneaux disponibles</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Récapitulatif et bouton paiement */}
            {canProceed && (
              <Card className="mt-6 border-2 border-accent bg-accent/5">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="font-serif font-bold text-lg mb-2">
                        Votre rendez-vous
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <Badge variant="outline" className="bg-white">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatFullDate(selectedDate)}
                        </Badge>
                        <Badge variant="outline" className="bg-white">
                          <Clock className="w-3 h-3 mr-1" />
                          {selectedTime}
                        </Badge>
                        <Badge variant="outline" className="bg-white">
                          {consultationType === "visio" ? (
                            <><Video className="w-3 h-3 mr-1" /> Visio</>
                          ) : (
                            <><Phone className="w-3 h-3 mr-1" /> Téléphone</>
                          )}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-2xl font-serif font-bold text-primary">
                        90€ <span className="text-sm font-normal text-muted-foreground">TTC</span>
                      </p>
                      <Link href={`/rendez-vous/paiement?date=${selectedDate.toISOString()}&time=${selectedTime}&type=${consultationType}`}>
                        <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                          <CreditCard className="w-5 h-5 mr-2" />
                          Confirmer et payer
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Info paiement */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            🔒 Paiement sécurisé par carte bancaire • Confirmation immédiate par email
          </p>
        </div>
      </main>
    </div>
  );
}

