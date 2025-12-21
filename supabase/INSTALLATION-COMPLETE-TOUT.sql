-- ============================================
-- INSTALLATION COMPLÈTE DE TOUTE LA BASE
-- Défense des Épargnants - Projet Corentin
-- ============================================
-- EXÉCUTEZ CE FICHIER UNE SEULE FOIS
-- ============================================

-- Extension pour générer des UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PARTIE 1: TABLES DE BASE
-- ============================================

-- Table des profils clients
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
    reference VARCHAR(50) UNIQUE,
    statut VARCHAR(50) DEFAULT 'nouveau',
    type_contentieux VARCHAR(50) DEFAULT 'fraude_bancaire',
    date_entretien TIMESTAMPTZ,
    convention_signee BOOLEAN DEFAULT FALSE,
    honoraires DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des pièces justificatives
CREATE TABLE IF NOT EXISTS pieces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dossier_id UUID REFERENCES dossiers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    nom_fichier VARCHAR(255) NOT NULL,
    type_piece VARCHAR(50),
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
    dossier_id UUID REFERENCES dossiers(id) ON DELETE CASCADE,
    modele_id UUID REFERENCES modeles(id) ON DELETE SET NULL,
    type_document VARCHAR(50),
    contenu_genere TEXT,
    statut VARCHAR(20) DEFAULT 'brouillon',
    url_pdf TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des bordereaux de pièces
CREATE TABLE IF NOT EXISTS bordereaux (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE UNIQUE,
    liste_pieces JSONB DEFAULT '[]'::JSONB,
    contenu TEXT,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des références juridiques
CREATE TABLE IF NOT EXISTS references_juridiques (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50),
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

-- Table des paiements
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
    stripe_payment_intent_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(50) DEFAULT 'pending',
    payment_type VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Table des rendez-vous
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    dossier_id UUID REFERENCES dossiers(id) ON DELETE SET NULL,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL,
    date_heure TIMESTAMPTZ NOT NULL,
    duree_minutes INTEGER DEFAULT 45,
    statut VARCHAR(50) DEFAULT 'reserve',
    notes TEXT,
    lien_visio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des créneaux disponibles
CREATE TABLE IF NOT EXISTS available_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date_heure TIMESTAMPTZ NOT NULL UNIQUE,
    duree_minutes INTEGER DEFAULT 45,
    disponible BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des documents clients uploadés
CREATE TABLE IF NOT EXISTS client_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    email VARCHAR(255),
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size INTEGER,
    file_path TEXT NOT NULL,
    designation VARCHAR(255),
    date_piece DATE,
    commentaire TEXT,
    dossier_id UUID REFERENCES dossiers(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PARTIE 2: INDEX
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profils_clients_user_id ON profils_clients(user_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_user_id ON dossiers(user_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_statut ON dossiers(statut);
CREATE INDEX IF NOT EXISTS idx_dossiers_reference ON dossiers(reference);
CREATE INDEX IF NOT EXISTS idx_pieces_dossier_id ON pieces(dossier_id);
CREATE INDEX IF NOT EXISTS idx_pieces_user_id ON pieces(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_dossier_id ON documents(dossier_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session ON payments(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date_heure);
CREATE INDEX IF NOT EXISTS idx_client_documents_user_id ON client_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_email ON client_documents(email);

-- ============================================
-- PARTIE 3: RLS (Row Level Security)
-- ============================================

ALTER TABLE profils_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE bordereaux ENABLE ROW LEVEL SECURITY;
ALTER TABLE modeles ENABLE ROW LEVEL SECURITY;
ALTER TABLE references_juridiques ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;

-- Politiques profils_clients
DROP POLICY IF EXISTS "Users can view own profile" ON profils_clients;
CREATE POLICY "Users can view own profile" ON profils_clients FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON profils_clients;
CREATE POLICY "Users can update own profile" ON profils_clients FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profils_clients;
CREATE POLICY "Users can insert own profile" ON profils_clients FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques dossiers
DROP POLICY IF EXISTS "Users can view own dossiers" ON dossiers;
CREATE POLICY "Users can view own dossiers" ON dossiers FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own dossiers" ON dossiers;
CREATE POLICY "Users can insert own dossiers" ON dossiers FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own dossiers" ON dossiers;
CREATE POLICY "Users can update own dossiers" ON dossiers FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pieces
DROP POLICY IF EXISTS "Users can view own pieces" ON pieces;
CREATE POLICY "Users can view own pieces" ON pieces FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own pieces" ON pieces;
CREATE POLICY "Users can insert own pieces" ON pieces FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own pieces" ON pieces;
CREATE POLICY "Users can delete own pieces" ON pieces FOR DELETE USING (auth.uid() = user_id);

-- Politiques documents
DROP POLICY IF EXISTS "Users can view documents of own dossiers" ON documents;
CREATE POLICY "Users can view documents of own dossiers" ON documents FOR SELECT
    USING (EXISTS (SELECT 1 FROM dossiers WHERE dossiers.id = documents.dossier_id AND dossiers.user_id = auth.uid()));

-- Politiques bordereaux
DROP POLICY IF EXISTS "Users can view bordereaux of own documents" ON bordereaux;
CREATE POLICY "Users can view bordereaux of own documents" ON bordereaux FOR SELECT
    USING (EXISTS (SELECT 1 FROM documents JOIN dossiers ON dossiers.id = documents.dossier_id WHERE documents.id = bordereaux.document_id AND dossiers.user_id = auth.uid()));

-- Politiques modeles
DROP POLICY IF EXISTS "Modeles are viewable by authenticated users" ON modeles;
CREATE POLICY "Modeles are viewable by authenticated users" ON modeles FOR SELECT TO authenticated USING (actif = TRUE);

-- Politiques references_juridiques
DROP POLICY IF EXISTS "References juridiques are viewable by authenticated users" ON references_juridiques;
CREATE POLICY "References juridiques are viewable by authenticated users" ON references_juridiques FOR SELECT TO authenticated USING (active = TRUE);

-- Politiques payments
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);

-- Politiques appointments
DROP POLICY IF EXISTS "Users can view own appointments" ON appointments;
CREATE POLICY "Users can view own appointments" ON appointments FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own appointments" ON appointments;
CREATE POLICY "Users can insert own appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;
CREATE POLICY "Users can update own appointments" ON appointments FOR UPDATE USING (auth.uid() = user_id);

-- Politiques available_slots
DROP POLICY IF EXISTS "Anyone can view available slots" ON available_slots;
CREATE POLICY "Anyone can view available slots" ON available_slots FOR SELECT TO authenticated USING (disponible = TRUE);

-- Politiques client_documents
DROP POLICY IF EXISTS "Users can view own client_documents" ON client_documents;
CREATE POLICY "Users can view own client_documents" ON client_documents FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own client_documents" ON client_documents;
CREATE POLICY "Users can insert own client_documents" ON client_documents FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own client_documents" ON client_documents;
CREATE POLICY "Users can update own client_documents" ON client_documents FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own client_documents" ON client_documents;
CREATE POLICY "Users can delete own client_documents" ON client_documents FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- PARTIE 4: TYPES ÉNUMÉRÉS POUR ÉTAPES
-- ============================================

DO $$ BEGIN
    CREATE TYPE type_etape AS ENUM (
        'courrier_recommande', 'mise_en_demeure', 'saisine_mediateur',
        'assignation_placement', 'assignation_audience_procedure',
        'assignation_audience_plaidoirie', 'decision_judiciaire'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE statut_etape AS ENUM ('a_venir', 'en_cours', 'terminee', 'annulee');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE type_notification AS ENUM (
        'nouvelle_piece', 'nouveau_compte_rendu', 'echeance_proche',
        'echeance_passee', 'changement_statut', 'message_avocat'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- PARTIE 5: TABLE DES ÉTAPES DU DOSSIER
-- ============================================

CREATE TABLE IF NOT EXISTS etapes_dossier (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dossier_id UUID REFERENCES dossiers(id) ON DELETE CASCADE NOT NULL,
    type_etape type_etape NOT NULL,
    statut statut_etape DEFAULT 'a_venir',
    ordre INTEGER NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    date_prevue DATE,
    date_realisee DATE,
    date_limite DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    details JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_etapes_dossier_dossier_id ON etapes_dossier(dossier_id);
CREATE INDEX IF NOT EXISTS idx_etapes_dossier_type ON etapes_dossier(type_etape);
CREATE INDEX IF NOT EXISTS idx_etapes_dossier_statut ON etapes_dossier(statut);

ALTER TABLE etapes_dossier ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients can view own dossier etapes" ON etapes_dossier;
CREATE POLICY "Clients can view own dossier etapes" ON etapes_dossier FOR SELECT
    USING (dossier_id IN (SELECT id FROM dossiers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Avocats can manage etapes" ON etapes_dossier;
CREATE POLICY "Avocats can manage etapes" ON etapes_dossier FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- PARTIE 6: TABLE DES AUDIENCES
-- ============================================

CREATE TABLE IF NOT EXISTS audiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etape_id UUID REFERENCES etapes_dossier(id) ON DELETE CASCADE,
    type_audience VARCHAR(50) NOT NULL,
    date_audience DATE NOT NULL,
    heure TIME,
    salle VARCHAR(100),
    est_renvoi BOOLEAN DEFAULT FALSE,
    motif_renvoi TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audiences_etape_id ON audiences(etape_id);
ALTER TABLE audiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view audiences of own dossier" ON audiences;
CREATE POLICY "Users can view audiences of own dossier" ON audiences FOR SELECT
    USING (etape_id IN (SELECT id FROM etapes_dossier WHERE dossier_id IN (SELECT id FROM dossiers WHERE user_id = auth.uid())));

-- ============================================
-- PARTIE 7: TABLE DES ÉCHÉANCES PAR ÉTAPE
-- ============================================

CREATE TABLE IF NOT EXISTS echeances_etape (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etape_id UUID REFERENCES etapes_dossier(id) ON DELETE CASCADE NOT NULL,
    nature VARCHAR(255) NOT NULL,
    date_echeance DATE NOT NULL,
    heure TIME,
    lieu VARCHAR(255),
    est_passee BOOLEAN DEFAULT FALSE,
    rappel_envoye BOOLEAN DEFAULT FALSE,
    jours_rappel_avant INTEGER DEFAULT 3,
    notes_avocat TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_echeances_etape_id ON echeances_etape(etape_id);
CREATE INDEX IF NOT EXISTS idx_echeances_date ON echeances_etape(date_echeance);
ALTER TABLE echeances_etape ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients can view echeances of own dossier" ON echeances_etape;
CREATE POLICY "Clients can view echeances of own dossier" ON echeances_etape FOR SELECT
    USING (etape_id IN (SELECT id FROM etapes_dossier WHERE dossier_id IN (SELECT id FROM dossiers WHERE user_id = auth.uid())));

-- ============================================
-- PARTIE 8: TABLE DES COMPTES-RENDUS
-- ============================================

CREATE TABLE IF NOT EXISTS comptes_rendus_etape (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etape_id UUID REFERENCES etapes_dossier(id) ON DELETE CASCADE NOT NULL,
    echeance_id UUID REFERENCES echeances_etape(id) ON DELETE SET NULL,
    titre VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,
    resume_client TEXT,
    date_evenement DATE,
    est_visible_client BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_cr_etape_id ON comptes_rendus_etape(etape_id);
ALTER TABLE comptes_rendus_etape ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients can view visible comptes rendus" ON comptes_rendus_etape;
CREATE POLICY "Clients can view visible comptes rendus" ON comptes_rendus_etape FOR SELECT
    USING (est_visible_client = TRUE AND etape_id IN (SELECT id FROM etapes_dossier WHERE dossier_id IN (SELECT id FROM dossiers WHERE user_id = auth.uid())));

-- ============================================
-- PARTIE 9: TABLE DES PIÈCES PAR ÉTAPE
-- ============================================

CREATE TABLE IF NOT EXISTS pieces_etape (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etape_id UUID REFERENCES etapes_dossier(id) ON DELETE CASCADE NOT NULL,
    nom_fichier VARCHAR(255) NOT NULL,
    description TEXT,
    type_piece VARCHAR(100),
    storage_path TEXT NOT NULL,
    taille_fichier INTEGER,
    type_mime VARCHAR(100),
    date_piece DATE,
    est_visible_client BOOLEAN DEFAULT TRUE,
    notification_envoyee BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_pieces_etape_id ON pieces_etape(etape_id);
ALTER TABLE pieces_etape ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients can view visible pieces" ON pieces_etape;
CREATE POLICY "Clients can view visible pieces" ON pieces_etape FOR SELECT
    USING (est_visible_client = TRUE AND etape_id IN (SELECT id FROM etapes_dossier WHERE dossier_id IN (SELECT id FROM dossiers WHERE user_id = auth.uid())));

-- ============================================
-- PARTIE 10: TABLE DES NOTIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS notifications_client (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    dossier_id UUID,
    type_notification type_notification NOT NULL,
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    lien_action TEXT,
    etape_id UUID REFERENCES etapes_dossier(id) ON DELETE SET NULL,
    piece_id UUID REFERENCES pieces_etape(id) ON DELETE SET NULL,
    est_lue BOOLEAN DEFAULT FALSE,
    date_lue TIMESTAMPTZ,
    email_envoye BOOLEAN DEFAULT FALSE,
    date_email TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notif_user_id ON notifications_client(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_est_lue ON notifications_client(est_lue);
CREATE INDEX IF NOT EXISTS idx_notif_created_at ON notifications_client(created_at DESC);
ALTER TABLE notifications_client ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications_client;
CREATE POLICY "Users can view own notifications" ON notifications_client FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications_client;
CREATE POLICY "Users can update own notifications" ON notifications_client FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- PARTIE 11: TRIGGERS
-- ============================================

-- Fonction updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profils_clients_updated_at ON profils_clients;
CREATE TRIGGER update_profils_clients_updated_at BEFORE UPDATE ON profils_clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_dossiers_updated_at ON dossiers;
CREATE TRIGGER update_dossiers_updated_at BEFORE UPDATE ON dossiers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_modeles_updated_at ON modeles;
CREATE TRIGGER update_modeles_updated_at BEFORE UPDATE ON modeles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_etapes_updated_at ON etapes_dossier;
CREATE TRIGGER update_etapes_updated_at BEFORE UPDATE ON etapes_dossier FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PARTIE 12: FONCTIONS DE NOTIFICATIONS
-- ============================================

CREATE OR REPLACE FUNCTION creer_notification(
    p_user_id UUID, p_dossier_id UUID, p_type type_notification,
    p_titre VARCHAR(255), p_message TEXT, p_lien_action TEXT DEFAULT NULL,
    p_etape_id UUID DEFAULT NULL, p_piece_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE v_notif_id UUID;
BEGIN
    INSERT INTO notifications_client (user_id, dossier_id, type_notification, titre, message, lien_action, etape_id, piece_id)
    VALUES (p_user_id, p_dossier_id, p_type, p_titre, p_message, p_lien_action, p_etape_id, p_piece_id)
    RETURNING id INTO v_notif_id;
    RETURN v_notif_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION marquer_notification_lue(p_notif_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE notifications_client SET est_lue = TRUE, date_lue = NOW() WHERE id = p_notif_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION marquer_toutes_notifications_lues()
RETURNS VOID AS $$
BEGIN
    UPDATE notifications_client SET est_lue = TRUE, date_lue = NOW() WHERE user_id = auth.uid() AND est_lue = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Trigger notification nouvelle pièce
CREATE OR REPLACE FUNCTION notify_nouvelle_piece()
RETURNS TRIGGER AS $$
DECLARE v_user_id UUID; v_dossier_id UUID; v_etape_titre VARCHAR(255);
BEGIN
    SELECT d.user_id, d.id, e.titre INTO v_user_id, v_dossier_id, v_etape_titre
    FROM etapes_dossier e JOIN dossiers d ON e.dossier_id = d.id WHERE e.id = NEW.etape_id;
    IF NEW.est_visible_client = TRUE AND v_user_id IS NOT NULL THEN
        PERFORM creer_notification(v_user_id, v_dossier_id, 'nouvelle_piece'::type_notification,
            'Nouveau document disponible',
            'Un nouveau document "' || NEW.nom_fichier || '" a été ajouté.',
            '/dashboard/dossier?tab=procedure', NEW.etape_id, NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_nouvelle_piece ON pieces_etape;
CREATE TRIGGER trigger_notify_nouvelle_piece AFTER INSERT ON pieces_etape FOR EACH ROW EXECUTE FUNCTION notify_nouvelle_piece();

-- Trigger notification compte-rendu
CREATE OR REPLACE FUNCTION notify_nouveau_cr()
RETURNS TRIGGER AS $$
DECLARE v_user_id UUID; v_dossier_id UUID;
BEGIN
    SELECT d.user_id, d.id INTO v_user_id, v_dossier_id
    FROM etapes_dossier e JOIN dossiers d ON e.dossier_id = d.id WHERE e.id = NEW.etape_id;
    IF NEW.est_visible_client = TRUE AND v_user_id IS NOT NULL THEN
        PERFORM creer_notification(v_user_id, v_dossier_id, 'nouveau_compte_rendu'::type_notification,
            'Nouveau compte-rendu', NEW.titre, '/dashboard/dossier?tab=procedure', NEW.etape_id, NULL);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_nouveau_cr ON comptes_rendus_etape;
CREATE TRIGGER trigger_notify_nouveau_cr AFTER INSERT ON comptes_rendus_etape FOR EACH ROW EXECUTE FUNCTION notify_nouveau_cr();

-- ============================================
-- PARTIE 13: VUE NOTIFICATIONS
-- ============================================

CREATE OR REPLACE VIEW v_notifications_non_lues AS
SELECT user_id, COUNT(*) as nb_non_lues
FROM notifications_client WHERE est_lue = FALSE GROUP BY user_id;

-- ============================================
-- ✅ INSTALLATION TERMINÉE !
-- ============================================

