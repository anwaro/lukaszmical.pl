# itmbw.pl (PL)

Treść do wklejenia w panelu: /admin/case-studies → pola w języku PL.

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

## Pola tekstowe (PL)

### Name

itmbw.pl

### Description

Serwis biegowy z aplikacją dla biegaczy: wyniki, rankingi, kalendarz i konta w jednym miejscu.

### Lead

Serwis biegowy, w którym treści redakcyjne o biegach spotykają się z wynikami, rankingami i kontami biegaczy ITMBWieczorem.

### Headline

itmbw.pl — serwis biegowy z aplikacją dla biegaczy

### Role

[TWOJA ROLA]

### Problem (homepage card)

Jeden serwis łączy treści redakcyjne o biegach z wynikami, rankingami i kontami biegaczy ITMBWieczorem.

### Approach (homepage card)

Motyw WordPressa na Tailwindzie, a w nim SPA w Preact i TypeScripcie: wyniki, kalendarz, konto, generator numerów startowych. Dane z osobnego API w Laravelu z własnym CMS-em i wspólnym czyszczeniem cache.

### Result (homepage card)

[Efekt — np. szybkość stron, liczba biegaczy i wyników w serwisie.]

## Content (MDX)

Wklej do pola „Content” wszystko spomiędzy znaczników.

<!-- content:start -->
<Shot>[ZRZUT EKRANU: strona główna itmbw.pl]</Shot>

<Section title="problem">
<Big>

Stowarzyszenie prowadzi serwis redakcyjny i organizuje biegi. Biegacze chcą w tym samym miejscu sprawdzić wyniki, rankingi i własne konto.

</Big>

Strony redakcyjne dobrze obsługuje WordPress, ale część dla biegaczy to aplikacja: listy z sortowaniem, wyszukiwarka, logowanie, generowanie plików. [Dopisz, co było punktem wyjścia i ograniczeniem.]

</Section>

<Section title="architektura">
<Flow>
<Step title="WordPress">Motyw PHP na Tailwindzie: strona główna, artykuły, partnerzy, strony biegów.</Step>
<Arrow />
<Step title="SPA w Preact" highlight>Wszystkie strony dla biegaczy, osadzone we wpisach shortcodem. Vite, TypeScript, własny router.</Step>
<Arrow />
<Step title="API w Laravelu">app.itmbw.pl: publiczne JSON API i wewnętrzny CMS w React do zarządzania danymi.</Step>
</Flow>

Strona biegacza to zwykły wpis WordPressa. Router aplikacji wybiera widok po adresie, a logowanie działa przez sesję współdzieloną między domeną i subdomeną API.

</Section>

<Section title="kluczowe decyzje">
<Decisions>
<Decision title="Aplikacja wewnątrz WordPressa, nie obok">Redakcja zostaje przy znanym edytorze, a biegacz nie opuszcza serwisu. Adresy aplikacji pokrywają się z adresami wpisów.</Decision>
<Decision title="API jako kontrakt">Dokumentacja OpenAPI powstaje z kodu, a test pilnuje, żeby żadna trasa nie została bez opisu.</Decision>
<Decision title="Cache z natychmiastowym czyszczeniem">Odpowiedzi API i gotowe strony są cache’owane, a każda edycja w CMS-ie od razu unieważnia oba poziomy.</Decision>
<Decision title="Dane wydarzeń w rękach redakcji">Dane strukturalne biegów (SportsEvent) uzupełnia się w edytorze strony — nowa edycja nie wymaga wdrożenia.</Decision>
</Decisions>
</Section>

<Section title="co potrafi aplikacja">
<Chips>

- hall of fame
- lista i profile biegaczy
- wyniki biegów
- kluby
- kalendarz
- rejestracja i logowanie
- konto: profil, adres, awatar
- generator numerów startowych (PDF)

</Chips>
</Section>

<Shots>
<Shot ratio="4 / 3">[ZRZUT: wyniki biegu]</Shot>
<Shot ratio="4 / 3">[ZRZUT: profil biegacza na telefonie]</Shot>
</Shots>

<Section title="rezultat">
<Stats>
<Stat value="[X]">[biegaczy w bazie]</Stat>
<Stat value="[X]">[wyników biegów]</Stat>
<Stat value="[X]">[np. czas ładowania strony]</Stat>
</Stats>

[Dwa zdania o efekcie: co zmieniło się dla biegaczy i dla redakcji.]

</Section>
<!-- content:end -->
