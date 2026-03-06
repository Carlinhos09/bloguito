import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../utils/cropImage'
function SettingsModal({ isOpen, onClose }) {
    const { member, updateMember } = useAuth()
    const [authorName, setAuthorName] = useState(member?.author_name || '')
    const [codename, setCodename] = useState(member?.codename || '')
    const [bio, setBio] = useState(member?.bio || '')
    const [academicReferences, setAcademicReferences] = useState(member?.academic_references || '')
    const [usefulLinks, setUsefulLinks] = useState(member?.useful_links || '')
    const [uploading, setUploading] = useState(false)
    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(member?.avatar_url || '')
    const [imageSrc, setImageSrc] = useState(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [isCropping, setIsCropping] = useState(false)

    useEffect(() => {
        if (member) {
            setAuthorName(member.author_name)
            setCodename(member.codename)
            setBio(member.bio || '')
            setAcademicReferences(member.academic_references || '')
            setUsefulLinks(member.useful_links || '')
            setAvatarPreview(member.avatar_url || '')
        }
    }, [member, isOpen])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setImageSrc(reader.result)
                setIsCropping(true)
                setCrop({ x: 0, y: 0 })
                setZoom(1)
            }
            reader.readAsDataURL(file)
        }
    }

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }

    const handleConfirmCrop = async () => {
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
            setAvatarFile(croppedImageBlob)
            setAvatarPreview(URL.createObjectURL(croppedImageBlob))
            setIsCropping(false)
            setImageSrc(null)
        } catch (e) {
            console.error(e)
            alert("Erro ao recortar imagem")
        }
    }

    const handleCancelCrop = () => {
        setIsCropping(false)
        setImageSrc(null)
    }

    const handleRemoveAvatar = () => {
        setAvatarFile(null)
        setAvatarPreview('')
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setUploading(true)

        try {
            // Se o preview estiver vazio, o usuário removeu a foto.
            // Caso contrário, mantemos a URL atual (ou a nova se houver upload).
            let avatarUrl = avatarPreview === '' ? '' : (member.avatar_url || '')

            if (avatarFile) {
                const fileExt = avatarFile.name.split('.').pop()
                const fileName = `${member.id}-${Math.random()}.${fileExt}`
                const filePath = `${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, avatarFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath)

                avatarUrl = publicUrl
            }

            const { error: updateError } = await supabase
                .from('members')
                .update({
                    author_name: authorName,
                    codename: codename,
                    bio: bio,
                    avatar_url: avatarUrl,
                    academic_references: academicReferences,
                    useful_links: usefulLinks
                })
                .eq('id', member.id)

            if (updateError) throw updateError

            updateMember({
                author_name: authorName,
                codename: codename,
                bio: bio,
                avatar_url: avatarUrl,
                academic_references: academicReferences,
                useful_links: usefulLinks
            })

            onClose()
        } catch (err) {
            console.error(err)
            alert(`Erro ao salvar configurações: ${err.message || 'Erro desconhecido'}`)
        } finally {
            setUploading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <motion.div
                className="modal settings-modal"
                onClick={e => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="modal-header">
                    <h2 className="modal-title">{isCropping ? 'Ajustar Foto' : 'Configurações de Perfil'}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {isCropping ? (
                    <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
                        <div style={{ position: 'relative', flex: 1, background: '#111', borderRadius: '8px', overflow: 'hidden' }}>
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={4 / 3}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="modal-footer" style={{ marginTop: '20px' }}>
                            <button type="button" className="btn-cancel" onClick={handleCancelCrop}>Cancelar</button>
                            <button type="button" className="btn-save" onClick={handleConfirmCrop}>Confirmar Recorte</button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="modal-body">
                        <div className="avatar-upload-section">
                            <div className="avatar-preview-container" style={{ '--member-color': member?.color_primary }}>
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Preview"
                                        className="avatar-preview-img"
                                    />
                                ) : (
                                    <span className="avatar-preview-placeholder">👤</span>
                                )}
                                <label htmlFor="avatar-input" className="avatar-upload-label">
                                    📷
                                </label>
                            </div>
                            <input
                                id="avatar-input"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            {avatarPreview && (
                                <button
                                    type="button"
                                    className="btn-remove-avatar"
                                    style={{ marginTop: '16px', display: 'block', width: '100%' }}
                                    onClick={handleRemoveAvatar}
                                >
                                    Remover Foto
                                </button>
                            )}
                            <p className="avatar-help">Clique na câmera para mudar sua foto de destaque.</p>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Nome do Autor</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={authorName}
                                    onChange={e => setAuthorName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Codinome</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={codename}
                                    onChange={e => setCodename(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Bio (Breve apresentação)</label>
                            <textarea
                                className="form-textarea"
                                style={{ minHeight: '100px' }}
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Referências Acadêmicas (Use padrão ABNT ou de sua preferência)</label>
                            <textarea
                                className="form-textarea"
                                style={{ minHeight: '120px' }}
                                value={academicReferences}
                                onChange={e => setAcademicReferences(e.target.value)}
                                placeholder="Ex: KOTLER, Philip. Administração de Marketing..."
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Curadoria de Links Úteis</label>
                            <textarea
                                className="form-textarea"
                                style={{ minHeight: '120px' }}
                                value={usefulLinks}
                                onChange={e => setUsefulLinks(e.target.value)}
                                placeholder="Ex: Site de Tendências: https://wgsn.com"
                            />
                        </div>

                        <div className="modal-footer" style={{ marginTop: '20px' }}>
                            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn-save" disabled={uploading}>
                                {uploading ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    )
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [settingsModalOpen, setSettingsModalOpen] = useState(false)
    const { member, logout } = useAuth()
    const navigate = useNavigate()
    const userMenuRef = useRef(null)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', handleScroll)

        // Close user menu when clicking outside
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleLogout = () => {
        logout()
        setMenuOpen(false)
        setUserMenuOpen(false)
        navigate('/')
    }

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
                <div className="container">
                    <div className="navbar-inner">
                        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
                            <span className="logo-storm">Tempestade</span>
                            <span> Digital</span>
                        </Link>

                        <button
                            className="mobile-toggle"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Menu"
                        >
                            <div className="bar"></div>
                            <div className="bar"></div>
                            <div className="bar"></div>
                        </button>

                        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
                            <Link to="/member/triz" className="navbar-link" onClick={() => setMenuOpen(false)}>Modo Criativo</Link>
                            <Link to="/member/eduardo" className="navbar-link" onClick={() => setMenuOpen(false)}>Entre Frames</Link>
                            <Link to="/member/sophia" className="navbar-link" onClick={() => setMenuOpen(false)}>Drop</Link>
                            <Link to="/member/clarisse" className="navbar-link" onClick={() => setMenuOpen(false)}>Episódio Zero</Link>

                            {member ? (
                                <div className="user-menu-container" ref={userMenuRef}>
                                    <button
                                        className="user-avatar-btn"
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        style={{ '--member-color': member.color_primary || '#7c3aed' }}
                                    >
                                        <span className="avatar-icon">👤</span>
                                    </button>

                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <motion.div
                                                className="user-dropdown"
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="dropdown-header">
                                                    <div className="user-info">
                                                        <span className="user-name">{member.author_name}</span>
                                                        <span className="user-role">{member.codename}</span>
                                                    </div>
                                                </div>
                                                <div className="dropdown-divider" />
                                                <Link to="/dashboard" className="dropdown-item" onClick={() => { setUserMenuOpen(false); setMenuOpen(false) }}>
                                                    <span className="item-icon">⚡</span> Dashboard
                                                </Link>
                                                <button className="dropdown-item" onClick={() => { setSettingsModalOpen(true); setUserMenuOpen(false) }}>
                                                    <span className="item-icon">⚙️</span> Configurações
                                                </button>
                                                <div className="dropdown-divider" />
                                                <button className="dropdown-item logout-item" onClick={handleLogout}>
                                                    <span className="item-icon">🚪</span> Sair
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link to="/login" className="navbar-link admin-btn" onClick={() => setMenuOpen(false)}>Admin</Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <SettingsModal isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
        </>
    )
}
