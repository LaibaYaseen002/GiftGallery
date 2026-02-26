-- =============================================
-- Migration: Fix broken images + Add new categories & products
-- =============================================

-- =============================================
-- Fix broken category images
-- =============================================
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400'
WHERE slug = 'jewelry';

-- =============================================
-- Fix broken product images
-- =============================================
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=500'
WHERE name = 'Mens Formal Tie Set';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500'
WHERE name = 'Oud Wood Cologne';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500'
WHERE name = 'Scented Candle Set';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=500'
WHERE name = 'Photo Frame Set';

-- =============================================
-- Add new categories
-- =============================================
INSERT INTO categories (name, slug, image_url) VALUES
  ('Home Decor', 'home-decor', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'),
  ('Chocolates & Sweets', 'chocolates-sweets', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400'),
  ('Flowers & Plants', 'flowers-plants', 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=400'),
  ('Skincare & Beauty', 'skincare-beauty', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'),
  ('Toys & Stuffed Animals', 'toys-stuffed-animals', 'https://images.unsplash.com/photo-1558060318-5bf3a6cb3e24?w=400')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- Add more Jewelry products
-- =============================================
INSERT INTO products (name, description, price, image_url, category_id) VALUES
  ('Sapphire Pendant Necklace', 'Beautiful blue sapphire pendant on a sterling silver chain. Ideal birthday gift.', 149.99, 'https://images.unsplash.com/photo-1599459183200-59c3fd67de0e?w=500', (SELECT id FROM categories WHERE slug = 'jewelry')),
  ('Pearl Stud Earrings', 'Classic freshwater pearl stud earrings. Timeless elegance for any occasion.', 39.99, 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500', (SELECT id FROM categories WHERE slug = 'jewelry')),
  ('Charm Anklet Bracelet', 'Dainty gold-plated anklet with heart and star charms. Perfect summer accessory.', 29.99, 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500', (SELECT id FROM categories WHERE slug = 'jewelry')),
  ('Diamond Tennis Bracelet', 'Sparkling cubic zirconia tennis bracelet in silver setting. Show-stopping gift.', 179.99, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500', (SELECT id FROM categories WHERE slug = 'jewelry'));

-- =============================================
-- Add more Clothes products
-- =============================================
INSERT INTO products (name, description, price, image_url, category_id) VALUES
  ('Cashmere V-Neck Sweater', 'Luxuriously soft cashmere sweater in neutral tones. Perfect cozy gift.', 89.99, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500', (SELECT id FROM categories WHERE slug = 'clothes')),
  ('Embroidered Dupatta', 'Hand-embroidered chiffon dupatta with intricate mirror work.', 44.99, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500', (SELECT id FROM categories WHERE slug = 'clothes')),
  ('Silk Pajama Set', 'Premium silk pajama set in elegant gift box. Ultimate comfort gift.', 69.99, 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500', (SELECT id FROM categories WHERE slug = 'clothes')),
  ('Leather Belt Gift Set', 'Genuine leather belt with reversible buckle in premium gift box.', 54.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', (SELECT id FROM categories WHERE slug = 'clothes'));

-- =============================================
-- Add more Watches products
-- =============================================
INSERT INTO products (name, description, price, image_url, category_id) VALUES
  ('Smart Fitness Band', 'Sleek fitness tracker with heart rate monitor, steps, and notifications.', 79.99, 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500', (SELECT id FROM categories WHERE slug = 'watches')),
  ('Vintage Pocket Watch', 'Classic vintage-style pocket watch with chain. Unique collector gift.', 69.99, 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=500', (SELECT id FROM categories WHERE slug = 'watches')),
  ('Minimalist Digital Watch', 'Ultra-thin digital watch with LED display. Modern and stylish.', 59.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', (SELECT id FROM categories WHERE slug = 'watches'));

-- =============================================
-- Add more Perfumes products
-- =============================================
INSERT INTO products (name, description, price, image_url, category_id) VALUES
  ('Lavender Dream Eau de Parfum', 'Calming lavender perfume with notes of bergamot and white musk.', 59.99, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500', (SELECT id FROM categories WHERE slug = 'perfumes')),
  ('Amber Musk Attar', 'Traditional amber musk attar oil. Long-lasting and exotic.', 49.99, 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500', (SELECT id FROM categories WHERE slug = 'perfumes')),
  ('Citrus Fresh Body Spray', 'Refreshing citrus body spray with lemon, orange, and grapefruit notes.', 24.99, 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=500', (SELECT id FROM categories WHERE slug = 'perfumes'));

-- =============================================
-- Add more Bags products
-- =============================================
INSERT INTO products (name, description, price, image_url, category_id) VALUES
  ('Mini Backpack', 'Compact faux leather mini backpack. Stylish and functional for everyday use.', 44.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', (SELECT id FROM categories WHERE slug = 'bags')),
  ('Travel Duffle Bag', 'Spacious canvas duffle bag with leather handles. Perfect travel companion.', 79.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', (SELECT id FROM categories WHERE slug = 'bags')),
  ('Woven Straw Tote', 'Handwoven straw tote bag with leather straps. Beach and summer essential.', 39.99, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500', (SELECT id FROM categories WHERE slug = 'bags'));

-- =============================================
-- Add more Other Gifts products
-- =============================================
INSERT INTO products (name, description, price, image_url, category_id) VALUES
  ('Personalized Mug Set', 'Set of 2 ceramic mugs perfect for couples. Gift-boxed with love.', 19.99, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500', (SELECT id FROM categories WHERE slug = 'other-gifts')),
  ('Aromatherapy Gift Basket', 'Curated basket with essential oils, candles, and bath salts.', 74.99, 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500', (SELECT id FROM categories WHERE slug = 'other-gifts')),
  ('Crystal Paperweight', 'Stunning handcrafted crystal paperweight. Elegant desk accessory gift.', 34.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500', (SELECT id FROM categories WHERE slug = 'other-gifts'));

-- =============================================
-- Home Decor products
-- =============================================
INSERT INTO products (name, description, price, image_url, category_id) VALUES
  ('Ceramic Vase Set', 'Set of 3 minimalist ceramic vases in earth tones. Modern home decor gift.', 49.99, 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=500', (SELECT id FROM categories WHERE slug = 'home-decor')),
  ('Decorative Throw Pillow Set', 'Set of 2 velvet throw pillows with gold embroidery. Luxurious comfort.', 39.99, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500', (SELECT id FROM categories WHERE slug = 'home-decor')),
  ('LED Fairy String Lights', 'Warm white fairy lights with 100 LEDs. Create magical ambiance anywhere.', 14.99, 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500', (SELECT id FROM categories WHERE slug = 'home-decor')),
  ('Wall Art Canvas Print', 'Abstract floral canvas print on wooden frame. Ready to hang.', 59.99, 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500', (SELECT id FROM categories WHERE slug = 'home-decor')),
  ('Marble Coaster Set', 'Set of 4 natural marble coasters with cork backing. Elegant table decor.', 29.99, 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500', (SELECT id FROM categories WHERE slug = 'home-decor')),
  ('Scented Wax Melts Collection', 'Assorted scented wax melts in a decorative gift tin. 12 fragrances included.', 22.99, 'https://images.unsplash.com/photo-1602607742457-0aa803f4f14d?w=500', (SELECT id FROM categories WHERE slug = 'home-decor'));

-- =============================================
-- Chocolates & Sweets products
-- =============================================
INSERT INTO products (name, description, price, image_url, category_id) VALUES
  ('Luxury Belgian Chocolate Box', 'Assorted Belgian chocolates in an elegant gift box. 24 pieces of pure indulgence.', 44.99, 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500', (SELECT id FROM categories WHERE slug = 'chocolates-sweets')),
  ('Gourmet Truffle Collection', 'Handcrafted gourmet truffles in 6 flavors. Beautifully gift-wrapped.', 34.99, 'https://images.unsplash.com/photo-1548741487-18d363dc4469?w=500', (SELECT id FROM categories WHERE slug = 'chocolates-sweets')),
  ('Assorted Cookie Tin', 'Premium butter cookies in a reusable decorative tin. Classic gift choice.', 24.99, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500', (SELECT id FROM categories WHERE slug = 'chocolates-sweets')),
  ('Dried Fruit & Nut Gift Box', 'Premium selection of dried fruits, nuts, and honey. Healthy gifting option.', 39.99, 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500', (SELECT id FROM categories WHERE slug = 'chocolates-sweets')),
  ('Artisan Honey Gift Set', 'Set of 3 artisan honeys — wildflower, acacia, and cinnamon infused.', 29.99, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500', (SELECT id FROM categories WHERE slug = 'chocolates-sweets')),
  ('Macaron Gift Box', 'Box of 12 French macarons in assorted pastel flavors. Sweet perfection.', 32.99, 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500', (SELECT id FROM categories WHERE slug = 'chocolates-sweets'));

-- =============================================
-- Flowers & Plants products
-- =============================================
INSERT INTO products (name, description, price, image_url, category_id) VALUES
  ('Red Rose Bouquet', 'Classic bouquet of 12 premium red roses. Timeless romantic gift.', 54.99, 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=500', (SELECT id FROM categories WHERE slug = 'flowers-plants')),
  ('Succulent Plant Set', 'Set of 4 mini succulents in decorative pots. Low-maintenance greenery gift.', 34.99, 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=500', (SELECT id FROM categories WHERE slug = 'flowers-plants')),
  ('Lavender Gift Basket', 'Dried lavender arrangement with essential oil and sachets. Calming gift.', 42.99, 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=500', (SELECT id FROM categories WHERE slug = 'flowers-plants')),
  ('Indoor Bonsai Tree', 'Live juniper bonsai tree in ceramic pot. Unique and lasting gift.', 64.99, 'https://images.unsplash.com/photo-1567331711402-509c12c41959?w=500', (SELECT id FROM categories WHERE slug = 'flowers-plants')),
  ('Mixed Tulip Bouquet', 'Colorful tulip bouquet with 15 stems in assorted colors. Spring freshness.', 39.99, 'https://images.unsplash.com/photo-1524386416438-98b9b2d4b433?w=500', (SELECT id FROM categories WHERE slug = 'flowers-plants')),
  ('Orchid in Gift Pot', 'Elegant white orchid in a decorative ceramic pot. Sophisticated gift.', 49.99, 'https://images.unsplash.com/photo-1566873535350-a3f5d4a804b7?w=500', (SELECT id FROM categories WHERE slug = 'flowers-plants'));

-- =============================================
-- Skincare & Beauty products
-- =============================================
INSERT INTO products (name, description, price, image_url, category_id) VALUES
  ('Luxury Skincare Gift Set', 'Complete skincare set with cleanser, toner, serum, and moisturizer.', 89.99, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500', (SELECT id FROM categories WHERE slug = 'skincare-beauty')),
  ('Bath Bomb Collection', 'Set of 8 handmade bath bombs in assorted scents. Relaxation in a box.', 29.99, 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=500', (SELECT id FROM categories WHERE slug = 'skincare-beauty')),
  ('Essential Oil Diffuser Set', 'Ceramic diffuser with 6 essential oils. Create a spa-like atmosphere at home.', 54.99, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500', (SELECT id FROM categories WHERE slug = 'skincare-beauty')),
  ('Handmade Soap Gift Box', 'Set of 6 artisan handmade soaps with natural ingredients. Beautifully wrapped.', 24.99, 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=500', (SELECT id FROM categories WHERE slug = 'skincare-beauty')),
  ('Makeup Brush Set', 'Professional 12-piece makeup brush set in faux leather case. Beauty essential.', 44.99, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500', (SELECT id FROM categories WHERE slug = 'skincare-beauty')),
  ('Rose Quartz Face Roller', 'Natural rose quartz face roller and gua sha set. Self-care gift.', 34.99, 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=500', (SELECT id FROM categories WHERE slug = 'skincare-beauty'));

-- =============================================
-- Toys & Stuffed Animals products
-- =============================================
INSERT INTO products (name, description, price, image_url, category_id) VALUES
  ('Giant Teddy Bear', 'Soft and cuddly 3-foot teddy bear. The ultimate hug-worthy gift.', 49.99, 'https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=500', (SELECT id FROM categories WHERE slug = 'toys-stuffed-animals')),
  ('Stuffed Unicorn Plush', 'Magical rainbow unicorn plush toy with glitter horn. Kids favorite.', 29.99, 'https://images.unsplash.com/photo-1563901935883-cb61f6ef0ef2?w=500', (SELECT id FROM categories WHERE slug = 'toys-stuffed-animals')),
  ('Wooden Puzzle Set', 'Set of 3 handcrafted wooden puzzles in a gift box. Brain-teasing fun.', 34.99, 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=500', (SELECT id FROM categories WHERE slug = 'toys-stuffed-animals')),
  ('Building Blocks Set', 'Creative 200-piece building blocks set in vibrant colors. Spark imagination.', 39.99, 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500', (SELECT id FROM categories WHERE slug = 'toys-stuffed-animals')),
  ('Plush Bunny Rabbit', 'Adorable soft bunny rabbit plush with floppy ears. Sweet gift for all ages.', 24.99, 'https://images.unsplash.com/photo-1585155770913-5f0b0548971d?w=500', (SELECT id FROM categories WHERE slug = 'toys-stuffed-animals')),
  ('Board Game Collection', 'Family board game set with 3 classic games. Perfect for game nights.', 44.99, 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500', (SELECT id FROM categories WHERE slug = 'toys-stuffed-animals'));
