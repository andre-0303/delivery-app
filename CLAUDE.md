# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sistema de delivery de lanchonete. Monorepo gerenciado com **pnpm workspaces** + **Turborepo**.

- `apps/web` — Frontend React 19 + Vite + Tailwind CSS v4
- `apps/api` — Backend Node.js + Express 5 + TypeScript (tsx/nodemon)
- `packages/database` — Shared package: Drizzle ORM + Neon (PostgreSQL serverless)

## Commands

### Root (rodar tudo junto)
```bash
pnpm dev        # inicia web + api em paralelo via Turborepo
pnpm build      # build de todos os apps
```

### Frontend (`apps/web`)
```bash
pnpm --filter web dev       # dev server Vite
pnpm --filter web build     # build produção
pnpm --filter web lint      # ESLint
```

### Backend (`apps/api`)
```bash
pnpm --filter api dev       # nodemon + tsx watch mode
```

### Banco de dados (`packages/database`)
```bash
pnpm --filter @repo/database db:generate   # gera migrations Drizzle
pnpm --filter @repo/database db:push       # aplica schema no Neon
```

## Architecture

### Monorepo
- `pnpm-workspace.yaml` inclui `apps/*` e `packages/*`
- `turbo.json` orquestra pipelines: `dev` (sem cache, persistente), `build` (com cache, outputs em `dist/**`)
- `apps/api` consome `@repo/database` via `workspace:*`

### Database (`packages/database`)
- Schema e cliente Drizzle ficam aqui, exportados para `apps/api`
- Conexão via `@neondatabase/serverless` — requer variável de ambiente `DATABASE_URL` (connection string Neon)
- `drizzle-kit` para geração/push de migrations

### API (`apps/api`)
- Entry: `src/index.ts` (executado com `tsx`)
- Express 5 + cors + dotenv + Zod para validação
- Consome `@repo/database` para acesso ao banco

### Web (`apps/web`)
- Entry: `src/main.tsx`
- Tailwind v4 configurado via plugin Vite (`@tailwindcss/vite`) — sem `tailwind.config.js`
- CSS global em `src/index.css` com `@import "tailwindcss"` no topo
- Variáveis CSS customizadas definidas em `:root` no mesmo arquivo

## Environment Variables

`apps/api` precisa de `.env` com:
```
DATABASE_URL=postgresql://...  # Neon connection string
```
