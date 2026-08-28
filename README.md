Tentu. Berikut `README.md` yang bisa langsung kamu gunakan untuk project **Harmony Home**. Saya buat dengan konteks **website resmi satu kost eksklusif**, bukan marketplace pencarian kost.

````md
# 🏠 Harmony Home

> Website resmi Harmony Home — Kost Eksklusif dengan Hunian Nyaman

Harmony Home adalah website resmi untuk satu properti kost eksklusif yang dirancang untuk memberikan informasi lengkap kepada calon penghuni mengenai kamar, fasilitas, galeri, lokasi, aturan kost, serta proses booking kamar.

Website ini **bukan marketplace** dan tidak digunakan untuk mencari atau membandingkan berbagai kost. Seluruh konten berfokus pada satu properti, yaitu **Harmony Home**.

---

## ✨ Tentang Harmony Home

Harmony Home hadir sebagai hunian eksklusif yang mengutamakan:

- Kenyamanan
- Privasi
- Keamanan
- Fasilitas lengkap
- Lingkungan yang nyaman
- Lokasi strategis

Website ini membantu calon penghuni untuk mendapatkan informasi sebelum memutuskan untuk menyewa kamar.

### Alur Utama

```text
Pengunjung
    │
    ▼
Homepage
    │
    ├── Tentang Harmony Home
    │
    ├── Tipe Kamar
    │       │
    │       └── Detail Kamar
    │
    ├── Fasilitas
    │
    ├── Galeri
    │
    ├── Lokasi
    │
    ├── FAQ
    │
    └── Booking Kamar
             │
             ▼
       Form Booking
             │
             ▼
      Booking Berhasil
````

---

# 🚀 Tech Stack

Project ini menggunakan teknologi berikut:

| Teknologi     | Penggunaan                     |
| ------------- | ------------------------------ |
| Next.js       | Framework utama                |
| React         | UI Library                     |
| TypeScript    | Type Safety                    |
| Tailwind CSS  | Styling                        |
| Lucide React  | Icon                           |
| Next.js Image | Optimasi gambar                |
| App Router    | Routing                        |
| LocalStorage  | Simulasi favorit/data frontend |

---

# 📋 Fitur

## 🏠 Homepage

Homepage menjadi halaman utama untuk memperkenalkan Harmony Home.

Fitur:

* Hero section
* Informasi singkat Harmony Home
* Tipe kamar
* Fasilitas
* Keunggulan
* Galeri
* Lokasi
* Cara booking
* FAQ
* Call to Action

---

## 🛏️ Tipe Kamar

Harmony Home menyediakan beberapa tipe kamar.

Contoh:

### Standard Room

Harga:

```text
Rp1.500.000 / bulan
```

### Premium Room

Harga:

```text
Rp2.000.000 / bulan
```

### Executive Room

Harga:

```text
Rp2.500.000 / bulan
```

Setiap kamar memiliki:

* Nama
* Harga
* Ukuran
* Kapasitas
* Fasilitas
* Foto
* Deskripsi
* Status ketersediaan

---

## 📷 Galeri

Galeri digunakan untuk menampilkan foto:

* Eksterior
* Kamar
* Kamar mandi
* Ruang bersama
* Dapur
* Area parkir

Galeri menggunakan `Next.js Image` untuk optimasi gambar.

---

## 🏢 Fasilitas

Fasilitas yang dapat ditampilkan:

* WiFi
* AC
* Kamar mandi dalam
* CCTV
* Area parkir
* Laundry
* Dapur bersama
* Ruang bersama
* Air
* Listrik
* Keamanan

---

## 📍 Lokasi

Halaman lokasi menampilkan:

* Alamat Harmony Home
* Google Maps
* Lokasi sekitar
* Kampus terdekat
* Minimarket
* Rumah sakit
* ATM
* Tempat makan
* Transportasi

---

## 📝 Booking Kamar

Calon penghuni dapat mengajukan booking kamar.

Data yang dapat diisi:

### Data Penghuni

* Nama lengkap
* Email
* Nomor HP
* Nomor identitas
* Alamat

### Data Booking

* Tipe kamar
* Nomor kamar
* Tanggal masuk
* Durasi sewa
* Catatan

Setelah berhasil:

```text
Booking Berhasil Diajukan

Booking ID:
HH-2026-0001

Status:
Menunggu Konfirmasi
```

---

# 🗺️ Routing

Struktur route aplikasi:

```text
/
├── /tentang
├── /kamar
│   └── /kamar/[slug]
├── /fasilitas
├── /galeri
├── /lokasi
├── /aturan
├── /faq
├── /kontak
└── /booking
    └── /booking/success
```

### Detail Route

| Route              | Deskripsi                  |
| ------------------ | -------------------------- |
| `/`                | Homepage                   |
| `/tentang`         | Tentang Harmony Home       |
| `/kamar`           | Daftar tipe kamar          |
| `/kamar/[slug]`    | Detail tipe kamar          |
| `/fasilitas`       | Fasilitas Harmony Home     |
| `/galeri`          | Galeri foto                |
| `/lokasi`          | Lokasi Harmony Home        |
| `/aturan`          | Peraturan kost             |
| `/faq`             | Frequently Asked Questions |
| `/kontak`          | Informasi kontak           |
| `/booking`         | Form booking               |
| `/booking/success` | Konfirmasi booking         |

---

# 📁 Struktur Project

Struktur project direkomendasikan:

```text
harmony-home/
│
├── app/
│   ├── page.tsx
│   │
│   ├── tentang/
│   │   └── page.tsx
│   │
│   ├── kamar/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── fasilitas/
│   │   └── page.tsx
│   │
│   ├── galeri/
│   │   └── page.tsx
│   │
│   ├── lokasi/
│   │   └── page.tsx
│   │
│   ├── aturan/
│   │   └── page.tsx
│   │
│   ├── faq/
│   │   └── page.tsx
│   │
│   ├── kontak/
│   │   └── page.tsx
│   │
│   └── booking/
│       ├── page.tsx
│       └── success/
│           └── page.tsx
│
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── RoomCard.tsx
│   ├── RoomGrid.tsx
│   ├── FacilityCard.tsx
│   ├── Gallery.tsx
│   ├── LocationSection.tsx
│   ├── BookingForm.tsx
│   ├── BookingSummary.tsx
│   ├── FAQ.tsx
│   ├── Testimonial.tsx
│   ├── CTASection.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── ...
│
├── lib/
│   ├── data/
│   │   ├── rooms.ts
│   │   ├── facilities.ts
│   │   ├── gallery.ts
│   │   └── faq.ts
│   │
│   └── utils/
│
├── public/
│   └── images/
│       └── harmony-home/
│           ├── exterior/
│           ├── rooms/
│           ├── bathroom/
│           ├── common-area/
│           └── facilities/
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── README.md
```

---

# 🎨 Design System

Harmony Home menggunakan konsep visual:

```text
Premium
   +
Minimalis
   +
Modern
   +
Clean
   +
Comfortable
```

### Warna

Gunakan kombinasi:

* White
* Off White
* Neutral
* Soft Gray
* Dark Charcoal
* Primary Brand Color

Hindari:

* Neon
* Warna terlalu mencolok
* Gradient berlebihan
* Glassmorphism berlebihan

---

# 📱 Responsive Design

Website harus mendukung berbagai ukuran layar.

### Desktop

```text
1440px
1280px
1024px
```

### Tablet

```text
768px
```

### Mobile

```text
640px
390px
```

Prioritas responsive:

* Navbar
* Hero
* Room card
* Gallery
* Facility grid
* Booking form
* Location
* Footer

Tidak boleh terdapat horizontal overflow.

---

# 🖼️ Image Structure

Semua gambar Harmony Home ditempatkan di:

```text
public/images/harmony-home/
```

Contoh:

```text
public/images/harmony-home/
│
├── exterior/
│   ├── exterior-1.jpg
│   └── exterior-2.jpg
│
├── rooms/
│   ├── standard-1.jpg
│   ├── standard-2.jpg
│   ├── premium-1.jpg
│   └── executive-1.jpg
│
├── bathroom/
│   └── bathroom-1.jpg
│
├── common-area/
│   └── common-area-1.jpg
│
└── facilities/
    ├── parking.jpg
    ├── kitchen.jpg
    └── laundry.jpg
```

Gunakan `next/image` daripada HTML `<img>` jika memungkinkan.

---

# 📊 Dummy Data

Data kamar disimpan secara terpusat.

Contoh:

```ts
export const rooms = [
  {
    id: 1,
    slug: "standard",
    name: "Standard Room",
    price: 1500000,
    size: "3m x 4m",
    capacity: 1,
    status: "available",
    facilities: [
      "WiFi",
      "Kasur",
      "Lemari",
      "Meja",
      "Kamar Mandi"
    ]
  },
  {
    id: 2,
    slug: "premium",
    name: "Premium Room",
    price: 2000000,
    size: "4m x 5m",
    capacity: 1,
    status: "available",
    facilities: [
      "AC",
      "WiFi",
      "Kasur",
      "Lemari",
      "Meja Kerja",
      "Kamar Mandi Dalam"
    ]
  },
  {
    id: 3,
    slug: "executive",
    name: "Executive Room",
    price: 2500000,
    size: "5m x 5m",
    capacity: 1,
    status: "limited",
    facilities: [
      "AC",
      "WiFi",
      "Smart TV",
      "Kasur Premium",
      "Lemari",
      "Meja Kerja",
      "Kamar Mandi Dalam"
    ]
  }
];
```

---

# ⚙️ Installation

Clone repository:

```bash
git clone <repository-url>
```

Masuk ke directory:

```bash
cd harmony-home
```

Install dependencies:

```bash
npm install
```

---

# ▶️ Development

Jalankan development server:

```bash
npm run dev
```

Kemudian buka:

```text
http://localhost:3000
```

---

# 🏗️ Production Build

Build aplikasi:

```bash
npm run build
```

Jalankan production:

```bash
npm start
```

---

# 🧹 Lint

Jalankan ESLint:

```bash
npm run lint
```

Pastikan tidak terdapat error sebelum melakukan deployment.

---

# 🔐 Backend Integration

Versi awal website menggunakan dummy data.

Backend/database belum menjadi bagian dari versi frontend awal.

Namun struktur aplikasi dibuat agar nantinya mudah diintegrasikan dengan:

```text
Next.js
   │
   ▼
REST API
   │
   ▼
Backend
   │
   ▼
Database
```

Contoh endpoint yang dapat digunakan di masa depan:

```text
GET    /api/rooms
GET    /api/rooms/{slug}

POST   /api/bookings
GET    /api/bookings/{id}

GET    /api/facilities
GET    /api/gallery

POST   /api/contact
```

---

# 🗄️ Rencana Database

Jika backend ditambahkan, struktur database dapat dikembangkan menjadi:

```text
users
   │
   └── bookings
          │
          └── rooms

rooms
   │
   ├── room_facilities
   │
   └── room_images

facilities

gallery

bookings

contacts
```

---

# 🔄 Booking Flow

Alur booking:

```text
Pengunjung
    │
    ▼
Halaman Kamar
    │
    ▼
Pilih Tipe Kamar
    │
    ▼
Klik "Booking Kamar"
    │
    ▼
Form Booking
    │
    ├── Data Penghuni
    ├── Data Kamar
    ├── Tanggal Masuk
    └── Durasi
    │
    ▼
Booking Summary
    │
    ▼
Konfirmasi
    │
    ▼
Booking Berhasil
    │
    ▼
Menunggu Konfirmasi Pengelola
```

---

# 🔮 Future Development

Fitur yang dapat ditambahkan pada tahap berikutnya:

### Backend

* REST API
* Database
* Authentication
* User management
* Admin dashboard

### Booking

* Real-time room availability
* Booking management
* Booking status
* Check-in
* Check-out
* Invoice

### Pembayaran

* Payment gateway
* Virtual Account
* QRIS
* E-wallet
* Payment confirmation

### Admin

* Dashboard
* Manajemen kamar
* Manajemen penghuni
* Manajemen booking
* Manajemen fasilitas
* Manajemen galeri
* Manajemen harga
* Laporan
* Rekap transaksi

### Notification

* WhatsApp notification
* Email notification
* Booking confirmation
* Payment notification

---

# 🔒 Security

Ketika backend sudah dibuat, pastikan:

* Validasi input server-side
* Authentication
* Authorization
* Rate limiting
* CSRF protection
* Sanitization
* Secure password hashing
* Validasi file upload
* Environment variables untuk secret
* Jangan menyimpan credential di repository

---

# ♿ Accessibility

Website harus memperhatikan accessibility:

* Semantic HTML
* Alt text gambar
* Form label
* Keyboard navigation
* Focus state
* Accessible buttons
* ARIA label jika diperlukan
* Kontras warna yang baik

---

# ⚡ Performance

Optimasi yang digunakan:

* Next.js Image
* Server Components
* Lazy loading
* Code splitting
* Reusable components
* Minimal Client Components
* Optimized assets

Target:

```text
Fast
Responsive
SEO Friendly
Mobile Friendly
Accessible
```

---

# 🔎 SEO

Homepage:

```text
Title:
Harmony Home — Kost Eksklusif dengan Hunian Nyaman

Description:
Harmony Home adalah kost eksklusif dengan fasilitas lengkap,
lingkungan nyaman, dan lokasi strategis.
```

Gunakan metadata yang berbeda untuk setiap halaman.

Contoh:

```text
/kamar
→ Harmony Home — Pilihan Kamar

/kamar/premium
→ Harmony Home — Premium Room

/fasilitas
→ Harmony Home — Fasilitas

/lokasi
→ Harmony Home — Lokasi

/booking
→ Harmony Home — Booking Kamar
```

---

# 📌 Aturan Pengembangan

Saat mengembangkan project ini, ikuti aturan:

1. Harmony Home hanya memiliki **satu properti**.
2. Jangan mengubah website menjadi marketplace kost.
3. Jangan menambahkan pencarian kost lain.
4. Jangan membuat listing properti lain.
5. Semua kamar harus berasal dari Harmony Home.
6. Gunakan reusable components.
7. Gunakan TypeScript.
8. Hindari duplikasi kode.
9. Gunakan `next/image`.
10. Pastikan seluruh halaman responsive.
11. Jangan menggunakan animasi berlebihan.
12. Jangan menggunakan warna berlebihan.
13. Jangan membuat UI seperti dashboard pada halaman publik.
14. Pastikan semua route dapat diakses.
15. Pastikan tidak ada broken link.
16. Pastikan tidak ada TypeScript error.
17. Jangan menyimpan API key atau secret di source code.
18. Gunakan environment variable untuk konfigurasi sensitif.
19. Gunakan dummy data selama backend belum tersedia.
20. Struktur frontend harus siap diintegrasikan dengan API.

---

# 🧪 Testing Checklist

Sebelum melakukan deployment, periksa:

### UI

* [ ] Homepage tampil dengan baik
* [ ] Navbar responsive
* [ ] Mobile menu bekerja
* [ ] Footer tampil dengan baik
* [ ] Semua gambar tampil
* [ ] Gallery bekerja
* [ ] Room card bekerja

### Routing

* [ ] `/`
* [ ] `/tentang`
* [ ] `/kamar`
* [ ] `/kamar/[slug]`
* [ ] `/fasilitas`
* [ ] `/galeri`
* [ ] `/lokasi`
* [ ] `/aturan`
* [ ] `/faq`
* [ ] `/kontak`
* [ ] `/booking`
* [ ] `/booking/success`

### Booking

* [ ] Form dapat diisi
* [ ] Validasi bekerja
* [ ] Summary tampil
* [ ] Submit bekerja
* [ ] Success page tampil

### Responsive

* [ ] Desktop
* [ ] Tablet
* [ ] Mobile
* [ ] Tidak ada horizontal overflow

### Code Quality

* [ ] TypeScript tidak error
* [ ] ESLint tidak error
* [ ] Tidak ada broken import
* [ ] Tidak ada console error
* [ ] Tidak ada broken route

---

# 🌐 Deployment

Project dapat di-deploy menggunakan platform seperti:

* Vercel
* Netlify
* VPS
* Cloud hosting lainnya

Untuk deployment, pastikan environment variable telah dikonfigurasi dengan benar.

---

# 👨‍💻 Development Philosophy

Harmony Home dikembangkan dengan prinsip:

```text
Simple
   +
Elegant
   +
Maintainable
   +
Responsive
   +
User Friendly
```

Fokus utama bukan jumlah fitur, tetapi **pengalaman pengguna dan kesan premium dari Harmony Home**.

---

# 📄 License

Copyright © 2026 Harmony Home.

All rights reserved.

```

**Catatan penting:** README ini sengaja tidak memasukkan fitur seperti *“Cari Kost”, “Kost Populer”, filter kota, dan listing properti lain*, karena konsep Harmony Home yang kamu minta adalah **satu kost eksklusif dengan beberapa tipe/unit kamar**.
```
