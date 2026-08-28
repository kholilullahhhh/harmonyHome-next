export type GalleryCategory =
  | 'exterior'
  | 'room'
  | 'bathroom'
  | 'common-area'
  | 'kitchen'
  | 'parking';

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: GalleryCategory;
  categoryLabel: string;
}

export const galleryCategories: {
  value: GalleryCategory | 'all';
  label: string;
}[] = [
  { value: 'all', label: 'Semua' },
  { value: 'exterior', label: 'Eksterior' },
  { value: 'room', label: 'Kamar' },
  { value: 'bathroom', label: 'Kamar Mandi' },
  { value: 'common-area', label: 'Ruang Bersama' },
  { value: 'kitchen', label: 'Dapur' },
  { value: 'parking', label: 'Area Parkir' },
];

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: 'https://images.pexels.com/photos/12903840/pexels-photo-12903840.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Eksterior bangunan Harmony Home',
    category: 'exterior',
    categoryLabel: 'Eksterior',
  },
  {
    id: 2,
    src: 'https://images.pexels.com/photos/30580640/pexels-photo-30580640.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Tampak depan properti Harmony Home',
    category: 'exterior',
    categoryLabel: 'Eksterior',
  },
  {
    id: 3,
    src: 'https://images.pexels.com/photos/6782479/pexels-photo-6782479.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Kamar standard dengan tempat tidur nyaman',
    category: 'room',
    categoryLabel: 'Kamar',
  },
  {
    id: 4,
    src: 'https://images.pexels.com/photos/7587777/pexels-photo-7587777.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Kamar premium dengan TV dan dekorasi minimalis',
    category: 'room',
    categoryLabel: 'Kamar',
  },
  {
    id: 5,
    src: 'https://images.pexels.com/photos/8082562/pexels-photo-8082562.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Kamar premium dengan pencahayaan hangat',
    category: 'room',
    categoryLabel: 'Kamar',
  },
  {
    id: 6,
    src: 'https://images.pexels.com/photos/7546276/pexels-photo-7546276.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Kamar executive dengan headboard mewah',
    category: 'room',
    categoryLabel: 'Kamar',
  },
  {
    id: 7,
    src: 'https://images.pexels.com/photos/6957081/pexels-photo-6957081.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Kamar mandi modern dengan bathtub',
    category: 'bathroom',
    categoryLabel: 'Kamar Mandi',
  },
  {
    id: 8,
    src: 'https://images.pexels.com/photos/6899357/pexels-photo-6899357.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Kamar mandi dengan shower dan area cuci',
    category: 'bathroom',
    categoryLabel: 'Kamar Mandi',
  },
  {
    id: 9,
    src: 'https://images.pexels.com/photos/7031840/pexels-photo-7031840.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Kamar mandi elegan dengan partisi kaca',
    category: 'bathroom',
    categoryLabel: 'Kamar Mandi',
  },
  {
    id: 10,
    src: 'https://images.pexels.com/photos/12196310/pexels-photo-12196310.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Ruang bersama dengan furnitur hangat',
    category: 'common-area',
    categoryLabel: 'Ruang Bersama',
  },
  {
    id: 11,
    src: 'https://images.pexels.com/photos/27383726/pexels-photo-27383726.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Ruang bersama dengan sofa dan tanaman',
    category: 'common-area',
    categoryLabel: 'Ruang Bersama',
  },
  {
    id: 12,
    src: 'https://images.pexels.com/photos/6265836/pexels-photo-6265836.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Dapur bersama dengan kabinet modern',
    category: 'kitchen',
    categoryLabel: 'Dapur',
  },
  {
    id: 13,
    src: 'https://images.pexels.com/photos/19899084/pexels-photo-19899084.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Dapur minimalis dengan lantai kayu',
    category: 'kitchen',
    categoryLabel: 'Dapur',
  },
  {
    id: 14,
    src: 'https://images.pexels.com/photos/29527707/pexels-photo-29527707.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Area parkir tertutup yang aman',
    category: 'parking',
    categoryLabel: 'Area Parkir',
  },
];
