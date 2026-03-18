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
  aguardando_assinatura: 'bg-sky-400',
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
      className={`flex flex-col rounded-xl border border-border/60 bg-card transition-all ${
        isDragOver ? 'ring-2 ring-primary/40 bg-primary/5' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border/40">
        <div className={`h-2.5 w-2.5 rounded-full ${columnColors[status]}`} />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{LEAD_STATUS_LABELS[status]}</h3>
        <Badge variant="secondary" className="ml-auto text-[10px] font-semibold h-5 px-2 rounded-md">
          {leads.length}
        </Badge>
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-3 p-3 min-h-[200px]">
        {leads.map((lead) => (
          <KanbanCard key={lead.id} lead={lead} onClick={() => onOpenLead(lead)} />
        ))}
        {leads.length === 0 && (
          <div className="flex flex-1 items-center justify-center p-4 text-xs font-medium text-muted-foreground/40 text-center">
            Arraste leads para esta etapa
          </div>
        )}
      </div>
    </div>
  );
}
