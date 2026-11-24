# Strona główna (PL)

Treść do wklejenia w panelu: /admin/homepage → pola w języku PL.

## Ustawienia (wspólne dla obu języków)

| Pole | Wartość |
| --- | --- |
| Slug | `homepage` |
| Position | `0` |
| Published | `yes` |

## Pola tekstowe (PL)

### Page title

Łukasz Micał | Frontend developer

### Meta description

Portfolio Łukasza Micała — frontend developera. Case studies produktów budowanych od interfejsu po API oraz interaktywne projekty.

## Content (MDX)

<!-- content:start -->
<Hero>
<HeroIntro command="whoami" title="Łukasz Micał," title2="frontend developer">

Buduję produkty od interfejsu po API — od serwisu biegowego po aplikację, która otwiera bramę. Pracuję głównie w React, Next.js i TypeScripcie.

<Buttons>
<Button href="/#case-studies" variant="primary">cd case-studies</Button>
<Button href="/#kontakt">napisz do mnie</Button>
</Buttons>

</HeroIntro>
<Solver label="monogram-resolver" status="rozwiązano" alt="Rozwiązany nonogram układający się w znak nawiasów ostrych z ukośnikiem" caption="Każda reguła solvera to osobny moduł z własnym testem." />
</Hero>

<CaseStudyList id="case-studies" command="ls case-studies/" />

<ProjectList id="projekty" command="ls -l projekty/" limit="3" />

<Split id="o-mnie">
<Lead command="cat o-mnie.md">

Cenię kod, który da się przeczytać po roku: małe moduły, jasne nazwy, testy obok źródeł. [Dwa zdania o doświadczeniu i o tym, czego szukasz.]

</Lead>
<Stack label="stack" items="React, Next.js, TypeScript, Postgres, Drizzle, NestJS, Laravel, Vitest" />
</Split>

<Contact id="kontakt" command="mail --to" email="" placeholder="[TWÓJ E-MAIL]">

Szukasz frontendowca do projektu? Napisz — odpowiadam w ciągu [X] dni.

</Contact>
<!-- content:end -->
