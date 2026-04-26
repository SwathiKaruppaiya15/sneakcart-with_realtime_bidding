import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import './AuthModal.css'

/**
 * AuthModal
 * Props:
 *   isOpen      — boolean
 *   initialMode — 'signin' | 'signup'
 *   onClose     — () => void
 */
function AuthModal({ isOpen, initialMode = 'signin', onClose }) {
  const { login, signup } = useAuth()

  const [mode,    setMode]    = useState(initialMode)
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [password,setPassword]= useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const firstInputRef = useRef(null)

  // Sync mode when parent changes initialMode (e.g. clicking Sign Up vs Sign In)
  useEffect(() => { setMode(initialMode) }, [initialMode])

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen) {
      setError('')
      setTimeout(() => firstInputRef.current?.focus(), 80)
    }
  }, [isOpen, mode])

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const reset = () => {
    setName(''); setEmail(''); setPassword(''); setError(''); setShowPwd(false)
  }

  const switchMode = (m) => { reset(); setMode(m) }

  const validate = () => {
    if (mode === 'signup' && !name.trim())
      return 'Please enter your name.'
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      return 'Please enter a valid email address.'
    if (password.length < 6)
      return 'Password must be at least 6 characters.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    setError('')
    try {
      if (mode === 'signup') {
        signup(name.trim(), email.trim(), password)
      } else {
        login(email.trim(), password)
      }
      reset()
      onClose()
    } catch (ex) {
      setError(ex.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="auth-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="auth-modal" role="dialog" aria-modal="true" aria-label={mode === 'signin' ? 'Sign In' : 'Sign Up'}>

        {/* Close button */}
        <button className="auth-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Logo */}
        <div className="auth-logo">👟 SneakCart</div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'signin' ? 'auth-tab-active' : ''}`}
            onClick={() => switchMode('signin')}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${mode === 'signup' ? 'auth-tab-active' : ''}`}
            onClick={() => switchMode('signup')}
            type="button"
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Name — signup only */}
          {mode === 'signup' && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full Name</label>
              <input
                id="auth-name"
                ref={firstInputRef}
                type="text"
                placeholder="Arjun Sharma"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              ref={mode === 'signin' ? firstInputRef : undefined}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <div className="auth-pwd-wrap">
              <input
                id="auth-password"
                type={showPwd ? 'text' : 'password'}
                placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Your password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                className="auth-pwd-toggle"
                onClick={() => setShowPwd(v => !v)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && <p className="auth-error">⚠ {error}</p>}

          {/* Submit */}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>

        </form>

        {/* Footer switch */}
        <p className="auth-switch">
          {mode === 'signin' ? (
            <>Don't have an account?{' '}
              <button type="button" onClick={() => switchMode('signup')}>Sign Up</button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button type="button" onClick={() => switchMode('signin')}>Sign In</button>
            </>
          )}
        </p>

      </div>
    </>
  )
}

export default AuthModal
