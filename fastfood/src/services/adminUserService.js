import axios from "axios";
import { ADMIN_TOKEN_KEY } from "./adminAuthService";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const api = axios.create({ baseURL: BASE_URL });

function adminAuthHeader() {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function adminListRestrictedUsers(params = {}) {
  const res = await api.get("/api/admin/users/restricted", {
    params,
    headers: adminAuthHeader(),
  });
  return res.data; // { data: [...] }
}

export async function adminSearchUsers(params = {}) {
  const res = await api.get("/api/admin/users/search", {
    params,
    headers: adminAuthHeader(),
  });
  return res.data; // { data: [...] }
}

export async function adminGetUser(id) {
  const res = await api.get(`/api/admin/users/${id}`, {
    headers: adminAuthHeader(),
  });
  return res.data; // { data }
}

export async function adminToggleUserRestricted(id, isRestricted) {
  const res = await api.put(
    `/api/admin/users/${id}/restrict`,
    { isRestricted },
    { headers: adminAuthHeader() }
  );
  return res.data; // { data }
}

export async function adminDeleteUser(id) {
  const res = await api.delete(`/api/admin/users/${id}`, {
    headers: adminAuthHeader(),
  });
  return res.data; // { success }
}