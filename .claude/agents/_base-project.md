# Project Rules — Reel Purpose

> Refs: [_refs.md](_refs.md)
> Full specs: [documentation/reel-purpose/](documentation/reel-purpose/)

## Stack

| Layer | Tech | Path |
|-------|------|------|
| Framework | Next.js 14 (App Router) | `src/app/` |
| Language | TypeScript | Throughout |
| Styling | Tailwind CSS + Marshland tokens | `src/app/globals.css`, `tailwind.config.ts` |
| Database | PostgreSQL via Prisma ORM | `prisma/schema.prisma`, `src/lib/prisma.ts` |
| Auth | NextAuth (credentials) | `src/lib/auth.ts` |
| Payments | Stripe | `src/lib/stripe.ts`, `src/app/api/stripe/` |
| Email | Resend | `src/lib/resend.ts` |
| Storage | Cloudflare R2 (AWS SDK v3) | `src/lib/r2.ts` |
| Deployment | DigitalOcean droplet + PM2 + Nginx | |

## Architecture

- Single Next.js 14 App Router application — no separate backend
- API logic lives in `src/app/api/` route handlers
- Database access via Prisma client singleton (`src/lib/prisma.ts`)
- All admin routes under `src/app/admin/(panel)/` — protected by NextAuth session middleware
- Shared components in `src/components/`
- Business logic in `src/lib/` (never in components or route handlers directly)

## Design System — Marshland (MANDATORY)

All UI must use the Marshland token system. No ad-hoc colors.

```
Nav/Footer bg:    #1e2e1a   (deep mangrove green)
Section bg:       #2d5228   (mid green — species strips, dark sections)
Page bg:          #f5f1ea   (off-white)
Surface:          #ffffff   (cards, product cards)
CTA / Prices:     #b8541e   (rust/clay — ALL primary buttons and price displays)
CTA hover:        #9e4518
Text primary:     #1e2e1a
Text muted:       rgba(30,46,26,0.5)
Text on dark:     #f5f1ea
Text on dark muted: rgba(245,241,234,0.5)

Fonts:
  Display:    'Bebas Neue'          → hero headlines, section titles, product names
  Condensed:  'Barlow Condensed'    → nav links, labels, badges, buttons (uppercase, tracked)
  Body:       'Barlow'              → descriptions, body copy, admin UI
```

## Code Quality

- No `any` — all types explicit
- No logic in components — business logic in `src/lib/`
- No secrets in code or logs — `.env` only
- Prisma client via singleton — never instantiate directly in route handlers

## Security

- All Stripe, R2, Resend, NextAuth keys server-side only
- Stripe webhook signature verified on every request
- Admin routes: NextAuth `getServerSession` check at layout level
- Passwords: bcryptjs with salt rounds 12
- R2: public read for product images, write via server API only

## Model Routing

| Tier | Model | Agents |
|------|-------|--------|
| Routing | `opus (≤5K tok) → sonnet` | ORCHESTRATOR |
| Reasoning | `opus` | CRITICAL-THINKER, MONOREPO-ARCHITECT |
| Implementation | `sonnet` | BACKEND, FRONTEND, FRONTEND-REFACTOR, FRONTEND-TESTS, BACKEND-TESTS, E2E, PIPELINE-EXECUTOR |
| Extraction | `haiku` | STORYBOOK |

## Forbidden (Universal)

- Feature invention (unless role permits)
- Silent assumptions — STOP and ASK if unclear
- Spec deviation "for improvement"
- Unjustified rewrites
- Hardcoded colors outside the Marshland token system
- Any `any` type
- Secrets committed to git