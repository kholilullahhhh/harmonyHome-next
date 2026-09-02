"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  isPublished: boolean;
}

interface TestimonialsListPageProps {
  testimonials: TestimonialItem[];
}

const emptyForm = {
  name: "",
  role: "",
  content: "",
  rating: 5,
  avatar: "",
  isPublished: true,
};

export function TestimonialsListPage({
  testimonials,
}: TestimonialsListPageProps) {
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

  const openEdit = (item: TestimonialItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      role: item.role,
      content: item.content,
      rating: item.rating,
      avatar: item.avatar,
      isPublished: item.isPublished,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) {
      toast.error("Nama dan konten wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const url = editingId
        ? `/api/admin/testimonials/${editingId}`
        : "/api/admin/testimonials";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          role: form.role.trim(),
          content: form.content.trim(),
          avatar: form.avatar.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menyimpan");
      }
      toast.success(
        editingId
          ? "Testimoni berhasil diperbarui."
          : "Testimoni berhasil ditambahkan.",
      );
      setDialogOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Testimoni berhasil dihapus.");
      router.refresh();
    } catch {
      toast.error("Gagal menghapus testimoni.");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
            Testimoni
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Kelola testimoni penghuni Harmony Home.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Testimoni
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Testimoni" : "Tambah Testimoni"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Andi"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Peran</Label>
                  <Input
                    id="role"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Mahasiswa"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Konten</Label>
                <Textarea
                  id="content"
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  rows={4}
                  maxLength={80}
                  placeholder="Sangat nyaman dan strategis..."
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min={1}
                    max={5}
                    value={form.rating}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        rating: parseInt(e.target.value) || 5,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">URL Avatar</Label>
                  <Input
                    id="avatar"
                    value={form.avatar}
                    onChange={(e) =>
                      setForm({ ...form, avatar: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
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
                  {editingId ? "Simpan" : "Tambah"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-0">
          {testimonials.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <p className="text-sm text-muted-foreground">
                Belum ada testimoni.
              </p>
              <Button className="mt-4" size="sm" onClick={openAdd}>
                Tambah Testimoni
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-3 py-2.5 font-medium sm:px-6 sm:py-3">
                      Nama
                    </th>
                    <th className="hidden px-3 py-2.5 font-medium sm:table-cell sm:px-6 sm:py-3">
                      Peran
                    </th>
                    <th className="hidden px-3 py-2.5 font-medium sm:table-cell sm:px-6 sm:py-3">
                      Konten
                    </th>
                    <th className="px-3 py-2.5 font-medium sm:px-6 sm:py-3">
                      Rating
                    </th>
                    <th className="px-3 py-2.5 font-medium sm:px-6 sm:py-3">
                      Status
                    </th>
                    <th className="px-3 py-2.5 font-medium sm:px-6 sm:py-3">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {testimonials.map((item) => (
                    <tr key={item.id} className="hover:bg-secondary/50">
                      <td className="px-3 py-2.5 sm:px-6 sm:py-4">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground sm:hidden">
                          {item.role}
                        </p>
                      </td>
                      <td className="hidden px-3 py-2.5 text-muted-foreground sm:table-cell sm:px-6 sm:py-4">
                        {item.role}
                      </td>
                      <td className="hidden max-w-[250px] px-3 py-2.5 text-muted-foreground sm:table-cell sm:px-6 sm:py-4">
                        <span className="truncate">{item.content}</span>
                      </td>
                      <td className="px-3 py-2.5 sm:px-6 sm:py-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs text-muted-foreground">
                            {item.rating}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 sm:px-6 sm:py-4">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[9px] sm:text-xs",
                            item.isPublished
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-950/60 dark:text-gray-400",
                          )}
                        >
                          {item.isPublished ? "Aktif" : "Draft"}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5 sm:px-6 sm:py-4">
                        <div className="flex gap-0.5 sm:gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(item)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-destructive sm:h-4 sm:w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Hapus Testimoni
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus testimoni
                                  dari &quot;{item.name}&quot;? Tindakan ini
                                  tidak dapat dibatalkan.
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
