'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Setting {
  id: string;
  key: string;
  value: string;
  group: string;
}

interface SettingsFormProps {
  settings: Setting[];
}

const settingGroups = [
  {
    id: 'general',
    title: 'Umum',
    fields: [
      { key: 'site_name', label: 'Nama Situs', type: 'input' },
      { key: 'site_tagline', label: 'Tagline', type: 'input' },
      { key: 'site_description', label: 'Deskripsi', type: 'textarea' },
    ],
  },
  {
    id: 'contact',
    title: 'Kontak',
    fields: [
      { key: 'contact_email', label: 'Email', type: 'input' },
      { key: 'contact_whatsapp', label: 'WhatsApp', type: 'input' },
      { key: 'contact_whatsapp_display', label: 'WhatsApp (Tampilan)', type: 'input' },
      { key: 'contact_whatsapp_link', label: 'WhatsApp Link', type: 'input' },
      { key: 'contact_instagram', label: 'Instagram', type: 'input' },
      { key: 'contact_instagram_link', label: 'Instagram Link', type: 'input' },
      { key: 'address_street', label: 'Alamat Jalan', type: 'textarea' },
      { key: 'address_city', label: 'Kota', type: 'input' },
      { key: 'address_province', label: 'Provinsi', type: 'input' },
      { key: 'address_postal_code', label: 'Kode Pos', type: 'input' },
    ],
  },
  {
    id: 'maps',
    title: 'Peta',
    fields: [
      { key: 'maps_embed_url', label: 'URL Embed Google Maps', type: 'input' },
      { key: 'maps_link_url', label: 'Link Google Maps', type: 'input' },
    ],
  },
  {
    id: 'stats',
    title: 'Statistik',
    fields: [
      { key: 'stats_total_rooms', label: 'Total Kamar', type: 'input' },
      { key: 'stats_room_types', label: 'Tipe Kamar', type: 'input' },
      { key: 'stats_starting_price', label: 'Harga Mulai', type: 'input' },
      { key: 'stats_starting_price_per_month', label: 'Harga Mulai per Bulan', type: 'input' },
      { key: 'stats_location', label: 'Lokasi', type: 'input' },
    ],
  },
];

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const settingsMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });
    return map;
  }, [settings]);

  const [values, setValues] = React.useState<Record<string, string>>(settingsMap);

  React.useEffect(() => {
    setValues(settingsMap);
  }, [settingsMap]);

  const handleFieldChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const entries = Object.entries(values).filter(
        ([key]) => key in settingsMap || settingGroups.some((g) => g.fields.some((f) => f.key === key))
      );

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: entries.map(([key, value]) => ({ key, value })) }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menyimpan');
      }

      toast.success('Pengaturan berhasil disimpan.');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
            Pengaturan
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Kelola pengaturan umum Harmony Home.
          </p>
        </div>
        <Button type="submit" disabled={loading} className="h-9 w-full text-xs sm:h-10 sm:w-auto sm:text-sm">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Simpan Pengaturan
        </Button>
      </div>

      {settingGroups.map((group) => (
        <Card key={group.id} className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">{group.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {group.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.key}
                    value={values[field.key] ?? ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    rows={3}
                  />
                ) : (
                  <Input
                    id={field.key}
                    value={values[field.key] ?? ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </form>
  );
}
