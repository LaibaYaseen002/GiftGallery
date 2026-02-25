# Gift Gallery - Online E-commerce Store

## Development Plan

---

### 1. Project Overview

A functional online gift and accessories store where users can browse products, search and filter by category, add items to cart or wishlist, place orders with optional gift messages, track order status, leave reviews, and apply discount codes. Users can submit feedback and request returns. Admins can manage products, view analytics reports, handle returns, and manage discount codes. Email confirmations are sent after checkout.

**SRS/SDD Reference:** This plan implements requirements from the Gift Gallery SRS (73 pages) and SDD (77 pages) documents, adapted to a modern tech stack.

---

### 2. Tech Stack

| Layer          | Technology             |
| -------------- | ---------------------- |
| Frontend       | Next.js 14 (App Router), TypeScript, TailwindCSS |
| Backend        | Node.js, Express.js    |
| Database       | Supabase (PostgreSQL)  |
| Authentication | Clerk                  |
| Email Service  | Resend                 |
| Version Control| GitHub                 |

---

### 3. Color Scheme (Gift Store Theme)

| Token          | Color       | Hex       | Usage                        |
| -------------- | ----------- | --------- | ---------------------------- |
| Primary        | Rose Gold   | `#B76E79` | Buttons, links, accents      |
| Primary Dark   | Deep Rose   | `#9A4C5A` | Hover states, active         |
| Secondary      | Warm Cream  | `#FFF8F0` | Page backgrounds             |
| Accent         | Soft Gold   | `#D4A853` | Badges, highlights, stars    |
| Dark           | Charcoal    | `#2D2D2D` | Text, headings               |
| Medium         | Warm Gray   | `#6B6B6B` | Secondary text               |
| Light          | Pearl White | `#FAF5F0` | Cards, sections              |
| Border         | Blush       | `#F0E0D6` | Borders, dividers            |
| Success        | Sage Green  | `#6B9E78` | Success messages             |
| Error          | Soft Red    | `#D94F4F` | Error messages               |

---

### 4. Folder Structure

```
gift-gallery-project/
├── frontend/                    # Next.js App
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx              # Root layout (Clerk provider, navbar, footer)
│   │   │   ├── page.tsx                # Home page
│   │   │   ├── globals.css             # Global styles + Tailwind
│   │   │   ├── products/
│   │   │   │   ├── page.tsx            # All products listing
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx        # Single product detail + reviews
│   │   │   ├── category/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx        # Products by category
│   │   │   ├── cart/
│   │   │   │   └── page.tsx            # Cart page
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx            # Checkout page (gift message + discount code)
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx            # User's order history
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx        # Order detail + tracking status
│   │   │   ├── wishlist/
│   │   │   │   └── page.tsx            # User's wishlist
│   │   │   ├── profile/
│   │   │   │   └── page.tsx            # User profile (Clerk managed + order stats)
│   │   │   ├── faq/
│   │   │   │   └── page.tsx            # FAQ & Help page
│   │   │   ├── contact/
│   │   │   │   └── page.tsx            # Feedback / Contact form
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx            # Admin dashboard (analytics overview)
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx        # Admin product list
│   │   │   │   │   └── new/
│   │   │   │   │       └── page.tsx    # Add new product form
│   │   │   │   ├── orders/
│   │   │   │   │   └── page.tsx        # Admin order management (update status)
│   │   │   │   ├── returns/
│   │   │   │   │   └── page.tsx        # Admin return/refund requests
│   │   │   │   ├── discounts/
│   │   │   │   │   └── page.tsx        # Admin discount code management
│   │   │   │   └── feedback/
│   │   │   │       └── page.tsx        # Admin view user feedback
│   │   │   ├── sign-in/
│   │   │   │   └── [[...sign-in]]/
│   │   │   │       └── page.tsx        # Clerk sign-in page
│   │   │   └── sign-up/
│   │   │       └── [[...sign-up]]/
│   │   │           └── page.tsx        # Clerk sign-up page
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── products/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   └── CategoryFilter.tsx
│   │   │   ├── reviews/
│   │   │   │   ├── ReviewForm.tsx       # Submit review + star rating
│   │   │   │   ├── ReviewList.tsx       # Display reviews on product page
│   │   │   │   └── StarRating.tsx       # Reusable star rating display
│   │   │   ├── cart/
│   │   │   │   ├── CartItem.tsx
│   │   │   │   └── CartSummary.tsx
│   │   │   ├── checkout/
│   │   │   │   ├── CheckoutForm.tsx
│   │   │   │   ├── GiftMessageInput.tsx # Optional gift message text field
│   │   │   │   └── DiscountCodeInput.tsx # Apply discount code field
│   │   │   ├── orders/
│   │   │   │   ├── OrderStatusBadge.tsx  # Visual status indicator
│   │   │   │   └── OrderTimeline.tsx     # Order tracking timeline
│   │   │   ├── wishlist/
│   │   │   │   └── WishlistButton.tsx    # Heart icon toggle on product cards
│   │   │   ├── admin/
│   │   │   │   ├── ProductForm.tsx
│   │   │   │   ├── AnalyticsCards.tsx    # Stats cards (total sales, orders, etc.)
│   │   │   │   ├── DiscountForm.tsx      # Create/edit discount code form
│   │   │   │   └── ReturnRequestCard.tsx # Single return request card
│   │   │   └── ui/
│   │   │       ├── Button.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Badge.tsx
│   │   │       ├── Modal.tsx
│   │   │       ├── Textarea.tsx
│   │   │       └── LoadingSpinner.tsx
│   │   ├── lib/
│   │   │   └── api.ts                  # API helper (fetch wrapper to backend)
│   │   ├── context/
│   │   │   └── CartContext.tsx          # Cart state management (React Context)
│   │   └── types/
│   │       └── index.ts                # TypeScript interfaces
│   ├── middleware.ts                    # Clerk auth middleware
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                     # Express.js API
│   ├── src/
│   │   ├── index.ts                    # Express server entry
│   │   ├── routes/
│   │   │   ├── products.ts             # Product CRUD routes
│   │   │   ├── categories.ts           # Category routes
│   │   │   ├── orders.ts               # Order routes (+ status update)
│   │   │   ├── reviews.ts              # Review CRUD routes
│   │   │   ├── wishlist.ts             # Wishlist routes
│   │   │   ├── discounts.ts            # Discount code routes
│   │   │   ├── returns.ts              # Return/refund request routes
│   │   │   ├── feedback.ts             # Feedback/contact form routes
│   │   │   ├── analytics.ts            # Admin analytics routes
│   │   │   └── email.ts                # Email sending route
│   │   ├── middleware/
│   │   │   └── auth.ts                 # Clerk token verification
│   │   ├── services/
│   │   │   ├── supabase.ts             # Supabase client init
│   │   │   └── resend.ts               # Resend client init
│   │   └── types/
│   │       └── index.ts                # Shared types
│   ├── tsconfig.json
│   └── package.json
│
├── docs/
│   ├── SRS.pdf                  # Software Requirements Specification
│   └── SDD.pdf                  # Software Design Document
├── .gitignore
└── README.md                    # This file
```

---

### 5. Supabase Database Tables

#### Table: `categories`
| Column      | Type         | Constraints          |
| ----------- | ------------ | -------------------- |
| id          | uuid         | PK, default uuid     |
| name        | varchar(100) | NOT NULL, UNIQUE     |
| slug        | varchar(100) | NOT NULL, UNIQUE     |
| image_url   | text         | NULLABLE             |
| created_at  | timestamptz  | default now()        |

**Seed Data:** Jewelry, Clothes, Watches, Perfumes, Bags, Other Gifts

#### Table: `products`
| Column       | Type          | Constraints          |
| ------------ | ------------- | -------------------- |
| id           | uuid          | PK, default uuid     |
| name         | varchar(200)  | NOT NULL             |
| description  | text          | NULLABLE             |
| price        | decimal(10,2) | NOT NULL             |
| image_url    | text          | NOT NULL             |
| category_id  | uuid          | FK -> categories.id  |
| in_stock     | boolean       | default true         |
| created_at   | timestamptz   | default now()        |

#### Table: `orders`
| Column          | Type          | Constraints                              |
| --------------- | ------------- | ---------------------------------------- |
| id              | uuid          | PK, default uuid                         |
| user_id         | varchar(200)  | NOT NULL (Clerk ID)                      |
| user_email      | varchar(200)  | NOT NULL                                 |
| total_amount    | decimal(10,2) | NOT NULL                                 |
| discount_code   | varchar(50)   | NULLABLE                                 |
| discount_amount | decimal(10,2) | default 0                                |
| status          | varchar(50)   | default 'pending' (pending -> confirmed -> shipped -> delivered -> cancelled) |
| shipping_name   | varchar(200)  | NOT NULL                                 |
| shipping_address| text          | NOT NULL                                 |
| shipping_city   | varchar(100)  | NOT NULL                                 |
| shipping_phone  | varchar(20)   | NOT NULL                                 |
| gift_message    | text          | NULLABLE                                 |
| created_at      | timestamptz   | default now()                            |
| updated_at      | timestamptz   | default now()                            |

#### Table: `order_items`
| Column      | Type          | Constraints          |
| ----------- | ------------- | -------------------- |
| id          | uuid          | PK, default uuid     |
| order_id    | uuid          | FK -> orders.id      |
| product_id  | uuid          | FK -> products.id    |
| product_name| varchar(200)  | NOT NULL             |
| price       | decimal(10,2) | NOT NULL             |
| quantity    | integer       | NOT NULL, default 1  |

#### Table: `reviews`
| Column      | Type          | Constraints                     |
| ----------- | ------------- | ------------------------------- |
| id          | uuid          | PK, default uuid                |
| product_id  | uuid          | FK -> products.id               |
| user_id     | varchar(200)  | NOT NULL (Clerk ID)             |
| user_name   | varchar(200)  | NOT NULL                        |
| rating      | integer       | NOT NULL, CHECK (1-5)           |
| comment     | text          | NULLABLE                        |
| created_at  | timestamptz   | default now()                   |

**Constraint:** UNIQUE(product_id, user_id) — one review per user per product.

#### Table: `wishlist`
| Column      | Type          | Constraints                     |
| ----------- | ------------- | ------------------------------- |
| id          | uuid          | PK, default uuid                |
| user_id     | varchar(200)  | NOT NULL (Clerk ID)             |
| product_id  | uuid          | FK -> products.id               |
| created_at  | timestamptz   | default now()                   |

**Constraint:** UNIQUE(user_id, product_id) — no duplicate wishlist entries.

#### Table: `discount_codes`
| Column         | Type          | Constraints                  |
| -------------- | ------------- | ---------------------------- |
| id             | uuid          | PK, default uuid             |
| code           | varchar(50)   | NOT NULL, UNIQUE             |
| discount_percent| integer      | NOT NULL, CHECK (1-100)      |
| is_active      | boolean       | default true                 |
| expires_at     | timestamptz   | NULLABLE                     |
| max_uses       | integer       | NULLABLE                     |
| current_uses   | integer       | default 0                    |
| created_at     | timestamptz   | default now()                |

#### Table: `return_requests`
| Column        | Type          | Constraints                              |
| ------------- | ------------- | ---------------------------------------- |
| id            | uuid          | PK, default uuid                         |
| order_id      | uuid          | FK -> orders.id                          |
| user_id       | varchar(200)  | NOT NULL (Clerk ID)                      |
| reason        | text          | NOT NULL                                 |
| status        | varchar(50)   | default 'pending' (pending -> approved -> rejected -> refunded) |
| admin_notes   | text          | NULLABLE                                 |
| created_at    | timestamptz   | default now()                            |
| updated_at    | timestamptz   | default now()                            |

#### Table: `feedback`
| Column      | Type          | Constraints          |
| ----------- | ------------- | -------------------- |
| id          | uuid          | PK, default uuid     |
| user_id     | varchar(200)  | NULLABLE (Clerk ID, guests can submit too) |
| name        | varchar(200)  | NOT NULL             |
| email       | varchar(200)  | NOT NULL             |
| subject     | varchar(200)  | NOT NULL             |
| message     | text          | NOT NULL             |
| is_read     | boolean       | default false        |
| created_at  | timestamptz   | default now()        |

---

### 6. API Routes (Express Backend)

#### Products
| Method | Route                       | Description            | Auth     |
| ------ | --------------------------- | ---------------------- | -------- |
| GET    | `/api/products`             | Get all products (with search & filter) | Public   |
| GET    | `/api/products/:id`         | Get single product     | Public   |
| POST   | `/api/products`             | Create product         | Admin    |
| PUT    | `/api/products/:id`         | Update product         | Admin    |
| DELETE | `/api/products/:id`         | Delete product         | Admin    |

#### Categories
| Method | Route                       | Description            | Auth     |
| ------ | --------------------------- | ---------------------- | -------- |
| GET    | `/api/categories`           | Get all categories     | Public   |
| GET    | `/api/categories/:slug/products` | Get products by category | Public |

#### Orders
| Method | Route                       | Description            | Auth     |
| ------ | --------------------------- | ---------------------- | -------- |
| POST   | `/api/orders`               | Create new order       | User     |
| GET    | `/api/orders`               | Get user's orders      | User     |
| GET    | `/api/orders/:id`           | Get order detail       | User     |
| PATCH  | `/api/orders/:id/status`    | Update order status    | Admin    |
| GET    | `/api/admin/orders`         | Get all orders (admin) | Admin    |

#### Reviews
| Method | Route                       | Description            | Auth     |
| ------ | --------------------------- | ---------------------- | -------- |
| GET    | `/api/products/:id/reviews` | Get reviews for product| Public   |
| POST   | `/api/products/:id/reviews` | Submit a review        | User     |
| DELETE | `/api/reviews/:id`          | Delete own review      | User     |

#### Wishlist
| Method | Route                       | Description            | Auth     |
| ------ | --------------------------- | ---------------------- | -------- |
| GET    | `/api/wishlist`             | Get user's wishlist    | User     |
| POST   | `/api/wishlist`             | Add product to wishlist| User     |
| DELETE | `/api/wishlist/:productId`  | Remove from wishlist   | User     |

#### Discount Codes
| Method | Route                       | Description                 | Auth     |
| ------ | --------------------------- | --------------------------- | -------- |
| POST   | `/api/discounts/validate`   | Validate & apply code       | User     |
| GET    | `/api/admin/discounts`      | Get all discount codes       | Admin    |
| POST   | `/api/admin/discounts`      | Create discount code         | Admin    |
| PUT    | `/api/admin/discounts/:id`  | Update discount code         | Admin    |
| DELETE | `/api/admin/discounts/:id`  | Delete discount code         | Admin    |

#### Returns
| Method | Route                       | Description                 | Auth     |
| ------ | --------------------------- | --------------------------- | -------- |
| POST   | `/api/returns`              | Submit return request        | User     |
| GET    | `/api/returns`              | Get user's return requests   | User     |
| GET    | `/api/admin/returns`        | Get all return requests      | Admin    |
| PATCH  | `/api/admin/returns/:id`    | Update return status         | Admin    |

#### Feedback
| Method | Route                       | Description            | Auth     |
| ------ | --------------------------- | ---------------------- | -------- |
| POST   | `/api/feedback`             | Submit feedback        | Public   |
| GET    | `/api/admin/feedback`       | Get all feedback       | Admin    |
| PATCH  | `/api/admin/feedback/:id`   | Mark as read           | Admin    |

#### Analytics (Admin)
| Method | Route                       | Description                      | Auth     |
| ------ | --------------------------- | -------------------------------- | -------- |
| GET    | `/api/admin/analytics`      | Get dashboard stats (totals, recent orders, top products) | Admin |

#### Email
| Method | Route                       | Description            | Auth     |
| ------ | --------------------------- | ---------------------- | -------- |
| POST   | `/api/email/order-confirmation` | Send confirmation email | Internal |

---

### 7. Frontend Pages

| Page                     | Route                    | Description                                       |
| ------------------------ | ------------------------ | ------------------------------------------------- |
| Home                     | `/`                      | Hero banner, featured products, categories         |
| Products                 | `/products`              | All products grid with search & filter             |
| Product Detail           | `/products/[id]`         | Product info + Add to Cart + Reviews + Wishlist    |
| Category                 | `/category/[slug]`       | Filtered products by category                      |
| Cart                     | `/cart`                  | Cart items, quantity, total                        |
| Checkout                 | `/checkout`              | Shipping form + gift message + discount code + simulated payment |
| Orders                   | `/orders`                | User's order history list                          |
| Order Detail             | `/orders/[id]`           | Order detail + tracking timeline + return request  |
| Wishlist                 | `/wishlist`              | User's saved products                              |
| Profile                  | `/profile`               | User profile info + order stats                    |
| FAQ & Help               | `/faq`                   | Frequently asked questions (accordion style)       |
| Contact / Feedback       | `/contact`               | Contact form for feedback/support                  |
| Admin Dashboard          | `/admin`                 | Analytics: total sales, orders, top products       |
| Admin Products           | `/admin/products`        | Admin product list (edit/delete)                   |
| Admin Add Product        | `/admin/products/new`    | Form to add new product                            |
| Admin Orders             | `/admin/orders`          | All orders list + update status                    |
| Admin Returns            | `/admin/returns`         | Return/refund requests + approve/reject            |
| Admin Discounts          | `/admin/discounts`       | Manage discount codes (create/edit/delete)         |
| Admin Feedback           | `/admin/feedback`        | View user feedback messages                        |
| Sign In                  | `/sign-in`               | Clerk sign-in                                      |
| Sign Up                  | `/sign-up`               | Clerk sign-up                                      |

---

### 8. Reusable Components

| Component              | Purpose                                            |
| ---------------------- | -------------------------------------------------- |
| `Navbar`               | Logo, nav links, cart icon, wishlist icon, user menu |
| `Footer`               | Simple footer with links                            |
| `ProductCard`          | Product thumbnail, name, price, CTA, wishlist heart |
| `ProductGrid`          | Grid wrapper for product cards                      |
| `CategoryFilter`       | Category pills/buttons for filtering                |
| `CartItem`             | Single cart item row with qty controls              |
| `CartSummary`          | Subtotal, discount, total display                   |
| `CheckoutForm`         | Shipping details form                               |
| `GiftMessageInput`     | Optional text area for gift message during checkout |
| `DiscountCodeInput`    | Input + apply button for discount codes             |
| `ReviewForm`           | Star selector + comment textarea for reviews        |
| `ReviewList`           | List of reviews with rating, user, date             |
| `StarRating`           | Reusable star display (filled/empty)                |
| `OrderStatusBadge`     | Colored badge for order status                      |
| `OrderTimeline`        | Visual step-by-step order tracking                  |
| `WishlistButton`       | Heart icon toggle (add/remove from wishlist)        |
| `ProductForm`          | Add/edit product form (admin)                       |
| `AnalyticsCards`       | Stats cards for admin dashboard                     |
| `DiscountForm`         | Create/edit discount code form (admin)              |
| `ReturnRequestCard`    | Single return request with actions (admin)          |
| `Button`               | Reusable styled button                              |
| `Input`                | Reusable styled input                               |
| `Textarea`             | Reusable styled textarea                            |
| `Badge`                | Category/status badge                               |
| `Modal`                | Reusable modal dialog                               |
| `LoadingSpinner`       | Loading indicator                                   |

---

### 9. Integration Details

#### Clerk Authentication
- **Frontend:** `@clerk/nextjs` wraps the app in `<ClerkProvider>`
- **Middleware:** `middleware.ts` protects `/checkout`, `/orders`, `/wishlist`, `/profile`, `/admin/*` routes
- **Backend:** Clerk JWT token sent in `Authorization` header, verified via `@clerk/express`
- **Admin Check:** Admin role checked via Clerk user metadata (`publicMetadata.role === "admin"`)
- **Profile:** Clerk provides name, email, avatar — supplemented with order stats from our DB

#### Supabase
- **Backend only** connects to Supabase (keeps keys server-side)
- Uses `@supabase/supabase-js` client in the Express server
- All CRUD goes through Express API -> Supabase

#### Resend Email
- **Backend only** sends emails via Resend SDK
- Triggered after order creation
- Sends a simple HTML order confirmation email to user (includes gift message if provided)

#### Simulated Payment
- No real payment gateway integration
- Checkout form collects shipping info, validates fields, and simulates a "processing" step
- Order is created immediately in the database after simulated success
- This is standard for university-level projects

---

### 10. Features List & Git Branches

Features will be built in this order:

| #  | Branch                  | Feature                              | Details | SRS Ref |
| -- | ----------------------- | ------------------------------------ | ------- | ------- |
| 1  | `feature-setup`         | Project Setup                        | Initialize frontend + backend, install deps, env files, Tailwind config, folder structure | — |
| 2  | `feature-auth`          | Authentication                       | Clerk setup, sign-in/sign-up pages, middleware, protected routes, admin role check | 3.2.1 |
| 3  | `feature-products`      | Products & Categories                | Supabase tables, seed data, API routes, product listing, product detail, category filter, search | 3.2.2 |
| 4  | `feature-cart`          | Shopping Cart                        | Cart context, add/remove/update qty, cart page, cart icon with count | 3.2.3 |
| 5  | `feature-checkout`      | Checkout & Orders                    | Checkout form, gift message field, discount code input, simulated payment, order creation, order history page | 3.2.4, 3.2.18, 3.2.9 |
| 6  | `feature-email`         | Email Confirmation                   | Resend integration, order confirmation email sent after checkout | 3.2.10 |
| 7  | `feature-reviews`       | Reviews & Ratings                    | Review form on product page, star ratings (1-5), display average rating, one review per user per product | 3.2.5, 3.2.30 |
| 8  | `feature-wishlist`      | Wishlist                             | Heart icon on products, wishlist page, add/remove, move to cart | 3.2.7 |
| 9  | `feature-order-tracking`| Order Tracking                       | Order status flow (pending -> confirmed -> shipped -> delivered), timeline UI, admin status updates | 3.2.6 |
| 10 | `feature-returns`       | Return & Refund Management           | User submits return request with reason, admin approves/rejects, status tracking | 3.2.28 |
| 11 | `feature-discounts`     | Discount Code Management             | Admin creates codes (% off, expiry, max uses), user applies at checkout, validation | 3.2.9, 3.2.27 |
| 12 | `feature-admin`         | Admin Panel & Analytics              | Admin dashboard with stats (total sales, orders, revenue), product management, order management | 3.2.11 |
| 13 | `feature-feedback`      | Feedback, FAQ & Support              | Contact/feedback form (guests + users), FAQ page with accordion, admin feedback inbox | 3.2.14, 3.2.29 |
| 14 | `feature-profile`       | User Profile                         | Profile page showing Clerk info + order stats + recent orders | 3.2.8 |
| 15 | `feature-ui-polish`     | UI Polish & Final Fixes              | Responsive design, loading states, error handling, empty states, final cleanup | 3.5.1-3.5.6 |

---

### 11. Product Images (Free Sources)

Will use royalty-free images from **Unsplash** via direct URLs:
- Jewelry: rings, necklaces, bracelets
- Clothes: shirts, dresses, accessories
- Watches: wristwatches, smartwatches
- Perfumes: perfume bottles
- Bags: handbags, backpacks
- Other Gifts: candles, gift boxes, flowers

---

### 12. Environment Variables Needed

#### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Backend (`backend/.env`)
```
PORT=5000
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=
RESEND_API_KEY=
FRONTEND_URL=http://localhost:3000
```

---

### 13. Development Workflow

1. Create feature branch from `main`
2. Implement the feature
3. Test locally
4. Fix any bugs
5. Commit with clear message
6. Push branch to GitHub
7. Merge into `main`
8. Move to next feature

---

### 14. SRS Requirements Traceability

| SRS Requirement | Feature # | Implementation |
| --- | --- | --- |
| 3.2.1 User Registration & Auth | #2 | Clerk sign-in/sign-up |
| 3.2.2 Product Search & Filtering | #3 | Search bar + category filter |
| 3.2.3 Shopping Cart Management | #4 | React Context cart |
| 3.2.4 Checkout Process | #5 | Simulated checkout form |
| 3.2.5 Review & Rating Submission | #7 | Star ratings + comments |
| 3.2.6 Order Tracking | #9 | Status timeline UI |
| 3.2.7 Wishlist | #8 | Heart toggle + wishlist page |
| 3.2.8 User Profile Management | #14 | Clerk + order stats |
| 3.2.9 Promotions & Discounts | #11 | Discount codes at checkout |
| 3.2.10 Notifications & Alerts | #6 | Email confirmation via Resend |
| 3.2.11 Analytics & Reporting | #12 | Admin dashboard stats |
| 3.2.14 Feedback & Support | #13 | Contact form + admin inbox |
| 3.2.18 Gift Messages | #5 | Text field at checkout (simplified) |
| 3.2.27 Event-Based Discounts | #11 | Discount codes with expiry (simplified) |
| 3.2.28 Return & Refund | #10 | Return request flow |
| 3.2.29 Customer Support & FAQs | #13 | FAQ accordion page |
| 3.2.30 Product Reviews & Ratings | #7 | Reviews on product page |

**Note:** Advanced SRS features (3.2.15-3.2.17, 3.2.19-3.2.26) such as virtual gift wrapping, social shopping, group gifting, and multi-destination checkout are documented in the SRS but are outside the scope of this implementation due to their infrastructure complexity. Simplified alternatives have been implemented where applicable.

---

**Ready to start building. Feature #1 (Project Setup) will be first.**
