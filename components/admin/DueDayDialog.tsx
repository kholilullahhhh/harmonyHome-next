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

export interface DueDayTarget {
  bookingId: string;
  bookingCode: string;
  tenantName: string;
  dueDay: number;
}

interface DueDayDialogProps {
  target: DueDayTarget | null;
  onOpenChange: (open: boolean) => void;
}

export function DueDayDialog({ target, onOpenChange }: DueDayDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [dueDay, setDueDay] = React.useState('1');

  React.useEffect(() => {
    if (target) setDueDay(String(target.dueDay));
  }, [target]);

  if (!target) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(dueDay);
    if (!Number.isInteger(value) || value < 1 || value > 31) {
      toast.error('Tanggal jatuh tempo harus antara 1 dan 31.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/penyewa/${target.bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentDueDay: value }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Gagal memperbarui tanggal jatuh tempo.');
      }

      const payload = (await res.json()) as { message?: string };
      toast.success(
        payload.message ?? `Tanggal jatuh tempo ${target.tenantName} diubah ke tanggal ${value}.`
      );
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Gagal memperbarui tanggal jatuh tempo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg">Ubah Tanggal Jatuh Tempo</DialogTitle>
          <DialogDescription>
            {target.tenantName} · {target.bookingCode}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="due-day">Tanggal Jatuh Tempo (1–31)</Label>
            <Input
              id="due-day"
              type="number"
              min={1}
              max={31}
              value={dueDay}
              onChange={(e) => setDueDay(e.target.value)}
              required
            />
            <p className="text-[11px] text-muted-foreground">
              Jika tanggal tidak tersedia pada bulan berjalan, sistem otomatis menggunakan hari
              terakhir bulan tersebut (misal 31 → 30 April, 28/29 Februari).
            </p>
            <p className="text-[11px] text-muted-foreground">
              Perubahan hanya berlaku untuk tagihan berikutnya yang belum dibuat; tagihan yang
              sudah ada tidak diubah.
            </p>
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
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
