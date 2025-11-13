import axios from "axios";
import { ADMIN_TOKEN_KEY } from "./adminAuthService";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const api = axios.create({ baseURL: BASE_URL });

function adminAuthHeader() {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function adminGetFoods(params = {}) {
  const res = await api.get("/api/admin/foods", { params, headers: adminAuthHeader() });
  return res.data; // { data: [...] }
}

export async function adminCreateFood(payload) {
  const res = await api.post("/api/admin/foods", payload, { headers: adminAuthHeader() });
  return res.data; // { data }
}

export async function adminUpdateFood(id, payload) {
  const res = await api.put(`/api/admin/foods/${id}`, payload, { headers: adminAuthHeader() });
  return res.data; // { data }
}

export async function adminDeleteFood(id) {
  const res = await api.delete(`/api/admin/foods/${id}`, { headers: adminAuthHeader() });
  return res.data; // { ok: true }
}