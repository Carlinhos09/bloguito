import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const { member, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = () => {
        logout()
        setMenuOpen(false)
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
                            <>
                                <Link to="/dashboard" className="navbar-link admin-btn" onClick={() => setMenuOpen(false)}>⚡ Dashboard</Link>
                                <button className="navbar-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>Sair</button>
                            </>
                        ) : (
                            <Link to="/login" className="navbar-link admin-btn" onClick={() => setMenuOpen(false)}>Admin</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
