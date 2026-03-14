-- ================================================
-- TEMPESTADE DIGITAL - Supabase Setup SQL
-- Execute este SQL no SQL Editor do Supabase
-- ================================================

-- Habilitar extensão para hashing de senha
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabela de membros (com auth custom usuário/senha)
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  codename TEXT NOT NULL,
  niche TEXT NOT NULL,
  column_name TEXT NOT NULL,
  author_name TEXT NOT NULL,
  color_primary TEXT NOT NULL DEFAULT '#7c3aed',
  color_secondary TEXT NOT NULL DEFAULT '#a78bfa',
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  content TEXT DEFAULT '',
  cover_image_url TEXT DEFAULT '',
  weekly_theme TEXT DEFAULT '',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policies: leitura pública
CREATE POLICY "members_public_read" ON members FOR SELECT USING (true);
CREATE POLICY "posts_public_read" ON posts FOR SELECT USING (published = true);

-- Policies: anon pode fazer tudo (auth customizada via JS)
CREATE POLICY "members_all_anon" ON members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "posts_all_anon" ON posts FOR ALL USING (true) WITH CHECK (true);

-- ================================================
-- INSERIR OS 4 MEMBROS (senha em texto, será hasheada)
-- Senhas iniciais: triz123, eduardo123, sophia123, clarisse123
-- ================================================
INSERT INTO members (username, password_hash, codename, niche, column_name, author_name, color_primary, color_secondary, bio)
VALUES
  (
    'triz',
    crypt('triz123', gen_salt('bf')),
    'PLAYER TEMPESTADE',
    'Jogos',
    'MODO CRIATIVO',
    'Triz',
    '#7c3aed',
    '#a78bfa',
    'Explorando mundos digitais e transformando pixels em arte. Cada jogo é uma nova dimensão a descobrir.'
  ),
  (
    'eduardo',
    crypt('eduardo123', gen_salt('bf')),
    'DIRETOR PLUVIAL',
    'Filmes',
    'ENTRE FRAMES',
    'Eduardo',
    '#0891b2',
    '#67e8f9',
    'Entre um frame e outro, o cinema respira. Análises, descobertas e a magia do audiovisual.'
  ),
  (
    'sophia',
    crypt('sophia123', gen_salt('bf')),
    'PRODUCER NEBLINA',
    'Músicas & Trends',
    'DROP',
    'Sophia',
    '#db2777',
    '#f9a8d4',
    'Tendências, beats e vibrações que definem o agora. Do underground ao mainstream, tudo passa pelo DROP.'
  ),
  (
    'clarisse',
    crypt('clarisse123', gen_salt('bf')),
    'SHOWRUNNER GAROA',
    'Séries',
    'EPISÓDIO ZERO',
    'Clarisse',
    '#059669',
    '#6ee7b7',
    'Piloto, cliffhanger, season finale — cada episódio é um universo. Vem maratonar comigo.'
  )
ON CONFLICT (username) DO NOTHING;

-- ================================================
-- INSERIR OS POSTS DA PRIMEIRA SEMANA
-- Tema: Estratégias de Marketing Digital
-- ================================================
INSERT INTO posts (member_id, title, subtitle, content, cover_image_url, weekly_theme, published)
VALUES
  (
    (SELECT id FROM members WHERE username = 'sophia'),
    'Travis Scott: O arquiteto das experiências digitais no cenário musical',
    'Como as plataformas de games se tornaram as novas arenas de show no século XXI.',
    'Travis Scott entendeu que plataformas como o Fortnite são as novas arenas de show. Ele não apenas participou de um evento, ele desenhou um novo modelo de negócio para a música no século XXI. 

A revolução digital transformou radicalmente a forma como consumimos música. Se antes a trajetória de um artista dependia das grandes gravadoras e da exposição em meios tradicionais como o rádio e a televisão, hoje a lógica de mercado foi subvertida. O modelo centralizado do século vinte deu lugar a uma nova dinâmica de promoção e alcance global, a internet e os meios online. Na qual o alcance global não é mais medido apenas por execuções em rádios, e sim pela capacidade de criar experiências e se conectar com o público. 

Nesse cenário, o marketing digital deixou de ser um canal de apoio para se tornar o maior aliado na carreira de um artista. Não se trata mais apenas de "lançar um álbum", mas de orquestrar eventos multiculturais que unem música, tecnologia e muitas vezes, comunidades gamers. 

Durante a pandemia do COVID-19, o ápice dessa estratégia foi o evento "Astronomical", a colaboração entre Travis Scott e Fortnite. Mais do que um show virtual, essa campanha foi uma aula de estratégia cross-media, transformando um dos maiores jogos do mundo em um palco psicodélico e interativo. Ali, o marketing digital mostrou que, no futuro o engajamento não será apenas ouvido ou assistido, ele será vivido. A conexão com o público mesmo que virtual, foi muito clara e forte apesar da distância e ausência real do cantor, dessa forma estabelecendo a parceria entre artistas e games como um conceito que veio para permanecer. 

Por fim, pode-se se dizer que o case Astronomical foi um divisor de águas que provou que o artista moderno precisa ser, acima de tudo, um arquiteto de experiências. Travis não apenas quebrou recordes de audiência, como também quebrou a barreira entre o ídolo e o avatar, transformando o consumo passivo em participação ativa. Para o marketing musical, a lição é definitiva: o sucesso no século XXI não reside apenas em estar no topo das paradas, mas em encontrar e ocupar locais onde o seu público vive e se relaciona.',
    'https://images.unsplash.com/photo-1614853316476-de00d14cb1fc?q=80&w=1000&auto=format&fit=crop',
    'Estratégias de Marketing Digital',
    true
  ),
  (
    (SELECT id FROM members WHERE username = 'triz'),
    'Shadow Drop: o lançamento surpresa de Apex Legends foi genial ou arriscado?',
    'Em 2019, Apex Legends surgiu do nada. Sem teaser, sem campanha longa. Funcionou?',
    'Shadow drop: quando o jogo é lançado imediatamente após o anúncio. E funcionou. A Apex Legends bateu milhões de jogadores em poucos dias e dominou a Twitch. Grandes streamers estavam jogando desde a primeira hora, muitos com contratos estratégicos para impulsionar o alcance. Foi uma explosão de atenção. 

Por que deu tão certo no começo? 
• Influenciadores jogando no lançamento 
• Jogo gratuito (barreira de entrada zero) 
• Mercado já acostumado com battle royale como Fortnite 
• Sensação de novidade imediata 

Todo mundo queria testar. Todo mundo estava falando sobre. Mas aí vem a parte importante. O hype foi rápido demais? Quando você cria um pico muito alto de atenção, a queda pode ser forte. Depois do lançamento, muitos jogadores sentiram que as atualizações demoraram, o conteúdo inicial era limitado e faltava algo realmente novo para manter o entusiasmo. 

Em jogos como serviço, marketing não é só lançamento. É atualização constante. Se você cria um hype gigante, precisa ter estrutura para sustentar essa expectativa. Apex Legends mostra que explodir em audiência é possível com estratégia certa, mas manter milhões exige um plano forte o suficiente para durar no topo. No final das contas, o palco mudou, mas o objetivo continua sendo a conexão real.',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop',
    'Estratégias de Marketing Digital',
    true
  ),
  (
    (SELECT id FROM members WHERE username = 'clarisse'),
    'A "Torre de Marfim" da Apple TV+: O Caso Pachinko e o Marketing Invisível',
    'Pachinko é uma obra-prima que sofre do mal da "Boutique Digital": uma vitrine que poucos enxergam.',
    'Se você ainda não assistiu a Pachinko, a culpa provavelmente não é sua, é do marketing da Apple. A série é uma obra-prima multigeracional que narra a saga de uma família coreana imigrante. Tem fotografia de cinema, atuações viscerais e um orçamento que faria qualquer produtor de Hollywood chorar. No entanto, ela sofre do mal da "Boutique Digital": é um produto de luxo guardado em uma vitrine que pouca gente consegue enxergar. 

A Apple TV+ adota uma postura de marketing de prestígio. Eles acreditam que, se o conteúdo for bom o suficiente, os críticos darão o selo de aprovação e o público virá por osmose. Spoiler: na era do TikTok, isso não acontece. 

Como o Marketing Digital poderia ter mudado o jogo? Três estratégias que foram ignoradas: 
1. O Poder do Contexto (Educação como Gancho): Faltou SEO e parcerias com canais de história. 
2. O fenômeno "Hallyu" e Lee Min-ho: Faltou capitalizar o fandom digital com conteúdo nativo para redes sociais. 
3. Micro-momentos Emocionais (Efeito TikTok): Edições curtas e impactantes para Reels e TikTok focadas no sentimento. 

A Apple TV+ prova que ter o melhor produto do mundo não basta se você não dominar a distribuição da atenção. O marketing precisa aprender a falar a língua do algoritmo.',
    'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1000&auto=format&fit=crop',
    'Estratégias de Marketing Digital',
    true
  ),
  (
    (SELECT id FROM members WHERE username = 'eduardo'),
    'Marketing Supremo: Como o Timothée Chalamet colocou olhos no seu filme independente',
    'A estratégia inusitada de transformar o filme Marty Supreme (2025) em um evento pop global.',
    'Marty Supreme (2025) é um filme semi-biográfico onde Timothée Chalamet interpreta um jovem ambicioso que quer se tornar o maior jogador de tênis de mesa do mundo. 

A estratégia de marketing começou de forma estranha: um vídeo de quase 20 minutos simulando uma chamada onde o ator propunha ideias absurdas, como pintar as pirâmides do Egito de laranja. Uma brincadeira que serviu para comparar o marketing do filme com o fenômeno "Barbie". 

O ator adotou a persona "Marty" em entrevistas, andava rodeado de homens fantasiados com cabeças de bola de tênis mesa e trabalhou pesado no marketing digital com youtubers e tiktokers. A aparição em Tiktoks foi essencial para atrair a Geração Z para um filme independente. 

A lição aqui é que o nome do ator foi usado como alicerce para uma campanha que usou a estética das "eras artísticas" do Pop para vender um filme de nicho. O sucesso veio de encontrar e ocupar locais onde o público realmente vive no ambiente digital.',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1000&auto=format&fit=crop',
    'Estratégias de Marketing Digital',
    true
  );

-- Função para verificar login (retorna membro se credenciais corretas)
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
  avatar_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id, m.username, m.codename, m.niche, m.column_name,
    m.author_name, m.color_primary, m.color_secondary, m.bio, m.avatar_url
  FROM members m
  WHERE m.username = p_username
    AND m.password_hash = crypt(p_password, m.password_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
