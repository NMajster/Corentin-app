/**
 * Types TypeScript pour la base de données Supabase
 * Générés à partir du schéma défini dans le README
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profils_clients: {
        Row: {
          id: string;
          user_id: string;
          adresse: string | null;
          code_postal: string | null;
          ville: string | null;
          date_naissance: string | null;
          lieu_naissance: string | null;
          nationalite: string | null;
          banque_concernee: string | null;
          montant_prejudice: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          adresse?: string | null;
          code_postal?: string | null;
          ville?: string | null;
          date_naissance?: string | null;
          lieu_naissance?: string | null;
          nationalite?: string | null;
          banque_concernee?: string | null;
          montant_prejudice?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          adresse?: string | null;
          code_postal?: string | null;
          ville?: string | null;
          date_naissance?: string | null;
          lieu_naissance?: string | null;
          nationalite?: string | null;
          banque_concernee?: string | null;
          montant_prejudice?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      dossiers: {
        Row: {
          id: string;
          user_id: string;
          reference: string;
          statut: DossierStatut;
          type_contentieux: TypeContentieux;
          date_entretien: string | null;
          convention_signee: boolean;
          honoraires: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reference?: string;
          statut?: DossierStatut;
          type_contentieux?: TypeContentieux;
          date_entretien?: string | null;
          convention_signee?: boolean;
          honoraires?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          reference?: string;
          statut?: DossierStatut;
          type_contentieux?: TypeContentieux;
          date_entretien?: string | null;
          convention_signee?: boolean;
          honoraires?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      pieces: {
        Row: {
          id: string;
          dossier_id: string;
          user_id: string;
          nom_fichier: string;
          type_piece: TypePiece;
          url_stockage: string;
          numero_bordereau: number | null;
          indexee: boolean;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          dossier_id: string;
          user_id: string;
          nom_fichier: string;
          type_piece: TypePiece;
          url_stockage: string;
          numero_bordereau?: number | null;
          indexee?: boolean;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          dossier_id?: string;
          user_id?: string;
          nom_fichier?: string;
          type_piece?: TypePiece;
          url_stockage?: string;
          numero_bordereau?: number | null;
          indexee?: boolean;
          uploaded_at?: string;
        };
      };
      modeles: {
        Row: {
          id: string;
          nom: string;
          matiere: string;
          contenu_template: string;
          zones_auto: Json;
          zones_fixes: Json;
          zones_libres: Json;
          actif: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          matiere: string;
          contenu_template: string;
          zones_auto?: Json;
          zones_fixes?: Json;
          zones_libres?: Json;
          actif?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          matiere?: string;
          contenu_template?: string;
          zones_auto?: Json;
          zones_fixes?: Json;
          zones_libres?: Json;
          actif?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          dossier_id: string;
          modele_id: string | null;
          type_document: TypeDocument;
          contenu_genere: string | null;
          statut: DocumentStatut;
          url_pdf: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          dossier_id: string;
          modele_id?: string | null;
          type_document: TypeDocument;
          contenu_genere?: string | null;
          statut?: DocumentStatut;
          url_pdf?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          dossier_id?: string;
          modele_id?: string | null;
          type_document?: TypeDocument;
          contenu_genere?: string | null;
          statut?: DocumentStatut;
          url_pdf?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      bordereaux: {
        Row: {
          id: string;
          document_id: string;
          liste_pieces: Json;
          contenu: string | null;
          generated_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          liste_pieces?: Json;
          contenu?: string | null;
          generated_at?: string;
        };
        Update: {
          id?: string;
          document_id?: string;
          liste_pieces?: Json;
          contenu?: string | null;
          generated_at?: string;
        };
      };
      references_juridiques: {
        Row: {
          id: string;
          type: TypeReference;
          code_ou_juridiction: string | null;
          reference: string;
          intitule: string;
          extrait: string | null;
          url_source: string | null;
          matiere: string | null;
          date_decision: string | null;
          mots_cles: string[] | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: TypeReference;
          code_ou_juridiction?: string | null;
          reference: string;
          intitule: string;
          extrait?: string | null;
          url_source?: string | null;
          matiere?: string | null;
          date_decision?: string | null;
          mots_cles?: string[] | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: TypeReference;
          code_ou_juridiction?: string | null;
          reference?: string;
          intitule?: string;
          extrait?: string | null;
          url_source?: string | null;
          matiere?: string | null;
          date_decision?: string | null;
          mots_cles?: string[] | null;
          active?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// Enums personnalisés
export type DossierStatut =
  | "nouveau"
  | "en_attente_entretien"
  | "entretien_realise"
  | "convention_signee"
  | "pieces_en_attente"
  | "mise_en_demeure"
  | "reponse_banque"
  | "assignation"
  | "audience"
  | "jugement"
  | "clos_succes"
  | "clos_echec"
  | "abandonne";

export type TypeContentieux =
  | "fraude_bancaire"
  | "faux_conseiller"
  | "phishing"
  | "litige_assurance"
  | "credit_abusif"
  | "placement_toxique"
  | "autre";

export type TypePiece =
  | "releve_compte"
  | "capture_virement"
  | "echange_banque"
  | "depot_plainte"
  | "piece_identite"
  | "justificatif_domicile"
  | "autre";

export type TypeDocument =
  | "convention_honoraires"
  | "mise_en_demeure"
  | "assignation"
  | "conclusions"
  | "bordereau_pieces"
  | "courrier"
  | "autre";

export type DocumentStatut =
  | "brouillon"
  | "en_cours"
  | "valide"
  | "envoye"
  | "archive";

export type TypeReference =
  | "article_loi"
  | "jurisprudence"
  | "directive"
  | "reglement";

// Types utilitaires
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Alias pratiques
export type ProfilClient = Tables<"profils_clients">;
export type Dossier = Tables<"dossiers">;
export type Piece = Tables<"pieces">;
export type Modele = Tables<"modeles">;
export type Document = Tables<"documents">;
export type Bordereau = Tables<"bordereaux">;
export type ReferenceJuridique = Tables<"references_juridiques">;


