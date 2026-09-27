import { prisma } from '@/lib/db/prisma';
import type { Prisma } from '@prisma/client';
import type { Booking, MonthlyPayment, PaymentMethod, Room, User } from '@prisma/client';
import {
  addMonthsToDateOnly,
  businessDateString,
  calculateDueDateString,
  calculateDisplayStatus,
  calculatePaymentStatus,
  compareDateOnly,
  formatPeriodLabel,
  getDueDay,
  getDurationMonths,
  getMonthlyAmount,
  getReminderStage,
  planBillingPeriods,
  toAnchorDate,
  toDateString,
  type BillingPeriod,
  type DateOnly,
  type PaymentDisplayStatus,
  type PaymentStoredStatus,
} from '@/lib/payment-dates';

// Billing fields required to compute a tenant's schedule. Every Prisma
// Booking satisfies this shape.
export interface BillingBooking {
  id: string;
  startDate: Date;
  duration: number;
  durationUnit: string;
  totalPrice: number;
  paymentDueDay: number | null;
  status: string;
}

export type PaymentWithBooking = MonthlyPayment & {
  booking: Booking & { room: Room; user: User | null };
};

// ─── Pure helpers ────────────────────────────────────────────────────────────

/** Active tenant: confirmed, already moved in, contract not finished yet. */
export function isActiveTenant(booking: BillingBooking, today: DateOnly = businessDateString()): boolean {
  if (booking.status !== 'CONFIRMED') return false;
  const start = toDateString(booking.startDate);
  const end = addMonthsToDateOnly(
    start,
    getDurationMonths(booking.duration, booking.durationUnit)
  );
  return compareDateOnly(today, start) >= 0 && compareDateOnly(today, end) < 0;
}

/** Billable bookings: settled payments are still allowed after move-out. */
export function isBillableBooking(booking: { status: string }): boolean {
  return booking.status === 'CONFIRMED' || booking.status === 'COMPLETED';
}

export function serializePayment(payment: MonthlyPayment) {
  const dueDate = toDateString(payment.dueDate);
  const today = businessDateString();
  return {
    id: payment.id,
    bookingId: payment.bookingId,
    periodYear: payment.periodYear,
    periodMonth: payment.periodMonth,
    periodLabel: formatPeriodLabel(payment.periodYear, payment.periodMonth),
    amount: payment.amount,
    dueDate,
    paidAt: payment.paidAt ? toDateString(payment.paidAt) : null,
    status: payment.status as PaymentStoredStatus,
    displayStatus: calculateDisplayStatus({
      paidAt: payment.paidAt,
      dueDate,
      today,
    }) as PaymentDisplayStatus,
    paymentMethod: payment.paymentMethod,
    notes: payment.notes,
    reminder: getReminderStage(dueDate, today, Boolean(payment.paidAt)),
    createdAt: payment.createdAt.toISOString(),
    updatedAt: payment.updatedAt.toISOString(),
  };
}

export type SerializedPayment = ReturnType<typeof serializePayment>;

// ─── Idempotent bill generation ──────────────────────────────────────────────

/**
 * Creates every missing bill for one booking (past months up to the period
 * covering today), then refreshes stored statuses of unpaid rows. Safe to call
 * repeatedly: the unique constraint + `skipDuplicates` prevents duplicates
 * even under concurrent requests.
 */
export async function ensureMonthlyPaymentsForBooking(
  booking: BillingBooking,
  today: DateOnly = businessDateString()
): Promise<MonthlyPayment[]> {
  const periods = planBillingPeriods(booking, today);

  if (periods.length > 0) {
    await prisma.monthlyPayment.createMany({
      data: periods.map((period) => ({
        bookingId: booking.id,
        periodYear: period.year,
        periodMonth: period.month,
        amount: getMonthlyAmount(booking),
        dueDate: toAnchorDate(period.dueDate),
        status: calculatePaymentStatus({ paidAt: null, dueDate: period.dueDate, today }),
      })),
      skipDuplicates: true,
    });
  }

  const payments = await prisma.monthlyPayment.findMany({
    where: { bookingId: booking.id },
    orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
  });

  return reconcileStatuses(payments, today);
}

/** Same as above but for a whole batch of bookings — one createMany round-trip. */
export async function ensureMonthlyPayments(
  bookings: BillingBooking[],
  today: DateOnly = businessDateString()
): Promise<MonthlyPayment[]> {
  const rows = bookings.flatMap((booking) =>
    planBillingPeriods(booking, today).map((period) => ({
      bookingId: booking.id,
      periodYear: period.year,
      periodMonth: period.month,
      amount: getMonthlyAmount(booking),
      dueDate: toAnchorDate(period.dueDate),
      status: calculatePaymentStatus({ paidAt: null, dueDate: period.dueDate, today }),
    }))
  );

  if (rows.length > 0) {
    await prisma.monthlyPayment.createMany({ data: rows, skipDuplicates: true });
  }

  const payments =
    bookings.length > 0
      ? await prisma.monthlyPayment.findMany({
          where: { bookingId: { in: bookings.map((b) => b.id) } },
          orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
        })
      : [];

  return reconcileStatuses(payments, today);
}

async function reconcileStatuses(payments: MonthlyPayment[], today: DateOnly) {
  const updates = payments
    .filter((payment) => !payment.paidAt)
    .map((payment) => {
      const desired = calculatePaymentStatus({
        paidAt: payment.paidAt,
        dueDate: toDateString(payment.dueDate),
        today,
      });
      return payment.status === desired
        ? null
        : prisma.monthlyPayment.update({
            where: { id: payment.id },
            data: { status: desired },
          });
    })
    .filter((query): query is NonNullable<typeof query> => query !== null);

  if (updates.length > 0) {
    await prisma.$transaction(updates);
  }

  return payments;
}

export async function getActiveTenantsBookings(today: DateOnly = businessDateString()) {
  const confirmed = await prisma.booking.findMany({
    where: { status: 'CONFIRMED' },
    include: { room: true, user: true },
  });
  return confirmed.filter((booking) => isActiveTenant(booking, today));
}

/**
 * Creates the current-period bill of every active tenant and returns them.
 * Used by the dashboard and the admin tenant list — idempotent, so opening
 * the page many times never duplicates a bill.
 */
export async function ensureActiveTenantPayments(today: DateOnly = businessDateString()) {
  const tenants = await getActiveTenantsBookings(today);
  const payments = await ensureMonthlyPayments(tenants, today);
  return { tenants, payments };
}

// ─── Reads ───────────────────────────────────────────────────────────────────

export async function getMonthlyPayment(id: string) {
  return prisma.monthlyPayment.findUnique({
    where: { id },
    include: { booking: { include: { room: true, user: true } } },
  });
}

export async function getCurrentMonthlyPayment(bookingId: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return null;

  const today = businessDateString();
  const current = planBillingPeriods(booking, today).pop();
  if (!current) return null;

  return prisma.monthlyPayment.findUnique({
    where: {
      bookingId_periodYear_periodMonth: {
        bookingId,
        periodYear: current.year,
        periodMonth: current.month,
      },
    },
  });
}

export interface MonthlyPaymentFilters {
  year?: number;
  month?: number;
  status?: string;
  roomId?: string;
  bookingId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

function displayStatusWhere(status: string, today: DateOnly) {
  const todayAnchor = toAnchorDate(today);
  switch (status.toUpperCase()) {
    case 'PAID':
      return { paidAt: { not: null } };
    case 'UPCOMING':
      return { paidAt: null, dueDate: { gt: todayAnchor } };
    case 'DUE_TODAY':
      return { paidAt: null, dueDate: todayAnchor };
    case 'OVERDUE':
      return { paidAt: null, dueDate: { lt: todayAnchor } };
    default:
      return {};
  }
}

export async function getMonthlyPayments(filters: MonthlyPaymentFilters = {}) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 10));
  const today = businessDateString();

  const where: Prisma.MonthlyPaymentWhereInput = {};

  if (filters.year) where.periodYear = filters.year;
  if (filters.month) where.periodMonth = filters.month;
  if (filters.bookingId) where.bookingId = filters.bookingId;
  if (filters.status && filters.status !== 'all') {
    Object.assign(where, displayStatusWhere(filters.status, today));
  }

  const bookingWhere: Prisma.BookingWhereInput = {};
  if (filters.roomId) bookingWhere.roomId = filters.roomId;
  if (filters.search) {
    const search = { contains: filters.search, mode: 'insensitive' as const };
    bookingWhere.OR = [{ name: search }, { bookingCode: search }, { email: search }];
  }
  if (Object.keys(bookingWhere).length > 0) {
    where.booking = { is: bookingWhere };
  }

  const [payments, total] = await Promise.all([
    prisma.monthlyPayment.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }, { dueDate: 'desc' }],
      include: { booking: { include: { room: true, user: true } } },
    }),
    prisma.monthlyPayment.count({ where }),
  ]);

  return {
    payments,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ─── Writes ──────────────────────────────────────────────────────────────────

/**
 * Creates the bill of a given period when it is legitimately part of the
 * contract (never before move-in, never past the contract end) and returns it.
 */
export async function createMonthlyPaymentIfMissing(
  booking: BillingBooking,
  periodYear: number,
  periodMonth: number,
  today: DateOnly = businessDateString()
): Promise<{ ok: true; payment: MonthlyPayment } | { ok: false; error: string }> {
  if (periodMonth < 1 || periodMonth > 12 || periodYear < 2000 || periodYear > 2100) {
    return { ok: false, error: 'Periode pembayaran tidak valid.' };
  }

  const start = toDateString(booking.startDate);
  const tenureEnd = addMonthsToDateOnly(
    start,
    getDurationMonths(booking.duration, booking.durationUnit)
  );
  const dueDate = calculateDueDateString(periodYear, periodMonth, getDueDay(booking));

  if (compareDateOnly(dueDate, start) < 0 || compareDateOnly(dueDate, tenureEnd) >= 0) {
    return { ok: false, error: 'Periode pembayaran di luar masa sewa penyewa.' };
  }

  await prisma.monthlyPayment.createMany({
    data: [
      {
        bookingId: booking.id,
        periodYear,
        periodMonth,
        amount: getMonthlyAmount(booking),
        dueDate: toAnchorDate(dueDate),
        status: calculatePaymentStatus({ paidAt: null, dueDate, today }),
      },
    ],
    skipDuplicates: true,
  });

  const payment = await prisma.monthlyPayment.findUnique({
    where: {
      bookingId_periodYear_periodMonth: { bookingId: booking.id, periodYear, periodMonth },
    },
  });

  if (!payment) {
    return { ok: false, error: 'Gagal membuat tagihan bulanan.' };
  }

  return { ok: true, payment };
}

export interface RecordPaymentInput {
  paidAt: DateOnly;
  paymentMethod: PaymentMethod;
  notes?: string | null;
}

/** Marks a bill as paid. The amount always comes from the booking contract. */
export async function markMonthlyPaymentAsPaid(paymentId: string, input: RecordPaymentInput) {
  const payment = await prisma.monthlyPayment.findUnique({
    where: { id: paymentId },
    include: { booking: true },
  });

  if (!payment) return null;

  return prisma.monthlyPayment.update({
    where: { id: paymentId },
    data: {
      status: 'PAID',
      paidAt: toAnchorDate(input.paidAt),
      paymentMethod: input.paymentMethod,
      notes: input.notes ?? payment.notes,
      amount: getMonthlyAmount(payment.booking),
    },
  });
}

// ─── Dashboard summary ───────────────────────────────────────────────────────

export interface MonthlyPaymentSummary {
  activeTenants: number;
  paid: number;
  unpaid: number;
  dueToday: number;
  overdue: number;
  receivedThisMonth: number;
  unpaidAmount: number;
  periodLabel: string;
}

export async function getMonthlyPaymentSummary(
  today: DateOnly = businessDateString()
): Promise<MonthlyPaymentSummary> {
  const { tenants, payments } = await ensureActiveTenantPayments(today);

  const paymentByKey = new Map(
    payments.map((payment) => [
      `${payment.bookingId}:${payment.periodYear}:${payment.periodMonth}`,
      payment,
    ])
  );

  let paid = 0;
  let unpaid = 0;
  let dueToday = 0;
  let overdue = 0;
  let unpaidAmount = 0;

  for (const tenant of tenants) {
    const current = planBillingPeriods(tenant, today).pop();
    if (!current) continue;

    const payment = paymentByKey.get(
      `${tenant.id}:${current.year}:${current.month}`
    );
    const display = calculateDisplayStatus({
      paidAt: payment?.paidAt ?? null,
      dueDate: current.dueDate,
      today,
    });

    if (display === 'PAID') paid += 1;
    else if (display === 'DUE_TODAY') dueToday += 1;
    else if (display === 'OVERDUE') {
      overdue += 1;
      unpaidAmount += payment?.amount ?? getMonthlyAmount(tenant);
    } else {
      unpaid += 1;
      unpaidAmount += payment?.amount ?? getMonthlyAmount(tenant);
    }
  }

  const monthStart = `${today.slice(0, 7)}-01`;
  const monthEnd = addMonthsToDateOnly(monthStart, 1);
  const received = await prisma.monthlyPayment.aggregate({
    where: {
      paidAt: { gte: toAnchorDate(monthStart), lt: toAnchorDate(monthEnd) },
    },
    _sum: { amount: true },
  });

  const [year, month] = monthStart.split('-').map(Number);

  return {
    activeTenants: tenants.length,
    paid,
    unpaid,
    dueToday,
    overdue,
    receivedThisMonth: received._sum.amount ?? 0,
    unpaidAmount,
    periodLabel: formatPeriodLabel(year, month),
  };
}

// ─── Admin tenant pages ──────────────────────────────────────────────────────

export interface TenantListItem {
  id: string;
  bookingCode: string;
  name: string;
  email: string;
  phone: string;
  roomId: string;
  roomName: string;
  startDate: string;
  bookingStatus: string;
  dueDay: number;
  monthlyAmount: number;
  isActive: boolean;
  tenantUserId: string | null;
  current: SerializedPayment | null;
}

export interface TenantListFilters {
  status?: string;
  search?: string;
  roomId?: string;
  page?: number;
  limit?: number;
}

const TENANT_PAGE_SIZE = 10;

export async function getTenantList(filters: TenantListFilters = {}) {
  const today = businessDateString();
  await ensureActiveTenantPayments(today);

  const statusFilter = filters.status && filters.status !== 'all' ? filters.status : 'all';

  const where: Prisma.BookingWhereInput = {};

  if (statusFilter === 'aktif') {
    where.status = 'CONFIRMED';
  } else if (statusFilter !== 'all') {
    where.status = statusFilter as 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  }

  if (filters.roomId) where.roomId = filters.roomId;

  if (filters.search) {
    const search = { contains: filters.search, mode: 'insensitive' as const };
    where.OR = [{ name: search }, { bookingCode: search }, { email: search }, { phone: search }];
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: { room: true, user: true },
    orderBy: { startDate: 'desc' },
  });

  const scoped =
    statusFilter === 'aktif'
      ? bookings.filter((booking) => isActiveTenant(booking, today))
      : bookings;

  // Only active tenants generate new bills; history for everyone is read-only.
  await ensureMonthlyPayments(
    scoped.filter((booking) => isActiveTenant(booking, today)),
    today
  );
  const payments = await prisma.monthlyPayment.findMany({
    where: { bookingId: { in: scoped.map((booking) => booking.id) } },
  });
  const paymentByKey = new Map(
    payments.map((payment) => [
      `${payment.bookingId}:${payment.periodYear}:${payment.periodMonth}`,
      payment,
    ])
  );

  const items: TenantListItem[] = scoped.map((booking) => {
    const currentPeriod = isActiveTenant(booking, today)
      ? planBillingPeriods(booking, today).pop()
      : null;
    const currentPayment = currentPeriod
      ? paymentByKey.get(`${booking.id}:${currentPeriod.year}:${currentPeriod.month}`)
      : undefined;

    return {
      id: booking.id,
      bookingCode: booking.bookingCode,
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      roomId: booking.roomId,
      roomName: booking.room.name,
      startDate: toDateString(booking.startDate),
      bookingStatus: booking.status,
      dueDay: getDueDay(booking),
      monthlyAmount: getMonthlyAmount(booking),
      isActive: isActiveTenant(booking, today),
      tenantUserId: booking.userId,
      current: currentPayment ? serializePayment(currentPayment) : null,
    };
  });

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / TENANT_PAGE_SIZE));
  const page = Math.min(Math.max(1, filters.page ?? 1), totalPages);
  const start = (page - 1) * TENANT_PAGE_SIZE;

  return {
    tenants: items.slice(start, start + TENANT_PAGE_SIZE),
    total,
    page,
    totalPages,
  };
}

export interface TenantDetail {
  booking: Booking & { room: Room; user: User | null };
  dueDay: number;
  monthlyAmount: number;
  isActive: boolean;
  current: SerializedPayment | null;
  history: SerializedPayment[];
}

export async function getTenantDetail(bookingId: string): Promise<TenantDetail | null> {
  const today = businessDateString();
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { room: true, user: true },
  });

  if (!booking) return null;

  let payments: MonthlyPayment[] = [];
  if (isActiveTenant(booking, today)) {
    payments = await ensureMonthlyPaymentsForBooking(booking, today);
  } else {
    payments = await prisma.monthlyPayment.findMany({
      where: { bookingId },
      orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
    });
  }

  const currentPeriod = isActiveTenant(booking, today) ? planBillingPeriods(booking, today).pop() : null;
  const current = currentPeriod
    ? payments.find(
        (payment) =>
          payment.periodYear === currentPeriod.year &&
          payment.periodMonth === currentPeriod.month
      ) ?? null
    : null;

  return {
    booking,
    dueDay: getDueDay(booking),
    monthlyAmount: getMonthlyAmount(booking),
    isActive: isActiveTenant(booking, today),
    current: current ? serializePayment(current) : null,
    history: payments.map(serializePayment),
  };
}

// ─── Tenant (penyewa) view ───────────────────────────────────────────────────

export interface TenantPaymentView {
  booking: {
    id: string;
    bookingCode: string;
    roomName: string;
    startDate: string;
    duration: number;
    status: string;
    dueDay: number;
    monthlyAmount: number;
    isActive: boolean;
  };
  current: SerializedPayment | null;
  history: SerializedPayment[];
}

/** Payments visible to one logged-in tenant — never another tenant's data. */
export async function getTenantPayments(userId: string): Promise<TenantPaymentView[]> {
  const today = businessDateString();

  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: { room: true },
    orderBy: { startDate: 'desc' },
  });

  const active = bookings.filter((booking) => isActiveTenant(booking, today));
  await ensureMonthlyPayments(active, today);
  const payments = await prisma.monthlyPayment.findMany({
    where: { bookingId: { in: bookings.map((booking) => booking.id) } },
    orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
  });

  return bookings.map((booking) => {
    const own = payments.filter((payment) => payment.bookingId === booking.id);
    const currentPeriod = isActiveTenant(booking, today) ? planBillingPeriods(booking, today).pop() : null;
    const current = currentPeriod
      ? own.find(
          (payment) =>
            payment.periodYear === currentPeriod.year &&
            payment.periodMonth === currentPeriod.month
        ) ?? null
      : null;

    return {
      booking: {
        id: booking.id,
        bookingCode: booking.bookingCode,
        roomName: booking.room.name,
        startDate: toDateString(booking.startDate),
        duration: booking.duration,
        status: booking.status,
        dueDay: getDueDay(booking),
        monthlyAmount: getMonthlyAmount(booking),
        isActive: isActiveTenant(booking, today),
      },
      current: current ? serializePayment(current) : null,
      history: own.map(serializePayment),
    };
  });
}
