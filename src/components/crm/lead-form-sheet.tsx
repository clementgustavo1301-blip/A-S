'use client';

import { useState, useEffect } from 'react';
import type { Lead } from '@/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Save, Upload } from 'lucide-react';

interface LeadFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  onSave: (data: Partial<Lead>) => void;
}

export function LeadFormSheet({ open, onOpenChange, lead, onSave }: LeadFormSheetProps) {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    cpf_cnpj: '',
    consumo_kwh: 0,
  });

  useEffect(() => {
    if (lead) {
      setForm({
        nome: lead.nome,
        email: lead.email,
        telefone: lead.telefone,
        endereco: lead.endereco,
        cpf_cnpj: lead.cpf_cnpj,
        consumo_kwh: lead.consumo_kwh,
      });
    } else {
      setForm({ nome: '', email: '', telefone: '', endereco: '', cpf_cnpj: '', consumo_kwh: 0 });
    }
  }, [lead, open]);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{lead ? 'Editar Lead' : 'Novo Lead'}</SheetTitle>
          <SheetDescription>
            {lead ? 'Atualize as informações do lead' : 'Preencha os dados do novo lead'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Dados do Cliente
            </h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={form.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  required
                  placeholder="Ex: João da Silva"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="joao@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={form.telefone}
                    onChange={(e) => handleChange('telefone', e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cpf_cnpj">CPF / CNPJ</Label>
                <Input
                  id="cpf_cnpj"
                  value={form.cpf_cnpj}
                  onChange={(e) => handleChange('cpf_cnpj', e.target.value)}
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <Label htmlFor="endereco">Endereço Completo</Label>
                <Textarea
                  id="endereco"
                  value={form.endereco}
                  onChange={(e) => handleChange('endereco', e.target.value)}
                  placeholder="Rua, número, bairro, cidade - UF"
                  rows={2}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Dados Técnicos */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Dados Técnicos
            </h3>
            <div>
              <Label htmlFor="consumo_kwh">Consumo Mensal (kWh) *</Label>
              <Input
                id="consumo_kwh"
                type="number"
                min={0}
                value={form.consumo_kwh}
                onChange={(e) => handleChange('consumo_kwh', parseFloat(e.target.value) || 0)}
                required
                placeholder="450"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Informe a média mensal da conta de luz do cliente
              </p>
            </div>
          </div>

          <Separator />

          {/* Anexos */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Anexos
            </h3>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Arraste arquivos ou clique para enviar
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Conta de luz, fotos do telhado, documentos
              </p>
              <Button type="button" variant="outline" size="sm" className="mt-3">
                <Upload className="h-3 w-3 mr-1" />
                Selecionar Arquivos
              </Button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1 gap-2">
              <Save className="h-4 w-4" />
              {lead ? 'Salvar Alterações' : 'Criar Lead'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
