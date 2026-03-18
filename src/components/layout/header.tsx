'use client';

import { usePathname } from 'next/navigation';
import { Bell, LogOut, User } from 'lucide-react';
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

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Visão geral do seu negócio' },
  '/crm': { title: 'CRM', subtitle: 'Gestão de leads e pipeline' },
  '/pricing': { title: 'Precificação', subtitle: 'Motor de cálculo solar' },
  '/proposals': { title: 'Propostas', subtitle: 'Geração de propostas comerciais' },
};

export function Header() {
  const pathname = usePathname();

  const currentPage = Object.entries(pageTitles).find(([path]) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)
  );
  const { title, subtitle } = currentPage?.[1] ?? { title: 'Página', subtitle: '' };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex h-16 w-full items-center justify-between px-8">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full hover:bg-muted">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-primary" />
          </Button>

          <Separator orientation="vertical" className="h-5" />

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
