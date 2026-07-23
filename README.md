# Benvenuto Restaurante & Pizzaria

Site + cardápio digital + painel administrativo, em Next.js 14 (App Router), TypeScript,
TailwindCSS, Supabase e GSAP.

## 1. Instalar dependências

```bash
npm install
```

## 2. Criar o projeto no Supabase

1. Crie um projeto em https://supabase.com.
2. No SQL Editor, rode o conteúdo de `supabase/migrations/0001_init.sql`
   (cria todas as tabelas, índices, triggers e políticas de RLS de uma vez).
3. Em **Authentication → Users**, crie o usuário administrador (e-mail/senha).
4. Depois, insira esse mesmo `id` na tabela `usuarios`:
   ```sql
   insert into public.usuarios (id, nome, email)
   values ('UUID-DO-USUARIO-CRIADO', 'Seu nome', 'seu@email.com');
   ```
   Sem essa linha, o login funciona mas o RLS bloqueia o acesso ao painel
   (a função `is_admin()` depende dela — por design, evita qualquer usuário
   autenticado ganhar acesso de administrador por engano).
5. Em **Project Settings → API**, copie a **URL** e a **Publishable key**
   (nunca a `service_role`) para o `.env.local`.

## 3. Variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` e
`NEXT_PUBLIC_WHATSAPP_NUMBER` (formato `55DDDNUMERO`, sem espaços ou símbolos).

## 4. Rodar localmente

```bash
npm run dev
```

## 5. Substituir/adicionar imagens

As 3 imagens enviadas estão em `public/images/` (`forno-lenha.jpg`,
`salao-benvenuto.jpg`, `bar-benvenuto.jpg`) e usadas no Hero, na seção Sobre e
na Galeria. Para trocar por fotos reais do restaurante, basta substituir os
arquivos ou, melhor ainda, subir as novas imagens no Supabase Storage e
cadastrar produtos/galeria pelo painel — o carrossel de destaques, o cardápio
e a galeria já leem direto do banco, então nenhuma imagem fica hard-coded no
código depois da carga inicial.

## 6. Deploy na Vercel

```bash
vercel
```

Configure as mesmas variáveis de ambiente do `.env.local` no painel do
projeto na Vercel (Settings → Environment Variables).

## Estrutura

```
app/
  page.tsx              → Home (Hero, Sobre, Especialidades, Destaques, Galeria, Depoimentos, CTA)
  cardapio/              → Cardápio digital com busca e filtro por categoria
  admin/                 → Painel protegido por Supabase Auth + middleware
    login/
    dashboard/
    produtos/            → CRUD de produtos (Server Actions)
    pedidos/              → Lista de pedidos com atualização de status
    configuracoes/       → Dados do restaurante (telefone, WhatsApp, redes)
components/              → Navbar, Hero, Sobre, Especialidades, ProductCard,
                            CartDrawer, Depoimentos, Galeria, Footer, etc.
lib/
  supabase/               → Clientes browser/server (só Publishable Key)
  store/cart.ts            → Carrinho (Zustand)
  whatsapp.ts               → Monta a mensagem e o link wa.me do pedido
supabase/migrations/       → SQL completo: tabelas, índices, RLS, triggers
types/database.ts           → Tipos TypeScript do schema
```

## Fluxo do pedido

1. Cliente adiciona itens no cardápio → carrinho lateral abre.
2. Preenche nome, tipo de entrega (retirada/entrega/mesa) e observações.
3. Ao finalizar, o site monta a mensagem formatada e abre o WhatsApp
   (`wa.me`) já com nome, itens, quantidades, preços e total prontos.
4. (Opcional) Grave o pedido também na tabela `pedidos`/`pedido_itens` via
   uma Server Action antes de redirecionar, para o pedido já aparecer no
   painel — a tabela e as policies de INSERT público já estão prontas para
   isso; a chamada de `insert` só não está automaticamente ligada ao botão
   de WhatsApp para deixar você decidir se quer registrar antes ou depois
   da confirmação do cliente.

## Segurança

- Nenhuma senha é armazenada manualmente — tudo via Supabase Auth.
- O frontend nunca usa a `service_role`, apenas a Publishable Key.
- Toda leitura/escrita passa pelas políticas de RLS definidas na migration.
- `usuarios` funciona como allowlist de administradores: criar um login no
  Supabase Auth não dá acesso ao painel sozinho.

## Antes do deploy final

- [ ] Rodar `npm run type-check` e `npm run lint`
- [ ] Rodar a migration no projeto Supabase de produção
- [ ] Criar o usuário admin e inserir na tabela `usuarios`
- [ ] Preencher `configuracoes` (telefone, WhatsApp, endereço, horários)
- [ ] Cadastrar categorias e produtos reais pelo painel
- [ ] Trocar as imagens placeholder por fotos definitivas do restaurante
- [ ] Testar o fluxo completo do carrinho → WhatsApp em um celular real
