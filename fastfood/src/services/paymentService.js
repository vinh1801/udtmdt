import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const client = axios.create({ baseURL: BASE_URL });

export async function createVnpayPayment(payload) {
  const res = await client.post("/api/payments/vnpay/create", payload);
  return res.data; // { success, orderId, paymentUrl }
}

export async function getOrderById(id) {
  const res = await client.get(`/api/orders/${id}`);
  return res.data; // { ...order }
}