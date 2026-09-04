# lukaszmical.pl

Personal website and portfolio built with [Next.js](https://nextjs.org/) (App Router).
It hosts a public site (about / contact / projects), an admin panel, and a set of
interactive "projects" — including image-based puzzle solvers (Monogram / Nonogram
and Number Sums).

## Tech stack

- **Next.js** (RC) with the App Router and React Server Components
- **TypeScript** (strict) with the `@/*` path alias mapped to `src/*`
- **Tailwind CSS** (+ forms & typography plugins)
- **next-intl** for i18n (`en`, `pl`) — routes live under `src/app/[locale]`
- **Postgres** + **Drizzle ORM** — Vercel Postgres (Neon) in prod, Docker Postgres in dev
- **Auth** — single admin user, `argon2` + `jose` session cookie (no external service)
- **Cloudflare R2** (via `@aws-sdk/client-s3`) for asset storage
- **Socket.IO** — a small standalone realtime server in `server/`
- **Tesseract.js** — OCR used by the monogram resolver
- **Vitest** — unit tests (`*.spec.ts`)

## Getting started

Install dependencies (the repo uses **pnpm**):

```bash
pnpm install
```

Run the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

Copy `.env.local.example` to `.env.local` and fill it in (do **not** commit secrets):

- `DATABASE_URL` — Postgres connection string (local Docker in dev, pooled Vercel Postgres in prod)
- `AUTH_SECRET` — random string for signing the admin session (`openssl rand -base64 32`)
- `ADMIN_PASSWORD_HASH` — argon2 hash of the admin password (`pnpm auth:hash '<password>'`)
- `R2_BUCKET_PUBLIC_URL`, `R2_BUCKET_NAME`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` — Cloudflare R2

For production, set the same variables in the Vercel project settings. Schema changes are
pushed with `pnpm db:push:prod` (uses `.env.prod`, which holds the **direct/unpooled** URL).

## Scripts

```bash
pnpm dev      # start Next.js dev server
pnpm build    # production build
pnpm start    # run the production build
pnpm lint     # eslint (next lint)
npx vitest    # run unit tests (no dedicated npm script)
```

## Project structure

```
src/
  app/            # Next.js App Router
    [locale]/     # public site (about, contact, projects)
    admin/        # admin panel (auth + logged-in area)
    api/          # route handlers (projects, assets, hangman, songs, ...)
  admin/          # admin UI (pages, components, layouts, hooks)
  services/
    projects/     # project logic
      monogram-resolver/    # nonogram/monogram solver (detector, resolver, helpers)
      number-sums-resolver/
    drizzle/      # Drizzle client, schema, project data access
    r2/           # Cloudflare R2 helpers
    animation/
  ui/             # shared UI (components + page-level compositions)
  types/          # TypeScript types
  utils/          # helpers (incl. auth/ — argon2 + jose session)
server/           # standalone Socket.IO server (realtime cursors demo)
scripts/          # build/util scripts (e.g. minify.projects.mjs)
messages/         # next-intl translation files (en, pl)
public/           # static assets
```

## Database

```bash
pnpm db:up          # start local Docker Postgres
pnpm db:generate    # generate a migration from the Drizzle schema
pnpm db:push        # push the schema to the local database
pnpm db:push:prod   # push to production (uses .env.prod, direct/unpooled URL)
pnpm db:seed        # seed from scripts/seed/seed-data.json
```

## Deployment

Deployed on [Vercel](https://vercel.com/). See the
[Next.js deployment docs](https://nextjs.org/docs/deployment) for details.
