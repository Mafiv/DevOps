# DevOps Monorepo

> A production-quality **Turborepo** monorepo demonstrating modern CI/CD, a shared component library, Prisma database layer, and a typed REST API — all in a single, well-structured repository.

## Architecture

```
DevOps/
├── apps/
│   └── web/              # Next.js 15 App Router dashboard
└── packages/
    ├── api/              # Hono REST API (projects · pipelines · deployments)
    ├── db/               # Prisma schema + client + seed (SQLite)
    ├── ui/               # Shared React component library
    └── config/           # Shared ESLint · TypeScript · Prettier configs
```

## Tech Stack

| Layer    | Technology                                                         |
| -------- | ------------------------------------------------------------------ |
| Monorepo | [Turborepo](https://turbo.build) + pnpm workspaces                 |
| Frontend | [Next.js 15](https://nextjs.org) (App Router)                      |
| Backend  | [Hono](https://hono.dev) on Node.js                                |
| Database | [Prisma](https://www.prisma.io) + SQLite (swap-ready for Postgres) |
| UI       | Custom React component library (`@repo/ui`)                        |
| CI/CD    | GitHub Actions + Vercel                                            |
| Language | TypeScript throughout                                              |

## Getting Started

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9 (`npm i -g pnpm`)

### Setup

```bash
# 1. Install all workspace dependencies
pnpm install

# 2. Initialise the database
cd packages/db
pnpm db:generate   # generates Prisma client
pnpm db:push       # pushes schema to SQLite
pnpm db:seed       # seeds demo data
cd ../..

# 3. Start all apps in dev mode
pnpm dev
```

- **Web** → http://localhost:3000
- **API** → http://localhost:3001

## Turborepo Pipelines

```bash
pnpm build        # builds all packages in dependency order
pnpm lint         # lints all packages
pnpm typecheck    # type-checks all packages
pnpm test         # runs all test suites
```

Turborepo caches every task output — subsequent runs are near-instant for unchanged packages.

## API Routes

| Method      | Route                         | Description               |
| ----------- | ----------------------------- | ------------------------- |
| `GET`       | `/health`                     | Health check              |
| `GET/POST`  | `/api/projects`               | List / create projects    |
| `GET/PATCH` | `/api/projects/:id`           | Get / update project      |
| `GET/POST`  | `/api/pipelines`              | List / create pipelines   |
| `PATCH`     | `/api/pipelines/:id/status`   | Update pipeline status    |
| `GET/POST`  | `/api/deployments`            | List / create deployments |
| `PATCH`     | `/api/deployments/:id/status` | Update deployment status  |

## Shared Packages

### `@repo/ui`

React components: `Button`, `Card`, `Badge`, `Avatar`, `StatusBadge`, `Spinner`.  
Consumed by `apps/web` — just `import { Button } from "@repo/ui"`.

### `@repo/db`

Prisma schema with `User · Project · Pipeline · Deployment · AuditLog` models.  
Exports a singleton Prisma client via `import prisma from "@repo/db"`.

### `@repo/config`

Shared ESLint flat config, TypeScript base/nextjs/react-library presets, and Prettier config.

## CI/CD

Every push and PR triggers:

```
Checkout → Install (pnpm) → Lint → Typecheck → Test → Build → Deploy (Vercel)
```

Turborepo remote cache is enabled via `TURBO_TOKEN` + `TURBO_TEAM` secrets.

## License

MIT
