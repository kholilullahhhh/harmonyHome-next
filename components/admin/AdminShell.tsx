'use client';

import * as React from 'react';

import { AdminSidebar, AdminMobileSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

interface AdminShellProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-secondary/30">
      <AdminSidebar user={user} />

      <AdminMobileSidebar
        user={user}
        open={mobileOpen}
        onOpenChange={setMobileOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <AdminHeader
          user={user}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
