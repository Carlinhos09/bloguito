import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { MEMBERS_CONFIG } from './Home'

export default function MemberProfile() {
    const { username } = useParams()
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [memberInfo, setMemberInfo] = useState(null)
    const [activeTab, setActiveTab] = useState('posts')

    const mc = MEMBERS_CONFIG.find(m => m.username === username) || MEMBERS_CONFIG[0]

    useEffect(() => {
        fetchMemberData()
        window.scrollTo(0, 0)
    }, [username])

    async function fetchMemberData() {
        setLoading(true)
        try {
            // Fetch member profile from DB
            const { data: memberData } = await supabase
                .from('members')
                .select('*')
                .eq('username', username)
                .single()

            if (memberData) {
                setMemberInfo(memberData)
            } else {
                // Fallback to config if not in DB yet
                setMemberInfo({
                    codename: mc.codename,
                    column_name: mc.column,
                    author_name: mc.author,
                    bio: 'Explorando as fronteiras do entretenimento digital.',
                    color_primary: mc.primary,
                    color_secondary: mc.secondary
                })
            }

            // Fetch member posts
            const { data: postsData } = await supabase
                .from('posts')
                .select('*')
                .eq('published', true)
                .eq('member_id', memberData?.id || '00000000-0000-0000-0000-000000000000') // Avoid error if no member
                .order('created_at', { ascending: false })

            setPosts(postsData || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (!mc) return <div>Membro não encontrado</div>

    return (
        <div className="profile-page" style={{
            '--member-primary': mc.primary,
            '--member-secondary': mc.secondary,
            '--member-glow': mc.glow
        }}>
            <Navbar />

            <header className="profile-hero">
                <div className="profile-hero-bg" style={{ background: mc.bgGradient }}>
                    {memberInfo?.avatar_url && (
                        <img
                            src={memberInfo.avatar_url}
                            alt={memberInfo.author_name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                opacity: 0.5
                            }}
                        />
                    )}
                </div>
                <div className="hero-scanline" />
                <div className="profile-hero-gradient" />

                <div className="container profile-hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="profile-codename-small">{mc.codename}</p>
                        <h1 className="profile-column-name">{mc.column}</h1>
                        <div className="profile-author-name">por {mc.author}</div>
                        <p className="profile-bio">{memberInfo?.bio}</p>
                    </motion.div>
                </div>
            </header>

            <section className="profile-content-area">
                <div className="container">
                    <div className="profile-tabs fade-in visible">
                        <button
                            className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                            onClick={() => setActiveTab('posts')}
                        >
                            Expositor de Ideias
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'links' ? 'active' : ''}`}
                            onClick={() => setActiveTab('links')}
                        >
                            Links Úteis
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'references' ? 'active' : ''}`}
                            onClick={() => setActiveTab('references')}
                        >
                            Referências Acadêmicas
                        </button>
                    </div>

                    <div className="profile-tab-content fade-in visible">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'posts' && (
                                    <>
                                        <div className="profile-posts-header">
                                            <span className="profile-posts-count">{posts.length} publicações na neblina</span>
                                        </div>
                                        {loading ? (
                                            <div className="spinner" style={{ margin: '60px auto' }} />
                                        ) : posts.length === 0 ? (
                                            <div className="empty-state">
                                                <div className="empty-state-icon">☁️</div>
                                                <p className="empty-state-text">
                                                    Nenhuma publicação encontrada por aqui ainda.<br />
                                                    A neblina está espessa.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="profile-post-list">
                                                {posts.map((post, i) => (
                                                    <motion.div
                                                        key={post.id}
                                                        className="profile-post-item"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: i * 0.05 }}
                                                        onClick={() => navigate(`/post/${post.id}`)}
                                                    >
                                                        <div className="profile-post-thumb">
                                                            {post.cover_image_url ? (
                                                                <img src={post.cover_image_url} alt={post.title} />
                                                            ) : mc.glyph}
                                                        </div>
                                                        <div className="profile-post-info">
                                                            <div className="profile-post-theme">{post.weekly_theme || 'Sem Tema'}</div>
                                                            <h3 className="profile-post-title">{post.title}</h3>
                                                            <p className="profile-post-subtitle">{post.subtitle}</p>
                                                        </div>
                                                        <div className="profile-post-date">
                                                            {new Date(post.created_at).toLocaleDateString('pt-BR')}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}

                                {activeTab === 'links' && (
                                    <div className="resource-content">
                                        <h3 className="resource-title">Curadoria Espacial</h3>
                                        <div className="resource-text">
                                            {memberInfo?.useful_links ? (
                                                memberInfo.useful_links
                                            ) : (
                                                <span className="text-muted">Nenhum link catalogado ainda.</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'references' && (
                                    <div className="resource-content">
                                        <h3 className="resource-title">Base de Dados e Pesquisa</h3>
                                        <div className="resource-text">
                                            {memberInfo?.academic_references ? (
                                                memberInfo.academic_references
                                            ) : (
                                                <span className="text-muted">Nenhuma referência catalogada ainda.</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="container">
                    <div className="footer-inner">
                        <div className="footer-logo">
                            <span className="gradient-text">Tempestade</span> Digital
                        </div>
                        <Link to="/" className="footer-member-link">Voltar ao Início</Link>
                        <div className="footer-credit">⚡</div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
