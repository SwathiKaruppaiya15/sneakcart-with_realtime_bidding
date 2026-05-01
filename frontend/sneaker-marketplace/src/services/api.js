// ── Central API config ────────────────────────────────────────────────────────
// Switch between local dev and Render production
const BASE_URL = import.meta.env.VITE_API_URL || 'https://sneakcart-with-realtime-bidding.onrender.com'
const BASE = `${BASE_URL}/api`

async function request(path, options = {}) {
  const url = `${BASE}${path}`
  console.log(`[API] → ${options.method || 'GET'} ${url}`)

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    const message = err.error || `HTTP ${res.status}: ${res.statusText}`
    console.error(`[API] ✗ ${url}`, message)
    throw new Error(message)
  }

  const data = await res.json()
  console.log(`[API] ✓ ${url}`, data)
  return data
}

// ── Products ──────────────────────────────────────────────────────────────────
export const apiGetProducts     = ()       => request('/products')
export const apiGetProduct      = (id)     => request(`/products/${id}`)
export const apiFilterProducts  = (params) => request(`/products/filter?${new URLSearchParams(params)}`)
export const apiGetAuctions     = ()       => request('/products/auction')

// ── Orders ────────────────────────────────────────────────────────────────────
export const apiPlaceOrder = (order)   => request('/orders', { method: 'POST', body: JSON.stringify(order) })
export const apiGetOrders  = (userId)  => request(`/orders/user/${userId}`)

// ── Bids ──────────────────────────────────────────────────────────────────────
export const apiPlaceBid    = (bid)        => request('/bids', { method: 'POST', body: JSON.stringify(bid) })
export const apiGetHighest  = (auctionId)  => request(`/bids/${auctionId}/highest`)
export const apiLeaderboard = (auctionId)  => request(`/bids/${auctionId}/leaderboard`)

// ── Auth ──────────────────────────────────────────────────────────────────────
export const apiRegister = (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) })
export const apiLogin    = (data) => request('/auth/login',    { method: 'POST', body: JSON.stringify(data) })

// ── Admin ─────────────────────────────────────────────────────────────────────
export const apiAdminGetOrders   = (adminId)              => request(`/admin/orders?adminId=${adminId}`)
export const apiAdminGetOrder    = (id, adminId)          => request(`/admin/orders/${id}?adminId=${adminId}`)
export const apiAdminGetProducts = (adminId)              => request(`/admin/products?adminId=${adminId}`)
export const apiAdminUpdateStock = (id, adminId, stock)   =>
  request(`/admin/products/${id}/stock?adminId=${adminId}`, {
    method: 'PUT',
    body: JSON.stringify({ stock }),
  })
export const apiAdminAnalytics   = (adminId)              => request(`/admin/analytics?adminId=${adminId}`)
