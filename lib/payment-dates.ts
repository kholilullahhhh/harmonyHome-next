// Pure date helpers for the monthly rent-payment feature.
// No Prisma / server-only imports so this module is safe for both
// server components and client components.
//
// Business dates are always handled as `YYYY-MM-DD` strings (or as
// Date instances anchored at 12:00 UTC) so no calendar day is ever
// shifted by a timezone offset.

export const BUSINESS_TIME_ZONE = 'Asia/Makassar';

export type DateOnly = string; // 'YYYY-MM-DD'
export type PeriodKey = { year: number; month: number }; // month: 1-12

export type PaymentDisplayStatus = 'PAID' | 'DUE_TODAY' | 'OVERDUE' | 'UPCOMING';
export type PaymentStoredStatus = 'PAID' | 'UNPAID' | 'OVERDUE';

export const MONTH_NAMES_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Calendar date of a Date in UTC (values are anchored at noon UTC). */
export function toDateString(date: Date): DateOnly {
  const y = String(date.getUTCFullYear()).padStart(4, '0');
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Current calendar date for the business timezone (Asia/Makassar). */
export function businessDateString(now: Date = new Date()): DateOnly {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: BUSINESS_TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);
  } catch {
    return toDateString(now);
  }
}

export function isDateOnly(value: string): boolean {
  return DATE_ONLY_RE.test(value);
}

/** Format check + real calendar check (rejects e.g. 2026-02-31). */
export function isValidCalendarDate(value: string): boolean {
  if (!isDateOnly(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (month < 1 || month > 12 || day < 1) return false;
  if (day > daysInMonth(year, month)) return false;
  const probe = new Date(Date.UTC(year, month - 1, day));
  return (
    probe.getUTCFullYear() === year &&
    probe.getUTCMonth() === month - 1 &&
    probe.getUTCDate() === day
  );
}

export function parseDateOnly(value: DateOnly): { year: number; month: number; day: number } {
  if (!isDateOnly(value)) {
    throw new Error(`Tanggal tidak valid: ${value}`);
  }
  const [year, month, day] = value.split('-').map(Number);
  return { year, month, day };
}

/** Anchor a business date at 12:00 UTC so it never rolls to a neighbour day. */
export function toAnchorDate(value: DateOnly): Date {
  const { year, month, day } = parseDateOnly(value);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
}

/** Accepts 'YYYY-MM-DD' or a full ISO timestamp and returns a business date. */
export function toBusinessDate(value: string): DateOnly {
  if (isDateOnly(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Tanggal tidak valid: ${value}`);
  }
  return toDateString(date);
}

/** Add (or subtract) months to a business date, clamping the day of month. */
export function addMonthsToDateOnly(value: DateOnly, months: number): DateOnly {
  const { year, month, day } = parseDateOnly(value);
  const target = new Date(Date.UTC(year, month - 1 + months, 1, 12));
  const tYear = target.getUTCFullYear();
  const tMonth = target.getUTCMonth() + 1;
  const lastDay = daysInMonth(tYear, tMonth);
  const d = Math.min(day, lastDay);
  return `${tYear}-${String(tMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Add (or subtract) days to a business date (noon-anchored, no timezone drift). */
export function addDaysToDateOnly(value: DateOnly, days: number): DateOnly {
  const { year, month, day } = parseDateOnly(value);
  const target = new Date(Date.UTC(year, month - 1, day + days, 12));
  return toDateString(target);
}

/** Whole days from `from` to `to` (positive when `to` is later). */
export function daysBetween(from: DateOnly, to: DateOnly): number {
  const a = parseDateOnly(from);
  const b = parseDateOnly(to);
  const ms =
    Date.UTC(b.year, b.month - 1, b.day) - Date.UTC(a.year, a.month - 1, a.day);
  return Math.round(ms / 86_400_000);
}

export function compareDateOnly(a: DateOnly, b: DateOnly): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

/**
 * Due date of a billing period. The day is clamped to the last day of the
 * month, so dueDay = 31 on April becomes 30 April and on February becomes
 * 28/29 February — never an invalid date.
 */
export function calculateDueDateString(
  year: number,
  month: number,
  dueDay: number
): DateOnly {
  const clampedDay = Math.min(Math.max(dueDay, 1), daysInMonth(year, month));
  return `${year}-${String(month).padStart(2, '0')}-${String(clampedDay).padStart(2, '0')}`;
}

export function formatTanggal(value: string, style: 'long' | 'short' = 'long'): string {
  const dateOnly = toBusinessDate(value);
  const { year, month, day } = parseDateOnly(dateOnly);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  });
}

export function formatPeriodLabel(year: number, month: number): string {
  const name = MONTH_NAMES_ID[month - 1] ?? String(month);
  return `${name} ${year}`;
}

export function formatRupiah(amount: number): string {
  return 'Rp' + amount.toLocaleString('id-ID');
}

// ── Booking-derived values (contract price, never client input) ──────────────

export interface BillingSource {
  startDate: Date | string;
  duration: number;
  durationUnit: string;
  totalPrice: number;
  paymentDueDay?: number | null;
}

export function getDurationMonths(duration: number, durationUnit: string): number {
  const unit = (durationUnit || 'month').toLowerCase();
  if (unit === 'month') return Math.max(1, duration);
  return Math.max(1, Math.ceil(duration / 30));
}

export function getDueDay(booking: BillingSource): number {
  const startDate =
    typeof booking.startDate === 'string'
      ? new Date(booking.startDate)
      : booking.startDate;
  if (booking.paymentDueDay && booking.paymentDueDay >= 1 && booking.paymentDueDay <= 31) {
    return booking.paymentDueDay;
  }
  return startDate.getUTCDate();
}

/** Monthly rent of the contract: totalPrice / duration — never room price. */
export function getMonthlyAmount(booking: BillingSource): number {
  const months = getDurationMonths(booking.duration, booking.durationUnit);
  return Math.round(booking.totalPrice / months);
}

export interface BillingPeriod extends PeriodKey {
  dueDate: DateOnly;
}

/**
 * Billing periods that must exist for a booking today.
 *
 * - periods start at the booking's start month,
 * - a period whose due date falls before the move-in date is skipped,
 * - periods never run past the end of the contract,
 * - only the period covering today (plus the very first period when it is
 *   not due yet) is generated — no bills for months ahead.
 */
export function planBillingPeriods(
  booking: BillingSource,
  today: DateOnly = businessDateString()
): BillingPeriod[] {
  const startDate = toBusinessDate(
    typeof booking.startDate === 'string' ? booking.startDate : toDateString(booking.startDate)
  );
  const dueDay = getDueDay(booking);
  const tenureEnd = addMonthsToDateOnly(
    startDate,
    getDurationMonths(booking.duration, booking.durationUnit)
  );

  let cursor = `${startDate.slice(0, 7)}-01`;
  const periods: BillingPeriod[] = [];

  // Skip any period that would be due before the tenant moves in.
  let skipGuard = 0;
  while (
    compareDateOnly(calculateDueDateStringOf(cursor, dueDay), startDate) < 0 &&
    skipGuard < 240
  ) {
    skipGuard += 1;
    cursor = addMonthsToDateOnly(cursor, 1);
  }

  let guard = 0;
  while (guard < 240) {
    guard += 1;
    const dueDate = calculateDueDateStringOf(cursor, dueDay);
    if (compareDateOnly(dueDate, tenureEnd) >= 0) break;
    if (compareDateOnly(dueDate, today) > 0 && periods.length > 0) break;

    const { year, month } = parseDateOnly(cursor);
    periods.push({ year, month, dueDate });
    cursor = addMonthsToDateOnly(cursor, 1);
  }

  return periods;
}

function calculateDueDateStringOf(cursorFirstDay: DateOnly, dueDay: number): DateOnly {
  const { year, month } = parseDateOnly(cursorFirstDay);
  return calculateDueDateString(year, month, dueDay);
}

/** The period covering `today` for a booking (null when the contract has not started). */
export function getCurrentBillingPeriod(
  booking: BillingSource,
  today: DateOnly = businessDateString()
): BillingPeriod | null {
  const periods = planBillingPeriods(booking, today);
  return periods.length > 0 ? periods[periods.length - 1] : null;
}

// ── Status ───────────────────────────────────────────────────────────────────

/**
 * Status shown in the UI:
 * - PAID      → paidAt is set
 * - DUE_TODAY → unpaid and due date is today
 * - OVERDUE   → unpaid and past the due date
 * - UPCOMING  → unpaid and not due yet
 */
export function calculateDisplayStatus(input: {
  paidAt?: string | Date | null;
  dueDate: string | Date;
  today?: DateOnly;
}): PaymentDisplayStatus {
  if (input.paidAt) return 'PAID';
  const due = toBusinessDate(typeof input.dueDate === 'string' ? input.dueDate : toDateString(input.dueDate));
  const today = input.today ?? businessDateString();
  if (today === due) return 'DUE_TODAY';
  return compareDateOnly(today, due) > 0 ? 'OVERDUE' : 'UPCOMING';
}

/** Status persisted on the MonthlyPayment row (UNPAID / PAID / OVERDUE). */
export function calculatePaymentStatus(input: {
  paidAt?: string | Date | null;
  dueDate: string | Date;
  today?: DateOnly;
}): PaymentStoredStatus {
  if (input.paidAt) return 'PAID';
  const due = toBusinessDate(typeof input.dueDate === 'string' ? input.dueDate : toDateString(input.dueDate));
  const today = input.today ?? businessDateString();
  return compareDateOnly(today, due) >= 0 ? 'OVERDUE' : 'UNPAID';
}

/** Reminder milestone for an unpaid bill, ready for a future notifier. */
export function getReminderStage(
  dueDate: DateOnly,
  today: DateOnly = businessDateString(),
  isPaid = false
): string | null {
  if (isPaid) return null;
  const delta = daysBetween(today, dueDate); // >0 → still ahead, <0 → late
  if (delta > 7) return null;
  if (delta === 7) return 'H-7';
  if (delta === 3) return 'H-3';
  if (delta === 1) return 'H-1';
  if (delta === 0) return 'Hari H';
  return `H+${Math.abs(delta)}`;
}
