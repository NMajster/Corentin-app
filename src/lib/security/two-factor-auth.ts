/**
 * Gestion de l'authentification à deux facteurs (2FA)
 * Utilise le TOTP natif de Supabase
 */

import { createClient } from "@/lib/supabase/client";

export interface TwoFactorStatus {
  isEnabled: boolean;
  factors: Array<{
    id: string;
    friendly_name: string;
    factor_type: string;
    status: string;
  }>;
}

/**
 * Vérifie si le 2FA est activé pour l'utilisateur actuel
 */
export async function check2FAStatus(): Promise<TwoFactorStatus> {
  const supabase = createClient();
  if (!supabase) {
    return { isEnabled: false, factors: [] };
  }

  try {
    const { data, error } = await supabase.auth.mfa.listFactors();

    if (error) {
      console.error("Error checking 2FA status:", error);
      return { isEnabled: false, factors: [] };
    }

    const verifiedFactors = data.totp.filter((f) => f.status === "verified");

    return {
      isEnabled: verifiedFactors.length > 0,
      factors: data.totp,
    };
  } catch {
    return { isEnabled: false, factors: [] };
  }
}

/**
 * Démarre l'inscription au 2FA
 * Retourne le QR code et le secret à afficher
 */
export async function enroll2FA(): Promise<{
  success: boolean;
  qrCode?: string;
  secret?: string;
  factorId?: string;
  error?: string;
}> {
  const supabase = createClient();
  if (!supabase) {
    return { success: false, error: "Supabase non configuré" };
  }

  try {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Application Authenticator",
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
      factorId: data.id,
    };
  } catch (e) {
    return { success: false, error: "Erreur lors de l'activation du 2FA" };
  }
}

/**
 * Vérifie le code TOTP et finalise l'inscription
 */
export async function verify2FAEnrollment(
  factorId: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  if (!supabase) {
    return { success: false, error: "Supabase non configuré" };
  }

  try {
    // Créer un challenge
    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId });

    if (challengeError) {
      return { success: false, error: challengeError.message };
    }

    // Vérifier le code
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code,
    });

    if (verifyError) {
      return { success: false, error: "Code invalide. Veuillez réessayer." };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Erreur de vérification" };
  }
}

/**
 * Vérifie le code 2FA lors de la connexion
 */
export async function verify2FALogin(
  factorId: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  if (!supabase) {
    return { success: false, error: "Supabase non configuré" };
  }

  try {
    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId });

    if (challengeError) {
      return { success: false, error: challengeError.message };
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code,
    });

    if (verifyError) {
      return { success: false, error: "Code invalide" };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Erreur de vérification" };
  }
}

/**
 * Désactive le 2FA pour un facteur donné
 */
export async function disable2FA(
  factorId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  if (!supabase) {
    return { success: false, error: "Supabase non configuré" };
  }

  try {
    const { error } = await supabase.auth.mfa.unenroll({ factorId });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Erreur lors de la désactivation" };
  }
}

