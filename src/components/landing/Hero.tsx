import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, TrendingUp, Award, CheckCircle } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-28 lg:pt-32 overflow-hidden">
      {/* Background avec gradient et motifs */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Cercles décoratifs */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge 
            variant="secondary" 
            className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm animate-fade-in"
          >
            <Award className="w-4 h-4 mr-2 text-accent" />
            Me. Nathanaël MAJSTER • Avocat & ancien magistrat
          </Badge>

          {/* Titre principal */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white leading-tight mb-6 animate-fade-in-up">
            Victime de fraude bancaire ?
            <span className="block mt-2 text-accent">
              Nous les assignons.
            </span>
          </h1>

          {/* Sous-titre */}
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8 animate-fade-in-up animation-delay-200">
            Votre banque refuse de rembourser ? Une équipe spécialisée dans la défense des victimes 
            de fraudes au faux conseiller. <span className="text-accent font-semibold">Tarifs maîtrisés</span> grâce à notre process optimisé.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up animation-delay-300">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-6 animate-pulse-accent"
            >
              Prendre RDV (90€)
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              Évaluer mon dossier
            </Button>
          </div>

          {/* Les 3 piliers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
            <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <Shield className="w-8 h-8 text-accent flex-shrink-0" />
              <div className="text-left">
                <p className="text-white font-semibold">Expertise</p>
                <p className="text-white/60 text-sm">Équipe pluridisciplinaire</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <TrendingUp className="w-8 h-8 text-accent flex-shrink-0" />
              <div className="text-left">
                <p className="text-white font-semibold">-40% de coûts</p>
                <p className="text-white/60 text-sm">Process automatisé</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <CheckCircle className="w-8 h-8 text-accent flex-shrink-0" />
              <div className="text-left">
                <p className="text-white font-semibold">85% de succès</p>
                <p className="text-white/60 text-sm">Dossiers acceptés</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="#fafaf9"
          />
        </svg>
      </div>
    </section>
  );
}

