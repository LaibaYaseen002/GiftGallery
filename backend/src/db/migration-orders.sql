-- =============================================
-- Migration: Orders, Order Items, Discount Codes
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id varchar(200) NOT NULL,
  user_email varchar(200) NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  discount_code varchar(50),
  discount_amount decimal(10,2) DEFAULT 0,
  status varchar(20) DEFAULT 'pending',
  shipping_name varchar(200) NOT NULL,
  shipping_address text NOT NULL,
  shipping_city varchar(100) NOT NULL,
  shipping_phone varchar(20) NOT NULL,
  gift_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name varchar(200) NOT NULL,
  price decimal(10,2) NOT NULL,
  quantity integer NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

CREATE TABLE IF NOT EXISTS discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(50) NOT NULL UNIQUE,
  discount_percent integer NOT NULL,
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  max_uses integer,
  current_uses integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

INSERT INTO discount_codes (code, discount_percent, is_active, max_uses) VALUES
  ('WELCOME10', 10, true, 100),
  ('GIFT20', 20, true, 50),
  ('SPECIAL15', 15, true, 30)
ON CONFLICT (code) DO NOTHING;
