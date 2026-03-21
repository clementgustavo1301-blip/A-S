'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Calculator,
  FileText,
  PanelLeftOpen,
  PanelLeftClose,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebar } from './sidebar-context';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/crm', label: 'CRM', icon: Users },
  { href: '/pricing', label: 'Precificação', icon: Calculator },
  { href: '/proposals', label: 'Propostas', icon: FileText },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { isExpanded } = useSidebar();

  return (
    <div className="space-y-1 py-4">
      {navItems.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            title={!isExpanded ? item.label : undefined}
            onClick={onNavigate}
            className={cn(
              "flex items-center rounded-lg text-sm font-medium transition-all duration-200 group relative",
              isExpanded ? "gap-3 px-3 py-2.5" : "md:justify-center md:p-2.5 gap-3 px-3 py-2.5",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
            )}
            <item.icon className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-primary" : "group-hover:text-foreground")} />
            {/* Always show label on mobile drawer, conditionally on desktop */}
            <span className={cn("md:hidden", isExpanded && "md:inline")}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { isExpanded, toggle, isMobileMenuOpen, closeMobileMenu } = useSidebar();

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileMenu();
    };
    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  return (
    <>
      {/* ===== Desktop Sidebar (hidden on mobile) ===== */}
      <aside
        className={cn(
          "hidden md:flex fixed left-0 top-0 bottom-0 bg-sidebar border-r border-border flex-col z-50 transition-all duration-300",
          isExpanded ? "w-64" : "w-24"
        )}
      >
        {/* Logo */}
        {isExpanded ? (
          <div className="flex flex-col items-center py-5 px-4 border-b border-border">
            <div className="relative h-[100px] w-[140px] shrink-0">
              <Image
                src="/logo.png"
                alt="A&S Energia Solar"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center border-b border-border py-3 px-2">
            <div className="relative h-[72px] w-[72px] shrink-0">
              <Image
                src="/logo.png"
                alt="A&S Energia Solar"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        )}

        <ScrollArea className={cn("flex-1", isExpanded ? "px-3" : "px-2")}>
          <SidebarNav />
        </ScrollArea>

        {/* Toggle Button */}
        <div className={cn("p-3 border-t border-border", isExpanded ? "" : "flex justify-center")}>
          <button
            onClick={toggle}
            className="flex items-center gap-2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            title={isExpanded ? "Recolher menu" : "Expandir menu"}
          >
            {isExpanded ? (
              <>
                <PanelLeftClose className="h-4 w-4" />
                <span className="text-xs">Recolher</span>
              </>
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>

      {/* ===== Mobile Drawer Overlay ===== */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* ===== Mobile Drawer ===== */}
      <aside
        className={cn(
          "md:hidden fixed left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-border flex flex-col z-50 transition-transform duration-300 ease-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="relative h-[56px] w-[100px] shrink-0">
            <Image
              src="/logo.png"
              alt="A&S Energia Solar"
              fill
              className="object-contain"
              priority
            />
          </div>
          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ScrollArea className="flex-1 px-3">
          <SidebarNav onNavigate={closeMobileMenu} />
        </ScrollArea>
      </aside>
    </>
  );
}
