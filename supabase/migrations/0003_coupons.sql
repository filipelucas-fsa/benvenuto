-- =========================================================
-- Sistema de cupons — módulo 100% aditivo
-- Nenhuma tabela existente é alterada, renomeada ou tem coluna removida.
-- Tudo aqui é NOVO e se relaciona ao restante do banco só por Foreign Key.
-- =========================================================

-- ---------- coupons ----------
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  nome_interno text not null,
  codigo text not null unique,                 -- sempre salvo em maiúsculas (ver trigger abaixo)
  tipo_desconto text not null check (tipo_desconto in ('fixo', 'percentual')),
  valor_desconto numeric(10,2) not null check (valor_desconto >= 0),
  descricao text,
  ativo boolean not null default true,
  data_inicio timestamptz,
  data_fim timestamptz,
  limite_uso int,                               -- null = ilimitado
  valor_minimo numeric(10,2) not null default 0,
  escopo_produtos text not null default 'todos' check (escopo_produtos in ('todos', 'categorias', 'produtos')),
  acumulativo boolean not null default false,    -- por padrão, não acumula com outros cupons
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  deleted_at timestamptz
);
create index if not exists idx_coupons_codigo on public.coupons (codigo) where deleted = false;
create index if not exists idx_coupons_ativo on public.coupons (ativo) where deleted = false;

-- ---------- coupon_categories (cupom válido para categorias específicas) ----------
create table if not exists public.coupon_categories (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  categoria_id uuid not null references public.categorias(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (coupon_id, categoria_id)
);

-- ---------- coupon_products (cupom válido para produtos específicos) ----------
create table if not exists public.coupon_products (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  produto_id uuid not null references public.produtos(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (coupon_id, produto_id)
);

-- ---------- coupon_excluded_products (produtos sempre excluídos do cupom) ----------
create table if not exists public.coupon_excluded_products (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  produto_id uuid not null references public.produtos(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (coupon_id, produto_id)
);

-- ---------- coupon_usage (histórico de uso — preparado pro futuro, mesmo sem pagamento online) ----------
create table if not exists public.coupon_usage (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  pedido_id uuid references public.pedidos(id) on delete set null, -- opcional: nem todo pedido é gravado hoje
  cliente_telefone text,
  valor_desconto_aplicado numeric(10,2) not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_coupon_usage_coupon on public.coupon_usage (coupon_id);

-- =========================================================
-- Trigger: código do cupom sempre em maiúsculas, sem espaços nas pontas
-- =========================================================
create or replace function public.normalizar_codigo_cupom()
returns trigger as $$
begin
  new.codigo = upper(trim(new.codigo));
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_normalizar_codigo_cupom on public.coupons;
create trigger trg_normalizar_codigo_cupom
  before insert or update on public.coupons
  for each row execute function public.normalizar_codigo_cupom();

drop trigger if exists trg_updated_at_coupons on public.coupons;
create trigger trg_updated_at_coupons
  before update on public.coupons
  for each row execute function public.set_updated_at(); -- reaproveita a função já criada na migration 0001

-- =========================================================
-- RLS — segue o mesmo padrão já usado no resto do projeto
-- =========================================================
alter table public.coupons enable row level security;
alter table public.coupon_categories enable row level security;
alter table public.coupon_products enable row level security;
alter table public.coupon_excluded_products enable row level security;
alter table public.coupon_usage enable row level security;

-- Leitura pública: só de cupons ativos e não deletados — necessário pro carrinho
-- validar o código digitado pelo cliente antes de enviar ao WhatsApp.
create policy "cupons ativos leitura publica" on public.coupons
  for select using (deleted = false and ativo = true);

create policy "coupon_categories leitura publica" on public.coupon_categories
  for select using (true);

create policy "coupon_products leitura publica" on public.coupon_products
  for select using (true);

create policy "coupon_excluded_products leitura publica" on public.coupon_excluded_products
  for select using (true);

-- Registro de uso: qualquer visitante pode inserir (mesmo padrão de `pedidos`),
-- mas só admin pode listar/gerenciar o histórico.
create policy "qualquer um registra uso de cupom" on public.coupon_usage
  for insert with check (true);

create policy "admin le uso de cupons" on public.coupon_usage
  for select using (public.is_admin());

-- Escrita (criar/editar/excluir/ativar-desativar): só admin, reaproveitando is_admin()
create policy "admin crud coupons" on public.coupons
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admin crud coupon_categories" on public.coupon_categories
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admin crud coupon_products" on public.coupon_products
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admin crud coupon_excluded_products" on public.coupon_excluded_products
  for all using (public.is_admin()) with check (public.is_admin());
