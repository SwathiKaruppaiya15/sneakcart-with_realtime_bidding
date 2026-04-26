import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span>👟 SneakCart</span>
          <p>Your go-to marketplace for premium sneakers.</p>
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
          <p>+1 (800) 555-0199</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SneakCart. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
