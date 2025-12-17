import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const footerLinks = {
    services: {
      title: "Services",
      links: [
        { label: "Fraude bancaire", href: "#" },
        { label: "Faux conseiller", href: "#" },
        { label: "Litiges assurance", href: "#" },
        { label: "Crédit abusif", href: "#" },
      ],
    },
    ressources: {
      title: "Ressources",
      links: [
        { label: "Blog", href: "#" },
        { label: "FAQ", href: "#faq" },
        { label: "Jurisprudence", href: "#" },
        { label: "Guides pratiques", href: "#" },
      ],
    },
    legal: {
      title: "Légal",
      links: [
        { label: "Mentions légales", href: "#" },
        { label: "Politique de confidentialité", href: "#" },
        { label: "CGV", href: "#" },
        { label: "Cookies", href: "#" },
      ],
    },
  };

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <a href="/" className="block mb-6">
              <Image
                src="/logo.png"
                alt="Défense des Épargnants"
                width={200}
                height={80}
                className="h-20 w-auto"
              />
            </a>
            <p className="text-white/70 mb-6 max-w-sm">
              Cabinet de Me. Nathanaël MAJSTER, avocat et ancien magistrat, et son équipe pluridisciplinaire. 
              Spécialisés dans la défense des victimes de fraudes bancaires.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>SIRET : 123 456 789 00001</span>
              <span>•</span>
              <span>TVA : FR12345678901</span>
            </div>
          </div>

          {/* Liens */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-serif font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      className="text-white/70 hover:text-accent transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-12 bg-white/20" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <p>
            © {new Date().getFullYear()} Défense des Épargnants. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-accent transition-colors">
              LinkedIn
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
