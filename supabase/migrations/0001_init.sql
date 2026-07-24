-- =========================================================
-- Benvenuto Restaurante & Pizzaria — schema inicial
-- =========================================================
create extension if not exists "pgcrypto";

-- ---------- usuarios (perfis administrativos) ----------
create table if not exists public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  email text not null unique,
  role text not null default 'admin' check (role in ('admin', 'gerente')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  deleted_at timestamptz
);

-- ---------- categorias ----------
create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  icone text,
  ordem int not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  deleted_at timestamptz
);
create index if not exists idx_categorias_slug on public.categorias (slug) where deleted = false;

-- ---------- produtos ----------
create table if not exists public.produtos (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references public.categorias(id) on delete restrict,
  nome text not null,
  descricao text,
  preco numeric(10,2) not null check (preco >= 0),
  preco_promocional numeric(10,2) check (preco_promocional >= 0),
  imagem_url text,
  disponivel boolean not null default true,
  destaque boolean not null default false,
  ordem int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  deleted_at timestamptz
);
create index if not exists idx_produtos_categoria on public.produtos (categoria_id) where deleted = false;
create index if not exists idx_produtos_destaque on public.produtos (destaque) where deleted = false and disponivel = true;

-- ---------- pedidos ----------
create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique default to_char(now(), 'YYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 6),
  cliente_nome text not null,
  cliente_telefone text not null,
  tipo_entrega text not null default 'retirada' check (tipo_entrega in ('retirada', 'entrega', 'mesa')),
  endereco_entrega text,
  status text not null default 'recebido' check (status in ('recebido', 'em_preparo', 'saiu_entrega', 'finalizado', 'cancelado')),
  observacoes text,
  subtotal numeric(10,2) not null default 0,
  taxa_entrega numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  deleted_at timestamptz
);
create index if not exists idx_pedidos_status on public.pedidos (status) where deleted = false;
create index if not exists idx_pedidos_created on public.pedidos (created_at desc);

-- ---------- pedido_itens ----------
create table if not exists public.pedido_itens (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos(id) on delete cascade,
  produto_id uuid not null references public.produtos(id) on delete restrict,
  quantidade int not null check (quantidade > 0),
  preco_unitario numeric(10,2) not null,
  observacao text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  deleted_at timestamptz
);
create index if not exists idx_pedido_itens_pedido on public.pedido_itens (pedido_id);

-- ---------- configuracoes (linha única) ----------
create table if not exists public.configuracoes (
  id int primary key default 1 check (id = 1),
  nome_restaurante text not null default 'Benvenuto Restaurante & Pizzaria',
  telefone text,
  whatsapp text,
  endereco text,
  horarios jsonb not null default '{}'::jsonb,
  instagram text,
  facebook text,
  logo_url text,
  hero_imagem_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  deleted_at timestamptz
);
insert into public.configuracoes (id, nome_restaurante)
values (1, 'Benvenuto Restaurante & Pizzaria')
on conflict (id) do nothing;

-- ---------- galeria ----------
create table if not exists public.galeria (
  id uuid primary key default gen_random_uuid(),
  imagem_url text not null,
  legenda text,
  ordem int not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  deleted_at timestamptz
);

-- ---------- avaliacoes ----------
create table if not exists public.avaliacoes (
  id uuid primary key default gen_random_uuid(),
  autor_nome text not null,
  nota int not null check (nota between 1 and 5),
  comentario text,
  fonte text not null default 'manual' check (fonte in ('manual', 'google')),
  aprovado boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  deleted_at timestamptz
);

-- =========================================================
-- Trigger genérica para updated_at
-- =========================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare t text;
begin
  foreach t in array array['usuarios','categorias','produtos','pedidos','pedido_itens','configuracoes','galeria','avaliacoes']
  loop
    execute format('drop trigger if exists trg_updated_at on public.%I;', t);
    execute format('create trigger trg_updated_at before update on public.%I for each row execute function public.set_updated_at();', t);
  end loop;
end $$;

-- =========================================================
-- Row Level Security
-- =========================================================
alter table public.usuarios enable row level security;
alter table public.categorias enable row level security;
alter table public.produtos enable row level security;
alter table public.pedidos enable row level security;
alter table public.pedido_itens enable row level security;
alter table public.configuracoes enable row level security;
alter table public.galeria enable row level security;
alter table public.avaliacoes enable row level security;

-- Helper: verifica se o usuário autenticado é um admin válido
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.usuarios u
    where u.id = auth.uid() and u.deleted = false
  );
$$ language sql stable security definer;

-- ---- Leitura pública (site) ----
create policy "categorias publicas leitura" on public.categorias
  for select using (deleted = false and ativo = true);

create policy "produtos publicos leitura" on public.produtos
  for select using (deleted = false and disponivel = true);

create policy "galeria publica leitura" on public.galeria
  for select using (deleted = false and ativo = true);

create policy "avaliacoes publicas leitura" on public.avaliacoes
  for select using (deleted = false and aprovado = true);

create policy "configuracoes publicas leitura" on public.configuracoes
  for select using (deleted = false);

-- ---- Pedidos: qualquer visitante pode criar (checkout), só admin lê/atualiza ----
create policy "qualquer um cria pedido" on public.pedidos
  for insert with check (true);

create policy "qualquer um cria itens de pedido" on public.pedido_itens
  for insert with check (true);

create policy "admin le pedidos" on public.pedidos
  for select using (public.is_admin());

create policy "admin atualiza pedidos" on public.pedidos
  for update using (public.is_admin());

create policy "admin le itens" on public.pedido_itens
  for select using (public.is_admin());

-- ---- Administração: CRUD completo apenas para admins autenticados ----
create policy "admin crud categorias" on public.categorias
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admin crud produtos" on public.produtos
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admin crud galeria" on public.galeria
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admin crud avaliacoes" on public.avaliacoes
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admin crud configuracoes" on public.configuracoes
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admin le proprio perfil" on public.usuarios
  for select using (auth.uid() = id or public.is_admin());

create policy "admin atualiza proprio perfil" on public.usuarios
  for update using (auth.uid() = id);
