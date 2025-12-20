"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import {
  Upload,
  File,
  FileText,
  Image as ImageIcon,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  FolderOpen,
  Plus,
  Loader2,
  ArrowLeft,
  X,
  Edit3,
  Save,
} from "lucide-react";
import Link from "next/link";

interface Document {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  uploaded_at: string;
  designation?: string;
  date_piece?: string;
  commentaire?: string;
}

const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return "0 Ko";
  const k = 1024;
  const sizes = ["o", "Ko", "Mo", "Go"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export default function PiecesPage() {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [editingDoc, setEditingDoc] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    designation: "",
    date_piece: "",
    commentaire: "",
  });
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  // Charger les documents depuis le Storage
  useEffect(() => {
    const fetchDocuments = async () => {
      console.log("🔍 Début chargement documents...");
      
      if (!supabase) {
        console.log("❌ Supabase non configuré");
        setLoading(false);
        return;
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      console.log("👤 User:", user?.email, user?.id);
      
      if (!user) {
        console.log("❌ Pas d'utilisateur connecté");
        setLoading(false);
        return;
      }

      const allFiles: Document[] = [];

      // D'abord, lister tous les dossiers à la racine du bucket
      console.log("📂 Listing des dossiers racine...");
      const { data: rootFolders, error: rootError } = await supabase.storage
        .from("client-documents")
        .list("", { limit: 100 });
      
      console.log("📂 Dossiers racine:", rootFolders, "Erreur:", rootError);

      if (rootFolders) {
        for (const folder of rootFolders) {
          // Si c'est un dossier (pas de metadata = dossier)
          if (folder.name) {
            console.log(`📁 Exploration du dossier: ${folder.name}`);
            
            const { data: subFiles, error: subError } = await supabase.storage
              .from("client-documents")
              .list(folder.name, { limit: 100 });
            
            console.log(`  └─ Fichiers dans ${folder.name}:`, subFiles?.length, "Erreur:", subError);
            
            if (subFiles) {
              for (const file of subFiles) {
                // Vérifier si c'est un fichier (a un id) et pas un sous-dossier
                if (file.id) {
                  console.log(`    └─ Fichier trouvé: ${file.name}`);
                  allFiles.push({
                    id: file.id,
                    file_name: file.name.replace(/^\d+_/, ""),
                    file_type: file.metadata?.mimetype || "application/octet-stream",
                    file_size: file.metadata?.size || 0,
                    file_path: `${folder.name}/${file.name}`,
                    uploaded_at: file.created_at || new Date().toISOString(),
                  });
                } else {
                  // C'est un sous-dossier, explorer aussi
                  console.log(`  📁 Sous-dossier trouvé: ${folder.name}/${file.name}`);
                  const { data: deepFiles } = await supabase.storage
                    .from("client-documents")
                    .list(`${folder.name}/${file.name}`, { limit: 100 });
                  
                  if (deepFiles) {
                    for (const deepFile of deepFiles) {
                      if (deepFile.id) {
                        console.log(`      └─ Fichier profond: ${deepFile.name}`);
                        allFiles.push({
                          id: deepFile.id,
                          file_name: deepFile.name.replace(/^\d+_/, ""),
                          file_type: deepFile.metadata?.mimetype || "application/octet-stream",
                          file_size: deepFile.metadata?.size || 0,
                          file_path: `${folder.name}/${file.name}/${deepFile.name}`,
                          uploaded_at: deepFile.created_at || new Date().toISOString(),
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      console.log("✅ Total fichiers trouvés:", allFiles.length);
      console.log("📄 Fichiers:", allFiles);

      // Dédupliquer
      const uniqueDocs = allFiles.filter((doc, index, self) => 
        index === self.findIndex(d => d.file_path === doc.file_path)
      );

      setDocuments(uniqueDocs);
      setLoading(false);
    };

    fetchDocuments();
  }, [supabase]);

  // Construire l'URL publique du fichier
  const getPublicUrl = (filePath: string) => {
    if (!supabase) return "";
    const { data } = supabase.storage
      .from("client-documents")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Visualiser un document
  const handleView = (doc: Document) => {
    const url = getPublicUrl(doc.file_path);
    window.open(url, "_blank");
  };

  // Télécharger un document
  const handleDownload = async (doc: Document) => {
    const url = getPublicUrl(doc.file_path);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.file_name;
    a.target = "_blank";
    a.click();
  };

  // Ouvrir le formulaire d'édition
  const handleEdit = (doc: Document) => {
    setEditingDoc(doc.id);
    setEditForm({
      designation: doc.designation || "",
      date_piece: doc.date_piece || "",
      commentaire: doc.commentaire || "",
    });
  };

  // Sauvegarder les métadonnées
  const handleSaveMetadata = async (docId: string) => {
    if (!supabase) return;
    
    setSaving(true);
    const { error } = await supabase
      .from("client_documents")
      .update({
        designation: editForm.designation || null,
        date_piece: editForm.date_piece || null,
        commentaire: editForm.commentaire || null,
      })
      .eq("id", docId);

    if (!error) {
      // Mettre à jour localement
      setDocuments(docs => 
        docs.map(d => 
          d.id === docId 
            ? { ...d, ...editForm }
            : d
        )
      );
      setEditingDoc(null);
    }
    setSaving(false);
  };

  // Upload de fichiers
  const handleFiles = async (files: FileList | File[]) => {
    if (!supabase) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUploading(true);
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sessionId", "dashboard-upload");
      formData.append("email", user.email || "");

      try {
        const response = await fetch("/api/documents/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          // Recharger la liste
          const { data } = await supabase
            .from("client_documents")
            .select("*")
            .eq("user_id", user.id)
            .order("uploaded_at", { ascending: false });

          if (data) {
            setDocuments(data);
          }
        }
      } catch (error) {
        console.error("Erreur upload:", error);
      }
    }

    setUploading(false);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const getFileIcon = (type: string, name: string) => {
    if (type?.startsWith("image/") || name?.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    }
    if (type === "application/pdf" || name?.endsWith(".pdf")) {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2">
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Mes pièces justificatives
        </h1>
        <p className="text-muted-foreground">
          Consultez vos documents importés et ajoutez des informations pour aider l&apos;avocat.
        </p>
      </div>

      {/* SECTION 1 : Liste des documents importés (EN HAUT) */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">
            Documents importés ({documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Aucun document importé pour le moment</p>
              <p className="text-sm text-muted-foreground">
                Utilisez la zone ci-dessous pour importer vos premiers documents.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="border rounded-lg overflow-hidden"
                >
                  {/* Ligne principale du document */}
                  <div className="flex items-center gap-4 p-4 bg-muted/30">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                      {getFileIcon(doc.file_type, doc.file_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.file_name}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{formatFileSize(doc.file_size)}</span>
                        <span>•</span>
                        <span>
                          {new Date(doc.uploaded_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {doc.designation && (
                          <>
                            <span>•</span>
                            <span className="text-primary font-medium">{doc.designation}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Importé
                      </Badge>
                      
                      {/* Bouton Éditer métadonnées avec tooltip */}
                      <div className="relative group">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => editingDoc === doc.id ? setEditingDoc(null) : handleEdit(doc)}
                          className="relative"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[9999] w-64 text-center shadow-lg">
                          En donnant des informations précises sur vos documents, vous facilitez le travail de votre avocat
                          <div className="absolute bottom-full right-4 border-4 border-transparent border-b-gray-900"></div>
                        </div>
                      </div>
                      
                      {/* Bouton Visualiser */}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleView(doc)}
                        title="Visualiser"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {/* Bouton Télécharger */}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDownload(doc)}
                        title="Télécharger"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Formulaire d'édition des métadonnées */}
                  {editingDoc === doc.id && (
                    <div className="p-4 bg-muted/10 border-t space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`designation-${doc.id}`}>
                            Désignation de la pièce
                          </Label>
                          <Input
                            id={`designation-${doc.id}`}
                            placeholder="Ex: Relevé de compte BNP octobre 2024"
                            value={editForm.designation}
                            onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`date-${doc.id}`}>
                            Date du document
                          </Label>
                          <Input
                            id={`date-${doc.id}`}
                            type="date"
                            value={editForm.date_piece}
                            onChange={(e) => setEditForm({ ...editForm, date_piece: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`commentaire-${doc.id}`}>
                          Commentaire / Explications
                        </Label>
                        <Textarea
                          id={`commentaire-${doc.id}`}
                          placeholder="Décrivez ce document et son importance pour votre dossier..."
                          rows={3}
                          value={editForm.commentaire}
                          onChange={(e) => setEditForm({ ...editForm, commentaire: e.target.value })}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingDoc(null)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Annuler
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveMetadata(doc.id)}
                          disabled={saving}
                        >
                          {saving ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-1" />
                          )}
                          Enregistrer
                        </Button>
                      </div>

                      {/* Affichage des infos existantes */}
                      {(doc.designation || doc.date_piece || doc.commentaire) && (
                        <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                          <p className="font-medium text-foreground mb-2">Informations actuelles :</p>
                          {doc.designation && <p>• Désignation : {doc.designation}</p>}
                          {doc.date_piece && <p>• Date : {new Date(doc.date_piece).toLocaleDateString("fr-FR")}</p>}
                          {doc.commentaire && <p>• Commentaire : {doc.commentaire}</p>}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Affichage compact des métadonnées si pas en édition */}
                  {editingDoc !== doc.id && doc.commentaire && (
                    <div className="px-4 py-2 bg-blue-50 text-sm text-blue-800 border-t">
                      <span className="font-medium">Note :</span> {doc.commentaire}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 2 : Zone d'upload (EN BAS) */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Importer de nouveaux documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="font-medium">Upload en cours...</p>
              </div>
            ) : (
              <>
                <Upload className={`w-12 h-12 mx-auto mb-4 ${
                  isDragging ? "text-primary" : "text-muted-foreground"
                }`} />
                <p className="font-medium text-foreground mb-2">
                  Glissez vos fichiers ici
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  ou cliquez pour sélectionner
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input">
                  <Button asChild>
                    <span>
                      <Plus className="w-4 h-4 mr-2" />
                      Sélectionner des fichiers
                    </span>
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-4">
                  Formats acceptés : PDF, JPG, PNG, Word • Taille max : 10 Mo
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3 : Aide et conseils */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Conseils pour vos documents
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Désignation</strong> : Donnez un nom clair à chaque pièce (ex: &quot;Relevé BNP octobre 2024&quot;)</li>
                <li>• <strong>Date</strong> : Indiquez la date du document pour faciliter le classement</li>
                <li>• <strong>Commentaire</strong> : Expliquez l&apos;importance de ce document pour votre dossier</li>
                <li>• <strong>Captures d&apos;écran</strong> : Prenez des screenshots clairs montrant les dates et montants</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
