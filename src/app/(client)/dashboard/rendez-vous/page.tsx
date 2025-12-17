import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  Plus,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function RendezVousPage() {
  // Données de démonstration
  const prochainRdv = {
    date: "20 décembre 2024",
    heure: "14:00",
    duree: "30 minutes",
    type: "visio",
    typeLabel: "Visioconférence",
    objet: "Point d'avancement sur le dossier",
    avocat: "Me. Nathanaël MAJSTER",
  };

  const historiqueRdv = [
    {
      date: "18 décembre 2024",
      heure: "14:00",
      type: "telephone",
      typeLabel: "Téléphone",
      objet: "Entretien initial",
      statut: "realise",
      notes: "Analyse du dossier effectuée. Bonnes chances de succès.",
    },
  ];

  const creneaux = [
    { date: "Lun. 23 déc.", heures: ["09:00", "10:30", "14:00", "16:00"] },
    { date: "Mar. 24 déc.", heures: ["09:00", "11:00", "15:00"] },
    { date: "Jeu. 26 déc.", heures: ["10:00", "14:30", "16:30"] },
    { date: "Ven. 27 déc.", heures: ["09:30", "11:00", "14:00"] },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "visio":
        return Video;
      case "telephone":
        return Phone;
      case "cabinet":
        return MapPin;
      default:
        return Calendar;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Rendez-vous
        </h1>
        <p className="text-muted-foreground">
          Planifiez et gérez vos rendez-vous avec votre avocat
        </p>
      </div>

      {/* Prochain RDV */}
      {prochainRdv && (
        <Card className="border-2 border-accent/30 bg-accent/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-serif text-accent">
                <Calendar className="w-5 h-5" />
                Prochain rendez-vous
              </CardTitle>
              <Badge className="bg-accent text-primary">
                Dans 2 jours
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-serif font-bold text-foreground">
                      20
                    </p>
                    <p className="text-sm text-muted-foreground">Décembre</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {prochainRdv.heure} ({prochainRdv.duree})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="w-4 h-4 text-muted-foreground" />
                      <span>{prochainRdv.typeLabel}</span>
                    </div>
                    <p className="text-muted-foreground">{prochainRdv.objet}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline">
                  Modifier le RDV
                </Button>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Video className="w-4 h-4 mr-2" />
                  Rejoindre la visio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prendre RDV */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Plus className="w-5 h-5 text-primary" />
              Prendre un nouveau rendez-vous
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Sélectionnez un créneau disponible pour planifier votre prochain rendez-vous.
            </p>

            <div className="space-y-6">
              {creneaux.map((jour) => (
                <div key={jour.date}>
                  <h4 className="font-semibold text-foreground mb-3">
                    {jour.date}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {jour.heures.map((heure) => (
                      <Button
                        key={`${jour.date}-${heure}`}
                        variant="outline"
                        size="sm"
                        className="hover:bg-primary hover:text-white hover:border-primary"
                      >
                        {heure}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">
                    Besoin d&apos;un créneau urgent ?
                  </p>
                  <p className="text-muted-foreground">
                    Contactez-nous par message pour une prise en charge rapide.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historique */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Clock className="w-5 h-5 text-primary" />
              Historique des rendez-vous
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historiqueRdv.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun rendez-vous passé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {historiqueRdv.map((rdv, index) => {
                  const TypeIcon = getTypeIcon(rdv.type);
                  return (
                    <div
                      key={index}
                      className="p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {rdv.objet}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{rdv.date}</span>
                              <span>•</span>
                              <span>{rdv.heure}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Réalisé
                        </Badge>
                      </div>
                      {rdv.notes && (
                        <div className="pl-13 ml-13">
                          <p className="text-sm text-muted-foreground bg-white p-3 rounded-lg border border-border">
                            <span className="font-medium text-foreground">Notes : </span>
                            {rdv.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Infos pratiques */}
      <Card className="bg-primary text-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <Video className="w-8 h-8 text-accent flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Visioconférence</h4>
                <p className="text-sm text-white/70">
                  Rendez-vous en ligne via notre plateforme sécurisée.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-8 h-8 text-accent flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Téléphone</h4>
                <p className="text-sm text-white/70">
                  Nous vous appelons au numéro enregistré.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="w-8 h-8 text-accent flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Cabinet</h4>
                <p className="text-sm text-white/70">
                  Sur rendez-vous à Paris (audience uniquement).
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

