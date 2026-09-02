"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
}

interface FaqListPageProps {
  faq: FaqItem[];
}

const emptyForm = {
  question: "",
  answer: "",
  sortOrder: 0,
  isPublished: true,
};

export function FaqListPage({ faq }: FaqListPageProps) {
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

  const openEdit = (item: FaqItem) => {
    setEditingId(item.id);
    setForm({
      question: item.question,
      answer: item.answer,
      sortOrder: item.sortOrder,
      isPublished: item.isPublished,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Pertanyaan dan jawaban wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const url = editingId ? `/api/admin/faq/${editingId}` : "/api/admin/faq";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          question: form.question.trim(),
          answer: form.answer.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menyimpan");
      }
      toast.success(
        editingId ? "FAQ berhasil diperbarui." : "FAQ berhasil ditambahkan.",
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
      const res = await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("FAQ berhasil dihapus.");
      router.refresh();
    } catch {
      toast.error("Gagal menghapus FAQ.");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
            FAQ
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Kelola pertanyaan umum Harmony Home.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit FAQ" : "Tambah FAQ"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Pertanyaan</Label>
                <Input
                  id="question"
                  value={form.question}
                  onChange={(e) =>
                    setForm({ ...form, question: e.target.value })
                  }
                  placeholder="Apa itu Harmony Home?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer">Jawaban</Label>
                <Textarea
                  id="answer"
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  rows={4}
                  maxLength={100}
                  placeholder="Harmony Home adalah..."
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Urutan</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        sortOrder: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="flex items-center gap-2 pb-1">
                  <Switch
                    id="isPublished"
                    checked={form.isPublished}
                    onCheckedChange={(v) =>
                      setForm({ ...form, isPublished: v })
                    }
                  />
                  <Label htmlFor="isPublished" className="cursor-pointer">
                    Dipublikasikan
                  </Label>
                </div>
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
          {faq.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <p className="text-sm text-muted-foreground">Belum ada FAQ.</p>
              <Button className="mt-4" size="sm" onClick={openAdd}>
                Tambah FAQ
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-3 py-2.5 font-medium sm:px-6 sm:py-3">
                      Pertanyaan
                    </th>
                    <th className="hidden px-3 py-2.5 font-medium sm:table-cell sm:px-6 sm:py-3">
                      Jawaban
                    </th>
                    <th className="hidden px-3 py-2.5 font-medium sm:table-cell sm:px-6 sm:py-3">
                      Urutan
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
                  {faq.map((item) => (
                    <tr key={item.id} className="hover:bg-secondary/50">
                      <td className="max-w-[200px] px-3 py-2.5 font-medium sm:max-w-[250px] sm:px-6 sm:py-4">
                        <p className="truncate">{item.question}</p>
                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground sm:hidden">
                          {item.answer}
                        </p>
                      </td>
                      <td className="hidden max-w-[300px] px-3 py-2.5 text-muted-foreground sm:table-cell sm:px-6 sm:py-4">
                        <span className="truncate">{item.answer}</span>
                      </td>
                      <td className="hidden px-3 py-2.5 text-muted-foreground sm:table-cell sm:px-6 sm:py-4">
                        {item.sortOrder}
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
                                <AlertDialogTitle>Hapus FAQ</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus FAQ ini?
                                  Tindakan ini tidak dapat dibatalkan.
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
