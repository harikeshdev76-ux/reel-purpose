# Reel Purpose — API Keys & Integration Reference
# Version 1.0 — June 2026

---

## Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=https://reelpurpose.fishing

# Database
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/reelpurpose

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=        # ⏳ Pending — Mike setting up account
STRIPE_SECRET_KEY=                         # ⏳ Pending — Mike setting up account
STRIPE_WEBHOOK_SECRET=                     # ⏳ Pending — set after deployment

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=                     # From Cloudflare dashboard
R2_ACCESS_KEY_ID=                          # R2 API token
R2_SECRET_ACCESS_KEY=                      # R2 API token secret
R2_BUCKET_NAME=reel-purpose-products
R2_PUBLIC_URL=                             # e.g. https://pub-xxxx.r2.dev

# Resend
RESEND_API_KEY=                            # From resend.com dashboard
RESEND_FROM_EMAIL=orders@reelpurpose.fishing

# Vendor
VENDOR_EMAIL=                              # ⏳ Pending — Mike to confirm vendor email

# Auth
NEXTAUTH_SECRET=                           # Generate: openssl rand -base64 32
NEXTAUTH_URL=https://reelpurpose.fishing

# Tax
NEXT_PUBLIC_FL_TAX_RATE=0.07              # 6% state + 1% county surtax — do not change
```

---

## Stripe Integration

### Checkout Flow

```typescript
// src/lib/stripe.ts
import Stripe from 'stripe'
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// POST /api/stripe/checkout
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [
    // Product line items (one per cart item)
    ...items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.product.name} — ${item.size}`,
          images: [item.product.imageUrl],
        },
        unit_amount: item.product.price, // Cents
      },
      quantity: item.quantity,
    })),
    // Florida sales tax line item
    {
      price_data: {
        currency: 'usd',
        product_data: { name: 'Florida Sales Tax (7%)' },
        unit_amount: taxAmount,
      },
      quantity: 1,
    }
  ],
  mode: 'payment',
  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?order={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
  metadata: {
    orderId: pendingOrder.id,
  },
  shipping_address_collection: {
    allowed_countries: ['US'],
  },
})
```

### Webhook Setup (After Deployment)
1. stripe.com → Developers → Webhooks → Add endpoint
2. URL: `https://reelpurpose.fishing/api/stripe/webhook`
3. Event to listen for: `checkout.session.completed`
4. Copy signing secret → set as `STRIPE_WEBHOOK_SECRET` in `.env`

### Webhook Handler

```typescript
// POST /api/stripe/webhook
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'

const sig = headers().get('stripe-signature')!
const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)

if (event.type === 'checkout.session.completed') {
  const session = event.data.object
  const orderId = session.metadata?.orderId

  // 1. Update order status to FULFILLED in DB
  // 2. Save customer shipping address from session.shipping_details
  // 3. Send customer confirmation email
  // 4. Send vendor notification email
}
```

---

## Resend Integration

```typescript
// src/lib/resend.ts
import { Resend } from 'resend'
export const resend = new Resend(process.env.RESEND_API_KEY)

// Send customer confirmation
await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL!,
  to: customerEmail,
  subject: `Your Reel Purpose order is confirmed! 🎣`,
  react: OrderConfirmationEmail({ order }),
})

// Send vendor notification
await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL!,
  to: process.env.VENDOR_EMAIL!,
  subject: `New Reel Purpose Order — ${order.orderNumber}`,
  react: VendorNotificationEmail({ order }),
})
```

### DNS Setup for Resend
1. resend.com → Domains → Add domain → reelpurpose.fishing
2. Add the provided DNS records (SPF, DKIM) to domain DNS
3. Verify domain in Resend dashboard before first send

---

## Cloudflare R2 Integration

### Bucket Setup
1. Cloudflare dashboard → R2 → Create bucket → Name: `reel-purpose-products`
2. Settings → Public access → Enable (for product image URLs)
3. Manage R2 API Tokens → Create token with Object Read & Write on this bucket
4. Copy Account ID, Access Key ID, Secret Access Key → paste into `.env`
5. Copy the public bucket URL (e.g. `https://pub-xxxx.r2.dev`) → set as `R2_PUBLIC_URL`

### Image Key Convention
```
products/{cuid}.{ext}
// e.g. products/clx4k2j0000001abc.jpg
```

---

## Admin Credentials (Set at Launch)

| User | Email | Password |
|------|-------|----------|
| Mike | ⏳ Confirm with Mike | ⏳ Set before launch |
| Luca | ⏳ Confirm with Mike | ⏳ Set before launch |

Passwords hashed with bcryptjs before storing in DB. Use seed script to create admin users:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = (pw: string) => bcrypt.hash(pw, 12)

  await prisma.adminUser.createMany({
    data: [
      { name: 'Mike', email: 'MIKE_EMAIL', password: await hash('MIKE_PASSWORD') },
      { name: 'Luca', email: 'LUCA_EMAIL', password: await hash('LUCA_PASSWORD') },
    ]
  })
}

main()
```

---

## Items Pending from Mike

| Item | Status |
|------|--------|
| Stripe account created + API keys | ⏳ Pending — Mike setting up in the morning |
| Vendor email address | ⏳ Pending — Mike to confirm |
| Fish species logo variations (Tarpon, Snook, Redfish, etc.) | ⏳ Pending — Being designed |
| Product photos | ⏳ Using placeholders at launch — swap in later |
| Mike admin email + desired password | ⏳ Confirm before launch |
| Luca admin email + desired password | ⏳ Confirm before launch |
| Stripe webhook secret | ⏳ Set after deployment |