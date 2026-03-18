'use client';

import type { Lead } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Zap, MapPin } from 'lucide-react';
import { formatPhone } from '@/lib/utils';

interface KanbanCardProps {
  lead: Lead;
  onClick: () => void;
}

export function KanbanCard({ lead, onClick }: KanbanCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', lead.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card
      className="cursor-grab border-border/50 bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30 active:cursor-grabbing rounded-xl group"
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm truncate text-foreground group-hover:text-primary transition-colors">
            {lead.nome}
          </h4>
        </div>
        <div className="space-y-2">
          {lead.telefone && (
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <div className="p-1 rounded-md bg-muted group-hover:bg-primary/10 transition-colors">
                <Phone className="h-3 w-3 shrink-0 group-hover:text-primary transition-colors" />
              </div>
              <span className="truncate">{formatPhone(lead.telefone)}</span>
            </div>
          )}
          {lead.endereco && (
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <div className="p-1 rounded-md bg-muted group-hover:bg-primary/10 transition-colors">
                <MapPin className="h-3 w-3 shrink-0 group-hover:text-primary transition-colors" />
              </div>
              <span className="truncate">{lead.endereco}</span>
            </div>
          )}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/10 text-[10px] font-semibold text-primary uppercase tracking-tight">
              <Zap className="h-3 w-3 shrink-0" />
              <span>{lead.consumo_kwh} kWh/mês</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
