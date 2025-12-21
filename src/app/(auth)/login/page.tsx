"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { Mail, Lock, ArrowRight, AlertCircle, Sparkles, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      
      // Mode démo si Supabase n'est pas configuré
      if (!supabase) {
        // Simuler une connexion réussie
        router.push("/dashboard");
        router.refresh();
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Email ou mot de passe incorrect");
        } else {
          setError(error.message);
        }
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError("Veuillez entrer votre adresse email");
      return;
    }

    setError(null);
    setMagicLinkLoading(true);

    try {
      const supabase = createClient();
      
      if (!supabase) {
        setMagicLinkSent(true);
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setMagicLinkSent(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setMagicLinkLoading(false);
    }
  };

  // Affichage après envoi du magic link
  if (magicLinkSent) {
    return (
      <div className="animate-fade-in text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
          Vérifiez votre boîte mail
        </h1>
        <p className="text-muted-foreground mb-2">
          Nous avons envoyé un lien de connexion à
        </p>
        <p className="font-semibold text-foreground mb-6">{email}</p>
        <p className="text-sm text-muted-foreground mb-6">
          Cliquez sur le lien dans l&apos;email pour vous connecter automatiquement.
          <br />
          Le lien expire dans 1 heure.
        </p>
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => setMagicLinkSent(false)}
            className="w-full"
          >
            ← Retour à la connexion
          </Button>
          <p className="text-xs text-muted-foreground">
            Vous n&apos;avez pas reçu l&apos;email ?{" "}
            <button
              onClick={handleMagicLink}
              className="text-primary hover:underline"
            >
              Renvoyer
            </button>
          </p>
        </div>
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
          Connexion
        </h1>
        <p className="text-muted-foreground">
          Accédez à votre espace client
        </p>
      </div>

      {/* Erreur */}
      {error && (
        <div className="flex items-center gap-3 p-4 mb-6 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Bouton Magic Link */}
      <div className="mb-6">
        <div className="space-y-2">
          <Label htmlFor="magic-email">Adresse email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="magic-email"
              type="email"
              placeholder="vous@exemple.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11"
            />
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full mt-3 border-primary/30 hover:bg-primary/5"
          onClick={handleMagicLink}
          disabled={magicLinkLoading}
        >
          {magicLinkLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Envoi en cours...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Recevoir un lien de connexion par email
            </span>
          )}
        </Button>
      </div>

      {/* Séparateur */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou avec mot de passe
          </span>
        </div>
      </div>

      {/* Formulaire classique */}
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:text-accent transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Connexion...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Se connecter
              <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </Button>
      </form>

      {/* Lien inscription */}
      <p className="text-center mt-8 text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link
          href="/signup"
          className="text-primary font-semibold hover:text-accent transition-colors"
        >
          Créer un compte
        </Link>
      </p>

      {/* Retour accueil */}
      <p className="text-center mt-4">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Retour à l&apos;accueil
        </Link>
      </p>
    </div>
  );
}

