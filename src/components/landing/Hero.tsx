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

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-32">
        {/* Contenu textuel - pleine largeur */}
        <div className="text-center">
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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white leading-tight mb-6">
            Victime de fraude bancaire ?{" "}
            <span className="text-accent block mt-2">Votre banque refuse de rembourser ?</span>
          </h1>

          {/* Sous-titre */}
          <p className="text-2xl text-white/80 mb-4">
            <strong className="text-white">Nous les assignons.</strong>
          </p>
          
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
            Cabinet d&apos;avocat spécialisé dans la défense des victimes de fraudes au faux conseiller. 
            Tarifs maîtrisés grâce à notre process optimisé.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-primary font-bold text-lg px-8 py-6"
              >
                <a href="/rendez-vous">
                  Prendre rendez-vous
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
            <span className="text-white/50 text-sm font-light">
              Entretien préliminaire : 90€
            </span>
          </div>

          {/* Stats rapides */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto">
            <div className="text-center">
              <p className="text-4xl font-serif font-bold text-accent">85%</p>
              <p className="text-sm text-white/70">Taux de succès</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-serif font-bold text-accent">-40%</p>
              <p className="text-sm text-white/70">Coûts réduits</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-serif font-bold text-accent">500+</p>
              <p className="text-sm text-white/70">Dossiers traités</p>
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
