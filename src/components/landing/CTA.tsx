import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail, Clock } from "lucide-react";

export function CTA() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-hero relative overflow-hidden">
      {/* Motifs décoratifs */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
      
      {/* Cercles décoratifs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Titre */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">
            Prêt à vous faire <span className="text-accent">rembourser</span> ?
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Prenez rendez-vous pour une consultation avec un avocat spécialisé.
            <span className="text-accent font-semibold"> 90€ TTC pour 45 minutes.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-10 py-7 animate-pulse-accent"
            >
              Prendre RDV (90€)
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 text-lg px-10 py-7"
            >
              <Phone className="mr-2 w-5 h-5" />
              01 23 45 67 89
            </Button>
          </div>

          {/* Infos de contact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-white/80">
              <Phone className="w-5 h-5 text-accent" />
              <span className="text-sm">01 23 45 67 89</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white/80">
              <Mail className="w-5 h-5 text-accent" />
              <span className="text-sm">contact@defense-epargnants.fr</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white/80">
              <Clock className="w-5 h-5 text-accent" />
              <span className="text-sm">Lun-Ven : 9h-19h</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

