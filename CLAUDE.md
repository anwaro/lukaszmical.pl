# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

`lukaszmical.pl` — a personal website + portfolio built on **Next.js (App Router)**
with TypeScript. It serves a public localized site, an admin panel, and interactive
"projects" (notably the **monogram/nonogram resolver** and **number-sums resolver**).

## Commands

```bash
pnpm install     # install deps (this repo uses pnpm — not npm/yarn)
pnpm dev         # dev server at http://localhost:3000
pnpm build       # production build
pnpm start       # serve the production build
pnpm lint        # oxlint (.oxlintrc.json)
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
- **Imports**: oxlint enforces `import-js/order` grouping with blank lines between groups.
  Keep React first, then internal `@/*`, then relative. Run `pnpm lint` before finishing.
- **i18n**: user-facing routes live under `src/app/[locale]`; strings go in `messages/en`
  and `messages/pl` via `next-intl`.

## Layout

```
src/app/            App Router — [locale]/ (public), admin/, api/
src/admin/          admin panel UI (components, layouts, theme, css)
src/services/       domain logic
  projects/monogram-resolver/   detector, resolver, helper, model, image, canvas, task
  projects/number-sums-resolver/
  db/  content/  r2/  animation/
src/ui/             shared UI components + page compositions
  site/             public site shell, shared parts, MDX content blocks
src/types/          shared types
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

## Components and pages

- **One React component per file.** A file that renders more than one component
  (even a small helper one) gets split; the sub-component's own file sits next to it.
- **No logic in a component** — only JSX and the hook calls that wire it to React
  (`useState`, the event handlers that call a model function, effects). Helper
  functions, derived values, data transforms and `clsx` class composition move to a
  co-located `<name>-model.ts` (plain exported functions, not a class, unless the
  module already uses classes as in the resolvers below).
- **Every `page.tsx` has its own page service** — a co-located `<name>-page-service.ts`
  exporting a `<Name>PageService` class that does the data fetching, `notFound()`/
  `redirect()` branching and shaping; the page itself just calls it and renders. Several
  near-identical list pages may share one service (e.g. `EntryListPageService` for the
  admin's pages/projects/case-studies lists) rather than duplicating it three times.
  Skip the service only when a page is genuinely just composing other components with
  no data or branching of its own (e.g. the monogram/number-sums resolver's `page.tsx`,
  which only wires up a dynamic import).
- Soft goal, not a hard limit: keep files under ~200 lines. A cohesive single-purpose
  class or a plain data catalogue (e.g. `block-library.ts`) that runs a little over is
  fine — don't fragment it just to hit the number.

## Admin panel

- Styled with **Tailwind utility classes directly in markup** — no component CSS
  classes. Colours are the plain Tailwind palette (slate for neutrals, blue for the
  accent, emerald/amber/rose for success/warning/danger); dark mode uses the `dark:`
  variant, redefined in `src/admin/css/main.css` as a `@custom-variant` so it follows
  either an explicit `data-theme` on the admin root or, absent a choice, the system
  preference. Geist font, `lucide-react` icons (stroke 1.8).
- A repeated utility string (a button, a field, a chip, a notice, ...) is a `clsx`
  function in a co-located `*-class-name.ts`/`*-model.ts` (e.g. `button-model.ts`'s
  `buttonClassName`, `field-input-class-name.ts`'s `fieldInputClassName`) — compose
  that instead of re-deriving the Tailwind classes at each call site.
- Theme: system preference, overridden by the header toggle (`admin-theme` cookie,
  `ThemeProvider` in `src/admin/theme/`).
- Interface copy is Polish: verbs in the infinitive, sentence case, no full stop
  („Zapisz zmiany”), ongoing states with an ellipsis („Zapisywanie…”).

## Database & auth

- **Postgres** via **Drizzle ORM**, confined to `src/services/db/` (`db-client.ts`,
  `schema/`). Runtime uses the pooled `DATABASE_URL` with `postgres(url, {prepare:false})`.
  Nothing outside `src/services/db/` and the repositories imports `drizzle-orm`: data
  access goes through `EntryRepository` / `MessageRepository` in `src/services/content/`,
  which return the domain types from `src/types/entry.ts`.
  Hosted on **Vercel Postgres (Neon)** in production, local Docker Postgres in dev
  (`pnpm db:up`).
- **Schema changes**: edit `schema/`, run `pnpm db:generate` (writes a migration to
  `drizzle/`) and `pnpm db:migrate` locally. Production is migrated by the Vercel build.
- **Vercel build** (`vercel.json`): `pnpm db:deploy && pnpm build`. `scripts/db-deploy.ts`
  applies pending migrations (over `DATABASE_URL_UNPOOLED`) and syncs messages; it does
  nothing on preview deployments.
- **Auth** — single admin user, no external service. `src/utils/auth/`: `argon2` password
  hash (`ADMIN_PASSWORD_HASH`) verified in the login action, `jose` HS256 session cookie
  (`AUTH_SECRET`) checked by the proxy (`src/proxy.ts`) and `auth()`. Generate the hash with
  `pnpm auth:hash '<password>'`.

## Content (CMS)

- **Entries** — static pages, case studies and projects are rows of `entries` (`kind`:
  `page`, `case_study`, `project`; slug unique per kind), with texts per language in
  `entry_translations` (`title`, `description`, `lead`, `content` + `extra` JSON for
  the fields only some kinds use: `headline`, `role`, `problem`, `approach`, `result`,
  `facts`). A project also has a `presentation`: `article` (write-up from blocks), `app`
  (served from `public/projects/<slug>`, switches in `options`) or `link` (`link_url`).
  Routes are `/<slug>`, `/case-studies/*` and `/projects/*`.
- **Block library** — all long content is MDX built from blocks, rendered by
  `ContentMdx` (`src/ui/site/content-mdx.tsx`). The catalogue (sections, descriptions,
  editor snippets) is `src/ui/site/blocks/block-library.ts`; components are in
  `content-mdx-components.tsx` (static) and `content-mdx-dynamic.tsx` (CMS data:
  `<CaseStudyList>`, `<ProjectList>`). A new block needs an
  entry in the library **and** a component — the types fail the build otherwise.
- **Homepage** is the `page` entry with the slug `homepage`, edited in
  `/admin/homepage` as block source. There is no fallback: without that entry `/`
  is a 404. Its ready-to-paste source is in `content/pages/`.
- **Translations**: `messages/<locale>/*.json` define which keys exist and their
  default values; the `messages` table holds the values and wins at runtime
  (`src/services/content/content-store.ts`). The message sync (`pnpm db:sync-messages`,
  part of the build) adds keys missing in the table, removes keys gone from the files
  and never changes a stored value — so editing a default in JSON does not reach a
  database that already has the key. A new UI string needs a default in both JSON
  files; editors change values in `/admin/translations` (both languages side by side).
  There is no settings table: the e-mail and the stack are parameters of the
  `<Contact>` and `<Stack>` blocks, footer links are the `common.footer.*Url`
  translations (an empty one is hidden).
- Saving translations expires the `cms-content` cache tag; rows changed
  directly in the database are not picked up until then.
- `content/` holds ready-to-paste entries (pages, case studies, projects) as Markdown, one
  file per entry and language; there is no content seed — entries are created in the
  admin.

## External services

- **Cloudflare R2** — asset storage via `@aws-sdk/client-s3`.
- Secrets live in `.env.local` (git-ignored). Never commit keys or print their values.

## Notes

- Keep the existing terse commit style when committing.
- Prefer editing existing files and following the surrounding patterns over introducing
  new abstractions.
