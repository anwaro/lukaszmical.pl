# itmbw.pl (EN)

Treść do wklejenia w panelu: /admin/case-studies → pola w języku EN.

## Ustawienia (wspólne dla obu języków)

| Pole | Wartość |
| --- | --- |
| Url or slug | `itmbw-pl` |
| Type | `case-study` |
| Icon (square) | `/case-studies/itmbw-pl.png` |
| Order | `1` |
| Published | `yes` |
| Stack | `Preact, TypeScript, Tailwind, WordPress, Laravel` |
| Period | — |
| Site address | `https://itmbw.pl` |

## Pola tekstowe (EN)

### Name

itmbw.pl

### Description

A running portal with an app for runners: results, rankings, a calendar and accounts in one place.

### Lead

A running portal where editorial content about races meets the results, rankings and runner accounts of ITMBWieczorem.

### Headline

itmbw.pl — a running portal with an app for runners

### Role

[YOUR ROLE]

### Problem (homepage card)

One site combines editorial content about races with the results, rankings and runner accounts of ITMBWieczorem.

### Approach (homepage card)

A WordPress theme on Tailwind with a Preact and TypeScript SPA inside it: results, calendar, account, bib number generator. Data comes from a separate Laravel API with its own CMS and shared cache purging.

### Result (homepage card)

[Outcome — e.g. page speed, number of runners and results on the site.]

## Content (MDX)

Wklej do pola „Content” wszystko spomiędzy znaczników.

<!-- content:start -->
<Shot>[SCREENSHOT: itmbw.pl homepage]</Shot>

<Section title="problem">
<Big>

The association runs an editorial site and organises races. Runners want to check results, rankings and their own account in the same place.

</Big>

WordPress handles editorial pages well, but the part for runners is an application: sortable lists, search, sign-in, file generation. [Add what the starting point and the constraints were.]

</Section>

<Section title="architecture">
<Flow>
<Step title="WordPress">A PHP theme on Tailwind: homepage, articles, partners, race pages.</Step>
<Arrow />
<Step title="Preact SPA" highlight>All pages for runners, embedded in posts with a shortcode. Vite, TypeScript, a custom router.</Step>
<Arrow />
<Step title="Laravel API">app.itmbw.pl: a public JSON API and an internal React CMS for managing data.</Step>
</Flow>

A runner page is a regular WordPress post. The app router picks the view by address, and sign-in works through a session shared between the domain and the API subdomain.

</Section>

<Section title="key decisions">
<Decisions>
<Decision title="The app inside WordPress, not next to it">Editors keep the editor they know and runners never leave the site. App addresses match post addresses.</Decision>
<Decision title="The API as a contract">OpenAPI documentation is generated from code, and a test makes sure no route is left undocumented.</Decision>
<Decision title="Cache with instant purging">API responses and rendered pages are cached, and every edit in the CMS invalidates both levels right away.</Decision>
<Decision title="Event data in the hands of editors">Structured data for races (SportsEvent) is filled in the page editor — a new edition needs no deployment.</Decision>
</Decisions>
</Section>

<Section title="what the app does">
<Chips>

- hall of fame
- runner list and profiles
- race results
- clubs
- calendar
- sign-up and sign-in
- account: profile, address, avatar
- bib number generator (PDF)

</Chips>
</Section>

<Shots>
<Shot ratio="4 / 3">[SCREENSHOT: race results]</Shot>
<Shot ratio="4 / 3">[SCREENSHOT: runner profile on a phone]</Shot>
</Shots>

<Section title="result">
<Stats>
<Stat value="[X]">[runners in the database]</Stat>
<Stat value="[X]">[race results]</Stat>
<Stat value="[X]">[e.g. page load time]</Stat>
</Stats>

[Two sentences about the outcome: what changed for runners and for the editors.]

</Section>
<!-- content:end -->
