"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { 
  FileText, 
  Upload, 
  MessageSquare, 
  Calendar,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Loader2,
  User
} from "lucide-react";
import Link from "next/link";

interface Dossier {
  id: string;
  reference: string;
  statut: string;
  type_contentieux: string;
  date_entretien: string | null;
  created_at: string;
}

interface Profil {
  id: string;
  banque_concernee: string | null;
  montant_prejudice: number | null;
}

interface UserData {
  email: string;
  user_metadata: {
    first_name?: string;
    last_name?: string;
  };
}

const statutLabels: Record<string, string> = {
  nouveau: "Nouveau dossier",
  en_attente_entretien: "En attente d'entretien",
  entretien_realise: "Entretien réalisé",
  convention_signee: "Convention signée",
  pieces_en_attente: "Pièces en attente",
  mise_en_demeure: "Mise en demeure envoyée",
  reponse_banque: "Réponse banque reçue",
  assignation: "Assignation en cours",
  audience: "Audience programmée",
  jugement: "Jugement rendu",
  clos_succes: "Dossier clos - Succès",
  clos_echec: "Dossier clos",
  abandonne: "Abandonné",
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [profil, setProfil] = useState<Profil | null>(null);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      // Récupérer l'utilisateur
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        setLoading(false);
        return;
      }

      setUser({
        email: authUser.email || "",
        user_metadata: authUser.user_metadata || {},
      });

      // Récupérer le profil
      const { data: profilData } = await supabase
        .from("profils_clients")
        .select("*")
        .eq("user_id", authUser.id)
        .single();
      
      if (profilData) {
        setProfil(profilData);
      }

      // Récupérer le dossier
      const { data: dossierData } = await supabase
        .from("dossiers")
        .select("*")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      
      if (dossierData) {
        setDossier(dossierData);
      }

      // Compter les documents
      const { count: docsCount } = await supabase
        .from("client_documents")
        .select("*", { count: "exact", head: true })
        .eq("user_id", authUser.id);
      
      setDocumentsCount(docsCount || 0);

      setLoading(false);
    }

    fetchData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Données par défaut si pas de données réelles
  const displayName = user?.user_metadata?.first_name || "Utilisateur";
  const displayDossier = dossier || {
    reference: "DOS-" + new Date().toISOString().slice(0, 10).replace(/-/g, ""),
    statut: "nouveau",
    created_at: new Date().toISOString(),
  };
  const displayBanque = profil?.banque_concernee || "Non renseignée";
  const displayMontant = profil?.montant_prejudice || 0;

  const stats = [
    { 
      label: "Documents importés", 
      value: documentsCount.toString(), 
      icon: Upload,
      color: documentsCount > 0 ? "text-green-600" : "text-amber-600",
      bgColor: documentsCount > 0 ? "bg-green-50" : "bg-amber-50"
    },
    { 
      label: "Messages", 
      value: messagesCount.toString(), 
      icon: MessageSquare,
      color: "text-primary",
      bgColor: "bg-primary/5"
    },
    { 
      label: "Statut", 
      value: displayDossier.statut === "nouveau" ? "En cours" : "Actif", 
      icon: Calendar,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
  ];

  const getTimelineFromStatut = (statut: string) => {
    const allSteps = [
      { key: "nouveau", titre: "Dossier créé", description: "Votre dossier a été enregistré" },
      { key: "en_attente_entretien", titre: "Entretien à planifier", description: "Prenez rendez-vous pour l'entretien initial" },
      { key: "entretien_realise", titre: "Entretien réalisé", description: "Analyse de votre situation en cours" },
      { key: "convention_signee", titre: "Convention signée", description: "Honoraires validés, procédure lancée" },
      { key: "pieces_en_attente", titre: "Collecte des pièces", description: "Rassemblement des justificatifs" },
      { key: "mise_en_demeure", titre: "Mise en demeure", description: "Courrier envoyé à la banque" },
    ];

    const currentIndex = allSteps.findIndex(s => s.key === statut);
    
    return allSteps.map((step, index) => ({
      ...step,
      statut: index < currentIndex ? "completed" : index === currentIndex ? "current" : "pending"
    }));
  };

  const timeline = getTimelineFromStatut(displayDossier.statut);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Bonjour {displayName} 👋
        </h1>
        <p className="text-muted-foreground">
          Voici l&apos;état d&apos;avancement de votre dossier.
        </p>
      </div>

      {/* Carte principale - Statut du dossier */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <Clock className="w-3 h-3 mr-1" />
                  {statutLabels[displayDossier.statut] || displayDossier.statut}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Réf: {displayDossier.reference}
                </span>
              </div>
              <h2 className="text-xl font-serif font-bold text-foreground mb-2">
                Dossier contre {displayBanque}
              </h2>
              {displayMontant > 0 && (
                <p className="text-muted-foreground mb-4">
                  Préjudice estimé : <span className="font-semibold text-foreground">{displayMontant.toLocaleString('fr-FR')} €</span>
                </p>
              )}
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-amber-700">
                  {displayDossier.statut === "nouveau" 
                    ? "Prochaine étape : Planifier votre entretien initial"
                    : "Consultez l'avancement ci-dessous"}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard/dossier">
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Voir le dossier
                </Button>
              </Link>
              <Link href="/dashboard/pieces">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Upload className="w-4 h-4 mr-2" />
                  Importer des pièces
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-serif font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <TrendingUp className="w-5 h-5 text-primary" />
              Avancement de votre dossier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {timeline.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.statut === "completed" 
                        ? "bg-green-100 text-green-600" 
                        : event.statut === "current"
                        ? "bg-accent/20 text-accent"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {event.statut === "completed" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className={`w-0.5 h-full mt-2 ${
                        event.statut === "completed" ? "bg-green-200" : "bg-border"
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <h4 className={`font-semibold mb-1 ${
                      event.statut === "pending" ? "text-muted-foreground" : "text-foreground"
                    }`}>
                      {event.titre}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions / Pièces */}
        <Card className={documentsCount < 3 ? "border-amber-200 bg-amber-50/50" : ""}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 font-serif ${documentsCount < 3 ? "text-amber-800" : ""}`}>
              {documentsCount < 3 ? (
                <>
                  <AlertCircle className="w-5 h-5" />
                  Pièces à importer
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Documents importés
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {documentsCount < 3 ? (
              <>
                <p className="text-sm text-amber-700 mb-4">
                  Pour avancer sur votre dossier, importez vos documents :
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      1
                    </span>
                    <span className="text-amber-900">Relevés de compte bancaire</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      2
                    </span>
                    <span className="text-amber-900">Captures des virements frauduleux</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      3
                    </span>
                    <span className="text-amber-900">Échanges avec la banque</span>
                  </li>
                </ul>
                <Link href="/dashboard/pieces">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    Importer mes pièces
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Vous avez importé {documentsCount} document(s).
                </p>
                <Link href="/dashboard/pieces">
                  <Button variant="outline" className="w-full">
                    Gérer mes documents
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/messages">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <MessageSquare className="w-6 h-6 text-primary" />
                <span>Envoyer un message</span>
              </Button>
            </Link>
            <Link href="/dashboard/rendez-vous">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                <span>Mes rendez-vous</span>
              </Button>
            </Link>
            <Link href="/dashboard/pieces">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Upload className="w-6 h-6 text-primary" />
                <span>Ajouter des pièces</span>
              </Button>
            </Link>
            <Link href="/dashboard/dossier">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <FileText className="w-6 h-6 text-primary" />
                <span>Consulter mon dossier</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
