# Harmony Home

> Website resmi Harmony Home — Kost Eksklusif dengan Hunian Nyaman

Harmony Home adalah website full-stack untuk satu properti kost eksklusif yang dirancang untuk memberikan informasi lengkap kepada calon penghuni mengenai kamar, fasilitas, galeri, lokasi, aturan kost, serta proses booking kamar.

Website ini **bukan marketplace** dan tidak digunakan untuk mencari atau membandingkan berbagai kost. Seluruh konten berfokus pada satu properti, yaitu **Harmony Home**.

---

## Tech Stack

| Teknologi | Penggunaan |
|---|---|
| Next.js 13.5 | Framework full-stack (App Router) |
| React 18 | UI Library |
| TypeScript | Type Safety (strict) |
| Tailwind CSS 3 | Styling |
| shadcn/ui | UI Components (Radix-based) |
| Prisma 5 | ORM |
| PostgreSQL | Database |
| NextAuth v4 | Authentication |
| Zod | Validation |
| bcryptjs | Password Hashing |
| sonner | Toast Notifications |
| Lucide React | Icons |

---

## Installation

### 1. Clone & Install

```bash
git clone <repository-url>
cd harmonyHome-next
npm install
```

### 2. PostgreSQL Setup

Pastikan PostgreSQL sudah terinstal dan berjalan. Buat database:

```sql
CREATE DATABASE harmony_home;
```

### 3. Environment Variables

Buat file `.env` di root project:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/harmony_home"
AUTH_SECRET="your-secret-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

Lihat `.env.example` untuk referensi.

### 4. Prisma Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed
```

### 5. Development

```bash
npm run dev
```

Buka http://localhost:3000

---

## Admin Dashboard

Akses admin di `/admin/login`.

### Default Credentials (Development)

```
Email: admin@harmonyhome.id
Password: admin123
```

### Admin Routes

| Route | Deskripsi |
|---|---|
| `/admin` | Dashboard overview |
| `/admin/bookings` | Booking management |
| `/admin/rooms` | Room management |
| `/admin/facilities` | Facility management |
| `/admin/gallery` | Gallery management |
| `/admin/faq` | FAQ management |
| `/admin/rules` | Rules management |
| `/admin/testimonials` | Testimonial management |
| `/admin/messages` | Contact messages |
| `/admin/settings` | Site settings |

---

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run typecheck    # TypeScript check
```

---

## Database Schema

### Tables

- **users** — Admin accounts (email, password hash, role)
- **rooms** — Room types (Standard, Premium, Executive)
- **bookings** — Customer bookings with HH-YYYY-XXXX codes
- **facilities** — Facility listings with Lucide icon names
- **gallery** — Gallery images by category
- **faq** — Frequently asked questions
- **rules** — House rules with items
- **testimonials** — Customer testimonials
- **contact_messages** — Contact form submissions
- **site_settings** — Key-value site configuration

### Key Relationships

- Room has many Bookings
- Booking belongs to Room

---

## Booking Flow

```
User selects room
    ↓
Fills booking form
    ↓
POST /api/bookings
    ↓
Server validates input
    ↓
Checks room availability
    ↓
Calculates price (server-side)
    ↓
Creates booking with code HH-YYYY-XXXX
    ↓
Redirects to /booking/success
```

### Security

- Price is calculated server-side (never trusted from client)
- Room availability checked against active bookings (PENDING/CONFIRMED)
- Booking code auto-generated and unique
- CSRF protection via NextAuth
- Password hashed with bcryptjs

---

## Public Routes

| Route | Deskripsi |
|---|---|
| `/` | Homepage |
| `/tentang` | About |
| `/kamar` | Room listings |
| `/kamar/[slug]` | Room detail |
| `/fasilitas` | Facilities |
| `/galeri` | Gallery |
| `/lokasi` | Location |
| `/aturan` | Rules |
| `/faq` | FAQ |
| `/kontak` | Contact |
| `/booking` | Booking form |
| `/booking/success` | Booking confirmation |

---

## API Routes

### Public

| Method | Route | Description |
|---|---|---|
| GET | `/api/rooms` | List rooms |
| POST | `/api/bookings` | Create booking |

### Admin (protected)

| Method | Route | Description |
|---|---|---|
| GET/PATCH/DELETE | `/api/admin/rooms/[id]` | Room CRUD |
| GET/PATCH/DELETE | `/api/admin/facilities/[id]` | Facility CRUD |
| GET/PATCH/DELETE | `/api/admin/gallery/[id]` | Gallery CRUD |
| GET/PATCH/DELETE | `/api/admin/faq/[id]` | FAQ CRUD |
| GET/PATCH/DELETE | `/api/admin/rules/[id]` | Rules CRUD |
| GET/PATCH/DELETE | `/api/admin/testimonials/[id]` | Testimonial CRUD |
| GET/PATCH/DELETE | `/api/admin/messages/[id]` | Message management |
| POST | `/api/admin/settings` | Site settings |

---

## Deployment

### Netlify

Project includes `netlify.toml` for Netlify deployment with `@netlify/plugin-nextjs`.

### Environment Variables (Production)

Set these in your hosting platform:

```
DATABASE_URL=<production-postgresql-url>
AUTH_SECRET=<random-64-char-string>
NEXTAUTH_URL=<https://your-domain.com>
```

### Database Deployment

```bash
npx prisma migrate deploy
npx prisma db seed  # optional: seed initial data
```

---

## Development Notes

- All UI copy is in Indonesian (Bahasa Indonesia)
- Images use remote Pexels URLs (no local `/public/images/`)
- `images.unoptimized` is enabled in `next.config.js`
- ESLint runs are ignored during build
- Dark mode supported via `next-themes`
- Admin pages use `force-dynamic` for server-side rendering

---

## License

Copyright 2026 Harmony Home. All rights reserved.
