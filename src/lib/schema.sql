-- ============================================================================
-- APA BREAZU - Water Management Database Schema
-- PostgreSQL / Supabase
-- 25 families sharing a central water meter, Breazu neighborhood
-- ============================================================================

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- Households
CREATE TABLE familii (
    id          SERIAL PRIMARY KEY,
    user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    nume        VARCHAR(100) NOT NULL,
    email       VARCHAR(150),
    telefon     VARCHAR(20),
    serie_apometru VARCHAR(30),
    activ       BOOLEAN DEFAULT true,
    rol         VARCHAR(10) DEFAULT 'user' CHECK (rol IN ('admin', 'user')),
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_familii_user_id ON familii(user_id);

-- Billing periods (bi-monthly)
CREATE TABLE perioade_facturare (
    id                      SERIAL PRIMARY KEY,
    luna_start              DATE NOT NULL,
    luna_end                DATE NOT NULL,
    nr_factura              VARCHAR(50),
    suma_factura            NUMERIC(10,2),
    index_central_anterior  NUMERIC(10,2),
    index_central_curent    NUMERIC(10,2),
    consum_central          NUMERIC(10,3) GENERATED ALWAYS AS (
                                index_central_curent - index_central_anterior
                            ) STORED,
    pret_mc                 NUMERIC(8,5),
    status                  VARCHAR(20) DEFAULT 'activa'
                                CHECK (status IN ('activa', 'inchisa', 'draft')),
    deadline_raportare      DATE,
    created_at              TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT ck_perioade_interval CHECK (luna_end > luna_start),
    CONSTRAINT ck_perioade_index CHECK (
        index_central_curent IS NULL
        OR index_central_anterior IS NULL
        OR index_central_curent >= index_central_anterior
    )
);

-- Individual meter readings
CREATE TABLE indexuri (
    id                  SERIAL PRIMARY KEY,
    familie_id          INT NOT NULL REFERENCES familii(id) ON DELETE CASCADE,
    perioada_id         INT NOT NULL REFERENCES perioade_facturare(id) ON DELETE CASCADE,
    valoare_index       NUMERIC(10,2) NOT NULL,
    mod_raportare       VARCHAR(10) DEFAULT 'manual'
                            CHECK (mod_raportare IN ('scan', 'manual', 'estimat')),
    foto_apometru_url   TEXT,
    data_raportare      TIMESTAMPTZ DEFAULT now(),
    validat             BOOLEAN DEFAULT false,
    UNIQUE(familie_id, perioada_id)
);

CREATE INDEX idx_indexuri_perioada ON indexuri(perioada_id);
CREATE INDEX idx_indexuri_familie ON indexuri(familie_id);

-- Cost distribution per family per period
CREATE TABLE repartizari (
    id                  SERIAL PRIMARY KEY,
    familie_id          INT NOT NULL REFERENCES familii(id) ON DELETE CASCADE,
    perioada_id         INT NOT NULL REFERENCES perioade_facturare(id) ON DELETE CASCADE,
    index_anterior      NUMERIC(10,2),
    index_curent        NUMERIC(10,2),
    consum_individual   NUMERIC(10,3),
    cota_pierderi       NUMERIC(10,3),
    consum_total        NUMERIC(10,3),
    suma_plata          NUMERIC(10,2),
    status              VARCHAR(20) DEFAULT 'neplatit'
                            CHECK (status IN ('neplatit', 'pending', 'platit')),
    created_at          TIMESTAMPTZ DEFAULT now(),
    UNIQUE(familie_id, perioada_id)
);

CREATE INDEX idx_repartizari_perioada ON repartizari(perioada_id);
CREATE INDEX idx_repartizari_familie ON repartizari(familie_id);

-- Payments with proof
CREATE TABLE plati (
    id                  SERIAL PRIMARY KEY,
    repartizare_id      INT NOT NULL REFERENCES repartizari(id) ON DELETE CASCADE,
    familie_id          INT NOT NULL REFERENCES familii(id) ON DELETE CASCADE,
    suma_platita        NUMERIC(10,2) NOT NULL,
    data_plata          DATE,
    dovada_url          TEXT,
    mod_plata           VARCHAR(10) DEFAULT 'manual'
                            CHECK (mod_plata IN ('scan', 'manual')),
    nr_referinta        VARCHAR(50),
    status              VARCHAR(20) DEFAULT 'pending'
                            CHECK (status IN ('pending', 'confirmat', 'respins')),
    motiv_respingere    TEXT,
    confirmat_de        INT REFERENCES familii(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_plati_repartizare ON plati(repartizare_id);
CREATE INDEX idx_plati_familie ON plati(familie_id);

-- Activity tracking
CREATE TABLE audit_log (
    id          SERIAL PRIMARY KEY,
    tabel       VARCHAR(50),
    actiune     VARCHAR(20),
    user_id     UUID,
    detalii     JSONB,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);


-- ============================================================================
-- 2. ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE familii ENABLE ROW LEVEL SECURITY;
ALTER TABLE indexuri ENABLE ROW LEVEL SECURITY;
ALTER TABLE repartizari ENABLE ROW LEVEL SECURITY;
ALTER TABLE plati ENABLE ROW LEVEL SECURITY;
ALTER TABLE perioade_facturare ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM familii
        WHERE user_id = auth.uid()
          AND rol = 'admin'
          AND activ = true
    );
$$;

-- Helper: get current user's familie_id
CREATE OR REPLACE FUNCTION my_familie_id()
RETURNS INT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT id FROM familii
    WHERE user_id = auth.uid()
    LIMIT 1;
$$;

-- ---- familii ----

CREATE POLICY familii_select ON familii
    FOR SELECT USING (
        user_id = auth.uid()
        OR is_admin()
    );

CREATE POLICY familii_insert ON familii
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY familii_update ON familii
    FOR UPDATE USING (
        user_id = auth.uid()
        OR is_admin()
    );

CREATE POLICY familii_delete ON familii
    FOR DELETE USING (is_admin());

-- ---- perioade_facturare ----
-- All authenticated users can view billing periods; only admins can modify

CREATE POLICY perioade_select ON perioade_facturare
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY perioade_insert ON perioade_facturare
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY perioade_update ON perioade_facturare
    FOR UPDATE USING (is_admin());

CREATE POLICY perioade_delete ON perioade_facturare
    FOR DELETE USING (is_admin());

-- ---- indexuri ----

CREATE POLICY indexuri_select ON indexuri
    FOR SELECT USING (
        familie_id = my_familie_id()
        OR is_admin()
    );

CREATE POLICY indexuri_insert ON indexuri
    FOR INSERT WITH CHECK (
        familie_id = my_familie_id()
        OR is_admin()
    );

CREATE POLICY indexuri_update ON indexuri
    FOR UPDATE USING (
        (familie_id = my_familie_id() AND validat = false)
        OR is_admin()
    );

CREATE POLICY indexuri_delete ON indexuri
    FOR DELETE USING (is_admin());

-- ---- repartizari ----

CREATE POLICY repartizari_select ON repartizari
    FOR SELECT USING (
        familie_id = my_familie_id()
        OR is_admin()
    );

CREATE POLICY repartizari_modify ON repartizari
    FOR ALL USING (is_admin());

-- ---- plati ----

CREATE POLICY plati_select ON plati
    FOR SELECT USING (
        familie_id = my_familie_id()
        OR is_admin()
    );

CREATE POLICY plati_insert ON plati
    FOR INSERT WITH CHECK (
        familie_id = my_familie_id()
        OR is_admin()
    );

CREATE POLICY plati_update ON plati
    FOR UPDATE USING (is_admin());

CREATE POLICY plati_delete ON plati
    FOR DELETE USING (is_admin());

-- ---- audit_log ----

CREATE POLICY audit_select ON audit_log
    FOR SELECT USING (is_admin());

CREATE POLICY audit_insert ON audit_log
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);


-- ============================================================================
-- 3. COST DISTRIBUTION FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION calcul_repartizare(p_perioada_id INT)
RETURNS TABLE (
    familie_id      INT,
    nume            VARCHAR,
    consum_ind      NUMERIC,
    cota_pierd      NUMERIC,
    consum_tot      NUMERIC,
    suma            NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_consum_central    NUMERIC(10,3);
    v_pret_mc           NUMERIC(8,5);
    v_suma_factura      NUMERIC(10,2);
    v_total_individual  NUMERIC(10,3);
    v_pierderi          NUMERIC(10,3);
    v_status            VARCHAR(20);
BEGIN
    -- 1. Get billing period data
    SELECT
        pf.consum_central,
        pf.pret_mc,
        pf.suma_factura,
        pf.status
    INTO
        v_consum_central,
        v_pret_mc,
        v_suma_factura,
        v_status
    FROM perioade_facturare pf
    WHERE pf.id = p_perioada_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Perioada de facturare % nu exista', p_perioada_id;
    END IF;

    IF v_consum_central IS NULL OR v_consum_central <= 0 THEN
        RAISE EXCEPTION 'Consum central invalid pentru perioada %', p_perioada_id;
    END IF;

    -- Calculate pret_mc from invoice if not already set
    IF v_pret_mc IS NULL AND v_suma_factura IS NOT NULL AND v_consum_central > 0 THEN
        v_pret_mc := v_suma_factura / v_consum_central;

        UPDATE perioade_facturare
        SET pret_mc = v_pret_mc
        WHERE id = p_perioada_id;
    END IF;

    IF v_pret_mc IS NULL OR v_pret_mc <= 0 THEN
        RAISE EXCEPTION 'Pret pe mc invalid pentru perioada %', p_perioada_id;
    END IF;

    -- 2. Build temp table with individual consumption
    --    For each family, get current index from this period
    --    and previous index from the prior period (or from repartizari)
    CREATE TEMP TABLE tmp_repartizare ON COMMIT DROP AS
    SELECT
        f.id                                AS t_familie_id,
        f.nume                              AS t_nume,
        -- Previous index: last period's reading, or current period's repartizari.index_anterior
        COALESCE(
            prev_idx.valoare_index,
            existing.index_anterior
        )                                   AS t_index_anterior,
        cur_idx.valoare_index               AS t_index_curent,
        -- Individual consumption
        CASE
            WHEN prev_idx.valoare_index IS NOT NULL THEN
                cur_idx.valoare_index - prev_idx.valoare_index
            WHEN existing.index_anterior IS NOT NULL THEN
                cur_idx.valoare_index - existing.index_anterior
            ELSE
                0
        END                                 AS t_consum_individual
    FROM familii f
    INNER JOIN indexuri cur_idx
        ON cur_idx.familie_id = f.id
        AND cur_idx.perioada_id = p_perioada_id
    LEFT JOIN LATERAL (
        -- Previous period's reading (most recent period before current one)
        SELECT ix.valoare_index
        FROM indexuri ix
        INNER JOIN perioade_facturare pp ON pp.id = ix.perioada_id
        WHERE ix.familie_id = f.id
          AND pp.luna_end <= (
              SELECT pf2.luna_start
              FROM perioade_facturare pf2
              WHERE pf2.id = p_perioada_id
          )
        ORDER BY pp.luna_end DESC
        LIMIT 1
    ) prev_idx ON true
    LEFT JOIN repartizari existing
        ON existing.familie_id = f.id
        AND existing.perioada_id = p_perioada_id
    WHERE f.activ = true;

    -- 3. Calculate totals
    SELECT COALESCE(SUM(t_consum_individual), 0)
    INTO v_total_individual
    FROM tmp_repartizare;

    -- Losses = central consumption - sum of individual consumptions
    v_pierderi := GREATEST(v_consum_central - v_total_individual, 0);

    -- 4. Upsert repartizari rows with proportional loss distribution
    INSERT INTO repartizari (
        familie_id, perioada_id,
        index_anterior, index_curent,
        consum_individual, cota_pierderi, consum_total,
        suma_plata, status
    )
    SELECT
        t.t_familie_id,
        p_perioada_id,
        t.t_index_anterior,
        t.t_index_curent,
        t.t_consum_individual,
        -- Proportional loss share: family_consumption / total_individual * total_losses
        CASE
            WHEN v_total_individual > 0 THEN
                ROUND(t.t_consum_individual / v_total_individual * v_pierderi, 3)
            ELSE
                ROUND(v_pierderi / NULLIF(cnt.nr_familii, 0), 3)
        END,
        -- Total consumption = individual + loss share
        t.t_consum_individual +
        CASE
            WHEN v_total_individual > 0 THEN
                ROUND(t.t_consum_individual / v_total_individual * v_pierderi, 3)
            ELSE
                ROUND(v_pierderi / NULLIF(cnt.nr_familii, 0), 3)
        END,
        -- Amount = total_consumption * price/mc
        ROUND(
            (t.t_consum_individual +
             CASE
                 WHEN v_total_individual > 0 THEN
                     ROUND(t.t_consum_individual / v_total_individual * v_pierderi, 3)
                 ELSE
                     ROUND(v_pierderi / NULLIF(cnt.nr_familii, 0), 3)
             END
            ) * v_pret_mc,
            2
        ),
        'neplatit'
    FROM tmp_repartizare t
    CROSS JOIN (SELECT COUNT(*) AS nr_familii FROM tmp_repartizare) cnt
    ON CONFLICT (familie_id, perioada_id)
    DO UPDATE SET
        index_anterior      = EXCLUDED.index_anterior,
        index_curent        = EXCLUDED.index_curent,
        consum_individual   = EXCLUDED.consum_individual,
        cota_pierderi       = EXCLUDED.cota_pierderi,
        consum_total        = EXCLUDED.consum_total,
        suma_plata          = EXCLUDED.suma_plata;

    -- 5. Return the results
    RETURN QUERY
    SELECT
        r.familie_id,
        f.nume,
        r.consum_individual,
        r.cota_pierderi,
        r.consum_total,
        r.suma_plata
    FROM repartizari r
    INNER JOIN familii f ON f.id = r.familie_id
    WHERE r.perioada_id = p_perioada_id
    ORDER BY f.nume;
END;
$$;


-- ============================================================================
-- 4. AUDIT TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION audit_trigger_fn()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO audit_log (tabel, actiune, user_id, detalii)
    VALUES (
        TG_TABLE_NAME,
        TG_OP,
        auth.uid(),
        CASE TG_OP
            WHEN 'DELETE' THEN to_jsonb(OLD)
            WHEN 'UPDATE' THEN jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
            ELSE to_jsonb(NEW)
        END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_audit_indexuri
    AFTER INSERT OR UPDATE OR DELETE ON indexuri
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();

CREATE TRIGGER trg_audit_repartizari
    AFTER INSERT OR UPDATE OR DELETE ON repartizari
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();

CREATE TRIGGER trg_audit_plati
    AFTER INSERT OR UPDATE OR DELETE ON plati
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();


-- ============================================================================
-- 5. STORAGE BUCKETS (Supabase Storage)
-- ============================================================================

-- Run these via Supabase dashboard or management API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('foto-apometre', 'foto-apometre', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('dovezi-plata', 'dovezi-plata', false);

-- Storage policies would be:
-- foto-apometre: users can upload/view their own photos, admins can view all
-- dovezi-plata:  users can upload/view their own proofs, admins can view all


-- ============================================================================
-- 6. SEED DATA - 25 Families
-- ============================================================================

INSERT INTO familii (nume, serie_apometru, activ, rol) VALUES
    ('Corbu Ciprian',       '21BA456842',       true, 'user'),
    ('Dorofte Florin',      '112032063',        true, 'user'),
    ('Iliescu Ctin',        NULL,               true, 'user'),
    ('Iliescu Titi',        '116134064',        true, 'user'),
    ('Iliescu Ioan',        '112032062',        true, 'user'),
    ('Pintilie Mihai',      '112032205',        true, 'user'),
    ('Serban Iurie',        '112032217',        true, 'user'),
    ('Gorie Mihai',         '115184804',        true, 'user'),
    ('Petru Lupu',          '115202645',        true, 'user'),
    ('Iliescu Ioan',        NULL,               true, 'admin'),
    ('Sucila Valeriu',      '116314479',        true, 'user'),
    ('Ciprian Serban',      '117512984',        true, 'user'),
    ('Marius Mancea',       NULL,               true, 'user'),
    ('Herciu Gabriela',     NULL,               true, 'user'),
    ('Astefculese Igor',    '117BA497643',      true, 'user'),
    ('Chiriac Marius',      NULL,               true, 'user'),
    ('Fam. Rosca',          NULL,               true, 'user'),
    ('Boicu Marian',        NULL,               true, 'user'),
    ('Opria Roxana',        NULL,               true, 'user'),
    ('Cristina Mocanu',     'I20BA207822',      true, 'user'),
    ('Tamas Stefan',        NULL,               true, 'user'),
    ('Turcu Stefan',        NULL,               true, 'user'),
    ('Davidoaia Cozmin',    NULL,               true, 'user'),
    ('Gavril George',       NULL,               true, 'user'),
    ('Andra Bostanaru',     NULL,               true, 'user');
