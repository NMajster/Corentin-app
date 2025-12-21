"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  ShieldCheck,
  ShieldOff,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
} from "lucide-react";
import {
  check2FAStatus,
  enroll2FA,
  verify2FAEnrollment,
  disable2FA,
  TwoFactorStatus,
} from "@/lib/security/two-factor-auth";
import Image from "next/image";

export function TwoFactorSetup() {
  const [status, setStatus] = useState<TwoFactorStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setLoading(true);
    const result = await check2FAStatus();
    setStatus(result);
    setLoading(false);
  };

  const handleStartEnrollment = async () => {
    setEnrolling(true);
    setError(null);

    const result = await enroll2FA();

    if (result.success) {
      setQrCode(result.qrCode || null);
      setSecret(result.secret || null);
      setFactorId(result.factorId || null);
    } else {
      setError(result.error || "Erreur lors de l'activation");
    }

    setEnrolling(false);
  };

  const handleVerify = async () => {
    if (!factorId || !verificationCode) return;

    setLoading(true);
    setError(null);

    const result = await verify2FAEnrollment(factorId, verificationCode);

    if (result.success) {
      setSuccess("L'authentification à deux facteurs est maintenant activée !");
      setQrCode(null);
      setSecret(null);
      setFactorId(null);
      setVerificationCode("");
      await loadStatus();
    } else {
      setError(result.error || "Code invalide");
    }

    setLoading(false);
  };

  const handleDisable = async () => {
    if (!status?.factors[0]?.id) return;

    if (!confirm("Êtes-vous sûr de vouloir désactiver l'authentification à deux facteurs ?")) {
      return;
    }

    setLoading(true);
    const result = await disable2FA(status.factors[0].id);

    if (result.success) {
      setSuccess("L'authentification à deux facteurs a été désactivée");
      await loadStatus();
    } else {
      setError(result.error || "Erreur lors de la désactivation");
    }

    setLoading(false);
  };

  const copySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      setSuccess("Clé copiée dans le presse-papier");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  if (loading && !qrCode) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Shield className="w-5 h-5 text-primary" />
          Authentification à deux facteurs (2FA)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Messages */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Statut actuel */}
        {!qrCode && (
          <div className={`flex items-center gap-4 p-4 rounded-lg ${
            status?.isEnabled ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"
          }`}>
            {status?.isEnabled ? (
              <>
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
                <div>
                  <p className="font-medium text-emerald-800">2FA activé</p>
                  <p className="text-sm text-emerald-600">
                    Votre compte est protégé par l&apos;authentification à deux facteurs
                  </p>
                </div>
              </>
            ) : (
              <>
                <ShieldOff className="w-8 h-8 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">2FA non activé</p>
                  <p className="text-sm text-amber-600">
                    Activez le 2FA pour renforcer la sécurité de votre compte
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Processus d'activation */}
        {qrCode && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Smartphone className="w-5 h-5" />
                <span className="font-medium">
                  Scannez ce QR code avec votre application d&apos;authentification
                </span>
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <Image
                    src={qrCode}
                    alt="QR Code 2FA"
                    width={200}
                    height={200}
                    className="w-48 h-48"
                  />
                </div>
              </div>

              {/* Clé secrète */}
              {secret && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Ou entrez cette clé manuellement :
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="px-3 py-2 bg-muted rounded font-mono text-sm">
                      {secret}
                    </code>
                    <Button variant="ghost" size="sm" onClick={copySecret}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Vérification */}
            <div className="space-y-4 max-w-xs mx-auto">
              <div className="space-y-2">
                <Label htmlFor="code">
                  Entrez le code à 6 chiffres de votre application
                </Label>
                <Input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  className="text-center text-2xl tracking-widest font-mono"
                />
              </div>
              <Button
                onClick={handleVerify}
                disabled={verificationCode.length !== 6 || loading}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Vérifier et activer
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setQrCode(null);
                  setSecret(null);
                  setFactorId(null);
                  setVerificationCode("");
                }}
                className="w-full"
              >
                Annuler
              </Button>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        {!qrCode && (
          <div className="flex gap-3">
            {status?.isEnabled ? (
              <Button
                variant="outline"
                onClick={handleDisable}
                disabled={loading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <ShieldOff className="w-4 h-4 mr-2" />
                Désactiver le 2FA
              </Button>
            ) : (
              <Button onClick={handleStartEnrollment} disabled={enrolling}>
                {enrolling ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ShieldCheck className="w-4 h-4 mr-2" />
                )}
                Activer le 2FA
              </Button>
            )}
          </div>
        )}

        {/* Conseils */}
        <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
          <p className="font-medium">Applications recommandées :</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Google Authenticator</li>
            <li>Microsoft Authenticator</li>
            <li>Authy</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

