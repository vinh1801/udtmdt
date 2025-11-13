import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
export const ADMIN_TOKEN_KEY = "token_admin";

const api = axios.create({
  baseURL: BASE_URL,
});

export function adminAuthHeader() {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function adminLogin(payload) {
  const response = await api.post("/api/auth/login", payload);
  return response.data; // { token, user }
}

export async function adminGetProfile() {
  const response = await api.get("/api/auth/me", {
    headers: adminAuthHeader(),
  });
  return response.data; // { user }
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}