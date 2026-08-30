import { getAllTestimonials } from '@/lib/db/queries';
import { TestimonialsListPage } from '@/components/admin/TestimonialsListPage';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return <TestimonialsListPage testimonials={testimonials} />;
}
