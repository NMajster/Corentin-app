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

  // Explorer chaque dossier
  const folderContents: Record<string, unknown[]> = {};
  
  if (rootFiles) {
    for (const item of rootFiles) {
      const { data: subFiles } = await supabase.storage
        .from("client-documents")
        .list(item.name, { limit: 100 });
      
      if (subFiles && subFiles.length > 0) {
        folderContents[item.name] = subFiles;
      }
    }
  }

  return NextResponse.json({
    supabaseUrl: supabaseUrl?.substring(0, 30) + "...",
    buckets: buckets?.map(b => b.name),
    bucketsError: bucketsError?.message,
    rootFiles,
    rootError: rootError?.message,
    folderContents,
  }, { status: 200 });
}

