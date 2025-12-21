-- ============================================
-- SCHEMA ENRICHI DES ÉTAPES DU DOSSIER
-- Avec échéances, comptes-rendus, pièces et notifications
-- ============================================

-- ============================================
-- TABLE DES ÉCHÉANCES PAR ÉTAPE
-- ============================================

CREATE TABLE IF NOT EXISTS echeances_etape (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etape_id UUID REFERENCES etapes_dossier(id) ON DELETE CASCADE NOT NULL,
    
    -- Informations de l'échéance
    nature VARCHAR(255) NOT NULL, -- Ex: "Audience de mise en état", "Dépôt conclusions"
    date_echeance DATE NOT NULL,
    heure TIME,
    lieu VARCHAR(255), -- Ex: "Tribunal Judiciaire Paris - Salle 2.15"
    
    -- Statut
    est_passee BOOLEAN DEFAULT FALSE,
    
    -- Rappel
    rappel_envoye BOOLEAN DEFAULT FALSE,
    jours_rappel_avant INTEGER DEFAULT 3, -- Envoyer rappel X jours avant
    
    notes_avocat TEXT, -- Notes internes (non visibles client)
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_echeances_etape_id ON echeances_etape(etape_id);
CREATE INDEX IF NOT EXISTS idx_echeances_date ON echeances_etape(date_echeance);

ALTER TABLE echeances_etape ENABLE ROW LEVEL SECURITY;

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
-- TABLE DES COMPTES-RENDUS PAR ÉTAPE
-- ============================================

CREATE TABLE IF NOT EXISTS comptes_rendus_etape (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etape_id UUID REFERENCES etapes_dossier(id) ON DELETE CASCADE NOT NULL,
    echeance_id UUID REFERENCES echeances_etape(id) ON DELETE SET NULL, -- Lié à une échéance spécifique
    
    -- Contenu
    titre VARCHAR(255) NOT NULL, -- Ex: "Compte-rendu audience du 15/01/2025"
    contenu TEXT NOT NULL, -- Le compte-rendu détaillé
    resume_client TEXT, -- Version simplifiée pour le client (optionnel)
    
    -- Métadonnées
    date_evenement DATE, -- Date de l'événement concerné
    est_visible_client BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_cr_etape_id ON comptes_rendus_etape(etape_id);

ALTER TABLE comptes_rendus_etape ENABLE ROW LEVEL SECURITY;

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
-- TABLE DES PIÈCES JOINTES PAR ÉTAPE
-- ============================================

CREATE TABLE IF NOT EXISTS pieces_etape (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etape_id UUID REFERENCES etapes_dossier(id) ON DELETE CASCADE NOT NULL,
    
    -- Informations du fichier
    nom_fichier VARCHAR(255) NOT NULL,
    description TEXT, -- Description par l'avocat
    type_piece VARCHAR(100), -- Ex: "Conclusions", "Jugement", "Ordonnance"
    
    -- Stockage (Supabase Storage)
    storage_path TEXT NOT NULL,
    taille_fichier INTEGER,
    type_mime VARCHAR(100),
    
    -- Métadonnées
    date_piece DATE, -- Date du document
    est_visible_client BOOLEAN DEFAULT TRUE,
    
    -- Notification
    notification_envoyee BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_pieces_etape_id ON pieces_etape(etape_id);

ALTER TABLE pieces_etape ENABLE ROW LEVEL SECURITY;

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
-- TABLE DES NOTIFICATIONS CLIENT
-- ============================================

CREATE TYPE type_notification AS ENUM (
    'nouvelle_piece',
    'nouveau_compte_rendu',
    'echeance_proche',
    'echeance_passee',
    'changement_statut',
    'message_avocat'
);

CREATE TABLE IF NOT EXISTS notifications_client (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    dossier_id UUID, -- Référence au dossier concerné
    
    -- Type et contenu
    type_notification type_notification NOT NULL,
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Liens
    lien_action TEXT, -- URL vers la page concernée (ex: /dashboard/dossier#procedure)
    etape_id UUID REFERENCES etapes_dossier(id) ON DELETE SET NULL,
    piece_id UUID REFERENCES pieces_etape(id) ON DELETE SET NULL,
    
    -- Statut
    est_lue BOOLEAN DEFAULT FALSE,
    date_lue TIMESTAMPTZ,
    
    -- Email
    email_envoye BOOLEAN DEFAULT FALSE,
    date_email TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notif_user_id ON notifications_client(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_est_lue ON notifications_client(est_lue);
CREATE INDEX IF NOT EXISTS idx_notif_created_at ON notifications_client(created_at DESC);

ALTER TABLE notifications_client ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
    ON notifications_client FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
    ON notifications_client FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- FONCTION: Créer une notification
-- ============================================

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

-- ============================================
-- TRIGGER: Notification automatique nouvelle pièce
-- ============================================

CREATE OR REPLACE FUNCTION notify_nouvelle_piece()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_dossier_id UUID;
    v_etape_titre VARCHAR(255);
BEGIN
    -- Récupérer le user_id et dossier_id
    SELECT d.user_id, d.id, e.titre 
    INTO v_user_id, v_dossier_id, v_etape_titre
    FROM etapes_dossier e
    JOIN dossiers d ON e.dossier_id = d.id
    WHERE e.id = NEW.etape_id;
    
    -- Créer la notification si visible client
    IF NEW.est_visible_client = TRUE THEN
        PERFORM creer_notification(
            v_user_id,
            v_dossier_id,
            'nouvelle_piece'::type_notification,
            'Nouveau document disponible',
            'Un nouveau document "' || NEW.nom_fichier || '" a été ajouté à l''étape "' || v_etape_titre || '".',
            '/dashboard/dossier?tab=procedure',
            NEW.etape_id,
            NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_nouvelle_piece
    AFTER INSERT ON pieces_etape
    FOR EACH ROW
    EXECUTE FUNCTION notify_nouvelle_piece();

-- ============================================
-- TRIGGER: Notification automatique compte-rendu
-- ============================================

CREATE OR REPLACE FUNCTION notify_nouveau_cr()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_dossier_id UUID;
BEGIN
    -- Récupérer le user_id et dossier_id
    SELECT d.user_id, d.id 
    INTO v_user_id, v_dossier_id
    FROM etapes_dossier e
    JOIN dossiers d ON e.dossier_id = d.id
    WHERE e.id = NEW.etape_id;
    
    -- Créer la notification si visible client
    IF NEW.est_visible_client = TRUE THEN
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

CREATE TRIGGER trigger_notify_nouveau_cr
    AFTER INSERT ON comptes_rendus_etape
    FOR EACH ROW
    EXECUTE FUNCTION notify_nouveau_cr();

-- ============================================
-- VUE: Notifications non lues par utilisateur
-- ============================================

CREATE OR REPLACE VIEW v_notifications_non_lues AS
SELECT 
    user_id,
    COUNT(*) as nb_non_lues
FROM notifications_client
WHERE est_lue = FALSE
GROUP BY user_id;

-- ============================================
-- FONCTION: Marquer notification comme lue
-- ============================================

CREATE OR REPLACE FUNCTION marquer_notification_lue(p_notif_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE notifications_client 
    SET est_lue = TRUE, date_lue = NOW()
    WHERE id = p_notif_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FONCTION: Marquer toutes notifications comme lues
-- ============================================

CREATE OR REPLACE FUNCTION marquer_toutes_notifications_lues()
RETURNS VOID AS $$
BEGIN
    UPDATE notifications_client 
    SET est_lue = TRUE, date_lue = NOW()
    WHERE user_id = auth.uid() AND est_lue = FALSE;
END;
$$ LANGUAGE plpgsql;

