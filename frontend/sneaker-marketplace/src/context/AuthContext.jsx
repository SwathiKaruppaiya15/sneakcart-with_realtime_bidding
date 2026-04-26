import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  // Load persisted user on first render
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('currentUser')) || null }
    catch { return null }
  })

  // ── Sign Up ──────────────────────────────────────────────────────────────
  const signup = (name, email, password) => {
    const users = getUsers()
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.')
    }
    const newUser = { name, email: email.toLowerCase(), password }
    localStorage.setItem('users', JSON.stringify([...users, newUser]))
    _persist(newUser)
    return newUser
  }

  // ── Sign In ──────────────────────────────────────────────────────────────
  const login = (email, password) => {
    const users = getUsers()
    const user  = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!user) throw new Error('Incorrect email or password.')
    _persist(user)
    return user
  }

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('currentUser')
    setCurrentUser(null)
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  const _persist = (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user))
    setCurrentUser(user)
  }

  const getUsers = () => {
    try { return JSON.parse(localStorage.getItem('users')) || [] }
    catch { return [] }
  }

  return (
    <AuthContext.Provider value={{ currentUser, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
