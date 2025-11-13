import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const client = axios.create({ baseURL: BASE_URL });

// Public
export async function getCategories() {
  const res = await client.get("/api/categories");
  return res.data; // { data: [...] }
}