'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Room {
  id: string;
  slug: string;
  name: string;
  type: string;
  description: string;
  shortDescription: string;
  price: number;
  priceLabel: string;
  capacity: number;
  size: string;
  status: string;
  availableCount: number;
  totalCount: number;
  facilities: unknown;
  rules: unknown;
  paymentInfo: unknown;
  images: unknown;
}

interface RoomFormProps {
  room?: Room;
}

export function RoomForm({ room }: RoomFormProps) {
  const router = useRouter();
  const isEdit = !!room;

  const [name, setName] = React.useState(room?.name ?? '');
  const [slug, setSlug] = React.useState(room?.slug ?? '');
  const [type, setType] = React.useState(room?.type ?? '');
  const [description, setDescription] = React.useState(room?.description ?? '');
  const [shortDescription, setShortDescription] = React.useState(room?.shortDescription ?? '');
  const [price, setPrice] = React.useState(String(room?.price ?? ''));
  const [priceLabel, setPriceLabel] = React.useState(room?.priceLabel ?? '');
  const [capacity, setCapacity] = React.useState(String(room?.capacity ?? '1'));
  const [size, setSize] = React.useState(room?.size ?? '');
  const [status, setStatus] = React.useState(room?.status ?? 'AVAILABLE');
  const [availableCount, setAvailableCount] = React.useState(String(room?.availableCount ?? '0'));
  const [totalCount, setTotalCount] = React.useState(String(room?.totalCount ?? '0'));
  const [facilities, setFacilities] = React.useState(
    Array.isArray(room?.facilities) ? (room!.facilities as string[]).join('\n') : ''
  );
  const [rules, setRules] = React.useState(
    Array.isArray(room?.rules) ? (room!.rules as string[]).join('\n') : ''
  );
  const [paymentInfo, setPaymentInfo] = React.useState(
    Array.isArray(room?.paymentInfo) ? (room!.paymentInfo as string[]).join('\n') : ''
  );
  const [images, setImages] = React.useState(
    Array.isArray(room?.images) ? (room!.images as string[]).join('\n') : ''
  );
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Nama wajib diisi';
    if (!slug.trim()) e.slug = 'Slug wajib diisi';
    if (!price || parseInt(price) <= 0) e.price = 'Harga harus lebih dari 0';
    if (!description.trim()) e.description = 'Deskripsi wajib diisi';
    if (!shortDescription.trim()) e.shortDescription = 'Deskripsi singkat wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        type: type.trim(),
        description: description.trim(),
        shortDescription: shortDescription.trim(),
        price: parseInt(price),
        priceLabel: priceLabel.trim(),
        capacity: parseInt(capacity),
        size: size.trim(),
        status,
        availableCount: parseInt(availableCount),
        totalCount: parseInt(totalCount),
        facilities: facilities.split('\n').map((s) => s.trim()).filter(Boolean),
        rules: rules.split('\n').map((s) => s.trim()).filter(Boolean),
        paymentInfo: paymentInfo.split('\n').map((s) => s.trim()).filter(Boolean),
        images: images.split('\n').map((s) => s.trim()).filter(Boolean),
      };

      const url = isEdit ? `/api/admin/rooms/${room.id}` : '/api/admin/rooms';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menyimpan');
      }

      toast.success(isEdit ? 'Kamar berhasil diperbarui.' : 'Kamar berhasil ditambahkan.');
      router.push('/admin/rooms');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Informasi Dasar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kamar</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Standard Room"
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="standard"
              />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipe</Label>
            <Input
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="TYPE A — STANDARD"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Deskripsi Singkat</Label>
            <Input
              id="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Ringkasan singkat kamar"
            />
            {errors.shortDescription && (
              <p className="text-xs text-destructive">{errors.shortDescription}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Lengkap</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi lengkap kamar"
              rows={4}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Harga & Detail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp/bulan)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1700000"
              />
              {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceLabel">Label Harga</Label>
              <Input
                id="priceLabel"
                value={priceLabel}
                onChange={(e) => setPriceLabel(e.target.value)}
                placeholder="Rp1.700.000 / bulan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Ukuran</Label>
              <Input
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="3m × 4m"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Kapasitas</Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalCount">Total Kamar</Label>
              <Input
                id="totalCount"
                type="number"
                value={totalCount}
                onChange={(e) => setTotalCount(e.target.value)}
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableCount">Tersedia</Label>
              <Input
                id="availableCount"
                type="number"
                value={availableCount}
                onChange={(e) => setAvailableCount(e.target.value)}
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Tersedia</SelectItem>
                  <SelectItem value="OCCUPIED">Terisi</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Detail Tambahan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facilities">Fasilitas (satu per baris)</Label>
            <Textarea
              id="facilities"
              value={facilities}
              onChange={(e) => setFacilities(e.target.value)}
              placeholder={"Kasur\nLemari\nWiFi"}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rules">Peraturan (satu per baris)</Label>
            <Textarea
              id="rules"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder={"Dilarang merokok\nJam bertamu hingga 22.00"}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentInfo">Info Pembayaran (satu per baris)</Label>
            <Textarea
              id="paymentInfo"
              value={paymentInfo}
              onChange={(e) => setPaymentInfo(e.target.value)}
              placeholder={"Pembayaran di muka\nDeposit Rp500.000"}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="images">URL Gambar (satu per baris)</Label>
            <Textarea
              id="images"
              value={images}
              onChange={(e) => setImages(e.target.value)}
              placeholder={"https://images.pexels.com/...\nhttps://images.pexels.com/..."}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : isEdit ? (
            'Simpan Perubahan'
          ) : (
            'Tambah Kamar'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
