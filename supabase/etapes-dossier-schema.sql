-- ============================================
-- SCHEMA DES ÉTAPES DU DOSSIER JURIDIQUE
-- ============================================

-- Types d'étapes possibles
CREATE TYPE type_etape AS ENUM (
    'courrier_recommande',
    'mise_en_demeure',
    'saisine_mediateur',
    'assignation_placement',
    'assignation_audience_procedure',
    'assignation_audience_plaidoirie',
    'decision_judiciaire'
);

-- Statut de l'étape
CREATE TYPE statut_etape AS ENUM (
    'a_venir',
    'en_cours',
    'terminee',
    'annulee'
);

-- ============================================
-- TABLE PRINCIPALE DES ÉTAPES
-- ============================================

CREATE TABLE IF NOT EXISTS etapes_dossier (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dossier_id UUID NOT NULL, -- Référence au dossier (à lier avec la table dossiers)
    
    -- Type et statut
    type_etape type_etape NOT NULL,
    statut statut_etape DEFAULT 'a_venir',
    ordre INTEGER NOT NULL, -- Pour ordonner les étapes
    
    -- Informations générales
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Dates
    date_prevue DATE,
    date_realisee DATE,
    date_limite DATE, -- Pour les réponses attendues
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id), -- L'avocat qui a créé
    
    -- Champs JSON pour données spécifiques selon le type
    details JSONB DEFAULT '{}'
);

-- Index
CREATE INDEX IF NOT EXISTS idx_etapes_dossier_dossier_id ON etapes_dossier(dossier_id);
CREATE INDEX IF NOT EXISTS idx_etapes_dossier_type ON etapes_dossier(type_etape);
CREATE INDEX IF NOT EXISTS idx_etapes_dossier_statut ON etapes_dossier(statut);

-- RLS
ALTER TABLE etapes_dossier ENABLE ROW LEVEL SECURITY;

-- Les clients peuvent voir les étapes de leur dossier
CREATE POLICY "Clients can view own dossier etapes"
    ON etapes_dossier FOR SELECT
    USING (
        dossier_id IN (
            SELECT id FROM dossiers WHERE user_id = auth.uid()
        )
    );

-- Les avocats peuvent tout faire (à affiner avec les rôles)
CREATE POLICY "Avocats can manage etapes"
    ON etapes_dossier FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- TABLE DES AUDIENCES (pour plusieurs renvois)
-- ============================================

CREATE TABLE IF NOT EXISTS audiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etape_id UUID REFERENCES etapes_dossier(id) ON DELETE CASCADE,
    
    type_audience VARCHAR(50) NOT NULL, -- 'procedure' ou 'plaidoirie'
    date_audience DATE NOT NULL,
    heure TIME,
    salle VARCHAR(100),
    
    -- Pour les renvois
    est_renvoi BOOLEAN DEFAULT FALSE,
    motif_renvoi TEXT,
    
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audiences_etape_id ON audiences(etape_id);

ALTER TABLE audiences ENABLE ROW LEVEL SECURITY;

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
-- STRUCTURE DES DÉTAILS JSON PAR TYPE D'ÉTAPE
-- ============================================

/*
COURRIER_RECOMMANDE:
{
    "destinataire": "Société Générale - Service Réclamations",
    "adresse_destinataire": "29 Bd Haussmann, 75009 Paris",
    "numero_suivi": "1A 123 456 789 0",
    "objet": "Contestation opérations frauduleuses",
    "accuse_reception": true,
    "date_reception": "2024-12-20"
}

MISE_EN_DEMEURE:
{
    "destinataire": "Société Générale",
    "montant_reclame": 5500,
    "delai_reponse_jours": 15,
    "reponse_recue": true,
    "date_reponse": "2024-12-28",
    "contenu_reponse": "Refus de remboursement"
}

SAISINE_MEDIATEUR:
{
    "mediateur": "Médiateur de la Fédération Bancaire Française",
    "numero_dossier_mediateur": "MED-2024-12345",
    "date_accusé_reception": "2025-01-05",
    "decision": "favorable" | "defavorable" | "partiel" | "en_attente",
    "montant_propose": 3000,
    "commentaire_decision": "..."
}

ASSIGNATION_PLACEMENT:
{
    "huissier_nom": "SCP Martin & Associés",
    "huissier_adresse": "10 Rue du Palais, 75001 Paris",
    "huissier_telephone": "01 23 45 67 89",
    "date_signification": "2025-02-15",
    "juridiction": "Tribunal Judiciaire de Paris",
    "numero_rg": "25/12345",
    "chambre": "5ème chambre civile"
}

DECISION_JUDICIAIRE:
{
    "sens_decision": "favorable" | "defavorable" | "partiel",
    "montant_principal_alloue": 5500,
    "montant_dommages_interets": 500,
    "montant_article_700": 1500,
    "depens": "à la charge du défendeur",
    "execution_provisoire": true,
    "appel_possible": true,
    "delai_appel_jours": 30,
    "appel_interjete": false,
    "commentaire": "..."
}
*/

-- ============================================
-- TRIGGER: Mise à jour automatique de updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_etapes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_etapes_updated_at
    BEFORE UPDATE ON etapes_dossier
    FOR EACH ROW
    EXECUTE FUNCTION update_etapes_updated_at();

-- ============================================
-- DONNÉES DE DÉMONSTRATION
-- ============================================

-- À exécuter après avoir un dossier_id valide
-- INSERT INTO etapes_dossier (dossier_id, type_etape, statut, ordre, titre, description, date_prevue, details)
-- VALUES 
-- ('uuid-du-dossier', 'mise_en_demeure', 'terminee', 1, 'Mise en demeure', 'Envoi de la mise en demeure à la banque', '2024-12-15', '{"destinataire": "Société Générale", "montant_reclame": 5500}'),
-- ('uuid-du-dossier', 'saisine_mediateur', 'en_cours', 2, 'Saisine du médiateur', 'Médiation bancaire en cours', '2025-01-10', '{"mediateur": "Médiateur FBF"}'),
-- ('uuid-du-dossier', 'assignation_placement', 'a_venir', 3, 'Assignation', 'Préparation de l''assignation', NULL, '{}');

