-- ============================================================
-- Migration: New SRS Features (3.2.13 - 3.2.27)
-- Gift Gallery Project - All missing features
-- ============================================================

-- 1. Gift Wrapping Options (3.2.15 + 3.2.19 Dynamic Packaging)
CREATE TABLE IF NOT EXISTS gift_wrapping_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price NUMERIC(10,2) DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('wrapping', 'packaging')),
  color TEXT,
  theme TEXT,
  is_eco_friendly BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Product Bundles (3.2.21 + 3.2.24 Occasion-Based)
CREATE TABLE IF NOT EXISTS product_bundles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  occasion TEXT, -- birthday, wedding, anniversary, festival, custom
  discount_percent NUMERIC(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by TEXT, -- admin user_id
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bundle_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bundle_id UUID NOT NULL REFERENCES product_bundles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Gift Registry (3.2.22)
CREATE TABLE IF NOT EXISTS gift_registries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_date DATE,
  event_type TEXT NOT NULL, -- birthday, wedding, baby_shower, anniversary, other
  description TEXT,
  share_code TEXT UNIQUE NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gift_registry_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registry_id UUID NOT NULL REFERENCES gift_registries(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity_requested INTEGER DEFAULT 1,
  quantity_purchased INTEGER DEFAULT 0,
  purchased_by TEXT, -- user_id of buyer
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Group Gifting (3.2.17)
CREATE TABLE IF NOT EXISTS group_gifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id),
  recipient_name TEXT NOT NULL,
  recipient_email TEXT,
  target_amount NUMERIC(10,2) NOT NULL,
  current_amount NUMERIC(10,2) DEFAULT 0,
  message TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'funded', 'purchased', 'cancelled')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS group_gift_contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_gift_id UUID NOT NULL REFERENCES group_gifts(id) ON DELETE CASCADE,
  contributor_id TEXT, -- can be null for guest contributions
  contributor_name TEXT NOT NULL,
  contributor_email TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Charity Integration (3.2.23)
CREATE TABLE IF NOT EXISTS charities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS charity_donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  charity_id UUID NOT NULL REFERENCES charities(id),
  user_id TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  percentage NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Scheduled Deliveries (3.2.25)
-- Add scheduled_delivery_date to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS scheduled_delivery_date DATE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_note TEXT;

-- 7. Multi-Destination Checkout (3.2.20 + 3.2.26)
-- Sub-orders for multi-recipient splitting
CREATE TABLE IF NOT EXISTS order_recipients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  recipient_address TEXT NOT NULL,
  recipient_city TEXT NOT NULL,
  recipient_phone TEXT,
  recipient_email TEXT,
  personal_message TEXT,
  shipping_cost NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_recipient_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_recipient_id UUID NOT NULL REFERENCES order_recipients(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1
);

-- 8. Social Shopping / Chat Sessions (3.2.16)
CREATE TABLE IF NOT EXISTS shopping_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id TEXT NOT NULL,
  session_code TEXT UNIQUE NOT NULL,
  title TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS shopping_session_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES shopping_sessions(id) ON DELETE CASCADE,
  user_id TEXT,
  display_name TEXT NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shopping_session_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES shopping_sessions(id) ON DELETE CASCADE,
  sender_id TEXT,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'product_share', 'reaction')),
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Order wrapping/packaging selections
ALTER TABLE orders ADD COLUMN IF NOT EXISTS wrapping_id UUID REFERENCES gift_wrapping_options(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS wrapping_cost NUMERIC(10,2) DEFAULT 0;

-- 10. Charity donation on orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS charity_id UUID REFERENCES charities(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS charity_amount NUMERIC(10,2) DEFAULT 0;

-- 11. Event-Based Discounts enhancement (3.2.27)
ALTER TABLE discount_codes ADD COLUMN IF NOT EXISTS event_name TEXT;
ALTER TABLE discount_codes ADD COLUMN IF NOT EXISTS event_start TIMESTAMPTZ;
ALTER TABLE discount_codes ADD COLUMN IF NOT EXISTS countdown_enabled BOOLEAN DEFAULT false;

-- 12. Multi-language support (3.2.13) - Translation keys table
CREATE TABLE IF NOT EXISTS translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  locale TEXT NOT NULL, -- en, ur, ar, fr, etc.
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(locale, key)
);

-- Insert seed data for charities
INSERT INTO charities (name, description, logo_url, website_url) VALUES
  ('UNICEF', 'United Nations Children''s Fund - helping children worldwide', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Logo_of_UNICEF.svg/200px-Logo_of_UNICEF.svg.png', 'https://www.unicef.org'),
  ('Red Cross', 'International humanitarian organization providing emergency assistance', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_the_Red_Cross.svg/200px-Flag_of_the_Red_Cross.svg.png', 'https://www.icrc.org'),
  ('WWF', 'World Wildlife Fund - protecting nature and wildlife', 'https://upload.wikimedia.org/wikipedia/en/thumb/2/24/WWF_logo.svg/200px-WWF_logo.svg.png', 'https://www.worldwildlife.org')
ON CONFLICT DO NOTHING;

-- Insert seed gift wrapping options
INSERT INTO gift_wrapping_options (name, description, price, type, color, theme, is_eco_friendly) VALUES
  ('Classic Red', 'Traditional red wrapping paper with gold ribbon', 2.99, 'wrapping', '#C41E3A', 'classic', false),
  ('Elegant Gold', 'Premium gold foil wrapping with satin bow', 4.99, 'wrapping', '#D4A853', 'luxury', false),
  ('Floral Garden', 'Beautiful floral pattern wrapping', 3.49, 'wrapping', '#FF69B4', 'floral', false),
  ('Birthday Fun', 'Colorful birthday themed wrapping with confetti', 2.99, 'wrapping', '#FF6347', 'birthday', false),
  ('Eco Kraft', 'Recyclable kraft paper with twine bow', 1.99, 'wrapping', '#8B7355', 'minimal', true),
  ('Eco Botanical', 'Biodegradable paper with botanical prints', 2.49, 'wrapping', '#228B22', 'nature', true),
  ('Gift Box - Small', 'Elegant small gift box with tissue paper', 3.99, 'packaging', '#FFFFFF', 'box', false),
  ('Gift Box - Medium', 'Premium medium gift box with ribbon', 5.99, 'packaging', '#FFFFFF', 'box', false),
  ('Gift Box - Large', 'Luxury large gift box with bow', 7.99, 'packaging', '#FFFFFF', 'box', false),
  ('Reusable Gift Bag', 'Branded reusable fabric gift bag', 4.99, 'packaging', '#B76E79', 'reusable', true)
ON CONFLICT DO NOTHING;
