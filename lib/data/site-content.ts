export interface NearbyPlace {
  id: number;
  name: string;
  distance: string;
  icon: string;
}

export const nearbyPlaces: NearbyPlace[] = [
  { id: 1, name: 'Kampus Universitas', distance: '5 menit', icon: 'GraduationCap' },
  { id: 2, name: 'Minimarket', distance: '3 menit', icon: 'ShoppingBag' },
  { id: 3, name: 'Rumah Sakit', distance: '7 menit', icon: 'Hospital' },
  { id: 4, name: 'ATM / Bank', distance: '4 menit', icon: 'CreditCard' },
  { id: 5, name: 'Tempat Makan', distance: '5 menit', icon: 'UtensilsCrossed' },
  { id: 6, name: 'Pusat Kota', distance: '10 menit', icon: 'Building2' },
  { id: 7, name: 'Halte Transportasi', distance: '6 menit', icon: 'Bus' },
  { id: 8, name: 'Apotek', distance: '4 menit', icon: 'Pill' },
];

export interface BookingStep {
  id: number;
  step: string;
  title: string;
  description: string;
}

export const bookingSteps: BookingStep[] = [
  {
    id: 1,
    step: '01',
    title: 'Pilih Kamar',
    description: 'Pilih tipe kamar yang sesuai dengan kebutuhan dan anggaranmu.',
  },
  {
    id: 2,
    step: '02',
    title: 'Isi Data',
    description: 'Masukkan informasi calon penghuni dengan lengkap dan benar.',
  },
  {
    id: 3,
    step: '03',
    title: 'Konfirmasi',
    description: 'Periksa detail booking sebelum diajukan ke pengelola.',
  },
  {
    id: 4,
    step: '04',
    title: 'Selesai',
    description: 'Tunggu konfirmasi dari pengelola dalam 1×24 jam.',
  },
];

export interface Advantage {
  id: number;
  number: string;
  title: string;
  description: string;
  icon: string;
}

export const advantages: Advantage[] = [
  {
    id: 1,
    number: '01',
    title: 'Privasi & Kenyamanan',
    description:
      'Ruang pribadi yang dirancang untuk memberikan kenyamanan maksimal.',
    icon: 'Lock',
  },
  {
    id: 2,
    number: '02',
    title: 'Fasilitas Lengkap',
    description: 'Semua kebutuhan utama tersedia dalam satu tempat.',
    icon: 'CheckCircle2',
  },
  {
    id: 3,
    number: '03',
    title: 'Lingkungan Aman',
    description: 'Sistem keamanan dan lingkungan yang nyaman untuk penghuni.',
    icon: 'ShieldCheck',
  },
  {
    id: 4,
    number: '04',
    title: 'Lokasi Strategis',
    description: 'Dekat dengan berbagai fasilitas dan pusat aktivitas.',
    icon: 'MapPin',
  },
];
