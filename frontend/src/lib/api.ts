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
  create: (data: Record<string, unknown>, token: string) =>
    fetchApi<{ data: Product; message: string }>("/products", { method: "POST", body: JSON.stringify(data), token }),
  update: (id: string, data: Record<string, unknown>, token: string) =>
    fetchApi<{ data: Product; message: string }>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data), token }),
  delete: (id: string, token: string) =>
    fetchApi<{ message: string }>(`/products/${id}`, { method: "DELETE", token }),
};

// ==================== Categories ====================

export const categoriesApi = {
  getAll: () => fetchApi<{ data: Category[] }>("/categories"),
  getProducts: (slug: string) =>
    fetchApi<{ data: Product[]; category: Category }>(`/categories/${slug}/products`),
  // Admin
  create: (data: { name: string; slug: string; image_url?: string }, token: string) =>
    fetchApi<{ data: Category; message: string }>("/categories", { method: "POST", body: JSON.stringify(data), token }),
  update: (id: string, data: { name?: string; slug?: string; image_url?: string }, token: string) =>
    fetchApi<{ data: Category; message: string }>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data), token }),
  delete: (id: string, token: string) =>
    fetchApi<{ message: string }>(`/categories/${id}`, { method: "DELETE", token }),
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
  // Admin
  getAllAdmin: (token: string) =>
    fetchApi<{ data: Order[] }>("/orders/admin/all", { token }),
  getAdminDetail: (id: string, token: string) =>
    fetchApi<{ data: Order }>(`/orders/admin/${id}`, { token }),
  updateNotes: (id: string, admin_notes: string, token: string) =>
    fetchApi<{ data: Order; message: string }>(`/orders/${id}/notes`, {
      method: "PATCH",
      body: JSON.stringify({ admin_notes }),
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

import { WishlistItem } from "@/types";

export const wishlistApi = {
  getAll: (token: string) =>
    fetchApi<{ data: WishlistItem[] }>("/wishlist", { token }),
  add: (productId: string, token: string) =>
    fetchApi<{ data: WishlistItem; message: string }>("/wishlist", {
      method: "POST",
      body: JSON.stringify({ product_id: productId }),
      token,
    }),
  remove: (productId: string, token: string) =>
    fetchApi<{ message: string }>(`/wishlist/${productId}`, { method: "DELETE", token }),
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

import { ReturnRequest } from "@/types";

export const returnsApi = {
  create: (data: { order_id: string; reason: string }, token: string) =>
    fetchApi<{ data: ReturnRequest; message: string }>("/returns", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  getAll: (token: string) =>
    fetchApi<{ data: ReturnRequest[] }>("/returns", { token }),
  // Admin
  getAllAdmin: (token: string) =>
    fetchApi<{ data: ReturnRequest[] }>("/returns/admin", { token }),
  updateStatus: (id: string, data: { status: string; admin_notes?: string }, token: string) =>
    fetchApi<{ data: ReturnRequest; message: string }>(`/returns/admin/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),
};

// ==================== Feedback ====================

import { Feedback } from "@/types";

export const feedbackApi = {
  create: (data: { name: string; email: string; subject: string; message: string }) =>
    fetchApi<{ data: Feedback; message: string }>("/feedback", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  // Admin
  getAll: (token: string) =>
    fetchApi<{ data: Feedback[] }>("/feedback/admin", { token }),
  markRead: (id: string, token: string) =>
    fetchApi<{ data: Feedback; message: string }>(`/feedback/admin/${id}`, {
      method: "PATCH",
      token,
    }),
};

// ==================== Analytics ====================

import { AnalyticsData } from "@/types";

export const analyticsApi = {
  getDashboard: (token: string) =>
    fetchApi<{ data: AnalyticsData }>("/admin/analytics", { token }),
};

// ==================== Customers ====================

export interface CustomerSummary {
  user_id: string;
  name: string;
  email: string;
  image_url: string | null;
  total_orders: number;
  total_spent: number;
  first_order: string;
  last_order: string;
  member_since: string;
}

export interface CustomerDetail {
  user_id: string;
  name: string;
  email: string;
  image_url: string | null;
  member_since: string;
  stats: {
    total_orders: number;
    total_spent: number;
    avg_order_value: number;
    total_returns: number;
    total_reviews: number;
  };
  orders: Order[];
  returns: ReturnRequest[];
  reviews: Review[];
}

export const customersApi = {
  getAll: (token: string) =>
    fetchApi<{ data: CustomerSummary[] }>("/admin/customers", { token }),
  getById: (userId: string, token: string) =>
    fetchApi<{ data: CustomerDetail }>(`/admin/customers/${userId}`, { token }),
};
