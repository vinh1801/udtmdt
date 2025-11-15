import axios from "axios";
import { ADMIN_TOKEN_KEY } from "./adminAuthService";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const api = axios.create({ baseURL: BASE_URL });

function adminAuthHeader() {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function adminListOrders(params = {}) {
  const res = await api.get("/api/admin/orders", { params, headers: adminAuthHeader() });
  return res.data; // { data: [...] }
}

export async function adminListOrderHistory(params = {}) {
  const res = await api.get("/api/admin/orders", { params: { ...params, history: true }, headers: adminAuthHeader() });
  return res.data; // { data: [...] }
}

export async function adminConfirmRefund(id) {
  const res = await api.put(`/api/admin/orders/${id}/refund`, {}, { headers: adminAuthHeader() });
  return res.data; // { data }
}

export async function adminGetOrder(id) {
  const res = await api.get(`/api/admin/orders/${id}`, { headers: adminAuthHeader() });
  return res.data; // { data }
}

export async function adminGetTodayStats() {
  const res = await api.get("/api/admin/orders/stats/today", {
    headers: adminAuthHeader(),
  });
  return res.data; // { data: { ordersCount, revenue } }
}

export async function adminGetDailyStats(params = {}) {
  const res = await api.get("/api/admin/orders/stats/by-day", {
    params,
    headers: adminAuthHeader(),
  });
  return res.data; // { data: [ { _id: '2025-11-15', ordersCount, revenue }, ... ] }
}

export async function adminGetDayOrders(date) {
  const res = await api.get("/api/admin/orders/stats/day-orders", {
    params: { date },
    headers: adminAuthHeader(),
  });
  return res.data; // { data: [...] }
}

export async function adminUpdateOrderStatus(id, status) {
  const res = await api.put(
    `/api/admin/orders/${id}/status`,
    { status },
    { headers: adminAuthHeader() }
  );
  return res.data; // { data }
}

export async function adminToggleOrderPaid(id, isPaid) {
  const res = await api.put(
    `/api/admin/orders/${id}/payment`,
    { isPaid },
    { headers: adminAuthHeader() }
  );
  return res.data; // { data }
}

export async function adminCancelOrder(id) {
  const res = await api.put(
    `/api/admin/orders/${id}/cancel`,
    {},
    { headers: adminAuthHeader() }
  );
  return res.data; // { data }
}