import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { apiAdminGetProducts, apiAdminUpdateStock } from '../../services/api'
import { products as dummyProducts } from '../../services/productService'
import { getImage } from '../../utils/getImage'

const INR = n => `₹${Number(n).toLocaleString('en-IN')}`

function ProductStockManager() {
  const { currentUser } = useAuth()
  const [products,  setProducts]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [stockMap,  setStockMap]  = useState({})   // { productId: inputValue }
  const [saving,    setSaving]    = useState({})    // { productId: bool }
  const [saved,     setSaved]     = useState({})    // { productId: bool }

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiAdminGetProducts(currentUser.id)
      setProducts(data)
      // Pre-fill stock inputs
      const map = {}
      data.forEach(p => { map[p.id] = p.stock ?? 0 })
      setStockMap(map)
    } catch {
      // Fall back to dummy products with stock=0
      const fallback = dummyProducts.map(p => ({ ...p, stock: 0 }))
      setProducts(fallback)
      const map = {}
      fallback.forEach(p => { map[p.id] = 0 })
      setStockMap(map)
      setError('Using local data — backend not connected.')
    } finally {
      setLoading(false)
    }
  }

  const handleStockChange = (id, value) => {
    setStockMap(prev => ({ ...prev, [id]: value }))
  }

  const handleSave = async (productId) => {
    const newStock = parseInt(stockMap[productId], 10)
    if (isNaN(newStock) || newStock < 0) {
      setError('Stock must be a non-negative number.')
      return
    }
    setSaving(prev => ({ ...prev, [productId]: true }))
    try {
      await apiAdminUpdateStock(productId, currentUser.id, newStock)
      setProducts(prev =>
        prev.map(p => p.id === productId ? { ...p, stock: newStock } : p)
      )
      setSaved(prev => ({ ...prev, [productId]: true }))
      setTimeout(() => setSaved(prev => ({ ...prev, [productId]: false })), 2000)
    } catch {
      setError('Failed to update stock. Check backend connection.')
    } finally {
      setSaving(prev => ({ ...prev, [productId]: false }))
    }
  }

  const getStockStatus = (stock) => {
    if (stock === 0)  return { label: 'Out of Stock', color: '#e53935' }
    if (stock <= 5)   return { label: 'Low Stock',    color: '#ff9800' }
    return               { label: 'In Stock',      color: '#4caf50' }
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Product Stock Management</h2>
        <button className="btn-refresh" onClick={fetchProducts}>↻ Refresh</button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <div className="admin-loading">Loading products...</div>
      ) : (
        <div className="stock-grid">
          {products.map(product => {
            const status = getStockStatus(product.stock ?? 0)
            return (
              <div key={product.id} className="stock-card">
                <img
                  src={getImage(product.imageUrl || product.image)}
                  alt={product.name}
                  className="stock-product-img"
                />
                <div className="stock-info">
                  <p className="stock-brand">{product.brand}</p>
                  <p className="stock-name">{product.name}</p>
                  <p className="stock-price">{INR(product.price)}</p>
                  <span className="stock-status-badge" style={{ color: status.color }}>
                    ● {status.label}
                  </span>
                </div>
                <div className="stock-control">
                  <label>Current Stock</label>
                  <div className="stock-input-row">
                    <input
                      type="number"
                      min="0"
                      value={stockMap[product.id] ?? 0}
                      onChange={e => handleStockChange(product.id, e.target.value)}
                      className="stock-input"
                    />
                    <button
                      className={`btn-save-stock ${saved[product.id] ? 'saved' : ''}`}
                      onClick={() => handleSave(product.id)}
                      disabled={saving[product.id]}
                    >
                      {saving[product.id] ? '...' : saved[product.id] ? '✓ Saved' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ProductStockManager
