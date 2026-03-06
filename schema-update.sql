-- ================================================
-- TEMPESTADE DIGITAL - Schema Update
-- Execute este SQL no SQL Editor do Supabase
-- Isso adicionará a coluna de ajuste de posição da foto
-- ================================================

-- Adicionar coluna avatar_pos_y (valor de 0 a 100)
ALTER TABLE members 
ADD COLUMN IF NOT EXISTS avatar_pos_y INTEGER DEFAULT 50;

-- Atualizar políticas (opcional, já que já existem, mas garante consistência)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
