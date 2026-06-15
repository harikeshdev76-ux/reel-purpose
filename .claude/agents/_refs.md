# Shared References — Reel Purpose

## Specification Files

```
.claude/documentation/reel-purpose/
├── 01_FUNCTIONAL_SPEC.md   ← User flows, functional requirements, page structure
├── 02_TECHNICAL_SPEC.md    ← Stack, project structure, Prisma schema, API routes
├── 03_API_AND_KEYS.md      ← Env vars, Stripe/Resend/R2 integration details, pending items
└── 04_ROADMAP.md           ← Week-by-week plan, what Mike needs to provide, costs
```

## Key File Paths (Once Repo Initialized)

```
src/
├── app/
│   ├── page.tsx                          ← Homepage
│   ├── shop/page.tsx                     ← Product catalog
│   ├── product/[slug]/page.tsx           ← Product detail
│   ├── cart/page.tsx                     ← Cart
│   ├── success/page.tsx                  ← Post-payment
│   ├── admin/page.tsx                    ← Admin login
│   ├── admin/(panel)/layout.tsx          ← Admin shell (auth guard)
│   ├── admin/(panel)/dashboard/page.tsx  ← Dashboard
│   ├── admin/(panel)/products/           ← Product CRUD
│   ├── admin/(panel)/orders/             ← Order management
│   ├── admin/(panel)/vendors/page.tsx    ← Vendor payment tracking
│   ├── admin/(panel)/tax/page.tsx        ← FL sales tax summary
│   └── api/
│       ├── stripe/checkout/route.ts
│       ├── stripe/webhook/route.ts
│       └── upload/route.ts
├── components/
│   ├── layout/Navbar.tsx
│   ├── layout/Footer.tsx
│   ├── shop/ProductCard.tsx
│   ├── shop/SpeciesFilter.tsx
│   ├── shop/SizeSelector.tsx
│   ├── cart/CartDrawer.tsx
│   └── admin/
└── lib/
    ├── prisma.ts
    ├── stripe.ts
    ├── resend.ts
    ├── r2.ts
    ├── tax.ts
    └── auth.ts

prisma/schema.prisma                      ← Full schema in 02_TECHNICAL_SPEC.md
```

## Common Input Patterns

### STOP_MISSING
> Missing required input → **STOP and ASK**

### STOP_UNCLEAR
> Behavior/scope unclear → **STOP and ASK**

### STOP_CONTEXT
> Context missing → **STOP and ASK**

## Common Forbidden Patterns

### NO_FEATURE
- Feature invention / scope creep

### NO_SILENT
- Silent assumptions
- Guessing business logic

### NO_SECRETS
- Secrets in code or logs
- Security shortcuts

### NO_DESIGN_DEVIATION
- Any color, font, or spacing outside the Marshland token system
- See `_base-project.md` for full token values

### NO_STYLE_ONLY
- Cosmetic-only changes without justification