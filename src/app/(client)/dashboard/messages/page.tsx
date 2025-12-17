"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  Paperclip,
  Search,
  CheckCheck,
  Clock,
} from "lucide-react";

interface Message {
  id: string;
  expediteur: "client" | "avocat";
  contenu: string;
  date: string;
  heure: string;
  lu: boolean;
}

export default function MessagesPage() {
  const [newMessage, setNewMessage] = useState("");

  // Données de démonstration
  const messages: Message[] = [
    {
      id: "1",
      expediteur: "avocat",
      contenu: "Bonjour Jean, je fais suite à notre entretien de ce matin. J'ai bien noté les éléments de votre dossier. Pour avancer, j'aurais besoin des relevés de compte des 3 derniers mois ainsi que la copie de votre dépôt de plainte. Pouvez-vous les importer via votre espace client ?",
      date: "18 déc. 2024",
      heure: "15:30",
      lu: true,
    },
    {
      id: "2",
      expediteur: "client",
      contenu: "Bonjour, merci pour cet entretien très instructif. Je vais importer les documents demandés dans la journée. J'ai une question : dois-je inclure les relevés de mon compte courant ou seulement celui concerné par la fraude ?",
      date: "18 déc. 2024",
      heure: "16:45",
      lu: true,
    },
    {
      id: "3",
      expediteur: "avocat",
      contenu: "Seulement le compte concerné par la fraude suffira. Les relevés doivent montrer les mouvements avant et après les virements frauduleux. N'hésitez pas à surligner les opérations concernées.",
      date: "18 déc. 2024",
      heure: "17:00",
      lu: false,
    },
    {
      id: "4",
      expediteur: "avocat",
      contenu: "Par ailleurs, avez-vous bien reçu la convention d'honoraires par email ? Merci de la signer électroniquement pour que nous puissions officialiser notre collaboration.",
      date: "18 déc. 2024",
      heure: "17:02",
      lu: false,
    },
  ];

  const handleSend = () => {
    if (newMessage.trim()) {
      // Ici on enverrait le message à Supabase
      console.log("Envoi du message:", newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Messages
        </h1>
        <p className="text-muted-foreground">
          Échangez avec votre avocat référent
        </p>
      </div>

      {/* Conversation */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {/* Header conversation */}
        <CardHeader className="border-b border-border py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-white">ME</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base font-serif">
                  Me. Nathanaël MAJSTER
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Avocat, ancien magistrat • En ligne
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => {
            const isClient = message.expediteur === "client";
            const showDate =
              index === 0 || messages[index - 1].date !== message.date;

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <Badge variant="outline" className="text-xs font-normal">
                      {message.date}
                    </Badge>
                  </div>
                )}
                <div
                  className={`flex gap-3 ${isClient ? "flex-row-reverse" : ""}`}
                >
                  {!isClient && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-white text-xs">
                        ME
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[75%] ${
                      isClient ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`p-4 rounded-2xl ${
                        isClient
                          ? "bg-primary text-white rounded-tr-md"
                          : "bg-muted rounded-tl-md"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.contenu}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${
                        isClient ? "justify-end" : ""
                      }`}
                    >
                      <span>{message.heure}</span>
                      {isClient && (
                        message.lu ? (
                          <CheckCheck className="w-4 h-4 text-accent" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>

        {/* Zone de saisie */}
        <div className="border-t border-border p-4">
          <div className="flex items-end gap-3">
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Paperclip className="w-5 h-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Écrivez votre message..."
                className="pr-12 py-6"
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="bg-primary hover:bg-primary/90 flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Réponse sous 24h ouvrées • Appuyez sur Entrée pour envoyer
          </p>
        </div>
      </Card>
    </div>
  );
}

