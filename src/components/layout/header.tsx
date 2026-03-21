'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Bell, LogOut, User, Menu, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from './sidebar-context';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Visão geral do seu negócio' },
  '/crm': { title: 'CRM', subtitle: 'Gestão de leads e pipeline' },
  '/pricing': { title: 'Precificação', subtitle: 'Motor de cálculo solar' },
  '/proposals': { title: 'Propostas', subtitle: 'Geração de propostas comerciais' },
};

export function Header() {
  const pathname = usePathname();
  const { toggleMobileMenu } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentPage = Object.entries(pageTitles).find(([path]) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)
  );
  const { title, subtitle } = currentPage?.[1] ?? { title: 'Página', subtitle: '' };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex h-14 md:h-16 w-full items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex flex-col">
            <h2 className="text-base md:text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-[11px] md:text-xs text-muted-foreground hidden sm:block">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-3">
          {/* Dark mode toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-muted cursor-pointer"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-9 w-9 rounded-full hover:bg-muted cursor-pointer flex items-center justify-center outline-none">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-primary" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 mt-2" align="end">
              <div className="p-3 border-b border-border">
                <p className="text-sm font-semibold">Atualizações</p>
                <p className="text-[11px] text-muted-foreground">Novidades do sistema</p>
              </div>
              <div className="p-3 space-y-3 max-h-80 overflow-y-auto">
                {/* Today */}
                <div>
                  <p className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-2">21 de Março, 2026</p>
                  <div className="space-y-2">
                    <div className="flex gap-2.5 p-2 rounded-lg hover:bg-secondary/60 transition-colors">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground">Layout Mobile Otimizado</p>
                        <p className="text-[11px] text-muted-foreground">Sidebar mobile com drawer, kanban responsivo e formulários adaptados para telas pequenas.</p>
                      </div>
                    </div>
                    <div className="flex gap-2.5 p-2 rounded-lg hover:bg-secondary/60 transition-colors">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground">Modo Escuro</p>
                        <p className="text-[11px] text-muted-foreground">Novo tema dark navy com toggle no header. Todas as páginas compatíveis.</p>
                      </div>
                    </div>
                    <div className="flex gap-2.5 p-2 rounded-lg hover:bg-secondary/60 transition-colors">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground">Precificação Mobile</p>
                        <p className="text-[11px] text-muted-foreground">Barra de resumo compacta com detalhes expansíveis para melhor visualização no celular.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-5 hidden sm:block" />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-9 w-9 outline-none ring-offset-background transition-all focus-within:ring-2 focus-within:ring-primary/50 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm border border-primary/20">
                  JS
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2" align="end">
              <div className="flex flex-col space-y-1 p-3">
                <p className="text-sm font-semibold">João Silva</p>
                <p className="text-xs text-muted-foreground">
                  Administrador
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-2.5 cursor-pointer">
                <User className="mr-2.5 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-2.5 cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="mr-2.5 h-4 w-4" />
                <span className="text-sm font-medium">Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
