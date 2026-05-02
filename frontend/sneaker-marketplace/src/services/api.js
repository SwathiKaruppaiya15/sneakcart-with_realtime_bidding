// ── Base URL ────────────────────────────────────────────────────────────────

// In Vercel → set VITE_API_URL = https://your-backend.onrender.com
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://sneakcart-with-realtime-bidding.onrender.com";

// 🔴 IMPORTANT:
// If your backend DOES NOT use /api → keep this ""
// If your backend uses /api → change to "/api"
const API_PREFIX = ""; // ← CHANGE THIS ONLY IF NEEDED

const BASE = `${BASE_URL}${API_PREFIX}`;

// ── Core Request Function ────────────────────────────────────────────────────

async function request(path, options = {}) {
  const url = `${BASE}${path}`;

  console.log(`[API] → ${options.method || "GET"} ${url}`);

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      const message =
        data?.error ||
        data?.message ||
        `HTTP ${res.status}: ${res.statusText}`;

      console.error(`[API ERROR] ${url}`, message);
      throw new Error(message);
    }

    console.log(`[API SUCCESS] ${url}`, data);
    return data;
  } catch (err) {
    console.error(`[API FAILED] ${url}`, err.message);
    throw err;
  }
}

// ── Products ────────────────────────────────────────────────────────────────

export const apiGetProducts = () => request("/products");
export const apiGetProduct = (id) => request(`/products/${id}`);
export const apiFilterProducts = (params) =>
  request(`/products/filter?${new URLSearchParams(params)}`);
export const apiGetAuctions = () => request("/products/auction");

// ── Orders ──────────────────────────────────────────────────────────────────

export const apiPlaceOrder = (order) =>
  request("/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });

export const apiGetOrders = (userId) =>
  request(`/orders/user/${userId}`);

// ── Bids ────────────────────────────────────────────────────────────────────

export const apiPlaceBid = (bid) =>
  request("/bids", {
    method: "POST",
    body: JSON.stringify(bid),
  });

export const apiGetHighest = (auctionId) =>
  request(`/bids/${auctionId}/highest`);

export const apiLeaderboard = (auctionId) =>
  request(`/bids/${auctionId}/leaderboard`);

// ── Auth ────────────────────────────────────────────────────────────────────

export const apiRegister = (data) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const apiLogin = (data) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ── Admin ───────────────────────────────────────────────────────────────────

export const apiAdminGetOrders = (adminId) =>
  request(`/admin/orders?adminId=${adminId}`);

export const apiAdminGetOrder = (id, adminId) =>
  request(`/admin/orders/${id}?adminId=${adminId}`);

export const apiAdminGetProducts = (adminId) =>
  request(`/admin/products?adminId=${adminId}`);

export const apiAdminUpdateStock = (id, adminId, stock) =>
  request(`/admin/products/${id}/stock?adminId=${adminId}`, {
    method: "PUT",
    body: JSON.stringify({ stock }),
  });

export const apiAdminAnalytics = (adminId) =>
  request(`/admin/analytics?adminId=${adminId}`);

// ── Export Base (optional) ───────────────────────────────────────────────────

export default BASE_URL;