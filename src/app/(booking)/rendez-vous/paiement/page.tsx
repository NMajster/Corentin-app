"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import {
  ChevronLeft,
  Clock,
  Calendar,
  Video,
  Phone,
  CreditCard,
  Lock,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  PhoneIcon,
} from "lucide-react";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const dateParam = searchParams.get("date");
  const timeParam = searchParams.get("time");
  const typeParam = searchParams.get("type") as "visio" | "telephone" | null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  // Vérifier que les params sont présents
  useEffect(() => {
    if (!dateParam || !timeParam || !typeParam) {
      router.push("/rendez-vous");
    }
  }, [dateParam, timeParam, typeParam, router]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const name = e.target.name;

    // Formatage automatique du numéro de carte
    if (name === "cardNumber") {
      value = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
      if (value.length > 19) return;
    }

    // Formatage automatique de la date d'expiration
    if (name === "expiry") {
      value = value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }

    // CVC max 3 chiffres
    if (name === "cvc") {
      value = value.replace(/\D/g, "");
      if (value.length > 3) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation basique
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    if (!formData.cardNumber || !formData.expiry || !formData.cvc) {
      setError("Veuillez remplir les informations de paiement");
      setLoading(false);
      return;
    }

    try {
      // Simuler le paiement (en prod: appel Stripe)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Rediriger vers la page de confirmation
      router.push(
        `/rendez-vous/confirmation?date=${dateParam}&time=${timeParam}&type=${typeParam}&email=${formData.email}`
      );
    } catch {
      setError("Erreur lors du paiement. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

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
            <Link href="/rendez-vous">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Modifier le créneau
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Créneau</span>
          </div>
          <div className="w-12 h-0.5 bg-primary" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              2
            </div>
            <span className="text-sm font-medium">Paiement</span>
          </div>
          <div className="w-12 h-0.5 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
              3
            </div>
            <span className="text-sm text-muted-foreground">Confirmation</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Vos informations</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Infos personnelles */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Jean"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Dupont"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="jean.dupont@email.fr"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="06 12 34 56 78"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Paiement */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Paiement sécurisé
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Numéro de carte</Label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            placeholder="1234 5678 9012 3456"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Date d&apos;expiration</Label>
                          <Input
                            id="expiry"
                            name="expiry"
                            value={formData.expiry}
                            onChange={handleChange}
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            name="cvc"
                            value={formData.cvc}
                            onChange={handleChange}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Erreur */}
                  {error && (
                    <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  {/* Bouton paiement */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        Paiement en cours...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Payer 90€ et confirmer
                      </span>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    🔒 Vos données bancaires sont sécurisées et chiffrées
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium capitalize">{formatFullDate(selectedDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Heure</p>
                      <p className="font-medium">{timeParam} (45 min)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {typeParam === "visio" ? (
                      <Video className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Phone className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium">
                        {typeParam === "visio" ? "Visioconférence" : "Téléphone"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Consultation initiale</span>
                  <span className="font-semibold">90€</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold">Total TTC</span>
                  <span className="font-serif font-bold text-primary">90€</span>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Inclus :</p>
                  <ul className="space-y-1">
                    <li>✓ Analyse de votre situation</li>
                    <li>✓ Évaluation des chances de succès</li>
                    <li>✓ Conseils personnalisés</li>
                    <li>✓ Devis si suite donnée</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

