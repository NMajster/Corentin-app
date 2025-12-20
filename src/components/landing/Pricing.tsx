import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, ArrowRight, Info } from "lucide-react";

export function Pricing() {
  const plans = [
    {
      name: "Consultation initiale",
      price: "90€",
      priceDetail: "TTC",
      description: "Premier entretien pour évaluer votre dossier",
      features: [
        "Entretien de 45 minutes",
        "Analyse complète de votre situation",
        "Estimation des chances de succès",
        "Conseils personnalisés",
        "Devis détaillé si suite donnée",
      ],
      cta: "Prendre RDV",
      popular: false,
    },
    {
      name: "Accompagnement Complet",
      price: "990€",
      priceDetail: "+ honoraires de résultat",
      description: "Prise en charge complète de votre dossier",
      features: [
        "Entretien approfondi (1h)",
        "Constitution complète du dossier",
        "Rédaction mise en demeure",
        "Assignation si nécessaire",
        "Suivi via espace client",
        "Représentation au tribunal",
        "Pas de frais si échec*",
      ],
      cta: "Démarrer mon dossier",
      popular: true,
    },
    {
      name: "Conseil Ponctuel",
      price: "150€",
      priceDetail: "/ heure",
      description: "Consultation pour des questions précises",
      features: [
        "Consultation juridique",
        "Analyse de documents",
        "Conseils stratégiques",
        "Compte-rendu écrit",
      ],
      cta: "Réserver une consultation",
      popular: false,
    },
  ];

  return (
    <section id="tarifs" className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
            Tarification transparente
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            Des tarifs <span className="text-accent">maîtrisés</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Notre process automatisé nous permet de réduire nos coûts de 40% par rapport à un cabinet traditionnel.
            Nous répercutons cette économie sur nos honoraires.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative border-2 transition-all duration-300 hover:shadow-elegant-lg ${
                plan.popular 
                  ? "border-accent shadow-elegant-lg scale-105 z-10" 
                  : "border-border hover:border-primary/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-accent text-primary font-semibold px-4 py-1">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    Le plus populaire
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pt-8 pb-4">
                <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className="text-4xl font-serif font-bold text-primary">
                    {plan.price}
                  </span>
                  {plan.priceDetail && (
                    <span className="text-sm text-muted-foreground ml-1">
                      {plan.priceDetail}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? "bg-accent hover:bg-accent/90 text-accent-foreground" 
                      : "bg-primary hover:bg-primary/90"
                  }`}
                  size="lg"
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Note honoraires de résultat */}
        <div className="max-w-2xl mx-auto bg-muted/50 rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                * Honoraires de résultat
              </h4>
              <p className="text-sm text-muted-foreground">
                En plus des frais fixes, nous appliquons un honoraire de résultat de <strong>15%</strong> uniquement 
                en cas de succès (remboursement obtenu). Si votre dossier n&apos;aboutit pas, vous ne payez que les 
                frais fixes. C&apos;est notre engagement de confiance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

