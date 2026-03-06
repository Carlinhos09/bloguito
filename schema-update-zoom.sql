-- ================================================
-- TEMPESTADE DIGITAL - Schema Update (Zoom)
-- Execute este SQL no SQL Editor do Supabase
-- Isso adicionará a coluna de zoom da foto
-- ================================================

-- Adicionar coluna avatar_scale (valor de 1.0 a 3.0, default 1.0)
-- Vamos usar o tipo NUMERIC para permitir decimais
ALTER TABLE members 
ADD COLUMN IF NOT EXISTS avatar_scale NUMERIC DEFAULT 1.0;
