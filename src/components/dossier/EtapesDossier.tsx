"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  FileWarning,
  Scale,
  Gavel,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  MapPin,
  User,
  Phone,
  FileText,
  Award,
  Download,
  Bell,
  MessageSquare,
  Eye,
  CalendarClock,
  Paperclip,
} from "lucide-react";
import { useState } from "react";

// Types
type TypeEtape =
  | "courrier_recommande"
  | "mise_en_demeure"
  | "saisine_mediateur"
  | "assignation_placement"
  | "assignation_audience_procedure"
  | "assignation_audience_plaidoirie"
  | "decision_judiciaire";

type StatutEtape = "a_venir" | "en_cours" | "terminee" | "annulee";

interface Echeance {
  id: string;
  nature: string;
  date: string;
  heure?: string;
  lieu?: string;
  estPassee: boolean;
}

interface CompteRendu {
  id: string;
  titre: string;
  contenu: string;
  resumeClient?: string;
  dateEvenement?: string;
  createdAt: string;
}

interface PieceEtape {
  id: string;
  nomFichier: string;
  description?: string;
  typePiece?: string;
  datePiece?: string;
  storagePath: string;
  isNew?: boolean; // Pour l'indicateur "Nouveau"
}

interface Etape {
  id: string;
  type: TypeEtape;
  statut: StatutEtape;
  titre: string;
  description?: string;
  datePrevue?: string;
  dateRealisee?: string;
  details?: Record<string, unknown>;
  sousEtapes?: Etape[];
  // Nouveaux champs
  echeances?: Echeance[];
  comptesRendus?: CompteRendu[];
  pieces?: PieceEtape[];
}

// Configuration des types d'étapes
const etapeConfig: Record<
  TypeEtape,
  { icon: typeof Mail; label: string; color: string; bgColor: string }
> = {
  courrier_recommande: {
    icon: Mail,
    label: "Courrier recommandé",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  mise_en_demeure: {
    icon: FileWarning,
    label: "Mise en demeure",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  saisine_mediateur: {
    icon: Scale,
    label: "Saisine du médiateur",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  assignation_placement: {
    icon: Gavel,
    label: "Placement de l'assignation",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  assignation_audience_procedure: {
    icon: Calendar,
    label: "Audience de procédure",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  assignation_audience_plaidoirie: {
    icon: Gavel,
    label: "Audience de plaidoirie",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  decision_judiciaire: {
    icon: Award,
    label: "Décision judiciaire",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
};

// Configuration des statuts
const statutConfig: Record<
  StatutEtape,
  { label: string; color: string; bgColor: string; icon: typeof Clock }
> = {
  a_venir: {
    label: "À venir",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    icon: Clock,
  },
  en_cours: {
    label: "En cours",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    icon: AlertCircle,
  },
  terminee: {
    label: "Terminée",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    icon: CheckCircle,
  },
  annulee: {
    label: "Annulée",
    color: "text-gray-400",
    bgColor: "bg-gray-50",
    icon: Clock,
  },
};

// Composant pour afficher une échéance
function EcheanceItem({ echeance }: { echeance: Echeance }) {
  const isPast = echeance.estPassee;
  const isUpcoming = !isPast && new Date(echeance.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg ${
        isPast
          ? "bg-gray-50"
          : isUpcoming
          ? "bg-amber-50 border border-amber-200"
          : "bg-blue-50"
      }`}
    >
      <CalendarClock
        className={`w-5 h-5 mt-0.5 ${
          isPast ? "text-gray-400" : isUpcoming ? "text-amber-600" : "text-blue-600"
        }`}
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className={`font-medium ${isPast ? "text-gray-500" : "text-foreground"}`}>
            {echeance.nature}
          </p>
          {isUpcoming && !isPast && (
            <Badge className="bg-amber-100 text-amber-700 text-xs">
              <Bell className="w-3 h-3 mr-1" />
              Bientôt
            </Badge>
          )}
          {isPast && (
            <Badge className="bg-gray-100 text-gray-500 text-xs">Passée</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {echeance.date}
          {echeance.heure && ` à ${echeance.heure}`}
        </p>
        {echeance.lieu && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" />
            {echeance.lieu}
          </p>
        )}
      </div>
    </div>
  );
}

// Composant pour afficher un compte-rendu
function CompteRenduItem({ cr }: { cr: CompteRendu }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-emerald-600 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">{cr.titre}</p>
            {cr.dateEvenement && (
              <p className="text-xs text-muted-foreground">
                Événement du {cr.dateEvenement}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-emerald-600"
        >
          <Eye className="w-4 h-4 mr-1" />
          {isExpanded ? "Masquer" : "Lire"}
        </Button>
      </div>
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-emerald-200">
          <p className="text-sm text-foreground whitespace-pre-line">
            {cr.resumeClient || cr.contenu}
          </p>
        </div>
      )}
    </div>
  );
}

// Composant pour afficher une pièce jointe
function PieceItem({ piece }: { piece: PieceEtape }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Paperclip className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">{piece.nomFichier}</p>
            {piece.isNew && (
              <Badge className="bg-accent text-accent-foreground text-xs">
                Nouveau
              </Badge>
            )}
          </div>
          {piece.description && (
            <p className="text-xs text-muted-foreground">{piece.description}</p>
          )}
          {piece.typePiece && (
            <Badge variant="outline" className="text-xs mt-1">
              {piece.typePiece}
            </Badge>
          )}
        </div>
      </div>
      <Button variant="ghost" size="sm">
        <Download className="w-4 h-4" />
      </Button>
    </div>
  );
}

// Composant pour une étape individuelle
function EtapeItem({ etape, isLast }: { etape: Etape; isLast: boolean }) {
  const [isExpanded, setIsExpanded] = useState(
    etape.statut === "en_cours" || 
    (etape.pieces && etape.pieces.some(p => p.isNew))
  );
  const config = etapeConfig[etape.type];
  const statut = statutConfig[etape.statut];
  const Icon = config.icon;
  const StatutIcon = statut.icon;

  const hasDetails = etape.details && Object.keys(etape.details).length > 0;
  const hasSousEtapes = etape.sousEtapes && etape.sousEtapes.length > 0;
  const hasEcheances = etape.echeances && etape.echeances.length > 0;
  const hasComptesRendus = etape.comptesRendus && etape.comptesRendus.length > 0;
  const hasPieces = etape.pieces && etape.pieces.length > 0;
  const hasContent = hasDetails || hasSousEtapes || hasEcheances || hasComptesRendus || hasPieces;

  // Compter les nouveautés
  const newPiecesCount = etape.pieces?.filter(p => p.isNew).length || 0;

  return (
    <div className="relative">
      {/* Ligne verticale de connexion */}
      {!isLast && (
        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200" />
      )}

      <div
        className={`relative flex gap-4 ${
          etape.statut === "annulee" ? "opacity-50" : ""
        }`}
      >
        {/* Icône */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.bgColor} ${config.color} z-10`}
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* Contenu */}
        <div className="flex-1 pb-6">
          <div
            className={`p-4 rounded-lg border ${
              etape.statut === "en_cours"
                ? "border-blue-200 bg-blue-50/50"
                : newPiecesCount > 0
                ? "border-accent/50 bg-accent/5"
                : "border-gray-100 bg-white"
            }`}
          >
            {/* En-tête */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-foreground">
                    {etape.titre}
                  </h4>
                  <Badge className={`${statut.bgColor} ${statut.color} text-xs`}>
                    <StatutIcon className="w-3 h-3 mr-1" />
                    {statut.label}
                  </Badge>
                  {newPiecesCount > 0 && (
                    <Badge className="bg-accent text-accent-foreground text-xs">
                      {newPiecesCount} nouveau{newPiecesCount > 1 ? "x" : ""}
                    </Badge>
                  )}
                </div>
                {etape.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {etape.description}
                  </p>
                )}
              </div>

              {/* Dates */}
              <div className="text-right text-sm flex-shrink-0">
                {etape.dateRealisee ? (
                  <p className="text-emerald-600 font-medium">
                    {etape.dateRealisee}
                  </p>
                ) : etape.datePrevue ? (
                  <p className="text-muted-foreground">
                    Prévu : {etape.datePrevue}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Bouton pour développer les détails */}
            {hasContent && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-sm text-primary mt-3 hover:underline"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                {isExpanded ? "Masquer les détails" : "Voir les détails"}
                {!isExpanded && (hasEcheances || hasComptesRendus || hasPieces) && (
                  <span className="text-xs text-muted-foreground ml-2">
                    ({[
                      hasEcheances && `${etape.echeances!.length} échéance(s)`,
                      hasComptesRendus && `${etape.comptesRendus!.length} CR`,
                      hasPieces && `${etape.pieces!.length} pièce(s)`,
                    ].filter(Boolean).join(", ")})
                  </span>
                )}
              </button>
            )}

            {/* Contenu étendu */}
            {isExpanded && (
              <div className="mt-4 space-y-4">
                {/* Échéances à venir */}
                {hasEcheances && (
                  <div>
                    <h5 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <CalendarClock className="w-4 h-4" />
                      Échéances
                    </h5>
                    <div className="space-y-2">
                      {etape.echeances!.map((ech) => (
                        <EcheanceItem key={ech.id} echeance={ech} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Comptes-rendus */}
                {hasComptesRendus && (
                  <div>
                    <h5 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Comptes-rendus
                    </h5>
                    <div className="space-y-2">
                      {etape.comptesRendus!.map((cr) => (
                        <CompteRenduItem key={cr.id} cr={cr} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Pièces jointes */}
                {hasPieces && (
                  <div>
                    <h5 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <Paperclip className="w-4 h-4" />
                      Documents
                    </h5>
                    <div className="space-y-2">
                      {etape.pieces!.map((piece) => (
                        <PieceItem key={piece.id} piece={piece} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Détails de l'étape */}
                {hasDetails && (
                  <div className="pt-2 border-t border-gray-100">
                    {renderDetails(etape.type, etape.details!)}
                  </div>
                )}

                {/* Sous-étapes (pour assignation) */}
                {hasSousEtapes && (
                  <div className="pt-2 border-t border-gray-100">
                    <h5 className="text-sm font-medium text-muted-foreground mb-2">
                      Étapes de la procédure
                    </h5>
                    {etape.sousEtapes!.map((sousEtape, idx) => (
                      <div
                        key={sousEtape.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg mb-2"
                      >
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{sousEtape.titre}</p>
                          {sousEtape.datePrevue && (
                            <p className="text-xs text-muted-foreground">
                              {sousEtape.dateRealisee || sousEtape.datePrevue}
                            </p>
                          )}
                        </div>
                        <Badge
                          className={`${statutConfig[sousEtape.statut].bgColor} ${
                            statutConfig[sousEtape.statut].color
                          } text-xs`}
                        >
                          {statutConfig[sousEtape.statut].label}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Fonction pour afficher les détails selon le type
function renderDetails(type: TypeEtape, details: Record<string, unknown>) {
  switch (type) {
    case "courrier_recommande":
      return (
        <div className="space-y-2">
          {details.destinataire && (
            <DetailRow
              icon={User}
              label="Destinataire"
              value={details.destinataire as string}
            />
          )}
          {details.numero_suivi && (
            <DetailRow
              icon={FileText}
              label="N° de suivi"
              value={details.numero_suivi as string}
            />
          )}
          {details.accuse_reception && (
            <DetailRow
              icon={CheckCircle}
              label="Accusé de réception"
              value={`Reçu le ${details.date_reception}`}
              success
            />
          )}
        </div>
      );

    case "mise_en_demeure":
      return (
        <div className="space-y-2">
          {details.montant_reclame && (
            <DetailRow
              icon={FileText}
              label="Montant réclamé"
              value={`${Number(details.montant_reclame).toLocaleString("fr-FR")} €`}
            />
          )}
          {details.delai_reponse_jours && (
            <DetailRow
              icon={Clock}
              label="Délai de réponse"
              value={`${details.delai_reponse_jours} jours`}
            />
          )}
          {details.reponse_recue && (
            <DetailRow
              icon={Mail}
              label="Réponse"
              value={details.contenu_reponse as string}
            />
          )}
        </div>
      );

    case "saisine_mediateur":
      return (
        <div className="space-y-2">
          {details.mediateur && (
            <DetailRow
              icon={User}
              label="Médiateur"
              value={details.mediateur as string}
            />
          )}
          {details.numero_dossier_mediateur && (
            <DetailRow
              icon={FileText}
              label="N° de dossier"
              value={details.numero_dossier_mediateur as string}
            />
          )}
          {details.decision && (
            <DetailRow
              icon={Award}
              label="Décision"
              value={
                details.decision === "favorable"
                  ? "Favorable"
                  : details.decision === "defavorable"
                  ? "Défavorable"
                  : details.decision === "partiel"
                  ? "Partiellement favorable"
                  : "En attente"
              }
              success={details.decision === "favorable"}
            />
          )}
        </div>
      );

    case "assignation_placement":
      return (
        <div className="space-y-2">
          {details.huissier_nom && (
            <DetailRow
              icon={User}
              label="Huissier"
              value={details.huissier_nom as string}
            />
          )}
          {details.huissier_adresse && (
            <DetailRow
              icon={MapPin}
              label="Adresse"
              value={details.huissier_adresse as string}
            />
          )}
          {details.huissier_telephone && (
            <DetailRow
              icon={Phone}
              label="Téléphone"
              value={details.huissier_telephone as string}
            />
          )}
          {details.juridiction && (
            <DetailRow
              icon={Gavel}
              label="Juridiction"
              value={details.juridiction as string}
            />
          )}
          {details.numero_rg && (
            <DetailRow
              icon={FileText}
              label="N° RG"
              value={details.numero_rg as string}
            />
          )}
        </div>
      );

    case "decision_judiciaire":
      return (
        <div className="space-y-2">
          {details.sens_decision && (
            <DetailRow
              icon={Award}
              label="Sens de la décision"
              value={
                details.sens_decision === "favorable"
                  ? "Favorable"
                  : details.sens_decision === "defavorable"
                  ? "Défavorable"
                  : "Partiellement favorable"
              }
              success={details.sens_decision === "favorable"}
            />
          )}
          {details.montant_principal_alloue && (
            <DetailRow
              icon={FileText}
              label="Principal alloué"
              value={`${Number(details.montant_principal_alloue).toLocaleString(
                "fr-FR"
              )} €`}
            />
          )}
          {details.montant_article_700 && (
            <DetailRow
              icon={FileText}
              label="Article 700"
              value={`${Number(details.montant_article_700).toLocaleString(
                "fr-FR"
              )} €`}
            />
          )}
        </div>
      );

    default:
      return null;
  }
}

// Composant pour une ligne de détail
function DetailRow({
  icon: Icon,
  label,
  value,
  success,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  success?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <Icon
        className={`w-4 h-4 mt-0.5 ${
          success ? "text-emerald-500" : "text-muted-foreground"
        }`}
      />
      <div>
        <span className="text-muted-foreground">{label} : </span>
        <span className={success ? "text-emerald-600 font-medium" : ""}>
          {value}
        </span>
      </div>
    </div>
  );
}

// Composant principal
export function EtapesDossier() {
  // Données de démonstration enrichies - à connecter avec Supabase
  const etapes: Etape[] = [
    {
      id: "1",
      type: "mise_en_demeure",
      statut: "terminee",
      titre: "Mise en demeure",
      description: "Envoi de la mise en demeure à la banque",
      datePrevue: "15/12/2024",
      dateRealisee: "15/12/2024",
      details: {
        destinataire: "Société Générale - Service Réclamations",
        montant_reclame: 5500,
        delai_reponse_jours: 15,
        reponse_recue: true,
        date_reponse: "28/12/2024",
        contenu_reponse: "Refus de remboursement - négligence grave invoquée",
      },
      pieces: [
        {
          id: "p1",
          nomFichier: "Mise_en_demeure_SG_15122024.pdf",
          description: "Mise en demeure envoyée à la Société Générale",
          typePiece: "Mise en demeure",
          datePiece: "15/12/2024",
          storagePath: "/documents/...",
        },
        {
          id: "p2",
          nomFichier: "AR_Mise_en_demeure.pdf",
          description: "Accusé de réception",
          typePiece: "Accusé réception",
          datePiece: "18/12/2024",
          storagePath: "/documents/...",
        },
      ],
      comptesRendus: [
        {
          id: "cr1",
          titre: "Réponse de la banque",
          contenu: "La Société Générale a répondu le 28/12/2024 en refusant le remboursement, invoquant une négligence grave de votre part. Cette position est contestable et nous allons poursuivre la procédure.",
          dateEvenement: "28/12/2024",
          createdAt: "28/12/2024",
        },
      ],
    },
    {
      id: "2",
      type: "saisine_mediateur",
      statut: "en_cours",
      titre: "Saisine du médiateur bancaire",
      description: "Tentative de médiation en cours",
      datePrevue: "10/01/2025",
      dateRealisee: "10/01/2025",
      details: {
        mediateur: "Médiateur de la Fédération Bancaire Française",
        numero_dossier_mediateur: "MED-2025-00123",
        decision: "en_attente",
      },
      echeances: [
        {
          id: "e1",
          nature: "Délai de réponse du médiateur",
          date: "10/03/2025",
          estPassee: false,
        },
      ],
      pieces: [
        {
          id: "p3",
          nomFichier: "Saisine_mediateur_FBF.pdf",
          description: "Dossier de saisine du médiateur",
          typePiece: "Saisine",
          datePiece: "10/01/2025",
          storagePath: "/documents/...",
          isNew: true,
        },
      ],
    },
    {
      id: "3",
      type: "assignation_placement",
      statut: "a_venir",
      titre: "Assignation en justice",
      description: "Préparation de l'assignation devant le Tribunal",
      datePrevue: "Mars 2025",
      details: {},
      echeances: [
        {
          id: "e2",
          nature: "Préparation de l'assignation",
          date: "15/03/2025",
          estPassee: false,
        },
      ],
      sousEtapes: [
        {
          id: "3-1",
          type: "assignation_placement",
          statut: "a_venir",
          titre: "Placement de l'assignation",
        },
        {
          id: "3-2",
          type: "assignation_audience_procedure",
          statut: "a_venir",
          titre: "Audiences de procédure",
        },
        {
          id: "3-3",
          type: "assignation_audience_plaidoirie",
          statut: "a_venir",
          titre: "Audience de plaidoirie",
        },
      ],
    },
    {
      id: "4",
      type: "decision_judiciaire",
      statut: "a_venir",
      titre: "Décision judiciaire",
      description: "Jugement du tribunal",
      details: {},
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif flex items-center gap-2">
          <Scale className="w-5 h-5 text-primary" />
          Avancement de la procédure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {etapes.map((etape, index) => (
            <EtapeItem
              key={etape.id}
              etape={etape}
              isLast={index === etapes.length - 1}
            />
          ))}
        </div>

        {/* Légende */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-muted-foreground mb-2">Légende :</p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(statutConfig).map(([key, config]) => (
              <Badge
                key={key}
                className={`${config.bgColor} ${config.color} text-xs`}
              >
                {config.label}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
