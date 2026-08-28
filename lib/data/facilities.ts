import {
  Wifi,
  Wind,
  Bath,
  Cctv,
  Car,
  WashingMachine,
  ChefHat,
  Sofa,
  ShieldCheck,
  Zap,
  Droplets,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export interface Facility {
  id: number;
  name: string;
  description: string;
  icon: LucideIcon;
}

export const facilities: Facility[] = [
  {
    id: 1,
    name: 'WiFi Cepat',
    description: 'Koneksi internet berkecepatan tinggi di seluruh area.',
    icon: Wifi,
  },
  {
    id: 2,
    name: 'AC',
    description: 'Pendingin ruangan di setiap kamar premium dan executive.',
    icon: Wind,
  },
  {
    id: 3,
    name: 'Kamar Mandi Dalam',
    description: 'Privasi penuh dengan kamar mandi di dalam kamar.',
    icon: Bath,
  },
  {
    id: 4,
    name: 'CCTV 24 Jam',
    description: 'Pengawasan keamanan sepanjang hari di area umum.',
    icon: Cctv,
  },
  {
    id: 5,
    name: 'Area Parkir',
    description: 'Tempat parkir aman untuk kendaraan penghuni.',
    icon: Car,
  },
  {
    id: 6,
    name: 'Laundry',
    description: 'Layanan cuci dan setrika untuk kemudahan harian.',
    icon: WashingMachine,
  },
  {
    id: 7,
    name: 'Dapur Bersama',
    description: 'Dapur lengkap untuk memasak bersama penghuni lain.',
    icon: ChefHat,
  },
  {
    id: 8,
    name: 'Ruang Bersama',
    description: 'Area santai untuk bersosialisasi dan beristirahat.',
    icon: Sofa,
  },
  {
    id: 9,
    name: 'Keamanan',
    description: 'Petugas keamanan dan akses terkontrol 24 jam.',
    icon: ShieldCheck,
  },
  {
    id: 10,
    name: 'Listrik',
    description: 'Pasokan listrik stabil dengan sistem token mandiri.',
    icon: Zap,
  },
  {
    id: 11,
    name: 'Air Bersih',
    description: 'Pasokan air bersih mengalir sepanjang waktu.',
    icon: Droplets,
  },
  {
    id: 12,
    name: 'Cleaning Service',
    description: 'Layanan kebersihan kamar untuk tipe executive.',
    icon: Sparkles,
  },
];
