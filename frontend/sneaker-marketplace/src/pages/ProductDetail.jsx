import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import dummyImg from '../assets/dummy.jpg'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import './ProductDetail.css'

// ── Dummy data (25 products) ──────────────────────────────────────────────────
const colorMap = {
  Black: '#222', White: '#e0e0e0', Red: '#e53935',
  Blue: '#1e88e5', Grey: '#9e9e9e', Brown: '#795548',
}

const PRODUCTS = [
  { id: 1,  name: 'Air Max 270',           brand: 'Nike',        price: 12499, color: 'Black', sizes: [6,7,8,9,10,11],    badge: 'New',      description: 'Engineered for all-day comfort, the Air Max 270 features Nike\'s biggest heel Air unit yet. The sleek upper and bold silhouette make it a street-style icon that transitions seamlessly from the gym to the city.' },
  { id: 2,  name: 'Ultra Boost 22',         brand: 'Adidas',      price: 14999, color: 'White', sizes: [7,8,9,10,11],      badge: 'Hot',      description: 'Powered by Adidas Boost technology, the Ultra Boost 22 delivers unmatched energy return with every stride. A Primeknit upper hugs your foot for a sock-like fit, while the Continental rubber outsole grips any surface.' },
  { id: 3,  name: 'Classic Leather',        brand: 'Reebok',      price: 7499,  color: 'White', sizes: [6,7,8,9,10],       badge: null,       description: 'A timeless silhouette reimagined for today. The Classic Leather features a premium full-grain leather upper, cushioned midsole, and a clean profile that pairs effortlessly with any outfit.' },
  { id: 4,  name: 'Chuck Taylor All Star',  brand: 'Converse',    price: 5499,  color: 'Black', sizes: [5,6,7,8,9,10,11],  badge: null,       description: 'The original canvas sneaker that never goes out of style. Lightweight, versatile, and endlessly expressive — the Chuck Taylor All Star has been a wardrobe staple since 1917.' },
  { id: 5,  name: 'Old Skool',              brand: 'Vans',        price: 6299,  color: 'Black', sizes: [6,7,8,9,10],       badge: 'Sale',     description: 'Born on the skate ramps of California, the Old Skool features a durable suede and canvas upper, padded collar for ankle support, and the iconic Vans side stripe.' },
  { id: 6,  name: 'Suede Classic',          brand: 'Puma',        price: 7999,  color: 'Blue',  sizes: [7,8,9,10,11],      badge: null,       description: 'The Puma Suede Classic is a street legend. Introduced in 1968, its premium suede upper and formstrip branding have made it one of the most recognisable sneakers in history.' },
  { id: 7,  name: 'Gel-Nimbus 25',          brand: 'Asics',       price: 13299, color: 'Red',   sizes: [7,8,9,10],         badge: 'New',      description: 'The Gel-Nimbus 25 is Asics\' most cushioned running shoe. FF BLAST PLUS ECO foam and GEL technology work together to absorb shock and return energy, keeping you comfortable mile after mile.' },
  { id: 8,  name: 'Fresh Foam 1080',        brand: 'New Balance', price: 13699, color: 'Grey',  sizes: [6,7,8,9,10,11],    badge: null,       description: 'Precision-engineered Fresh Foam X midsole wraps your foot in plush cushioning. The breathable Hypoknit upper adapts to your foot shape for a personalised, supportive fit on every run.' },
  { id: 9,  name: 'Yeezy Boost 350',        brand: 'Adidas',      price: 18399, color: 'Grey',  sizes: [7,8,9,10],         badge: 'Trending', description: 'Designed by Kanye West, the Yeezy Boost 350 V2 features a Primeknit upper with a monofilament side stripe and full-length Boost midsole for responsive cushioning and iconic style.' },
  { id: 10, name: 'Air Jordan 1 Retro',     brand: 'Nike',        price: 15099, color: 'Red',   sizes: [6,7,8,9,10,11],    badge: 'Trending', description: 'The shoe that started it all. The Air Jordan 1 Retro High OG brings back the original colourway with premium leather construction, Nike Air cushioning, and the iconic Wings logo.' },
  { id: 11, name: 'Dunk Low',               brand: 'Nike',        price: 9199,  color: 'White', sizes: [7,8,9,10,11],      badge: 'Hot',      description: 'Originally designed for the hardwood, the Nike Dunk Low has transcended sport to become a cultural icon. Low-cut collar, padded tongue, and a rubber cupsole deliver classic court style.' },
  { id: 12, name: 'NMD R1',                brand: 'Adidas',      price: 10899, color: 'Black', sizes: [6,7,8,9,10],       badge: 'Trending', description: 'The NMD R1 blends archive running design with modern Boost cushioning. Moulded EVA plugs on the midsole pay homage to vintage Adidas runners while keeping the look fresh and contemporary.' },
  { id: 13, name: 'Blazer Mid 77',          brand: 'Nike',        price: 8799,  color: 'White', sizes: [7,8,9,10,11],      badge: null,       description: 'The Nike Blazer Mid \'77 Vintage brings back the retro basketball look with a cracked leather upper, vintage finish on the midsole, and a low-profile cupsole for a clean, classic aesthetic.' },
  { id: 14, name: 'Stan Smith',             brand: 'Adidas',      price: 7299,  color: 'White', sizes: [6,7,8,9,10],       badge: null,       description: 'The Stan Smith is the world\'s best-selling tennis shoe turned street icon. Its clean leather upper, perforated 3-Stripes, and minimalist design make it the ultimate versatile sneaker.' },
  { id: 15, name: 'Club C 85',              brand: 'Reebok',      price: 6499,  color: 'White', sizes: [6,7,8,9,10,11],    badge: null,       description: 'Introduced in 1985 as a tennis performance shoe, the Club C has evolved into a lifestyle staple. Clean leather upper, die-cut EVA midsole, and subtle Reebok branding keep it timeless.' },
  { id: 16, name: 'Sk8-Hi',                brand: 'Vans',        price: 7199,  color: 'Black', sizes: [7,8,9,10],         badge: null,       description: 'The Vans Sk8-Hi is the original high-top skate shoe. Sturdy canvas and suede upper, padded collar for ankle support, and the signature waffle outsole for superior board feel.' },
  { id: 17, name: 'RS-X',                  brand: 'Puma',        price: 8999,  color: 'White', sizes: [6,7,8,9,10,11],    badge: 'New',      description: 'The Puma RS-X reinvents the RS Running System with an oversized sole unit, bold colour-blocking, and a mesh and leather upper. Maximum cushioning meets maximum style.' },
  { id: 18, name: 'Kayano 29',             brand: 'Asics',       price: 14499, color: 'Blue',  sizes: [7,8,9,10,11],      badge: null,       description: 'The Gel-Kayano 29 is Asics\' flagship stability running shoe. Dynamic DuoMax support system, FF BLAST PLUS cushioning, and a 3D Space Construction midsole deliver a smooth, stable ride.' },
  { id: 19, name: '990v5',                 brand: 'New Balance', price: 16499, color: 'Grey',  sizes: [6,7,8,9,10],       badge: null,       description: 'Made in the USA, the 990v5 is the pinnacle of New Balance craftsmanship. ENCAP midsole technology, pigskin and mesh upper, and a dual-density collar foam deliver premium comfort and support.' },
  { id: 20, name: 'Air Force 1',           brand: 'Nike',        price: 8499,  color: 'White', sizes: [6,7,8,9,10,11,12], badge: null,       description: 'The Nike Air Force 1 was the first basketball shoe to use Nike Air cushioning. Decades later, its clean leather upper and iconic silhouette make it the most popular sneaker of all time.' },
  { id: 21, name: 'Superstar',             brand: 'Adidas',      price: 7999,  color: 'White', sizes: [6,7,8,9,10],       badge: null,       description: 'The Adidas Superstar debuted in 1969 as a low-top basketball shoe. Its shell toe, leather upper, and 3-Stripes have made it a hip-hop and streetwear icon for over 50 years.' },
  { id: 22, name: 'Nano X3',              brand: 'Reebok',      price: 11299, color: 'Black', sizes: [7,8,9,10,11],      badge: null,       description: 'Built for the demands of CrossFit, the Nano X3 features a wide toe box, Flexweave knit upper, and a dual-density midsole that provides stability for lifting and flexibility for cardio.' },
  { id: 23, name: 'Era',                   brand: 'Vans',        price: 5299,  color: 'Red',   sizes: [5,6,7,8,9,10],     badge: 'Sale',     description: 'The Vans Era is a low-top lace-up with a padded collar for comfort and support. Double-stitched canvas upper and the iconic waffle outsole make it a skate and street essential.' },
  { id: 24, name: 'Speedcat',             brand: 'Puma',        price: 6799,  color: 'Red',   sizes: [6,7,8,9,10,11],    badge: 'New',      description: 'Originally designed for motorsport, the Puma Speedcat has become a fashion favourite. Low-profile suede upper, thin outsole for pedal feel, and a sleek silhouette that turns heads.' },
  { id: 25, name: 'Gel-Kayano 30',        brand: 'Asics',       price: 15299, color: 'Blue',  sizes: [7,8,9,10,11],      badge: null,       description: 'The Gel-Kayano 30 celebrates 30 years of Asics\' most iconic stability shoe. Wider base, improved FF BLAST PLUS ECO cushioning, and a redesigned upper deliver the best Kayano yet.' },
]

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
        <img src={dummyImg} alt={product.name} className="pd-rec-img" />
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

  // Thumbnail images (all dummy for now)
  const thumbs = [dummyImg, dummyImg, dummyImg]

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
            <img src={dummyImg} alt={product.name} className="pd-img-main" />
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
