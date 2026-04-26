import { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist')) || [] }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (product) => {
    setWishlist(prev =>
      prev.find(p => p.id === product.id) ? prev : [...prev, product]
    )
  }

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(p => p.id !== id))
  }

  const isWishlisted = (id) => wishlist.some(p => p.id === id)

  const toggleWishlist = (product) => {
    isWishlisted(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)
  }

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
