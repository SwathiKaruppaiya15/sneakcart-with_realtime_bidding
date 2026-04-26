import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import dummyImg from '../assets/dummy.jpg'
import './Cart.css'

const INR = (n) => `₹${n.toLocaleString('en-IN')}`

function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal, clearCart } = useCart()

  const shipping = cart.length > 0 ? 0 : 0
  const total = cartTotal + shipping

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        {cart.length > 0 && (
          <button className="btn-clear" onClick={clearCart}>Clear Cart</button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some sneakers to get started.</p>
          <Link to="/products" className="btn-shop">Start Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">

          {/* Items */}
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.cartKey} className="cart-item">
                <img src={dummyImg} alt={item.name} className="cart-item-img" />

                <div className="cart-item-info">
                  <p className="cart-item-brand">{item.brand}</p>
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-meta">
                    Size: <strong>{item.selectedSize}</strong>
                    &nbsp;·&nbsp;
                    Color: <strong>{item.color}</strong>
                  </p>
                  <p className="cart-item-price">{INR(item.price)} each</p>
                </div>

                <div className="cart-item-qty">
                  <button className="qty-btn" onClick={() => updateQty(item.cartKey, -1)}>−</button>
                  <span className="qty-val">{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.cartKey, +1)}>+</button>
                </div>

                <p className="cart-item-total">{INR(item.price * item.qty)}</p>

                <button className="remove-btn" onClick={() => removeFromCart(item.cartKey)} title="Remove">✕</button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
              <span>{INR(cartTotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-tag">Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{INR(total)}</span>
            </div>
            <Link to="/checkout" className="btn-checkout">Proceed to Checkout</Link>
            <Link to="/products" className="btn-continue">← Continue Shopping</Link>
          </div>

        </div>
      )}
    </div>
  )
}

export default Cart
