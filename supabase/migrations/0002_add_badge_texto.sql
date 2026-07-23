-- =========================================================
-- Migration aditiva: selo customizado por produto
-- Não altera nem remove nenhuma coluna existente — só adiciona
-- uma coluna opcional (pode ficar null pra sempre sem quebrar nada).
-- =========================================================

alter table public.produtos
  add column if not exists badge_texto text;

comment on column public.produtos.badge_texto is
  'Texto livre do selo mostrado no card (ex: "Tradicional", "Premium", "Novidade"). Null = sem selo customizado.';
