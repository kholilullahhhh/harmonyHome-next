// Server-only SMTP mailer for tenant payment reminders.
//
// Configuration comes from the environment (see .env.example):
// SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM.
// When SMTP is not configured the reminder job must skip sending instead of
// throwing, so admin pages and the cron endpoint keep working.
import nodemailer, { type Transporter } from 'nodemailer';

import {
  businessDateString,
  daysBetween,
  formatPeriodLabel,
  formatRupiah,
  formatTanggal,
  type DateOnly,
} from '@/lib/payment-dates';

export type ReminderStage = 'H-3' | 'H-1' | 'Hari H';

export interface ReminderEmailPayload {
  to: string;
  tenantName: string;
  roomName: string;
  bookingCode: string;
  periodYear: number;
  periodMonth: number;
  amount: number;
  dueDate: DateOnly;
  stage: ReminderStage;
  portalUrl: string;
}

let transport: Transporter | null | undefined;

function env(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() !== '' ? value.trim() : undefined;
}

export function isEmailConfigured(): boolean {
  return Boolean(env('SMTP_HOST'));
}

function getTransport(): Transporter | null {
  if (transport !== undefined) return transport;

  const host = env('SMTP_HOST');
  if (!host) {
    transport = null;
    return transport;
  }

  const port = Number(env('SMTP_PORT') ?? '587');
  const secure = env('SMTP_SECURE')
    ? env('SMTP_SECURE') === 'true'
    : port === 465;

  transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: env('SMTP_USER')
      ? { user: env('SMTP_USER'), pass: env('SMTP_PASSWORD') }
      : undefined,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  return transport;
}

/** Reset the cached transport (tests / after env changes). */
export function resetEmailTransport() {
  transport = undefined;
}

export function emailFromAddress(): string {
  return env('EMAIL_FROM') ?? 'Harmony Home <no-reply@harmonyhome.id>';
}

export function reminderStageForDelta(delta: number): ReminderStage | null {
  // Only H-3, H-1 and Hari H are sent (overdue bills are not emailed).
  if (delta === 3 || delta === 2) return 'H-3';
  if (delta === 1) return 'H-1';
  if (delta === 0) return 'Hari H';
  return null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function reminderSubject(stage: ReminderStage, periodLabel: string): string {
  if (stage === 'Hari H') {
    return `Pembayaran Jatuh Tempo Hari Ini — Tagihan ${periodLabel}`;
  }
  return `Pengingat Jatuh Tempo ${stage} — Tagihan ${periodLabel}`;
}

export function renderReminderEmail(payload: ReminderEmailPayload): {
  subject: string;
  text: string;
  html: string;
} {
  const periodLabel = formatPeriodLabel(payload.periodYear, payload.periodMonth);
  const dueDateText = formatTanggal(payload.dueDate);
  const delta = daysBetween(businessDateString(), payload.dueDate);

  const headline =
    payload.stage === 'Hari H'
      ? 'Tagihan bulanan Anda jatuh tempo hari ini.'
      : `Tagihan bulanan Anda jatuh tempo ${delta > 0 ? `dalam ${delta} hari` : 'hari ini'} (${dueDateText}).`;

  const subject = reminderSubject(payload.stage, periodLabel);
  const portalUrl = escapeHtml(payload.portalUrl);

  const text = [
    `Halo ${payload.tenantName},`,
    '',
    headline,
    '',
    `Kamar       : ${payload.roomName} (${payload.bookingCode})`,
    `Periode     : ${periodLabel}`,
    `Nominal     : ${formatRupiah(payload.amount)}`,
    `Jatuh tempo : ${dueDateText}`,
    '',
    'Silakan lakukan pembayaran sesuai tata cara yang disepakati, lalu cek status tagihan Anda di portal penyewa:',
    payload.portalUrl,
    '',
    'Pesan ini dikirim otomatis oleh sistem Harmony Home.',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f4f5; padding:24px;">
      <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; padding:28px; border:1px solid #e4e4e7;">
        <p style="font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#71717a; margin:0 0 4px;">Harmony Home</p>
        <h1 style="font-size:20px; color:#18181b; margin:0 0 16px;">Pengingat Pembayaran</h1>
        <p style="font-size:15px; color:#3f3f46; margin:0 0 16px;">Halo ${escapeHtml(payload.tenantName)},</p>
        <p style="font-size:15px; color:#18181b; margin:0 0 20px;"><strong>${escapeHtml(headline)}</strong></p>
        <table style="width:100%; border-collapse:collapse; font-size:14px; color:#3f3f46;">
          <tr><td style="padding:6px 0; color:#71717a;">Kamar</td><td style="padding:6px 0; text-align:right;">${escapeHtml(payload.roomName)} (${escapeHtml(payload.bookingCode)})</td></tr>
          <tr><td style="padding:6px 0; color:#71717a;">Periode</td><td style="padding:6px 0; text-align:right;">${escapeHtml(periodLabel)}</td></tr>
          <tr><td style="padding:6px 0; color:#71717a;">Nominal</td><td style="padding:6px 0; text-align:right;"><strong>${escapeHtml(formatRupiah(payload.amount))}</strong></td></tr>
          <tr><td style="padding:6px 0; color:#71717a;">Jatuh tempo</td><td style="padding:6px 0; text-align:right;">${escapeHtml(dueDateText)}</td></tr>
        </table>
        <p style="margin:20px 0 8px;">
          <a href="${portalUrl}" style="display:inline-block; background:#16a34a; color:#ffffff; text-decoration:none; padding:10px 18px; border-radius:8px; font-size:14px;">Lihat Tagihan di Portal</a>
        </p>
        <p style="font-size:12px; color:#a1a1aa; margin-top:24px;">Email pengingat jatuh tempo ini dikirim otomatis oleh sistem Harmony Home.</p>
      </div>
    </div>
  `;

  return { subject, text, html };
}

/** Sends one reminder email. Throws on transport failure (caller decides). */
export async function sendReminderEmail(payload: ReminderEmailPayload): Promise<void> {
  const transporter = getTransport();
  if (!transporter) {
    throw new Error('SMTP belum dikonfigurasi (SMTP_HOST kosong).');
  }

  const { subject, text, html } = renderReminderEmail(payload);

  await transporter.sendMail({
    from: emailFromAddress(),
    to: payload.to,
    subject,
    text,
    html,
  });
}
