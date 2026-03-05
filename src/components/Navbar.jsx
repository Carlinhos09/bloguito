import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
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
                                            <button className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
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
    )
}
