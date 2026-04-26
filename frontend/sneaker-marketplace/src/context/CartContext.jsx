import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || [] }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, selectedSize) => {
    setCart(prev => {
      const key = `${product.id}-${selectedSize}`
      const existing = prev.find(i => i.cartKey === key)
      if (existing) {
        return prev.map(i => i.cartKey === key ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...product, selectedSize, qty: 1, cartKey: key }]
    })
  }

  const removeFromCart = (cartKey) => {
    setCart(prev => prev.filter(i => i.cartKey !== cartKey))
  }

  const updateQty = (cartKey, delta) => {
    setCart(prev =>
      prev
        .map(i => i.cartKey === cartKey ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    )
  }

  const clearCart = () => setCart([])

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
