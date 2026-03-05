import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const { member, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <div className="navbar-inner">
                    <Link to="/" className="navbar-logo">
                        <span className="logo-storm">Tempestade</span>
                        <span> Digital</span>
                    </Link>

                    <div className="navbar-links">
                        <Link to="/member/triz" className="navbar-link">Modo Criativo</Link>
                        <Link to="/member/eduardo" className="navbar-link">Entre Frames</Link>
                        <Link to="/member/sophia" className="navbar-link">Drop</Link>
                        <Link to="/member/clarisse" className="navbar-link">Episódio Zero</Link>
                        {member ? (
                            <>
                                <Link to="/dashboard" className="navbar-link admin-btn">⚡ Dashboard</Link>
                                <button className="navbar-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>Sair</button>
                            </>
                        ) : (
                            <Link to="/login" className="navbar-link admin-btn">Admin</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
