import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getImage } from '../utils/getImage'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import './ProductCard.css'

const colorMap = {
  Black: '#222', White: '#e0e0e0', Red: '#e53935',
  Blue: '#1e88e5', Grey: '#9e9e9e', Green: '#43a047',
  Yellow: '#fdd835', Brown: '#795548',
}

function ProductCard({ product }) {
  const { name, brand, price, color, sizes, badge } = product
  const navigate = useNavigate()

  const [selectedSize, setSelectedSize] = useState(null)
  const [added,        setAdded]        = useState(false)

  const { addToCart }                    = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const wishlisted = isWishlisted(product.id)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    if (!selectedSize) return
    addToCart(product, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleSizeClick = (e, s) => {
    e.stopPropagation()
    setSelectedSize(s)
  }

  const handleWishlist = (e) => {
    e.stopPropagation()
    toggleWishlist(product)
  }

  const goToDetail = () => navigate(`/product/${product.id}`)

  return (
    <div className="product-card">
      {/* Clickable image area → product detail */}
      <div
        className="product-img-wrap"
        onClick={goToDetail}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && goToDetail()}
        style={{ cursor: 'pointer' }}
      >
        <img src={getImage(product.image)} alt={name} className="product-img" />
        {badge && <span className="product-badge">{badge}</span>}
        <button
          className={`wishlist-btn ${wishlisted ? 'wishlisted' : ''}`}
          onClick={handleWishlist}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          {wishlisted ? '♥' : '♡'}
        </button>
      </div>

      <div className="product-info">
        {/* Clickable name → product detail */}
        <p className="product-brand">{brand}</p>
        <h3
          className="product-name"
          onClick={goToDetail}
          style={{ cursor: 'pointer' }}
        >
          {name}
        </h3>

        <p className="product-color">
          <span className="color-dot" style={{ background: colorMap[color] || '#ccc' }} />
          {color}
        </p>
        <p className="product-price">₹{price.toLocaleString('en-IN')}</p>

        <div className="size-selector">
          {sizes.map(s => (
            <button
              key={s}
              className={`size-btn ${selectedSize === s ? 'selected' : ''}`}
              onClick={e => handleSizeClick(e, s)}
            >
              {s}
            </button>
          ))}
        </div>

        {!selectedSize && (
          <p className="size-hint">Select a size to add to cart</p>
        )}

        <button
          className={`btn-add-cart ${!selectedSize ? 'disabled' : ''} ${added ? 'added' : ''}`}
          onClick={handleAddToCart}
          disabled={!selectedSize}
        >
          {added ? '✓ Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
