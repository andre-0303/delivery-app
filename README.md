# 🍔 Delivery App — Lanchonete

Sistema de delivery completo para lanchonete, desenvolvido como monorepo com frontend React, backend Express e banco de dados PostgreSQL serverless.

---

## 📁 Estrutura do Projeto

```
delivery-app/
├── apps/
│   ├── web/          # Frontend React 19 + Vite + Tailwind CSS v4
│   └── api/          # Backend Node.js + Express 5 + TypeScript
├── packages/
│   └── database/     # Drizzle ORM + Neon (PostgreSQL serverless)
├── turbo.json
└── pnpm-workspace.yaml
```

Gerenciado com **pnpm workspaces** + **Turborepo**.

---

## 🚀 Tech Stack

### Frontend (`apps/web`)
| Tecnologia | Uso |
|---|---|
| React 19 | UI |
| Vite | Build / Dev server |
| Tailwind CSS v4 | Estilização (via plugin Vite, sem `tailwind.config.js`) |
| React Router v6 | Roteamento client-side |
| Lucide React | Ícones |
| Nunito + Bebas Neue | Tipografia |

### Backend (`apps/api`)
| Tecnologia | Uso |
|---|---|
| Node.js + Express 5 | Servidor HTTP |
| TypeScript (tsx) | Execução + tipagem |
| Zod | Validação de entradas |
| bcryptjs | Hash de senhas |
| jsonwebtoken | Autenticação JWT |
| dotenv | Variáveis de ambiente |

### Banco de dados (`packages/database`)
| Tecnologia | Uso |
|---|---|
| Drizzle ORM | Schema + queries |
| Neon | PostgreSQL serverless |
| drizzle-kit | Migrations |

---

## ✨ Funcionalidades

- **Autenticação** — cadastro e login com JWT
- **Cardápio** — listagem de produtos com filtro por categoria
- **Carrinho** — adicionar, remover e ajustar quantidades
- **Checkout** — endereço de entrega + forma de pagamento (Pix, crédito, débito, dinheiro)
- **Pedido** — criação de pedido com status em tempo real
- **Confirmação** — tela de acompanhamento pós-pedido

---

## ⚙️ Configuração

### Pré-requisitos

- Node.js 18+
- pnpm 8+

### Instalação

```bash
pnpm install
```

### Variáveis de ambiente

Crie `apps/api/.env`:

```env
DATABASE_URL=postgresql://...   # Connection string do Neon
JWT_SECRET=seu_secret_aqui
PORT=3000
```

### Banco de dados

```bash
# Gera as migrations a partir do schema
pnpm --filter @repo/database db:generate

# Aplica o schema no Neon
pnpm --filter @repo/database db:push
```

---

## 🖥️ Rodando o projeto

### Tudo junto (recomendado)

```bash
pnpm dev
```

Inicia `web` e `api` em paralelo via Turborepo.

### Separado

```bash
# Frontend — http://localhost:5173
pnpm --filter web dev

# Backend — http://localhost:3000
pnpm --filter api dev
```

### Build de produção

```bash
pnpm build
```

---

## 🛣️ Rotas da API

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Cadastro de cliente | — |
| `POST` | `/auth/login` | Login | — |
| `GET` | `/categories` | Lista categorias | — |
| `GET` | `/products` | Lista produtos (query: `?category=slug`) | — |
| `POST` | `/orders` | Cria pedido | ✅ JWT |
| `GET` | `/orders/:id` | Consulta pedido | ✅ JWT |

---

## 🎨 Design System

Interface dark premium com identidade visual coesa:

- **Paleta**: fundo `#0D0A08`, superfícies `#1E1915`, acento vermelho `#E8350A`
- **Tipografia**: Bebas Neue (display) + Nunito (corpo)
- **CSS Custom Properties**: `--dk-bg`, `--dk-card`, `--dk-accent`, `--dk-text`, `--dk-muted`
- **Componentes**: classes utilitárias `.dk-card`, `.content-cta-bar`, `.checkout-section`, `.cat-tab`, etc.

---

## 🔮 Melhorias Futuras

- [ ] **Docker** — containerizar `api` e `web` com `docker-compose` para ambiente de desenvolvimento reproduzível
- [ ] **Testes** — testes unitários (Vitest) no frontend e testes de integração (Jest + Supertest) na API
- [ ] **CI/CD** — pipeline GitHub Actions para lint, testes e deploy automático
- [ ] **WebSocket** — atualizações de status do pedido em tempo real
- [ ] **Painel admin** — CRUD de produtos, categorias e gestão de pedidos
- [ ] **Upload de imagens** — integração com S3 ou Cloudflare R2 para imagens dos produtos
- [ ] **Pagamento real** — integração com Pix via API do banco ou gateway (Stripe, Mercado Pago)
- [ ] **PWA** — service worker para experiência offline e instalação no celular
- [ ] **Rate limiting** — proteção das rotas da API contra abuso
- [ ] **Refresh token** — renovação de sessão sem novo login

---

## 📄 Licença

MIT
