import { getImage } from '../../utils/getImage'

const INR = n => `₹${Number(n).toLocaleString('en-IN')}`

const STATUS_COLOR = {
  PROCESSING: '#ff9800',
  SHIPPED:    '#2196f3',
  DELIVERED:  '#4caf50',
  CANCELLED:  '#e53935',
}

function OrderDetail({ order, onBack }) {
  return (
    <div className="admin-section">
      <button className="btn-back-admin" onClick={onBack}>← Back to Orders</button>

      <div className="order-detail-card">
        <div className="order-detail-header">
          <div>
            <h2>Order #{order.id}</h2>
            <p className="order-detail-date">
              Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : '—'}
            </p>
          </div>
          <span className="status-badge" style={{ background: STATUS_COLOR[order.status] || '#888' }}>
            {order.status}
          </span>
        </div>

        {/* Products */}
        <div className="detail-section">
          <h3>Products</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item, i) => (
                <tr key={i}>
                  <td>
                    <img
                      src={getImage(item.product?.imageUrl)}
                      alt={item.product?.name}
                      className="order-item-thumb"
                    />
                  </td>
                  <td>
                    <p className="item-name">{item.product?.name}</p>
                    <p className="item-brand">{item.product?.brand}</p>
                  </td>
                  <td>{item.selectedSize || '—'}</td>
                  <td>{item.quantity}</td>
                  <td>{INR(item.priceAtPurchase)}</td>
                  <td><strong>{INR(item.priceAtPurchase * item.quantity)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary row */}
        <div className="detail-summary-row">
          {/* Address */}
          <div className="detail-section detail-box">
            <h3>📍 Delivery Address</h3>
            <p>{order.user?.name}</p>
            <p>{order.addressLine}</p>
            <p>{order.city} — {order.pinCode}</p>
            <p>{order.phone}</p>
          </div>

          {/* Payment */}
          <div className="detail-section detail-box">
            <h3>💳 Payment</h3>
            <p className="payment-tag">{order.paymentMethod}</p>
          </div>

          {/* Total */}
          <div className="detail-section detail-box">
            <h3>💰 Order Total</h3>
            <p className="order-total-big">{INR(order.totalPrice)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
