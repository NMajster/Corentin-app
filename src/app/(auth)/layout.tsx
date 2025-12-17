import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Panneau gauche - Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-hero p-12 relative overflow-hidden">
        {/* Motifs décoratifs */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        
        <div className="absolute top-20 right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        {/* Logo */}
        <a href="/" className="block relative z-10">
          <Image
            src="/logo.png"
            alt="Défense des Épargnants"
            width={200}
            height={80}
            className="h-20 w-auto"
          />
        </a>

        {/* Citation */}
        <div className="relative z-10">
          <blockquote className="text-2xl font-serif text-white/90 italic mb-6">
            &ldquo;Grâce à Me. MAJSTER et son équipe, j&apos;ai obtenu le remboursement 
            de 8 500€ que ma banque refusait depuis 18 mois.&rdquo;
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
              MR
            </div>
            <div>
              <p className="text-white font-semibold">Marie R.</p>
              <p className="text-white/60 text-sm">Victime de fraude au faux conseiller</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 relative z-10">
          <div>
            <p className="text-3xl font-serif font-bold text-accent">85%</p>
            <p className="text-white/60 text-sm">Taux de succès</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-bold text-accent">500+</p>
            <p className="text-white/60 text-sm">Dossiers traités</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-bold text-accent">-40%</p>
            <p className="text-white/60 text-sm">Sur les honoraires</p>
          </div>
        </div>
      </div>

      {/* Panneau droit - Formulaire */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}

