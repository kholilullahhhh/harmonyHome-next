import type { Metadata } from 'next';
import { Suspense } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { BookingForm } from '@/components/BookingForm';

export const metadata: Metadata = {
  title: 'Booking Kamar',
  description:
    'Ajukan booking kamar di Harmony Home. Isi data penghuni dan detail booking, pengelola akan menghubungi Anda dalam 1×24 jam.',
};

export default function BookingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Booking"
        title="Booking Kamar"
        description="Lengkapi formulir di bawah untuk mengajukan booking kamar di Harmony Home."
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl container-px">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            }
          >
            <BookingForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
