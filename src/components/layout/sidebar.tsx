'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calculator,
  FileText,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/crm', label: 'CRM', icon: Users },
  { href: '/pricing', label: 'Precificação', icon: Calculator },
  { href: '/proposals', label: 'Propostas', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r border-border/50 flex flex-col z-50">
      {/* Sidebar Logo */}
      <div className="flex h-20 items-center gap-4 px-6 border-b border-border/30">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary border border-primary/30 shadow-[0_0_15px_rgba(46,139,87,0.3)]">
          <Zap className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-foreground font-mono">
            ANTIGRAVITY
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-primary/80 font-mono">
            Solar CRM
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 py-6">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 rounded-md px-4 py-3 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "bg-muted/50 text-foreground border border-border"
                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground border border-transparent"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(46,139,87,0.8)]" />
                )}
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "group-hover:text-foreground")} />
                <span className="font-sans">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      {/* Profiler/Status Footer */}
      <div className="p-4 border-t border-border/30">
        <div className="flex flex-col gap-1 p-3 rounded-md bg-muted/20 border border-border/30">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-muted-foreground font-mono uppercase">System Status</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>
          <span className="text-xs font-mono text-foreground mt-1">v1.0.0-stable</span>
        </div>
      </div>
    </aside>
  );
}
