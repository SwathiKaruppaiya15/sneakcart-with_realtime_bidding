import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Footer.css'

function Footer() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span>👟 SneakCart</span>
          <p>Your go-to marketplace for premium sneakers.</p>
          <p>This is only for learning and study purpose.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/products">Products</a></li>
            <li><a href="/trends">Trends</a></li>
            <li><a href="/wishlist">Wishlist</a></li>
            <li><a href="/orders">Orders</a></li>
          </ul>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>support@sneakcart.com</p>
          <p>+0422 12082 006</p>
        </div>

        {/* Account section — shows logout only when logged in */}
        <div className="footer-account">
          <h4>Account</h4>
          {currentUser ? (
            <div className="footer-user-info">
              <p className="footer-user-name">👤 {currentUser.name}</p>
              <p className="footer-user-email">{currentUser.email}</p>
              <button className="footer-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <p className="footer-not-logged">Not logged in</p>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SneakCart. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
