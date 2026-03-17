// =============================================================
// ANTIGRAVITY - Type Definitions
// =============================================================

export type UserRole = 'admin' | 'sales' | 'engineer';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export type LeadStatus =
  | 'contato'
  | 'visita_tecnica'
  | 'proposta_enviada'
  | 'negociacao'
  | 'aguardando_assinatura'
  | 'assinado';

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  contato: 'Contato',
  visita_tecnica: 'Visita Técnica',
  proposta_enviada: 'Proposta Enviada',
  negociacao: 'Negociação',
  aguardando_assinatura: 'Aguardando Assinatura',
  assinado: 'Assinado',
};

export const LEAD_STATUS_ORDER: LeadStatus[] = [
  'contato',
  'visita_tecnica',
  'proposta_enviada',
  'negociacao',
  'aguardando_assinatura',
  'assinado',
];

export interface Lead {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf_cnpj: string;
  status: LeadStatus;
  consumo_kwh: number;
  anexos: string[];
  created_at: string;
  updated_at: string;
}

export type CostCategory = 'kit' | 'frete' | 'engenharia' | 'mao_de_obra';

export const COST_CATEGORY_LABELS: Record<CostCategory, string> = {
  kit: 'Kit (Equipamentos)',
  frete: 'Frete / Logística',
  engenharia: 'Engenharia',
  mao_de_obra: 'Mão de Obra',
};

export interface CostVariable {
  id: string;
  nome: string;
  categoria: CostCategory;
  valor_base: number;
  ativo: boolean;
  updated_at: string;
}

export type ContractStatus = 'rascunho' | 'gerado' | 'enviado_para_assinatura' | 'assinado';

export interface Proposal {
  id: string;
  lead_id: string;
  user_id: string;
  custo_kit: number;
  custo_frete: number;
  custo_engenharia: number;
  custo_mao_obra: number;
  margem_lucro_perc: number;
  comissao_perc: number;
  preco_venda_final: number;
  economia_estimada_anual: number;
  payback_meses: number;
  potencia_kwp: number;
  status_contrato: ContractStatus;
  url_pdf_proposta: string;
  url_pdf_contrato: string;
  signature_webhook_id: string;
  created_at: string;
  updated_at: string;
  // Joined
  lead?: Lead;
}

// Dashboard metrics
export interface DashboardMetrics {
  volumeVendas: number;
  ticketMedio: number;
  cac: number;
  taxaConversao: number;
  totalLeads: number;
  leadsAssinados: number;
  leadsPorStatus: Record<LeadStatus, number>;
}
