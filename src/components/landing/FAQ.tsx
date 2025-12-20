"use client";

import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export function FAQ() {
  const faqs = [
    {
      question: "Quels types de fraude traitez-vous ?",
      answer: "Nous sommes spécialisés dans les fraudes au faux conseiller bancaire (spoofing), le phishing, les virements frauduleux et toutes les arnaques où la banque a manqué à ses obligations de sécurité. Nous n'intervenons pas sur les fraudes à la carte bancaire simples (généralement remboursées facilement).",
    },
    {
      question: "Ma banque dit que c'est ma faute, ai-je une chance ?",
      answer: "Les banques invoquent systématiquement la \"négligence grave\" du client. Cependant, la jurisprudence récente est très favorable aux victimes. La charge de la preuve repose sur la banque, qui doit démontrer votre négligence. Dans 85% des cas que nous acceptons, nous obtenons gain de cause.",
    },
    {
      question: "Combien de temps dure la procédure ?",
      answer: "La phase amiable (mise en demeure) prend environ 1 à 2 mois. Si la banque refuse, la procédure judiciaire dure généralement 8 à 12 mois. Grâce à notre process optimisé, nous réduisons ces délais au minimum. Vous pouvez suivre l'avancement en temps réel sur votre espace client.",
    },
    {
      question: "Que se passe-t-il si je perds ?",
      answer: "Vous ne payez que les frais fixes (990€). Les honoraires de résultat (15%) ne s'appliquent qu'en cas de succès. C'est pourquoi nous sélectionnons soigneusement les dossiers : nous ne prenons que ceux avec de réelles chances de succès.",
    },
    {
      question: "Dois-je me déplacer pour les rendez-vous ?",
      answer: "Non, tout se fait à distance. L'entretien initial est réalisé par visioconférence ou téléphone. Vous importez vos documents via notre plateforme sécurisée et suivez votre dossier depuis votre espace client. En cas d'audience, nous vous représentons au tribunal.",
    },
    {
      question: "Comment sont protégées mes données personnelles ?",
      answer: "Vos données sont hébergées en France sur des serveurs sécurisés (Supabase). Nous sommes conformes au RGPD et au secret professionnel de l'avocat. Vos documents sont chiffrés et accessibles uniquement par vous et votre avocat référent.",
    },
    {
      question: "Puis-je changer d'avis après avoir signé ?",
      answer: "Vous bénéficiez d'un délai de rétractation de 14 jours après la signature de la convention d'honoraires, conformément au Code de la consommation. Passé ce délai, vous pouvez toujours résilier, mais les prestations déjà réalisées resteront dues.",
    },
    {
      question: "Travaillez-vous avec toutes les banques ?",
      answer: "Oui, nous intervenons contre toutes les banques françaises : Société Générale, BNP Paribas, Crédit Agricole, LCL, Banque Populaire, Caisse d'Épargne, Boursorama, etc. Chaque établissement a ses spécificités, que nous maîtrisons parfaitement.",
    },
  ];

  return (
    <section id="faq" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            <HelpCircle className="w-4 h-4 mr-2" />
            Questions fréquentes
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            Vous avez des questions ?
          </h2>
          <p className="text-lg text-muted-foreground">
            Retrouvez les réponses aux questions les plus fréquentes. 
            Si vous ne trouvez pas ce que vous cherchez, contactez-nous.
          </p>
        </div>

        {/* Accordion FAQ */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-xl border border-border px-6 data-[state=open]:shadow-elegant transition-shadow"
              >
                <AccordionTrigger className="text-left font-serif font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="max-w-xl mx-auto text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Vous ne trouvez pas la réponse à votre question ?
          </p>
          <a
            href="mailto:contact@defense-epargnants.fr"
            className="inline-flex items-center text-primary font-semibold hover:text-accent transition-colors"
          >
            Contactez-nous directement
          </a>
        </div>
      </div>
    </section>
  );
}




