'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { businessDateString, formatTanggal } from '@/lib/payment-dates';

export interface RecordPaymentTarget {
  paymentId?: string;
  bookingId: string;
  bookingCode: string;
  tenantName: string;
  roomName: string;
  periodLabel: string;
  periodYear: number;
  periodMonth: number;
  dueDate: string;
  amount: number;
  paymentMethod?: string | null;
  notes?: string | null;
}

interface RecordPaymentDialogProps {
  target: RecordPaymentTarget | null;
  onOpenChange: (open: boolean) => void;
}

const METHOD_OPTIONS = [
  { value: 'CASH', label: 'Tunai' },
  { value: 'TRANSFER', label: 'Transfer' },
  { value: 'QRIS', label: 'QRIS' },
  { value: 'OTHER', label: 'Lainnya' },
];

export function RecordPaymentDialog({ target, onOpenChange }: RecordPaymentDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [amount, setAmount] = React.useState('');
  const [paidAt, setPaidAt] = React.useState('');
  const [method, setMethod] = React.useState('TRANSFER');
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => {
    if (target) {
      setAmount(String(target.amount));
      setPaidAt(businessDateString());
      setMethod(target.paymentMethod ?? 'TRANSFER');
      setNotes(target.notes ?? '');
    }
  }, [target]);

  if (!target) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error('Nominal harus lebih dari 0.');
      return;
    }
    if (!paidAt) {
      toast.error('Tanggal pembayaran wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const isEdit = Boolean(target.paymentId);
      const url = isEdit
        ? `/api/admin/monthly-payments/${target.paymentId}`
        : '/api/admin/monthly-payments';
      const body = isEdit
        ? {
            status: 'PAID',
            amount: parsedAmount,
            paidAt,
            paymentMethod: method,
            notes: notes.trim() || null,
          }
        : {
            bookingId: target.bookingId,
            periodYear: target.periodYear,
            periodMonth: target.periodMonth,
            amount: parsedAmount,
            paidAt,
            paymentMethod: method,
            notes: notes.trim() || null,
          };

      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Gagal mencatat pembayaran.');
      }

      toast.success(`Pembayaran ${target.periodLabel} untuk ${target.tenantName} berhasil dicatat.`);
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal mencatat pembayaran.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg">Catat Pembayaran</DialogTitle>
          <DialogDescription>
            {target.tenantName} · {target.bookingCode} · {target.roomName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Periode</Label>
              <div className="rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 text-sm font-medium">
                {target.periodLabel}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Jatuh Tempo</Label>
              <div className="rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 text-sm font-medium">
                {formatTanggal(target.dueDate)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-amount">Nominal</Label>
            <Input
              id="payment-amount"
              type="number"
              min={1}
              step={1000}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <p className="text-[11px] text-muted-foreground">
              Nominal mengikuti tarif sewa kontrak dan tidak dapat diubah sewenang-wenang.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="payment-date">Tanggal Pembayaran</Label>
              <Input
                id="payment-date"
                type="date"
                value={paidAt}
                onChange={(e) => setPaidAt(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Metode Pembayaran</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih metode" />
                </SelectTrigger>
                <SelectContent>
                  {METHOD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-notes">Catatan</Label>
            <Textarea
              id="payment-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Opsional, misalnya: transfer ke rekening BCA"
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Pembayaran
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
