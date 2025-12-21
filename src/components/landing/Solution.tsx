import { Badge } from "@/components/ui/badge";
import { Scale, Zap, Users, FileCheck, ArrowRight } from "lucide-react";

export function Solution() {
  const advantages = [
    {
      icon: Scale,
      title: "Expertise juridique",
      description: "Nathanaël Majster, ancien magistrat ayant travaillé au sein de l'état-major d'une grande banque, connaît bien l'adversaire et le terrain judiciaire. Il s'est entouré d'une équipe à votre service.",
    },
    {
      icon: Zap,
      title: "Process automatisé",
      description: "Classification de pièces par IA, génération de documents juridiques automatisée. Réduction de 40% des coûts.",
    },
    {
      icon: Users,
      title: "Accompagnement humain",
      description: "Un interlocuteur dédié tout au long de votre procédure. Suivi transparent via votre espace client.",
    },
    {
      icon: FileCheck,
      title: "Tous les dossiers",
      description: "Nous prenons tous les dossiers quel que soit le préjudice. On fonce car vous méritez d'être remboursés.",
    },
  ];

  return (
    <section id="solution" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Texte */}
          <div>
            <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
              Notre solution
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
              Rétablir le{" "}
              <span className="text-gradient">rapport de force</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Un préjudice de 7 000€ ne valait pas une action en justice. Les banques le savaient 
              et en profitaient. <strong>Notre technologie a changé l&apos;équation</strong> : nous défendons 
              tous les dossiers, quel que soit le montant. Ça, les banques ne vont pas aimer.
            </p>

            {/* Liste d'avantages */}
            <ul className="space-y-4 mb-8">
              {[
                "Recueil des éléments d'information",
                "Importation des pièces et des preuves",
                "Discussion sur la marche à suivre",
                "Application du plan d'attaque",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ArrowRight className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <a 
              href="#tarifs" 
              className="inline-flex items-center text-primary font-semibold hover:text-accent transition-colors group"
            >
              Voir nos tarifs
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Cartes avantages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {advantages.map((advantage, index) => (
              <div
                key={advantage.title}
                className="bg-muted/50 rounded-2xl p-6 border border-border hover:border-accent/30 hover:shadow-elegant transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
                  <advantage.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                  {advantage.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

