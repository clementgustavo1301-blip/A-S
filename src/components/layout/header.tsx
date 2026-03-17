'use client';

import { Bell, LogOut, User, Terminal } from 'lucide-react';
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

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border/50">
      <div className="flex h-20 w-full items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted/30 rounded-md border border-border">
            <Terminal className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-sans font-semibold text-foreground">Visão Geral</h2>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Painel Operacional</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-muted/30">
            <Bell className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_rgba(255,215,0,0.8)]" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-10 w-10 outline-none ring-offset-background transition-all focus-within:ring-2 focus-within:ring-primary/50 rounded-full border border-border/50 hover:border-border">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-muted text-foreground font-mono text-sm border border-border/50">
                  JS
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 mt-2 oled-card border-border/50" align="end">
              <div className="flex flex-col space-y-1 p-4">
                <p className="text-sm font-semibold font-sans">João Silva</p>
                <p className="text-xs font-mono text-primary uppercase tracking-wider">
                  Admin
                </p>
              </div>
              <DropdownMenuSeparator className="bg-border/30" />
              <DropdownMenuItem className="p-3 cursor-pointer hover:bg-muted/30 rounded-md transition-colors m-1">
                <User className="mr-3 h-4 w-4 text-muted-foreground" />
                <span className="font-sans text-sm">Configuração de Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/30" />
              <DropdownMenuItem className="p-3 cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors m-1">
                <LogOut className="mr-3 h-4 w-4" />
                <span className="font-sans text-sm font-semibold">Desconectar Sessão</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
