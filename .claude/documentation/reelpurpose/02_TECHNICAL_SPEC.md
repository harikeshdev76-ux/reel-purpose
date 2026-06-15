# Reel Purpose — Technical Specification
# Version 1.0 — June 2026

> ⚠️ STACK: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma + PostgreSQL. NOT NestJS. Single Next.js app with API routes. See below for full stack.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL (via Prisma ORM) |
| ORM | Prisma |
| Auth | NextAuth.js (credentials provider) |
| Payments | Stripe (hosted checkout) |
| Email | Resend |
| Storage | Cloudflare R2 (product images) |
| Hosting | DigitalOcean Droplet (Harikesh's account → transfer to Luca post-launch) |
| Domain | reelpurpose.fishing |
| Process Manager | PM2 |
| Web Server | Nginx (reverse proxy) |

---

## Design System — Marshland

All UI must derive from these tokens. No deviations.

```typescript
// tokens/colors.ts
export const colors = {
  // Backgrounds
  base: '#f5f1ea',        // Off-white page background
  surface: '#ffffff',     // Cards, product cards
  navBg: '#1e2e1a',       // Nav + footer background
  sectionGreen: '#2d5228',// Dark green sections (species strip, footer)

  // Brand
  green: {
    dark: '#1e2e1a',      // Nav, headings on light bg
    mid: '#2d5228',       // Section backgrounds, badges
    light: '#4a7a42',     // Hover states
  },
  rust: '#b8541e',        // Primary CTA buttons, prices, accents
  rustHover: '#9e4518',   // CTA hover state

  // Text
  textPrimary: '#1e2e1a',
  textMuted: 'rgba(30, 46, 26, 0.5)',
  textOnDark: '#f5f1ea',
  textOnDarkMuted: 'rgba(245, 241, 234, 0.5)',

  // Borders
  border: 'rgba(30, 46, 26, 0.08)',
  borderOnDark: 'rgba(245, 241, 234, 0.15)',
}

// tokens/typography.ts
export const typography = {
  display: "'Bebas Neue', sans-serif",     // Headlines, hero, product names
  condensed: "'Barlow Condensed', sans-serif", // Nav, labels, badges, buttons
  body: "'Barlow', sans-serif",            // Body copy, descriptions
}

// Google Fonts to load:
// Bebas Neue
// Barlow Condensed (weights: 400, 600, 700)
// Barlow (weights: 400, 500)
```

---

## Project Structure

```
reel-purpose/
├── src/
│   ├── app/
│   │   ├── layout.tsx                        # Root layout — fonts, nav, footer
│   │   ├── page.tsx                          # Homepage
│   │   ├── shop/
│   │   │   └── page.tsx                      # Product catalog (species/type filter)
│   │   ├── product/
│   │   │   └── [slug]/
│   │   │       └── page.tsx                  # Product detail
│   │   ├── cart/
│   │   │   └── page.tsx                      # Cart page
│   │   ├── success/
│   │   │   └── page.tsx                      # Post-payment confirmation
│   │   ├── admin/
│   │   │   ├── page.tsx                      # Admin login
│   │   │   └── (panel)/
│   │   │       ├── layout.tsx                # Admin shell (sidebar, auth guard)
│   │   │       ├── dashboard/
│   │   │       │   └── page.tsx              # Dashboard overview
│   │   │       ├── products/
│   │   │       │   ├── page.tsx              # Products list
│   │   │       │   ├── new/
│   │   │       │   │   └── page.tsx          # Add product
│   │   │       │   └── [id]/
│   │   │       │       └── page.tsx          # Edit product
│   │   │       ├── orders/
│   │   │       │   ├── page.tsx              # Orders list
│   │   │       │   └── [id]/
│   │   │       │       └── page.tsx          # Order detail
│   │   │       ├── vendors/
│   │   │       │   └── page.tsx              # Vendor payment tracking
│   │   │       └── tax/
│   │   │           └── page.tsx              # Florida sales tax summary
│   │   └── api/
│   │       ├── stripe/
│   │       │   ├── checkout/
│   │       │   │   └── route.ts              # Create Stripe checkout session
│   │       │   └── webhook/
│   │       │       └── route.ts              # Handle payment confirmation
│   │       ├── upload/
│   │       │   └── route.ts                  # Upload product image to R2
│   │       └── admin/
│   │           ├── products/
│   │           │   └── route.ts              # CRUD products
│   │           ├── orders/
│   │           │   └── route.ts              # List + update orders
│   │           └── vendors/
│   │               └── route.ts              # Vendor payment tracking
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── shop/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── SpeciesFilter.tsx
│   │   │   └── SizeSelector.tsx
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx
│   │   │   └── CartItem.tsx
│   │   └── admin/
│   │       ├── Sidebar.tsx
│   │       ├── StatCard.tsx
│   │       └── OrderTable.tsx
│   └── lib/
│       ├── prisma.ts                         # Prisma client singleton
│       ├── stripe.ts                         # Stripe client
│       ├── resend.ts                         # Resend client
│       ├── r2.ts                             # Cloudflare R2 client (AWS SDK v3)
│       ├── tax.ts                            # FL tax calculation (7%)
│       └── auth.ts                           # NextAuth config
├── prisma/
│   └── schema.prisma
├── public/
│   └── logo.png                              # Reel Purpose logo
├── .env
└── package.json
```

---

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String
  species     Species
  type        ProductType
  price       Int      // Cents (e.g. 3800 = $38.00)
  sizes       Size[]
  imageUrl    String
  featured    Boolean  @default(false)
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  orderItems  OrderItem[]
}

model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique // e.g. RP-2026-0001
  stripeSessionId String      @unique
  customerName    String
  customerEmail   String
  shippingAddress Json        // { line1, line2, city, state, zip, country }
  subtotal        Int         // Cents — before tax
  taxAmount       Int         // Cents — 7% of subtotal
  total           Int         // Cents — subtotal + tax
  status          OrderStatus @default(PENDING)
  vendorPaid      Boolean     @default(false)
  vendorCost      Int?        // Cents — optional, entered manually by admin
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  items           OrderItem[]
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  size      Size
  quantity  Int     @default(1)
  price     Int     // Cents — snapshot at time of purchase
  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}

model AdminUser {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String   // bcrypt hashed
  createdAt DateTime @default(now())
}

enum Species {
  TARPON
  SNOOK
  REDFISH
  TUNA_MAHI
  BASS
  COMING_SOON
}

enum ProductType {
  TSHIRT
  HAT
  ACCESSORY
}

enum Size {
  S
  M
  L
  XL
  XXL
  ONE_SIZE
}

enum OrderStatus {
  PENDING
  FULFILLED
  SHIPPED
}
```

---

## API Routes

### POST /api/stripe/checkout

Creates a Stripe hosted checkout session.

```typescript
// Request body
{
  items: Array<{
    productId: string
    size: string
    quantity: number
  }>
}

// Process:
// 1. Load products from DB by productId
// 2. Calculate subtotal
// 3. Calculate FL tax (7%)
// 4. Create Stripe checkout session with line items + tax line item
// 5. Store pending order in DB
// 6. Return { checkoutUrl }
```

### POST /api/stripe/webhook

Handles `checkout.session.completed` event.

```typescript
// Process:
// 1. Verify Stripe webhook signature
// 2. Extract metadata (orderId)
// 3. Update order status: PENDING → FULFILLED
// 4. Send customer confirmation email (Resend)
// 5. Send vendor notification email (Resend)
```

### POST /api/upload

Uploads product image to Cloudflare R2.

```typescript
// Request: multipart/form-data with image file
// Process:
// 1. Validate file type (jpg, png, webp) and size (max 5MB)
// 2. Generate unique key: products/{cuid()}.{ext}
// 3. Upload to R2 bucket
// 4. Return { url } — public R2 URL
```

---

## Email Templates

### Customer Order Confirmation (Resend)

```typescript
// src/lib/emails/OrderConfirmation.tsx
// Subject: "Your Reel Purpose order is confirmed! 🎣"
// From: orders@reelpurpose.fishing
// Content:
// - Order number
// - Items ordered (name, size, qty, price)
// - Subtotal, tax, total
// - Shipping address
// - "Your order is being prepared and will ship soon."
```

### Vendor Order Notification (Resend)

```typescript
// src/lib/emails/VendorNotification.tsx
// Subject: "New Reel Purpose Order — RP-2026-XXXX"
// From: orders@reelpurpose.fishing
// To: VENDOR_EMAIL (from env)
// Content:
// - Order number + date
// - SHIP TO: customer name + full shipping address
// - Items: product name, size, quantity
// - Plain text format preferred for vendor readability
```

---

## Tax Calculation

```typescript
// src/lib/tax.ts
export const FL_TAX_RATE = 0.07 // 6% state + 1% county surtax

export function calculateTax(subtotalCents: number): number {
  return Math.round(subtotalCents * FL_TAX_RATE)
}

export function calculateTotal(subtotalCents: number): {
  subtotal: number
  tax: number
  total: number
} {
  const tax = calculateTax(subtotalCents)
  return {
    subtotal: subtotalCents,
    tax,
    total: subtotalCents + tax,
  }
}
```

---

## Cloudflare R2 Setup

```typescript
// src/lib/r2.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function uploadToR2(
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: file,
    ContentType: contentType,
  }))
  return `${process.env.R2_PUBLIC_URL}/${key}`
}
```

---

## Auth (NextAuth)

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.adminUser.findUnique({
          where: { email: credentials?.email }
        })
        if (!user) return null
        const valid = await bcrypt.compare(credentials?.password!, user.password)
        if (!valid) return null
        return { id: user.id, name: user.name, email: user.email }
      }
    })
  ],
  pages: { signIn: '/admin' },
  secret: process.env.NEXTAUTH_SECRET,
}
```

---

## DigitalOcean Server Setup

```bash
# Ubuntu 22.04 — 2GB RAM / 1 vCPU — $12/mo — New York region
# Under Harikesh's account → transfer to Luca credentials post-launch

apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx
npm install -g pm2

# Clone repo
git clone https://github.com/GITHUB_USERNAME/reel-purpose.git
cd reel-purpose
npm install
npx prisma migrate deploy
npm run build
pm2 start npm --name "reel-purpose" -- start
pm2 save && pm2 startup

# Nginx config → reverse proxy to port 3000
# SSL via certbot (Let's Encrypt)
```

---

## Package Dependencies

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "typescript": "5.x",
    "tailwindcss": "3.x",
    "@prisma/client": "latest",
    "prisma": "latest",
    "next-auth": "latest",
    "bcryptjs": "latest",
    "stripe": "latest",
    "@stripe/stripe-js": "latest",
    "resend": "latest",
    "@aws-sdk/client-s3": "latest",
    "@react-email/components": "latest",
    "cuid": "latest"
  },
  "devDependencies": {
    "@types/bcryptjs": "latest",
    "@types/node": "latest",
    "@types/react": "latest"
  }
}
```

---

## Security Notes

- All API keys server-side only (never in client bundles)
- Stripe webhook signature verified on every webhook call
- Admin routes protected via NextAuth session middleware
- Passwords hashed with bcryptjs (salt rounds: 12)
- R2 bucket: public read for product images, private write (server only)
- No secrets in git — `.env` in `.gitignore`