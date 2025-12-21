"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Toujours visible en haut de page
      if (currentScrollY < 100) {
        setIsVisible(true);
      } 
      // Scroll vers le bas -> cacher
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsMenuOpen(false); // Fermer le menu mobile si ouvert
      } 
      // Scroll vers le haut -> montrer
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { href: "#probleme", label: "Le Problème" },
    { href: "#solution", label: "Notre Solution" },
    { href: "#processus", label: "Comment ça marche" },
    { href: "#tarifs", label: "Tarifs" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-36 lg:h-44">
          {/* Logo */}
          <a href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="Défense des Épargnants"
              width={400}
              height={160}
              className="h-32 lg:h-40 w-auto drop-shadow-md"
              priority
            />
          </a>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Se connecter
            </Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              Prendre RDV
            </Button>
          </div>

          {/* Menu mobile toggle */}
          <button
            className="lg:hidden p-2 text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4 px-4">
                <Button variant="outline" size="sm" className="w-full">
                  Se connecter
                </Button>
                <Button size="sm" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  Prendre RDV
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
