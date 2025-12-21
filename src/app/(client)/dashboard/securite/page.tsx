"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Key,
  Smartphone,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  History,
  Loader2,
} from "lucide-react";
import { TwoFactorSetup } from "@/components/auth/TwoFactorSetup";
import { getLoginHistory } from "@/lib/security/audit-log";
import { createClient } from "@/lib/supabase/client";

interface LoginEvent {
  id: string;
  action: string;
  user_agent: string;
  created_at: string;
  details?: Record<string, unknown>;
}

export default function SecurityPage() {
  const [loginHistory, setLoginHistory] = useState<LoginEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const history = await getLoginHistory(user.id);
        setLoginHistory(history);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const parseUserAgent = (ua: string) => {
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    return "Navigateur inconnu";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Sécurité du compte
        </h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de sécurité de votre compte
        </p>
      </div>

      {/* Alerte de sécurité */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">
                Protection de vos données juridiques
              </p>
              <p className="text-sm text-muted-foreground">
                Votre dossier contient des informations sensibles. Nous vous
                recommandons d&apos;activer l&apos;authentification à deux facteurs pour
                une protection maximale.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2FA */}
        <TwoFactorSetup />

        {/* Mot de passe */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Key className="w-5 h-5 text-primary" />
              Mot de passe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-sm text-emerald-700">
                Mot de passe conforme aux exigences de sécurité
              </span>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium">Exigences :</p>
              <ul className="list-disc list-inside space-y-0.5 text-xs">
                <li>Minimum 12 caractères</li>
                <li>Au moins une majuscule et une minuscule</li>
                <li>Au moins un chiffre</li>
                <li>Au moins un caractère spécial</li>
              </ul>
            </div>

            <Button variant="outline" className="w-full">
              Changer mon mot de passe
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sessions actives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Smartphone className="w-5 h-5 text-primary" />
            Sessions actives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Session actuelle</p>
                  <p className="text-sm text-muted-foreground">
                    Ce navigateur - France
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            💡 Vos sessions expirent automatiquement après 30 minutes d&apos;inactivité.
          </p>
        </CardContent>
      </Card>

      {/* Historique des connexions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <History className="w-5 h-5 text-primary" />
            Historique des connexions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : loginHistory.length > 0 ? (
            <div className="space-y-3">
              {loginHistory.map((event) => (
                <div
                  key={event.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    event.action === "login_failed"
                      ? "bg-red-50 border border-red-100"
                      : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {event.action === "login_failed" ? (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    ) : event.action === "logout" ? (
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {event.action === "login"
                          ? "Connexion réussie"
                          : event.action === "logout"
                          ? "Déconnexion"
                          : "Tentative échouée"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {parseUserAgent(event.user_agent)} • {formatDate(event.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <History className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>Aucun historique de connexion disponible</p>
              <p className="text-xs mt-1">
                L&apos;historique sera enregistré lors de vos prochaines connexions
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conseils de sécurité */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">
                Conseils de sécurité
              </h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Ne partagez jamais votre mot de passe</li>
                <li>• Activez l&apos;authentification à deux facteurs</li>
                <li>• Déconnectez-vous après chaque session sur un ordinateur partagé</li>
                <li>• Signalez immédiatement toute activité suspecte</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

