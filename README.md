🧪 Desafio Técnico – Vaga Front-End

Aplicação administrativa construída com Next.js (App Router) implementando autenticação, CRUD de produtos, gráficos de métricas e dark mode. O projeto segue boas práticas de organização, validação com Zod e UI com HeroUI.

---

## 🎯 Objetivo
Desenvolver uma aplicação com:
- Autenticação (login/registro) e proteção de rotas
- CRUD completo de Produtos (criar, listar, editar, excluir)
- Upload de thumbnail (arquivo ou URL), com preview e validações
- Gráficos de métricas com dados mockados (Recharts)
- UI responsiva, dark mode, toasts, ícones

---

## 🧰 Stack
- Next.js 15 (App Router) + React 19
- Zustand (store de auth e produtos, persistência em localStorage)
- Tailwind CSS v4 + HeroUI (componentização)
- Zod + React Hook Form (validações)
- Axios (cliente HTTP com interceptors)
- Recharts (gráficos)
- lucide-react (ícones) e sonner (toasts)

Diferenciais implementados:
- Dark mode com `next-themes`
- Header responsivo com menu mobile (drawer)
- Persistência do token e dados do usuário
- Tooltips contextuais e acessibilidade (aria-labels)

---

## 📦 Funcionalidades

### Autenticação
- Registro e Login consumindo a API (`/users` e `/auth/login`)
- Token Bearer armazenado em `localStorage` (`auth`) com hidratação controlada
- Interceptor do Axios injeta Authorization automaticamente
- Gerenciamento de Hooks para trativa de dados
- Logout com confirmação (modal) e redirecionamento

### Produtos (CRUD)
- Listagem com paginação, busca (server-side) e ordenação client-side
- Criação/edição com validação via Zod
- Thumbnail via upload (multipart/form-data) ou URL (baixada e enviada como File)
- Edição: atualização parcial de thumbnail via `PATCH /products/thumbnail/{id}`
- Exclusão com modal de confirmação
- Gerenciamento de Hooks para trativa de dados
- UX aprimorada: loading, erros, toasts, responsividade, dropzone no upload

### Métricas
- Página de métricas com 3 gráficos (barras, linhas e pizza) usando Recharts e dados mockados

### UI/UX
- HeroUI (Table, Modal, Inputs, Buttons, Tooltip, etc.)
- Dark mode e responsividade
- Header com menu mobile (hambúrguer), ThemeSwitcher e Logout com confirmação

---

## 🗂️ Estrutura de Pastas (alto nível)

```
app/
  (auth)/login | (auth)/register
  products/ (listagem)
  metrics/ (gráficos)
  page.tsx (dashboard)
components/
  Header.tsx | ProductCreateModal.tsx | ProductEditModal.tsx | TruncatedText.tsx | ...
hooks/
  useAuth.ts | useAuthGuard.ts | useProducts.ts | useProductMetrics.ts
lib/
  api.ts | products-api.ts | validations/
stores/
  auth.ts | products.ts
types/
  product.ts
```

---

## 🔐 API (Auth) – referência
Documentação oficial: `https://api-teste-front-production.up.railway.app/docs/`

Endpoints relevantes usados:
- POST `/users` – registro
- POST `/auth/login` – login
- GET/POST/PUT/DELETE `/products` – CRUD
- PATCH `/products/thumbnail/{id}` – atualização de imagem

Autorização: `Authorization: Bearer <TOKEN>`

---

## ⚙️ Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz (não comite):

```
NEXT_PUBLIC_API_BASE_URL=https://api-teste-front-production.up.railway.app
# (opcionais – apenas se quiser sobrescrever)
NEXT_PUBLIC_AUTH_REGISTER_PATH=/users
NEXT_PUBLIC_AUTH_LOGIN_PATH=/auth/login
```

> Observação: nunca comitar `.env.local`. Valores padrão são usados se ausentes.

---

## ▶️ Como rodar localmente

Pré-requisitos:
- Node.js 18.18+ ou 20+
- npm / pnpm / yarn / bun

Instalação:
```bash
npm install
# ou pnpm install / yarn / bun install
```

Rodar em desenvolvimento:
```bash
npm run dev
# http://localhost:3000
```

Build e produção local:
```bash
npm run build
npm start
```

Lint (opcional):
```bash
npm run lint
```

Login/Registro:
1. Acesse `/register` para criar uma conta (token retornado é persistido)
2. Acesse `/login` para autenticar-se
3. Após logado, acesse `/products` e `/metrics`

---

## 🚀 Deploy

Vercel (CD configurado):
1. Repositório vinculado ao projeto na Vercel (CI/CD habilitado)
2. A cada `git push` na branch `main` a Vercel executa `next build` e publica em produção automaticamente

Produção:
- App: [front-challenge-cyan.vercel.app](https://front-challenge-cyan.vercel.app)
- Login direto: [front-challenge-cyan.vercel.app/login](https://front-challenge-cyan.vercel.app/login)

Netlify/Outros: seguir equivalente (build: `next build`, publish: `.next`/Next on Edge)

---

## ✅ Critérios atendidos
- [x] CRUD completo de Produtos
- [x] Validação com Zod em todos os formulários
- [x] Páginas autenticadas (guard, persistência e interceptors)
- [x] UI com HeroUI, responsiva, dark mode e toasts
- [x] Gráficos de métricas (Recharts) com dados mockados

Extras:
- [x] Upload de thumbnail com dropzone e URL (conversão para `File`)
- [x] Tooltip para textos truncados na tabela
- [x] Sidebar/Header responsivo com confirmação de logout

---

## 🧩 Decisões de arquitetura e manutenção
- Estado global com Zustand pela leveza, API simples e persistência nativa
- Hooks especializados (`useAuth`, `useProducts`, `useAuthGuard`, `useProductMetrics`) para encapsular regras
- Camada `lib/api.ts` centraliza Axios + interceptors, evitando repetição
- Validações em `lib/validations` separadas dos componentes
- Componentes desacoplados e reutilizáveis (`TruncatedText`, modais de produto, `ThemeSwitcher`)

---

## 🔭 Próximos passos (sugestões)
- Testes unitários com Vitest/RTL e e2e com Playwright
- Filtros adicionais (status, data) e ordenação server-side
- Upload com barra de progresso e compressão de imagem
- Melhorias de A11y (focus traps avançados, roving tabindex onde aplicável)

---

## 📄 Licença
Uso educacional/demonstrativo.

