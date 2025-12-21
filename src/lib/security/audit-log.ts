/**
 * Système d'audit log pour tracer les actions sensibles
 * Stocké dans Supabase pour une traçabilité complète
 */

import { createClient } from "@/lib/supabase/client";

export type AuditAction =
  | "login"
  | "logout"
  | "login_failed"
  | "password_change"
  | "2fa_enabled"
  | "2fa_disabled"
  | "document_upload"
  | "document_download"
  | "document_delete"
  | "profile_update"
  | "convention_signed"
  | "dossier_created"
  | "dossier_updated";

export interface AuditLogEntry {
  user_id: string;
  action: AuditAction;
  ip_address?: string;
  user_agent?: string;
  details?: Record<string, unknown>;
  created_at?: string;
}

/**
 * Enregistre une action dans le journal d'audit
 */
export async function logAuditEvent(
  action: AuditAction,
  userId: string,
  details?: Record<string, unknown>
): Promise<void> {
  try {
    const supabase = createClient();
    if (!supabase) return;

    // Récupérer les infos du navigateur
    const userAgent = typeof window !== "undefined" ? navigator.userAgent : "server";

    await supabase.from("audit_logs").insert({
      user_id: userId,
      action,
      user_agent: userAgent,
      details: details || {},
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    // Log silencieux en cas d'erreur pour ne pas bloquer l'utilisateur
    console.error("Audit log error:", error);
  }
}

/**
 * Récupère l'historique des connexions d'un utilisateur
 */
export async function getLoginHistory(userId: string, limit = 10) {
  const supabase = createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("user_id", userId)
    .in("action", ["login", "login_failed", "logout"])
    .order("created_at", { ascending: false })
    .limit(limit);

  return data || [];
}

/**
 * Vérifie si un utilisateur a eu des tentatives de connexion suspectes
 */
export async function checkSuspiciousActivity(userId: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  // Vérifier les tentatives échouées dans les dernières 15 minutes
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

  const { data, count } = await supabase
    .from("audit_logs")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .eq("action", "login_failed")
    .gte("created_at", fifteenMinutesAgo);

  // Plus de 5 tentatives = suspect
  return (count || 0) >= 5;
}

