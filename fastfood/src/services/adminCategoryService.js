import axios from "axios";
import { ADMIN_TOKEN_KEY } from "./adminAuthService";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const api = axios.create({ baseURL: BASE_URL });

function adminAuthHeader() {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function adminGetCategories() {
  const res = await api.get("/api/admin/categories", { headers: adminAuthHeader() });
  return res.data; // { data: [...] }
}

export async function adminCreateCategory(payload) {
  const res = await api.post("/api/admin/categories", payload, { headers: adminAuthHeader() });
  return res.data; // { data }
}

export async function adminUpdateCategory(id, payload) {
  const res = await api.put(`/api/admin/categories/${id}`, payload, { headers: adminAuthHeader() });
  return res.data; // { data }
}

export async function adminDeleteCategory(id) {
  const res = await api.delete(`/api/admin/categories/${id}`, { headers: adminAuthHeader() });
  return res.data; // { ok: true }
}