import axios from "axios";
import { authHeader } from "./authService";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const api = axios.create({ baseURL: BASE_URL });

// Lấy lịch sử đơn của user hiện tại
export async function getMyOrders() {
  const res = await api.get("/api/orders/my", { headers: authHeader() });
  return res.data; // { data: [...] }
}

// Lấy chi tiết 1 đơn (dùng khi xem chi tiết)
export async function getOrderById(id) {
  const res = await api.get(`/api/orders/${id}`, { headers: authHeader() });
  return res.data; // order object
}

// Hủy đơn (user) - chỉ khi đang 'pending'
export async function cancelOrder(id) {
  const res = await api.put(`/api/orders/${id}/cancel`, {}, { headers: authHeader() });
  return res.data; // { success, data }
}