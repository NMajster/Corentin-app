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
  CheckCircle,
  AlertTriangle,
  Download,
  ExternalLink,
  Phone,
  Mail,
  FolderOpen,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function DossierPage() {
  // Données de démonstration - à connecter avec Supabase
  const dossier = {
    reference: "DOS-20241217-abc123",
    dateCreation: "17 décembre 2024",
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
  ];

  // Nombre de pièces importées (à connecter avec Supabase Storage)
  const piecesImportees = 10;

  // Prochaine étape définie par l'avocat (sera éditable depuis le back-office)
  const prochaineEtape = {
    titre: "Constitution du dossier",
    description: "Nous analysons vos pièces et préparons la stratégie.",
  };

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
                  <p className="text-sm text-muted-foreground">Pièces importées</p>
                  <p className="text-2xl font-bold text-foreground">{piecesImportees}</p>
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
                <p className="text-sm text-muted-foreground mb-1">Prochaine étape</p>
                <p className="font-semibold text-foreground">{prochaineEtape.titre}</p>
                <p className="text-sm text-muted-foreground mt-1">{prochaineEtape.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Documents à venir</p>
                    <p className="text-sm text-muted-foreground">
                      Les documents de procédure seront ajoutés ici au fur et à mesure de l&apos;avancement de votre dossier.
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


