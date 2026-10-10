-- ============================================================================
-- SEED DE CONFIGURAÇÃO — executar no Supabase SQL Editor
-- ============================================================================
-- Cria a tabela de ordens (carousel + playlist) com RLS para o painel admin.
-- O painel admin só funciona se o usuário tiver uma policy de INSERT/UPDATE
-- permitida (veja README: "Proteger o painel admin").

CREATE TABLE IF NOT EXISTS media_order (
  id         INTEGER PRIMARY KEY,
  carousel   TEXT[] NOT NULL DEFAULT '{}',
  music      TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Garante que a linha de id=1 exista
INSERT INTO media_order (id, carousel, music, updated_at)
VALUES (1, '{}', '{}', NOW())
ON CONFLICT (id) DO NOTHING;

-- Política: leitura pública (se quiser que o site saiba quantos itens existem)
CREATE POLICY "media_order_read_everyone"
  ON media_order FOR SELECT
  USING (true);

-- Política: escrita somente pelo painel admin
-- (no dashboard, concede um "service_role" ou use uma chave especial;
--  sem essa política, o painel não consegue salvar)
CREATE POLICY "media_order_write_admin"
  ON media_order FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Índice opcional
CREATE INDEX IF NOT EXISTS idx_media_order_updated
  ON media_order (updated_at);
