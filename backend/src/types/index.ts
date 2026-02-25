// ==================== Database Types ====================

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string;
  category_id: string;
  in_stock: boolean;
  created_at: string;
  // Joined fields
  category?: Category;
  average_rating?: number;
  review_count?: number;
}

export interface Order {
  id: string;
  user_id: string;
  user_email: string;
  total_amount: number;
  discount_code: string | null;
  discount_amount: number;
  status: OrderStatus;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_phone: string;
  gift_message: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  items?: OrderItem[];
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  // Joined fields
  product?: Product;
}

export interface DiscountCode {
  id: string;
  code: string;
  discount_percent: number;
  is_active: boolean;
  expires_at: string | null;
  max_uses: number | null;
  current_uses: number;
  created_at: string;
}

export interface ReturnRequest {
  id: string;
  order_id: string;
  user_id: string;
  reason: string;
  status: ReturnStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  order?: Order;
}

export type ReturnStatus = "pending" | "approved" | "rejected" | "refunded";

export interface Feedback {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ==================== Request Types ====================

export interface CreateOrderRequest {
  items: { product_id: string; quantity: number }[];
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_phone: string;
  gift_message?: string;
  discount_code?: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
}

export interface CreateReturnRequest {
  order_id: string;
  reason: string;
}

export interface CreateFeedbackRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface CreateDiscountRequest {
  code: string;
  discount_percent: number;
  expires_at?: string;
  max_uses?: number;
}
