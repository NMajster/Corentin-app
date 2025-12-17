import { Check, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PricingSection() {
  const pricing = [
    {
      name: "Analyse Gratuite",
      description: "Évaluation de votre dossier sans engagement",
      price: "0€",
      period: "gratuit",
      featured: false,
      features: [
        "Formulaire en ligne simple",
        "Analyse de recevabilité sous 48h",
        "Entretien téléphonique de 15 min",
        "Estimation des chances de succès",
      ],
      cta: "Commencer gratuitement",
      ctaVariant: "outline" as const,
    },
    {
      name: "Accompagnement Complet",
      description: "Défense complète jusqu'au remboursement",
      price: "Sur devis",
      period: "selon préjudice",
      featured: true,
      badge: "Le plus choisi",
      features: [
        "Tout de l'offre Analyse Gratuite",
        "Constitution complète du dossier",
        "Rédaction mise en demeure",
        "Assignation si nécessaire",
        "Espace client dédié 24/7",
        "Suivi jusqu'au jugement",
        "Honoraires de résultat possibles",
      ],
      cta: "Demander un devis",
      ctaVariant: "default" as const,
    },
  ];

  return (
    <section id="tarifs" className="py-24 bg-gradient-to-b from-background to-primary/5 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
            <Star className="h-4 w-4" />
            <span className="text-sm font-medium">Tarification transparente</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            Des honoraires <span className="text-primary">adaptés à votre préjudice</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Notre process automatisé nous permet de réduire les coûts de 40% par rapport à un cabinet traditionnel. 
            Nous proposons également des honoraires de résultat pour rendre la justice accessible à tous.
          </p>
        </div>

        {/* Cartes de tarification */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricing.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 transition-all duration-300 ${
                plan.featured
                  ? "bg-gradient-hero text-white shadow-xl scale-105"
                  : "bg-card border border-border/50 shadow-elegant hover:shadow-elegant-lg"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-primary font-semibold px-4">
                  {plan.badge}
                </Badge>
              )}

              {/* En-tête du plan */}
              <div className="text-center mb-8">
                <h3 className={`text-xl font-serif font-bold mb-2 ${plan.featured ? "text-white" : "text-foreground"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-6 ${plan.featured ? "text-white/70" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
                <div className="flex items-end justify-center gap-1">
                  <span className={`text-4xl font-serif font-bold ${plan.featured ? "text-white" : "text-foreground"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-sm mb-1 ${plan.featured ? "text-white/70" : "text-muted-foreground"}`}>
                      /{plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Liste des fonctionnalités */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                      plan.featured ? "bg-accent/20" : "bg-accent/10"
                    }`}>
                      <Check className={`h-3 w-3 ${plan.featured ? "text-accent" : "text-accent"}`} />
                    </div>
                    <span className={`text-sm ${plan.featured ? "text-white/90" : "text-foreground/80"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                asChild
                size="lg"
                variant={plan.ctaVariant}
                className={`w-full font-semibold ${
                  plan.featured
                    ? "bg-accent hover:bg-accent/90 text-primary"
                    : "border-primary text-primary hover:bg-primary hover:text-white"
                }`}
              >
                <a href="#contact">{plan.cta}</a>
              </Button>
            </div>
          ))}
        </div>

        {/* Note sur les honoraires */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="flex items-start gap-4 p-6 rounded-xl bg-primary/5 border border-primary/10">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">À propos de nos honoraires</p>
              <p>
                Les honoraires sont calculés en fonction de la complexité de votre dossier et du montant du préjudice. 
                Nous proposons systématiquement une <strong>convention d&apos;honoraires de résultat</strong> : 
                vous ne payez qu&apos;en cas de succès. L&apos;entretien initial et l&apos;analyse de recevabilité sont toujours gratuits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

