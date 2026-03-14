-- ================================================
-- TEMPESTADE DIGITAL - Schema Update (Member Resources)
-- Execute este SQL no SQL Editor do Supabase
-- Isso adicionará as colunas de "Referências" e "Links Úteis"
-- ================================================

ALTER TABLE members 
ADD COLUMN IF NOT EXISTS academic_references TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS useful_links TEXT DEFAULT '';
