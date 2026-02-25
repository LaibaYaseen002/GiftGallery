-- =============================================
-- Gift Gallery Database Setup
-- =============================================

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL UNIQUE,
  slug varchar(100) NOT NULL UNIQUE,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(200) NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image_url text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster category lookups
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

-- =============================================
-- Seed Categories
-- =============================================
INSERT INTO categories (name, slug, image_url) VALUES
  ('Jewelry', 'jewelry', 'https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=400'),
  ('Clothes', 'clothes', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400'),
  ('Watches', 'watches', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400'),
  ('Perfumes', 'perfumes', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'),
  ('Bags', 'bags', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'),
  ('Other Gifts', 'other-gifts', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- Seed Products
-- =============================================

-- Jewelry
INSERT INTO products (name, description, price, image_url, category_id) VALUES
  ('Gold Pearl Necklace', 'Elegant gold necklace with freshwater pearls. Perfect for special occasions.', 89.99, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500', (SELECT id FROM categories WHERE slug = 'jewelry')),
  ('Silver Diamond Ring', 'Sterling silver ring with cubic zirconia stones. A timeless classic.', 129.99, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500', (SELECT id FROM categories WHERE slug = 'jewelry')),
  ('Rose Gold Bracelet', 'Delicate rose gold bracelet with charm details. Great gift for her.', 59.99, 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500', (SELECT id FROM categories WHERE slug = 'jewelry')),
  ('Crystal Drop Earrings', 'Stunning crystal drop earrings that catch the light beautifully.', 45.99, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500', (SELECT id FROM categories WHERE slug = 'jewelry')),

-- Clothes
  ('Silk Floral Scarf', 'Luxurious silk scarf with hand-painted floral design. Versatile accessory.', 39.99, 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500', (SELECT id FROM categories WHERE slug = 'clothes')),
  ('Cashmere Winter Shawl', 'Premium cashmere shawl in warm tones. Perfect winter gift.', 79.99, 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500', (SELECT id FROM categories WHERE slug = 'clothes')),
  ('Embroidered Kurti', 'Beautiful hand-embroidered kurti with traditional designs.', 49.99, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500', (SELECT id FROM categories WHERE slug = 'clothes')),
  ('Mens Formal Tie Set', 'Premium silk tie with matching cufflinks and pocket square.', 34.99, 'https://images.unsplash.com/photo-1589756823695-278bc923a203?w=500', (SELECT id FROM categories WHERE slug = 'clothes')),

-- Watches
  ('Classic Leather Watch', 'Minimalist analog watch with genuine leather strap. Unisex design.', 149.99, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500', (SELECT id FROM categories WHERE slug = 'watches')),
  ('Rose Gold Ladies Watch', 'Elegant rose gold watch with mesh band. Perfect everyday accessory.', 119.99, 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=500', (SELECT id FROM categories WHERE slug = 'watches')),
  ('Sports Chronograph', 'Multi-function sports watch with stopwatch and date display.', 199.99, 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500', (SELECT id FROM categories WHERE slug = 'watches')),

-- Perfumes
  ('French Rose Perfume', 'Exquisite French perfume with notes of rose, jasmine, and musk.', 69.99, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500', (SELECT id FROM categories WHERE slug = 'perfumes')),
  ('Oud Wood Cologne', 'Rich oud wood cologne with amber and sandalwood undertones.', 89.99, 'https://images.unsplash.com/photo-1594035910387-fea081e09076?w=500', (SELECT id FROM categories WHERE slug = 'perfumes')),
  ('Vanilla Blossom Mist', 'Light and refreshing body mist with vanilla and white flower notes.', 29.99, 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500', (SELECT id FROM categories WHERE slug = 'perfumes')),

-- Bags
  ('Leather Crossbody Bag', 'Genuine leather crossbody bag with adjustable strap. Multiple compartments.', 99.99, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', (SELECT id FROM categories WHERE slug = 'bags')),
  ('Canvas Tote Bag', 'Stylish canvas tote with inner pockets. Perfect for daily use.', 34.99, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500', (SELECT id FROM categories WHERE slug = 'bags')),
  ('Velvet Clutch Purse', 'Elegant velvet clutch with gold chain strap. Ideal for evening events.', 54.99, 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500', (SELECT id FROM categories WHERE slug = 'bags')),

-- Other Gifts
  ('Scented Candle Set', 'Set of 3 premium scented candles — lavender, vanilla, and cinnamon.', 24.99, 'https://images.unsplash.com/photo-1602178506389-a67f06e5e710?w=500', (SELECT id FROM categories WHERE slug = 'other-gifts')),
  ('Luxury Gift Box', 'Curated gift box with chocolates, bath bombs, and a greeting card.', 59.99, 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500', (SELECT id FROM categories WHERE slug = 'other-gifts')),
  ('Fresh Flower Bouquet', 'Beautiful mixed flower arrangement perfect for any celebration.', 44.99, 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=500', (SELECT id FROM categories WHERE slug = 'other-gifts')),
  ('Photo Frame Set', 'Set of 3 elegant wooden photo frames in different sizes.', 29.99, 'https://images.unsplash.com/photo-1544942579-c18e4956ae02?w=500', (SELECT id FROM categories WHERE slug = 'other-gifts'));

-- =============================================
-- Orders table
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

-- =============================================
-- Order Items table
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name varchar(200) NOT NULL,
  price decimal(10,2) NOT NULL,
  quantity integer NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- =============================================
-- Discount Codes table
-- =============================================
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

-- =============================================
-- Seed Discount Codes
-- =============================================
INSERT INTO discount_codes (code, discount_percent, is_active, max_uses) VALUES
  ('WELCOME10', 10, true, 100),
  ('GIFT20', 20, true, 50),
  ('SPECIAL15', 15, true, 30)
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- Reviews table
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  user_id varchar(200) NOT NULL,
  user_name varchar(200) NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
