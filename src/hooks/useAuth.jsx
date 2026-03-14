import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [member, setMember] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Restore session from localStorage
        const saved = localStorage.getItem('tempestade_member')
        if (saved) {
            try {
                setMember(JSON.parse(saved))
            } catch {
                localStorage.removeItem('tempestade_member')
            }
        }
        setLoading(false)
    }, [])

    const login = (memberData) => {
        setMember(memberData)
        localStorage.setItem('tempestade_member', JSON.stringify(memberData))
    }

    const logout = () => {
        setMember(null)
        localStorage.removeItem('tempestade_member')
    }

    const updateMember = (newData) => {
        const updated = { ...member, ...newData }
        setMember(updated)
        localStorage.setItem('tempestade_member', JSON.stringify(updated))
    }

    return (
        <AuthContext.Provider value={{ member, login, logout, updateMember, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
