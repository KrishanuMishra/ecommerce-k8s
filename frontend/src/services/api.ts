import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  register: (email: string, password: string, fullName: string) =>
    api.post("/auth/register", { email, password, fullName }),

  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  getProfile: () => api.get("/auth/profile"),

  logout: () => api.post("/auth/logout"),
};

// Product Services
export const productService = {
  getAll: () => api.get("/products"),

  getById: (id: number) => api.get(`/products/${id}`),

  search: (query: string) => api.get("/products/search", { params: { query } }),

  getByCategory: (category: string) =>
    api.get(`/products/category/${category}`),

  create: (productData: any) => api.post("/products", productData),

  update: (id: number, productData: any) =>
    api.put(`/products/${id}`, productData),

  delete: (id: number) => api.delete(`/products/${id}`),
};

export default api;
