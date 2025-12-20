import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  User,
  Building2,
  Calendar,
  Euro,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  ExternalLink,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";

export default function DossierPage() {
  // Données de démonstration
  const dossier = {
    reference: "DOS-20241217-abc123",
    dateCreation: "17 décembre 2024",
    statut: "pieces_en_attente",
    statutLabel: "Pièces en attente",
    typeContentieux: "Fraude au faux conseiller",
  };

  const client = {
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@email.fr",
    telephone: "06 12 34 56 78",
    adresse: "123 Rue de Paris",
    codePostal: "75001",
    ville: "Paris",
    dateNaissance: "15/03/1980",
    lieuNaissance: "Lyon",
  };

  const affaire = {
    banque: "Société Générale",
    montantPrejudice: 5500,
    dateIncident: "15 novembre 2024",
    descriptionFaits: `Le 15 novembre 2024, j'ai reçu un appel téléphonique d'une personne se présentant comme conseiller de la Société Générale. 
    
Cette personne connaissait mon nom, mon adresse et mon numéro de compte. Elle m'a alerté sur des mouvements suspects sur mon compte et m'a demandé de valider des opérations pour "sécuriser" mon compte.

Sous la pression et la panique, j'ai validé via l'application mobile trois virements pour un total de 5 500€ vers des comptes que je ne connaissais pas.

Après avoir raccroché, j'ai contacté ma vraie agence qui m'a confirmé qu'il s'agissait d'une fraude. J'ai immédiatement fait opposition et déposé plainte.

La banque refuse de me rembourser en invoquant ma "négligence grave".`,
  };

  const documents = [
    {
      nom: "Convention d'honoraires",
      type: "convention_honoraires",
      statut: "signe",
      date: "18 décembre 2024",
    },
    {
      nom: "Mise en demeure",
      type: "mise_en_demeure",
      statut: "en_attente",
      date: null,
    },
  ];

  const etapes = [
    { label: "Création dossier", completed: true, date: "17/12/2024" },
    { label: "Entretien initial", completed: true, date: "18/12/2024" },
    { label: "Convention signée", completed: true, date: "18/12/2024" },
    { label: "Pièces complètes", completed: false, date: null },
    { label: "Mise en demeure", completed: false, date: null },
    { label: "Réponse banque", completed: false, date: null },
    { label: "Assignation", completed: false, date: null },
    { label: "Jugement", completed: false, date: null },
  ];

  const currentStep = etapes.findIndex((e) => !e.completed);
  const progress = Math.round((currentStep / etapes.length) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Mon dossier
          </h1>
          <p className="text-muted-foreground">
            Référence : {dossier.reference}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter en PDF
          </Button>
        </div>
      </div>

      {/* Barre de progression */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Progression du dossier</h3>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <Clock className="w-3 h-3 mr-1" />
              {dossier.statutLabel}
            </Badge>
          </div>
          
          {/* Progress bar */}
          <div className="relative mb-6">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="absolute right-0 -top-6 text-sm font-medium text-primary">
              {progress}%
            </span>
          </div>

          {/* Étapes */}
          <div className="flex justify-between overflow-x-auto pb-2">
            {etapes.map((etape, index) => (
              <div key={index} className="flex flex-col items-center min-w-[80px]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  etape.completed 
                    ? "bg-green-100 text-green-600" 
                    : index === currentStep
                    ? "bg-accent/20 text-accent border-2 border-accent"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {etape.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <span className={`text-xs text-center ${
                  etape.completed || index === currentStep
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}>
                  {etape.label}
                </span>
                {etape.date && (
                  <span className="text-xs text-muted-foreground mt-1">
                    {etape.date}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="infos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="infos">Informations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        {/* Tab Informations */}
        <TabsContent value="infos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations client */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <User className="w-5 h-5 text-primary" />
                  Vos informations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium">{client.nom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prénom</p>
                    <p className="font-medium">{client.prenom}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{client.telephone}</span>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Adresse</p>
                  <p>{client.adresse}</p>
                  <p>{client.codePostal} {client.ville}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date de naissance</p>
                    <p className="font-medium">{client.dateNaissance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lieu de naissance</p>
                    <p className="font-medium">{client.lieuNaissance}</p>
                  </div>
                </div>
                <Link href="/dashboard/profil">
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Modifier mes informations →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Informations affaire */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Building2 className="w-5 h-5 text-primary" />
                  L&apos;affaire
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type de contentieux</p>
                  <Badge className="mt-1 bg-primary/10 text-primary">
                    {dossier.typeContentieux}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Banque concernée</p>
                    <p className="font-medium">{affaire.banque}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Euro className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Montant du préjudice</p>
                    <p className="font-medium text-lg">{affaire.montantPrejudice.toLocaleString('fr-FR')} €</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date de l&apos;incident</p>
                    <p className="font-medium">{affaire.dateIncident}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description des faits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <FileText className="w-5 h-5 text-primary" />
                Description des faits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                {affaire.descriptionFaits}
              </div>
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
                          <p className="text-sm text-muted-foreground">{doc.date}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {doc.statut === "signe" ? (
                        <>
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Signé
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Badge variant="outline" className="text-amber-600 border-amber-200">
                          <Clock className="w-3 h-3 mr-1" />
                          En attente
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">Documents à venir</p>
                    <p className="text-sm text-amber-700">
                      La mise en demeure sera générée une fois toutes vos pièces importées.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Historique */}
        <TabsContent value="historique" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Historique des actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { date: "18 déc. 2024 - 15:30", action: "Convention d'honoraires signée", type: "success" },
                  { date: "18 déc. 2024 - 14:00", action: "Entretien téléphonique réalisé", type: "success" },
                  { date: "17 déc. 2024 - 10:15", action: "3 pièces importées", type: "info" },
                  { date: "17 déc. 2024 - 09:30", action: "Dossier créé", type: "info" },
                ].map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      event.type === "success" ? "bg-green-500" : "bg-primary"
                    }`} />
                    <div>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                      <p className="font-medium">{event.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
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


