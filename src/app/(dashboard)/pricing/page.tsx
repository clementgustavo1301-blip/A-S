'use client';

import { useState, useMemo } from 'react';
import { useSidebar } from '@/components/layout/sidebar-context';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Plus,
  Trash2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Lead } from '@/types';

const mockLeads: Pick<Lead, 'id' | 'nome' | 'consumo_kwh'>[] = [
  { id: '1', nome: 'João Silva', consumo_kwh: 450 },
  { id: '2', nome: 'Maria Oliveira', consumo_kwh: 680 },
  { id: '3', nome: 'Carlos Santos', consumo_kwh: 520 },
  { id: '4', nome: 'Ana Costa', consumo_kwh: 380 },
];

type Categoria = 'kit' | 'frete' | 'engenharia' | 'mao_de_obra';

interface ItemCusto {
  id: string;
  nome: string;
  categoria: Categoria;
  valor: number;
  quantidade: number;
}

const categoryConfig: Record<Categoria, { label: string; icon: typeof Package; description: string }> = {
  kit: { label: 'Kit (Equipamentos)', icon: Package, description: 'Inversores, módulos, estruturas, cabos' },
  frete: { label: 'Frete / Logística', icon: Truck, description: 'Custos de transporte e entrega' },
  engenharia: { label: 'Engenharia', icon: Wrench, description: 'Projeto elétrico, ART, taxas' },
  mao_de_obra: { label: 'Mão de Obra', icon: HardHat, description: 'Instalação e materiais elétricos' },
};

const categorias: Categoria[] = ['kit', 'frete', 'engenharia', 'mao_de_obra'];

export default function PricingPage() {
  const { isExpanded } = useSidebar();
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria>('kit');
  const [itens, setItens] = useState<ItemCusto[]>([]);
  const [margemLucro, setMargemLucro] = useState(30);
  const [comissao, setComissao] = useState(5);
  const [saved, setSaved] = useState(false);

  const selectedLead = mockLeads.find((l) => l.id === selectedLeadId);

  const addItem = () => {
    setItens((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        nome: '',
        categoria: categoriaAtiva,
        valor: 0,
        quantidade: 1,
      },
    ]);
    setSaved(false);
  };

  const updateItem = (id: string, field: keyof ItemCusto, value: string | number) => {
    setItens((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
    setSaved(false);
  };

  const removeItem = (id: string) => {
    setItens((prev) => prev.filter((item) => item.id !== id));
    setSaved(false);
  };

  const itensDaCategoria = itens.filter((i) => i.categoria === categoriaAtiva);

  const custoByCategoria = (cat: Categoria) =>
    itens.filter((i) => i.categoria === cat).reduce((sum, i) => sum + i.valor * i.quantidade, 0);

  const custoKit = useMemo(() => custoByCategoria('kit'), [itens]);
  const custoFrete = useMemo(() => custoByCategoria('frete'), [itens]);
  const custoEngenharia = useMemo(() => custoByCategoria('engenharia'), [itens]);
  const custoMaoObra = useMemo(() => custoByCategoria('mao_de_obra'), [itens]);

  const custoBaseTotal = custoKit + custoFrete + custoEngenharia + custoMaoObra;
  const valorMargem = custoBaseTotal * (margemLucro / 100);
  const valorComissao = custoBaseTotal * (comissao / 100);
  const precoFinalVenda = custoBaseTotal + valorMargem + valorComissao;

  const tarifaMedia = 0.85;
  const economiaAnual = selectedLead ? selectedLead.consumo_kwh * tarifaMedia * 12 * 0.9 : 0;
  const paybackMeses = precoFinalVenda > 0 && economiaAnual > 0 ? (precoFinalVenda / economiaAnual) * 12 : 0;

  const handleSave = () => {
    setSaved(true);
  };

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

      {/* Category Selector + Items */}
      {selectedLeadId && (
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Category Tabs */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Categorias</CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              {categorias.map((cat) => {
                const config = categoryConfig[cat];
                const Icon = config.icon;
                const subtotal = custoByCategoria(cat);
                const count = itens.filter((i) => i.categoria === cat).length;
                const isActive = categoriaAtiva === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setCategoriaAtiva(cat)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-primary/10 border border-primary/30'
                        : 'hover:bg-secondary border border-transparent'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/20' : 'bg-muted'}`}>
                      <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {config.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {count > 0 ? `${count} ${count === 1 ? 'item' : 'itens'} · ${formatCurrency(subtotal)}` : 'Nenhum item'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Items for Selected Category */}
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {(() => {
                    const Icon = categoryConfig[categoriaAtiva].icon;
                    return <Icon className="h-5 w-5 text-primary" />;
                  })()}
                  {categoryConfig[categoriaAtiva].label}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {categoryConfig[categoriaAtiva].description}
                </p>
              </div>
              <Button onClick={addItem} size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Adicionar Item
              </Button>
            </CardHeader>
            <CardContent>
              {itensDaCategoria.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-3 rounded-xl bg-muted mb-3">
                    {(() => {
                      const Icon = categoryConfig[categoriaAtiva].icon;
                      return <Icon className="h-6 w-6 text-muted-foreground" />;
                    })()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Nenhum item adicionado nesta categoria
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Clique em &quot;Adicionar Item&quot; para começar
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Column Headers */}
                  <div className="grid grid-cols-[1fr_140px_80px_40px] gap-3 px-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    <span>Descrição</span>
                    <span>Valor (R$)</span>
                    <span>Qtd</span>
                    <span></span>
                  </div>

                  {itensDaCategoria.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[1fr_140px_80px_40px] gap-3 items-center p-3 rounded-lg border border-border/50 bg-secondary/30 hover:border-border transition-colors"
                    >
                      <Input
                        placeholder="Ex: Inversor 5kW, Módulo 550W..."
                        value={item.nome}
                        onChange={(e) => updateItem(item.id, 'nome', e.target.value)}
                        className="h-9 text-sm"
                      />
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="0,00"
                        value={item.valor || ''}
                        onChange={(e) => updateItem(item.id, 'valor', parseFloat(e.target.value) || 0)}
                        className="h-9 text-sm"
                      />
                      <Input
                        type="number"
                        min={1}
                        value={item.quantidade}
                        onChange={(e) => updateItem(item.id, 'quantidade', parseInt(e.target.value) || 1)}
                        className="h-9 text-sm text-center"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {/* Subtotal */}
                  <div className="flex justify-end pt-2 border-t border-border/30">
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">Subtotal: </span>
                      <span className="text-sm font-bold text-foreground">{formatCurrency(custoByCategoria(categoriaAtiva))}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Bar - Fixed */}
      {selectedLeadId && (
        <div className="fixed bottom-0 right-0 z-50 border-t border-border bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.06)] transition-all duration-300" style={{ left: isExpanded ? 256 : 96 }}>
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
