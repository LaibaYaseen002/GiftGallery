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
  gift_font: string | null;
  payment_intent_id: string | null;
  payment_status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  status_history?: StatusHistory[];
}

export interface StatusHistory {
  id: string;
  order_id: string;
  old_status: string | null;
  new_status: string;
  changed_by: string;
  note: string | null;
  created_at: string;
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
  is_flash_sale: boolean;
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

// ==================== New Feature Types ====================

export interface GiftWrappingOption {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number;
  type: "wrapping" | "packaging";
  color: string | null;
  theme: string | null;
  is_eco_friendly: boolean;
  is_active: boolean;
  created_at: string;
}

export interface ProductBundle {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  occasion: string | null;
  discount_percent: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  items?: BundleItem[];
  total_value?: number;
  bundle_price?: number;
}

export interface BundleItem {
  id: string;
  bundle_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface GiftRegistry {
  id: string;
  user_id: string;
  event_name: string;
  event_date: string | null;
  event_type: string;
  description: string | null;
  share_code: string;
  is_public: boolean;
  created_at: string;
  items?: GiftRegistryItem[];
}

export interface GiftRegistryItem {
  id: string;
  registry_id: string;
  product_id: string;
  quantity_requested: number;
  quantity_purchased: number;
  purchased_by: string | null;
  created_at: string;
  product?: Product;
}

export interface GroupGift {
  id: string;
  organizer_id: string;
  product_id: string;
  recipient_name: string;
  recipient_email: string | null;
  target_amount: number;
  current_amount: number;
  message: string | null;
  status: "active" | "funded" | "purchased" | "cancelled";
  expires_at: string | null;
  created_at: string;
  product?: Product;
  contributions?: GroupGiftContribution[];
}

export interface GroupGiftContribution {
  id: string;
  group_gift_id: string;
  contributor_id: string | null;
  contributor_name: string;
  contributor_email: string;
  amount: number;
  status: "pending" | "paid" | "refunded";
  created_at: string;
}

export interface Charity {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CharityDonation {
  id: string;
  order_id: string | null;
  charity_id: string;
  user_id: string;
  amount: number;
  percentage: number | null;
  created_at: string;
  charity?: Charity;
}

export interface ShoppingSession {
  id: string;
  host_id: string;
  session_code: string;
  title: string | null;
  is_active: boolean;
  created_at: string;
  ended_at: string | null;
  video_room_url: string | null;
  video_room_name: string | null;
  participants?: SessionParticipant[];
}

export interface SessionParticipant {
  id: string;
  session_id: string;
  user_id: string | null;
  display_name: string;
  joined_at: string;
}

export interface SessionMessage {
  id: string;
  session_id: string;
  sender_id: string | null;
  sender_name: string;
  message: string;
  message_type: "text" | "product_share" | "reaction";
  product_id: string | null;
  created_at: string;
  product?: Product;
}

export interface OrderRecipient {
  id: string;
  order_id: string;
  recipient_name: string;
  recipient_address: string;
  recipient_city: string;
  recipient_phone: string | null;
  recipient_email: string | null;
  personal_message: string | null;
  shipping_cost: number;
  status: string;
  created_at: string;
  items?: OrderRecipientItem[];
}

export interface OrderRecipientItem {
  id: string;
  order_recipient_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

// ==================== Request Types ====================

export interface CreateOrderRequest {
  items: { product_id: string; quantity: number }[];
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_phone: string;
  gift_message?: string;
  gift_font?: string;
  discount_code?: string;
}

// ==================== Cart Types ====================

export interface CartItem {
  product: Product;
  quantity: number;
}

// ==================== Pagination Types ====================

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ==================== API Response Types ====================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface AnalyticsData {
  total_orders: number;
  total_revenue: number;
  total_products: number;
  total_customers: number;
  pending_orders: number;
  delivered_orders: number;
  pending_returns: number;
  unread_feedback: number;
  recent_orders: {
    id: string;
    user_email: string;
    total_amount: number;
    status: string;
    created_at: string;
    shipping_name: string;
  }[];
  top_products: { product_name: string; total_sold: number }[];
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategoryBreakdownItem {
  name: string;
  total_orders: number;
  total_revenue: number;
  product_count: number;
}

export interface ActivityEvent {
  type: "order" | "return" | "feedback" | "review";
  message: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface SentEmail {
  id: string;
  to_email: string;
  to_name: string | null;
  subject: string;
  message: string;
  type: string;
  reference_id: string | null;
  sent_by: string;
  created_at: string;
}
