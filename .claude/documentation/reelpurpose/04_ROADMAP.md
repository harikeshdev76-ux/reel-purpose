# Reel Purpose — Project Roadmap
# Version 1.0 — June 2026

> **Total Duration:** 2.5–3 Weeks
> **Rate:** $500/week
> **Total:** $1,250–$1,500
> **Deployment:** reelpurpose.fishing (DigitalOcean — Harikesh's account → transfer to Luca post-launch)
> **Communication:** WhatsApp group (Mike, Luca, Harikesh)

---

## Week 1 — Customer-Facing Storefront
**Status: 🔶 IN PROGRESS**

- [ ] Initialize GitHub repo + Next.js 14 project scaffold
- [ ] Configure `.env` template
- [ ] Set up Prisma + PostgreSQL on DigitalOcean droplet
- [ ] Implement Marshland design token system (colors, fonts, spacing)
- [ ] Build Navbar + Footer components
- [ ] Homepage: hero, species collection grid, featured products section, brand story
- [ ] Shop page: product catalog with species + type filters
- [ ] Product detail page: image, description, size selector, add to cart
- [ ] Cart (localStorage): add/remove items, quantity, subtotal, tax display
- [ ] Stripe checkout integration (pending Mike's API keys)
- [ ] Success page: order confirmation display
- [ ] Stripe webhook handler: update order status, trigger emails
- [ ] Customer confirmation email (Resend)
- [ ] Vendor notification email (Resend)
- [ ] Cloudflare R2 setup for product images
- [ ] Placeholder product images for all species categories

---

## Week 2 — Admin Panel
**Status: ⏳ PENDING**

- [ ] Admin login page (/admin) — NextAuth credentials
- [ ] Admin layout with sidebar (Dashboard, Products, Orders, Vendors, Tax)
- [ ] Dashboard: today's orders, revenue, vendor amount owed, tax collected this month
- [ ] Products list: all products with active/inactive status
- [ ] Add product form: name, desc, species, type, price, sizes, photo upload (→ R2)
- [ ] Edit product page
- [ ] Soft delete product (preserves order history)
- [ ] Featured product toggle (for homepage section)
- [ ] Orders list: filterable by status + date range
- [ ] Order detail page: full customer + items info + Stripe payment ID
- [ ] Manual order status update (Pending → Fulfilled → Shipped)
- [ ] Vendors tab: running total owed, per-order vendor cost entry, mark as paid
- [ ] Tax tab: FL tax summary, filter by date range, current month total
- [ ] Two admin user seed (Mike + Luca)

---

## Week 3 — Polish, Testing & Handover
**Status: ⏳ PENDING**

- [ ] Full end-to-end testing (browse → cart → checkout → webhook → emails)
- [ ] Admin panel full walkthrough with Luca
- [ ] Real product photos swapped in (once Mike/Luca provide)
- [ ] Fish species logo variations added (once designed)
- [ ] Mobile responsiveness verified across all pages
- [ ] UI polish pass (spacing, typography, hover states)
- [ ] DigitalOcean deployment finalized with SSL (certbot / Let's Encrypt)
- [ ] reelpurpose.fishing DNS pointed to droplet
- [ ] Stripe webhook registered on live domain
- [ ] Resend domain DNS verified (SPF + DKIM)
- [ ] GitHub repo transferred to Luca's credentials
- [ ] Luca walkthrough: how to add products, manage orders, track vendor payments
- [ ] Final handover

---

## Summary

| Week | Focus | Status |
|------|-------|--------|
| 1 | Customer storefront + payments | 🔶 In Progress |
| 2 | Admin panel (products, orders, vendors, tax) | ⏳ Pending |
| 3 | Polish, testing, deploy, handover | ⏳ Pending |

---

## What Mike Needs to Provide

| Item | Status |
|------|--------|
| Stripe account + API keys | ⏳ Mike setting up in the morning |
| Vendor email address | ⏳ Pending |
| Fish species logo variations | ⏳ Being designed — using placeholders until ready |
| Product photos | ⏳ Using placeholders — swap in when ready |
| Mike's admin email + password | ⏳ Before launch |
| Luca's admin email + password | ⏳ Before launch |
| Domain DNS access (reelpurpose.fishing) | ⏳ Needed for deployment |

---

## Running Costs (Mike's Responsibility Post-Launch)

| Service | Cost | Frequency |
|---------|------|-----------|
| DigitalOcean Droplet (2GB) | $12 | Monthly |
| Cloudflare R2 | ~$0 (free tier covers early traffic) | Monthly |
| Resend | $0 (free tier: 3k emails/mo) | Monthly |
| Stripe | 2.9% + 30¢ per transaction | Per sale |
| Domain (reelpurpose.fishing) | ~$15–$25 | Yearly |
| **Total fixed** | **~$12/mo** | |

---

## Future Opportunities (Phase 2 — Not in Scope Now)

- Customer accounts + order history
- Discount / promo codes
- Multiple vendor support
- Inventory tracking
- Vendor API integration (replace email flow)
- Fitness app project (Mike introducing a collaborator — separate engagement)