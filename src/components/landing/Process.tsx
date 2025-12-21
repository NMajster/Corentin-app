import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  FileText, 
  Send, 
  Gavel,
  ArrowDown,
  FileSignature
} from "lucide-react";

export function Process() {
  const steps = [
    {
      number: "01",
      icon: MessageSquare,
      title: "Entretien initial",
      description: "Un entretien de 45 minutes afin de recueillir les éléments essentiels du litige, vous expliquer vos chances de succès et engager la suite des actions à mener afin de préserver vos droits.",
      detail: "Ne contactez pas votre banque avant cet entretien",
    },
    {
      number: "02",
      icon: FileText,
      title: "Constitution du dossier",
      description: "Vous importez vos pièces via notre plateforme sécurisée. Notre système les classe automatiquement.",
      detail: "Espace client dédié",
    },
    {
      number: "03",
      icon: FileSignature,
      title: "Convention d'honoraires",
      description: "Grâce à nos process automatisés, nous avons réduit les coûts de traitement de 40%. Résultat : nous pouvons défendre tous les dossiers, quel que soit le montant du préjudice.",
      detail: "Transparence totale sur les coûts",
    },
    {
      number: "04",
      icon: Send,
      title: "Mise en demeure",
      description: "Nous envoyons une mise en demeure argumentée à votre banque. 40% des dossiers se résolvent à cette étape.",
      detail: "Délai de réponse : 15 jours",
    },
    {
      number: "05",
      icon: Gavel,
      title: "Assignation en Justice",
      description: "L'assignation devant le Tribunal des Affaires Économiques est l'acte de saisine du Tribunal : elle est rédigée par l'avocat et vos pièces sont annexées. La procédure est maîtrisée et vous pouvez suivre le calendrier et le compte rendu à chaque étape sur votre espace personnel.",
      detail: "Suivi en temps réel sur votre espace",
    },
  ];

  return (
    <section id="processus" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            Comment ça marche
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            5 étapes vers votre{" "}
            <span className="text-accent">remboursement</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Un processus clair et transparent, de l&apos;évaluation de votre dossier jusqu&apos;au remboursement.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Ligne de connexion */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 lg:left-1/2 top-24 bottom-0 w-0.5 bg-border lg:-translate-x-1/2 hidden sm:block">
                  <ArrowDown className="w-5 h-5 text-accent absolute -bottom-2 -left-2.5 bg-background" />
                </div>
              )}

              {/* Étape */}
              <div className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-12 mb-12 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}>
                {/* Numéro et icône */}
                <div className="flex items-center gap-4 lg:w-1/2 lg:justify-end">
                  <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="relative">
                      <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-elegant-lg">
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-primary text-sm font-bold rounded-full flex items-center justify-center">
                        {step.number}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contenu */}
                <div className={`lg:w-1/2 ${index % 2 === 1 ? "lg:text-right" : ""}`}>
                  <h3 className="text-xl lg:text-2xl font-serif font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    {step.description}
                  </p>
                  <span className="inline-flex items-center text-sm font-medium text-accent">
                    {step.detail}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#tarifs"
            className="inline-flex items-center justify-center h-14 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full transition-colors shadow-elegant"
          >
            Commencer maintenant
          </a>
        </div>
      </div>
    </section>
  );
}

