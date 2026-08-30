import { PrismaClient, UserRole, RoomStatus, BookingStatus } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ── Admin user ──────────────────────────────────────
  const passwordHash = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@harmonyhome.id' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@harmonyhome.id',
      passwordHash,
      role: UserRole.ADMIN,
    },
  });
  console.log(`Admin user: ${admin.email}`);

  // ── Rooms ───────────────────────────────────────────
  const standard = await prisma.room.upsert({
    where: { slug: 'standard' },
    update: {},
    create: {
      slug: 'standard',
      name: 'Standard Room',
      type: 'TYPE A — STANDARD',
      description:
        'Standard Room dirancang untuk memberikan kenyamanan dasar dengan fasilitas yang lengkap. Cocok untuk kamu yang mencari hunian praktis dengan harga terjangkau namun tetap mendapatkan kualitas dari Harmony Home. Setiap kamar dilengkapi dengan kasur, lemari, dan meja untuk mendukung aktivitas harianmu.',
      shortDescription:
        'Kamar nyaman dengan fasilitas dasar lengkap untuk hunian harian.',
      price: 1700000,
      priceLabel: 'Rp1.700.000 / bulan',
      capacity: 1,
      size: '3m × 4m',
      status: RoomStatus.AVAILABLE,
      availableCount: 6,
      totalCount: 10,
      facilities: ['Kasur', 'Lemari', 'Meja', 'WiFi', 'Kamar mandi', 'CCTV area umum', 'Area parkir'],
      rules: ['Dilarang merokok di dalam kamar', 'Jam bertamu hingga pukul 22.00', 'Jaga kebersihan kamar'],
      paymentInfo: ['Pembayaran di muka per bulan', 'Deposit Rp500.000 (dikembalikan saat checkout)', 'Listrik token mandiri'],
      images: [
        'https://images.pexels.com/photos/6782479/pexels-photo-6782479.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/8135505/pexels-photo-8135505.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/6899357/pexels-photo-6899357.jpeg?auto=compress&cs=tinysrgb&w=1200',
      ],
    },
  });

  const premium = await prisma.room.upsert({
    where: { slug: 'premium' },
    update: {},
    create: {
      slug: 'premium',
      name: 'Premium Room',
      type: 'TYPE B — PREMIUM',
      description:
        'Premium Room menawarkan ruang yang lebih luas dengan kamar mandi di dalam untuk privasi maksimal. Dilengkapi AC dan meja kerja yang nyaman, kamar ini cocok untuk kamu yang menginginkan hunian dengan kualitas premium. Setiap detail dirancang untuk mendukung produktivitas dan kenyamanan istirahatmu.',
      shortDescription:
        'Kamar luas dengan AC dan kamar mandi dalam untuk kenyamanan ekstra.',
      price: 2000000,
      priceLabel: 'Rp2.000.000 / bulan',
      capacity: 1,
      size: '4m × 5m',
      status: RoomStatus.AVAILABLE,
      availableCount: 3,
      totalCount: 7,
      facilities: ['Kasur premium', 'Lemari', 'Meja kerja', 'AC', 'WiFi', 'Kamar mandi dalam', 'CCTV area umum', 'Area parkir'],
      rules: ['Dilarang merokok di dalam kamar', 'Jam bertamu hingga pukul 22.00', 'Jaga kebersihan kamar', 'Hemat penggunaan AC'],
      paymentInfo: ['Pembayaran di muka per bulan', 'Deposit Rp750.000 (dikembalikan saat checkout)', 'Listrik termasuk dalam biaya sewa'],
      images: [
        'https://images.pexels.com/photos/7587777/pexels-photo-7587777.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/8082562/pexels-photo-8082562.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/6957081/pexels-photo-6957081.jpeg?auto=compress&cs=tinysrgb&w=1200',
      ],
    },
  });

  const executive = await prisma.room.upsert({
    where: { slug: 'executive' },
    update: {},
    create: {
      slug: 'executive',
      name: 'Executive Room',
      type: 'TYPE C — EXECUTIVE',
      description:
        'Executive Room adalah tipe kamar tertinggi di Harmony Home. Dengan ukuran yang luas, Smart TV, dan seluruh fasilitas premium, kamar ini memberikan pengalaman hunian layaknya apartemen eksklusif. Hanya tersedia dalam jumlah terbatas, membuatnya menjadi pilihan istimewa bagi penghuni yang mengutamakan kualitas dan privasi.',
      shortDescription:
        'Kamar terbaik dengan Smart TV dan seluruh fasilitas premium.',
      price: 2500000,
      priceLabel: 'Rp2.500.000 / bulan',
      capacity: 1,
      size: '5m × 5m',
      status: RoomStatus.AVAILABLE,
      availableCount: 2,
      totalCount: 3,
      facilities: ['Kasur premium', 'AC', 'Smart TV', 'WiFi', 'Kamar mandi dalam', 'Meja kerja', 'Lemari', 'CCTV area umum', 'Area parkir'],
      rules: ['Dilarang merokok di dalam kamar', 'Jam bertamu hingga pukul 22.00', 'Jaga kebersihan kamar', 'Hemat penggunaan AC', 'Bertanggung jawab atas perangkat elektronik'],
      paymentInfo: ['Pembayaran di muka per bulan', 'Deposit Rp1.000.000 (dikembalikan saat checkout)', 'Listrik & air termasuk dalam biaya sewa', 'Cleaning service 2x seminggu'],
      images: [
        'https://images.pexels.com/photos/7546276/pexels-photo-7546276.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/7195720/pexels-photo-7195720.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/7031840/pexels-photo-7031840.jpeg?auto=compress&cs=tinysrgb&w=1200',
      ],
    },
  });
  console.log('Rooms seeded');

  // ── Facilities ──────────────────────────────────────
  const facilityData = [
    { name: 'WiFi Cepat', description: 'Koneksi internet berkecepatan tinggi di seluruh area.', icon: 'Wifi', sortOrder: 1 },
    { name: 'AC', description: 'Pendingin ruangan di setiap kamar premium dan executive.', icon: 'Wind', sortOrder: 2 },
    { name: 'Kamar Mandi Dalam', description: 'Privasi penuh dengan kamar mandi di dalam kamar.', icon: 'Bath', sortOrder: 3 },
    { name: 'CCTV 24 Jam', description: 'Pengawasan keamanan sepanjang hari di area umum.', icon: 'Cctv', sortOrder: 4 },
    { name: 'Area Parkir', description: 'Tempat parkir aman untuk kendaraan penghuni.', icon: 'Car', sortOrder: 5 },
    { name: 'Dapur Bersama', description: 'Dapur lengkap untuk memasak bersama penghuni lain.', icon: 'ChefHat', sortOrder: 6 },
    { name: 'Keamanan', description: 'Petugas keamanan dan akses terkontrol 24 jam.', icon: 'ShieldCheck', sortOrder: 7 },
    { name: 'Air Bersih', description: 'Pasokan air bersih mengalir sepanjang waktu.', icon: 'Droplets', sortOrder: 8 },
    { name: 'Cleaning Service', description: 'Layanan kebersihan kamar untuk tipe executive.', icon: 'Sparkles', sortOrder: 9 },
  ];

  for (const f of facilityData) {
    const existing = await prisma.facility.findFirst({ where: { name: f.name } });
    if (!existing) {
      await prisma.facility.create({ data: f });
    }
  }
  console.log('Facilities seeded');

  // ── FAQ ─────────────────────────────────────────────
  const faqData = [
    { question: 'Berapa harga kamar di Harmony Home?', answer: 'Harga kamar di Harmony Home dimulai dari Rp1.500.000/bulan untuk Standard Room, Rp2.000.000/bulan untuk Premium Room, dan Rp2.500.000/bulan untuk Executive Room. Harga dapat berbeda tergantung tipe kamar yang dipilih.', sortOrder: 1 },
    { question: 'Apakah listrik sudah termasuk?', answer: 'Untuk Standard Room, listrik menggunakan sistem token mandiri. Untuk Premium dan Executive Room, biaya listrik sudah termasuk dalam biaya sewa bulanan.', sortOrder: 2 },
    { question: 'Apakah WiFi tersedia?', answer: 'Ya, WiFi berkecepatan tinggi tersedia di seluruh area Harmony Home tanpa biaya tambahan. Koneksi internet stabil untuk bekerja maupun bersantai.', sortOrder: 3 },
    { question: 'Apakah kamar mandi berada di dalam?', answer: 'Untuk tipe Premium dan Executive Room, kamar mandi berada di dalam kamar untuk privasi penuh. Untuk Standard Room, kamar mandi bersama tersedia di setiap lantai.', sortOrder: 4 },
    { question: 'Bagaimana proses booking?', answer: 'Pilih tipe kamar yang diinginkan, isi formulir booking dengan data lengkap, lalu ajukan. Pengelola akan menghubungi Anda untuk konfirmasi ketersediaan dan detail pembayaran dalam 1×24 jam.', sortOrder: 5 },
    { question: 'Bagaimana sistem pembayaran?', answer: 'Pembayaran dilakukan di muka setiap bulan melalui transfer bank atau pembayaran digital. Deposit awal diperlukan saat check-in dan akan dikembalikan saat check-out.', sortOrder: 6 },
    { question: 'Apakah kamar bisa dilihat sebelum booking?', answer: 'Tentu. Anda dapat menghubungi pengelola melalui WhatsApp untuk membuat janji survey kamar sebelum melakukan booking. Kami senang menunjukkan langsung kenyamanan Harmony Home.', sortOrder: 7 },
  ];

  for (const f of faqData) {
    const existing = await prisma.faq.findFirst({ where: { question: f.question } });
    if (!existing) {
      await prisma.faq.create({ data: f });
    }
  }
  console.log('FAQ seeded');

  // ── Rules ───────────────────────────────────────────
  const rulesData = [
    { title: 'Jam Bertamu', icon: 'Clock', items: ['Tamu diperbolehkan berkunjung hingga pukul 22.00 WITA.', 'Tamu tidak diperbolehkan menginap selain penghuni terdaftar.', 'Penghuni bertanggung jawab atas tamu yang datang.'], sortOrder: 1 },
    { title: 'Kebersihan', icon: 'Sparkles', items: ['Setiap penghuni wajib menjaga kebersihan kamarnya.', 'Area bersama harus ditinggalkan dalam kondisi bersih.', 'Cleaning service tersedia untuk tipe Executive Room.'], sortOrder: 2 },
    { title: 'Keamanan', icon: 'ShieldCheck', items: ['Pintu utama ditutup pada pukul 23.00 WITA.', 'Akses masuk menggunakan kartu penghuni.', 'Laporkan tamu atau orang asing kepada petugas keamanan.'], sortOrder: 3 },
    { title: 'Parkir', icon: 'Car', items: ['Parkir hanya untuk kendaraan penghuni terdaftar.', 'Tamu parkir di area yang telah ditentukan.', 'Tidak bertanggung jawab atas kerugian kendaraan tanpa pengawasan.'], sortOrder: 4 },
    { title: 'Kebisingan', icon: 'VolumeX', items: ['Jaga ketenangan setelah pukul 22.00 WITA.', 'Volume musik dan suara harus tidak mengganggu penghuni lain.', 'Hindari aktivitas bising di area bersama pada malam hari.'], sortOrder: 5 },
    { title: 'Fasilitas Bersama', icon: 'Sofa', items: ['Gunakan fasilitas bersama dengan bertanggung jawab.', 'Dapur harus dibersihkan setelah digunakan.', 'Ruang bersama ditutup pada pukul 23.00 WITA.'], sortOrder: 6 },
    { title: 'Hewan Peliharaan', icon: 'PawPrint', items: ['Hewan peliharaan tidak diperbolehkan di dalam kamar.', 'Pengecualian untuk hewan kecil dengan izin pengelola.'], sortOrder: 7 },
    { title: 'Pembayaran Sewa', icon: 'Wallet', items: ['Sewa dibayarkan di muka setiap bulan.', 'Keterlambatan pembayaran lebih dari 5 hari dikenakan denda.', 'Deposit dikembalikan saat check-out jika kamar dalam kondisi baik.'], sortOrder: 8 },
  ];

  for (const r of rulesData) {
    const existing = await prisma.rule.findFirst({ where: { title: r.title } });
    if (!existing) {
      await prisma.rule.create({ data: { ...r, description: '' } });
    }
  }
  console.log('Rules seeded');

  // ── Gallery ─────────────────────────────────────────
  const galleryData = [
    { title: 'Eksterior bangunan Harmony Home', imageUrl: 'https://images.pexels.com/photos/12903840/pexels-photo-12903840.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'exterior', sortOrder: 1 },
    { title: 'Tampak depan properti Harmony Home', imageUrl: 'https://images.pexels.com/photos/30580640/pexels-photo-30580640.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'exterior', sortOrder: 2 },
    { title: 'Kamar standard dengan tempat tidur nyaman', imageUrl: 'https://images.pexels.com/photos/6782479/pexels-photo-6782479.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'room', sortOrder: 3 },
    { title: 'Kamar premium dengan TV dan dekorasi minimalis', imageUrl: 'https://images.pexels.com/photos/7587777/pexels-photo-7587777.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'room', sortOrder: 4 },
    { title: 'Kamar premium dengan pencahayaan hangat', imageUrl: 'https://images.pexels.com/photos/8082562/pexels-photo-8082562.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'room', sortOrder: 5 },
    { title: 'Kamar executive dengan headboard mewah', imageUrl: 'https://images.pexels.com/photos/7546276/pexels-photo-7546276.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'room', sortOrder: 6 },
    { title: 'Kamar mandi modern dengan bathtub', imageUrl: 'https://images.pexels.com/photos/6957081/pexels-photo-6957081.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'bathroom', sortOrder: 7 },
    { title: 'Kamar mandi dengan shower dan area cuci', imageUrl: 'https://images.pexels.com/photos/6899357/pexels-photo-6899357.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'bathroom', sortOrder: 8 },
    { title: 'Kamar mandi elegan dengan partisi kaca', imageUrl: 'https://images.pexels.com/photos/7031840/pexels-photo-7031840.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'bathroom', sortOrder: 9 },
    { title: 'Ruang bersama dengan furnitur hangat', imageUrl: 'https://images.pexels.com/photos/12196310/pexels-photo-12196310.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'common-area', sortOrder: 10 },
    { title: 'Ruang bersama dengan sofa dan tanaman', imageUrl: 'https://images.pexels.com/photos/27383726/pexels-photo-27383726.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'common-area', sortOrder: 11 },
    { title: 'Dapur bersama dengan kabinet modern', imageUrl: 'https://images.pexels.com/photos/6265836/pexels-photo-6265836.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'kitchen', sortOrder: 12 },
    { title: 'Dapur minimalis dengan lantai kayu', imageUrl: 'https://images.pexels.com/photos/19899084/pexels-photo-19899084.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'kitchen', sortOrder: 13 },
    { title: 'Area parkir tertutup yang aman', imageUrl: 'https://images.pexels.com/photos/29527707/pexels-photo-29527707.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'parking', sortOrder: 14 },
  ];

  for (const g of galleryData) {
    const existing = await prisma.gallery.findFirst({ where: { title: g.title } });
    if (!existing) {
      await prisma.gallery.create({ data: g });
    }
  }
  console.log('Gallery seeded');

  // ── Testimonials ────────────────────────────────────
  const testimonialData = [
    { name: 'Andi Pratama', role: 'Penghuni Premium Room', rating: 5, content: 'Harmony Home sangat nyaman. Fasilitasnya lengkap dan lingkungannya tenang. Saya bisa fokus bekerja tanpa gangguan.' },
    { name: 'Siti Rahma', role: 'Penghuni Standard Room', rating: 5, content: 'Lokasinya strategis, dekat dengan kampus dan tempat makan. Harganya sangat masuk akal untuk kualitas yang didapat.' },
    { name: 'Budi Santoso', role: 'Penghuni Executive Room', rating: 5, content: 'Kamar executive benar-benar terasa seperti apartemen. Smart TV, AC, dan kamar mandi dalam membuat betah.' },
    { name: 'Dewi Lestari', role: 'Penghuni Premium Room', rating: 5, content: 'Keamanan di sini sangat baik. CCTV dan petugas keamanan bikin tenang. Pengelola juga responsif dan ramah.' },
  ];

  for (const t of testimonialData) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log('Testimonials seeded');

  // ── Site Settings ───────────────────────────────────
  const settingsData = [
    { key: 'site_name', value: 'Harmony Home', group: 'general' },
    { key: 'site_tagline', value: 'Kost Eksklusif untuk Hunian yang Nyaman', group: 'general' },
    { key: 'site_description', value: 'Kost eksklusif dengan fasilitas lengkap, lingkungan nyaman, dan lokasi strategis untuk mendukung aktivitasmu setiap hari.', group: 'general' },
    { key: 'address_street', value: 'Harmony@home, Jl. Perintis Kemerdekaan, Tamalanrea Indah', group: 'contact' },
    { key: 'address_city', value: 'Makassar', group: 'contact' },
    { key: 'address_province', value: 'Sulawesi Selatan', group: 'contact' },
    { key: 'address_postal_code', value: '90245', group: 'contact' },
    { key: 'contact_whatsapp', value: '+6281234567890', group: 'contact' },
    { key: 'contact_whatsapp_display', value: '+62 812-3456-7890', group: 'contact' },
    { key: 'contact_whatsapp_link', value: 'https://wa.me/6281234567890', group: 'contact' },
    { key: 'contact_email', value: 'info@harmonyhome.id', group: 'contact' },
    { key: 'contact_instagram', value: '@harmony.aathome', group: 'contact' },
    { key: 'contact_instagram_link', value: 'https://instagram.com/harmony.aathome', group: 'contact' },
    { key: 'maps_embed_url', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.8231629682127!2d119.47917580000001!3d-5.132164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbefd8bac73a109%3A0x40fa263265eb929e!2sHarmony%40home!5e0!3m2!1sid!2sid!4v1787893789758!5m2!1sid!2sid', group: 'maps' },
    { key: 'maps_link_url', value: 'https://maps.app.goo.gl/7CanPa16jv5fCCCVA', group: 'maps' },
    { key: 'stats_total_rooms', value: '20+', group: 'stats' },
    { key: 'stats_room_types', value: 'Standard & Premium', group: 'stats' },
    { key: 'stats_starting_price', value: 'Rp1.700.000', group: 'stats' },
    { key: 'stats_starting_price_per_month', value: 'Rp1.700.000/bulan', group: 'stats' },
    { key: 'stats_location', value: 'Makassar', group: 'stats' },
  ];

  for (const s of settingsData) {
    const existing = await prisma.siteSetting.findUnique({ where: { key: s.key } });
    if (!existing) {
      await prisma.siteSetting.create({ data: s });
    }
  }
  console.log('Site settings seeded');

  // ── Sample bookings ─────────────────────────────────
  const existingBookings = await prisma.booking.count();
  if (existingBookings === 0) {
    await prisma.booking.createMany({
      data: [
        {
          bookingCode: 'HH-2026-0001',
          roomId: standard.id,
          name: 'Ahmad Rizky',
          email: 'ahmad@email.com',
          phone: '081234567890',
          identityNumber: '7371012304990001',
          address: 'Jl. Sultan Hasanuddin No. 10, Makassar',
          startDate: new Date('2026-09-01'),
          duration: 3,
          durationUnit: 'month',
          totalPrice: 5100000,
          status: BookingStatus.CONFIRMED,
          notes: 'Minta kamar dekat jendela',
        },
        {
          bookingCode: 'HH-2026-0002',
          roomId: premium.id,
          name: 'Nurul Hidayah',
          email: 'nurul@email.com',
          phone: '085678901234',
          startDate: new Date('2026-09-15'),
          duration: 6,
          durationUnit: 'month',
          totalPrice: 12000000,
          status: BookingStatus.PENDING,
        },
        {
          bookingCode: 'HH-2026-0003',
          roomId: executive.id,
          name: 'Farhan Putra',
          email: 'farhan@email.com',
          phone: '087890123456',
          identityNumber: '7371012306980002',
          address: 'Jl. Perintis Kemerdekaan No. 25, Makassar',
          startDate: new Date('2026-08-01'),
          duration: 12,
          durationUnit: 'month',
          totalPrice: 30000000,
          status: BookingStatus.COMPLETED,
          notes: 'Sudah check-out',
        },
      ],
    });
    console.log('Sample bookings seeded');
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
