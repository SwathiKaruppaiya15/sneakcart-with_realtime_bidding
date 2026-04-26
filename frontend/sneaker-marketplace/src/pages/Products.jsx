import { useState, useMemo } from 'react'
import { products } from '../services/productService'
import ProductCard from '../components/ProductCard'
import './Products.css'

const ALL_COLORS = ['All', ...new Set(products.map(p => p.color))]
const MIN_PRICE = Math.min(...products.map(p => p.price))
const MAX_PRICE = Math.max(...products.map(p => p.price))

function Products() {
  const [activeColor, setActiveColor]   = useState('All')
  const [priceRange, setPriceRange]     = useState(MAX_PRICE)
  const [sort, setSort]                 = useState('default')

  const filtered = useMemo(() => {
    return products
      .filter(p => activeColor === 'All' || p.color === activeColor)
      .filter(p => p.price <= priceRange)
      .sort((a, b) => {
        if (sort === 'price-asc')  return a.price - b.price
        if (sort === 'price-desc') return b.price - a.price
        return 0
      })
  }, [activeColor, priceRange, sort])

  return (
    <div className="products-page">

      {/* Header */}
      <div className="products-header">
        <h1>All Products <span className="count">({filtered.length})</span></h1>
        <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="products-layout">

        {/* Sidebar filters */}
        <aside className="filters-sidebar">
          <h3>Filters</h3>

          <div className="filter-group">
            <h4>Price Range</h4>
            <input
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={500}
              value={priceRange}
              onChange={e => setPriceRange(Number(e.target.value))}
              className="price-range"
            />
            <div className="price-labels">
              <span>₹{MIN_PRICE.toLocaleString('en-IN')}</span>
              <span className="price-current">Up to ₹{priceRange.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="filter-group">
            <h4>Color</h4>
            <div className="color-filters">
              {ALL_COLORS.map(c => (
                <button
                  key={c}
                  className={`color-filter-btn ${activeColor === c ? 'active' : ''}`}
                  onClick={() => setActiveColor(c)}
                >
                  {c !== 'All' && (
                    <span className="color-swatch" style={{ background: colorMap[c] || '#ccc' }} />
                  )}
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn-reset"
            onClick={() => { setActiveColor('All'); setPriceRange(MAX_PRICE); setSort('default') }}
          >
            Reset Filters
          </button>
        </aside>

        {/* Grid */}
        <div className="products-grid-area">
          {filtered.length === 0 ? (
            <div className="no-results">
              <p>😕 No products match your filters.</p>
              <button className="btn-reset" onClick={() => { setActiveColor('All'); setPriceRange(MAX_PRICE) }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

const colorMap = {
  Black: '#222', White: '#e0e0e0', Red: '#e53935',
  Blue: '#1e88e5', Grey: '#9e9e9e', Green: '#43a047',
}

export default Products
