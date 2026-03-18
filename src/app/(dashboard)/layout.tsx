'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { SidebarProvider, useSidebar } from '@/components/layout/sidebar-context';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebar();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: isExpanded ? 256 : 96 }}
      >
        <Header />
        <main className="flex-1 p-8 overflow-x-hidden max-w-(--breakpoint-2xl) mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
