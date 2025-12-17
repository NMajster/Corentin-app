import { AlertTriangle } from "lucide-react";
import Image from "next/image";

export function ProblemSection() {
  const problems = [
    {
      image: "/deny.png",
      title: "DENY",
      subtitle: "Nier",
      description: "La banque refuse systématiquement votre demande de remboursement, invoquant votre prétendue négligence.",
      color: "text-[#8B2635]",
    },
    {
      image: "/delay.png",
      title: "DELAY",
      subtitle: "Retarder",
      description: "Les procédures s'éternisent, les réponses tardent. L'objectif : vous décourager et dépasser les délais de prescription.",
      color: "text-amber-700",
    },
    {
      image: "/defend.png",
      title: "DEFEND",
      subtitle: "Défendre",
      description: "Face à une armée d'avocats et un budget illimité, vous vous retrouvez démuni. Le coût d'une procédure dépasse souvent l'enjeu.",
      color: "text-primary",
    },
  ];

  return (
    <section id="probleme" className="py-24 bg-background relative overflow-hidden">
      {/* Pattern de fond subtil */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive mb-6">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Le problème</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            La stratégie des banques :{" "}
            <span className="text-destructive">&quot;Deny, Delay, Defend&quot;</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Face aux victimes de fraude, les établissements bancaires utilisent une stratégie éprouvée 
            pour éviter de rembourser. Cette technique, nommée <strong>&quot;Deny, Delay, Defend&quot;</strong>, 
            vise à épuiser les plaignants financièrement et moralement.
          </p>
        </div>

        {/* Les 3 D */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {problems.map((problem, index) => (
            <div
              key={problem.title}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all duration-300 border border-border/50 hover:border-accent/30"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Numéro */}
              <div className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-lg">
                {index + 1}
              </div>

              {/* Image */}
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <Image
                  src={problem.image}
                  alt={problem.title}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Contenu */}
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-2 italic">
                  {problem.subtitle}
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Statistique choc */}
        <div className="mt-16 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center border border-primary/10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div>
              <p className="text-5xl font-serif font-bold text-destructive mb-2">67%</p>
              <p className="text-muted-foreground">
                Des victimes abandonnent<br />leurs réclamations
              </p>
            </div>
            <div className="hidden md:block w-px h-20 bg-border" />
            <div>
              <p className="text-5xl font-serif font-bold text-primary mb-2">4,2 Md€</p>
              <p className="text-muted-foreground">
                De fraudes bancaires<br />en France en 2023
              </p>
            </div>
            <div className="hidden md:block w-px h-20 bg-border" />
            <div>
              <p className="text-5xl font-serif font-bold text-accent mb-2">18 mois</p>
              <p className="text-muted-foreground">
                Durée moyenne d&apos;une<br />procédure bancaire
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

