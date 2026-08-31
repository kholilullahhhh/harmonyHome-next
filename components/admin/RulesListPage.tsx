'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface RuleItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  items: string[];
  sortOrder: number;
  isPublished: boolean;
}

interface RulesListPageProps {
  rules: RuleItem[];
}

const emptyForm = {
  title: '',
  description: '',
  icon: 'ScrollText',
  items: '',
  sortOrder: 0,
  isPublished: true,
};

export function RulesListPage({ rules }: RulesListPageProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const [loading, setLoading] = React.useState(false);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (item: RuleItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      icon: item.icon,
      items: Array.isArray(item.items) ? (item.items as string[]).join('\n') : typeof item.items === 'string' ? item.items : '',
      sortOrder: item.sortOrder,
      isPublished: item.isPublished,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Judul wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      const url = editingId
        ? `/api/admin/rules/${editingId}`
        : '/api/admin/rules';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          icon: form.icon.trim(),
          items: form.items.split('\n').map((s) => s.trim()).filter(Boolean),
          sortOrder: form.sortOrder,
          isPublished: form.isPublished,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menyimpan');
      }
      toast.success(editingId ? 'Aturan berhasil diperbarui.' : 'Aturan berhasil ditambahkan.');
      setDialogOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/rules/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');
      toast.success('Aturan berhasil dihapus.');
      router.refresh();
    } catch {
      toast.error('Gagal menghapus aturan.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight">
            Aturan
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola aturan Harmony Home.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Aturan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Aturan' : 'Tambah Aturan'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Aturan Umum"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="icon">Ikon</Label>
                  <Input
                    id="icon"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="ScrollText"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Urutan</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="items">Item (satu per baris)</Label>
                <Textarea
                  id="items"
                  value={form.items}
                  onChange={(e) => setForm({ ...form, items: e.target.value })}
                  rows={5}
                  placeholder={"Dilarang merokok\nJam bertamu hingga 22.00\nDilarang membawa hewan"}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="isPublished"
                  checked={form.isPublished}
                  onCheckedChange={(v) => setForm({ ...form, isPublished: v })}
                />
                <Label htmlFor="isPublished" className="cursor-pointer">
                  Dipublikasikan
                </Label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingId ? 'Simpan' : 'Tambah'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-0">
          {rules.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <p className="text-sm text-muted-foreground">Belum ada aturan.</p>
              <Button className="mt-4" size="sm" onClick={openAdd}>
                Tambah Aturan
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-3 font-medium">Judul</th>
                    <th className="px-6 py-3 font-medium">Ikon</th>
                    <th className="px-6 py-3 font-medium">Item</th>
                    <th className="px-6 py-3 font-medium">Urutan</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rules.map((item) => (
                    <tr key={item.id} className="hover:bg-secondary/50">
                      <td className="px-6 py-4 font-medium">{item.title}</td>
                      <td className="px-6 py-4 text-muted-foreground">{item.icon}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {Array.isArray(item.items) ? (item.items as string[]).length : 0} item
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{item.sortOrder}</td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className={item.isPublished ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-950/60 dark:text-gray-400'}>
                          {item.isPublished ? 'Aktif' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Aturan</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus &quot;{item.title}&quot;? Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(item.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
