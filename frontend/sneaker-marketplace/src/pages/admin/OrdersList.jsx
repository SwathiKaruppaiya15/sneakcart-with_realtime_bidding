import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { apiAdminGetOrders, apiAdminGetOrder } from '../../services/api'
import OrderDetail from './OrderDetail'

const INR = n => `₹${Number(n).toLocaleString('en-IN')}`

const STATUS_COLOR = {
  PROCESSING: '#ff9800',
  SHIPPED:    '#2196f3',
  DELIVERED:  '#4caf50',
  CANCELLED:  '#e53935',
}

function OrdersList() {
  const { currentUser } = useAuth()
  const [orders,        setOrders]        = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    setError('')
    try {
      // Try backend first, fall back to dummy data
      const data = await apiAdminGetOrders(currentUser.id)
      setOrders(data)
    } catch {
      setError('Could not load orders from server. Showing local data.')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const openDetail = async (orderId) => {
    setDetailLoading(true)
    try {
      const detail = await apiAdminGetOrder(orderId, currentUser.id)
      setSelectedOrder(detail)
    } catch {
      setError('Could not load order details.')
    } finally {
      setDetailLoading(false)
    }
  }

  if (selectedOrder) {
    return <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>All Orders</h2>
        <button className="btn-refresh" onClick={fetchOrders}>↻ Refresh</button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <div className="admin-loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="admin-empty">
          <p>📦 No orders yet.</p>
        </div>
      ) : (
        <div className="orders-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td><span className="order-id-badge">#{order.id}</span></td>
                  <td>{order.user?.name || '—'}</td>
                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                  <td><strong>{INR(order.totalPrice)}</strong></td>
                  <td><span className="payment-tag">{order.paymentMethod}</span></td>
                  <td>
                    <span className="status-dot" style={{ color: STATUS_COLOR[order.status] || '#888' }}>
                      ● {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => openDetail(order.id)}
                      disabled={detailLoading}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default OrdersList
