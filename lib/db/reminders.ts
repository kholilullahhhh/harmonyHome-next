import { prisma } from '@/lib/db/prisma';
import {
  isEmailConfigured,
  reminderStageForDelta,
  sendReminderEmail,
} from '@/lib/email';
import {
  addDaysToDateOnly,
  businessDateString,
  daysBetween,
  formatPeriodLabel,
  formatRupiah,
  toAnchorDate,
  toDateString,
  type DateOnly,
} from '@/lib/payment-dates';

/** How many days before the due date the reminder window opens (H-3). */
const REMINDER_WINDOW_DAYS = 3;

export interface ReminderRunResult {
  status: 'sent' | 'skipped';
  checked: number;
  sent: number;
  failed: number;
  message?: string;
}

function portalUrl(): string {
  const base =
    process.env.NEXTAUTH_URL?.replace(/\/+$/, '') ||
    process.env.SITE_URL?.replace(/\/+$/, '') ||
    'http://localhost:3000';
  return `${base}/pembayaran`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Sends due reminder emails (H-3, H-1, Hari H) for unpaid bills whose due
 * date falls inside the reminder window, and records every successful send
 * in `payment_reminders`.
 *
 * Idempotency: the row is *claimed* first with `skipDuplicates` — if another
 * trigger already claimed this (paymentId, stage) we send nothing; if the
 * SMTP call then fails the claim is released so a later run can retry.
 * Safe to call from both the cron endpoint and admin page loads.
 */
export async function runPaymentReminders(
  today: DateOnly = businessDateString()
): Promise<ReminderRunResult> {
  if (!isEmailConfigured()) {
    return {
      status: 'skipped',
      checked: 0,
      sent: 0,
      failed: 0,
      message: 'SMTP belum dikonfigurasi (SMTP_HOST kosong); email tidak dikirim.',
    };
  }

  // Reminder window: due date today … today + H-3 (H-3/H-1/Hari H).
  const windowStart = toAnchorDate(today);
  const windowEnd = toAnchorDate(addDaysToDateOnly(today, REMINDER_WINDOW_DAYS));

  const candidates = await prisma.monthlyPayment.findMany({
    where: {
      paidAt: null,
      dueDate: { gte: windowStart, lte: windowEnd },
    },
    include: { booking: { include: { room: true } } },
    orderBy: [{ periodYear: 'asc' }, { periodMonth: 'asc' }],
  });

  let sent = 0;
  let failed = 0;

  for (const payment of candidates) {
    const stage = reminderStageForDelta(daysBetween(today, toDateString(payment.dueDate)));
    if (!stage) continue;

    const email = payment.booking.email.trim();
    if (!isValidEmail(email)) {
      failed += 1;
      console.error(
        `Payment reminder skipped for ${payment.booking.bookingCode}: email tidak valid (${email}).`
      );
      continue;
    }

    const claim = await prisma.paymentReminder.createMany({
      data: [{ paymentId: payment.id, stage, email }],
      skipDuplicates: true,
    });
    if (claim.count === 0) continue; // already claimed (and being/sent) elsewhere

    try {
      await sendReminderEmail({
        to: email,
        tenantName: payment.booking.name,
        roomName: payment.booking.room.name,
        bookingCode: payment.booking.bookingCode,
        periodYear: payment.periodYear,
        periodMonth: payment.periodMonth,
        amount: payment.amount,
        dueDate: toDateString(payment.dueDate),
        stage,
        portalUrl: portalUrl(),
      });
      sent += 1;
      console.log(
        `Payment reminder ${stage} terkirim ke ${email} (${payment.booking.bookingCode}, ${formatPeriodLabel(payment.periodYear, payment.periodMonth)}, ${formatRupiah(payment.amount)}).`
      );
    } catch (error) {
      failed += 1;
      // Release the claim so the next run can retry this stage.
      await prisma.paymentReminder
        .deleteMany({ where: { paymentId: payment.id, stage } })
        .catch(() => undefined);
      console.error(
        `Payment reminder ${stage} gagal dikirim ke ${email} (${payment.booking.bookingCode}):`,
        error
      );
    }
  }

  return { status: 'sent', checked: candidates.length, sent, failed };
}

/** Fire-and-forget wrapper for admin pages: never throws, never blocks on config. */
export async function maybeRunPaymentReminders(): Promise<ReminderRunResult | null> {
  try {
    return await runPaymentReminders();
  } catch (error) {
    console.error('Payment reminder run failed:', error);
    return null;
  }
}
