'use client';

import { useState } from 'react';
import type { Lead, LeadStatus } from '@/types';
import { LEAD_STATUS_LABELS } from '@/types';
import { KanbanCard } from './kanban-card';
import { Badge } from '@/components/ui/badge';

const columnColors: Record<LeadStatus, string> = {
  contato: 'bg-slate-400',
  visita_tecnica: 'bg-blue-400',
  proposta_enviada: 'bg-amber-400',
  negociacao: 'bg-orange-400',
  aguardando_assinatura: 'bg-violet-400',
  assinado: 'bg-emerald-400',
};

interface KanbanColumnProps {
  status: LeadStatus;
  leads: Lead[];
  onDragEnd: (leadId: string, newStatus: LeadStatus) => void;
  onOpenLead: (lead: Lead) => void;
}

export function KanbanColumn({ status, leads, onDragEnd, onOpenLead }: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      onDragEnd(leadId, status);
    }
  };

  return (
    <div
      className={`flex min-w-[300px] flex-col rounded-2xl border border-border/20 glass transition-all ${
        isDragOver ? 'ring-2 ring-primary/50 bg-primary/5' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border/10">
        <div className={`h-2.5 w-2.5 rounded-full ${columnColors[status]} shadow-[0_0_8px_rgba(0,0,0,0.2)]`} />
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{LEAD_STATUS_LABELS[status]}</h3>
        <Badge variant="secondary" className="ml-auto text-[10px] font-mono h-5 px-1.5 rounded-md bg-white/5 border-border/10">
          {leads.length}
        </Badge>
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-3 p-3 min-h-[400px]">
        {leads.map((lead) => (
          <KanbanCard key={lead.id} lead={lead} onClick={() => onOpenLead(lead)} />
        ))}
        {leads.length === 0 && (
          <div className="flex flex-1 items-center justify-center p-4 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/30 text-center">
            Mover para esta etapa
          </div>
        )}
      </div>
    </div>
  );
}
