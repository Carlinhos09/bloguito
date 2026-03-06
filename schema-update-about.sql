-- ================================================
-- TEMPESTADE DIGITAL - Update Supabase Schema 
-- Adiciona colunas para a seção "Quem Somos Nós"
-- ================================================

ALTER TABLE members 
ADD COLUMN IF NOT EXISTS about_text TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS about_image_url TEXT DEFAULT '';

-- Update the login verification function to include the new fields
CREATE OR REPLACE FUNCTION verify_member_login(p_username TEXT, p_password TEXT)
RETURNS TABLE(
  id UUID,
  username TEXT,
  codename TEXT,
  niche TEXT,
  column_name TEXT,
  author_name TEXT,
  color_primary TEXT,
  color_secondary TEXT,
  bio TEXT,
  avatar_url TEXT,
  about_text TEXT,
  about_image_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id, m.username, m.codename, m.niche, m.column_name,
    m.author_name, m.color_primary, m.color_secondary, m.bio, m.avatar_url,
    m.about_text, m.about_image_url
  FROM members m
  WHERE m.username = p_username
    AND m.password_hash = crypt(p_password, m.password_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
