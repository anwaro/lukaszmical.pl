# Design strony (kierunek „Terminal”)

Kopia plików z kanwy Design: https://claude.ai/artifact/5v4Vp3nq9gPuK7wk3DhC1V

Źródłem prawdy jest kanwa — po zmianach na kanwie te pliki trzeba skopiować ponownie.

## Ekrany

| Plik | Ekran |
|---|---|
| `Terminal.dc.html` | Strona główna |
| `CaseStudies.dc.html` | Lista case studies |
| `CaseStudy.dc.html` | Case study — itmbw.pl |
| `CaseStudyGdzieTransmisja.dc.html` | Case study — Gdzie Transmisja |
| `CaseStudyMagnoliowa.dc.html` | Case study — Magnoliowa Twin |
| `Projects.dc.html` | Lista projektów |
| `Project.dc.html` | Projekt — monogram-resolver |
| `*Mobile.dc.html` | Widok mobilny (390 px); osadza odpowiedni ekran przez `<dc-import>` |
| `canvas.json` | Układ ramek na kanwie |

## Uwagi

- Pliki `.dc.html` to format kanwy Design. Otwarte bezpośrednio w przeglądarce nie wyrenderują się
  (brakuje `support.js`), ale cały układ i style są w nich zapisane jako zwykły HTML ze stylami inline.
- Ikony aplikacji w plikach wskazują na zasoby kanwy (`/_blob/...`). Ich kopie są w `icons/`:
  `icon-itmbw.png`, `icon-gdzie-transmisja.png`, `icon-magnoliowa-twin.png`.
- Logo w nagłówku to `public/logo.svg` wklejone inline.
- Teksty w nawiasach kwadratowych (`[TWOJA ROLA]`, `[X]`, `[ZRZUT ...]`) to placeholdery do uzupełnienia.

## Tokeny

| Rola | Wartość |
|---|---|
| Tło | `#0A0F16` |
| Panel | `#101823` |
| Obramowanie | `#1F2B3A` / `#3A4A5E` |
| Tekst | `#E8ECEF` |
| Tekst drugorzędny | `#C3CAD1` |
| Tekst wyciszony | `#9AA3AD` |
| Akcent (z logo) | `#63A0E3` |
| Font nagłówków i etykiet | JetBrains Mono |
| Font tekstu | Inter |
