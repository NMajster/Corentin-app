import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ 
      error: "Supabase non configuré",
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Lister les buckets
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  // Lister le contenu du bucket client-documents
  const { data: rootFiles, error: rootError } = await supabase.storage
    .from("client-documents")
    .list("", { limit: 100 });

  // Explorer TOUS les niveaux (3 niveaux de profondeur)
  const allFiles: { path: string; file: unknown }[] = [];
  
  // Fonction récursive pour explorer
  async function exploreFolder(path: string, depth: number) {
    if (depth > 3) return; // Max 3 niveaux
    
    const { data: items } = await supabase.storage
      .from("client-documents")
      .list(path, { limit: 100 });
    
    if (items) {
      for (const item of items) {
        const fullPath = path ? `${path}/${item.name}` : item.name;
        
        // Si c'est un fichier (a un id et metadata)
        if (item.id && item.metadata) {
          allFiles.push({ path: fullPath, file: item });
        } else {
          // C'est un dossier, explorer récursivement
          await exploreFolder(fullPath, depth + 1);
        }
      }
    }
  }
  
  await exploreFolder("", 0);

  // Explorer aussi spécifiquement les chemins connus
  const knownPaths = [
    "nmajster_yahoo_fr",
    "documents",
    "documents/nmajster_yahoo_fr",
  ];
  
  const knownPathsContents: Record<string, unknown[]> = {};
  for (const kp of knownPaths) {
    const { data } = await supabase.storage
      .from("client-documents")
      .list(kp, { limit: 100 });
    if (data && data.length > 0) {
      knownPathsContents[kp] = data;
    }
  }

  return NextResponse.json({
    supabaseUrl: supabaseUrl?.substring(0, 30) + "...",
    buckets: buckets?.map(b => b.name),
    bucketsError: bucketsError?.message,
    rootFiles,
    rootError: rootError?.message,
    allFilesFound: allFiles.length,
    allFiles,
    knownPathsContents,
  }, { status: 200 });
}

