import { FileSearch, Phone, FileText, Gavel, ArrowRight } from "lucide-react";

export function ProcessSection() {
  const steps = [
    {
      number: "01",
      icon: FileSearch,
      title: "Analyse de votre dossier",
      description: "Vous remplissez un formulaire simple. Nous analysons gratuitement la recevabilité de votre demande sous 48h.",
      details: ["Formulaire en ligne rapide", "Analyse juridique gratuite", "Réponse sous 48h"],
    },
    {
      number: "02",
      icon: Phone,
      title: "Entretien avec l'avocat",
      description: "Un entretien téléphonique ou visio pour comprendre votre situation et vous expliquer la stratégie envisagée.",
      details: ["Entretien de 30 minutes", "Explication de la procédure", "Estimation des chances de succès"],
    },
    {
      number: "03",
      icon: FileText,
      title: "Constitution du dossier",
      description: "Vous importez vos pièces justificatives via votre espace client sécurisé. Nous préparons la mise en demeure.",
      details: ["Espace client sécurisé", "Upload de pièces simplifié", "Mise en demeure rédigée"],
    },
    {
      number: "04",
      icon: Gavel,
      title: "Action en justice",
      description: "Si la banque refuse de coopérer, nous lançons la procédure judiciaire. Vous suivez l'avancement en temps réel.",
      details: ["Assignation devant le tribunal", "Suivi en temps réel", "Accompagnement jusqu'au jugement"],
    },
  ];

  return (
    <section id="processus" className="py-24 bg-background relative overflow-hidden">
      {/* Ligne de connexion en arrière-plan */}
      <div className="absolute left-1/2 top-48 bottom-48 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent hidden lg:block" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <ArrowRight className="h-4 w-4" />
            <span className="text-sm font-medium">Comment ça marche</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            Un processus <span className="text-accent">simple et transparent</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            De l&apos;analyse gratuite de votre dossier jusqu&apos;à l&apos;obtention de votre remboursement, 
            nous vous accompagnons à chaque étape.
          </p>
        </div>

        {/* Timeline des étapes */}
        <div className="relative">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`relative flex items-start gap-8 mb-16 last:mb-0 ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              {/* Carte de l'étape */}
              <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                <div 
                  className={`bg-card rounded-2xl p-8 shadow-elegant hover:shadow-elegant-lg transition-all duration-300 border border-border/50 hover:border-accent/30 inline-block ${
                    index % 2 === 0 ? "lg:ml-auto" : "lg:mr-auto"
                  }`}
                >
                  {/* Numéro d'étape */}
                  <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? "lg:flex-row-reverse" : ""}`}>
                    <span className="text-5xl font-serif font-bold text-accent/20">
                      {step.number}
                    </span>
                    <div className="p-3 rounded-xl bg-accent/10">
                      <step.icon className="h-6 w-6 text-accent" />
                    </div>
                  </div>

                  {/* Contenu */}
                  <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    {step.description}
                  </p>

                  {/* Détails */}
                  <ul className={`space-y-2 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                    {step.details.map((detail) => (
                      <li 
                        key={detail}
                        className={`flex items-center gap-2 text-sm text-foreground/70 ${
                          index % 2 === 0 ? "lg:flex-row-reverse" : ""
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Point central (desktop) */}
              <div className="hidden lg:flex items-start justify-center w-16 pt-8">
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-accent shadow-lg ring-4 ring-accent/20" />
                  {index < steps.length - 1 && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-accent/50 to-transparent" />
                  )}
                </div>
              </div>

              {/* Espace vide pour l'alternance */}
              <div className="flex-1 hidden lg:block" />
            </div>
          ))}
        </div>

        {/* Durée moyenne */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-full bg-primary/5 border border-primary/10">
            <div className="text-center">
              <p className="text-2xl font-serif font-bold text-primary">2 semaines</p>
              <p className="text-sm text-muted-foreground">Phase amiable</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-serif font-bold text-primary">6-12 mois</p>
              <p className="text-sm text-muted-foreground">Si procédure judiciaire</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

