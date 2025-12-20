-- ===========================================
-- Schéma de base de données Supabase
-- Plateforme Défense des Épargnants
-- ===========================================

-- Extension pour générer des UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- Tables principales
-- ===========================================

-- Table des profils clients (complète les données auth.users)
CREATE TABLE IF NOT EXISTS profils_clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    adresse TEXT,
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    date_naissance DATE,
    lieu_naissance VARCHAR(100),
    nationalite VARCHAR(50) DEFAULT 'Française',
    banque_concernee VARCHAR(100),
    montant_prejudice DECIMAL(12, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des dossiers juridiques
CREATE TABLE IF NOT EXISTS dossiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reference VARCHAR(50) UNIQUE DEFAULT ('DOS-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTR(uuid_generate_v4()::TEXT, 1, 8)),
    statut VARCHAR(50) DEFAULT 'nouveau' CHECK (statut IN (
        'nouveau',
        'en_attente_entretien',
        'entretien_realise',
        'convention_signee',
        'pieces_en_attente',
        'mise_en_demeure',
        'reponse_banque',
        'assignation',
        'audience',
        'jugement',
        'clos_succes',
        'clos_echec',
        'abandonne'
    )),
    type_contentieux VARCHAR(50) DEFAULT 'fraude_bancaire' CHECK (type_contentieux IN (
        'fraude_bancaire',
        'faux_conseiller',
        'phishing',
        'litige_assurance',
        'credit_abusif',
        'placement_toxique',
        'autre'
    )),
    date_entretien TIMESTAMPTZ,
    convention_signee BOOLEAN DEFAULT FALSE,
    honoraires DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des pièces justificatives
CREATE TABLE IF NOT EXISTS pieces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dossier_id UUID REFERENCES dossiers(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    nom_fichier VARCHAR(255) NOT NULL,
    type_piece VARCHAR(50) NOT NULL CHECK (type_piece IN (
        'releve_compte',
        'capture_virement',
        'echange_banque',
        'depot_plainte',
        'piece_identite',
        'justificatif_domicile',
        'autre'
    )),
    url_stockage TEXT NOT NULL,
    numero_bordereau INTEGER,
    indexee BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des modèles de documents
CREATE TABLE IF NOT EXISTS modeles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255) NOT NULL,
    matiere VARCHAR(100) NOT NULL,
    contenu_template TEXT NOT NULL,
    zones_auto JSONB DEFAULT '[]'::JSONB,
    zones_fixes JSONB DEFAULT '[]'::JSONB,
    zones_libres JSONB DEFAULT '[]'::JSONB,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des documents générés
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dossier_id UUID REFERENCES dossiers(id) ON DELETE CASCADE NOT NULL,
    modele_id UUID REFERENCES modeles(id) ON DELETE SET NULL,
    type_document VARCHAR(50) NOT NULL CHECK (type_document IN (
        'convention_honoraires',
        'mise_en_demeure',
        'assignation',
        'conclusions',
        'bordereau_pieces',
        'courrier',
        'autre'
    )),
    contenu_genere TEXT,
    statut VARCHAR(20) DEFAULT 'brouillon' CHECK (statut IN (
        'brouillon',
        'en_cours',
        'valide',
        'envoye',
        'archive'
    )),
    url_pdf TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des bordereaux de pièces
CREATE TABLE IF NOT EXISTS bordereaux (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL UNIQUE,
    liste_pieces JSONB DEFAULT '[]'::JSONB,
    contenu TEXT,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des références juridiques
CREATE TABLE IF NOT EXISTS references_juridiques (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'article_loi',
        'jurisprudence',
        'directive',
        'reglement'
    )),
    code_ou_juridiction VARCHAR(100),
    reference VARCHAR(255) NOT NULL,
    intitule TEXT NOT NULL,
    extrait TEXT,
    url_source TEXT,
    matiere VARCHAR(100),
    date_decision DATE,
    mots_cles TEXT[],
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Index pour les performances
-- ===========================================

CREATE INDEX IF NOT EXISTS idx_profils_clients_user_id ON profils_clients(user_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_user_id ON dossiers(user_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_statut ON dossiers(statut);
CREATE INDEX IF NOT EXISTS idx_dossiers_reference ON dossiers(reference);
CREATE INDEX IF NOT EXISTS idx_pieces_dossier_id ON pieces(dossier_id);
CREATE INDEX IF NOT EXISTS idx_pieces_user_id ON pieces(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_dossier_id ON documents(dossier_id);
CREATE INDEX IF NOT EXISTS idx_references_juridiques_type ON references_juridiques(type);
CREATE INDEX IF NOT EXISTS idx_references_juridiques_matiere ON references_juridiques(matiere);

-- ===========================================
-- Triggers pour updated_at automatique
-- ===========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profils_clients_updated_at
    BEFORE UPDATE ON profils_clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dossiers_updated_at
    BEFORE UPDATE ON dossiers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modeles_updated_at
    BEFORE UPDATE ON modeles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- Row Level Security (RLS)
-- ===========================================

-- Activer RLS sur toutes les tables
ALTER TABLE profils_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE bordereaux ENABLE ROW LEVEL SECURITY;

-- Politique pour profils_clients : un utilisateur ne voit que son profil
CREATE POLICY "Users can view own profile"
    ON profils_clients FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON profils_clients FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
    ON profils_clients FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Politique pour dossiers : un utilisateur ne voit que ses dossiers
CREATE POLICY "Users can view own dossiers"
    ON dossiers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dossiers"
    ON dossiers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Politique pour pieces : un utilisateur ne voit que ses pièces
CREATE POLICY "Users can view own pieces"
    ON pieces FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pieces"
    ON pieces FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pieces"
    ON pieces FOR DELETE
    USING (auth.uid() = user_id);

-- Politique pour documents : via le dossier
CREATE POLICY "Users can view documents of own dossiers"
    ON documents FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM dossiers
        WHERE dossiers.id = documents.dossier_id
        AND dossiers.user_id = auth.uid()
    ));

-- Politique pour bordereaux : via le document
CREATE POLICY "Users can view bordereaux of own documents"
    ON bordereaux FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM documents
        JOIN dossiers ON dossiers.id = documents.dossier_id
        WHERE documents.id = bordereaux.document_id
        AND dossiers.user_id = auth.uid()
    ));

-- Les modèles et références juridiques sont publics en lecture
ALTER TABLE modeles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Modeles are viewable by authenticated users"
    ON modeles FOR SELECT
    TO authenticated
    USING (actif = TRUE);

ALTER TABLE references_juridiques ENABLE ROW LEVEL SECURITY;
CREATE POLICY "References juridiques are viewable by authenticated users"
    ON references_juridiques FOR SELECT
    TO authenticated
    USING (active = TRUE);

-- ===========================================
-- Storage Buckets (à créer via l'interface Supabase)
-- ===========================================

-- Bucket "pieces" pour les pièces justificatives
-- Configurer via l'interface Supabase :
-- - Nom : pieces
-- - Public : Non
-- - Allowed MIME types : application/pdf, image/jpeg, image/png, image/webp
-- - Max file size : 10MB

-- Bucket "documents" pour les documents générés
-- Configurer via l'interface Supabase :
-- - Nom : documents
-- - Public : Non
-- - Allowed MIME types : application/pdf
-- - Max file size : 20MB

-- ===========================================
-- Table des paiements (Stripe)
-- ===========================================

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
    stripe_payment_intent_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending',
        'completed',
        'failed',
        'refunded'
    )),
    payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN (
        'entretien_initial',
        'convention_honoraires',
        'frais_huissier',
        'frais_annexes'
    )),
    email VARCHAR(255),
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session ON payments(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
    ON payments FOR SELECT
    USING (auth.uid() = user_id);

-- ===========================================
-- Table des rendez-vous
-- ===========================================

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    dossier_id UUID REFERENCES dossiers(id) ON DELETE SET NULL,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'entretien_initial',
        'suivi',
        'signature_convention',
        'autre'
    )),
    date_heure TIMESTAMPTZ NOT NULL,
    duree_minutes INTEGER DEFAULT 45,
    statut VARCHAR(50) DEFAULT 'reserve' CHECK (statut IN (
        'reserve',
        'confirme',
        'realise',
        'annule',
        'reporte'
    )),
    notes TEXT,
    lien_visio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date_heure);
CREATE INDEX IF NOT EXISTS idx_appointments_statut ON appointments(statut);

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own appointments"
    ON appointments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own appointments"
    ON appointments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
    ON appointments FOR UPDATE
    USING (auth.uid() = user_id);

-- ===========================================
-- Table des créneaux disponibles (gérée par admin)
-- ===========================================

CREATE TABLE IF NOT EXISTS available_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date_heure TIMESTAMPTZ NOT NULL UNIQUE,
    duree_minutes INTEGER DEFAULT 45,
    disponible BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_available_slots_date ON available_slots(date_heure);
CREATE INDEX IF NOT EXISTS idx_available_slots_disponible ON available_slots(disponible);

ALTER TABLE available_slots ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut voir les créneaux disponibles
CREATE POLICY "Anyone can view available slots"
    ON available_slots FOR SELECT
    TO authenticated
    USING (disponible = TRUE);

-- ===========================================
-- Données de test (optionnel)
-- ===========================================

-- Insérer quelques références juridiques de base
INSERT INTO references_juridiques (type, code_ou_juridiction, reference, intitule, extrait, matiere) VALUES
('article_loi', 'Code monétaire et financier', 'L133-18', 'Responsabilité du prestataire de services de paiement', 'En cas d''opération de paiement non autorisée signalée par l''utilisateur...', 'fraude_bancaire'),
('article_loi', 'Code monétaire et financier', 'L133-19', 'Charge de la preuve', 'Lorsqu''un utilisateur de services de paiement nie avoir autorisé une opération de paiement...', 'fraude_bancaire'),
('jurisprudence', 'Cour de cassation, chambre commerciale', '19-12.345', 'Arrêt du 12 novembre 2020 - Négligence grave', 'La négligence grave ne peut être déduite du seul fait que...', 'fraude_bancaire'),
('directive', 'Union Européenne', 'DSP2 (UE) 2015/2366', 'Directive sur les services de paiement 2', 'Établit les règles relatives aux services de paiement...', 'fraude_bancaire')
ON CONFLICT DO NOTHING;


