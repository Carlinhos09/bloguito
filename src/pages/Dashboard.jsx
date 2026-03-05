import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'

export default function Dashboard() {
    const { member, logout } = useAuth()
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingPost, setEditingPost] = useState(null)

    // Form State
    const [title, setTitle] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [content, setContent] = useState('')
    const [coverImageUrl, setCoverImageUrl] = useState('')
    const [weeklyTheme, setWeeklyTheme] = useState('')
    const [published, setPublished] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (member) {
            fetchMemberPosts()
        }
    }, [member])

    async function fetchMemberPosts() {
        setLoading(true)
        try {
            const { data } = await supabase
                .from('posts')
                .select('*')
                .eq('member_id', member.id)
                .order('created_at', { ascending: false })
            setPosts(data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    function handleOpenModal(post = null) {
        if (post) {
            setEditingPost(post)
            setTitle(post.title || '')
            setSubtitle(post.subtitle || '')
            setContent(post.content || '')
            setCoverImageUrl(post.cover_image_url || '')
            setWeeklyTheme(post.weekly_theme || '')
            setPublished(post.published ?? true)
        } else {
            setEditingPost(null)
            setTitle('')
            setSubtitle('')
            setContent('')
            setCoverImageUrl('')
            setWeeklyTheme('')
            setPublished(true)
        }
        setIsModalOpen(true)
    }

    function handleCloseModal() {
        setIsModalOpen(false)
        setEditingPost(null)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setIsSubmitting(true)

        const postData = {
            member_id: member.id,
            title,
            subtitle,
            content,
            cover_image_url: coverImageUrl,
            weekly_theme: weeklyTheme,
            published,
            updated_at: new Date()
        }

        try {
            if (editingPost) {
                const { error } = await supabase
                    .from('posts')
                    .update(postData)
                    .eq('id', editingPost.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('posts')
                    .insert([postData])
                if (error) throw error
            }

            handleCloseModal()
            fetchMemberPosts()
        } catch (err) {
            alert('Erro ao salvar post. Verifique as configurações do Supabase.')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleDelete(id) {
        if (!confirm('Deseja realmente apagar esta publicação?')) return

        try {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', id)
            if (error) throw error
            fetchMemberPosts()
        } catch (err) {
            console.error(err)
        }
    }

    async function handleTogglePublish(post) {
        try {
            const { error } = await supabase
                .from('posts')
                .update({ published: !post.published })
                .eq('id', post.id)
            if (error) throw error
            fetchMemberPosts()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="dashboard-page" style={{
            '--member-primary': member?.color_primary || '#7c3aed',
            '--member-secondary': member?.color_secondary || '#a78bfa'
        }}>
            <Navbar />

            <header className="dashboard-header">
                <div className="container">
                    <div className="dashboard-header-inner">
                        <div>
                            <div className="dashboard-welcome">Bem-vindo de volta, {member?.author_name}</div>
                            <h1 className="dashboard-title">{member?.codename}</h1>
                        </div>
                        <div className="dashboard-actions">
                            <button className="btn-create" onClick={() => handleOpenModal()}>
                                <span>+ Novo Post</span>
                            </button>
                            <button className="btn-logout" onClick={logout}>Sair</button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="dashboard-posts">
                <div className="container">
                    <div className="dashboard-posts-header">
                        <h2 className="dashboard-posts-title">Suas Publicações</h2>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{posts.length} total</div>
                    </div>

                    {loading ? (
                        <div className="spinner" style={{ margin: '40px auto' }} />
                    ) : posts.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">✍️</div>
                            <p className="empty-state-text">
                                Você ainda não tem publicações.<br />
                                Clique em "Novo Post" para começar sua tempestade.
                            </p>
                        </div>
                    ) : (
                        <div className="dashboard-post-list">
                            {posts.map(post => (
                                <div key={post.id} className="dashboard-post-item">
                                    <div className={`dashboard-post-status ${post.published ? 'published' : 'draft'}`}
                                        title={post.published ? 'Publicado' : 'Rascunho'} />

                                    <div className="dashboard-post-info">
                                        <h3 className="dashboard-post-title">{post.title}</h3>
                                        <div className="dashboard-post-meta">
                                            {post.weekly_theme && <span> Tema: {post.weekly_theme} • </span>}
                                            {new Date(post.created_at).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>

                                    <div className="dashboard-post-actions">
                                        <button
                                            className={`btn-icon toggle-btn ${post.published ? 'published' : ''}`}
                                            onClick={() => handleTogglePublish(post)}
                                            title={post.published ? 'Despublicar' : 'Publicar'}
                                        >
                                            {post.published ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                        <button
                                            className="btn-icon"
                                            onClick={() => handleOpenModal(post)}
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn-icon danger"
                                            onClick={() => handleDelete(post.id)}
                                            title="Excluir"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Post Editor Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <motion.div
                        className="modal"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="modal-header">
                            <h2 className="modal-title">{editingPost ? 'Editar Post' : 'Novo Post'}</h2>
                            <button className="modal-close" onClick={handleCloseModal}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Título</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Título chamativo"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Subtítulo / Breve Descrição</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Uma pequena introdução..."
                                        value={subtitle}
                                        onChange={(e) => setSubtitle(e.target.value)}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Tema da Semana</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Ex: Cyberpunk"
                                            value={weeklyTheme}
                                            onChange={(e) => setWeeklyTheme(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">URL da Imagem de Capa</label>
                                        <input
                                            type="url"
                                            className="form-input"
                                            placeholder="https://..."
                                            value={coverImageUrl}
                                            onChange={(e) => setCoverImageUrl(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Conteúdo do Post (Markdown em breve)</label>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Escreva sua tempestade aqui..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <label className="checkbox-group">
                                    <input
                                        type="checkbox"
                                        checked={published}
                                        onChange={(e) => setPublished(e.target.checked)}
                                    />
                                    <span className="checkbox-label">Publicar imediatamente</span>
                                </label>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>Cancelar</button>
                                <button
                                    type="submit"
                                    className="btn-save"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Salvando...' : 'Salvar Publicação'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
