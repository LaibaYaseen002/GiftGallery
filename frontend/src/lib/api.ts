const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, headers: customHeaders, ...rest } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers,
    ...rest,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: "An unexpected error occurred",
    }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ==================== Products ====================

import { Product, Category } from "@/types";

export const productsApi = {
  getAll: (params?: { search?: string; category?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.category) query.set("category", params.category);
    const qs = query.toString();
    return fetchApi<{ data: Product[] }>(`/products${qs ? `?${qs}` : ""}`);
  },
  getById: (id: string) => fetchApi<{ data: Product }>(`/products/${id}`),
  create: (data: Partial<Product>, token: string) =>
    fetchApi<{ data: Product; message: string }>("/products", { method: "POST", body: JSON.stringify(data), token }),
  update: (id: string, data: Partial<Product>, token: string) =>
    fetchApi<{ data: Product; message: string }>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data), token }),
  delete: (id: string, token: string) =>
    fetchApi<{ message: string }>(`/products/${id}`, { method: "DELETE", token }),
};

// ==================== Categories ====================

export const categoriesApi = {
  getAll: () => fetchApi<{ data: Category[] }>("/categories"),
  getProducts: (slug: string) =>
    fetchApi<{ data: Product[]; category: Category }>(`/categories/${slug}/products`),
};

// ==================== Orders ====================

import { Order, DiscountCode, CreateOrderRequest } from "@/types";

export const ordersApi = {
  create: (data: CreateOrderRequest, token: string) =>
    fetchApi<{ data: Order; message: string }>("/orders", { method: "POST", body: JSON.stringify(data), token }),
  getAll: (token: string) =>
    fetchApi<{ data: Order[] }>("/orders", { token }),
  getById: (id: string, token: string) =>
    fetchApi<{ data: Order }>(`/orders/${id}`, { token }),
  updateStatus: (id: string, status: string, token: string) =>
    fetchApi<{ data: Order; message: string }>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      token,
    }),
};

// ==================== Reviews ====================

import { Review } from "@/types";

export const reviewsApi = {
  getByProduct: (productId: string) =>
    fetchApi<{ data: Review[]; average_rating: number; review_count: number }>(`/reviews/product/${productId}`),
  create: (productId: string, data: { rating: number; comment?: string }, token: string) =>
    fetchApi<{ data: Review; message: string }>(`/reviews/product/${productId}`, {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  delete: (id: string, token: string) =>
    fetchApi<{ message: string }>(`/reviews/${id}`, { method: "DELETE", token }),
};

// ==================== Wishlist ====================

export const wishlistApi = {
  getAll: (token: string) =>
    fetchApi<{ data: unknown[] }>("/wishlist", { token }),
  add: (productId: string, token: string) =>
    fetchApi("/wishlist", {
      method: "POST",
      body: JSON.stringify({ product_id: productId }),
      token,
    }),
  remove: (productId: string, token: string) =>
    fetchApi(`/wishlist/${productId}`, { method: "DELETE", token }),
};

// ==================== Discounts ====================

export const discountsApi = {
  validate: (code: string, token: string) =>
    fetchApi<{ data: { code: string; discount_percent: number }; message: string }>("/discounts/validate", {
      method: "POST",
      body: JSON.stringify({ code }),
      token,
    }),
  // Admin
  getAll: (token: string) =>
    fetchApi<{ data: DiscountCode[] }>("/discounts/admin", { token }),
  create: (data: Partial<DiscountCode>, token: string) =>
    fetchApi<{ data: DiscountCode; message: string }>("/discounts/admin", { method: "POST", body: JSON.stringify(data), token }),
  update: (id: string, data: Partial<DiscountCode>, token: string) =>
    fetchApi<{ data: DiscountCode; message: string }>(`/discounts/admin/${id}`, { method: "PUT", body: JSON.stringify(data), token }),
  delete: (id: string, token: string) =>
    fetchApi<{ message: string }>(`/discounts/admin/${id}`, { method: "DELETE", token }),
};

// ==================== Returns ====================

export const returnsApi = {
  create: (data: unknown, token: string) =>
    fetchApi("/returns", { method: "POST", body: JSON.stringify(data), token }),
  getAll: (token: string) =>
    fetchApi<{ data: unknown[] }>("/returns", { token }),
  // Admin
  getAllAdmin: (token: string) =>
    fetchApi<{ data: unknown[] }>("/returns/admin", { token }),
  updateStatus: (id: string, data: unknown, token: string) =>
    fetchApi(`/returns/admin/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),
};

// ==================== Feedback ====================

export const feedbackApi = {
  create: (data: unknown) =>
    fetchApi("/feedback", { method: "POST", body: JSON.stringify(data) }),
  // Admin
  getAll: (token: string) =>
    fetchApi<{ data: unknown[] }>("/feedback/admin", { token }),
  markRead: (id: string, token: string) =>
    fetchApi(`/feedback/admin/${id}`, { method: "PATCH", token }),
};

// ==================== Analytics ====================

export const analyticsApi = {
  getDashboard: (token: string) =>
    fetchApi<{ data: unknown }>("/admin/analytics", { token }),
};
