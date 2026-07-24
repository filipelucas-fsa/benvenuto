# Benvenuto Restaurante & Pizzaria — Documentação Completa

Este documento explica **o que o projeto faz, como está organizado e como resolver os bugs
mais comuns**. Foi escrito pra você (ou uma IA de código, tipo Open Code) conseguir se
localizar rápido quando algo quebrar, sem precisar reler o projeto inteiro do zero.

---

## 1. Visão geral

| | |
|---|---|
| **Nome** | Benvenuto Restaurante & Pizzaria |
| **Tipo** | Site institucional + cardápio digital + carrinho com checkout via WhatsApp + painel administrativo |
| **Stack** | Next.js 14 (App Router) + TypeScript + TailwindCSS + Supabase (Postgres + Auth) + GSAP + Zustand |
| **Hospedagem prevista** | Vercel (frontend) + Supabase (banco de dados e autenticação) |

O site é dividido em duas partes:

1. **Site público** (`/`, `/cardapio`) — o cliente navega, monta o carrinho e finaliza o
   pedido, que vira uma mensagem pronta no WhatsApp.
2. **Painel administrativo** (`/admin/*`) — protegido por login, onde o dono do restaurante
   cadastra produtos, categorias, acompanha pedidos e edita as configurações do restaurante.

---

## 2. Estrutura de pastas

```
app/
  layout.tsx                 → layout raiz (fontes, navbar, footer, carrinho, meta tags/SEO)
  page.tsx                   → página inicial (Hero, Sobre, Especialidades, Destaques, Galeria, Depoimentos)
  globals.css                → estilos globais, texturas de fundo

  cardapio/
    page.tsx                 → busca categorias e produtos no Supabase (Server Component)
    CardapioClient.tsx        → busca/filtro por categoria (Client Component)

  admin/
    layout.tsx                → menu lateral do painel + verificação de sessão
    LogoutButton.tsx
    login/page.tsx             → tela de login (Supabase Auth)
    dashboard/page.tsx          → cards com números (pedidos hoje, em aberto, produtos ativos)
    produtos/
      page.tsx                  → lista de produtos (tabela)
      ProdutoForm.tsx             → formulário de criar/editar (Client Component, com feedback)
      ExcluirButton.tsx           → botão de excluir com confirmação
      actions.ts                  → Server Actions: salvarProduto, excluirProduto
    categorias/                  → mesmo padrão de produtos/, mas pra categorias
    pedidos/                     → lista de pedidos + troca de status
    configuracoes/                → formulário com dados do restaurante (telefone, WhatsApp, etc.)

components/
  Navbar.tsx, Hero.tsx, Sobre.tsx, Especialidades.tsx, ProductCard.tsx,
  CartDrawer.tsx, Depoimentos.tsx, Galeria.tsx, Footer.tsx,
  WhatsAppFloatButton.tsx, Reveal.tsx (scroll reveal)

lib/
  supabase/client.ts           → cliente Supabase pro navegador (Client Components)
  supabase/server.ts            → cliente Supabase pro servidor (Server Components/Actions)
  store/cart.ts                  → carrinho de compras (Zustand) — fica só na memória do navegador
  whatsapp.ts                     → monta o texto da mensagem e o link wa.me

supabase/migrations/
  0001_init.sql                 → schema completo: tabelas, índices, triggers, RLS

types/database.ts               → tipos TypeScript equivalentes às tabelas do Postgres

middleware.ts                    → protege as rotas /admin/* exigindo login
```

---

## 3. Funcionalidades

### Site público
- **Hero** com imagem de fundo, overlay, partículas de brasa animadas e parallax leve
- **Cardápio digital** com busca por texto e filtro por categoria
- Cards de produto mostram: preço, preço promocional (riscado), badge "Mais pedido",
  badge de desconto (%), e badge "Esgotado" quando `disponivel = false`
- **Carrinho lateral**: adicionar/remover itens, ajustar quantidade, escolher retirada/entrega/mesa,
  endereço (se entrega), observações — e ao finalizar, monta uma mensagem formatada e abre o
  WhatsApp automaticamente com tudo preenchido
- Galeria de fotos, depoimentos, botão flutuante do WhatsApp

### Painel administrativo (`/admin`)
- Login via Supabase Auth (e-mail/senha)
- **Dashboard**: pedidos de hoje, pedidos em aberto, produtos ativos
- **Produtos**: criar, listar, excluir (soft delete)
- **Categorias**: criar, listar, excluir (soft delete)
- **Pedidos**: listar e trocar status (recebido → em preparo → saiu p/ entrega → finalizado/cancelado)
- **Configurações**: nome do restaurante, telefone, WhatsApp, endereço, redes sociais

### Padrão de formulários (Produtos, Categorias, Configurações)
Todos os formulários de cadastro seguem o mesmo padrão, criado justamente pra evitar bugs
silenciosos:
- Usam `useFormState` (React) pra capturar o retorno da Server Action
- Mostram mensagem verde de sucesso ou vermelha de erro — **nunca falham em silêncio**
- Botão de salvar mostra "Salvando…" e trava contra clique duplo (`useFormStatus`)
- Botões de excluir pedem confirmação (`confirm()`) e mostram "Excluindo…"

---

## 4. Banco de dados (Supabase)

### Tabelas (todas em `supabase/migrations/0001_init.sql`)

| Tabela | Para que serve |
|---|---|
| `usuarios` | Allowlist de administradores — só quem está aqui consegue usar o painel |
| `categorias` | Categorias do cardápio (Pizzas, Bebidas, etc.) |
| `produtos` | Itens do cardápio, com preço, promoção, destaque, disponibilidade |
| `pedidos` | Pedidos feitos pelo site (hoje não é gravado automaticamente — ver seção 6) |
| `pedido_itens` | Itens de cada pedido |
| `configuracoes` | Linha única (id = 1) com os dados do restaurante |
| `galeria` | Fotos da galeria |
| `avaliacoes` | Depoimentos de clientes |

Todas têm `id`, `created_at`, `updated_at`, `deleted`, `deleted_at` — exclusão é sempre
**soft delete** (marca `deleted = true`, não apaga a linha de verdade).

### Segurança (RLS — Row Level Security)

- Leitura pública (produtos, categorias, galeria, avaliações, configurações) é liberada
  pra qualquer visitante do site.
- Escrita (criar/editar/excluir) só é permitida se a função `is_admin()` retornar `true`.
- `is_admin()` verifica se o `auth.uid()` da sessão logada existe na tabela `usuarios`.
- **Isso significa**: criar um login no Supabase Auth **não** dá acesso ao painel sozinho —
  precisa também existir uma linha correspondente em `public.usuarios`. É de propósito,
  pra ninguém conseguir se auto-promover a admin.

---

## 5. Variáveis de ambiente (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-anon-aqui
NEXT_PUBLIC_WHATSAPP_NUMBER=55DDDNUMERO
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- A chave é a **anon/publishable** (segura pra expor no navegador) — **nunca** a `service_role`.
- O Next.js só lê o `.env.local` quando o servidor **inicia**. Depois de editar esse arquivo,
  sempre pare (`Ctrl+C`) e rode `npm run dev` de novo.
- Esse arquivo é ignorado pelo Git (`.gitignore`) e não deve ir dentro de nenhum ZIP do projeto.

---

## 6. Bugs comuns e como resolver

### 🔴 "Salvar produto/categoria" não faz nada / clica e não acontece nada
**Causa mais provável**: a política de RLS bloqueou a escrita porque o usuário logado não
está na tabela `usuarios`, ou o preço foi digitado num formato inválido.
**Como confirmar**: com o padrão de formulário atual, o erro **deveria aparecer na tela**
(caixa vermelha). Se não aparecer nada, o JavaScript do navegador pode ter travado —
abra o **DevTools (F12) → aba Console** e veja se há algum erro em vermelho.
**Solução**:
```sql
-- Verifique se seu usuário está cadastrado como admin:
select * from public.usuarios where email = 'seu@email.com';
-- Se não retornar nada, rode (troque o UUID pelo do seu usuário em Authentication → Users):
insert into public.usuarios (id, nome, email) values ('SEU-UUID', 'Seu Nome', 'seu@email.com');
```

### 🔴 "Permissão negada" / "new row violates row-level security policy"
**Causa**: RLS bloqueando a operação porque `is_admin()` retornou `false`.
**Solução**: mesma da anterior — confirme que o usuário está em `public.usuarios`, e que
você fez login (não está usando o site em aba anônima ou com sessão expirada).

### 🔴 Categoria não aparece na lista do formulário de produto
**Causa**: a tabela `categorias` está vazia, ou todas estão com `ativo = false` /
`deleted = true`.
**Solução**:
```sql
select * from public.categorias where deleted = false;
```
Se vier vazio, cadastre categorias pela tela **Admin → Categorias**, ou rode um `insert`
direto no SQL Editor.

### 🔴 Preço rejeitado / "Preço inválido"
**Causa**: o campo aceita vírgula (`19,90`) e ponto (`19.90`), mas não aceita letras,
símbolos de moeda ("R$ 19,90") ou campo vazio.
**Solução**: digite só números e vírgula/ponto, sem "R$" nem espaços.

### 🔴 Login funciona mas o painel fica bloqueado/branco
**Causa**: usuário existe no **Supabase Auth**, mas não existe em `public.usuarios`
(ver bug 1). O login em si funciona (a senha está certa), mas o RLS trava tudo depois.
**Solução**: rodar o `insert into public.usuarios (...)` com o UUID certo.

### 🔴 Erro "Invalid login credentials" ao entrar no `/admin/login`
**Causas possíveis**:
- Senha ou e-mail digitados errado.
- Usuário criado no Supabase Auth sem marcar **"Auto Confirm User"** — nesse caso o
  Supabase espera confirmação por e-mail antes de liberar o login.
**Solução**: em **Authentication → Users**, clique no usuário e veja se o e-mail está
confirmado. Se não estiver, tem um botão pra confirmar manualmente ali mesmo.

### 🔴 Fica te redirecionando pro `/admin/login` em loop
**Causa**: o `middleware.ts` não está conseguindo ler a sessão — normalmente porque as
variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`/`PUBLISHABLE_KEY`) estão erradas ou
o servidor não foi reiniciado depois de editar o `.env.local`.
**Solução**: confira o `.env.local`, reinicie o `npm run dev`, e limpe os cookies do
navegador pra esse domínio (às vezes fica um cookie de sessão antigo travando).

### 🔴 Erro ao excluir uma categoria que tem produtos
**Causa**: a tabela `produtos` tem uma foreign key (`categoria_id`) apontando pra
`categorias`, com `on delete restrict`. Como a exclusão de categoria é soft delete
(`update ... set deleted = true`), isso **não** deveria travar por causa da FK — mas se
algum dia alguém tentar um **delete de verdade** (`delete from categorias where id = ...`),
vai dar erro de foreign key.
**Solução**: nunca usar `delete` direto nessas tabelas — sempre `update ... set deleted = true`,
que é o que os botões "Excluir" do painel já fazem.

### 🔴 Imagem não aparece / erro "Invalid src prop" no `next/image`
**Causa**: o Next.js só carrega imagens de domínios explicitamente liberados em
`next.config.js`. Hoje só `*.supabase.co` está liberado.
**Solução**: se for hospedar imagens em outro serviço (ex: Cloudinary, S3), adicione o
domínio em `next.config.js → images.remotePatterns`.

### 🔴 Mudei um produto/categoria mas o cardápio público não atualiza
**Causa**: a página `/cardapio` usa `revalidate = 60` (cache de 60 segundos) e as Server
Actions já chamam `revalidatePath("/cardapio")` — então normalmente atualiza na hora.
Se não atualizar: pode ser cache do navegador.
**Solução**: dê um hard refresh (`Ctrl+Shift+R`). Se persistir, confirme que a Server Action
realmente rodou sem erro (deve ter aparecido a mensagem verde de sucesso no admin).

### 🔴 Botão do WhatsApp abre número errado ou não abre
**Causa**: `NEXT_PUBLIC_WHATSAPP_NUMBER` no `.env.local` está no formato errado.
**Solução**: use **só números**, no formato `55` + DDD + número, sem espaços, parênteses,
traços ou o símbolo `+`. Exemplo correto: `5575991234567`.

### 🔴 Pedido finalizado no WhatsApp não aparece na aba "Pedidos" do admin
**Isso é esperado, não é bug.** Hoje o fluxo do carrinho monta a mensagem e abre o
WhatsApp diretamente — ele **não grava automaticamente** uma linha na tabela `pedidos`.
A tabela e as políticas de RLS já estão prontas para isso (qualquer visitante pode fazer
`insert` em `pedidos`/`pedido_itens`); só falta ligar essa gravação no botão "Finalizar
no WhatsApp" (em `components/CartDrawer.tsx`, função `finalizarPedido`), inserindo o
pedido antes de abrir o link do WhatsApp.

### 🔴 Erro de tipo do TypeScript ao rodar `npm run build`
**Causa comum**: algum componente novo não tem `"use client"` no topo do arquivo mas usa
hooks (`useState`, `useEffect`, `onClick`, etc.) — Server Components não podem ter
interatividade.
**Solução**: adicione `"use client";` como primeira linha do arquivo.

### 🔴 Build funciona local mas falha na Vercel
**Causas mais comuns**:
- Esqueceu de configurar as variáveis de ambiente no painel da Vercel (Settings →
  Environment Variables) — elas não vêm do `.env.local` automaticamente, precisam ser
  cadastradas lá também.
- Alguma dependência foi instalada só localmente e não está no `package.json`.
**Solução**: confira as env vars na Vercel e rode `npm install` limpo localmente
(apague `node_modules` e `package-lock.json`, rode `npm install` de novo) pra garantir
que o `package-lock.json` está consistente antes de subir.

### 🔴 "Erro: Falha ao executar consulta sql: ERRO: 42710: já existe política..."
**Causa**: você rodou a migration inteira duas vezes — as políticas de RLS já existem.
**Solução**: normalmente pode ignorar (significa que já rodou certo antes). Se precisar
rodar de novo do zero, apague as políticas primeiro:
```sql
do $$
declare pol record;
begin
  for pol in select policyname, tablename from pg_policies where schemaname = 'public'
  loop
    execute format('drop policy if exists %I on public.%I;', pol.policyname, pol.tablename);
  end loop;
end $$;
```

---

## 7. Como investigar um bug novo (checklist rápido)

1. **Abra o DevTools do navegador (F12) → Console.** A maioria dos erros de frontend
   aparece ali em vermelho.
2. **Aba Network** → veja se a requisição pro Supabase retornou erro (status 400/401/403).
   401/403 quase sempre é RLS ou sessão expirada.
3. **No terminal do VS Code**, olhe o output do `npm run dev` — erros de Server Actions
   e Server Components aparecem ali, não no navegador.
4. **No Supabase**, aba **Logs** → **API Logs**/**Postgres Logs** — mostra exatamente qual
   query falhou e por quê.
5. Se o erro for de política de segurança, teste a query direto no **SQL Editor**
   logado como o mesmo usuário (ou use `select public.is_admin()` pra conferir se seu
   usuário está sendo reconhecido como admin).

---

## 8. O que ainda não foi implementado (próximos passos sugeridos)

- Gravar o pedido nas tabelas `pedidos`/`pedido_itens` antes de abrir o WhatsApp (hoje só
  monta a mensagem — ver bug correspondente na seção 6)
- Gráficos de vendas no Dashboard (hoje só mostra contadores simples)
- Upload de imagem direto pro Supabase Storage (hoje o campo "imagem_url" espera um link já pronto)
- Integração real com Google Reviews na seção de Avaliações
- Paginação no cardápio/admin caso o catálogo cresça muito (hoje carrega tudo de uma vez)

---

## 9. Sistema de cupons (módulo aditivo)

Implementado em camadas (Repository → Service → Server Action/Controller → Componentes),
sem alterar nenhuma tabela, coluna, rota ou lógica já existente — tudo novo se conecta
ao restante do banco só por Foreign Key.

### Estrutura de arquivos
```
supabase/migrations/0003_coupons.sql   → tabelas novas: coupons, coupon_categories,
                                          coupon_products, coupon_excluded_products, coupon_usage
lib/coupons/
  types.ts        → Model (tipos)
  repository.ts    → Repository (única camada que faz query no Supabase)
  service.ts        → Service (toda a regra de validação/cálculo de desconto)
  actions.ts          → Controller público (usado pelo carrinho)
app/admin/cupons/
  actions.ts            → Controller administrativo (CRUD)
  CupomModal.tsx           → Modal de criar/editar
  CupomList.tsx              → Busca, filtro, tabela, ativar/desativar, excluir
  page.tsx                     → Busca os dados e monta a tela
```

### Como funciona a validação (resumo do que está em `service.ts`)
1. Cupom existe e não foi excluído?
2. Está `ativo`?
3. Dentro do período (`data_inicio`/`data_fim`)?
4. Ainda não bateu o `limite_uso`? (conta a partir de `coupon_usage`, não de um contador solto —
   evita duplicar informação)
5. Subtotal do carrinho ≥ `valor_minimo`?
6. Pelo menos um item do carrinho é elegível, considerando `escopo_produtos`
   (todos / categorias específicas / produtos específicos) e excluindo o que estiver
   em `coupon_excluded_products`?
7. Calcula o desconto (fixo ou percentual, nunca passando do valor elegível) e retorna.

### Onde isso aparece pro cliente
- Carrinho (`components/CartDrawer.tsx`): campo de código + botão "Aplicar", mostra
  desconto e novo total, permite remover o cupom.
- Mensagem do WhatsApp (`lib/whatsapp.ts`): se houver cupom aplicado, a mensagem já sai
  com Subtotal / Cupom / Desconto / Total.

### Onde o admin gerencia
`/admin/cupons` — busca, filtro por status, criar/editar em modal, ativar/desativar com
um clique, excluir (soft delete).

### Bugs comuns do módulo de cupons

**"Cupom não encontrado" mesmo já tendo cadastrado**
- Confira se o código foi digitado exatamente igual (o sistema já converte pra
  maiúsculas sozinho, então isso não deveria ser problema, mas o espaço em branco às
  vezes cola do celular).
- Confira se o cupom está com `ativo = true` e `deleted = false`:
  ```sql
  select codigo, ativo, deleted from public.coupons where codigo = 'PIZZA10';
  ```

**Cupom existe mas dá "não se aplica aos itens do seu carrinho"**
- Cheque o `escopo_produtos` do cupom. Se for `categorias`, confirme que a categoria do
  produto no carrinho está mesmo na lista `coupon_categories` daquele cupom.
- Lembre que exclusão (`coupon_excluded_products`) sempre vence — mesmo um produto que
  esteja dentro do escopo permitido é barrado se estiver na lista de exclusão.

**Desconto não bate com o esperado**
- Desconto percentual é calculado só em cima do valor dos itens **elegíveis**, não do
  carrinho inteiro — se o cupom vale só pra "Bebidas" e o carrinho tem pizza + bebida,
  o desconto incide só na parte da bebida.
- O desconto nunca ultrapassa o valor elegível (não fica negativo).

**Erro de permissão ao criar/editar cupom no admin**
- Mesmo motivo dos outros formulários do painel: confirme que seu usuário está na
  tabela `usuarios` (ver seção 6, primeiro bug do documento).

**Cupom aplicado no carrinho, mas o `limite_uso` nunca conta**
- A contagem só incrementa quando o pedido é finalizado (clique em "Finalizar no
  WhatsApp"), que é quando `registrarUsoCupomAction` roda. Se o cliente aplicar o
  cupom mas fechar o carrinho sem finalizar, isso não conta como uso — comportamento
  esperado, já que não há pagamento real acontecendo no site.

### O que ainda não foi feito (próxima etapa natural)
- Nenhuma tela de relatório de uso de cupons (a tabela `coupon_usage` já guarda os
  dados; falta só uma tela pra exibir)
- A "Faturamento hoje" do Dashboard soma a coluna `total` da tabela `pedidos` — como
  essa tabela ainda não é preenchida automaticamente pelo checkout do WhatsApp (ver
  seção 8), esse card vai mostrar R$ 0,00 até que essa gravação seja implementada
