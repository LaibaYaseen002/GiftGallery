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

**Phase 1 complete (Features 1-15). Phase 2: Admin Panel Enhancement begins below.**

---

### 15. Phase 2: Admin Panel Enhancement Plan

The initial 15 features focused on the **customer-facing** side of the store. Phase 2 builds a **complete admin management system** so the website owner can manage every aspect of the business from a dedicated admin panel.

#### Current Admin Gaps
- No admin-specific layout or sidebar (admin pages look like regular pages)
- No client-side protection (any logged-in user can see admin UI, API blocks them but UX is poor)
- No category management (categories can't be added/edited/deleted)
- No customer/user management (can't see who signed up, their activity)
- No review moderation (can't remove inappropriate reviews)
- No admin notifications (owner doesn't know when new orders/returns arrive)
- No order detail view for admin (can only change status, not see full info)
- Basic analytics only (no charts, no date filters, no breakdowns)

---

#### Feature 16: Admin Layout & Route Protection
**Branch:** `feature-admin-layout`

**What it does:** Creates a dedicated admin panel layout with sidebar navigation, admin role verification on the frontend, and a professional admin experience separate from the customer-facing store.

**Backend:**
- No new routes needed (uses existing Clerk role check)

**Frontend:**
- `frontend/src/app/admin/layout.tsx` — Admin layout wrapper with:
  - Sidebar navigation (Dashboard, Orders, Products, Categories, Customers, Reviews, Returns, Discounts, Feedback, Settings)
  - Active link highlighting
  - Collapsible sidebar on mobile (hamburger toggle)
  - Admin header bar with admin name, role badge, and "View Store" link back to main site
- `frontend/src/components/admin/AdminGuard.tsx` — Client-side role check component:
  - Checks `user?.publicMetadata?.role === "admin"` on mount
  - Shows loading spinner while checking
  - Redirects non-admin users to home page (`/`) with a toast/message
  - Wraps the admin layout so ALL admin pages are protected
- `frontend/src/components/admin/AdminSidebar.tsx` — Sidebar component with:
  - Navigation links with icons (SVG)
  - Unread count badges on Orders (pending), Returns (pending), Feedback (unread)
  - Collapsible on mobile
- Update `frontend/src/components/layout/Navbar.tsx`:
  - Hide main Navbar on `/admin/*` routes (admin has its own header)

**Pages affected:**
- All existing `/admin/*` pages will inherit the new layout
- No functional changes to existing admin pages, just wrapped in new layout

---

#### Feature 17: Category Management
**Branch:** `feature-admin-categories`

**What it does:** Allows admin to create, edit, and delete product categories from the admin panel.

**Database:**
- No new tables (uses existing `categories` table)

**Backend — New routes in `routes/categories.ts`:**
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/categories` | Create new category | Admin |
| PUT | `/api/categories/:id` | Update category (name, slug, image) | Admin |
| DELETE | `/api/categories/:id` | Delete category (only if no products linked) | Admin |

**Frontend:**
- `frontend/src/app/admin/categories/page.tsx` — Category management page:
  - List all categories with image, name, slug, product count
  - "Add Category" button opens modal with form (name, slug auto-generated, image URL)
  - Edit button on each category opens form modal
  - Delete button with confirmation (blocked if category has products)
- `frontend/src/components/admin/CategoryForm.tsx` — Create/edit category form:
  - Name input (slug auto-generated from name)
  - Image URL input with live preview
  - Validation

**API client updates:**
- `categoriesApi.create(data)`, `categoriesApi.update(id, data)`, `categoriesApi.delete(id)`

---

#### Feature 18: Enhanced Order Management
**Branch:** `feature-admin-orders-enhanced`

**What it does:** Gives admin full visibility into each order with complete details, order timeline, admin notes, and status change history.

**Database — Migration:**
- Add `admin_notes` column to `orders` table (text, nullable)
- Add `status_history` table:

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default uuid |
| order_id | uuid | FK -> orders.id |
| old_status | varchar(50) | NOT NULL |
| new_status | varchar(50) | NOT NULL |
| changed_by | varchar(200) | NOT NULL (admin Clerk ID) |
| note | text | NULLABLE |
| created_at | timestamptz | default now() |

**Backend — Updated routes in `routes/orders.ts`:**
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/orders/admin/:id` | Get full order detail (items, customer, history) | Admin |
| PATCH | `/api/orders/:id/status` | Update status + log history + optional note | Admin |
| PATCH | `/api/orders/:id/notes` | Add/update admin notes | Admin |

- On status change: insert into `status_history` table (no email to customer)

**Frontend:**
- `frontend/src/app/admin/orders/[id]/page.tsx` — Admin order detail page:
  - Customer info section (name, email, phone, address)
  - Order items list with images, quantities, prices
  - Gift message display (if any)
  - Discount code & amount applied
  - Order status with dropdown to update
  - Status change history timeline (who changed what, when)
  - Admin notes textarea (internal notes, not visible to customer)
- Update `frontend/src/app/admin/orders/page.tsx`:
  - Each order row is now clickable → navigates to order detail
  - Add order total, item count columns
  - Add date range filter

---

#### Feature 19: Customer Management
**Branch:** `feature-admin-customers`

**What it does:** Allows admin to view all registered customers, their order history, spending stats, and activity.

**Backend — New route file `routes/customers.ts`:**
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/admin/customers` | Get all customers (aggregated from orders + Clerk) | Admin |
| GET | `/api/admin/customers/:userId` | Get customer detail (orders, spending, returns) | Admin |

**Implementation approach:**
- Query unique `user_id` values from `orders` table
- For each, aggregate: total orders, total spent, last order date
- Fetch user details (name, email, avatar) from Clerk API using `clerkClient.users.getUser()`
- Support search by name/email, sort by spending/orders/date

**Frontend:**
- `frontend/src/app/admin/customers/page.tsx` — Customer list:
  - Table with: avatar, name, email, total orders, total spent, member since, last order
  - Search by name or email
  - Sort by columns
  - Click row → customer detail page
- `frontend/src/app/admin/customers/[userId]/page.tsx` — Customer detail:
  - Profile card (name, email, avatar, member since from Clerk)
  - Stats: total orders, total spent, average order value
  - Full order history table
  - Return requests by this customer
  - Reviews by this customer

---

#### Feature 20: Review Moderation
**Branch:** `feature-admin-reviews`

**What it does:** Allows admin to view all reviews across all products, monitor ratings, and delete inappropriate or spam reviews.

**Backend — Updated routes in `routes/reviews.ts`:**
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/reviews/admin` | Get all reviews (with product info, sortable) | Admin |
| DELETE | `/api/reviews/admin/:id` | Delete any review (moderation) | Admin |

- Admin GET returns reviews joined with product name and image
- Support filtering by rating (1-5), sorting by date/rating
- Return stats: total reviews, average rating, rating distribution

**Frontend:**
- `frontend/src/app/admin/reviews/page.tsx` — Review moderation page:
  - Stats bar: total reviews, average rating, rating distribution (5-star: X%, 4-star: X%, etc.)
  - Filter tabs: All, 5-star, 4-star, 3-star, 2-star, 1-star
  - Review list with: product image/name, reviewer name, rating stars, comment, date
  - Delete button with confirmation modal on each review
  - Link to product page for context
- Update admin sidebar to include "Reviews" link

---

#### Feature 21: Enhanced Analytics Dashboard
**Branch:** `feature-admin-analytics`

**What it does:** Upgrades the admin dashboard with visual charts, date range filtering, category breakdowns, and a recent activity feed showing real-time business events.

**Backend — Updated `routes/analytics.ts`:**
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/admin/analytics` | Enhanced stats with date range support | Admin |
| GET | `/api/admin/analytics/chart` | Revenue & orders data for chart (last 7/30 days) | Admin |
| GET | `/api/admin/analytics/categories` | Sales breakdown by category | Admin |
| GET | `/api/admin/analytics/activity` | Recent activity feed (last 20 events) | Admin |

**Chart data endpoint:**
- Query params: `?period=7d` or `?period=30d`
- Returns: array of `{ date, revenue, orders }` grouped by day
- Used for bar chart on dashboard

**Category breakdown endpoint:**
- Returns: `{ category_name, total_orders, total_revenue, product_count }` for each category

**Activity feed endpoint:**
- Combines recent events from multiple tables:
  - New orders (from `orders` table, last 20)
  - New return requests (from `return_requests`)
  - New feedback (from `feedback`)
  - New reviews (from `reviews`)
- Each event has: type, message, timestamp
- Sorted by timestamp descending

**Frontend — Updated `frontend/src/app/admin/page.tsx`:**
- **Stats row:** Total revenue, orders, customers, products (existing, enhanced with % change)
- **Revenue chart:** Simple CSS-based bar chart (no chart library needed):
  - Horizontal bars showing daily revenue for last 7 or 30 days
  - Toggle between 7-day and 30-day views
- **Category breakdown:** Table showing revenue per category with visual bars
- **Recent activity feed:** Scrollable list of recent business events:
  - "New order #ABC from John — Rs. 2,500" (with timestamp)
  - "New return request for order #DEF"
  - "New feedback from user@email.com"
  - "New 5-star review on Gold Pearl Necklace"
  - Each event has icon, color-coded by type
- **Quick actions:** Cards linking to Orders (pending count), Returns (pending), Feedback (unread)

**Components:**
- `frontend/src/components/admin/RevenueChart.tsx` — CSS bar chart component
- `frontend/src/components/admin/CategoryBreakdown.tsx` — Category sales table
- `frontend/src/components/admin/ActivityFeed.tsx` — Recent events list

---

#### Feature 22: Admin Notifications
**Branch:** `feature-admin-notifications`

**What it does:** Adds a notification system for the admin so the website owner gets alerted about important events — new orders, return requests, feedback, and low-activity warnings.

**Database — New table:**

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default uuid |
| type | varchar(50) | NOT NULL (new_order, new_return, new_feedback, new_review, status_change) |
| title | varchar(200) | NOT NULL |
| message | text | NOT NULL |
| reference_id | uuid | NULLABLE (order_id, return_id, etc.) |
| is_read | boolean | default false |
| created_at | timestamptz | default now() |

**Backend — New route file `routes/notifications.ts`:**
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/admin/notifications` | Get all notifications (paginated) | Admin |
| GET | `/api/admin/notifications/unread-count` | Get unread count | Admin |
| PATCH | `/api/admin/notifications/:id/read` | Mark single as read | Admin |
| PATCH | `/api/admin/notifications/read-all` | Mark all as read | Admin |

**Auto-create notifications when:**
- New order is placed → insert notification (in `routes/orders.ts` POST handler)
- New return request → insert notification (in `routes/returns.ts` POST handler)
- New feedback submitted → insert notification (in `routes/feedback.ts` POST handler)
- New review submitted → insert notification (in `routes/reviews.ts` POST handler)

**Frontend:**
- `frontend/src/components/admin/NotificationBell.tsx` — Bell icon in admin header:
  - Shows unread count badge
  - Click opens dropdown with latest 10 notifications
  - Each notification: icon (by type), title, time ago, click to navigate to relevant page
  - "Mark all as read" button
  - "View all" link to full notifications page
- `frontend/src/app/admin/notifications/page.tsx` — Full notifications page:
  - All notifications with filters (all, unread, by type)
  - Mark as read on click
  - Bulk mark as read

---

### 16. Phase 2 Summary

| # | Branch | Feature | New Pages | New API Routes |
|---|--------|---------|-----------|----------------|
| 16 | `feature-admin-layout` | Admin Layout & Route Protection | layout.tsx, AdminGuard, AdminSidebar | — |
| 17 | `feature-admin-categories` | Category Management | /admin/categories | POST/PUT/DELETE /api/categories |
| 18 | `feature-admin-orders-enhanced` | Enhanced Order Management | /admin/orders/[id] | GET /api/orders/admin/:id, PATCH notes |
| 19 | `feature-admin-customers` | Customer Management | /admin/customers, /admin/customers/[id] | GET /api/admin/customers |
| 20 | `feature-admin-reviews` | Review Moderation | /admin/reviews | GET/DELETE /api/reviews/admin |
| 21 | `feature-admin-analytics` | Enhanced Analytics Dashboard | Updated /admin + chart components | GET chart/categories/activity |
| 22 | `feature-admin-notifications` | Admin Notifications | /admin/notifications + NotificationBell | CRUD /api/admin/notifications |

**Total new:** 7 features, ~8 new pages, ~15 new API routes, 1 new DB table, 1 DB migration

---

**Phase 2 implementation begins with Feature #16 (Admin Layout & Route Protection).**
