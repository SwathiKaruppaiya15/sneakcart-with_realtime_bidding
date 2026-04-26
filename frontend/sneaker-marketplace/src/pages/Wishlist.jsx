import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ProductCard'
import './Wishlist.css'

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist()

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        {wishlist.length > 0 && (
          <p className="wishlist-count">{wishlist.length} item{wishlist.length > 1 ? 's' : ''} saved</p>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">♡</div>
          <h3>Your wishlist is empty</h3>
          <p>Tap the heart on any sneaker to save it here.</p>
          <Link to="/products" className="btn-browse">Browse Products</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(p => (
            <div key={p.id} className="wishlist-item">
              <ProductCard product={p} />
              <button className="btn-remove-wish" onClick={() => removeFromWishlist(p.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist
