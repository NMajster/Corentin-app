import { Check, Zap, Scale, Users, FileText, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SolutionSection() {
  const advantages = [
    {
      icon: Scale,
      title: "Expertise juridique pointue",
      description: "Ancien magistrat spécialisé dans le contentieux bancaire, maîtrisant parfaitement le Code monétaire et financier.",
    },
    {
      icon: Bot,
      title: "Process automatisé",
      description: "Classification automatique des pièces, génération de documents juridiques : nous réduisons les coûts de 40%.",
    },
    {
      icon: FileText,
      title: "Documentation complète",
      description: "Base de jurisprudence exhaustive, modèles d'assignation éprouvés, argumentaires juridiques solides.",
    },
    {
      icon: Users,
      title: "Accompagnement personnalisé",
      description: "Suivi de votre dossier en temps réel via votre espace client dédié. Transparence totale.",
    },
  ];

  const included = [
    "Analyse gratuite de votre dossier",
    "Rédaction de la mise en demeure",
    "Assignation devant le tribunal si nécessaire",
    "Suivi de procédure jusqu'au jugement",
    "Espace client dédié 24/7",
    "Échanges sécurisés avec le cabinet",
  ];

  return (
    <section id="solution" className="py-24 bg-gradient-to-b from-primary/5 to-background relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Notre solution</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            Rétablir le rapport de force{" "}
            <span className="text-primary">face aux banques</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Grâce à notre expertise juridique combinée à l&apos;automatisation intelligente, 
            nous rendons la justice accessible à tous les épargnants floués.
          </p>
        </div>

        {/* Grille des avantages */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {advantages.map((advantage, index) => (
            <div
              key={advantage.title}
              className="bg-card rounded-2xl p-8 shadow-elegant hover:shadow-elegant-lg transition-all duration-300 border border-border/50 hover:border-accent/30 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-xl bg-primary/10 group-hover:bg-accent/20 transition-colors">
                  <advantage.icon className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                    {advantage.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bloc "Ce qui est inclus" */}
        <div className="bg-card rounded-3xl p-8 md:p-12 shadow-elegant-lg border border-border/50">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Liste */}
            <div>
              <h3 className="text-2xl font-serif font-bold text-foreground mb-6">
                Ce qui est inclus dans notre accompagnement
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {included.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                      <Check className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-hero rounded-2xl p-8 text-center">
              <div className="mb-6">
                <p className="text-white/70 text-sm mb-2">Premier entretien</p>
                <p className="text-4xl font-serif font-bold text-white mb-1">Gratuit</p>
                <p className="text-white/70 text-sm">Sans engagement</p>
              </div>
              
              <Button
                asChild
                size="lg"
                className="w-full bg-accent hover:bg-accent/90 text-primary font-bold text-lg py-6"
              >
                <a href="#contact">
                  Analyser mon dossier gratuitement
                </a>
              </Button>
              
              <p className="text-white/60 text-xs mt-4">
                Réponse sous 48h ouvrées
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

