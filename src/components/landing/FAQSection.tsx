"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export function FAQSection() {
  const faqs = [
    {
      question: "Quels types de fraudes bancaires traitez-vous ?",
      answer: `Nous traitons principalement les fraudes au faux conseiller bancaire (spoofing téléphonique), 
      le phishing, les virements non autorisés, et les escroqueries par manipulation. 
      Notre expertise couvre tous les cas où la banque a manqué à ses obligations de sécurité 
      prévues par le Code monétaire et financier.`,
    },
    {
      question: "Combien de temps dure une procédure ?",
      answer: `La phase amiable (mise en demeure) dure en moyenne 2 à 4 semaines. 
      Si la banque refuse de coopérer et qu'une procédure judiciaire est nécessaire, 
      comptez entre 6 et 12 mois pour obtenir un jugement. 
      Notre process automatisé permet de réduire significativement ces délais.`,
    },
    {
      question: "Quelles sont mes chances de succès ?",
      answer: `Sur les dossiers que nous acceptons, notre taux de succès est de 85%. 
      Ce taux élevé s'explique par notre sélection rigoureuse des dossiers lors de l'analyse gratuite initiale. 
      Nous ne prenons que les cas où la responsabilité de la banque peut être démontrée.`,
    },
    {
      question: "Combien coûte votre intervention ?",
      answer: `L'analyse de votre dossier est gratuite et sans engagement. 
      Pour l'accompagnement complet, nous proposons des honoraires adaptés à votre préjudice, 
      souvent avec une part de résultat. Concrètement, si vous ne gagnez pas, vous ne payez pas. 
      Notre process automatisé nous permet d'être 40% moins chers qu'un cabinet traditionnel.`,
    },
    {
      question: "Ma banque dit que c'est de ma faute. Que faire ?",
      answer: `C'est la stratégie classique des banques : accuser le client de négligence. 
      Cependant, la jurisprudence est claire : la banque a une obligation de sécurité renforcée. 
      Elle doit prouver votre négligence grave, ce qui est très difficile dans les cas de spoofing sophistiqué. 
      Notre expertise juridique permet de contrer efficacement ces arguments.`,
    },
    {
      question: "Quels documents dois-je fournir ?",
      answer: `Les documents essentiels sont : vos relevés de compte montrant les opérations frauduleuses, 
      les captures d'écran des virements, vos échanges avec la banque, le dépôt de plainte, 
      et une pièce d'identité. Notre espace client vous guide pas à pas dans le téléchargement 
      et la classification de vos pièces.`,
    },
    {
      question: "Puis-je suivre l'avancement de mon dossier ?",
      answer: `Absolument ! Vous disposez d'un espace client sécurisé accessible 24h/24 
      où vous pouvez suivre chaque étape de votre dossier, consulter les documents générés, 
      et échanger directement avec le cabinet. La transparence est au cœur de notre approche.`,
    },
    {
      question: "Que se passe-t-il si je perds le procès ?",
      answer: `Avec notre système d'honoraires de résultat, si nous perdons, vous n'avez rien à payer 
      au titre de nos honoraires. Vous devrez simplement régler les frais de justice obligatoires 
      (environ 150€ de frais de procédure). C'est pourquoi nous sélectionnons rigoureusement 
      les dossiers que nous acceptons.`,
    },
  ];

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Questions fréquentes</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            Vous avez des <span className="text-accent">questions ?</span>
          </h2>
          
          <p className="text-lg text-muted-foreground">
            Retrouvez les réponses aux questions les plus fréquemment posées par nos clients.
          </p>
        </div>

        {/* Accordéon FAQ */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card rounded-xl border border-border/50 px-6 shadow-elegant data-[state=open]:shadow-elegant-lg transition-shadow"
            >
              <AccordionTrigger className="text-left font-serif font-semibold text-foreground hover:text-accent transition-colors py-6 [&[data-state=open]]:text-accent">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact supplémentaire */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Vous ne trouvez pas la réponse à votre question ?
          </p>
          <a 
            href="#contact" 
            className="text-accent hover:text-accent/80 font-medium transition-colors"
          >
            Contactez-nous directement →
          </a>
        </div>
      </div>
    </section>
  );
}

