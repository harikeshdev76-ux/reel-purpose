# Functional Specification — Reel Purpose E-Commerce
# Version 1.0 — June 2026

> ⚠️ STACK OVERRIDE: This project uses Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma + PostgreSQL. NOT NestJS/React monorepo. Single Next.js app. See `02_TECHNICAL_SPEC.md` for full stack details.

---

## 1. Context & Goal

Reel Purpose (reelpurpose.fishing) is a Florida-based fishing apparel e-commerce brand built for Mike Giallombardo's son Luca. Customers browse fishing-species-themed apparel (T-shirts, hats, accessories), select products, and check out via Stripe. Orders are fulfilled via a drop-ship vendor notified by automated email. Luca and Mike manage everything through an admin panel.

**Business model:** Customer pays via Stripe → vendor email triggered → vendor fulfils and ships directly to customer → Mike/Luca pay vendor manually (tracked in admin).

**Domain:** reelpurpose.fishing
**Communication:** WhatsApp group (Mike, Luca, Harikesh)

---

## 2. Product Model

Products are fishing-species-themed apparel items. Each product belongs to a **species collection** and has a **product type**.

### Species Collections
- Tarpon
- Snook
- Redfish
- Tuna / Mahi
- Bass
- (More coming — "Coming Soon" placeholder at launch)

### Product Types
- T-Shirts
- Hats
- Accessories (future)

### Per Product
- Name, description, species tag, product type
- Price (set by Luca via admin)
- Sizes available (S, M, L, XL, XXL)
- Product image (uploaded via admin, stored in Cloudflare R2)
- Active / inactive toggle

---

## 3. Functional Scope

### In Scope (Launch)
- Homepage with hero + featured collections
- Species-filtered product catalog
- Product detail page (image, description, size picker, add to cart)
- Cart and Stripe checkout
- Order confirmation email to customer (Resend)
- Automated vendor notification email on order (Resend)
- Admin panel for Mike + Luca (product management, order tracking, vendor payment tracking, Florida sales tax tracking)
- Two admin user accounts (Mike + Luca)
- Florida sales tax applied at checkout (7% = 6% state + 1% county surtax)

### Out of Scope (Launch)
- Customer accounts / login
- Returns / refund automation
- Inventory tracking (drop-ship, no stock limits)
- Mobile app
- Vendor API integration (email only for now)
- Multi-vendor support at launch (single vendor)
- Discount codes

---

## 4. User Roles

| Role | Access |
|------|--------|
| **Customer** | Browse products, add to cart, checkout via Stripe, receive order confirmation email |
| **Admin (Mike + Luca)** | Full admin panel — products, orders, vendor tracking, sales tax summary |

---

## 5. Page Structure

```
reelpurpose.fishing/                     ← Homepage
reelpurpose.fishing/shop                 ← Full product catalog (filterable by species)
reelpurpose.fishing/product/[slug]       ← Product detail page
reelpurpose.fishing/cart                 ← Cart
reelpurpose.fishing/checkout             ← Stripe checkout redirect
reelpurpose.fishing/success              ← Post-payment confirmation page
reelpurpose.fishing/admin                ← Admin login
reelpurpose.fishing/admin/dashboard      ← Admin dashboard
reelpurpose.fishing/admin/products       ← Product management
reelpurpose.fishing/admin/products/new   ← Add new product
reelpurpose.fishing/admin/products/[id]  ← Edit product
reelpurpose.fishing/admin/orders         ← Order list
reelpurpose.fishing/admin/orders/[id]    ← Order detail
reelpurpose.fishing/admin/vendors        ← Vendor payment tracking
reelpurpose.fishing/admin/tax            ← Florida sales tax summary
```

---

## 6. User Flows

### 6.1 Customer — Browse & Purchase
```
1. Customer visits reelpurpose.fishing
2. Hero section with brand statement + CTA ("Shop Now")
3. Species collection grid — clicks a species (e.g. Tarpon)
4. Filtered product catalog shows Tarpon apparel
5. Clicks a product → product detail page
6. Selects size → clicks "Add to Cart"
7. Views cart → clicks "Checkout"
8. Stripe hosted checkout (name, email, card, shipping)
9. Payment confirmed → success page
10. Customer receives order confirmation email (Resend)
11. Vendor receives order notification email (Resend) with full order details
```

### 6.2 Admin — Product Management (Luca)
```
1. Luca visits reelpurpose.fishing/admin → logs in
2. Dashboard shows today's orders, revenue, vendor amount owed
3. Goes to Products → clicks "Add New Product"
4. Fills in: name, description, species, type, price, sizes, uploads photo
5. Saves → product goes live on site immediately
6. Can edit/deactivate any product from the list
```

### 6.3 Admin — Order Management
```
1. Admin visits Orders tab
2. Sees all orders: customer name, items, total, date, status
3. Can click into an order for full detail (customer email, shipping address, items, Stripe payment ID)
4. Order statuses: Pending → Fulfilled → Shipped (manually updated by Luca)
```

### 6.4 Admin — Vendor Payment Tracking
```
1. Admin visits Vendors tab
2. Sees running total owed to vendor (sum of orders not yet paid to vendor)
3. Table shows each order: date, items, customer total, vendor cost (if set), status
4. Luca marks orders as "Paid to Vendor" after manual bank transfer
5. Running balance updates accordingly
```

### 6.5 Admin — Florida Sales Tax
```
1. Admin visits Tax tab
2. Sees tax collected per order (7% of subtotal)
3. Running total of tax collected in current period
4. Can filter by date range (month, quarter, custom)
5. Used by Mike to remit tax to Florida Department of Revenue
```

---

## 7. Functional Requirements

### 7.1 Homepage

| ID | Requirement |
|----|-------------|
| HOME-01 | Hero section with brand headline, subheadline, and "Shop Now" CTA |
| HOME-02 | Reel Purpose logo in nav — links to homepage |
| HOME-03 | Species collection grid (Tarpon, Snook, Redfish, Tuna/Mahi, Bass, Coming Soon) |
| HOME-04 | Each species card navigates to /shop?species=X |
| HOME-05 | Featured products section (3–4 products, manually curated via admin toggle) |
| HOME-06 | Brand story section ("Built For The Tide" — brief brand statement) |
| HOME-07 | Footer with contact info, nav links |

### 7.2 Shop / Catalog

| ID | Requirement |
|----|-------------|
| SHOP-01 | Filterable by species (Tarpon, Snook, Redfish, Tuna/Mahi, Bass) |
| SHOP-02 | Filterable by product type (T-Shirts, Hats) |
| SHOP-03 | Shows only active products |
| SHOP-04 | Product card: image, name, price, species tag |
| SHOP-05 | Click product card → product detail page |

### 7.3 Product Detail

| ID | Requirement |
|----|-------------|
| PROD-01 | Product image (full size from R2) |
| PROD-02 | Name, description, species tag, product type |
| PROD-03 | Price displayed |
| PROD-04 | Size selector (only sizes marked available for that product) |
| PROD-05 | "Add to Cart" button — disabled until size selected |
| PROD-06 | Cart updates in header (badge count) |

### 7.4 Cart & Checkout

| ID | Requirement |
|----|-------------|
| CART-01 | Cart persists in localStorage |
| CART-02 | Cart shows items, sizes, quantities, subtotal |
| CART-03 | Can remove items from cart |
| CART-04 | Florida sales tax (7%) calculated and shown before checkout |
| CART-05 | "Checkout" button triggers Stripe hosted checkout |
| CART-06 | Stripe collects: name, email, shipping address, card |
| CART-07 | On payment success: webhook fires → order saved to DB |

### 7.5 Emails

| ID | Requirement |
|----|-------------|
| EMAIL-01 | Customer order confirmation email sent via Resend after payment |
| EMAIL-02 | Customer email includes: order number, items, sizes, total, estimated shipping info |
| EMAIL-03 | Vendor notification email sent via Resend after payment |
| EMAIL-04 | Vendor email includes: order number, customer shipping address, items ordered, sizes, quantities |
| EMAIL-05 | Vendor email address configurable in admin settings |

### 7.6 Admin — Products

| ID | Requirement |
|----|-------------|
| ADM-PROD-01 | Add new product: name, description, species, type, price, sizes, photo upload |
| ADM-PROD-02 | Photo uploaded to Cloudflare R2, URL saved in DB |
| ADM-PROD-03 | Edit any product field |
| ADM-PROD-04 | Toggle product active/inactive |
| ADM-PROD-05 | Delete product (soft delete — keeps order history intact) |
| ADM-PROD-06 | Mark product as "Featured" (shows on homepage featured section) |

### 7.7 Admin — Orders

| ID | Requirement |
|----|-------------|
| ADM-ORD-01 | List all orders: order number, customer name, items, total, date, status |
| ADM-ORD-02 | Filter orders by status (Pending / Fulfilled / Shipped) |
| ADM-ORD-03 | Filter orders by date range |
| ADM-ORD-04 | Order detail: customer email, shipping address, items, sizes, Stripe payment ID |
| ADM-ORD-05 | Manually update order status |

### 7.8 Admin — Vendor Payment Tracking

| ID | Requirement |
|----|-------------|
| ADM-VEN-01 | Running total of amount owed to vendor (all unfulfilled vendor payments) |
| ADM-VEN-02 | Per-order vendor cost field (optional — Luca can enter cost to vendor per order) |
| ADM-VEN-03 | Mark order as "Paid to Vendor" — removes from outstanding balance |
| ADM-VEN-04 | Vendor email address setting (used for order notification emails) |

### 7.9 Admin — Florida Sales Tax

| ID | Requirement |
|----|-------------|
| ADM-TAX-01 | Tax rate: 7% (hardcoded — 6% state + 1% county surtax) |
| ADM-TAX-02 | Tax collected per order stored in DB at time of purchase |
| ADM-TAX-03 | Tax summary view: total tax collected, filterable by date range |
| ADM-TAX-04 | Running total for current calendar month shown on dashboard |

### 7.10 Admin — Auth

| ID | Requirement |
|----|-------------|
| ADM-AUTH-01 | Two admin accounts: Mike and Luca |
| ADM-AUTH-02 | Login via email + password (NextAuth credentials provider) |
| ADM-AUTH-03 | Session persists via NextAuth JWT cookie |
| ADM-AUTH-04 | All /admin/* routes protected — redirect to /admin login if unauthenticated |

---

## 8. Open Questions

1. Vendor email address — what is it? ⏳ (Ask Mike via WhatsApp)
2. Vendor cost per item — does Mike want to track per-item cost or per-order cost? ⏳
3. Product photos — are they being shot/designed, or sourced from vendor catalog? ⏳ (Placeholders at launch)
4. Admin credentials — what email/password does Mike want for his account? ⏳
5. Shipping policy — does the site need a shipping info page or footer note? ⏳