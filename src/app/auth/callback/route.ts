import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error) {
        // Créer le profil client si nécessaire
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Vérifier si le profil existe
          const { data: existingProfile } = await supabase
            .from("profils_clients")
            .select("id")
            .eq("user_id", user.id)
            .single();

          // Créer le profil s'il n'existe pas
          if (!existingProfile) {
            await supabase.from("profils_clients").insert({
              user_id: user.id,
            });
          }

          // Vérifier si un dossier existe
          const { data: existingDossier } = await supabase
            .from("dossiers")
            .select("id")
            .eq("user_id", user.id)
            .single();

          // Créer un dossier initial s'il n'existe pas
          if (!existingDossier) {
            await supabase.from("dossiers").insert({
              user_id: user.id,
              statut: "nouveau",
              type_contentieux: "fraude_bancaire",
            });
          }
        }

        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Retourner à la page d'accueil en cas d'erreur
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

