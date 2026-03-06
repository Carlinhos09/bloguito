-- ================================================
-- TEMPESTADE DIGITAL - Storage Setup SQL
-- Execute este SQL no SQL Editor do Supabase
-- Isso criará o bucket 'avatars' e liberará o acesso
-- ================================================

-- 1. Criar o bucket de avatars (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Liberar leitura pública para o bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- 3. Liberar upload para usuários (anon/autenticado)
CREATE POLICY "Allow Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'avatars' );

-- 4. Liberar atualização e exclusão
CREATE POLICY "Allow Public Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' );

CREATE POLICY "Allow Public Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'avatars' );
