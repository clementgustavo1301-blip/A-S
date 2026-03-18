'use client';

import { useState } from 'react';
import type { Lead, LeadStatus } from '@/types';
import { LEAD_STATUS_LABELS, LEAD_STATUS_ORDER } from '@/types';
import { KanbanColumn } from '@/components/crm/kanban-column';
import { LeadFormSheet } from '@/components/crm/lead-form-sheet';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Mock leads para desenvolvimento
const initialLeads: Lead[] = [
  {
    id: '1', user_id: 'u1', nome: 'João Silva', email: 'joao@email.com',
    telefone: '11999887766', endereco: 'Rua das Palmeiras, 123 - SP', cpf_cnpj: '123.456.789-00',
    status: 'contato', consumo_kwh: 450, anexos: [], created_at: '2026-03-01', updated_at: '2026-03-01',
  },
  {
    id: '2', user_id: 'u1', nome: 'Maria Oliveira', email: 'maria@email.com',
    telefone: '11988776655', endereco: 'Av. Brasil, 456 - RJ', cpf_cnpj: '987.654.321-00',
    status: 'visita_tecnica', consumo_kwh: 680, anexos: [], created_at: '2026-02-15', updated_at: '2026-03-05',
  },
  {
    id: '3', user_id: 'u1', nome: 'Carlos Santos', email: 'carlos@email.com',
    telefone: '21977665544', endereco: 'Rua do Sol, 789 - MG', cpf_cnpj: '456.789.123-00',
    status: 'proposta_enviada', consumo_kwh: 520, anexos: [], created_at: '2026-02-10', updated_at: '2026-03-08',
  },
  {
    id: '4', user_id: 'u1', nome: 'Ana Costa', email: 'ana@email.com',
    telefone: '31966554433', endereco: 'Rua das Flores, 321 - PR', cpf_cnpj: '321.654.987-00',
    status: 'negociacao', consumo_kwh: 380, anexos: [], created_at: '2026-01-20', updated_at: '2026-03-10',
  },
  {
    id: '5', user_id: 'u1', nome: 'Pedro Almeida', email: 'pedro@email.com',
    telefone: '41955443322', endereco: 'Av. Energia, 555 - SC', cpf_cnpj: '654.321.987-00',
    status: 'aguardando_assinatura', consumo_kwh: 900, anexos: [], created_at: '2026-01-05', updated_at: '2026-03-12',
  },
  {
    id: '6', user_id: 'u1', nome: 'Fernanda Lima', email: 'fernanda@email.com',
    telefone: '51944332211', endereco: 'Rua Solar, 100 - RS', cpf_cnpj: '789.123.456-00',
    status: 'assinado', consumo_kwh: 750, anexos: [], created_at: '2025-12-01', updated_at: '2026-03-14',
  },
  {
    id: '7', user_id: 'u1', nome: 'Roberto Nunes', email: 'roberto@email.com',
    telefone: '11933221100', endereco: 'Rua Horizonte, 200 - SP', cpf_cnpj: '111.222.333-44',
    status: 'contato', consumo_kwh: 320, anexos: [], created_at: '2026-03-10', updated_at: '2026-03-10',
  },
];

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleDragEnd = (leadId: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus, updated_at: new Date().toISOString() } : lead
      )
    );
  };

  const handleOpenLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsCreating(false);
    setSheetOpen(true);
  };

  const handleNewLead = () => {
    setSelectedLead(null);
    setIsCreating(true);
    setSheetOpen(true);
  };

  const handleSaveLead = (data: Partial<Lead>) => {
    if (isCreating) {
      const newLead: Lead = {
        id: crypto.randomUUID(),
        user_id: 'u1',
        nome: data.nome || '',
        email: data.email || '',
        telefone: data.telefone || '',
        endereco: data.endereco || '',
        cpf_cnpj: data.cpf_cnpj || '',
        status: 'contato',
        consumo_kwh: data.consumo_kwh || 0,
        anexos: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setLeads((prev) => [...prev, newLead]);
    } else if (selectedLead) {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === selectedLead.id
            ? { ...lead, ...data, updated_at: new Date().toISOString() }
            : lead
        )
      );
    }
    setSheetOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRM - Pipeline</h1>
          <p className="text-sm text-muted-foreground">
            Arraste os cards para mover leads entre etapas
          </p>
        </div>
        <Button onClick={handleNewLead} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {LEAD_STATUS_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            leads={leads.filter((l) => l.status === status)}
            onDragEnd={handleDragEnd}
            onOpenLead={handleOpenLead}
          />
        ))}
      </div>

      {/* Lead Form Sheet */}
      <LeadFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        lead={isCreating ? null : selectedLead}
        onSave={handleSaveLead}
      />
    </div>
  );
}
