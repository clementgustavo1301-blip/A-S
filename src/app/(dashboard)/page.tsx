'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  TrendingUp,
  Users,
  BarChart3,
  DollarSign,
  Activity,
  Sun,
} from 'lucide-react';
import { LEAD_STATUS_LABELS, LEAD_STATUS_ORDER } from '@/types';

const mockMetrics = {
  vendasTotais: 487500.0,
  ticketMedio: 32500.0,
  cac: 850.0,
  leadsTotales: 156,
  taxaConversao: 23.5,
  leadsPorStatus: {
    contato: 45,
    visita_tecnica: 32,
    proposta_enviada: 28,
    negociacao: 15,
    aguardando_assinatura: 8,
    assinado: 28,
  },
};

const statusColors: Record<string, string> = {
  contato: 'bg-slate-400',
  visita_tecnica: 'bg-blue-500',
  proposta_enviada: 'bg-amber-500',
  negociacao: 'bg-orange-500',
  aguardando_assinatura: 'bg-sky-500',
  assinado: 'bg-emerald-500',
};

export default function DashboardPage() {
  const kpiCards = [
    {
      title: 'Receita Bruta',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(mockMetrics.vendasTotais),
      icon: DollarSign,
      change: '+12.5%',
      isPositive: true,
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Ticket Médio',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(mockMetrics.ticketMedio),
      icon: Activity,
      change: '+4.2%',
      isPositive: true,
      iconBg: 'bg-blue-50 dark:bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'CAC',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(mockMetrics.cac),
      icon: Users,
      change: '-8.1%',
      isPositive: true,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Taxa de Conversão',
      value: `${mockMetrics.taxaConversao}%`,
      icon: TrendingUp,
      change: '+2.3%',
      isPositive: true,
      iconBg: 'bg-amber-50 dark:bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Sun className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Painel de Resultados
          </h1>
          <p className="text-muted-foreground text-sm">
            Análise de desempenho comercial e eficiência do pipeline.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Card
            key={kpi.title}
            className="rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${kpi.iconBg}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight mt-1 mb-2 text-foreground">
                {kpi.value}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded-md font-medium ${kpi.isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                  {kpi.change}
                </span>
                <span className="text-muted-foreground text-[11px]">vs ciclo anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Distribution */}
      <Card className="rounded-xl border border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/40 py-4">
          <div className="flex items-center gap-2.5">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm font-semibold">Pipeline de Vendas</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-5">
            {LEAD_STATUS_ORDER.map((status) => {
              const count = mockMetrics.leadsPorStatus[status];
              const percentage = (count / mockMetrics.leadsTotales) * 100;
              return (
                <div key={status} className="space-y-2 group">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                      {LEAD_STATUS_LABELS[status]}
                    </span>
                    <span className="text-foreground font-semibold">
                      {count} <span className="text-muted-foreground font-normal text-xs ml-1">{percentage.toFixed(0)}%</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${statusColors[status]} transition-all duration-1000 ease-out rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
