# AGENTS.md

Harmony Home — official website for a single exclusive boarding house (kost) in Makassar. Not a marketplace; never add features to search/compare other properties or list other properties.

## Commands
- `npm run dev` — dev server (http://localhost:3000)
- `npm run build` / `npm run start` — production build/run
- `npm run lint` — ESLint (`next lint`, config `next/core-web-vitals`)
- `npm run typecheck` — `tsc --noEmit`
- `npx prisma generate` / `npx prisma validate` — after changing `prisma/schema.prisma`
- `npx prisma db push` — push schema to DB (no migration files in use)
- `npx prisma db seed` — runs `prisma/seed.ts` via ts-node (CommonJS)

Run `typecheck` and `lint` after changes. There are no tests.

## WARNING — `.next` corruption (Windows)
`next dev` and `next start`/`next build` **must not run concurrently** — they share `.next`. If a stale server (e.g. leftover `next dev` on port 3001, or another node process) is alive, the build output files get deleted/overwritten and you get `MODULE_NOT_FOUND` for `.next/server/app/*.js` and webpack errors like `TypeError: Cannot read properties of undefined (reading 'call')`. Before debugging such errors: kill ALL node processes, delete `.next`, then run ONE server. A `npm run build` that "succeeds" can still leave 0 files in `.next/server/app` when a second Next process interfered.

## Stack & routing
- Next.js **13.5.1** App Router (pinned; TS 5.2.2 pinned), React 18, TypeScript (`strict`), Tailwind 3, shadcn/ui.
- Path alias `@/*` → repo root.
- Public routes: `/`, `/tentang`, `/kamar`, `/kamar/[slug]`, `/fasilitas`, `/galeri`, `/lokasi`, `/aturan`, `/faq`, `/kontak`, `/booking`, `/booking/success`, `/pembayaran/login`. Admin routes under `/admin/*` (+ `/admin/login`). Tenant portal: `/pembayaran`. Each page owns its `Metadata`.
- **Every page that queries the DB must set `export const dynamic = 'force-dynamic'`** (else build tries to prerender and errors).
- `middleware.ts` uses `getToken` (next-auth/jwt) to protect `/admin/:path*`, `/api/admin/:path*` and `/pembayaran` (+ `/pembayaran/login`). Unauthenticated `/admin/*` page requests redirect to `/admin/login` (with `callbackUrl`); unauthenticated `/api/admin/*` requests get `401` JSON (non-admin role gets `403`) so client `fetch()` fails cleanly instead of receiving an HTML login page. `/pembayaran` sends guests to `/pembayaran/login` and non-tenant roles to `/admin` (instant 307 — a page-level `redirect()` would only stream a 1s meta-refresh). Don't call `requireAdmin()` in `app/admin/layout.tsx` — that redirect loop breaks `/admin/login`; the layout instead renders children directly when unauthenticated. `/api/bookings/[id]` (GET/PATCH) is admin-only and checks the session server-side via `getSession()`.

## Data layers
- **Database (Prisma + PostgreSQL/Neon)** is the source of truth. `prisma/schema.prisma` models: User, Room, Booking, ContactMessage, Facility, Gallery, Faq, Rule, Testimonial, SiteSetting. Enums (`RoomStatus`, `BookingStatus`, etc.) are uppercase in DB but mapped to lowercase on the public site by `lib/db/public.ts`.
- `lib/db/prisma.ts` — singleton; **server-only, never import into a client component**. Page data access: `lib/db/public.ts` (public site), `lib/db/queries.ts` (admin CRUD), `lib/db/dashboard.ts` (admin dashboard stats). Client components must fetch via API routes, never Prisma.
- Existing pages split between DB-backed and static:
  - DB-backed (query `lib/db/public`): `/` (rooms & facilities; other `/` sections are static), `/kamar`, `/kamar/[slug]`, `/fasilitas`, `/booking`.
  - Still static `lib/data/*`: `Gallery.tsx` gallery images, `/aturan` rules (`lib/data/rules.ts`), `/kontak` + `Footer`/`LocationSection`/`QuickInfo`/`WhatsAppButton` use `siteConfig` from `lib/data/rooms.ts`, `FAQAccordion`, `TestimonialsSection`, `BookingStepsSection`/`AdvantagesSection` from `lib/data/site-content`, `/galeri` (uses `Gallery`).
- `siteConfig` and the `Room` type / `roomStatusMap` live in `lib/data/rooms.ts` (contact/WhatsApp/address values there).

## Booking backend
- Public POST `/api/bookings` (in `app/api/bookings/route.ts`): Zod-validated (rejects past `startDate`), price computed server-side (`room.price * duration`), double-booking prevented with **true range overlap** (existing `startDate + duration` vs requested range) inside a Serializable transaction, booking code `HH-YYYY-<4-digit>` computed from the **max sequence already used that year** (not `count`, which would reuse codes after deletions) with P2002 retry. `BookingForm` posts here then redirects to `/booking/success?id=...`.
- `GET/PATCH /api/bookings/[id]` for status management (admin).

## Monthly payments & tenant portal
- `MonthlyPayment` rows are generated **only** by `lib/db/monthly-payments.ts` (`ensureMonthlyPayments*`, idempotent via `skipDuplicates` + `@@unique([bookingId, periodYear, periodMonth])`) — never hand-write them from UI/API code. Amount = `getMonthlyAmount` (contract `totalPrice / duration`), due day = `Booking.paymentDueDay ?? startDate day` (clamped to the month's last day).
- All date logic lives in `lib/payment-dates.ts` — pure, client-safe, business dates as `YYYY-MM-DD` strings, business day = Asia/Makassar (`businessDateString`), stored dates anchored at noon UTC (`toAnchorDate`). Format with `formatTanggal`/`formatPeriodLabel`, never `new Date('YYYY-MM-DD')` for display.
- Display status (`PAID|DUE_TODAY|OVERDUE|UPCOMING`) is computed from dates in `serializePayment`; stored status is only `UNPAID|PAID|OVERDUE`. Shared badge/copy: `components/payment-status.tsx`.
- Admin UI: `/admin/pembayaran` (list + record/revert payment), `/admin/penyewa` + `/admin/penyewa/[id]` (due day, tenant account), dashboard widget `MonthlyPaymentSummary`. APIs: `GET/POST /api/admin/monthly-payments`, `GET/PATCH /api/admin/monthly-payments/[id]`, `PATCH /api/admin/penyewa/[id]` (`paymentDueDay` 1-31), `POST /api/admin/penyewa/[id]/account`. Every handler calls `requireAdminSession()` in addition to middleware.
- Tenant portal: role `PENYEWA`, login `/pembayaran/login`, page `/pembayaran` (server; `getTenantPayments(userId)` only — never another tenant's data), UI `components/tenant/TenantPaymentDashboard.tsx`.
- Email reminders (H-3, H-1, Hari H; no overdue email): `lib/email.ts` (nodemailer, env `SMTP_HOST`/`SMTP_PORT`/`SMTP_SECURE`/`SMTP_USER`/`SMTP_PASSWORD`/`EMAIL_FROM`) + `lib/db/reminders.ts` (`runPaymentReminders`). Idempotent via `payment_reminders` unique `[paymentId, stage]` — the row is claimed with `skipDuplicates` **before** sending and released if SMTP fails (retryable). Triggered by `GET /api/cron/reminders` (header `x-cron-secret` or `?secret=` = `CRON_SECRET`, timing-safe compare) and lazily by `/admin` + `/admin/pembayaran` page loads. Without `SMTP_HOST` every run just returns `skipped`, so admin pages never break. Email targets `Booking.email`.

## Conventions
- **All UI copy is Indonesian** (labels, placeholders, errors, alt text).
- Comment grammar rules: paragraphs + hyphenated compounds.
- shadcn/ui primitives in `components/ui/`. Display headings use `font-serif`; sections wrap in `mx-auto max-w-7xl container-px` (`container-px` is a custom utility in `app/globals.css`).
- Dark mode via `next-themes` (`components/theme-provider.tsx`), `defaultTheme="light"`. Sonner `<Toaster>` mounted in `app/layout.tsx`.
- Use `next/image`. **No `public/` directory** — images are remote Pexels URLs hardcoded in data files. `images.unoptimized` is on in `next.config.js` and ESLint is ignored during build, so image/lint issues do NOT fail `npm run build`; verify manually.

## Environment & gotchas
- `.env` required with `DATABASE_URL` (Neon postgres), `AUTH_SECRET`, `NEXTAUTH_URL`. See `.env.example`.
- Dev admin credentials (seeded): `admin@harmonyhome.id` / `admin123`. Seeded tenant accounts use each booking's email (e.g. `rangga@email.com`) / `penyewa123`.
- `npx prisma generate` can fail with `EPERM rename ... query_engine-windows.dll.node` on Windows when another process holds the DLL — kill node processes, then retry. Not a code problem.
- If first request to a route hangs for ~10s, it's next dev compiling on demand (cold compile), not a hang.
- Prisma pinned to **5.22.0**; `@next/swc-wasm-nodejs` pinned as `@next/swc-wasm-nodejs` 13.5.1. Do not bump these without checking Next 13.5/TS 5.2 compatibility.
- Deployed to Netlify via `netlify.toml` (`npx prisma generate && npx next build`, `@netlify/plugin-nextjs`, publishes `.next`). **`prisma generate` MUST run before `next build`** — `npm run build` already does this via the `prebuild` hook; `netlify.toml` also prepends it. If the generated client (`node_modules/.prisma/client`) is missing at build time, Next fails with `Error: Failed to collect page data for /api/admin/<x>/[id]` (the reported route varies per parallel worker; usually the first DB-backed API route).