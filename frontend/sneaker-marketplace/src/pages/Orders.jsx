import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiGetOrders } from '../services/api'
import { products } from '../services/productService'
import { getImage } from '../utils/getImage'
import './Orders.css'

const INR = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const statusColor = {
  DELIVERED:  '#4caf50',
  SHIPPED:    '#2196f3',
  PROCESSING: '#ff9800',
  CANCELLED:  '#e53935',
}

const recommended = products.slice(4, 9)

function Orders() {
  const { currentUser } = useAuth()
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  // Fetch fresh from backend every time page mounts or user changes
  useEffect(() => {
    fetchOrders()
  }, [currentUser])

  const fetchOrders = async () => {
    if (!currentUser?.id && currentUser?.id !== 0) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    console.log('[Orders] Fetching orders for user:', currentUser.id)
    try {
      const data = await apiGetOrders(currentUser.id)
      console.log('[Orders] Received:', data)
      setOrders(normalizeOrders(data))
    } catch (err) {
      console.error('[Orders] Failed:', err.message)
      setError(`Failed to load orders: ${err.message}`)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  // Map backend shape → frontend shape
  const normalizeOrders = (data) => data.map(o => ({
    id:      o.id,
    date:    o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '—',
    status:  o.status || 'PROCESSING',
    items:   (o.items || []).map(item => ({
      id:           item.product?.id,
      name:         item.product?.name,
      brand:        item.product?.brand,
      image:        item.product?.imageUrl,
      price:        item.priceAtPurchase,
      selectedSize: item.selectedSize,
      qty:          item.quantity,
    })),
    address: {
      name: o.user?.name   || '',
      line: o.addressLine  || '',
      city: o.city         || '',
      pin:  o.pinCode      || '',
    },
    payment: o.paymentMethod,
    total:   o.totalPrice,
  }))

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {/* Error — no silent fallback */}
      {error && (
        <div style={{
          background: '#fff3f3', border: '1px solid #ffcdd2',
          color: '#c62828', borderRadius: 8, padding: '12px 16px',
          marginBottom: 16, fontSize: '0.88rem'
        }}>
          ⚠ {error}
          <button
            onClick={fetchOrders}
            style={{ marginLeft: 12, background: '#c62828', color: '#fff',
              border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
          Loading orders...
        </div>
      ) : orders.length === 0 && !error ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <Link to="/products" className="btn-browse">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">

              <div className="order-header">
                <div>
                  <p className="order-id">
                    {typeof order.id === 'number'
                      ? `ORD-${String(order.id).padStart(3, '0')}`
                      : order.id}
                  </p>
                  <p className="order-date">Placed on {order.date}</p>
                </div>
                <span className="order-status" style={{ color: statusColor[order.status] || '#888' }}>
                  ● {order.status}
                </span>
              </div>

              <div className="order-items">
                {(order.items || []).map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="order-item">
                    <img src={getImage(item.image)} alt={item.name} className="order-item-img" />
                    <div className="order-item-detail">
                      <p className="order-item-brand">{item.brand}</p>
                      <p className="order-item-name">{item.name}</p>
                      {item.selectedSize && (
                        <p className="order-item-meta">
                          Size {item.selectedSize} · Qty {item.qty || 1}
                        </p>
                      )}
                    </div>
                    <p className="order-item-price">{INR(item.price)}</p>
                  </div>
                ))}
              </div>

              <div className="order-info-row">
                <div className="order-info-block">
                  <p className="info-label">📍 Delivery Address</p>
                  <p className="info-val">{order.address?.name}</p>
                  <p className="info-val">
                    {order.address?.line}, {order.address?.city} — {order.address?.pin}
                  </p>
                </div>
                <div className="order-info-block">
                  <p className="info-label">💳 Payment Method</p>
                  <p className="info-val">{order.payment}</p>
                </div>
              </div>

              <div className="order-footer">
                <span>Total: <strong>{INR(order.total)}</strong></span>
                <button className="btn-reorder" onClick={fetchOrders}>Reorder</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="orders-recommended">
        <h2>Recommended For You</h2>
        <div className="rec-grid">
          {recommended.map(p => (
            <Link to="/products" key={p.id} className="rec-card">
              <img src={getImage(p.image)} alt={p.name} />
              <div className="rec-info">
                <p className="rec-brand">{p.brand}</p>
                <p className="rec-name">{p.name}</p>
                <p className="rec-price">{INR(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Orders
