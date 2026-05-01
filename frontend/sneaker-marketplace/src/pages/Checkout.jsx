import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { savedAddresses } from '../services/productService'
import { getImage } from '../utils/getImage'
import './Checkout.css'

const INR = (n) => `₹${n.toLocaleString('en-IN')}`
const STEPS = ['Address', 'Payment', 'Preview', 'Confirm']

const emptyAddr = { name: '', line: '', city: '', pin: '', phone: '' }

function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [step, setStep]           = useState(1)
  const [selAddrId, setSelAddrId] = useState(savedAddresses[0].id)
  const [newAddr, setNewAddr]     = useState(emptyAddr)
  const [addingNew, setAddingNew] = useState(false)
  const [payment, setPayment]     = useState('UPI')
  const [upiId, setUpiId]         = useState('')
  const [placed, setPlaced]       = useState(false)

  const activeAddress = addingNew
    ? newAddr
    : savedAddresses.find(a => a.id === selAddrId)

  const handleNext = (e) => {
    e.preventDefault()
    if (step < 4) setStep(s => s + 1)
    else {
      clearCart()
      setPlaced(true)
      // BUG FIX: navigate to /orders so the page re-fetches fresh order list
    }
  }

  if (placed) {
    return (
      <div className="order-success">
        <div className="success-icon">✓</div>
        <h2>Order Placed!</h2>
        <p>Your sneakers are on their way to <strong>{activeAddress.city}</strong>.</p>
        <p className="success-payment">Payment via <strong>{payment}</strong></p>
        <div className="success-btns">
          <Link to="/orders" className="btn-view-orders">View Orders</Link>
          <Link to="/products" className="btn-keep-shopping">Keep Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {/* Step indicator */}
      <div className="checkout-steps">
        {STEPS.map((label, i) => (
          <div key={label} className={`step ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'done' : ''}`}>
            <span className="step-num">{step > i + 1 ? '✓' : i + 1}</span>
            <span className="step-label">{label}</span>
            {i < STEPS.length - 1 && <span className="step-connector" />}
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleNext}>

          {/* ── Step 1: Address ── */}
          {step === 1 && (
            <div className="form-section">
              <h2>Delivery Address</h2>

              {/* Saved addresses */}
              <div className="saved-addresses">
                {savedAddresses.map(addr => (
                  <label
                    key={addr.id}
                    className={`addr-card ${!addingNew && selAddrId === addr.id ? 'selected' : ''}`}
                    onClick={() => { setSelAddrId(addr.id); setAddingNew(false) }}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={!addingNew && selAddrId === addr.id}
                      onChange={() => { setSelAddrId(addr.id); setAddingNew(false) }}
                    />
                    <div>
                      <p className="addr-name">{addr.name}</p>
                      <p className="addr-line">{addr.line}, {addr.city} — {addr.pin}</p>
                      <p className="addr-phone">{addr.phone}</p>
                    </div>
                  </label>
                ))}

                <label
                  className={`addr-card addr-new ${addingNew ? 'selected' : ''}`}
                  onClick={() => setAddingNew(true)}
                >
                  <input type="radio" name="address" checked={addingNew} onChange={() => setAddingNew(true)} />
                  <span>+ Add New Address</span>
                </label>
              </div>

              {addingNew && (
                <div className="new-addr-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input required value={newAddr.name} onChange={e => setNewAddr(p => ({ ...p, name: e.target.value }))} placeholder="Arjun Sharma" />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input required value={newAddr.phone} onChange={e => setNewAddr(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Address Line</label>
                    <input required value={newAddr.line} onChange={e => setNewAddr(p => ({ ...p, line: e.target.value }))} placeholder="123, MG Road" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input required value={newAddr.city} onChange={e => setNewAddr(p => ({ ...p, city: e.target.value }))} placeholder="Mumbai" />
                    </div>
                    <div className="form-group">
                      <label>PIN Code</label>
                      <input required value={newAddr.pin} onChange={e => setNewAddr(p => ({ ...p, pin: e.target.value }))} placeholder="400001" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Payment ── */}
          {step === 2 && (
            <div className="form-section">
              <h2>Payment Method</h2>
              <div className="payment-options">
                {['UPI', 'COD'].map(method => (
                  <label
                    key={method}
                    className={`payment-card ${payment === method ? 'selected' : ''}`}
                    onClick={() => setPayment(method)}
                  >
                    <input type="radio" name="payment" checked={payment === method} onChange={() => setPayment(method)} />
                    <div className="payment-icon">{method === 'UPI' ? '📱' : '💵'}</div>
                    <div>
                      <p className="payment-title">{method === 'UPI' ? 'UPI / Net Banking' : 'Cash on Delivery'}</p>
                      <p className="payment-desc">{method === 'UPI' ? 'Pay instantly via UPI ID' : 'Pay when your order arrives'}</p>
                    </div>
                  </label>
                ))}
              </div>

              {payment === 'UPI' && (
                <div className="form-group" style={{ marginTop: 16 }}>
                  <label>UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Preview ── */}
          {step === 3 && (
            <div className="form-section">
              <h2>Order Preview</h2>

              <div className="preview-section">
                <h4>Delivery To</h4>
                <p>{activeAddress.name} · {activeAddress.phone}</p>
                <p>{activeAddress.line}, {activeAddress.city} — {activeAddress.pin}</p>
              </div>

              <div className="preview-section">
                <h4>Payment</h4>
                <p>{payment === 'UPI' ? `UPI — ${upiId}` : 'Cash on Delivery'}</p>
              </div>

              <div className="preview-section">
                <h4>Items ({cart.length})</h4>
                {cart.length === 0 ? (
                  <p className="empty-review">Cart is empty. <Link to="/products">Shop now</Link></p>
                ) : (
                  cart.map(item => (
                    <div key={item.cartKey} className="preview-item">
                      <img src={getImage(item.image)} alt={item.name} className="preview-img" />
                      <div className="preview-item-info">
                        <p className="preview-item-name">{item.name}</p>
                        <p className="preview-item-meta">Size {item.selectedSize} · {item.color} · Qty {item.qty}</p>
                      </div>
                      <p className="preview-item-price">{INR(item.price * item.qty)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── Step 4: Confirm ── */}
          {step === 4 && (
            <div className="form-section confirm-section">
              <div className="confirm-icon">🛍️</div>
              <h2>Ready to Place Order?</h2>
              <p>Review your details one last time before confirming.</p>
              <div className="confirm-summary">
                <div className="cs-row"><span>Items</span><span>{cart.reduce((s, i) => s + i.qty, 0)}</span></div>
                <div className="cs-row"><span>Shipping</span><span className="free-tag">Free</span></div>
                <div className="cs-row"><span>Payment</span><span>{payment}</span></div>
                <div className="cs-row total"><span>Total</span><span>{INR(cartTotal)}</span></div>
              </div>
            </div>
          )}

          <div className="form-actions">
            {step > 1 && (
              <button type="button" className="btn-back" onClick={() => setStep(s => s - 1)}>← Back</button>
            )}
            <button
              type="submit"
              className="btn-next"
              disabled={step === 3 && cart.length === 0}
            >
              {step === 4 ? '🎉 Place Order' : 'Continue →'}
            </button>
          </div>
        </form>

        {/* Summary sidebar */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.length === 0 ? (
            <p className="empty-summary">No items in cart.</p>
          ) : (
            cart.map(item => (
              <div key={item.cartKey} className="summary-row">
                <span>{item.name} ×{item.qty}</span>
                <span>{INR(item.price * item.qty)}</span>
              </div>
            ))
          )}
          <div className="summary-row"><span>Shipping</span><span className="free-tag">Free</span></div>
          <div className="summary-row total"><span>Total</span><span>{INR(cartTotal)}</span></div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
