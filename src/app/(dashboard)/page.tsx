'use client';

import { useState } from 'react';
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
  Activity
} from 'lucide-react';
import { LEAD_STATUS_LABELS, LEAD_STATUS_ORDER } from '@/types';

// Mock data (unchanged for logic)
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
  contato: 'bg-muted-foreground',
  visita_tecnica: 'bg-blue-500',
  proposta_enviada: 'bg-amber-500',
  negociacao: 'bg-orange-500',
  aguardando_assinatura: 'bg-violet-500',
  assinado: 'bg-emerald-500',
};

export default function DashboardPage() {
  const kpiCards = [
    {
      title: 'Gross Revenue',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(mockMetrics.vendasTotais),
      icon: DollarSign,
      change: '+12.5%',
      isPositive: true,
      glow: 'shadow-[0_0_15px_rgba(46,139,87,0.15)]'
    },
    {
      title: 'Avg Ticket',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(mockMetrics.ticketMedio),
      icon: Activity,
      change: '+4.2%',
      isPositive: true,
      glow: 'shadow-[0_0_15px_rgba(135,206,235,0.15)]'
    },
    {
      title: 'CAC',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(mockMetrics.cac),
      icon: Users,
      change: '-8.1%',
      isPositive: true, // Drop in CAC is good
      glow: 'shadow-[0_0_15px_rgba(255,215,0,0.15)]'
    },
    {
      title: 'Conv. Rate',
      value: `${mockMetrics.taxaConversao}%`,
      icon: TrendingUp,
      change: '+2.3%',
      isPositive: true,
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold font-mono tracking-tight text-foreground flex items-center gap-3">
          <TerminalIcon /> Metrics Terminal
        </h1>
        <p className="text-muted-foreground font-mono text-sm max-w-xl">
          Real-time analysis of commercial performance and pipeline efficiency.
        </p>
      </div>

      {/* KPI Cards in Data-Heavy style */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Card
            key={kpi.title}
            className={`oled-card rounded-lg overflow-hidden border-border/30 hover:border-border/80 interactive ${kpi.glow}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">
                [{kpi.title}]
              </CardTitle>
              <div className="p-2 rounded-md bg-muted/20 border border-border/30 text-muted-foreground">
                <kpi.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono tracking-tighter glow-primary mt-1 mb-3 text-foreground">{kpi.value}</div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className={`px-1.5 py-0.5 rounded-sm ${kpi.isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                  {kpi.change}
                </span>
                <span className="text-muted-foreground/60 uppercase text-[10px] tracking-wider">vs last cycle</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Funnel Distribution - Technical Panel */}
      <Card className="oled-card rounded-lg border-border/30 overflow-hidden">
        <CardHeader className="border-b border-border/20 py-5 bg-muted/10">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm font-mono font-bold tracking-tight uppercase">Pipeline Topology</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {LEAD_STATUS_ORDER.map((status) => {
              const count = mockMetrics.leadsPorStatus[status];
              const percentage = (count / mockMetrics.leadsTotales) * 100;
              return (
                <div key={status} className="space-y-2 group">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-semibold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                      {LEAD_STATUS_LABELS[status]}
                    </span>
                    <span className="text-foreground">
                      {count} <span className="text-muted-foreground/40 ml-1">[{percentage.toFixed(0)}%]</span>
                    </span>
                  </div>
                  {/* Progress bar container */}
                  <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${statusColors[status]} transition-all duration-1000 ease-out shadow-[0_0_8px_currentColor]`}
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

function TerminalIcon() {
  return (
    <div className="p-1.5 bg-primary/10 rounded-md border border-primary/30">
      <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_rgba(46,139,87,1)]" />
    </div>
  );
}
