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
      className="cursor-grab border-border/30 bg-white/5 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 hover:bg-white/10 active:cursor-grabbing rounded-xl group"
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm truncate font-outfit text-foreground group-hover:text-primary transition-colors">
            {lead.nome}
          </h4>
        </div>
        <div className="space-y-2">
          {lead.telefone && (
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
              <div className="p-1 rounded-md bg-slate-500/10 text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                <Phone className="h-3 w-3 shrink-0" />
              </div>
              <span className="truncate">{formatPhone(lead.telefone)}</span>
            </div>
          )}
          {lead.endereco && (
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                <div className="p-1 rounded-md bg-slate-500/10 text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                  <MapPin className="h-3 w-3 shrink-0" />
                </div>
              <span className="truncate">{lead.endereco}</span>
            </div>
          )}
          <div className="pt-2 flex items-center justify-between">
             <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-tighter shadow-inner border border-primary/10">
              <Zap className="h-3 w-3 shrink-0" />
              <span>{lead.consumo_kwh} kWh/mês</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
