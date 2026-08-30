'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface RoomOption {
  id: string;
  slug: string;
  name: string;
  price: number;
}

interface BookingFormProps {
  rooms: RoomOption[];
}

function formatPrice(price: number): string {
  return 'Rp' + price.toLocaleString('id-ID');
}

export function BookingForm({ rooms }: BookingFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [idNumber, setIdNumber] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [roomId, setRoomId] = React.useState(
    searchParams.get('room') ?? ''
  );
  const [moveInDate, setMoveInDate] = React.useState('');
  const [duration, setDuration] = React.useState('1');
  const [notes, setNotes] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const selectedRoom = rooms.find((r) => r.id === roomId);
  const durationNum = parseInt(duration, 10) || 1;
  const total = selectedRoom ? selectedRoom.price * durationNum : 0;
  const todayISO = new Date().toISOString().split('T')[0];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Nama lengkap wajib diisi';
    if (!email.trim()) e.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = 'Format email tidak valid';
    if (!phone.trim()) e.phone = 'Nomor HP wajib diisi';
    else if (!/^[0-9+\-\s]{8,15}$/.test(phone))
      e.phone = 'Nomor HP tidak valid';
    if (!roomId) e.roomId = 'Pilih tipe kamar';
    if (!moveInDate) e.moveInDate = 'Pilih tanggal masuk';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          identityNumber: idNumber.trim() || undefined,
          address: address.trim() || undefined,
          startDate: moveInDate,
          duration: durationNum,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim booking');
      }

      const params = new URLSearchParams({
        id: data.data.id,
        code: data.data.bookingCode,
        room: data.data.roomName,
        name: data.data.name,
        duration: String(data.data.duration),
        total: String(data.data.totalPrice),
      });
      router.push(`/booking/success?${params.toString()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengirim booking.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-5">
      {/* Form fields */}
      <div className="lg:col-span-3">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-lg">Data Penghuni</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor HP</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">Nomor Identitas (KTP/SIM) — opsional</Label>
              <Input
                id="idNumber"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="Masukkan nomor identitas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat — opsional</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Alamat domisili saat ini"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 border-border/60">
          <CardHeader>
            <CardTitle className="text-lg">Detail Booking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room">Tipe Kamar</Label>
              <Select value={roomId} onValueChange={setRoomId}>
                <SelectTrigger id="room" aria-invalid={!!errors.roomId}>
                  <SelectValue placeholder="Pilih tipe kamar" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name} — {formatPrice(r.price)}/bln
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roomId && (
                <p className="text-xs text-destructive">{errors.roomId}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="moveInDate">Tanggal Masuk</Label>
                <Input
                  id="moveInDate"
                  type="date"
                  min={todayISO}
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  aria-invalid={!!errors.moveInDate}
                />
                {errors.moveInDate && (
                  <p className="text-xs text-destructive">{errors.moveInDate}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durasi Sewa</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Bulan</SelectItem>
                    <SelectItem value="3">3 Bulan</SelectItem>
                    <SelectItem value="6">6 Bulan</SelectItem>
                    <SelectItem value="12">12 Bulan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Catatan — opsional</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Permintaan khusus atau catatan tambahan"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <div className="lg:col-span-2">
        <Card className="sticky top-24 border-border/60">
          <CardHeader>
            <CardTitle className="text-lg">Ringkasan Booking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-lg font-semibold">
                Harmony Home
              </span>
            </div>

            {selectedRoom ? (
              <>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipe Kamar</span>
                    <span className="font-medium">{selectedRoom.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Harga</span>
                    <span className="font-medium">
                      {formatPrice(selectedRoom.price)} / bulan
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durasi</span>
                    <span className="font-medium">{durationNum} bulan</span>
                  </div>
                </div>
                <Separator />
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-serif text-2xl font-semibold text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Pilih tipe kamar untuk melihat ringkasan harga.
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Ajukan Booking
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Pengelola akan menghubungi Anda dalam 1×24 jam setelah pengajuan.
            </p>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
