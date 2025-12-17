"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  File,
  FileText,
  Image,
  Trash2,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  FolderOpen,
  Plus,
  X,
} from "lucide-react";

type TypePiece = 
  | "releve_compte"
  | "capture_virement"
  | "echange_banque"
  | "depot_plainte"
  | "piece_identite"
  | "justificatif_domicile"
  | "autre";

interface Piece {
  id: string;
  nom: string;
  type: TypePiece;
  typeLabel: string;
  taille: string;
  date: string;
  statut: "valide" | "en_attente" | "invalide";
}

const typesPieces: { value: TypePiece; label: string; description: string; required: boolean }[] = [
  { value: "releve_compte", label: "Relevés de compte", description: "Les 3 derniers mois", required: true },
  { value: "capture_virement", label: "Captures virements", description: "Screenshots des opérations frauduleuses", required: true },
  { value: "echange_banque", label: "Échanges avec la banque", description: "Emails, courriers de refus", required: true },
  { value: "depot_plainte", label: "Dépôt de plainte", description: "Récépissé de dépôt de plainte", required: true },
  { value: "piece_identite", label: "Pièce d'identité", description: "CNI ou passeport", required: true },
  { value: "justificatif_domicile", label: "Justificatif de domicile", description: "Moins de 3 mois", required: true },
  { value: "autre", label: "Autre document", description: "Tout document utile", required: false },
];

export default function PiecesPage() {
  const [selectedType, setSelectedType] = useState<TypePiece | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);

  // Données de démonstration
  const [pieces] = useState<Piece[]>([
    {
      id: "1",
      nom: "releve-octobre-2024.pdf",
      type: "releve_compte",
      typeLabel: "Relevé de compte",
      taille: "245 Ko",
      date: "17 déc. 2024",
      statut: "valide",
    },
    {
      id: "2",
      nom: "capture-virement-5500.png",
      type: "capture_virement",
      typeLabel: "Capture virement",
      taille: "1.2 Mo",
      date: "17 déc. 2024",
      statut: "valide",
    },
    {
      id: "3",
      nom: "cni-recto-verso.pdf",
      type: "piece_identite",
      typeLabel: "Pièce d'identité",
      taille: "890 Ko",
      date: "17 déc. 2024",
      statut: "en_attente",
    },
  ]);

  const piecesParType = typesPieces.map((type) => ({
    ...type,
    pieces: pieces.filter((p) => p.type === type.value),
    isComplete: pieces.some((p) => p.type === type.value && p.statut === "valide"),
  }));

  const totalRequired = typesPieces.filter((t) => t.required).length;
  const completedRequired = piecesParType.filter((t) => t.required && t.isComplete).length;
  const progress = Math.round((completedRequired / totalRequired) * 100);

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
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    // Simulation d'upload
    const newUploading = files.map((f) => f.name);
    setUploadingFiles((prev) => [...prev, ...newUploading]);

    // Simuler la fin de l'upload après 2 secondes
    setTimeout(() => {
      setUploadingFiles((prev) => prev.filter((name) => !newUploading.includes(name)));
      // Ici on ajouterait les fichiers à la liste
    }, 2000);
  };

  const getFileIcon = (nom: string) => {
    if (nom.endsWith(".pdf")) return FileText;
    if (nom.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return Image;
    return File;
  };

  const getStatutBadge = (statut: Piece["statut"]) => {
    switch (statut) {
      case "valide":
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Validé
          </Badge>
        );
      case "en_attente":
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            En vérification
          </Badge>
        );
      case "invalide":
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            À refaire
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Mes pièces justificatives
        </h1>
        <p className="text-muted-foreground">
          Importez les documents nécessaires à votre dossier.
        </p>
      </div>

      {/* Barre de progression */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Progression</h3>
              <p className="text-sm text-muted-foreground">
                {completedRequired}/{totalRequired} catégories complètes
              </p>
            </div>
            <span className="text-2xl font-bold text-primary">{progress}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Zone d'upload */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Importer des documents</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Sélection du type */}
          {!selectedType ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {typesPieces.map((type) => {
                const typeData = piecesParType.find((t) => t.value === type.value);
                return (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all hover:border-primary hover:shadow-elegant ${
                      typeData?.isComplete
                        ? "border-green-200 bg-green-50"
                        : "border-border bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <FolderOpen className={`w-6 h-6 ${
                        typeData?.isComplete ? "text-green-600" : "text-primary"
                      }`} />
                      {typeData?.isComplete && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {type.required && !typeData?.isComplete && (
                        <span className="text-xs text-destructive font-medium">Requis</span>
                      )}
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{type.label}</h4>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {typeData?.pieces.length || 0} fichier(s)
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-foreground">
                    {typesPieces.find((t) => t.value === selectedType)?.label}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {typesPieces.find((t) => t.value === selectedType)?.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedType(null)}
                >
                  <X className="w-4 h-4 mr-1" />
                  Changer de catégorie
                </Button>
              </div>

              {/* Zone de drop */}
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
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
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
                  Formats acceptés : PDF, JPG, PNG • Taille max : 10 Mo
                </p>
              </div>

              {/* Fichiers en cours d'upload */}
              {uploadingFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadingFiles.map((name) => (
                    <div
                      key={name}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                        <File className="w-4 h-4 text-primary" />
                      </div>
                      <span className="flex-1 text-sm truncate">{name}</span>
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liste des pièces */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Documents importés ({pieces.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pieces.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun document importé pour le moment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pieces.map((piece) => {
                const FileIcon = getFileIcon(piece.nom);
                return (
                  <div
                    key={piece.id}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{piece.nom}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{piece.typeLabel}</span>
                        <span>•</span>
                        <span>{piece.taille}</span>
                        <span>•</span>
                        <span>{piece.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatutBadge(piece.statut)}
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Aide */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Conseils pour vos documents
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Relevés de compte</strong> : Assurez-vous que les opérations frauduleuses sont bien visibles</li>
                <li>• <strong>Captures d&apos;écran</strong> : Prenez des screenshots clairs montrant les dates et montants</li>
                <li>• <strong>Échanges avec la banque</strong> : Incluez tous les refus de remboursement reçus</li>
                <li>• <strong>Dépôt de plainte</strong> : Le récépissé avec le numéro de plainte est indispensable</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


