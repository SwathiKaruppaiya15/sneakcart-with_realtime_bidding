import { Link } from 'react-router-dom'
import heroImg from '../assets/hero-section-img.jpg'
import { NavLink, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import runImg from '../assets/running.avif'
import basket from '../assets/basket.webp'
import lifestyle from '../assets/lifestyle.jpg'
import skate from '../assets/skate.jpg'
import { products } from '../services/productService'
import ProductCard from '../components/ProductCard'
import './Home.css'

const categories = [
  { label: 'Running',    img: runImg    },
  { label: 'Basketball', img: basket    },
  { label: 'Lifestyle',  img: lifestyle },
  { label: 'Skate',      img: skate     },
]

function Home() {
  const featured = products.slice(0, 8)

  return (
    <div className="home">

      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <p className="hero-sub">New Season Arrivals</p>
          <h1>Step Into <span>Style</span></h1>
          <p className="hero-desc">
            Discover the freshest kicks from top brands. Limited drops, unbeatable prices.
          </p>
          <div className="hero-btns">
            <Link to="/products" className="btn-hero-primary">Shop Now</Link>
            <Link to="/trends"   className="btn-hero-secondary">See Trends</Link>
          </div>
        </div>
        <div className="hero-img-wrap">
          <img src={heroImg} alt="Featured Sneaker" className="hero-img" />
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.map(cat => (
            <Link to="/products" key={cat.label} className="category-card">
              <img src={cat.img} alt={cat.label} />
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured — 8 cards */}
      <section className="featured">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products" className="view-all">View All →</Link>
        </div>
        <div className="home-products-grid">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Promo */}
      <section className="promo-banner">
        <h2>Members get 20% off their first order</h2>
        <p>Sign up today and unlock exclusive deals on premium sneakers.</p>
        <Link to="/products" className="btn-banner">Shop Now</Link>
      </section>

    </div>
  )
}

export default Home
