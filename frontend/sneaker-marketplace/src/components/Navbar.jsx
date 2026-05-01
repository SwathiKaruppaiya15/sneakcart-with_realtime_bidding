import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'
import './Navbar.css'

function Navbar() {
  const { cartCount }  = useCart()
  const { wishlist }   = useWishlist()
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const [modalOpen, setModalOpen]   = useState(false)
  const [modalMode, setModalMode]   = useState('signin')
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const openModal = (mode) => { setModalMode(mode); setModalOpen(true) }
  const closeModal = () => setModalOpen(false)

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  const handleOrders = () => {
    if (!currentUser) { openModal('signin'); return }
    navigate('/orders')
  }

  return (
    <>
      <nav className="navbar">

        {/* LEFT — Logo */}
        <NavLink to="/" className="navbar-brand">👟 SneakCart</NavLink>

        {/* CENTER — Main nav */}
        <ul className="navbar-center">
          <li>
            <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/trends" className={({ isActive }) => isActive ? 'active' : ''}>
              Trends
            </NavLink>
          </li>
        </ul>

        {/* RIGHT — Icons + Auth */}
        <div className="navbar-right">

          {/* Wishlist */}
          <NavLink to="/wishlist" className={({ isActive }) => `nav-icon-link ${isActive ? 'active' : ''}`}>
            Wishlist
            {wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
          </NavLink>

          {/* Cart */}
          <NavLink to="/cart" className={({ isActive }) => `nav-icon-link ${isActive ? 'active' : ''}`}>
            Cart
            {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          </NavLink>

          {/* Orders — protected */}
          <button className="nav-icon-link nav-btn-link" onClick={handleOrders}>
            Orders
          </button>

          {/* Admin link — ONLY visible when role is ADMIN */}
          {currentUser?.role === 'ADMIN' && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-icon-link nav-admin-link ${isActive ? 'active' : ''}`}
            >
              ⚙ Admin
            </NavLink>
          )}

          {/* Auth section */}
          {currentUser ? (
            <div className="nav-user" onMouseLeave={() => setUserMenuOpen(false)}>
              <button
                className="nav-user-btn"
                onClick={() => setUserMenuOpen(v => !v)}
              >
                <span className="nav-avatar">
                  {currentUser.name.charAt(0).toUpperCase()}
                </span>
                <span className="nav-username">
                  Hello, {currentUser.name.split(' ')[0]}
                </span>
                <span className="nav-chevron">{userMenuOpen ? '▲' : '▼'}</span>
              </button>

              {userMenuOpen && (
                <div className="nav-dropdown">
                  <p className="nav-dropdown-email">{currentUser.email}</p>
                  <button
                    className="nav-dropdown-item"
                    onClick={() => { setUserMenuOpen(false); navigate('/orders') }}
                  >
                    📦 My Orders
                  </button>
                  <button
                    className="nav-dropdown-item"
                    onClick={() => { setUserMenuOpen(false); navigate('/wishlist') }}
                  >
                    ♡ Wishlist
                  </button>
                  <div className="nav-dropdown-divider" />
                  <button className="nav-dropdown-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth-btns">
              <button className="nav-btn-signin" onClick={() => openModal('signin')}>
                Sign In
              </button>
              <button className="nav-btn-signup" onClick={() => openModal('signup')}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={modalOpen}
        initialMode={modalMode}
        onClose={closeModal}
      />
    </>
  )
}

export default Navbar
