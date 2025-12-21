-- ============================================
-- INSTALLATION COMPLÈTE
-- Étapes du dossier + Notifications + Pièces
-- ============================================
-- Exécutez ce fichier UNE SEULE FOIS dans Supabase SQL Editor
-- ============================================

-- ============================================
-- PARTIE 1: TYPES ÉNUMÉRÉS
-- ============================================

-- Types d'étapes possibles (si n'existe pas déjà)
DO $$ BEGIN
    CREATE TYPE type_etape AS ENUM (
        'courrier_recommande',
        'mise_en_demeure',
        'saisine_mediateur',
        'assignation_placement',
        'assignation_audience_procedure',
        'assignation_audience_plaidoirie',
        'decision_judiciaire'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Statut de l'étape
DO $$ BEGIN
    CREATE TYPE statut_etape AS ENUM (
        'a_venir',
        'en_cours',
        'terminee',
        'annulee'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Type de notification
DO $$ BEGIN
    CREATE TYPE type_notification AS ENUM (
        'nouvelle_piece',
        'nouveau_compte_rendu',
        'echeance_proche',
        'echeance_passee',
        'changement_statut',
        'message_avocat'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- PARTIE 2: TABLE PRINCIPALE DES ÉTAPES
-- ============================================

CREATE TABLE IF NOT EXISTS etapes_dossier (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dossier_id UUID NOT NULL,
    
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

-- Politique clients
DO $$ BEGIN
    DROP POLICY IF EXISTS "Clients can view own dossier etapes" ON etapes_dossier;
EXCEPTION WHEN undefined_object THEN null;
END $$;

CREATE POLICY "Clients can view own dossier etapes"
    ON etapes_dossier FOR SELECT
    USING (
        dossier_id IN (
            SELECT id FROM dossiers WHERE user_id = auth.uid()
        )
    );

-- Politique avocats
DO $$ BEGIN
    DROP POLICY IF EXISTS "Avocats can manage etapes" ON etapes_dossier;
EXCEPTION WHEN undefined_object THEN null;
END $$;

CREATE POLICY "Avocats can manage etapes"
    ON etapes_dossier FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- PARTIE 3: TABLE DES AUDIENCES
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

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view audiences of own dossier" ON audiences;
EXCEPTION WHEN undefined_object THEN null;
END $$;

CREATE POLICY "Users can view audiences of own dossier"
    ON audiences FOR SELECT
    USING (
        etape_id IN (
            SELECT id FROM etapes_dossier WHERE dossier_id IN (
                SELECT id FROM dossiers WHERE user_id = auth.uid()
            )
        )
    );

-- ============================================
-- PARTIE 4: TABLE DES ÉCHÉANCES PAR ÉTAPE
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

DO $$ BEGIN
    DROP POLICY IF EXISTS "Clients can view echeances of own dossier" ON echeances_etape;
EXCEPTION WHEN undefined_object THEN null;
END $$;

CREATE POLICY "Clients can view echeances of own dossier"
    ON echeances_etape FOR SELECT
    USING (
        etape_id IN (
            SELECT id FROM etapes_dossier WHERE dossier_id IN (
                SELECT id FROM dossiers WHERE user_id = auth.uid()
            )
        )
    );

-- ============================================
-- PARTIE 5: TABLE DES COMPTES-RENDUS
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

DO $$ BEGIN
    DROP POLICY IF EXISTS "Clients can view visible comptes rendus" ON comptes_rendus_etape;
EXCEPTION WHEN undefined_object THEN null;
END $$;

CREATE POLICY "Clients can view visible comptes rendus"
    ON comptes_rendus_etape FOR SELECT
    USING (
        est_visible_client = TRUE AND
        etape_id IN (
            SELECT id FROM etapes_dossier WHERE dossier_id IN (
                SELECT id FROM dossiers WHERE user_id = auth.uid()
            )
        )
    );

-- ============================================
-- PARTIE 6: TABLE DES PIÈCES PAR ÉTAPE
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

DO $$ BEGIN
    DROP POLICY IF EXISTS "Clients can view visible pieces" ON pieces_etape;
EXCEPTION WHEN undefined_object THEN null;
END $$;

CREATE POLICY "Clients can view visible pieces"
    ON pieces_etape FOR SELECT
    USING (
        est_visible_client = TRUE AND
        etape_id IN (
            SELECT id FROM etapes_dossier WHERE dossier_id IN (
                SELECT id FROM dossiers WHERE user_id = auth.uid()
            )
        )
    );

-- ============================================
-- PARTIE 7: TABLE DES NOTIFICATIONS
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

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view own notifications" ON notifications_client;
EXCEPTION WHEN undefined_object THEN null;
END $$;

CREATE POLICY "Users can view own notifications"
    ON notifications_client FOR SELECT
    USING (auth.uid() = user_id);

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can update own notifications" ON notifications_client;
EXCEPTION WHEN undefined_object THEN null;
END $$;

CREATE POLICY "Users can update own notifications"
    ON notifications_client FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- PARTIE 8: FONCTIONS
-- ============================================

-- Fonction pour créer une notification
CREATE OR REPLACE FUNCTION creer_notification(
    p_user_id UUID,
    p_dossier_id UUID,
    p_type type_notification,
    p_titre VARCHAR(255),
    p_message TEXT,
    p_lien_action TEXT DEFAULT NULL,
    p_etape_id UUID DEFAULT NULL,
    p_piece_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_notif_id UUID;
BEGIN
    INSERT INTO notifications_client (
        user_id, dossier_id, type_notification, titre, message, 
        lien_action, etape_id, piece_id
    )
    VALUES (
        p_user_id, p_dossier_id, p_type, p_titre, p_message,
        p_lien_action, p_etape_id, p_piece_id
    )
    RETURNING id INTO v_notif_id;
    
    RETURN v_notif_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour marquer notification comme lue
CREATE OR REPLACE FUNCTION marquer_notification_lue(p_notif_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE notifications_client 
    SET est_lue = TRUE, date_lue = NOW()
    WHERE id = p_notif_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql;

-- Fonction pour marquer toutes comme lues
CREATE OR REPLACE FUNCTION marquer_toutes_notifications_lues()
RETURNS VOID AS $$
BEGIN
    UPDATE notifications_client 
    SET est_lue = TRUE, date_lue = NOW()
    WHERE user_id = auth.uid() AND est_lue = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Trigger mise à jour updated_at
CREATE OR REPLACE FUNCTION update_etapes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_etapes_updated_at ON etapes_dossier;
CREATE TRIGGER trigger_update_etapes_updated_at
    BEFORE UPDATE ON etapes_dossier
    FOR EACH ROW
    EXECUTE FUNCTION update_etapes_updated_at();

-- ============================================
-- PARTIE 9: TRIGGERS DE NOTIFICATION AUTO
-- ============================================

-- Notification automatique nouvelle pièce
CREATE OR REPLACE FUNCTION notify_nouvelle_piece()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_dossier_id UUID;
    v_etape_titre VARCHAR(255);
BEGIN
    SELECT d.user_id, d.id, e.titre 
    INTO v_user_id, v_dossier_id, v_etape_titre
    FROM etapes_dossier e
    JOIN dossiers d ON e.dossier_id = d.id
    WHERE e.id = NEW.etape_id;
    
    IF NEW.est_visible_client = TRUE AND v_user_id IS NOT NULL THEN
        PERFORM creer_notification(
            v_user_id,
            v_dossier_id,
            'nouvelle_piece'::type_notification,
            'Nouveau document disponible',
            'Un nouveau document "' || NEW.nom_fichier || '" a été ajouté à l''étape "' || COALESCE(v_etape_titre, 'votre dossier') || '".',
            '/dashboard/dossier?tab=procedure',
            NEW.etape_id,
            NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_nouvelle_piece ON pieces_etape;
CREATE TRIGGER trigger_notify_nouvelle_piece
    AFTER INSERT ON pieces_etape
    FOR EACH ROW
    EXECUTE FUNCTION notify_nouvelle_piece();

-- Notification automatique compte-rendu
CREATE OR REPLACE FUNCTION notify_nouveau_cr()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_dossier_id UUID;
BEGIN
    SELECT d.user_id, d.id 
    INTO v_user_id, v_dossier_id
    FROM etapes_dossier e
    JOIN dossiers d ON e.dossier_id = d.id
    WHERE e.id = NEW.etape_id;
    
    IF NEW.est_visible_client = TRUE AND v_user_id IS NOT NULL THEN
        PERFORM creer_notification(
            v_user_id,
            v_dossier_id,
            'nouveau_compte_rendu'::type_notification,
            'Nouveau compte-rendu',
            NEW.titre,
            '/dashboard/dossier?tab=procedure',
            NEW.etape_id,
            NULL
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_nouveau_cr ON comptes_rendus_etape;
CREATE TRIGGER trigger_notify_nouveau_cr
    AFTER INSERT ON comptes_rendus_etape
    FOR EACH ROW
    EXECUTE FUNCTION notify_nouveau_cr();

-- ============================================
-- PARTIE 10: VUE UTILE
-- ============================================

CREATE OR REPLACE VIEW v_notifications_non_lues AS
SELECT 
    user_id,
    COUNT(*) as nb_non_lues
FROM notifications_client
WHERE est_lue = FALSE
GROUP BY user_id;

-- ============================================
-- INSTALLATION TERMINÉE !
-- ============================================

