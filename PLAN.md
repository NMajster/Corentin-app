# 📋 Plan de Développement - Défense des Épargnants

## 🎯 Vision Produit

Plateforme permettant aux victimes de fraude bancaire d'accéder à une assistance juridique professionnelle à tarif accessible, grâce à l'automatisation par IA sous contrôle humain.

---

## 🏗️ Architecture Globale

```mermaid
flowchart TB
    subgraph PUBLIC["🌐 Site Public"]
        LP[Landing Page]
        PRICING[Tarifs]
        FAQ[FAQ]
    end

    subgraph AUTH["🔐 Authentification"]
        PAY[Paiement Stripe]
        SIGNUP[Création Compte]
        VERIFY[Validation Email]
        LOGIN[Connexion]
    end

    subgraph CLIENT["👤 Espace Client"]
        CDASH[Dashboard]
        CPIECES[Mes Pièces]
        CCAL[Calendrier RDV]
        CREPORTS[Comptes Rendus]
        CMSG[Messages]
    end

    subgraph ADMIN["⚖️ Back-Office Avocat"]
        ADASH[Dashboard Admin]
        ACLIENTS[Liste Clients]
        ADOSSIER[Gestion Dossier]
        ADOCS[Validation Documents]
        AREPORTS[Rédaction CR]
        ACAL[Calendrier Global]
        AALERTS[Centre Alertes]
    end

    subgraph INFRA["☁️ Infrastructure"]
        SUPA[(Supabase)]
        STRIPE[Stripe]
        EMAIL[Resend/SendGrid]
        STORAGE[Supabase Storage]
    end

    LP -->|CTA| PAY
    PAY -->|Succès| SIGNUP
    SIGNUP -->|Email| VERIFY
    VERIFY -->|Validé| LOGIN
    LOGIN -->|Client| CDASH
    LOGIN -->|Avocat| ADASH

    CDASH --> CPIECES
    CDASH --> CCAL
    CDASH --> CREPORTS
    CDASH --> CMSG

    ADASH --> ACLIENTS
    ACLIENTS --> ADOSSIER
    ADOSSIER --> ADOCS
    ADOSSIER --> AREPORTS
    ADASH --> ACAL
    ADASH --> AALERTS

    CLIENT <-->|API| SUPA
    ADMIN <-->|API| SUPA
    PAY <-->|Webhook| STRIPE
    AUTH -->|Transactionnel| EMAIL
    CPIECES -->|Upload| STORAGE
```

---

## 👥 Parcours Utilisateur Client

```mermaid
journey
    title Parcours Client - De la découverte au remboursement
    section Découverte
      Visite Landing Page: 5: Client
      Lecture des sections: 4: Client
      Décision de prise de RDV: 5: Client
    section Inscription
      Paiement entretien initial: 4: Client
      Réception email confirmation: 5: Client
      Création mot de passe: 4: Client
      Validation email: 5: Client
    section Premier RDV
      Choix créneau calendrier: 5: Client
      Confirmation RDV: 5: Client
      Entretien 45min: 5: Client, Avocat
    section Constitution Dossier
      Réception convention honoraires: 4: Client
      Signature convention: 5: Client
      Upload pièces justificatives: 3: Client
      Validation pièces: 5: Avocat
    section Procédure
      Mise en demeure envoyée: 5: Avocat
      Suivi réponse banque: 4: Client
      Assignation si nécessaire: 4: Avocat
      Audiences: 4: Client, Avocat
    section Résolution
      Jugement: 5: Client
      Remboursement: 5: Client
```

---

## 🔄 États du Dossier

```mermaid
stateDiagram-v2
    [*] --> paiement_pending: Nouveau client

    paiement_pending --> rdv_pending: Paiement validé
    rdv_pending --> rdv_scheduled: RDV réservé
    rdv_scheduled --> convention_pending: RDV effectué
    
    convention_pending --> convention_signed: Convention signée
    convention_signed --> pieces_pending: En attente pièces
    
    pieces_pending --> mise_en_demeure: Pièces validées
    mise_en_demeure --> attente_reponse: MED envoyée
    
    attente_reponse --> clos_gagne: Banque accepte
    attente_reponse --> assignation: Banque refuse/silence
    
    assignation --> audience_scheduled: Assignation délivrée
    audience_scheduled --> jugement_pending: Audience tenue
    
    jugement_pending --> clos_gagne: Jugement favorable
    jugement_pending --> clos_perdu: Jugement défavorable
    
    pieces_pending --> clos_abandon: Client abandonne
    convention_pending --> clos_abandon: Client abandonne

    clos_gagne --> [*]
    clos_perdu --> [*]
    clos_abandon --> [*]
```

---

## 🗄️ Modèle de Données

```mermaid
erDiagram
    PROFILES ||--o{ DOSSIERS : "possède"
    PROFILES ||--o{ DOCUMENTS : "uploade"
    PROFILES ||--o{ APPOINTMENTS : "réserve"
    PROFILES ||--o{ ALERTS : "reçoit"
    PROFILES ||--o{ PAYMENTS : "effectue"
    
    DOSSIERS ||--o{ DOCUMENTS : "contient"
    DOSSIERS ||--o{ EVENTS : "a"
    DOSSIERS ||--o{ APPOINTMENTS : "concerne"
    DOSSIERS ||--o{ REPORTS : "a"
    DOSSIERS ||--o{ ALERTS : "génère"
    DOSSIERS ||--o{ PAYMENTS : "associé"
    
    EVENTS ||--o| REPORTS : "détaille"

    PROFILES {
        uuid id PK
        string email
        string full_name
        string phone
        enum role "client|avocat|assistant|admin"
        timestamp created_at
    }

    DOSSIERS {
        uuid id PK
        uuid client_id FK
        string reference "DDE-2025-0001"
        enum status
        string banque
        decimal montant_prejudice
        date date_fraude
        text description
        uuid avocat_assigne FK
        timestamp created_at
    }

    DOCUMENTS {
        uuid id PK
        uuid dossier_id FK
        uuid uploaded_by FK
        string file_name
        string file_path
        enum document_type
        enum status "uploaded|validated|rejected"
        jsonb metadata
        uuid validated_by FK
        timestamp created_at
    }

    EVENTS {
        uuid id PK
        uuid dossier_id FK
        enum event_type
        string title
        text description
        boolean is_public
        uuid created_by FK
        timestamp event_date
    }

    REPORTS {
        uuid id PK
        uuid dossier_id FK
        uuid event_id FK
        uuid author_id FK
        string title
        text content
        boolean is_published
        timestamp published_at
    }

    APPOINTMENTS {
        uuid id PK
        uuid dossier_id FK
        uuid client_id FK
        uuid avocat_id FK
        string title
        timestamp start_time
        timestamp end_time
        enum status
        string meeting_link
    }

    PAYMENTS {
        uuid id PK
        uuid dossier_id FK
        uuid client_id FK
        string stripe_payment_id
        decimal amount
        enum status
        timestamp paid_at
    }

    ALERTS {
        uuid id PK
        uuid dossier_id FK
        uuid target_user FK
        string title
        text message
        enum priority
        boolean is_read
        string action_url
    }
```

---

## 📁 Structure des Fichiers

```mermaid
flowchart LR
    subgraph APP["src/app/"]
        direction TB
        PUBLIC["(public)/"]
        AUTH["(auth)/"]
        CLIENT["(client)/"]
        ADMIN["(admin)/"]
        API["api/"]
    end

    subgraph PUBLIC_PAGES["Pages Publiques"]
        LP2[page.tsx - Landing]
        RDV[rendez-vous/]
    end

    subgraph AUTH_PAGES["Authentification"]
        LOGIN2[login/]
        SIGNUP2[signup/]
        VERIFY2[verify-email/]
        FORGOT[forgot-password/]
    end

    subgraph CLIENT_PAGES["Espace Client"]
        DASH[dashboard/]
        DOSSIER[dossier/]
        PIECES[pieces/]
        CAL[calendrier/]
        REPORTS2[rapports/]
        MSG[messages/]
    end

    subgraph ADMIN_PAGES["Back-Office"]
        ADASH2[admin/]
        CLIENTS2[clients/]
        DOSSIERS2[dossiers/]
        CALENDAR2[calendrier/]
        ALERTS2[alertes/]
    end

    subgraph API_ROUTES["API Routes"]
        WEBHOOK[webhooks/stripe/]
        UPLOAD[upload/]
        NOTIF[notifications/]
    end

    PUBLIC --> PUBLIC_PAGES
    AUTH --> AUTH_PAGES
    CLIENT --> CLIENT_PAGES
    ADMIN --> ADMIN_PAGES
    API --> API_ROUTES
```

---

## 🚀 Phases de Développement

```mermaid
gantt
    title Planning Développement - Défense des Épargnants
    dateFormat  YYYY-MM-DD
    
    section Phase 1 - Fondations
    Schéma BDD Supabase           :p1a, 2025-01-06, 2d
    Système rôles + middleware    :p1b, after p1a, 2d
    Intégration Stripe            :p1c, after p1b, 2d
    Flow paiement → compte        :p1d, after p1c, 1d
    Emails transactionnels        :p1e, after p1d, 1d
    
    section Phase 2 - Client
    Calendrier réservation RDV    :p2a, after p1e, 2d
    Upload documents + metadata   :p2b, after p2a, 3d
    Dashboard client timeline     :p2c, after p2b, 2d
    Interface messages            :p2d, after p2c, 1d
    
    section Phase 3 - Admin
    Dashboard admin               :p3a, after p2d, 2d
    Liste clients + recherche     :p3b, after p3a, 1d
    Gestion dossier complet       :p3c, after p3b, 3d
    Validation documents          :p3d, after p3c, 1d
    Rédaction comptes rendus      :p3e, after p3d, 2d
    
    section Phase 4 - Notifications
    Système alertes               :p4a, after p3e, 2d
    Emails automatiques           :p4b, after p4a, 2d
    Notifications temps réel      :p4c, after p4b, 1d
    
    section Phase 5 - Polish
    Tests & corrections           :p5a, after p4c, 3d
    Optimisation performance      :p5b, after p5a, 2d
    Mise en production            :p5c, after p5b, 1d
```

---

## ✅ Checklist par Phase

### Phase 1 - Fondations (8 jours)
- [ ] Créer les tables Supabase (profiles, dossiers, documents, events, etc.)
- [ ] Configurer Row Level Security (RLS) pour chaque table
- [ ] Implémenter le middleware de protection des routes par rôle
- [ ] Configurer Stripe (produit, prix, webhook)
- [ ] Créer la page de paiement
- [ ] Implémenter le webhook Stripe (création compte post-paiement)
- [ ] Configurer Resend pour les emails transactionnels
- [ ] Email de bienvenue + validation

### Phase 2 - Espace Client (8 jours)
- [ ] Système de créneaux disponibles
- [ ] Interface de réservation RDV
- [ ] Confirmation + rappels email
- [ ] Upload de fichiers vers Supabase Storage
- [ ] Formulaire métadonnées documents
- [ ] Liste des documents avec statuts
- [ ] Dashboard avec timeline dossier
- [ ] Affichage comptes rendus publiés
- [ ] Interface de messagerie simple

### Phase 3 - Back-Office (9 jours)
- [ ] Dashboard admin avec KPIs
- [ ] Liste clients avec filtres et recherche
- [ ] Vue détaillée dossier client
- [ ] Interface validation/rejet documents
- [ ] Éditeur de comptes rendus (Markdown)
- [ ] Publication vers client
- [ ] Calendrier vue globale (tous les RDV)
- [ ] Modification statut dossier

### Phase 4 - Notifications (5 jours)
- [ ] Table des alertes
- [ ] Génération automatique d'alertes
- [ ] Centre de notifications admin
- [ ] Emails automatiques (rappels, mises à jour)
- [ ] Notifications temps réel (Supabase Realtime)

### Phase 5 - Finalisation (6 jours)
- [ ] Tests end-to-end parcours client
- [ ] Tests end-to-end parcours admin
- [ ] Correction bugs
- [ ] Optimisation images et assets
- [ ] Configuration production Vercel
- [ ] Domaine personnalisé + SSL
- [ ] Monitoring (Sentry ou similaire)

---

## 📊 KPIs à Suivre

| Métrique | Objectif Phase 1 |
|----------|------------------|
| Clients inscrits | 100 |
| Taux conversion landing → paiement | 5% |
| RDV planifiés | 80 |
| Documents uploadés | 500 |
| Dossiers en cours | 50 |

---

## 🔐 Sécurité

- **Authentification** : Supabase Auth (JWT)
- **Autorisation** : Row Level Security (RLS) + middleware Next.js
- **Paiement** : Stripe (PCI DSS compliant)
- **Stockage** : Supabase Storage (buckets privés)
- **Emails** : Resend (SPF/DKIM configurés)
- **HTTPS** : Vercel (automatique)
- **RGPD** : Consentement + droit à l'oubli à implémenter

---

## 🛠️ Stack Technique

| Composant | Technologie |
|-----------|-------------|
| Frontend | Next.js 16 + React 19 |
| Styling | Tailwind CSS + Shadcn/UI |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Paiement | Stripe |
| Emails | Resend |
| Hébergement | Vercel |
| IA | OpenAI API (classification documents) |

