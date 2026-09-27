import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { runPaymentReminders } from '@/lib/db/reminders';

export const dynamic = 'force-dynamic';

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Scheduled reminder run (H-3 / H-1 / Hari H).
 * Call it from a cron job or Netlify Scheduled Function with the
 * `x-cron-secret` header (or `?secret=`) matching CRON_SECRET.
 * Admin page loads also run the same job lazily, so a missed
 * schedule never strands an unsent reminder.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET belum dikonfigurasi di server.' },
      { status: 503 }
    );
  }

  const url = new URL(request.url);
  const provided =
    request.headers.get('x-cron-secret') ?? url.searchParams.get('secret') ?? '';

  if (!safeEqual(provided, secret)) {
    return NextResponse.json({ error: 'Secret cron tidak valid.' }, { status: 401 });
  }

  try {
    const result = await runPaymentReminders();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error('Cron payment reminders error:', error);
    return NextResponse.json({ error: 'Gagal menjalankan pengingat.' }, { status: 500 });
  }
}
