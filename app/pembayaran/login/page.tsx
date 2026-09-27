'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSession, signIn, signOut } from 'next-auth/react';
import { Loader2, Eye, EyeOff, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

function sanitizeCallbackUrl(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/pembayaran';
  }
  const origin = typeof window !== 'undefined' ? window.location.origin : undefined;
  try {
    const url = new URL(value, origin);
    return url.pathname + url.search;
  } catch {
    return '/pembayaran';
  }
}

export default function TenantLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = sanitizeCallbackUrl(searchParams.get('callbackUrl'));

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email atau password salah.');
        return;
      }

      const session = await getSession();
      const role = (session?.user as unknown as { role?: string } | undefined)?.role;

      if (role !== 'PENYEWA') {
        await signOut({ redirect: false });
        setError('Akun ini bukan akun penyewa. Silakan masuk dari halaman admin.');
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4 py-10">
      <Card className="w-full max-w-md border-border/60">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-2 flex items-center justify-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Home className="h-5 w-5" />
            </span>
            <span className="font-serif text-xl font-semibold">Harmony Home</span>
          </Link>
          <CardTitle className="font-serif text-2xl">Portal Penyewa</CardTitle>
          <CardDescription>
            Masuk untuk melihat tagihan dan tenggat pembayaran Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="penyewa@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Masuk...
                </>
              ) : (
                'Masuk'
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Belum punya akses?{' '}
              <Link href="/kontak" className="text-primary underline">
                Hubungi pengelola
              </Link>
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Kembali ke{' '}
              <Link href="/" className="text-primary underline">
                Beranda
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
