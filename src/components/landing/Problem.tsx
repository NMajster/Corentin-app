import { AlertTriangle } from "lucide-react";
import Image from "next/image";

export function Problem() {
  const tactics = [
    {
      image: "/deny.png",
      title: "DENY",
      subtitle: "Nier",
      description: "La banque refuse systématiquement le remboursement, invoquant votre \"négligence grave\".",
    },
    {
      image: "/delay.png",
      title: "DELAY",
      subtitle: "Retarder",
      description: "Faire semblant de négocier, proposer des indemnisations dérisoires, retarder les réponses pour vous lasser.",
    },
    {
      image: "/defend.png",
      title: "DEFEND",
      subtitle: "Défendre",
      description: "Armée d'avocats spécialisés pour décourager les clients de poursuivre.",
    },
  ];

  return (
    <section id="probleme" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full mb-6">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-semibold">Le problème</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            Face aux banques, vous êtes{" "}
            <span className="text-destructive">seul et démuni</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Les grandes institutions financières utilisent une stratégie bien rodée pour ne jamais vous rembourser : 
            la technique <strong>&quot;Deny, Delay, Defend&quot;</strong>.
          </p>
        </div>

        {/* Tactiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto mb-12">
          {tactics.map((tactic, index) => (
            <div 
              key={tactic.title} 
              className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-elegant"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image complète, réduite proportionnellement */}
              <div className="relative bg-white">
                <Image
                  src={tactic.image}
                  alt={tactic.title}
                  width={280}
                  height={350}
                  className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              
              {/* Description */}
              <div className="px-4 py-2 text-center bg-card">
                <p className="text-sm text-foreground leading-relaxed">
                  {tactic.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats alarmantes */}
        <div className="bg-primary/5 rounded-2xl p-8 lg:p-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl lg:text-5xl font-serif font-bold text-destructive mb-2">70%</p>
              <p className="text-muted-foreground">des victimes abandonnent leur demande de remboursement</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-serif font-bold text-primary mb-2">18 mois</p>
              <p className="text-muted-foreground">durée moyenne d&apos;une procédure sans accompagnement</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-serif font-bold text-accent mb-2">5 000€</p>
              <p className="text-muted-foreground">préjudice moyen des victimes de faux conseiller</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

