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

import { Product, Category, PaginationInfo, GiftWrappingOption, ProductBundle, GiftRegistry, GiftRegistryItem, GroupGift, GroupGiftContribution, Charity, CharityDonation, ShoppingSession, SessionMessage } from "@/types";

export const productsApi = {
  getAll: (params?: { search?: string; category?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.category) query.set("category", params.category);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return fetchApi<{ data: Product[]; pagination: PaginationInfo }>(`/products${qs ? `?${qs}` : ""}`);
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

export interface AdminReview extends Review {
  product_name: string;
  product_image: string | null;
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  distribution: { rating: number; count: number }[];
}

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
  // Admin
  getAllAdmin: (token: string) =>
    fetchApi<{ data: AdminReview[]; stats: ReviewStats }>("/reviews/admin", { token }),
  deleteAdmin: (id: string, token: string) =>
    fetchApi<{ message: string }>(`/reviews/admin/${id}`, { method: "DELETE", token }),
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
  getActiveSales: () =>
    fetchApi<{ data: { code: string; discount_percent: number; expires_at: string }[] }>("/discounts/active-sales"),
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

import { AnalyticsData, ChartDataPoint, CategoryBreakdownItem, ActivityEvent } from "@/types";

export const analyticsApi = {
  getDashboard: (token: string) =>
    fetchApi<{ data: AnalyticsData }>("/admin/analytics", { token }),
  getChart: (token: string, period: "7d" | "30d" = "7d") =>
    fetchApi<{ data: ChartDataPoint[] }>(`/admin/analytics/chart?period=${period}`, { token }),
  getCategories: (token: string) =>
    fetchApi<{ data: CategoryBreakdownItem[] }>("/admin/analytics/categories", { token }),
  getActivity: (token: string) =>
    fetchApi<{ data: ActivityEvent[] }>("/admin/analytics/activity", { token }),
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

// ==================== Emails ====================

import { SentEmail, Notification } from "@/types";

export const emailsApi = {
  send: (data: { to_email: string; to_name?: string; subject: string; message: string }, token: string) =>
    fetchApi<{ message: string }>("/email/admin/send", { method: "POST", body: JSON.stringify(data), token }),
  replyFeedback: (feedbackId: string, message: string, token: string) =>
    fetchApi<{ message: string }>(`/email/admin/reply-feedback/${feedbackId}`, {
      method: "POST",
      body: JSON.stringify({ message }),
      token,
    }),
  getHistory: (token: string, limit = 50) =>
    fetchApi<{ data: SentEmail[] }>(`/email/admin/history?limit=${limit}`, { token }),
};

// ==================== Notifications ====================

export const notificationsApi = {
  getAll: (token: string, limit = 50) =>
    fetchApi<{ data: Notification[] }>(`/admin/notifications?limit=${limit}`, { token }),
  getUnreadCount: (token: string) =>
    fetchApi<{ data: { count: number } }>("/admin/notifications/unread-count", { token }),
  markAllRead: (token: string) =>
    fetchApi<{ message: string }>("/admin/notifications/read-all", { method: "PATCH", token }),
  markRead: (id: string, token: string) =>
    fetchApi<{ data: Notification; message: string }>(`/admin/notifications/${id}/read`, { method: "PATCH", token }),
};

// ==================== Customers ====================

export const customersApi = {
  getAll: (token: string) =>
    fetchApi<{ data: CustomerSummary[] }>("/admin/customers", { token }),
  getById: (userId: string, token: string) =>
    fetchApi<{ data: CustomerDetail }>(`/admin/customers/${userId}`, { token }),
};

// ==================== Gift Wrapping ====================

export const giftWrappingApi = {
  getAll: (type?: string) =>
    fetchApi<{ data: GiftWrappingOption[] }>(`/gift-wrapping${type ? `?type=${type}` : ""}`),
  getById: (id: string) =>
    fetchApi<{ data: GiftWrappingOption }>(`/gift-wrapping/${id}`),
  // Admin
  create: (data: Partial<GiftWrappingOption>, token: string) =>
    fetchApi<{ data: GiftWrappingOption; message: string }>("/gift-wrapping/admin", { method: "POST", body: JSON.stringify(data), token }),
  update: (id: string, data: Partial<GiftWrappingOption>, token: string) =>
    fetchApi<{ data: GiftWrappingOption; message: string }>(`/gift-wrapping/admin/${id}`, { method: "PUT", body: JSON.stringify(data), token }),
  delete: (id: string, token: string) =>
    fetchApi<{ message: string }>(`/gift-wrapping/admin/${id}`, { method: "DELETE", token }),
};

// ==================== Product Bundles ====================

export const bundlesApi = {
  getAll: (occasion?: string) =>
    fetchApi<{ data: ProductBundle[] }>(`/bundles${occasion ? `?occasion=${occasion}` : ""}`),
  getById: (id: string) =>
    fetchApi<{ data: ProductBundle }>(`/bundles/${id}`),
  // User custom bundle
  createCustom: (data: { name: string; items: { product_id: string; quantity: number }[] }, token: string) =>
    fetchApi<{ data: ProductBundle; message: string }>("/bundles/custom", { method: "POST", body: JSON.stringify(data), token }),
  // Admin
  create: (data: { name: string; description?: string; image_url?: string; occasion?: string; discount_percent?: number; items: { product_id: string; quantity: number }[] }, token: string) =>
    fetchApi<{ data: ProductBundle; message: string }>("/bundles/admin", { method: "POST", body: JSON.stringify(data), token }),
  update: (id: string, data: Record<string, unknown>, token: string) =>
    fetchApi<{ data: ProductBundle; message: string }>(`/bundles/admin/${id}`, { method: "PUT", body: JSON.stringify(data), token }),
  delete: (id: string, token: string) =>
    fetchApi<{ message: string }>(`/bundles/admin/${id}`, { method: "DELETE", token }),
};

// ==================== Gift Registry ====================

export const registryApi = {
  getMy: (token: string) =>
    fetchApi<{ data: GiftRegistry[] }>("/gift-registry/my", { token }),
  getById: (id: string, token: string) =>
    fetchApi<{ data: GiftRegistry }>(`/gift-registry/${id}`, { token }),
  getShared: (shareCode: string) =>
    fetchApi<{ data: GiftRegistry }>(`/gift-registry/shared/${shareCode}`),
  create: (data: { event_name: string; event_date?: string; event_type: string; description?: string }, token: string) =>
    fetchApi<{ data: GiftRegistry; message: string }>("/gift-registry", { method: "POST", body: JSON.stringify(data), token }),
  addItem: (registryId: string, data: { product_id: string; quantity_requested?: number }, token: string) =>
    fetchApi<{ data: GiftRegistryItem; message: string }>(`/gift-registry/${registryId}/items`, { method: "POST", body: JSON.stringify(data), token }),
  removeItem: (registryId: string, itemId: string, token: string) =>
    fetchApi<{ message: string }>(`/gift-registry/${registryId}/items/${itemId}`, { method: "DELETE", token }),
  purchaseItem: (shareCode: string, itemId: string, token: string) =>
    fetchApi<{ message: string }>(`/gift-registry/shared/${shareCode}/purchase/${itemId}`, { method: "POST", token }),
  delete: (id: string, token: string) =>
    fetchApi<{ message: string }>(`/gift-registry/${id}`, { method: "DELETE", token }),
};

// ==================== Group Gifting ====================

export const groupGiftsApi = {
  getMy: (token: string) =>
    fetchApi<{ data: GroupGift[] }>("/group-gifts/my", { token }),
  getById: (id: string, token: string) =>
    fetchApi<{ data: GroupGift }>(`/group-gifts/${id}`, { token }),
  getPublic: (id: string) =>
    fetchApi<{ data: GroupGift }>(`/group-gifts/contribute/${id}`),
  create: (data: { product_id: string; recipient_name: string; recipient_email?: string; message?: string; expires_at?: string }, token: string) =>
    fetchApi<{ data: GroupGift; message: string }>("/group-gifts", { method: "POST", body: JSON.stringify(data), token }),
  contribute: (id: string, data: { contributor_name: string; contributor_email: string; amount: number }, token: string) =>
    fetchApi<{ data: GroupGiftContribution; message: string }>(`/group-gifts/${id}/contribute`, { method: "POST", body: JSON.stringify(data), token }),
  cancel: (id: string, token: string) =>
    fetchApi<{ message: string }>(`/group-gifts/${id}/cancel`, { method: "PATCH", token }),
};

// ==================== Charities ====================

export const charitiesApi = {
  getAll: () =>
    fetchApi<{ data: Charity[] }>("/charities"),
  getMyDonations: (token: string) =>
    fetchApi<{ data: CharityDonation[] }>("/charities/donations/my", { token }),
  // Admin
  create: (data: Partial<Charity>, token: string) =>
    fetchApi<{ data: Charity; message: string }>("/charities/admin", { method: "POST", body: JSON.stringify(data), token }),
  update: (id: string, data: Partial<Charity>, token: string) =>
    fetchApi<{ data: Charity; message: string }>(`/charities/admin/${id}`, { method: "PUT", body: JSON.stringify(data), token }),
  delete: (id: string, token: string) =>
    fetchApi<{ message: string }>(`/charities/admin/${id}`, { method: "DELETE", token }),
};

// ==================== Social Shopping ====================

export const socialShoppingApi = {
  createSession: (data: { title?: string }, token: string) =>
    fetchApi<{ data: ShoppingSession; message: string }>("/social-shopping/sessions", { method: "POST", body: JSON.stringify(data), token }),
  getMySessions: (token: string) =>
    fetchApi<{ data: ShoppingSession[] }>("/social-shopping/sessions/my", { token }),
  getSession: (code: string) =>
    fetchApi<{ data: ShoppingSession }>(`/social-shopping/sessions/${code}`),
  joinSession: (code: string, data: { display_name: string }, token: string) =>
    fetchApi<{ message: string }>(`/social-shopping/sessions/${code}/join`, { method: "POST", body: JSON.stringify(data), token }),
  getMessages: (code: string, token: string) =>
    fetchApi<{ data: SessionMessage[] }>(`/social-shopping/sessions/${code}/messages`, { token }),
  sendMessage: (code: string, data: { message: string; message_type?: string; product_id?: string }, token: string) =>
    fetchApi<{ data: SessionMessage; message: string }>(`/social-shopping/sessions/${code}/messages`, { method: "POST", body: JSON.stringify(data), token }),
  endSession: (code: string, token: string) =>
    fetchApi<{ message: string }>(`/social-shopping/sessions/${code}/end`, { method: "PATCH", token }),
};
