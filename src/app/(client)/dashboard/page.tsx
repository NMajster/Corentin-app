import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Upload, 
  MessageSquare, 
  Calendar,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // Données de démonstration
  const dossier = {
    reference: "DOS-20241217-abc123",
    statut: "pieces_en_attente",
    statutLabel: "Pièces en attente",
    dateCreation: "17 décembre 2024",
    prochainEtape: "Importer les pièces manquantes",
    montantPrejudice: 5500,
    banque: "Société Générale",
  };

  const stats = [
    { 
      label: "Pièces importées", 
      value: "3/6", 
      icon: Upload,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    { 
      label: "Messages non lus", 
      value: "2", 
      icon: MessageSquare,
      color: "text-primary",
      bgColor: "bg-primary/5"
    },
    { 
      label: "Prochain RDV", 
      value: "20 déc.", 
      icon: Calendar,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
  ];

  const timeline = [
    { 
      date: "17 déc. 2024", 
      titre: "Dossier créé", 
      description: "Votre dossier a été enregistré avec succès.",
      statut: "completed"
    },
    { 
      date: "18 déc. 2024", 
      titre: "Entretien initial", 
      description: "Rendez-vous téléphonique prévu à 14h00.",
      statut: "upcoming"
    },
    { 
      date: "À venir", 
      titre: "Analyse du dossier", 
      description: "Examen de vos pièces justificatives.",
      statut: "pending"
    },
    { 
      date: "À venir", 
      titre: "Mise en demeure", 
      description: "Envoi du courrier à votre banque.",
      statut: "pending"
    },
  ];

  const piecesManquantes = [
    "Relevés de compte des 3 derniers mois",
    "Capture du virement frauduleux",
    "Copie du dépôt de plainte",
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Bonjour Jean 👋
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
                  {dossier.statutLabel}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Réf: {dossier.reference}
                </span>
              </div>
              <h2 className="text-xl font-serif font-bold text-foreground mb-2">
                Dossier contre {dossier.banque}
              </h2>
              <p className="text-muted-foreground mb-4">
                Préjudice estimé : <span className="font-semibold text-foreground">{dossier.montantPrejudice.toLocaleString('fr-FR')} €</span>
              </p>
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-amber-700">
                  Prochaine étape : {dossier.prochainEtape}
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
                        : event.statut === "upcoming"
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
                    <p className="text-xs text-muted-foreground mb-1">
                      {event.date}
                    </p>
                    <h4 className="font-semibold text-foreground mb-1">
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

        {/* Pièces manquantes */}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-amber-800">
              <AlertCircle className="w-5 h-5" />
              Pièces manquantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700 mb-4">
              Pour avancer sur votre dossier, nous avons besoin des documents suivants :
            </p>
            <ul className="space-y-3 mb-6">
              {piecesManquantes.map((piece, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-amber-900">{piece}</span>
                </li>
              ))}
            </ul>
            <Link href="/dashboard/pieces">
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                Importer mes pièces
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
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
                <span>Planifier un RDV</span>
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

