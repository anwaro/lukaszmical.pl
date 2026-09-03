# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

`lukaszmical.pl` — a personal website + portfolio built on **Next.js (App Router, RC)**
with TypeScript. It serves a public localized site, an admin panel, and interactive
"projects" (notably the **monogram/nonogram resolver** and **number-sums resolver**).

## Commands

```bash
pnpm install     # install deps (this repo uses pnpm — not npm/yarn)
pnpm dev         # dev server at http://localhost:3000
pnpm build       # production build
pnpm start       # serve the production build
pnpm lint        # eslint (next lint)
npx vitest       # run unit tests (there is NO test npm script)
npx vitest run src/services/projects/monogram-resolver   # scope to a folder
```

The standalone Socket.IO server lives in `server/` (`server/main.ts`) and is separate
from the Next.js app.

## Conventions

- **Path alias**: import from `@/*` (mapped to `src/*`). TypeScript is `strict`.
- **File naming**: kebab-case with a type prefix, e.g. `model-cell.ts`, `helper-array.ts`,
  `resolver-total-size.ts`, `detector-row-group.ts`. Tests sit next to the source as
  `*.spec.ts`.
- **Class naming**: PascalCase with a matching suffix — `CellModel`, `GroupHelper`,
  `TotalSizeResolver`, `ResolverModel`. A file `resolver-total-size.ts` exports
  `TotalSizeResolver`.
- **Formatting** (Prettier): 4-space indent, single quotes, semicolons, trailing commas,
  `printWidth: 85`, no bracket spacing (`{foo}` not `{ foo }`), always-parens arrows.
- **Imports**: eslint enforces `import/order` grouping with blank lines between groups.
  Keep React first, then internal `@/*`, then relative. Run `pnpm lint` before finishing.
- **i18n**: user-facing routes live under `src/app/[locale]`; strings go in `messages/en`
  and `messages/pl` via `next-intl`.

## Layout

```
src/app/            App Router — [locale]/ (public), admin/, api/
src/admin/          admin panel UI (pages, components, layouts, hooks)
src/services/       domain logic
  projects/monogram-resolver/   detector, resolver, helper, model, image, canvas, task
  projects/number-sums-resolver/
  supabase/  r2/  animation/
src/ui/             shared UI components + page compositions
src/types/          types, incl. generated supabase database types
server/             standalone Socket.IO server
scripts/            build/util scripts
messages/           next-intl translations (en, pl)
```

## Monogram resolver (the core algorithmic module)

A nonogram/monogram solver. The board is analyzed by `detector/`, modeled in `model/`
(`CellModel`, `GroupModel`, `ResolverResult`, `ResolverIndexResult`, ...), and solved by
a pipeline of small, single-responsibility **resolvers**.

- Each resolver extends `ResolverModel` and implements `run(group, groupCells)`,
  returning a `ResolverResult` (indices to include/exclude).
- Resolvers live under `resolver/legacy/` grouped by strategy: `basic/`, `done/`,
  `double/`, `extend/`, `hole/`, `separated/`, `first-and-biggest/`.
- The active set is aggregated in `resolver/legacy/index.ts` (`allResolvers`).
  When adding a resolver: create `resolver-*.ts` + `resolver-*.spec.ts` in the right
  strategy folder, then register the class in `allResolvers`.
- Shared logic goes in `helper/` (e.g. `GroupHelper`); shared shapes in `model/`.
- **Always add/adjust a `*.spec.ts`** for resolver changes — this module is test-driven
  and each rule is verified in isolation.

## External services

- **Supabase** — auth + Postgres. Regenerate types with:
  `pnpm supabase gen types --lang=typescript --project-id cxkutntgprumsvmojbos > src/types/database.ts`
- **Cloudflare R2** — asset storage via `@aws-sdk/client-s3`.
- Secrets live in `.env.local` (git-ignored). Never commit keys or print their values.

## Notes

- Do not commit unless asked. When you do, keep the existing terse commit style.
- Prefer editing existing files and following the surrounding patterns over introducing
  new abstractions.
