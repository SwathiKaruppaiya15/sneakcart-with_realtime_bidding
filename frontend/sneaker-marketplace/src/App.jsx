import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider }     from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar         from './components/Navbar'
import Footer         from './components/Footer'
import Home           from './pages/Home'
import Products       from './pages/Products'
import ProductDetail  from './pages/ProductDetail'
import Trends         from './pages/Trends'
import Auction        from './pages/Auction'
import Wishlist       from './pages/Wishlist'
import Cart           from './pages/Cart'
import Checkout       from './pages/Checkout'
import Orders         from './pages/Orders'
import AdminDashboard from './pages/admin/AdminDashboard'

// ── Requires login ────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth()
  return currentUser ? children : <Navigate to="/" replace />
}

// ── Requires ADMIN role — redirects everyone else to "/" ──────────────────
function AdminRoute({ children }) {
  const { currentUser } = useAuth()
  if (!currentUser)               return <Navigate to="/" replace />
  if (currentUser.role !== 'ADMIN') return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/products"    element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/trends"      element={<Trends />} />
          <Route path="/auction/:id" element={<Auction />} />
          <Route path="/wishlist"    element={<Wishlist />} />
          <Route path="/cart"        element={<Cart />} />
          <Route path="/checkout"    element={<Checkout />} />

          {/* Protected: must be logged in */}
          <Route path="/orders" element={
            <ProtectedRoute><Orders /></ProtectedRoute>
          } />

          {/* Admin only: role must be ADMIN */}
          <Route path="/admin" element={
            <AdminRoute><AdminDashboard /></AdminRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppRoutes />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
