export interface Testimonial {
  id: number;
  name: string;
  role: string;
  rating: number;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Andi Pratama',
    role: 'Penghuni Premium Room',
    rating: 5,
    quote:
      'Harmony Home sangat nyaman. Fasilitasnya lengkap dan lingkungannya tenang. Saya bisa fokus bekerja tanpa gangguan.',
  },
  {
    id: 2,
    name: 'Siti Rahma',
    role: 'Penghuni Standard Room',
    rating: 5,
    quote:
      'Lokasinya strategis, dekat dengan kampus dan tempat makan. Harganya sangat masuk akal untuk kualitas yang didapat.',
  },
  {
    id: 3,
    name: 'Budi Santoso',
    role: 'Penghuni Executive Room',
    rating: 5,
    quote:
      'Kamar executive benar-benar terasa seperti apartemen. Smart TV, AC, dan kamar mandi dalam membuat betah.',
  },
  {
    id: 4,
    name: 'Dewi Lestari',
    role: 'Penghuni Premium Room',
    rating: 5,
    quote:
      'Keamanan di sini sangat baik. CCTV dan petugas keamanan bikin tenang. Pengelola juga responsif dan ramah.',
  },
];
