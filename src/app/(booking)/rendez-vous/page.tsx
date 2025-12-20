"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  ChevronLeft,
  Clock,
  Euro,
  Video,
  Phone,
  CreditCard,
  Lock,
  CheckCircle,
  User,
  Mail,
  PhoneIcon,
  Shield,
  Calendar,
} from "lucide-react";

export default function BookingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!formData.prenom || !formData.nom || !formData.email || !formData.telephone) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    try {
      // Appel à l'API Stripe Checkout
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          prenom: formData.prenom,
          nom: formData.nom,
          telephone: formData.telephone,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirection vers Stripe Checkout
        window.location.href = data.url;
      } else {
        setError(data.error || "Erreur lors de la création du paiement");
      }
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
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
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Retour au site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Titre */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Prendre rendez-vous
          </h1>
          <p className="text-muted-foreground">
            Entretien initial de 45 minutes avec Me. Nathanaël MAJSTER
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              1
            </div>
            <span className="text-sm font-medium">Vos informations</span>
          </div>
          <div className="w-12 h-0.5 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
              2
            </div>
            <span className="text-sm text-muted-foreground">Paiement</span>
          </div>
          <div className="w-12 h-0.5 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
              3
            </div>
            <span className="text-sm text-muted-foreground">Calendrier</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Vos coordonnées</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Infos personnelles */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="prenom"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleChange}
                          placeholder="Jean"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom</Label>
                      <Input
                        id="nom"
                        name="nom"
                        value={formData.nom}
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
                    <Label htmlFor="telephone">Téléphone</Label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="telephone"
                        name="telephone"
                        type="tel"
                        value={formData.telephone}
                        onChange={handleChange}
                        placeholder="06 12 34 56 78"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Erreur */}
                  {error && (
                    <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                      <Shield className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  {/* Bouton paiement */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-14 text-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        Redirection vers le paiement...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Continuer vers le paiement – 90€
                      </span>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    Paiement sécurisé par Stripe
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Consultation initiale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span>45 minutes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-muted-foreground" />
                  <span>Visioconférence ou téléphone</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span>Créneau au choix après paiement</span>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Total TTC</span>
                    <span className="font-serif font-bold text-primary text-2xl">90€</span>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-2">Ce qui est inclus :</p>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Analyse de votre situation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Évaluation des chances de succès
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Conseils personnalisés
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Devis détaillé si suite donnée
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-center">
                    <strong className="text-primary">Avocat et ancien magistrat</strong>
                    <br />
                    <span className="text-muted-foreground">Spécialiste en fraude bancaire</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info sécurité */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            🔒 Vos données sont protégées • Paiement sécurisé par Stripe • Confirmation immédiate
          </p>
        </div>
      </main>
    </div>
  );
}
