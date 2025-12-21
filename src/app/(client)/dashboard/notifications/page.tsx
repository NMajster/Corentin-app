"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  FileText,
  MessageSquare,
  Calendar,
  AlertCircle,
  CheckCircle,
  Mail,
  CheckCheck,
  Trash2,
  Filter,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Notification {
  id: string;
  type: "nouvelle_piece" | "nouveau_compte_rendu" | "echeance_proche" | "echeance_passee" | "changement_statut" | "message_avocat";
  titre: string;
  message: string;
  lien_action?: string;
  est_lue: boolean;
  created_at: string;
}

const typeConfig = {
  nouvelle_piece: {
    icon: FileText,
    label: "Document",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  nouveau_compte_rendu: {
    icon: MessageSquare,
    label: "Compte-rendu",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  echeance_proche: {
    icon: Calendar,
    label: "Échéance",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  echeance_passee: {
    icon: AlertCircle,
    label: "Rappel",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  changement_statut: {
    icon: CheckCircle,
    label: "Statut",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  message_avocat: {
    icon: Mail,
    label: "Message",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Charger les notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("notifications_client")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setNotifications(data);
      }

      setIsLoading(false);
    };

    fetchNotifications();
  }, []);

  // Stats
  const unreadCount = notifications.filter((n) => !n.est_lue).length;
  const filteredNotifications = filter === "unread" 
    ? notifications.filter((n) => !n.est_lue)
    : notifications;

  // Marquer comme lue
  const markAsRead = async (notifId: string) => {
    const supabase = createClient();
    
    await supabase
      .from("notifications_client")
      .update({ est_lue: true, date_lue: new Date().toISOString() })
      .eq("id", notifId);

    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, est_lue: true } : n))
    );
  };

  // Marquer toutes comme lues
  const markAllAsRead = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    await supabase
      .from("notifications_client")
      .update({ est_lue: true, date_lue: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("est_lue", false);

    setNotifications((prev) => prev.map((n) => ({ ...n, est_lue: true })));
  };

  // Formater la date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Grouper par date
  const groupByDate = (notifs: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    notifs.forEach((notif) => {
      const date = new Date(notif.created_at);
      date.setHours(0, 0, 0, 0);
      
      let key: string;
      if (date.getTime() === today.getTime()) {
        key = "Aujourd'hui";
      } else if (date.getTime() === yesterday.getTime()) {
        key = "Hier";
      } else {
        key = date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(notif);
    });

    return groups;
  };

  const groupedNotifications = groupByDate(filteredNotifications);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Notifications
          </h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 
              ? `${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
              : "Toutes vos notifications sont lues"
            }
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          Toutes ({notifications.length})
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("unread")}
        >
          Non lues ({unreadCount})
        </Button>
      </div>

      {/* Liste des notifications */}
      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-pulse">Chargement...</div>
          </CardContent>
        </Card>
      ) : filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="w-16 h-16 mx-auto text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-medium mb-1">
              {filter === "unread" ? "Aucune notification non lue" : "Aucune notification"}
            </h3>
            <p className="text-muted-foreground text-sm">
              {filter === "unread" 
                ? "Vous avez lu toutes vos notifications"
                : "Vous n'avez pas encore reçu de notification"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([date, notifs]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                {date}
              </h3>
              <Card>
                <CardContent className="p-0">
                  {notifs.map((notif, index) => {
                    const config = typeConfig[notif.type];
                    const Icon = config.icon;

                    return (
                      <div
                        key={notif.id}
                        className={`flex items-start gap-4 p-4 ${
                          index !== notifs.length - 1 ? "border-b" : ""
                        } ${!notif.est_lue ? "bg-blue-50/50" : ""}`}
                      >
                        {/* Icône */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.bgColor}`}
                        >
                          <Icon className={`w-5 h-5 ${config.color}`} />
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className={`font-medium ${!notif.est_lue ? "text-foreground" : "text-muted-foreground"}`}>
                                  {notif.titre}
                                </p>
                                <Badge className={`${config.bgColor} ${config.color} text-xs`}>
                                  {config.label}
                                </Badge>
                                {!notif.est_lue && (
                                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notif.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {formatDate(notif.created_at)}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-3">
                            {notif.lien_action && (
                              <Button asChild size="sm" variant="outline">
                                <Link href={notif.lien_action}>
                                  Voir le détail
                                </Link>
                              </Button>
                            )}
                            {!notif.est_lue && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notif.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Marquer comme lu
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Paramètres de notification */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Paramètres de notification</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Vous recevez des notifications par email et dans l&apos;application pour :
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Nouveaux documents ajoutés à votre dossier
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Comptes-rendus d&apos;audience
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Échéances à venir (3 jours avant)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Changement de statut du dossier
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Messages de votre avocat
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

