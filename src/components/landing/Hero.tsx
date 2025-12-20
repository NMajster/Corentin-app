import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Clock, TrendingUp } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background avec gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90">
        {/* Pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/50" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenu textuel */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="animate-fade-in">
              <Badge 
                variant="outline" 
                className="mb-6 border-accent/50 bg-accent/10 text-white px-4 py-1.5 text-sm"
              >
                <Shield className="w-4 h-4 mr-2" />
                Cabinet spécialisé contentieux bancaire
              </Badge>
            </div>

            {/* Titre principal */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6">
              Victime de fraude bancaire ?{" "}
              <span className="text-accent">Votre banque refuse de rembourser ?</span>
            </h1>

            {/* Sous-titre */}
            <p className="text-xl text-white/80 mb-4 max-w-xl mx-auto lg:mx-0">
              <strong className="text-white">Nous les assignons.</strong>
            </p>
            
            <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto lg:mx-0">
              Cabinet d&apos;avocat spécialisé dans la défense des victimes de fraudes au faux conseiller. 
              Tarifs maîtrisés grâce à notre process optimisé.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-primary font-bold text-lg px-8 py-6"
              >
                <a href="/rendez-vous">
                  Prendre RDV (90€)
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold text-lg px-8 py-6"
              >
                <a href="#processus">Comment ça marche ?</a>
              </Button>
            </div>

            {/* Stats rapides */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="text-3xl font-serif font-bold text-accent">85%</p>
                <p className="text-sm text-white/70">Taux de succès</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-serif font-bold text-accent">-40%</p>
                <p className="text-sm text-white/70">Coûts réduits</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-serif font-bold text-accent">500+</p>
                <p className="text-sm text-white/70">Dossiers traités</p>
              </div>
            </div>
          </div>

          {/* Bloc visuel - Les 3 piliers */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Carte principale */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-xl font-serif font-bold text-white mb-6">
                  Nos 3 piliers
                </h3>
                
                <div className="space-y-6">
                  {/* Expertise */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="p-3 rounded-lg bg-accent/20">
                      <Shield className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Expertise</h4>
                      <p className="text-sm text-white/70">
                        Ancien magistrat, spécialiste du contentieux bancaire
                      </p>
                    </div>
                  </div>

                  {/* Efficacité */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="p-3 rounded-lg bg-accent/20">
                      <Clock className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Efficacité</h4>
                      <p className="text-sm text-white/70">
                        Process automatisé = coûts réduits de 40%
                      </p>
                    </div>
                  </div>

                  {/* Combativité */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="p-3 rounded-lg bg-accent/20">
                      <TrendingUp className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Combativité</h4>
                      <p className="text-sm text-white/70">
                        85% de succès sur les dossiers acceptés
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Élément décoratif */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
