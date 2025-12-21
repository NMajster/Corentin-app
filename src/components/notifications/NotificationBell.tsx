"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bell,
  FileText,
  MessageSquare,
  Calendar,
  AlertCircle,
  CheckCircle,
  X,
  Mail,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  nouveau_compte_rendu: {
    icon: MessageSquare,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  echeance_proche: {
    icon: Calendar,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  echeance_passee: {
    icon: AlertCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  changement_statut: {
    icon: CheckCircle,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  message_avocat: {
    icon: Mail,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.est_lue).length;

  // Charger les notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      const supabase = createClient();

      // Vérifier l'utilisateur
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Récupérer les notifications
      const { data, error } = await supabase
        .from("notifications_client")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data) {
        setNotifications(data);
      }

      setIsLoading(false);
    };

    fetchNotifications();

    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Marquer une notification comme lue
  const markAsRead = async (notifId: string) => {
    const supabase = createClient();
    
    const { error } = await supabase
      .from("notifications_client")
      .update({ est_lue: true, date_lue: new Date().toISOString() })
      .eq("id", notifId);

    if (!error) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, est_lue: true } : n))
      );
    }
  };

  // Marquer toutes comme lues
  const markAllAsRead = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { error } = await supabase
      .from("notifications_client")
      .update({ est_lue: true, date_lue: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("est_lue", false);

    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, est_lue: true })));
    }
  };

  // Formater la date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  // Gérer le clic sur une notification
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.est_lue) {
      await markAsRead(notification.id);
    }
    
    if (notification.lien_action) {
      window.location.href = notification.lien_action;
    }
    
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        {/* Header */}
        <div className="p-3 border-b flex items-center justify-between">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-primary"
              onClick={markAllAsRead}
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>

        {/* Liste des notifications */}
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Chargement...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">
                Aucune notification
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notif) => {
                const config = typeConfig[notif.type];
                const Icon = config.icon;

                return (
                  <button
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`w-full text-left p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                      !notif.est_lue ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${config.bgColor}`}
                      >
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm ${
                              !notif.est_lue
                                ? "font-semibold"
                                : "font-medium text-foreground"
                            }`}
                          >
                            {notif.titre}
                          </p>
                          {!notif.est_lue && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(notif.created_at)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - Voir toutes */}
        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              className="w-full text-sm text-primary"
              onClick={() => {
                window.location.href = "/dashboard/notifications";
                setIsOpen(false);
              }}
            >
              Voir toutes les notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

