import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from token on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }

    api.get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  const register = async ({ name, email, password }) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      localStorage.setItem('token', data.token)
      setUser(data.user)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Registration failed.' }
    }
  }

  const login = async ({ email, password }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      setUser(data.user)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Login failed.' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
