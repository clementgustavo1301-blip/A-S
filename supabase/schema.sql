-- =============================================================
-- ANTIGRAVITY CRM SOLAR - Database Schema (Supabase / PostgreSQL)
-- =============================================================

-- 1. Profiles (extensão do auth.users)
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null default '',
  role text not null default 'sales' check (role in ('admin', 'sales', 'engineer')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Trigger: cria profile automaticamente ao signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Leads (CRM / Kanban)
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  nome text not null,
  email text default '',
  telefone text default '',
  endereco text default '',
  cpf_cnpj text default '',
  status text not null default 'contato' check (
    status in ('contato', 'visita_tecnica', 'proposta_enviada', 'negociacao', 'aguardando_assinatura', 'assinado')
  ),
  consumo_kwh numeric not null default 0,
  anexos jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy "Users can view own leads"
  on public.leads for select using (auth.uid() = user_id);

create policy "Users can insert own leads"
  on public.leads for insert with check (auth.uid() = user_id);

create policy "Users can update own leads"
  on public.leads for update using (auth.uid() = user_id);

create policy "Users can delete own leads"
  on public.leads for delete using (auth.uid() = user_id);

-- 3. Cost Variables (Motor de Precificação Base)
create table public.cost_variables (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  categoria text not null check (
    categoria in ('kit', 'frete', 'engenharia', 'mao_de_obra')
  ),
  valor_base numeric not null default 0,
  ativo boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.cost_variables enable row level security;

create policy "Authenticated users can view cost variables"
  on public.cost_variables for select using (auth.role() = 'authenticated');

create policy "Admins can manage cost variables"
  on public.cost_variables for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 4. Proposals (Propostas / Contratos)
create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  -- Custos congelados
  custo_kit numeric not null default 0,
  custo_frete numeric not null default 0,
  custo_engenharia numeric not null default 0,
  custo_mao_obra numeric not null default 0,
  -- Variáveis de venda
  margem_lucro_perc numeric not null default 0,
  comissao_perc numeric not null default 0,
  preco_venda_final numeric not null default 0,
  -- Métricas para o cliente
  economia_estimada_anual numeric default 0,
  payback_meses numeric default 0,
  potencia_kwp numeric default 0,
  -- Contrato
  status_contrato text not null default 'rascunho' check (
    status_contrato in ('rascunho', 'gerado', 'enviado_para_assinatura', 'assinado')
  ),
  url_pdf_proposta text default '',
  url_pdf_contrato text default '',
  signature_webhook_id text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.proposals enable row level security;

create policy "Users can view own proposals"
  on public.proposals for select using (auth.uid() = user_id);

create policy "Users can insert own proposals"
  on public.proposals for insert with check (auth.uid() = user_id);

create policy "Users can update own proposals"
  on public.proposals for update using (auth.uid() = user_id);

-- =============================================================
-- SEED DATA: Variáveis de custo iniciais
-- =============================================================
insert into public.cost_variables (nome, categoria, valor_base) values
  ('Inversor String 5kW', 'kit', 3500.00),
  ('Inversor String 8kW', 'kit', 5200.00),
  ('Módulo Solar 550W', 'kit', 850.00),
  ('Módulo Solar 450W', 'kit', 650.00),
  ('Estrutura de Fixação (Telhado)', 'kit', 1200.00),
  ('Estrutura de Fixação (Solo)', 'kit', 2800.00),
  ('Cabo Solar 6mm (100m)', 'kit', 450.00),
  ('String Box', 'kit', 380.00),
  ('Frete Regional', 'frete', 800.00),
  ('Frete Interestadual', 'frete', 1500.00),
  ('Projeto Elétrico', 'engenharia', 1200.00),
  ('ART (Anotação de Responsabilidade Técnica)', 'engenharia', 350.00),
  ('Taxa Concessionária', 'engenharia', 200.00),
  ('Mão de Obra Instalação (Equipe)', 'mao_de_obra', 3000.00),
  ('Material Elétrico (Disjuntores, Eletrodutos)', 'mao_de_obra', 800.00),
  ('Adequação Quadro Elétrico', 'mao_de_obra', 600.00);
