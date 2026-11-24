# Strona główna (EN)

Treść do wklejenia w panelu: /admin/homepage → pola w języku EN.

## Ustawienia (wspólne dla obu języków)

| Pole | Wartość |
| --- | --- |
| Slug | `homepage` |
| Position | `0` |
| Published | `yes` |

## Pola tekstowe (EN)

### Page title

Łukasz Micał | Frontend developer

### Meta description

Portfolio of Łukasz Micał — frontend developer. Case studies of products built from the interface down to the API, plus interactive projects.

## Content (MDX)

<!-- content:start -->
<Hero>
<HeroIntro command="whoami" title="Łukasz Micał," title2="frontend developer">

I build products from the interface down to the API — from a running portal to an app that opens a gate. I work mostly in React, Next.js and TypeScript.

<Buttons>
<Button href="/#case-studies" variant="primary">cd case-studies</Button>
<Button href="/#kontakt">write to me</Button>
</Buttons>

</HeroIntro>
<Solver label="monogram-resolver" status="solved" alt="A solved nonogram forming angle brackets with a slash" caption="Every solver rule is a separate module with its own test." />
</Hero>

<CaseStudyList id="case-studies" command="ls case-studies/" />

<ProjectList id="projekty" command="ls -l projects/" limit="3" />

<Split id="o-mnie">
<Lead command="cat about.md">

I value code that can still be read a year later: small modules, clear names, tests next to the sources. [Two sentences about your experience and what you are looking for.]

</Lead>
<Stack label="stack" items="React, Next.js, TypeScript, Postgres, Drizzle, NestJS, Laravel, Vitest" />
</Split>

<Contact id="kontakt" command="mail --to" email="" placeholder="[YOUR E-MAIL]">

Looking for a frontend developer for your project? Write to me — I reply within [X] days.

</Contact>
<!-- content:end -->
