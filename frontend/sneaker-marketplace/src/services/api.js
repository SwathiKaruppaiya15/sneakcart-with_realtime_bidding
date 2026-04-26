const BASE = 'http://localhost:8080/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

// Products
export const apiGetProducts = ()                    => request('/products')
export const apiGetProduct  = (id)                  => request(`/products/${id}`)
export const apiFilterProducts = (params)           => request(`/products/filter?${new URLSearchParams(params)}`)
export const apiGetAuctions = ()                    => request('/products/auction')

// Orders
export const apiPlaceOrder  = (order)               => request('/orders', { method: 'POST', body: JSON.stringify(order) })
export const apiGetOrders   = (userId)              => request(`/orders/user/${userId}`)

// Bids
export const apiPlaceBid    = (bid)                 => request('/bids', { method: 'POST', body: JSON.stringify(bid) })
export const apiGetHighest  = (auctionId)           => request(`/bids/${auctionId}/highest`)
export const apiLeaderboard = (auctionId)           => request(`/bids/${auctionId}/leaderboard`)

// Auth
export const apiRegister    = (data)                => request('/auth/register', { method: 'POST', body: JSON.stringify(data) })
export const apiLogin       = (data)                => request('/auth/login',    { method: 'POST', body: JSON.stringify(data) })
