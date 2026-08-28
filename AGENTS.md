# AGENTS.md

Harmony Home — official website for a single exclusive boarding house (kost) in Makassar. Not a marketplace; never add features to search/compare other properties or list other properties.

## Commands
- `npm run dev` — dev server (http://localhost:3000)
- `npm run build` / `npm run start` — production build/run
- `npm run lint` — ESLint (`next lint`, config `next/core-web-vitals`)
- `npm run typecheck` — `tsc --noEmit`

Run `typecheck` and `lint` after changes. There are no tests.

## Stack & routing
- Next.js **13.5.1** App Router, React 18, TypeScript (`strict`), Tailwind 3, shadcn/ui.
- Path alias `@/*` → repo root (e.g. `@/lib/data/rooms`, `@/components/ui/button`).
- Pages under `app/` (routes: `/`, `/tentang`, `/kamar`, `/kamar/[slug]`, `/fasilitas`, `/galeri`, `/lokasi`, `/aturan`, `/faq`, `/kontak`, `/booking`, `/booking/success`). Each page owns its `Metadata`.

## Content is centralized dummy data (no backend)
- All site content lives in `lib/data/` (`rooms.ts`, `facilities.ts`, `gallery.ts`, `faq.ts`, `rules.ts`, `testimonials.ts`, `site-content.ts`).
- **`siteConfig` and `formatPrice` live in `lib/data/rooms.ts`** (not a separate site config file), alongside the `Room` type, `roomStatusMap`, and `rooms` array. Update contact/address/WhatsApp numbers there.
- No database, no API routes, no REST endpoints exist. Booking is **simulated in the client**: `BookingForm` (`components/BookingForm.tsx`) awaits a fake delay, then navigates to `/booking/success?id=...&room=...&name=...&duration=...&total=...`.
- Booking ID pattern: `HH-YYYY-<4-digit>` (generated in `BookingForm`).

## Conventions
- **All UI copy is Indonesian** (labels, placeholders, error messages, headings, alt text).
- shadcn/ui primitives in `components/` and reused Radix-based components in `components/ui/`.
- Display headings use `font-serif`; page sections wrap content in `mx-auto max-w-7xl container-px` (`container-px` is a custom utility in `app/globals.css`).
- Dark mode via `next-themes` (`components/theme-provider.tsx`), `defaultTheme="light"`.
- Use `next/image` for images. **`images.unoptimized` is on** in `next.config.js`, and **ESLint runs are ignored during build** — so image/lint issues do not fail `npm run build`; verify manually.

## Images
- **No `public/` directory.** All images are remote Pexels URLs hardcoded in `lib/data/rooms.ts` (and other data files). Do not reference local `/images/...` paths.

## Deployment
- Deployed to Netlify. `netlify.toml` runs `npx next build` with the `@netlify/plugin-nextjs` plugin, publishing `.next`.
