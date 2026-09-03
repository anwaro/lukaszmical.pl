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
- **Supabase** — auth + Postgres (generated types in `src/types/database.ts`)
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

Copy the required variables into `.env.local` (see the keys below — do **not** commit secrets):

- `SUPABASE_URL`, `SUPABASE_KEY` — service role (server-only)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public client
- `R2_BUCKET_PUBLIC_URL`, `R2_BUCKET_NAME`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` — Cloudflare R2

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
    supabase/     # supabase clients
    r2/           # Cloudflare R2 helpers
    animation/
  ui/             # shared UI (components + page-level compositions)
  types/          # TypeScript types, incl. generated supabase/database types
  utils/
server/           # standalone Socket.IO server (realtime cursors demo)
scripts/          # build/util scripts (e.g. minify.projects.mjs)
messages/         # next-intl translation files (en, pl)
public/           # static assets
```

## Generate Supabase types

```bash
pnpm supabase gen types --lang=typescript --project-id cxkutntgprumsvmojbos > src/types/database.ts
```

## Deployment

Deployed on [Vercel](https://vercel.com/). See the
[Next.js deployment docs](https://nextjs.org/docs/deployment) for details.
