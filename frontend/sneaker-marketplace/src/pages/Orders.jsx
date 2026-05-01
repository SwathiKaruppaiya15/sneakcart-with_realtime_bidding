import { Link } from 'react-router-dom'
import { getOrders, products } from '../services/productService'
import { getImage } from '../utils/getImage'
import './Orders.css'

const INR = (n) => `₹${n.toLocaleString('en-IN')}`

const statusColor = {
  Delivered: '#4caf50',
  Shipped:   '#2196f3',
  Processing:'#ff9800',
  Cancelled: '#e53935',
}

const recommended = products.slice(4, 9)

function Orders() {
  const orders = getOrders()

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <Link to="/products" className="btn-browse">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">

              {/* Header */}
              <div className="order-header">
                <div>
                  <p className="order-id">{order.id}</p>
                  <p className="order-date">Placed on {order.date}</p>
                </div>
                <span className="order-status" style={{ color: statusColor[order.status] || '#888' }}>
                  ● {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="order-item">
                    <img src={getImage(item.image)} alt={item.name} className="order-item-img" />
                    <div className="order-item-detail">
                      <p className="order-item-brand">{item.brand}</p>
                      <p className="order-item-name">{item.name}</p>
                      {item.selectedSize && (
                        <p className="order-item-meta">Size {item.selectedSize} · Qty {item.qty || 1}</p>
                      )}
                    </div>
                    <p className="order-item-price">{INR(item.price)}</p>
                  </div>
                ))}
              </div>

              {/* Address + Payment */}
              <div className="order-info-row">
                <div className="order-info-block">
                  <p className="info-label">📍 Delivery Address</p>
                  <p className="info-val">{order.address.name}</p>
                  <p className="info-val">{order.address.line}, {order.address.city} — {order.address.pin}</p>
                </div>
                <div className="order-info-block">
                  <p className="info-label">💳 Payment Method</p>
                  <p className="info-val">{order.payment}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="order-footer">
                <span>Total: <strong>{INR(order.total)}</strong></span>
                <button className="btn-reorder">Reorder</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommended */}
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
