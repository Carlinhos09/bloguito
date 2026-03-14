import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    async function handleLogin(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Call custom RPC for login verification
            const { data, error: rpcError } = await supabase.rpc('verify_member_login', {
                p_username: username.toLowerCase().trim(),
                p_password: password
            })

            if (rpcError) throw rpcError

            if (data && data.length > 0) {
                login(data[0])
                navigate('/dashboard')
            } else {
                setError('Usuário ou senha incorretos.')
            }
        } catch (err) {
            console.error(err)
            setError('Erro ao validar login. Verifique sua conexão.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-bg" />
            <div className="orb orb-1" />

            <div className="login-box">
                <div className="login-card">
                    <div className="login-logo">
                        <div className="login-logo-text gradient-text">Tempestade</div>
                        <div className="login-logo-sub">Área do Administrador</div>
                    </div>

                    <h1 className="login-title">Acesso Restrito</h1>
                    <p className="login-subtitle">Entre com suas credenciais de membro.</p>

                    <form onSubmit={handleLogin}>
                        {error && <div className="login-error">{error}</div>}

                        <div className="form-group">
                            <label className="form-label">Usuário</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ex: triz"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Senha</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading}
                        >
                            <span>{loading ? 'Validando...' : 'Entrar na Tempestade'}</span>
                        </button>
                    </form>

                    <Link to="/" className="login-back">← Voltar Galeria Pública</Link>
                </div>
            </div>
        </div>
    )
}
