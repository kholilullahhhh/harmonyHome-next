'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Trash2, CheckCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  createdAt: string | Date;
}

interface MessagesListPageProps {
  messages: Message[];
  total: number;
  page: number;
  totalPages: number;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  UNREAD: {
    label: 'Belum Dibaca',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
  },
  READ: {
    label: 'Dibaca',
    className: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400',
  },
  REPLIED: {
    label: 'Dibalas',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
  },
};

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MessagesListPage({
  messages,
  total,
}: MessagesListPageProps) {
  const router = useRouter();
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'READ' }),
      });
      if (!res.ok) throw new Error('Gagal memperbarui');
      toast.success('Pesan ditandai sudah dibaca.');
      router.refresh();
    } catch {
      toast.error('Gagal memperbarui status pesan.');
    }
  };

  const handleMarkAsReplied = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REPLIED' }),
      });
      if (!res.ok) throw new Error('Gagal memperbarui');
      toast.success('Pesan ditandai sudah dibalas.');
      router.refresh();
    } catch {
      toast.error('Gagal memperbarui status pesan.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');
      toast.success('Pesan berhasil dihapus.');
      router.refresh();
    } catch {
      toast.error('Gagal menghapus pesan.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
          Pesan Kontak
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Kelola pesan masuk dari pengunjung Harmony Home.
        </p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Daftar Pesan ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <Mail className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">
                Belum ada pesan.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-2 pr-3 font-medium sm:pb-3 sm:pr-4">Nama</th>
                    <th className="hidden pb-2 pr-3 font-medium sm:table-cell sm:pb-3 sm:pr-4">Email</th>
                    <th className="hidden pb-2 pr-3 font-medium sm:table-cell sm:pb-3 sm:pr-4">Subjek</th>
                    <th className="hidden pb-2 pr-3 font-medium md:table-cell sm:pb-3 sm:pr-4">Tanggal</th>
                    <th className="pb-2 pr-3 font-medium sm:pb-3 sm:pr-4">Status</th>
                    <th className="pb-2 font-medium sm:pb-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {messages.map((msg) => {
                    const st = statusConfig[msg.status] ?? statusConfig.UNREAD;
                    return (
                      <tr key={msg.id} className="hover:bg-secondary/50">
                        <td className="pb-2 pr-3 sm:pb-3 sm:pr-4">
                          <p className="font-medium">{msg.name}</p>
                          <p className="text-[11px] text-muted-foreground sm:hidden">{msg.email}</p>
                          <p className="text-[11px] text-muted-foreground md:hidden">{formatDate(msg.createdAt)}</p>
                        </td>
                        <td className="hidden pb-2 pr-3 text-muted-foreground sm:table-cell sm:pb-3 sm:pr-4">{msg.email}</td>
                        <td className="hidden max-w-[200px] pb-2 pr-3 text-muted-foreground sm:table-cell sm:pb-3 sm:pr-4">
                          <span className="truncate">{msg.subject || '-'}</span>
                        </td>
                        <td className="hidden pb-2 pr-3 text-muted-foreground md:table-cell sm:pb-3 sm:pr-4">
                          {formatDate(msg.createdAt)}
                        </td>
                        <td className="pb-2 pr-3 sm:pb-3 sm:pr-4">
                          <Badge variant="secondary" className={cn('text-[9px] sm:text-xs', st.className)}>
                            {st.label}
                          </Badge>
                        </td>
                        <td className="pb-2 sm:pb-3">
                          <div className="flex gap-0.5 sm:gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedMessage(msg);
                                if (msg.status === 'UNREAD') {
                                  handleMarkAsRead(msg.id);
                                }
                              }}
                            >
                              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                            {msg.status !== 'REPLIED' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleMarkAsReplied(msg.id)}
                                title="Tandai sudah dibalas"
                              >
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 sm:h-4 sm:w-4" />
                              </Button>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Trash2 className="h-3.5 w-3.5 text-destructive sm:h-4 sm:w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Hapus Pesan</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus pesan dari &quot;{msg.name}&quot;? Tindakan ini tidak dapat dibatalkan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(msg.id)}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject || 'Pesan'}</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <span className="text-muted-foreground">Nama:</span>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{selectedMessage.email}</p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <span className="text-muted-foreground">Telepon:</span>
                    <p className="font-medium">{selectedMessage.phone}</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Tanggal:</span>
                  <p className="font-medium">{formatDate(selectedMessage.createdAt)}</p>
                </div>
              </div>
              <div className="rounded-md border p-4 text-sm">
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
