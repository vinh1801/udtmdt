import axios from "axios";
import { authHeader } from "./authService";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const client = axios.create({ baseURL: BASE_URL });

client.interceptors.request.use((config) => {
  const headers = authHeader();
  if (Object.keys(headers).length) {
    config.headers = { ...config.headers, ...headers };
  }
  return config;
});

/**
 * Lấy danh sách món ăn
 */
export const getAllFoods = async ({
  search = "",
  category = "",
  page = 1,
  limit = 50,
  special,
} = {}) => {
  try {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (typeof special !== "undefined") params.special = special;
    params.page = page;
    params.limit = limit;

    const res = await client.get("/api/foods", { params });
    return res.data; // { data: [], total }
  } catch (error) {
    console.error("❌ Lỗi khi gọi API getAllFoods:", error.message);
    return { data: [], total: 0 };
  }
};

/**
 * Lấy chi tiết 1 món ăn theo ID
 */
export const getFoodById = async (id) => {
  try {
    const res = await client.get(`/api/foods/${id}`);
    return res.data;
  } catch (error) {
    console.error(`❌ Lỗi khi lấy món ăn ID=${id}:`, error.message);
    return null;
  }
};

/**
 * Các API CRUD (sau này dùng cho admin)
 */
export const createFood = async (newFood) => {
  try {
    const res = await client.post("/api/foods", newFood);
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi khi tạo món ăn:", error.message);
    return null;
  }
};

export const updateFood = async (id, updateData) => {
  try {
    const res = await client.put(`/api/foods/${id}`, updateData);
    return res.data;
  } catch (error) {
    console.error(`❌ Lỗi khi cập nhật món ăn ID=${id}:`, error.message);
    return null;
  }
};

export const deleteFood = async (id) => {
  try {
    await client.delete(`/api/foods/${id}`);
    return true;
  } catch (error) {
    console.error(`❌ Lỗi khi xóa món ăn ID=${id}:`, error.message);
    return false;
  }
};
