# Gdzie Transmisja (PL)

Treść do wklejenia w panelu: /admin/case-studies → pola w języku PL.

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

## Pola tekstowe (PL)

### Name

Gdzie Transmisja

### Description

Wyszukiwarka transmisji sportowych, miejscówek i lig — z danych zbieranych z zewnętrznych źródeł.

### Lead

Wyszukiwarka transmisji sportowych: mecze, kanały, ligi i miejscówki, w których można je obejrzeć.

### Headline

Gdzie Transmisja — wyszukiwarka transmisji sportowych

### Role

[TWOJA ROLA]

### Problem (homepage card)

Transmisje, miejscówki i ligi w jednym miejscu — z danych zbieranych z zewnętrznych źródeł.

### Approach (homepage card)

Monorepo na Turborepo: Next.js, API w NestJS z Drizzle i Postgresem, panel admina, scrapery oraz typy generowane z OpenAPI, wspólne dla wszystkich aplikacji.

### Result (homepage card)

[Efekt — np. liczba transmisji w bazie, ruch, czas dodania nowej ligi.]

## Content (MDX)

Wklej do pola „Content” wszystko spomiędzy znaczników.

<!-- content:start -->
<Shot>[ZRZUT EKRANU: wyszukiwarka transmisji]</Shot>

<Section title="problem">
<Big>

Informacje o tym, gdzie obejrzeć mecz, są rozrzucone po wielu źródłach. Kibic chce jednej odpowiedzi: kanał, godzina, miejsce.

</Big>

Po stronie kodu to kilka aplikacji naraz — strona dla kibiców, panel redakcji, API i import danych — które muszą posługiwać się tymi samymi typami. [Dopisz, skąd wziął się pomysł i kto za nim stoi.]

</Section>

<Section title="architektura">
<Flow>
<Step title="@gt/data">Scrapery i import transmisji z zewnętrznych źródeł.</Step>
<Arrow />
<Step title="@gt/api">NestJS, Drizzle, Zod i PostgreSQL. Autoryzacja JWT, pliki, zadania cron.</Step>
<Arrow />
<Step title="@gt/web" highlight>Publiczna strona w Next.js: transmisje, miejscówki, ligi.</Step>
<Step title="@gt/admin">Panel redakcji na react-admin i Vite.</Step>
</Flow>

Całość spina pakiet `@gt/shared`: typy, enumy i narzędzia używane przez wszystkie aplikacje. Monorepo działa na pnpm workspaces i Turborepo.

</Section>

<Section title="kluczowe decyzje">
<Decisions>
<Decision title="Typy z jednego źródła">Schemat bazy w Drizzle daje schematy Zod, te dają OpenAPI, a z niego generują się typy i enum tras dla frontendów.</Decision>
<Decision title="Adresy strony jako typ">Typy ścieżek powstają ze struktury katalogów Next.js, razem z tłumaczeniami tras na polski i angielski.</Decision>
<Decision title="Komponent to sam widok">Plik komponentu zawiera tylko JSX. Logika trafia do jednego hooka obok, a strona tylko pobiera dane i renderuje.</Decision>
<Decision title="Jedno repo, osobne wdrożenia">Strona i panel wdrażają się na Vercelu, API na Railway. Migracje bazy API uruchamia samo przy starcie.</Decision>
</Decisions>
</Section>

<Section title="co potrafi produkt">
<Chips>

- wyszukiwarka transmisji
- miejscówki
- ligi i drużyny
- kanały
- artykuły
- panel administracyjny
- automatyczny import danych

</Chips>
</Section>

<Shots>
<Shot ratio="4 / 3">[ZRZUT: strona transmisji]</Shot>
<Shot ratio="4 / 3">[ZRZUT: panel admina]</Shot>
</Shots>

<Section title="rezultat">
<Stats>
<Stat value="[X]">[transmisji w bazie]</Stat>
<Stat value="[X]">[lig i kanałów]</Stat>
<Stat value="[X]">[np. użytkowników miesięcznie]</Stat>
</Stats>

[Dwa zdania o efekcie: na jakim etapie jest produkt i co działa najlepiej.]

</Section>
<!-- content:end -->
