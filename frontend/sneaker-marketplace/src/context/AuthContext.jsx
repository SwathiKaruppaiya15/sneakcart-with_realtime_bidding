import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

// ── Hardcoded admin credentials ───────────────────────────────────────────────
const ADMIN_EMAIL    = 'swathikaruppaiya63@gmail.com'
const ADMIN_PASSWORD = 'Swathi@123'

export function AuthProvider({ children }) {

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
    // Admin email cannot be used for signup
    const role = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'ADMIN' : 'USER'
    const newUser = { name, email: email.toLowerCase(), password, role }
    localStorage.setItem('users', JSON.stringify([...users, newUser]))
    _persist(newUser)
    return newUser
  }

  // ── Sign In ──────────────────────────────────────────────────────────────
  const login = (email, password) => {
    const normalizedEmail = email.toLowerCase().trim()

    // Check admin credentials first
    if (
      normalizedEmail === ADMIN_EMAIL.toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      const adminUser = {
        id:    0,
        name:  'Admin',
        email: ADMIN_EMAIL.toLowerCase(),
        role:  'ADMIN',
      }
      _persist(adminUser)
      return adminUser
    }

    // Regular user login from localStorage
    const users = getUsers()
    const user  = users.find(
      u => u.email.toLowerCase() === normalizedEmail && u.password === password
    )
    if (!user) throw new Error('Incorrect email or password.')

    // Ensure role is always set
    const userWithRole = { ...user, role: user.role || 'USER' }
    _persist(userWithRole)
    return userWithRole
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
