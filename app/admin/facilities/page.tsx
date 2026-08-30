import { getAllFacilities } from '@/lib/db/queries';
import { FacilitiesListPage } from '@/components/admin/FacilitiesListPage';

export const dynamic = 'force-dynamic';

export default async function AdminFacilitiesPage() {
  const facilities = await getAllFacilities();

  return <FacilitiesListPage facilities={facilities} />;
}
