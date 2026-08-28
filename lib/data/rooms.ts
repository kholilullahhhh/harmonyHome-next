export const siteConfig = {
  name: 'Harmony Home',
  tagline: 'Kost Eksklusif untuk Hunian yang Nyaman',
  description:
    'Kost eksklusif dengan fasilitas lengkap, lingkungan nyaman, dan lokasi strategis untuk mendukung aktivitasmu setiap hari.',
  address: {
    street: 'Jl. Bunga Melati No. 123',
    city: 'Makassar',
    province: 'Sulawesi Selatan',
    postalCode: '90111',
    full: 'Jl. Bunga Melati No. 123, Makassar, Sulawesi Selatan',
  },
  contact: {
    whatsapp: '+6281234567890',
    whatsappDisplay: '+62 812-3456-7890',
    whatsappLink: 'https://wa.me/6281234567890',
    email: 'info@harmonyhome.id',
    instagram: '@harmonyhome.id',
    instagramLink: 'https://instagram.com/harmonyhome.id',
  },
  maps: {
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.7!2d119.4!3d-5.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsOwMDYnMDAuMCJTIDExOcOwMjQnMDAuMCJF!5e0!3m2!1sen!2sid!4v1700000000000',
    linkUrl: 'https://maps.google.com/?q=Makassar',
  },
  stats: {
    totalRooms: '20+',
    roomTypes: 'Standard & Premium',
    startingPrice: 'Rp1.500.000',
    startingPricePerMonth: 'Rp1.500.000/bulan',
    location: 'Makassar',
  },
} as const;

export type RoomStatus = 'available' | 'limited' | 'full';

export interface Room {
  id: number;
  slug: string;
  name: string;
  type: string;
  price: number;
  priceLabel: string;
  size: string;
  capacity: number;
  status: RoomStatus;
  availableCount: number;
  totalCount: number;
  shortDescription: string;
  description: string;
  facilities: string[];
  rules: string[];
  paymentInfo: string[];
  images: string[];
}

export const roomStatusMap: Record<
  RoomStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  available: {
    label: 'Tersedia',
    badgeClass:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
    dotClass: 'bg-emerald-500',
  },
  limited: {
    label: 'Terbatas',
    badgeClass:
      'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900',
    dotClass: 'bg-amber-500',
  },
  full: {
    label: 'Penuh',
    badgeClass:
      'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-900',
    dotClass: 'bg-rose-500',
  },
};

export const rooms: Room[] = [
  {
    id: 1,
    slug: 'standard',
    name: 'Standard Room',
    type: 'TYPE A — STANDARD',
    price: 1500000,
    priceLabel: 'Rp1.500.000 / bulan',
    size: '3m × 4m',
    capacity: 1,
    status: 'available',
    availableCount: 6,
    totalCount: 10,
    shortDescription:
      'Kamar nyaman dengan fasilitas dasar lengkap untuk hunian harian.',
    description:
      'Standard Room dirancang untuk memberikan kenyamanan dasar dengan fasilitas yang lengkap. Cocok untuk kamu yang mencari hunian praktis dengan harga terjangkau namun tetap mendapatkan kualitas dari Harmony Home. Setiap kamar dilengkapi dengan kasur, lemari, dan meja untuk mendukung aktivitas harianmu.',
    facilities: [
      'Kasur',
      'Lemari',
      'Meja',
      'WiFi',
      'Kamar mandi',
      'CCTV area umum',
      'Area parkir',
    ],
    rules: [
      'Dilarang merokok di dalam kamar',
      'Jam bertamu hingga pukul 22.00',
      'Jaga kebersihan kamar',
    ],
    paymentInfo: [
      'Pembayaran di muka per bulan',
      'Deposit Rp500.000 (dikembalikan saat checkout)',
      'Listrik token mandiri',
    ],
    images: [
      'https://images.pexels.com/photos/6782479/pexels-photo-6782479.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/8135505/pexels-photo-8135505.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/6899357/pexels-photo-6899357.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
  {
    id: 2,
    slug: 'premium',
    name: 'Premium Room',
    type: 'TYPE B — PREMIUM',
    price: 2000000,
    priceLabel: 'Rp2.000.000 / bulan',
    size: '4m × 5m',
    capacity: 1,
    status: 'available',
    availableCount: 3,
    totalCount: 7,
    shortDescription:
      'Kamar luas dengan AC dan kamar mandi dalam untuk kenyamanan ekstra.',
    description:
      'Premium Room menawarkan ruang yang lebih luas dengan kamar mandi di dalam untuk privasi maksimal. Dilengkapi AC dan meja kerja yang nyaman, kamar ini cocok untuk kamu yang menginginkan hunian dengan kualitas premium. Setiap detail dirancang untuk mendukung produktivitas dan kenyamanan istirahatmu.',
    facilities: [
      'Kasur premium',
      'Lemari',
      'Meja kerja',
      'AC',
      'WiFi',
      'Kamar mandi dalam',
      'CCTV area umum',
      'Area parkir',
    ],
    rules: [
      'Dilarang merokok di dalam kamar',
      'Jam bertamu hingga pukul 22.00',
      'Jaga kebersihan kamar',
      'Hemat penggunaan AC',
    ],
    paymentInfo: [
      'Pembayaran di muka per bulan',
      'Deposit Rp750.000 (dikembalikan saat checkout)',
      'Listrik termasuk dalam biaya sewa',
    ],
    images: [
      'https://images.pexels.com/photos/7587777/pexels-photo-7587777.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/8082562/pexels-photo-8082562.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/6957081/pexels-photo-6957081.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
  {
    id: 3,
    slug: 'executive',
    name: 'Executive Room',
    type: 'TYPE C — EXECUTIVE',
    price: 2500000,
    priceLabel: 'Rp2.500.000 / bulan',
    size: '5m × 5m',
    capacity: 1,
    status: 'limited',
    availableCount: 2,
    totalCount: 3,
    shortDescription:
      'Kamar terbaik dengan Smart TV dan seluruh fasilitas premium.',
    description:
      'Executive Room adalah tipe kamar tertinggi di Harmony Home. Dengan ukuran yang luas, Smart TV, dan seluruh fasilitas premium, kamar ini memberikan pengalaman hunian layaknya apartemen eksklusif. Hanya tersedia dalam jumlah terbatas, membuatnya menjadi pilihan istimewa bagi penghuni yang mengutamakan kualitas dan privasi.',
    facilities: [
      'Kasur premium',
      'AC',
      'Smart TV',
      'WiFi',
      'Kamar mandi dalam',
      'Meja kerja',
      'Lemari',
      'CCTV area umum',
      'Area parkir',
    ],
    rules: [
      'Dilarang merokok di dalam kamar',
      'Jam bertamu hingga pukul 22.00',
      'Jaga kebersihan kamar',
      'Hemat penggunaan AC',
      'Bertanggung jawab atas perangkat elektronik',
    ],
    paymentInfo: [
      'Pembayaran di muka per bulan',
      'Deposit Rp1.000.000 (dikembalikan saat checkout)',
      'Listrik & air termasuk dalam biaya sewa',
      'Cleaning service 2x seminggu',
    ],
    images: [
      'https://images.pexels.com/photos/7546276/pexels-photo-7546276.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/7195720/pexels-photo-7195720.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/7031840/pexels-photo-7031840.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
];

export function getRoomBySlug(slug: string): Room | undefined {
  return rooms.find((r) => r.slug === slug);
}

export function formatPrice(price: number): string {
  return 'Rp' + price.toLocaleString('id-ID');
}
