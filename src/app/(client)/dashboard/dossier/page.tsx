"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  User,
  Building2,
  Calendar,
  Euro,
  CheckCircle,
  Download,
  ExternalLink,
  Phone,
  Mail,
  FolderOpen,
  ArrowRight,
  Plus,
  Upload,
  Trash2,
  Edit3,
  Save,
  X,
  MapPin,
  CreditCard,
  Clock,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { EtapesDossier } from "@/components/dossier/EtapesDossier";
import { createClient } from "@/lib/supabase/client";

// Types de fraudes bancaires
const typesFraude = [
  { value: "faux_conseiller", label: "Fraude au faux conseiller bancaire" },
  { value: "phishing", label: "Phishing / Hameçonnage" },
  { value: "virement_frauduleux", label: "Virement frauduleux" },
  { value: "usurpation_identite", label: "Usurpation d'identité bancaire" },
  { value: "fraude_cb", label: "Fraude à la carte bancaire" },
  { value: "faux_rib", label: "Fraude au faux RIB" },
  { value: "arnaque_placement", label: "Arnaque au placement financier" },
  { value: "autre", label: "Autre" },
];

// Statuts du dossier
type StatutDossier = 
  | "en_attente_convention"
  | "convention_en_attente_signature"
  | "dossier_actif"
  | "mise_en_demeure"
  | "contentieux"
  | "cloture";

const statutsConfig: Record<StatutDossier, { 
  label: string; 
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  etape: number;
}> = {
  en_attente_convention: {
    label: "En attente de la convention",
    description: "Votre avocat prépare la convention d'honoraires, vous serez notifié dès qu'elle sera prête",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    etape: 1,
  },
  convention_en_attente_signature: {
    label: "Convention en attente de signature",
    description: "Veuillez signer la convention d'honoraires pour activer votre dossier",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    etape: 2,
  },
  dossier_actif: {
    label: "Dossier actif",
    description: "Votre dossier est en cours de traitement",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    etape: 3,
  },
  mise_en_demeure: {
    label: "Mise en demeure envoyée",
    description: "La mise en demeure a été envoyée à la banque",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    etape: 4,
  },
  contentieux: {
    label: "Contentieux en cours",
    description: "Procédure judiciaire engagée",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    etape: 5,
  },
  cloture: {
    label: "Dossier clôturé",
    description: "Affaire terminée",
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    etape: 6,
  },
};

interface Victime {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  codePostal: string;
  ville: string;
  dateNaissance: string;
  lieuNaissance: string;
  pieceIdentite: string | null;
}

interface Banque {
  nom: string;
  siegeSocial: string;
  adresseAgence: string;
  datePremiereOperation: string;
}

export default function DossierPage() {
  // État de chargement
  const [loading, setLoading] = useState(true);
  const [piecesImportees, setPiecesImportees] = useState(0);

  // États pour l'édition
  const [isEditingFaits, setIsEditingFaits] = useState(false);
  const [descriptionFaits, setDescriptionFaits] = useState("");
  const [tempDescription, setTempDescription] = useState("");

  // Données du dossier
  const [dossier, setDossier] = useState({
    id: "",
    dateCreation: "",
    datePaiement: "",
    numeroDossier: 1,
    typeContentieux: "fraude_bancaire",
    statut: "en_attente_convention" as StatutDossier,
  });

  const [victimes, setVictimes] = useState<Victime[]>([
    {
      id: "1",
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      adresse: "",
      codePostal: "",
      ville: "",
      dateNaissance: "",
      lieuNaissance: "",
      pieceIdentite: null,
    },
  ]);

  const [banque, setBanque] = useState<Banque>({
    nom: "",
    siegeSocial: "",
    adresseAgence: "",
    datePremiereOperation: "",
  });

  // Charger les données depuis Supabase
  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        // Récupérer l'utilisateur connecté
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Récupérer le profil client
        const { data: profile } = await supabase
          .from("profils_clients")
          .select("*")
          .eq("user_id", user.id)
          .single();

        // Récupérer le dossier
        const { data: dossierData } = await supabase
          .from("dossiers")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (dossierData) {
          // Mapper le statut Supabase vers notre enum local
          let mappedStatut: StatutDossier = "en_attente_convention";
          switch (dossierData.statut) {
            case "nouveau":
            case "en_attente_entretien":
            case "entretien_realise":
              mappedStatut = "en_attente_convention";
              break;
            case "convention_signee":
            case "pieces_en_attente":
              mappedStatut = "dossier_actif";
              break;
            case "mise_en_demeure":
            case "reponse_banque":
              mappedStatut = "mise_en_demeure";
              break;
            case "assignation":
            case "audience":
            case "jugement":
              mappedStatut = "contentieux";
              break;
            case "clos_succes":
            case "clos_echec":
            case "abandonne":
              mappedStatut = "cloture";
              break;
          }

          setDossier({
            id: dossierData.id,
            dateCreation: new Date(dossierData.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric"
            }),
            datePaiement: dossierData.created_at?.split("T")[0] || "",
            numeroDossier: 1,
            typeContentieux: dossierData.type_contentieux || "fraude_bancaire",
            statut: mappedStatut,
          });
        }

        // Mettre à jour les infos de la victime depuis le profil
        if (profile || user) {
          const userMeta = user.user_metadata || {};
          setVictimes([{
            id: "1",
            nom: userMeta.nom || profile?.nom || "",
            prenom: userMeta.prenom || profile?.prenom || "",
            email: user.email || "",
            telephone: userMeta.telephone || profile?.telephone || "",
            adresse: profile?.adresse || "",
            codePostal: profile?.code_postal || "",
            ville: profile?.ville || "",
            dateNaissance: profile?.date_naissance || "",
            lieuNaissance: profile?.lieu_naissance || "",
            pieceIdentite: null,
          }]);

          // Mettre à jour les infos banque si disponibles
          if (profile?.banque_concernee) {
            setBanque(prev => ({ ...prev, nom: profile.banque_concernee }));
          }
        }

        // Compter les pièces importées depuis Storage
        const userEmail = user.email?.replace(/[@.]/g, "_") || "";
        const { data: files } = await supabase.storage
          .from("client-documents")
          .list(`documents/${userEmail}`, { limit: 100 });

        if (files) {
          // Compter récursivement (dossiers inclus)
          let totalFiles = 0;
          for (const item of files) {
            if (item.metadata) {
              totalFiles++;
            } else {
              // C'est un dossier, lister son contenu
              const { data: subFiles } = await supabase.storage
                .from("client-documents")
                .list(`documents/${userEmail}/${item.name}`, { limit: 100 });
              if (subFiles) {
                totalFiles += subFiles.filter(f => f.metadata).length;
              }
            }
          }
          setPiecesImportees(totalFiles);
        }

      } catch (error) {
        console.error("Erreur chargement données:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const statutActuel = statutsConfig[dossier.statut];

  // Génération de la référence : Nom C/ Banque - AAAA-JJMM-NNN
  const genererReference = () => {
    const nomPlaignant = victimes[0]?.nom?.toUpperCase() || "PLAIGNANT";
    const nomBanque = banque.nom?.toUpperCase() || "BANQUE";
    const date = new Date(dossier.datePaiement);
    const annee = date.getFullYear();
    const jour = String(date.getDate()).padStart(2, "0");
    const mois = String(date.getMonth() + 1).padStart(2, "0");
    const numero = String(dossier.numeroDossier).padStart(3, "0");
    return `${nomPlaignant} C/ ${nomBanque} - ${annee}-${jour}${mois}-${numero}`;
  };

  const reference = genererReference();

  const [montantPrejudice, setMontantPrejudice] = useState<number | string>(5500);
  const [isEditingMontant, setIsEditingMontant] = useState(false);

  const documents = [
    {
      nom: "Convention d'honoraires",
      type: "convention_honoraires",
      statut: "signe",
      date: "18 décembre 2024",
    },
  ];

  // Prochaine étape définie par l'avocat
  const prochaineEtape = {
    titre: "Constitution du dossier",
    description: "Nous analysons vos pièces et préparons la stratégie.",
  };

  // Fonctions
  const ajouterVictime = () => {
    const newVictime: Victime = {
      id: Date.now().toString(),
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      adresse: "",
      codePostal: "",
      ville: "",
      dateNaissance: "",
      lieuNaissance: "",
      pieceIdentite: null,
    };
    setVictimes([...victimes, newVictime]);
  };

  const supprimerVictime = (id: string) => {
    if (victimes.length > 1) {
      setVictimes(victimes.filter((v) => v.id !== id));
    }
  };

  const updateVictime = (id: string, field: keyof Victime, value: string) => {
    setVictimes(
      victimes.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleSaveDescription = () => {
    setDescriptionFaits(tempDescription);
    setIsEditingFaits(false);
  };

  const handleCancelEdit = () => {
    setTempDescription(descriptionFaits);
    setIsEditingFaits(false);
  };

  const getTypeFraudeLabel = (value: string) => {
    return typesFraude.find((t) => t.value === value)?.label || value;
  };

  // Écran de chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de votre dossier...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Mon dossier
          </h1>
          <p className="text-muted-foreground font-medium">
            {reference}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter en PDF
          </Button>
        </div>
      </div>

      {/* Bandeau de statut */}
      <Card className={`${statutActuel.bgColor} ${statutActuel.borderColor} border-2`}>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${
                dossier.statut === "dossier_actif" ? "bg-emerald-500 animate-pulse" :
                dossier.statut === "convention_en_attente_signature" ? "bg-orange-500" :
                dossier.statut === "en_attente_convention" ? "bg-amber-500 animate-pulse" :
                "bg-gray-400"
              }`} />
              <div>
                <p className={`font-semibold ${statutActuel.color}`}>
                  {statutActuel.label}
                </p>
                <p className="text-sm text-muted-foreground">
                  {statutActuel.description}
                </p>
              </div>
            </div>
            
            {/* Action selon le statut */}
            {dossier.statut === "en_attente_convention" && (
              <Badge className="bg-amber-100 text-amber-700 border border-amber-300">
                <Clock className="w-3 h-3 mr-1" />
                En préparation
              </Badge>
            )}
            {dossier.statut === "convention_en_attente_signature" && (
              <Button className="bg-orange-600 hover:bg-orange-700">
                <FileText className="w-4 h-4 mr-2" />
                Signer la convention
              </Button>
            )}
          </div>

          {/* Indicateur d'étapes simplifié */}
          <div className="mt-4 flex items-center gap-2">
            {[
              { num: 0, label: "Entretien" },
              { num: 1, label: "Convention" },
              { num: 2, label: "Signature" },
              { num: 3, label: "Dossier actif" },
            ].map((etape, index) => (
              <div key={etape.num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  etape.num < statutActuel.etape 
                    ? "bg-emerald-500 text-white" 
                    : etape.num === statutActuel.etape
                    ? `${statutActuel.bgColor} ${statutActuel.color} border-2 ${statutActuel.borderColor}`
                    : "bg-gray-100 text-gray-400"
                }`}>
                  {etape.num < statutActuel.etape ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    etape.num === 0 ? "✓" : etape.num
                  )}
                </div>
                {index < 3 && (
                  <div className={`w-8 h-1 mx-1 rounded ${
                    etape.num < statutActuel.etape ? "bg-emerald-500" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-6 text-xs text-muted-foreground">
            <span className="text-emerald-600 font-medium">✓ Entretien</span>
            <span className={statutActuel.etape >= 1 ? "text-emerald-600 font-medium" : ""}>Convention</span>
            <span className={statutActuel.etape >= 2 ? "text-emerald-600 font-medium" : ""}>Signature</span>
            <span className={statutActuel.etape >= 3 ? "text-emerald-600 font-medium" : ""}>Dossier actif</span>
          </div>
        </CardContent>
      </Card>

      {/* Résumé du dossier */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pièces importées */}
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pièces importées
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {piecesImportees}
                  </p>
                </div>
              </div>
              <Link href="/dashboard/pieces">
                <Button variant="ghost" size="sm" className="text-primary">
                  Voir <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Prochaine étape */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <ArrowRight className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Prochaine étape
                </p>
                <p className="font-semibold text-foreground">
                  {prochaineEtape.titre}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {prochaineEtape.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="victimes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-transparent gap-2 p-1">
          <TabsTrigger 
            value="victimes"
            className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=inactive]:bg-blue-50 data-[state=inactive]:text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-all"
          >
            <User className="w-4 h-4 mr-2" />
            Victimes
          </TabsTrigger>
          <TabsTrigger 
            value="affaire"
            className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 data-[state=inactive]:bg-amber-50 data-[state=inactive]:text-amber-600 hover:bg-amber-100 rounded-lg font-medium transition-all"
          >
            <Building2 className="w-4 h-4 mr-2" />
            L&apos;affaire
          </TabsTrigger>
          <TabsTrigger 
            value="documents"
            className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 data-[state=inactive]:bg-emerald-50 data-[state=inactive]:text-emerald-600 hover:bg-emerald-100 rounded-lg font-medium transition-all"
          >
            <FileText className="w-4 h-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger 
            value="historique"
            className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=inactive]:bg-purple-50 data-[state=inactive]:text-purple-600 hover:bg-purple-100 rounded-lg font-medium transition-all"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Procédure
          </TabsTrigger>
        </TabsList>

        {/* Tab Victimes */}
        <TabsContent value="victimes" className="space-y-6">
          {victimes.map((victime, index) => (
            <Card key={victime.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <User className="w-5 h-5 text-primary" />
                    {victimes.length > 1
                      ? `Victime ${index + 1}`
                      : "Vos informations"}
                    {victime.nom && victime.prenom && (
                      <span className="font-normal text-muted-foreground ml-2">
                        - {victime.prenom} {victime.nom}
                      </span>
                    )}
                  </CardTitle>
                  {victimes.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => supprimerVictime(victime.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Informations personnelles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`nom-${victime.id}`}>Nom</Label>
                    <Input
                      id={`nom-${victime.id}`}
                      value={victime.nom}
                      onChange={(e) =>
                        updateVictime(victime.id, "nom", e.target.value)
                      }
                      placeholder="Nom de famille"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`prenom-${victime.id}`}>Prénom</Label>
                    <Input
                      id={`prenom-${victime.id}`}
                      value={victime.prenom}
                      onChange={(e) =>
                        updateVictime(victime.id, "prenom", e.target.value)
                      }
                      placeholder="Prénom"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`email-${victime.id}`}>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id={`email-${victime.id}`}
                        type="email"
                        className="pl-10"
                        value={victime.email}
                        onChange={(e) =>
                          updateVictime(victime.id, "email", e.target.value)
                        }
                        placeholder="email@exemple.fr"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`telephone-${victime.id}`}>Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id={`telephone-${victime.id}`}
                        className="pl-10"
                        value={victime.telephone}
                        onChange={(e) =>
                          updateVictime(victime.id, "telephone", e.target.value)
                        }
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor={`adresse-${victime.id}`}>Adresse</Label>
                  <Input
                    id={`adresse-${victime.id}`}
                    value={victime.adresse}
                    onChange={(e) =>
                      updateVictime(victime.id, "adresse", e.target.value)
                    }
                    placeholder="Numéro et nom de rue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`cp-${victime.id}`}>Code postal</Label>
                    <Input
                      id={`cp-${victime.id}`}
                      value={victime.codePostal}
                      onChange={(e) =>
                        updateVictime(victime.id, "codePostal", e.target.value)
                      }
                      placeholder="75001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`ville-${victime.id}`}>Ville</Label>
                    <Input
                      id={`ville-${victime.id}`}
                      value={victime.ville}
                      onChange={(e) =>
                        updateVictime(victime.id, "ville", e.target.value)
                      }
                      placeholder="Paris"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`ddn-${victime.id}`}>Date de naissance</Label>
                    <Input
                      id={`ddn-${victime.id}`}
                      type="date"
                      value={victime.dateNaissance}
                      onChange={(e) =>
                        updateVictime(victime.id, "dateNaissance", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`ldn-${victime.id}`}>Lieu de naissance</Label>
                    <Input
                      id={`ldn-${victime.id}`}
                      value={victime.lieuNaissance}
                      onChange={(e) =>
                        updateVictime(victime.id, "lieuNaissance", e.target.value)
                      }
                      placeholder="Ville de naissance"
                    />
                  </div>
                </div>

                <Separator />

                {/* Pièce d'identité */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Pièce d&apos;identité
                  </Label>
                  {victime.pieceIdentite ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-700">
                          Pièce d&apos;identité importée
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Carte d&apos;identité ou passeport (recto/verso)
                      </p>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Importer
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Bouton ajouter victime */}
          <Button
            variant="outline"
            className="w-full border-dashed border-2"
            onClick={ajouterVictime}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une autre victime
          </Button>
        </TabsContent>

        {/* Tab Affaire */}
        <TabsContent value="affaire" className="space-y-6">
          {/* Type de contentieux */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Type de contentieux</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={dossier.typeContentieux}
                onValueChange={(value) =>
                  setDossier({ ...dossier, typeContentieux: value })
                }
              >
                <SelectTrigger className="w-full md:w-96">
                  <SelectValue placeholder="Sélectionnez le type de fraude" />
                </SelectTrigger>
                <SelectContent>
                  {typesFraude.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Informations banque (défendeur) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Building2 className="w-5 h-5 text-primary" />
                Le défendeur (Banque)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="banque-nom">Nom de la banque</Label>
                <Input
                  id="banque-nom"
                  value={banque.nom}
                  onChange={(e) => setBanque({ ...banque, nom: e.target.value })}
                  placeholder="Ex: Société Générale, BNP Paribas..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banque-siege" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Adresse du siège social
                </Label>
                <Input
                  id="banque-siege"
                  value={banque.siegeSocial}
                  onChange={(e) =>
                    setBanque({ ...banque, siegeSocial: e.target.value })
                  }
                  placeholder="Adresse complète du siège"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banque-agence" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Adresse de l&apos;agence concernée
                </Label>
                <Input
                  id="banque-agence"
                  value={banque.adresseAgence}
                  onChange={(e) =>
                    setBanque({ ...banque, adresseAgence: e.target.value })
                  }
                  placeholder="Adresse de votre agence"
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="date-premiere-op"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Date de la 1ère opération frauduleuse
                  </Label>
                  <Input
                    id="date-premiere-op"
                    type="date"
                    value={banque.datePremiereOperation}
                    onChange={(e) =>
                      setBanque({
                        ...banque,
                        datePremiereOperation: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Euro className="w-4 h-4" />
                    Montant total du préjudice
                  </Label>
                  {isEditingMontant ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={montantPrejudice}
                        onChange={(e) => setMontantPrejudice(e.target.value)}
                        className="w-32 text-lg font-bold"
                        min={0}
                        step={100}
                      />
                      <span className="text-lg font-bold">€</span>
                      <Button
                        size="sm"
                        onClick={() => setIsEditingMontant(false)}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-foreground">
                        {Number(montantPrejudice).toLocaleString("fr-FR")} €
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingMontant(true)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Montant estimé de votre préjudice (modifiable)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description des faits */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 font-serif">
                  <FileText className="w-5 h-5 text-primary" />
                  Description des faits
                </CardTitle>
                {!isEditingFaits ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingFaits(true)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Annuler
                    </Button>
                    <Button size="sm" onClick={handleSaveDescription}>
                      <Save className="w-4 h-4 mr-2" />
                      Enregistrer
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditingFaits ? (
                <Textarea
                  value={tempDescription}
                  onChange={(e) => setTempDescription(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                  placeholder="Décrivez les faits de manière chronologique et détaillée..."
                />
              ) : (
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                  {descriptionFaits}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-4">
                💡 Vous pouvez modifier cette description à tout moment pour
                ajouter des détails ou corriger des informations.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Documents */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Documents du dossier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.nom}</p>
                        {doc.date && (
                          <p className="text-sm text-muted-foreground">
                            {doc.date}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {doc.statut === "signe" && (
                        <>
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Signé
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">
                      Documents à venir
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Les documents de procédure seront ajoutés ici au fur et à
                      mesure de l&apos;avancement de votre dossier.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Historique / Procédure */}
        <TabsContent value="historique" className="space-y-6">
          <EtapesDossier />
        </TabsContent>
      </Tabs>

      {/* Contact avocat */}
      <Card className="bg-primary text-white">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-lg font-serif font-bold mb-1">
                Une question sur votre dossier ?
              </h3>
              <p className="text-white/80">
                Votre avocat référent est disponible pour vous répondre.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard/messages">
                <Button variant="secondary">
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer un message
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Planifier un appel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
