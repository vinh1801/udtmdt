import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
export const USER_TOKEN_KEY = "token_user";

const api = axios.create({
  baseURL: BASE_URL,
});

export function authHeader() {
  const token = localStorage.getItem(USER_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function register(payload) {
  const response = await api.post("/api/auth/register", payload);
  return response.data; // { token, user }
}

export async function login(payload) {
  const response = await api.post("/api/auth/login", payload);
  return response.data; // { token, user }
}

export async function getProfile() {
  const response = await api.get("/api/auth/me", {
    headers: authHeader(),
  });
  return response.data; // { user }
}

export async function updateProfile(data) {
  const response = await authorizedPut("/api/auth/me", data);
  return response.data; // { user }
}

export async function changePassword(payload) {
  const response = await authorizedPut("/api/auth/change-password", payload);
  return response.data; // { message }
}

export async function deleteAccount() {
  const response = await authorizedDelete("/api/auth/me");
  return response.data; // { message }
}

// Helpers
export async function authorizedGet(url, config = {}) {
  return api.get(url, {
    ...config,
    headers: { ...config.headers, ...authHeader() },
  });
}

export async function authorizedPost(url, data, config = {}) {
  return api.post(url, data, {
    ...config,
    headers: { ...config.headers, ...authHeader() },
  });
}

export async function authorizedPut(url, data, config = {}) {
  return api.put(url, data, {
    ...config,
    headers: { ...config.headers, ...authHeader() },
  });
}

export async function authorizedDelete(url, config = {}) {
  return api.delete(url, {
    ...config,
    headers: { ...config.headers, ...authHeader() },
  });
}