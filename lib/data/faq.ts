export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    id: 'price',
    question: 'Berapa harga kamar di Harmony Home?',
    answer:
      'Harga kamar di Harmony Home dimulai dari Rp1.500.000/bulan untuk Standard Room, Rp2.000.000/bulan untuk Premium Room, dan Rp2.500.000/bulan untuk Executive Room. Harga dapat berbeda tergantung tipe kamar yang dipilih.',
  },
  {
    id: 'electricity',
    question: 'Apakah listrik sudah termasuk?',
    answer:
      'Untuk Standard Room, listrik menggunakan sistem token mandiri. Untuk Premium dan Executive Room, biaya listrik sudah termasuk dalam biaya sewa bulanan.',
  },
  {
    id: 'wifi',
    question: 'Apakah WiFi tersedia?',
    answer:
      'Ya, WiFi berkecepatan tinggi tersedia di seluruh area Harmony Home tanpa biaya tambahan. Koneksi internet stabil untuk bekerja maupun bersantai.',
  },
  {
    id: 'bathroom',
    question: 'Apakah kamar mandi berada di dalam?',
    answer:
      'Untuk tipe Premium dan Executive Room, kamar mandi berada di dalam kamar untuk privasi penuh. Untuk Standard Room, kamar mandi bersama tersedia di setiap lantai.',
  },
  {
    id: 'parking',
    question: 'Apakah tersedia tempat parkir?',
    answer:
      'Ya, area parkir aman tersedia untuk seluruh penghuni Harmony Home, baik untuk sepeda motor maupun mobil.',
  },
  {
    id: 'min-lease',
    question: 'Berapa minimal masa sewa?',
    answer:
      'Minimal masa sewa di Harmony Home adalah 1 bulan. Tersedia juga opsi sewa 3 bulan dan 6 bulan dengan diskon khusus.',
  },
  {
    id: 'couple',
    question: 'Apakah boleh membawa pasangan?',
    answer:
      'Harmony Home mengutamakan kenyamanan dan privasi seluruh penghuni. Tamu diperbolehkan berkunjung hingga pukul 22.00, namun tidak diperbolehkan menginap selain penghuni terdaftar.',
  },
  {
    id: 'booking-process',
    question: 'Bagaimana proses booking?',
    answer:
      'Pilih tipe kamar yang diinginkan, isi formulir booking dengan data lengkap, lalu ajukan. Pengelola akan menghubungi Anda untuk konfirmasi ketersediaan dan detail pembayaran dalam 1×24 jam.',
  },
  {
    id: 'payment',
    question: 'Bagaimana sistem pembayaran?',
    answer:
      'Pembayaran dilakukan di muka setiap bulan melalui transfer bank atau pembayaran digital. Deposit awal diperlukan saat check-in dan akan dikembalikan saat check-out.',
  },
  {
    id: 'view-room',
    question: 'Apakah kamar bisa dilihat sebelum booking?',
    answer:
      'Tentu. Anda dapat menghubungi pengelola melalui WhatsApp untuk membuat janji survey kamar sebelum melakukan booking. Kami senang menunjukkan langsung kenyamanan Harmony Home.',
  },
];
