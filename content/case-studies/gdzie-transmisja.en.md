# Gdzie Transmisja (EN)

Treść do wklejenia w panelu: /admin/case-studies → pola w języku EN.

## Ustawienia (wspólne dla obu języków)

| Pole | Wartość |
| --- | --- |
| Url or slug | `gdzie-transmisja` |
| Type | `case-study` |
| Icon (square) | `/case-studies/gdzie-transmisja.png` |
| Order | `2` |
| Published | `yes` |
| Stack | `Next.js, NestJS, Drizzle, PostgreSQL, Turborepo` |
| Period | — |
| Site address | — |

## Pola tekstowe (EN)

### Name

Gdzie Transmisja

### Description

A search engine for sports broadcasts, venues and leagues — built on data collected from external sources.

### Lead

A search engine for sports broadcasts: matches, channels, leagues and the venues where you can watch them.

### Headline

Gdzie Transmisja — a sports broadcast search engine

### Role

[YOUR ROLE]

### Problem (homepage card)

Broadcasts, venues and leagues in one place — built on data collected from external sources.

### Approach (homepage card)

A Turborepo monorepo: Next.js, a NestJS API with Drizzle and Postgres, an admin panel, scrapers and types generated from OpenAPI, shared by every app.

### Result (homepage card)

[Outcome — e.g. number of broadcasts in the database, traffic, time to add a new league.]

## Content (MDX)

Wklej do pola „Content” wszystko spomiędzy znaczników.

<!-- content:start -->
<Shot>[SCREENSHOT: broadcast search]</Shot>

<Section title="problem">
<Big>

Information about where to watch a match is scattered across many sources. A fan wants one answer: channel, time, place.

</Big>

On the code side it is several applications at once — a site for fans, an editorial panel, an API and data import — that have to speak the same types. [Add where the idea came from and who is behind it.]

</Section>

<Section title="architecture">
<Flow>
<Step title="@gt/data">Scrapers and broadcast import from external sources.</Step>
<Arrow />
<Step title="@gt/api">NestJS, Drizzle, Zod and PostgreSQL. JWT auth, files, cron jobs.</Step>
<Arrow />
<Step title="@gt/web" highlight>The public Next.js site: broadcasts, venues, leagues.</Step>
<Step title="@gt/admin">The editorial panel on react-admin and Vite.</Step>
</Flow>

Everything is tied together by the `@gt/shared` package: types, enums and tools used by every app. The monorepo runs on pnpm workspaces and Turborepo.

</Section>

<Section title="key decisions">
<Decisions>
<Decision title="Types from a single source">The Drizzle database schema yields Zod schemas, those yield OpenAPI, and from it the types and the route enum for the frontends are generated.</Decision>
<Decision title="Site addresses as a type">Path types are derived from the Next.js directory structure, together with route translations into Polish and English.</Decision>
<Decision title="A component is just the view">A component file holds only JSX. Logic goes into a single hook next to it, and the page only fetches data and renders.</Decision>
<Decision title="One repo, separate deployments">The site and the panel deploy to Vercel, the API to Railway. The API runs its database migrations on start.</Decision>
</Decisions>
</Section>

<Section title="what the product does">
<Chips>

- broadcast search
- venues
- leagues and teams
- channels
- articles
- admin panel
- automatic data import

</Chips>
</Section>

<Shots>
<Shot ratio="4 / 3">[SCREENSHOT: broadcast page]</Shot>
<Shot ratio="4 / 3">[SCREENSHOT: admin panel]</Shot>
</Shots>

<Section title="result">
<Stats>
<Stat value="[X]">[broadcasts in the database]</Stat>
<Stat value="[X]">[leagues and channels]</Stat>
<Stat value="[X]">[e.g. monthly users]</Stat>
</Stats>

[Two sentences about the outcome: what stage the product is at and what works best.]

</Section>
<!-- content:end -->
