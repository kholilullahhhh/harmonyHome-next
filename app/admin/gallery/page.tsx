import { getAllGallery } from '@/lib/db/queries';
import { GalleryListPage } from '@/components/admin/GalleryListPage';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  const gallery = await getAllGallery();

  return <GalleryListPage gallery={gallery} />;
}
