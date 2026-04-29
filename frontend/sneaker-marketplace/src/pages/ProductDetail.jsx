import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getImage } from '../utils/getImage'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { products as allProducts } from '../services/productService'
import './ProductDetail.css'

// ── Dummy data (25 products) ──────────────────────────────────────────────────
const colorMap = {
  Black: '#222', White: '#e0e0e0', Red: '#e53935',
  Blue: '#1e88e5', Grey: '#9e9e9e', Brown: '#795548',
}

// Use the shared product list from productService
const PRODUCTS = allProducts

const INR = (n) => `₹${Number(n).toLocaleString('en-IN')}`

// ── Sub-components ────────────────────────────────────────────────────────────

function SizeButton({ size, selected, onClick }) {
  return (
    <button
      className={`pd-size-btn ${selected ? 'pd-size-selected' : ''}`}
      onClick={() => onClick(size)}
      type="button"
    >
      {size}
    </button>
  )
}

function RecommendedCard({ product }) {
  const navigate = useNavigate()
  return (
    <div
      className="pd-rec-card"
      onClick={() => navigate(`/product/${product.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/product/${product.id}`)}
    >
      <div className="pd-rec-img-wrap">
        <img src={getImage(product.image)} alt={product.name} className="pd-rec-img" />
        {product.badge && <span className="pd-rec-badge">{product.badge}</span>}
      </div>
      <div className="pd-rec-info">
        <p className="pd-rec-brand">{product.brand}</p>
        <p className="pd-rec-name">{product.name}</p>
        <p className="pd-rec-price">{INR(product.price)}</p>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

function ProductDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  const product = PRODUCTS.find(p => p.id === Number(id))

  const [selectedSize,    setSelectedSize]    = useState(null)
  const [sizeError,       setSizeError]       = useState('')
  const [cartConfirm,     setCartConfirm]     = useState(false)
  const [activeImg,       setActiveImg]       = useState(0)

  // Reset state when navigating between products
  useEffect(() => {
    setSelectedSize(null)
    setSizeError('')
    setCartConfirm(false)
    setActiveImg(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  if (!product) {
    return (
      <div className="pd-not-found">
        <h2>Product not found</h2>
        <Link to="/products" className="pd-back-link">← Back to Products</Link>
      </div>
    )
  }

  const recommended = PRODUCTS
    .filter(p => p.id !== product.id && p.brand === product.brand)
    .slice(0, 2)
    .concat(
      PRODUCTS.filter(p => p.id !== product.id && p.brand !== product.brand).slice(0, 2)
    )
    .slice(0, 4)

  const wishlisted = isWishlisted(product.id)

  // ── Validation helper ──
  const validateSize = () => {
    if (!selectedSize) {
      setSizeError('Please select a size before continuing.')
      return false
    }
    setSizeError('')
    return true
  }

  // ── Add to Cart ──
  const handleAddToCart = () => {
    if (!validateSize()) return

    // CartContext keeps localStorage in sync automatically
    addToCart(product, selectedSize)

    // Also write the raw structure the prompt requires
    const existing = JSON.parse(localStorage.getItem('cart') || '[]')
    const cartKey  = `${product.id}-${selectedSize}`
    if (!existing.find(i => i.cartKey === cartKey)) {
      existing.push({ id: product.id, name: product.name, price: product.price, size: selectedSize, cartKey })
      localStorage.setItem('cart', JSON.stringify(existing))
    }

    setCartConfirm(true)
    setTimeout(() => setCartConfirm(false), 2500)
  }

  // ── Buy Now ──
  const handleBuyNow = () => {
    if (!validateSize()) return

    const checkoutItem = {
      id:           product.id,
      name:         product.name,
      price:        product.price,
      color:        product.color,
      size:         selectedSize,
      brand:        product.brand,
      qty:          1,
      selectedSize,
      cartKey:      `${product.id}-${selectedSize}`,
    }
    localStorage.setItem('checkoutItem', JSON.stringify(checkoutItem))
    navigate('/checkout')
  }

  // Thumbnail images — show same product image for all 3 slots
  const productImg = getImage(product.image)
  const thumbs = [productImg, productImg, productImg]

  return (
    <div className="pd-page">

      {/* Breadcrumb */}
      <nav className="pd-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      {/* ── Main two-column layout ── */}
      <div className="pd-main">

        {/* LEFT — Image gallery */}
        <div className="pd-left">
          <div className="pd-img-main-wrap">
            <img src={getImage(product.image)} alt={product.name} className="pd-img-main" />
            {product.badge && <span className="pd-badge">{product.badge}</span>}
            <button
              className={`pd-wish-btn ${wishlisted ? 'pd-wish-active' : ''}`}
              onClick={() => toggleWishlist(product)}
              title={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
            >
              {wishlisted ? '♥' : '♡'}
            </button>
          </div>

          {/* Thumbnails */}
          <div className="pd-thumbs">
            {thumbs.map((t, i) => (
              <button
                key={i}
                className={`pd-thumb ${activeImg === i ? 'pd-thumb-active' : ''}`}
                onClick={() => setActiveImg(i)}
                type="button"
              >
                <img src={t} alt={`view ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — Product info */}
        <div className="pd-right">

          <p className="pd-brand">{product.brand}</p>
          <h1 className="pd-name">{product.name}</h1>

          <div className="pd-price-row">
            <span className="pd-price">{INR(product.price)}</span>
            {product.badge === 'Sale' && (
              <span className="pd-original-price">{INR(Math.round(product.price * 1.2))}</span>
            )}
          </div>

          {/* Color */}
          <div className="pd-color-row">
            <span className="pd-label">Color</span>
            <span
              className="pd-color-dot"
              style={{ background: colorMap[product.color] || '#ccc' }}
            />
            <span className="pd-color-name">{product.color}</span>
          </div>

          {/* Description */}
          <p className="pd-description">{product.description}</p>

          {/* Size selection */}
          <div className="pd-size-section">
            <div className="pd-size-header">
              <span className="pd-label">Select Size</span>
              {selectedSize && (
                <span className="pd-selected-size-tag">UK {selectedSize}</span>
              )}
            </div>
            <div className="pd-sizes">
              {product.sizes.map(s => (
                <SizeButton
                  key={s}
                  size={s}
                  selected={selectedSize === s}
                  onClick={(sz) => { setSelectedSize(sz); setSizeError('') }}
                />
              ))}
            </div>
            {sizeError && <p className="pd-size-error">⚠ {sizeError}</p>}
          </div>

          {/* Cart confirmation */}
          {cartConfirm && (
            <div className="pd-cart-confirm">
              ✓ Added to cart — Size UK {selectedSize}
            </div>
          )}

          {/* Action buttons */}
          <div className="pd-actions">
            <button className="pd-btn-cart" onClick={handleAddToCart} type="button">
              Add to Cart
            </button>
            <button className="pd-btn-buy" onClick={handleBuyNow} type="button">
              Buy Now
            </button>
          </div>

          {/* Extra info pills */}
          <div className="pd-pills">
            <span className="pd-pill">🚚 Free Delivery</span>
            <span className="pd-pill">↩ 30-Day Returns</span>
            <span className="pd-pill">✓ Authentic</span>
          </div>

        </div>
      </div>

      {/* ── Recommended ── */}
      <section className="pd-recommended">
        <h2 className="pd-rec-title">You Might Also Like</h2>
        <div className="pd-rec-grid">
          {recommended.map(p => (
            <RecommendedCard key={p.id} product={p} />
          ))}
        </div>
      </section>

    </div>
  )
}

export default ProductDetail
