'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calculator,
  Package,
  Truck,
  Wrench,
  HardHat,
  Save,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { CostVariable, Lead } from '@/types';

// Mock leads para selecionar
const mockLeads: Pick<Lead, 'id' | 'nome' | 'consumo_kwh'>[] = [
  { id: '1', nome: 'João Silva', consumo_kwh: 450 },
  { id: '2', nome: 'Maria Oliveira', consumo_kwh: 680 },
  { id: '3', nome: 'Carlos Santos', consumo_kwh: 520 },
  { id: '4', nome: 'Ana Costa', consumo_kwh: 380 },
];

// Mock cost variables
const mockCostVariables: CostVariable[] = [
  { id: '1', nome: 'Inversor String 5kW', categoria: 'kit', valor_base: 3500, ativo: true, updated_at: '' },
  { id: '2', nome: 'Inversor String 8kW', categoria: 'kit', valor_base: 5200, ativo: true, updated_at: '' },
  { id: '3', nome: 'Módulo Solar 550W', categoria: 'kit', valor_base: 850, ativo: true, updated_at: '' },
  { id: '4', nome: 'Módulo Solar 450W', categoria: 'kit', valor_base: 650, ativo: true, updated_at: '' },
  { id: '5', nome: 'Estrutura de Fixação (Telhado)', categoria: 'kit', valor_base: 1200, ativo: true, updated_at: '' },
  { id: '6', nome: 'Estrutura de Fixação (Solo)', categoria: 'kit', valor_base: 2800, ativo: true, updated_at: '' },
  { id: '7', nome: 'Cabo Solar 6mm (100m)', categoria: 'kit', valor_base: 450, ativo: true, updated_at: '' },
  { id: '8', nome: 'String Box', categoria: 'kit', valor_base: 380, ativo: true, updated_at: '' },
  { id: '9', nome: 'Frete Regional', categoria: 'frete', valor_base: 800, ativo: true, updated_at: '' },
  { id: '10', nome: 'Frete Interestadual', categoria: 'frete', valor_base: 1500, ativo: true, updated_at: '' },
  { id: '11', nome: 'Projeto Elétrico', categoria: 'engenharia', valor_base: 1200, ativo: true, updated_at: '' },
  { id: '12', nome: 'ART', categoria: 'engenharia', valor_base: 350, ativo: true, updated_at: '' },
  { id: '13', nome: 'Taxa Concessionária', categoria: 'engenharia', valor_base: 200, ativo: true, updated_at: '' },
  { id: '14', nome: 'Mão de Obra Instalação', categoria: 'mao_de_obra', valor_base: 3000, ativo: true, updated_at: '' },
  { id: '15', nome: 'Material Elétrico', categoria: 'mao_de_obra', valor_base: 800, ativo: true, updated_at: '' },
  { id: '16', nome: 'Adequação Quadro Elétrico', categoria: 'mao_de_obra', valor_base: 600, ativo: true, updated_at: '' },
];

interface SelectedItem {
  id: string;
  quantidade: number;
}

export default function PricingPage() {
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [selectedItems, setSelectedItems] = useState<Record<string, SelectedItem>>({});
  const [margemLucro, setMargemLucro] = useState(30);
  const [comissao, setComissao] = useState(5);
  const [saved, setSaved] = useState(false);

  const selectedLead = mockLeads.find((l) => l.id === selectedLeadId);

  const toggleItem = (cv: CostVariable) => {
    setSelectedItems((prev) => {
      const copy = { ...prev };
      if (copy[cv.id]) {
        delete copy[cv.id];
      } else {
        copy[cv.id] = { id: cv.id, quantidade: 1 };
      }
      return copy;
    });
    setSaved(false);
  };

  const updateQuantity = (id: string, qty: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], quantidade: Math.max(1, qty) },
    }));
    setSaved(false);
  };

  const calcByCategory = (cat: string) => {
    return mockCostVariables
      .filter((cv) => cv.categoria === cat && selectedItems[cv.id])
      .reduce((sum, cv) => sum + cv.valor_base * (selectedItems[cv.id]?.quantidade || 1), 0);
  };

  const custoKit = useMemo(() => calcByCategory('kit'), [selectedItems]);
  const custoFrete = useMemo(() => calcByCategory('frete'), [selectedItems]);
  const custoEngenharia = useMemo(() => calcByCategory('engenharia'), [selectedItems]);
  const custoMaoObra = useMemo(() => calcByCategory('mao_de_obra'), [selectedItems]);

  const custoBaseTotal = custoKit + custoFrete + custoEngenharia + custoMaoObra;
  const valorMargem = custoBaseTotal * (margemLucro / 100);
  const valorComissao = custoBaseTotal * (comissao / 100);
  const precoFinalVenda = custoBaseTotal + valorMargem + valorComissao;

  // Estimativas do cliente
  const tarifaMedia = 0.85; // R$/kWh estimativa
  const economiaAnual = selectedLead ? selectedLead.consumo_kwh * tarifaMedia * 12 * 0.9 : 0;
  const paybackMeses = precoFinalVenda > 0 && economiaAnual > 0 ? (precoFinalVenda / economiaAnual) * 12 : 0;

  const handleSave = () => {
    // TODO: Salvar no Supabase (tabela proposals)
    setSaved(true);
  };

  const categoryIcon = {
    kit: Package,
    frete: Truck,
    engenharia: Wrench,
    mao_de_obra: HardHat,
  };

  const categoryLabel: Record<string, string> = {
    kit: 'Kit (Equipamentos)',
    frete: 'Frete / Logística',
    engenharia: 'Engenharia',
    mao_de_obra: 'Mão de Obra e Instalação',
  };

  const categories = ['kit', 'frete', 'engenharia', 'mao_de_obra'];

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          Motor de Precificação
        </h1>
        <p className="text-sm text-muted-foreground">
          Monte o orçamento do sistema fotovoltaico
        </p>
      </div>

      {/* Lead Selector */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Selecionar Lead</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={selectedLeadId} onValueChange={(v) => setSelectedLeadId(v ?? '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um lead..." />
                </SelectTrigger>
                <SelectContent>
                  {mockLeads.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.nome} — {lead.consumo_kwh} kWh/mês
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedLead && (
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  {selectedLead.consumo_kwh} kWh/mês
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Accordion Sections */}
      {selectedLeadId && (
        <Accordion multiple defaultValue={categories} className="space-y-3">
          {categories.map((cat) => {
            const Icon = categoryIcon[cat as keyof typeof categoryIcon];
            const items = mockCostVariables.filter((cv) => cv.categoria === cat);
            const subtotal = calcByCategory(cat);

            return (
              <AccordionItem key={cat} value={cat} className="border border-border/50 rounded-xl px-0 overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{categoryLabel[cat]}</h3>
                      <p className="text-xs text-muted-foreground">
                        Subtotal: {formatCurrency(subtotal)}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {items.map((cv) => {
                      const isSelected = !!selectedItems[cv.id];
                      return (
                        <div
                          key={cv.id}
                          className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-primary/50 bg-primary/5'
                              : 'border-border/30 hover:border-border'
                          }`}
                          onClick={() => toggleItem(cv)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                            }`}>
                              {isSelected && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                            </div>
                            <span className="text-sm font-medium">{cv.nome}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {isSelected && (
                              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <Label className="text-xs text-muted-foreground">Qtd:</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  value={selectedItems[cv.id]?.quantidade || 1}
                                  onChange={(e) => updateQuantity(cv.id, parseInt(e.target.value) || 1)}
                                  className="h-7 w-16 text-center text-xs"
                                />
                              </div>
                            )}
                            <Badge variant="secondary" className="font-mono text-xs">
                              {formatCurrency(cv.valor_base)}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      {/* Bottom Bar - Fixed */}
      {selectedLeadId && (
        <div className="fixed bottom-0 left-64 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
          <div className="p-4">
            <div className="flex items-end gap-6">
              {/* Cost breakdown */}
              <div className="flex-1 grid grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Kit</span>
                  <p className="font-semibold">{formatCurrency(custoKit)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Frete</span>
                  <p className="font-semibold">{formatCurrency(custoFrete)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Engenharia</span>
                  <p className="font-semibold">{formatCurrency(custoEngenharia)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Mão de Obra</span>
                  <p className="font-semibold">{formatCurrency(custoMaoObra)}</p>
                </div>
              </div>

              <Separator orientation="vertical" className="h-12" />

              {/* Margin inputs */}
              <div className="flex items-center gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Margem %</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={margemLucro}
                    onChange={(e) => { setMargemLucro(parseFloat(e.target.value) || 0); setSaved(false); }}
                    className="h-8 w-20 text-center text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Comissão %</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={comissao}
                    onChange={(e) => { setComissao(parseFloat(e.target.value) || 0); setSaved(false); }}
                    className="h-8 w-20 text-center text-xs"
                  />
                </div>
              </div>

              <Separator orientation="vertical" className="h-12" />

              {/* Final price */}
              <div className="text-right">
                <span className="text-xs text-muted-foreground">Preço Final de Venda</span>
                <p className="text-2xl font-bold text-primary">{formatCurrency(precoFinalVenda)}</p>
                {economiaAnual > 0 && (
                  <p className="text-[10px] text-muted-foreground">
                    Payback: ~{paybackMeses.toFixed(0)} meses | Economia: {formatCurrency(economiaAnual)}/ano
                  </p>
                )}
              </div>

              {/* Save Button */}
              <Button onClick={handleSave} className="gap-2 h-10" disabled={custoBaseTotal === 0}>
                {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {saved ? 'Salvo!' : 'Salvar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
