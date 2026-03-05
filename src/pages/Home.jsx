import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

const MEMBERS_CONFIG = [
    {
        username: 'triz',
        codename: 'PLAYER TEMPESTADE',
        column: 'MODO CRIATIVO',
        author: 'Triz',
        niche: 'Jogos',
        glyph: '🎮',
        primary: '#7c3aed',
        secondary: '#a78bfa',
        glow: 'rgba(124,58,237,0.35)',
        bgGradient: 'radial-gradient(ellipse at 30% 30%, rgba(124,58,237,0.3) 0%, rgba(124,58,237,0.05) 60%, transparent 100%)',
        cardGradient: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(167,139,250,0.04) 100%)',
        cardGradientHover: 'linear-gradient(135deg, rgba(124,58,237,0.22) 0%, rgba(167,139,250,0.08) 100%)',
    },
    {
        username: 'eduardo',
        codename: 'DIRETOR PLUVIAL',
        column: 'ENTRE FRAMES',
        author: 'Eduardo',
        niche: 'Filmes',
        glyph: '🎬',
        primary: '#0891b2',
        secondary: '#67e8f9',
        glow: 'rgba(8,145,178,0.35)',
        bgGradient: 'radial-gradient(ellipse at 70% 30%, rgba(8,145,178,0.3) 0%, rgba(103,232,249,0.05) 60%, transparent 100%)',
        cardGradient: 'linear-gradient(135deg, rgba(8,145,178,0.12) 0%, rgba(103,232,249,0.04) 100%)',
        cardGradientHover: 'linear-gradient(135deg, rgba(8,145,178,0.22) 0%, rgba(103,232,249,0.08) 100%)',
    },
    {
        username: 'sophia',
        codename: 'PRODUCER NEBLINA',
        column: 'DROP',
        author: 'Sophia',
        niche: 'Músicas & Trends',
        glyph: '🎵',
        primary: '#db2777',
        secondary: '#f9a8d4',
        glow: 'rgba(219,39,119,0.35)',
        bgGradient: 'radial-gradient(ellipse at 30% 70%, rgba(219,39,119,0.3) 0%, rgba(249,168,212,0.05) 60%, transparent 100%)',
        cardGradient: 'linear-gradient(135deg, rgba(219,39,119,0.12) 0%, rgba(249,168,212,0.04) 100%)',
        cardGradientHover: 'linear-gradient(135deg, rgba(219,39,119,0.22) 0%, rgba(249,168,212,0.08) 100%)',
    },
    {
        username: 'clarisse',
        codename: 'SHOWRUNNER GAROA',
        column: 'EPISÓDIO ZERO',
        author: 'Clarisse',
        niche: 'Séries',
        glyph: '📺',
        primary: '#059669',
        secondary: '#6ee7b7',
        glow: 'rgba(5,150,105,0.35)',
        bgGradient: 'radial-gradient(ellipse at 70% 70%, rgba(5,150,105,0.3) 0%, rgba(110,231,183,0.05) 60%, transparent 100%)',
        cardGradient: 'linear-gradient(135deg, rgba(5,150,105,0.12) 0%, rgba(110,231,183,0.04) 100%)',
        cardGradientHover: 'linear-gradient(135deg, rgba(5,150,105,0.22) 0%, rgba(110,231,183,0.08) 100%)',
    },
]

function formatDate(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export { MEMBERS_CONFIG }

export default function Home() {
    const navigate = useNavigate()
    const [latestPosts, setLatestPosts] = useState([])
    const [loadingPosts, setLoadingPosts] = useState(true)

    useEffect(() => {
        fetchLatestPosts()
        // Scroll reveal
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
            { threshold: 0.1 }
        )
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
        return () => observer.disconnect()
    }, [])

    async function fetchLatestPosts() {
        try {
            const { data } = await supabase
                .from('posts')
                .select('*, members(username, codename, column_name, color_primary, color_secondary)')
                .eq('published', true)
                .order('created_at', { ascending: false })
                .limit(6)
            setLatestPosts(data || [])
        } catch {
            setLatestPosts([])
        } finally {
            setLoadingPosts(false)
        }
    }

    const getMemberConfig = (username) =>
        MEMBERS_CONFIG.find(m => m.username === username) || MEMBERS_CONFIG[0]

    return (
        <div className="home-page">
            <Navbar />

            {/* HERO */}
            <section className="hero">
                <div className="hero-bg" />
                <div className="hero-scanline" />

                {/* Floating orbs */}
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />

                <div className="hero-content" style={{ width: '100%' }}>
                    <div className="hero-eyebrow">
                        <span className="dot" />
                        Blog Universitário
                    </div>

                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="glitch-text" data-text="TEMPESTADE">TEMPESTADE</span>
                        <span className="gradient-text" style={{ display: 'block', fontSize: '0.55em', letterSpacing: '0.08em', marginTop: '8px' }}>
                            DIGITAL
                        </span>
                    </motion.h1>

                    <motion.p
                        className="hero-subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        Quatro meteorologias da cultura pop — jogos, filmes, músicas e séries —
                        convergindo numa tempestade de ideias toda semana.
                    </motion.p>

                    <motion.div
                        className="hero-cta-group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                    >
                        <button className="btn-primary" onClick={() => document.getElementById('members').scrollIntoView({ behavior: 'smooth' })}>
                            <span>Ver Destaques ↓</span>
                        </button>
                        <button className="btn-secondary" onClick={() => document.getElementById('posts').scrollIntoView({ behavior: 'smooth' })}>
                            Últimos Posts
                        </button>
                    </motion.div>
                </div>

                <div className="hero-scroll-indicator">
                    <div className="scroll-line" />
                    Scroll
                </div>
            </section>

            {/* ABOUT */}
            <section className="about-section">
                <div className="container">
                    <div className="about-inner reveal">
                        <div>
                            <p className="about-label">Sobre o Blog</p>
                            <h2 className="about-heading">
                                Onde a cultura pop<br />
                                <span className="gradient-text">vira tempestade</span>
                            </h2>
                            <p className="about-text">
                                Tempestade Digital nasceu de um grupo de quatro pessoas com um ponto em comum:
                                a inabalável paixão pelo entretenimento. Aqui, cada semana traz um novo tema,
                                e cada membro traz sua perspectiva única.
                            </p>
                            <p className="about-text">
                                Da tela do game ao último episódio da série, da faixa que não sai da cabeça
                                ao filme que mudou tudo — tudo isso converge aqui, em formato de blog surreal
                                e sem filtro.
                            </p>
                        </div>
                        <div className="about-stats">
                            <div className="stat-card reveal">
                                <div className="stat-number gradient-text">4</div>
                                <div className="stat-label">Criadores</div>
                            </div>
                            <div className="stat-card reveal">
                                <div className="stat-number gradient-text">∞</div>
                                <div className="stat-label">Temas/Semana</div>
                            </div>
                            <div className="stat-card reveal">
                                <div className="stat-number gradient-text">01</div>
                                <div className="stat-label">Temporada</div>
                            </div>
                            <div className="stat-card reveal">
                                <div className="stat-number gradient-text">🌩</div>
                                <div className="stat-label">Nível de Caos</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MEMBERS / HIGHLIGHTS */}
            <section className="members-section" id="members">
                <div className="container">
                    <div className="section-header reveal">
                        <span className="section-label">Destaques</span>
                        <h2 className="section-title">
                            Os Quatro<br />
                            <span className="gradient-text">Elementos</span>
                        </h2>
                    </div>

                    <div className="members-grid">
                        {MEMBERS_CONFIG.map((member, i) => (
                            <motion.div
                                key={member.username}
                                className="member-card reveal"
                                style={{
                                    '--member-gradient': member.cardGradient,
                                    '--member-gradient-hover': member.cardGradientHover,
                                    '--member-border': `${member.primary}33`,
                                    '--member-border-hover': `${member.primary}88`,
                                    '--member-glow': member.glow,
                                    '--member-bg': member.bgGradient,
                                    '--member-accent': member.primary,
                                    '--member-accent-text': member.secondary,
                                }}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                onClick={() => navigate(`/member/${member.username}`)}
                            >
                                <div className="member-card-bg" style={{ background: member.bgGradient }} />
                                <span className="member-glyph">{member.glyph}</span>

                                <div className="member-card-content">
                                    <span
                                        className="member-column-tag"
                                        style={{ borderColor: `${member.primary}88`, color: member.secondary }}
                                    >
                                        {member.column}
                                    </span>
                                    <h3 className="member-codename">{member.codename}</h3>
                                    <p className="member-author">por {member.author}</p>
                                    <div className="member-niche" style={{ color: member.secondary }}>
                                        {member.niche}
                                    </div>
                                </div>
                                <div className="member-arrow">→</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LATEST POSTS */}
            <section className="posts-section" id="posts">
                <div className="container">
                    <div className="section-header reveal">
                        <span className="section-label">Publicações</span>
                        <h2 className="section-title">
                            Últimos<br />
                            <span className="gradient-text">Posts</span>
                        </h2>
                    </div>

                    {loadingPosts ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                            <div className="spinner" style={{ margin: '0 auto' }} />
                        </div>
                    ) : latestPosts.length === 0 ? (
                        <div className="empty-state reveal">
                            <div className="empty-state-icon">🌩</div>
                            <p className="empty-state-text">
                                A tempestade está se formando...<br />
                                Os primeiros posts chegam em breve.
                            </p>
                        </div>
                    ) : (
                        <div className="posts-grid">
                            {latestPosts.map((post, i) => {
                                const mc = getMemberConfig(post.members?.username)
                                return (
                                    <motion.div
                                        key={post.id}
                                        className="post-card reveal"
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-40px' }}
                                        transition={{ delay: i * 0.08, duration: 0.6 }}
                                        onClick={() => navigate(`/post/${post.id}`)}
                                    >
                                        <div className="post-card-image">
                                            {post.cover_image_url ? (
                                                <img src={post.cover_image_url} alt={post.title} />
                                            ) : (
                                                <div className="post-card-image-placeholder">{mc.glyph}</div>
                                            )}
                                        </div>
                                        <div className="post-card-body">
                                            <div className="post-card-meta">
                                                <span
                                                    className="post-card-member-tag"
                                                    style={{
                                                        background: `${mc.primary}22`,
                                                        color: mc.secondary,
                                                        border: `1px solid ${mc.primary}44`,
                                                    }}
                                                >
                                                    {post.members?.column_name || mc.column}
                                                </span>
                                                <span className="post-card-date">{formatDate(post.created_at)}</span>
                                            </div>
                                            <h3 className="post-card-title">{post.title}</h3>
                                            {post.subtitle && (
                                                <p className="post-card-subtitle">{post.subtitle}</p>
                                            )}
                                        </div>
                                        <div className="post-card-footer">
                                            <div className="post-card-theme-badge">
                                                <span style={{ color: 'var(--text-muted)' }}>
                                                    {post.weekly_theme ? `🌩 ${post.weekly_theme}` : `por ${post.members?.codename || mc.codename}`}
                                                </span>
                                            </div>
                                            <span className="read-more">Ler →</span>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-inner">
                        <div className="footer-logo">
                            <span className="gradient-text">Tempestade</span> Digital
                        </div>
                        <div className="footer-members">
                            {MEMBERS_CONFIG.map(m => (
                                <Link key={m.username} to={`/member/${m.username}`} className="footer-member-link"
                                    style={{ '--hover-color': m.secondary }}
                                >
                                    {m.column}
                                </Link>
                            ))}
                        </div>
                        <div className="footer-credit">
                            Blog universitário ⚡<br />
                            <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>Feito com intensidade</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
