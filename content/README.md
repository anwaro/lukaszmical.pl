# Treści do CMS

Gotowe treści z designu do wklejenia w panelu admina. Jeden plik na wpis i język:
`<slug>.pl.md` i `<slug>.en.md`.

- `pages/` → `/admin/pages` → „Create new" (strona główna: `/admin/homepage`)
- `case-studies/` → `/admin/case-studies` → „Create new"
- `projects/` → `/admin/projects` → „Create new"

W każdym pliku:

1. **Ustawienia** — pola wspólne dla obu języków (slug, typ, ikona/okładka, stack...).
   Wystarczy je wpisać raz.
2. **Pola tekstowe** — nagłówki odpowiadają etykietom pól w formularzu; wklej je po
   przełączeniu formularza na dany język (PL/EN).
3. **Content (MDX)** — treść strony; wklej wszystko spomiędzy znaczników
   `content:start` i `content:end` do pola „Content".

Wpisy nie mają jeszcze zrzutów ekranu. Zrzut wstawia się, dodając w treści adres
obrazka: `<Shot src="https://..." alt="opis" />`.

Strona główna i strony statyczne (`/admin/homepage`, `/admin/pages`) składają się w
całości z bloków — biblioteka bloków jest w edytorze treści, w trybie edycji po prawej.
Teksty interfejsu mają wartości domyślne w `messages/<język>/*.json` i edytuje się je w
`/admin/translations`.
