"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail, MapPin, CheckCircle, Loader2 } from "lucide-react";

export function CTASection() {
  const [formState, setFormState] = useState<"idle" | "loading" | "success">("idle");
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    montant: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");
    
    // Simulation d'envoi (à remplacer par l'intégration Supabase)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setFormState("success");
    setFormData({ nom: "", email: "", telephone: "", montant: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Pattern de fond */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Cercles décoratifs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Colonne texte */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">
              Prêt à récupérer votre argent ?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Ne laissez plus votre banque vous spolier. Prenez rendez-vous dès maintenant 
              pour une analyse gratuite de votre dossier.
            </p>

            {/* Points de réassurance */}
            <div className="space-y-4 mb-8">
              {[
                "Analyse gratuite sous 48h",
                "Aucun frais si vous ne gagnez pas",
                "85% de taux de succès",
              ].map((point) => (
                <div key={point} className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-white/90">{point}</span>
                </div>
              ))}
            </div>

            {/* Coordonnées */}
            <div className="space-y-4 pt-8 border-t border-white/10">
              <div className="flex items-center gap-4 justify-center lg:justify-start">
                <div className="p-3 rounded-lg bg-white/10">
                  <Phone className="h-5 w-5 text-accent" />
                </div>
                <div className="text-left">
                  <p className="text-white/60 text-sm">Téléphone</p>
                  <p className="text-white font-medium">01 XX XX XX XX</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-center lg:justify-start">
                <div className="p-3 rounded-lg bg-white/10">
                  <Mail className="h-5 w-5 text-accent" />
                </div>
                <div className="text-left">
                  <p className="text-white/60 text-sm">Email</p>
                  <p className="text-white font-medium">contact@defense-epargnants.fr</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-center lg:justify-start">
                <div className="p-3 rounded-lg bg-white/10">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div className="text-left">
                  <p className="text-white/60 text-sm">Adresse</p>
                  <p className="text-white font-medium">Barreau de Paris</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            {formState === "success" ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
                  Demande envoyée !
                </h3>
                <p className="text-muted-foreground mb-6">
                  Nous analysons votre dossier et vous recontactons sous 48h ouvrées.
                </p>
                <Button
                  onClick={() => setFormState("idle")}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Envoyer une autre demande
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
                  Demandez votre analyse gratuite
                </h3>
                <p className="text-muted-foreground mb-6">
                  Remplissez ce formulaire, nous vous recontactons sous 48h.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-foreground mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="nom"
                      required
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                      placeholder="Jean Dupont"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        placeholder="jean@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="telephone" className="block text-sm font-medium text-foreground mb-1">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        id="telephone"
                        required
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        placeholder="06 XX XX XX XX"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="montant" className="block text-sm font-medium text-foreground mb-1">
                      Montant approximatif du préjudice *
                    </label>
                    <select
                      id="montant"
                      required
                      value={formData.montant}
                      onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="moins-5000">Moins de 5 000 €</option>
                      <option value="5000-15000">Entre 5 000 € et 15 000 €</option>
                      <option value="15000-50000">Entre 15 000 € et 50 000 €</option>
                      <option value="plus-50000">Plus de 50 000 €</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                      Décrivez brièvement votre situation
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                      placeholder="Expliquez ce qui s'est passé..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={formState === "loading"}
                    className="w-full bg-accent hover:bg-accent/90 text-primary font-bold text-lg py-6"
                  >
                    {formState === "loading" ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Envoyer ma demande
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    En soumettant ce formulaire, vous acceptez d&apos;être recontacté par notre cabinet. 
                    Vos données sont protégées et ne seront jamais partagées.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

