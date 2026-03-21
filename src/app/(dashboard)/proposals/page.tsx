'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Download,
  Send,
  CheckCircle2,
  Zap,
  TrendingDown,
  Clock,
  DollarSign,
  Sun,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Proposal, Lead } from '@/types';

// Mock data de propostas salvas
const mockProposals: (Proposal & { lead: Lead })[] = [
  {
    id: 'p1',
    lead_id: '1',
    user_id: 'u1',
    custo_kit: 6080,
    custo_frete: 800,
    custo_engenharia: 1750,
    custo_mao_obra: 4400,
    margem_lucro_perc: 30,
    comissao_perc: 5,
    preco_venda_final: 17590.50,
    economia_estimada_anual: 4590,
    payback_meses: 46,
    potencia_kwp: 3.3,
    status_contrato: 'rascunho',
    url_pdf_proposta: '',
    url_pdf_contrato: '',
    signature_webhook_id: '',
    created_at: '2026-03-10',
    updated_at: '2026-03-10',
    lead: {
      id: '1', user_id: 'u1', nome: 'João Silva', email: 'joao@email.com',
      telefone: '11999887766', endereco: 'Rua das Palmeiras, 123 - SP', cpf_cnpj: '123.456.789-00',
      status: 'proposta_enviada', consumo_kwh: 450, anexos: [], created_at: '2026-03-01', updated_at: '2026-03-01',
    },
  },
  {
    id: 'p2',
    lead_id: '2',
    user_id: 'u1',
    custo_kit: 9800,
    custo_frete: 1500,
    custo_engenharia: 1750,
    custo_mao_obra: 4400,
    margem_lucro_perc: 25,
    comissao_perc: 5,
    preco_venda_final: 22732.50,
    economia_estimada_anual: 6936,
    payback_meses: 39,
    potencia_kwp: 5.0,
    status_contrato: 'gerado',
    url_pdf_proposta: '',
    url_pdf_contrato: '',
    signature_webhook_id: '',
    created_at: '2026-03-08',
    updated_at: '2026-03-12',
    lead: {
      id: '2', user_id: 'u1', nome: 'Maria Oliveira', email: 'maria@email.com',
      telefone: '11988776655', endereco: 'Av. Brasil, 456 - RJ', cpf_cnpj: '987.654.321-00',
      status: 'negociacao', consumo_kwh: 680, anexos: [], created_at: '2026-02-15', updated_at: '2026-03-05',
    },
  },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  rascunho: { label: 'Rascunho', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  gerado: { label: 'Gerado', color: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' },
  enviado_para_assinatura: { label: 'Aguardando Assinatura', color: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' },
  assinado: { label: 'Assinado', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
};

export default function ProposalsPage() {
  const [proposals, setProposals] = useState(mockProposals);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sendingContract, setSendingContract] = useState(false);

  const selected = proposals.find((p) => p.id === selectedId);

  const handleGenerateContract = async (proposalId: string) => {
    setSendingContract(true);
    const proposal = proposals.find((p) => p.id === proposalId);
    if (!proposal) return;

    // Simula envio para n8n
    const payload = {
      lead_id: proposal.lead_id,
      proposal_id: proposal.id,
      chaves: {
        '{{NOME_CLIENTE}}': proposal.lead.nome,
        '{{CPF_CNPJ}}': proposal.lead.cpf_cnpj,
        '{{ENDERECO}}': proposal.lead.endereco,
        '{{VALOR_GLOBAL}}': formatCurrency(proposal.preco_venda_final),
        '{{POTENCIA}}': `${proposal.potencia_kwp} kWp`,
      },
    };

    try {
      // TODO: Ativar quando n8n estiver configurado
      // await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });

      // Simula delay do envio
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Atualiza status no state
      setProposals((prev) =>
        prev.map((p) =>
          p.id === proposalId
            ? { ...p, status_contrato: 'enviado_para_assinatura' as const }
            : p
        )
      );
    } catch (error) {
      console.error('Erro ao enviar contrato:', error);
    } finally {
      setSendingContract(false);
    }
  };

  const handleDownloadPDF = () => {
    // TODO: Implementar html2canvas + jsPDF
    alert('Funcionalidade de PDF será ativada com a integração completa.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Propostas & Contratos
        </h1>
        <p className="text-sm text-muted-foreground">
          Visualize propostas, gere contratos e envie para assinatura
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lista de Propostas */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Propostas Salvas
          </h2>
          {proposals.map((p) => {
            const st = statusLabels[p.status_contrato];
            return (
              <Card
                key={p.id}
                className={`cursor-pointer transition-all border-border/50 hover:shadow-md ${
                  selectedId === p.id ? 'ring-2 ring-primary/50 border-primary/30' : ''
                }`}
                onClick={() => setSelectedId(p.id)}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm truncate pr-2">{p.lead.nome}</h3>
                    <Badge className={`text-[10px] shrink-0 border-transparent ${st.color}`}>{st.label}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{p.lead.consumo_kwh} kWh/mês</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(p.preco_venda_final)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Visualizador de Proposta */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-4">
              {/* Hero Section */}
              <Card className="border-border/50 overflow-hidden shadow-md">
                <div className="bg-gradient-to-br from-primary via-primary/90 to-blue-600 p-6 sm:p-8 text-white relative overflow-hidden">
                  {/* Decorative background circle */}
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-inner">
                        <Sun className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold tracking-tight">Proposta Comercial</h2>
                        <p className="text-sm font-medium text-white/80">Sistema Fotovoltaico</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-6 relative z-10 p-4 rounded-xl bg-black/10 backdrop-blur-sm border border-white/10">
                    <div>
                      <p className="text-xs text-white/60">Cliente</p>
                      <p className="font-semibold">{selected.lead.nome}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Potência</p>
                      <p className="font-semibold">{selected.potencia_kwp} kWp</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Valor Total</p>
                      <p className="font-bold text-xl">{formatCurrency(selected.preco_venda_final)}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Análise Financeira */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="rounded-lg bg-emerald-500/10 p-2">
                      <TrendingDown className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Economia Anual</p>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(selected.economia_estimada_anual)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="rounded-lg bg-blue-500/10 p-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Payback</p>
                      <p className="font-bold text-blue-600 dark:text-blue-400">
                        ~{selected.payback_meses} meses
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="rounded-lg bg-amber-500/10 p-2">
                      <DollarSign className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Economia 25 anos</p>
                      <p className="font-bold text-amber-600 dark:text-amber-400">
                        {formatCurrency(selected.economia_estimada_anual * 25)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Breakdown de Custos */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Composição de Custos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kit (Equipamentos)</span>
                      <span className="font-medium">{formatCurrency(selected.custo_kit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frete / Logística</span>
                      <span className="font-medium">{formatCurrency(selected.custo_frete)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Engenharia</span>
                      <span className="font-medium">{formatCurrency(selected.custo_engenharia)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mão de Obra</span>
                      <span className="font-medium">{formatCurrency(selected.custo_mao_obra)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Margem de Lucro ({selected.margem_lucro_perc}%)</span>
                      <span className="font-medium">
                        {formatCurrency(
                          (selected.custo_kit + selected.custo_frete + selected.custo_engenharia + selected.custo_mao_obra) *
                            (selected.margem_lucro_perc / 100)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Comissão ({selected.comissao_perc}%)</span>
                      <span className="font-medium">
                        {formatCurrency(
                          (selected.custo_kit + selected.custo_frete + selected.custo_engenharia + selected.custo_mao_obra) *
                            (selected.comissao_perc / 100)
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base font-bold">
                      <span>Preço Final</span>
                      <span className="text-primary">{formatCurrency(selected.preco_venda_final)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ações */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="outline" className="gap-2 sm:flex-1 h-11" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4" />
                  Baixar Resumo PDF
                </Button>
                {selected.status_contrato === 'rascunho' || selected.status_contrato === 'gerado' ? (
                  <Button
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700 sm:flex-[2] h-11 text-white shadow-lg shadow-emerald-500/20"
                    onClick={() => handleGenerateContract(selected.id)}
                    disabled={sendingContract}
                  >
                    {sendingContract ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {sendingContract ? 'Enviando...' : 'Gerar e Enviar Contrato'}
                  </Button>
                ) : selected.status_contrato === 'enviado_para_assinatura' ? (
                  <Badge className="gap-2 py-2 px-4 bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                    <Clock className="h-4 w-4" />
                    Aguardando Assinatura do Cliente
                  </Badge>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 sm:flex-[2] h-11 border border-emerald-200 dark:border-emerald-500/20">
                    <CheckCircle2 className="h-5 w-5" />
                    Contrato Assinado
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">
                Selecione uma proposta
              </h3>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Clique em uma proposta ao lado para visualizar os detalhes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
