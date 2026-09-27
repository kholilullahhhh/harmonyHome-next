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

export interface TenantAccountTarget {
  bookingId: string;
  bookingCode: string;
  tenantName: string;
  email: string;
  hasAccount: boolean;
}

interface TenantAccountDialogProps {
  target: TenantAccountTarget | null;
  onOpenChange: (open: boolean) => void;
}

export function TenantAccountDialog({ target, onOpenChange }: TenantAccountDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    if (target) {
      setEmail(target.email);
      setPassword('');
    }
  }, [target]);

  if (!target) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/penyewa/${target.bookingId}/account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Gagal menyimpan akun penyewa.');
      }

      const payload = (await res.json()) as { message?: string };
      toast.success(payload.message ?? 'Akun penyewa berhasil disimpan.');
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan akun penyewa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg">
            {target.hasAccount ? 'Atur Ulang Kata Sandi' : 'Buat Akun Penyewa'}
          </DialogTitle>
          <DialogDescription>
            {target.tenantName} · {target.bookingCode}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tenant-email">Email</Label>
            <Input
              id="tenant-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="penyewa@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenant-password">Kata Sandi</Label>
            <Input
              id="tenant-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              minLength={6}
              required
              autoComplete="new-password"
            />
            <p className="text-[11px] text-muted-foreground">
              Akun ini dipakai penyewa untuk masuk ke halaman tagihan di{' '}
              <span className="font-medium text-foreground">/pembayaran</span>. Bagikan email dan
              kata sandi ini kepada penyewa.
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
              Simpan Akun
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
