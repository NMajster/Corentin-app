"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { Mail, Lock, User, Phone, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { validatePassword } from "@/lib/security/password-policy";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation du mot de passe
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError("Le mot de passe ne respecte pas les exigences de sécurité");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      
      // Mode démo si Supabase n'est pas configuré
      if (!supabase) {
        setSuccess(true);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setError("Cet email est déjà utilisé");
        } else {
          setError(error.message);
        }
        return;
      }

      setSuccess(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="animate-fade-in text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
          Vérifiez votre email
        </h1>
        <p className="text-muted-foreground mb-6">
          Nous avons envoyé un lien de confirmation à <strong>{formData.email}</strong>.
          Cliquez sur ce lien pour activer votre compte.
        </p>
        <Button
          onClick={() => router.push("/login")}
          variant="outline"
          className="w-full"
        >
          Retour à la connexion
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Logo mobile */}
      <div className="lg:hidden flex justify-center mb-8">
        <Image
          src="/logo.png"
          alt="Défense des Épargnants"
          width={180}
          height={72}
          className="h-16 w-auto"
        />
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Créer un compte
        </h1>
        <p className="text-muted-foreground">
          Commencez la procédure de remboursement
        </p>
      </div>

      {/* Erreur */}
      {error && (
        <div className="flex items-center gap-3 p-4 mb-6 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSignup} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Jean"
                value={formData.firstName}
                onChange={handleChange}
                className="pl-11"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Dupont"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Adresse email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="vous@exemple.fr"
              value={formData.email}
              onChange={handleChange}
              className="pl-11"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="06 12 34 56 78"
              value={formData.phone}
              onChange={handleChange}
              className="pl-11"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              className="pl-11"
              required
              minLength={12}
            />
          </div>
          <PasswordStrengthIndicator password={formData.password} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="pl-11"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Création...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Créer mon compte
              <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          En créant un compte, vous acceptez nos{" "}
          <Link href="#" className="text-primary hover:underline">
            CGV
          </Link>{" "}
          et notre{" "}
          <Link href="#" className="text-primary hover:underline">
            politique de confidentialité
          </Link>
          .
        </p>
      </form>

      {/* Lien connexion */}
      <p className="text-center mt-8 text-muted-foreground">
        Déjà un compte ?{" "}
        <Link
          href="/login"
          className="text-primary font-semibold hover:text-accent transition-colors"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}

