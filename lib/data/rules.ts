export interface RuleGroup {
  id: number;
  title: string;
  icon: string;
  items: string[];
}

export const ruleGroups: RuleGroup[] = [
  {
    id: 1,
    title: 'Jam Bertamu',
    icon: 'Clock',
    items: [
      'Tamu diperbolehkan berkunjung hingga pukul 22.00 WITA.',
      'Tamu tidak diperbolehkan menginap selain penghuni terdaftar.',
      'Penghuni bertanggung jawab atas tamu yang datang.',
    ],
  },
  {
    id: 2,
    title: 'Kebersihan',
    icon: 'Sparkles',
    items: [
      'Setiap penghuni wajib menjaga kebersihan kamarnya.',
      'Area bersama harus ditinggalkan dalam kondisi bersih.',
      'Cleaning service tersedia untuk tipe Executive Room.',
    ],
  },
  {
    id: 3,
    title: 'Keamanan',
    icon: 'ShieldCheck',
    items: [
      'Pintu utama ditutup pada pukul 23.00 WITA.',
      'Akses masuk menggunakan kartu penghuni.',
      'Laporkan tamu atau orang asing kepada petugas keamanan.',
    ],
  },
  {
    id: 4,
    title: 'Parkir',
    icon: 'Car',
    items: [
      'Parkir hanya untuk kendaraan penghuni terdaftar.',
      'Tamu parkir di area yang telah ditentukan.',
      'Tidak bertanggung jawab atas kerugian kendaraan tanpa pengawasan.',
    ],
  },
  {
    id: 5,
    title: 'Kebisingan',
    icon: 'VolumeX',
    items: [
      'Jaga ketenangan setelah pukul 22.00 WITA.',
      'Volume musik dan suara harus tidak mengganggu penghuni lain.',
      'Hindari aktivitas bising di area bersama pada malam hari.',
    ],
  },
  {
    id: 6,
    title: 'Fasilitas Bersama',
    icon: 'Sofa',
    items: [
      'Gunakan fasilitas bersama dengan bertanggung jawab.',
      'Dapur harus dibersihkan setelah digunakan.',
      'Ruang bersama ditutup pada pukul 23.00 WITA.',
    ],
  },
  {
    id: 7,
    title: 'Hewan Peliharaan',
    icon: 'PawPrint',
    items: [
      'Hewan peliharaan tidak diperbolehkan di dalam kamar.',
      'Pengecualian untuk hewan kecil dengan izin pengelola.',
    ],
  },
  {
    id: 8,
    title: 'Pembayaran Sewa',
    icon: 'Wallet',
    items: [
      'Sewa dibayarkan di muka setiap bulan.',
      'Keterlambatan pembayaran lebih dari 5 hari dikenakan denda.',
      'Deposit dikembalikan saat check-out jika kamar dalam kondisi baik.',
    ],
  },
];
