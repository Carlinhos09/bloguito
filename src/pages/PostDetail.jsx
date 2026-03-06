import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { MEMBERS_CONFIG } from './Home'

export default function PostDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPost()
        window.scrollTo(0, 0)
    }, [id])

    async function fetchPost() {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*, members(*)')
                .eq('id', id)
                .single()

            if (error) throw error
            setPost(data)
        } catch (err) {
            console.error(err)
            navigate('/')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="loading-screen"><div className="spinner" /></div>
    if (!post) return null

    const mc = MEMBERS_CONFIG.find(m => m.username === post.members?.username) || MEMBERS_CONFIG[0]

    return (
        <div className="post-detail-page" style={{
            '--member-primary': mc.primary,
            '--member-secondary': mc.secondary
        }}>
            <Navbar />

            <header className="post-detail-header">
                <Link to={`/member/${post.members?.username}`} className="post-detail-back">
                    ← Voltar para {post.members?.column_name || mc.column}
                </Link>

                <div className="post-detail-meta">
                    <span className="post-detail-theme-tag" style={{ borderColor: mc.primary, color: mc.secondary }}>
                        🌩 {post.weekly_theme || 'Destaque'}
                    </span>
                    <span className="post-detail-date">
                        {new Date(post.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                </div>

                <h1 className="post-detail-title">{post.title}</h1>
                {post.subtitle && <p className="post-detail-subtitle">{post.subtitle}</p>}

                <div className="post-detail-author">
                    <div className="post-detail-author-avatar" style={{ background: mc.primary, overflow: 'hidden' }}>
                        {post.members?.avatar_url ? (
                            <img
                                src={post.members.avatar_url}
                                alt={post.members.author_name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        ) : (
                            mc.glyph
                        )}
                    </div>
                    <div className="post-detail-author-info">
                        <small>{mc.codename}</small>
                        <strong>{post.members?.author_name || mc.author}</strong>
                    </div>
                </div>
            </header>

            {post.cover_image_url && (
                <div className="post-detail-cover">
                    <motion.img
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        src={post.cover_image_url}
                        alt={post.title}
                    />
                </div>
            )}

            <article className="post-detail-content">
                <div className="post-body">
                    {post.content}
                </div>
            </article>

            <footer className="footer">
                <div className="container">
                    <div className="footer-inner">
                        <div className="footer-logo">
                            <span className="gradient-text">Tempestade</span> Digital
                        </div>
                        <div className="footer-credit">2025/2026 ⚡</div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
