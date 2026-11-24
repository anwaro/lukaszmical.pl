# Magnoliowa Twin (PL)

Treść do wklejenia w panelu: /admin/case-studies → pola w języku PL.

## Ustawienia (wspólne dla obu języków)

| Pole | Wartość |
| --- | --- |
| Url or slug | `magnoliowa-twin` |
| Type | `case-study` |
| Icon (square) | `/case-studies/magnoliowa-twin.png` |
| Order | `3` |
| Published | `yes` |
| Stack | `SwiftUI, Kotlin Compose, FastAPI, ESP32, Next.js, Astro` |
| Period | — |
| Site address | — |

## Pola tekstowe (PL)

### Name

Magnoliowa Twin

### Description

Brama otwierana z telefonu: aplikacje iOS i Android, serwer na Raspberry Pi i opcjonalny przycisk BLE.

### Lead

System, który otwiera bramę jednym dotknięciem: z aplikacji, z widżetu albo fizycznym przyciskiem Bluetooth.

### Headline

Magnoliowa Twin — brama otwierana z telefonu

### Role

Fullstack developer — architektura, frontend, API i wdrożenie

### Problem (homepage card)

Bramę dało się otworzyć wyłącznie jej fizycznym pilotem.

### Approach (homepage card)

Aplikacje iOS (SwiftUI) i Android (Compose), API w FastAPI na Raspberry Pi sterujące przekaźnikiem, opcjonalny przycisk BLE na ESP32 i panel admina w Next.js.

### Result (homepage card)

Bramę otwiera jedno dotknięcie — w aplikacji, widżecie albo na przycisku Bluetooth — bez żadnych zmian w napędzie.

### Extra facts

platformy: iOS · Android · Raspberry Pi

## Content (MDX)

Wklej do pola „Content” wszystko spomiędzy znaczników.

<!-- content:start -->
<Section title="problem">
<Big>

Bramę otwierał tylko jej własny pilot radiowy. Celem było otwieranie z telefonu — bez ingerencji w napęd bramy.

</Big>

To projekt, w którym oprogramowanie kończy się na fizycznym przekaźniku: aplikacje mobilne, serwer, firmware i panel muszą razem zadziałać w ciągu sekundy.

</Section>

<Section title="jak to działa">
<Flow>
<Step title="Telefon" highlight>Dotknięcie w aplikacji, widżecie lub kafelku szybkich ustawień.</Step>
<Arrow label="HTTPS" />
<Step title="Serwer bramy">FastAPI na Raspberry Pi sprawdza token i załącza przekaźnik.</Step>
<Arrow label="GPIO" />
<Step title="Pilot bramy">Przekaźnik „naciska” przycisk oryginalnego pilota.</Step>
<Arrow label="RF" />
<Step title="Napęd">Brama otwiera się tak, jakby ktoś użył pilota.</Step>
</Flow>

Opcjonalny przycisk na ESP32-C3 wysyła sygnał przez Bluetooth do telefonu. Aplikacja działająca w tle przekazuje go do serwera i odsyła wynik, a przycisk potwierdza go diodą.

</Section>

<Section title="kluczowe decyzje">
<Decisions>
<Decision title="Nie ruszać napędu">Przekaźnik jest wpięty w istniejący pilot, nie w silnik. Brama działa dalej po staremu, a system da się odłączyć bez śladu.</Decision>
<Decision title="Telefon główną ścieżką, Bluetooth dodatkiem">Podstawą jest uwierzytelnione żądanie z aplikacji. Przycisk BLE jest dla tych, którzy nie chcą odblokowywać telefonu.</Decision>
<Decision title="Dwie natywne aplikacje o tym samym zakresie">SwiftUI na iOS i Jetpack Compose na Androidzie. Dzięki temu działa widżet Control Center i kafelek szybkich ustawień.</Decision>
<Decision title="Jedno API dla wszystkich klientów">Z tego samego API korzystają obie aplikacje, firmware i panel admina w Next.js. Kontrakt jest opisany w jednym miejscu.</Decision>
</Decisions>
</Section>

<Section title="z czego się składa">
<Chips>

- aplikacja iOS
- aplikacja Android
- widżet Control Center
- kafelek Quick Settings
- powiadomienia push
- historia otwarć
- przycisk BLE na ESP32
- czujnik stanu bramy
- panel admina
- strona publiczna w Astro

</Chips>
</Section>

<Section title="rezultat">
<Big>

Bramę otwiera jedno dotknięcie — w aplikacji, widżecie albo na przycisku Bluetooth — bez żadnych zmian w napędzie.

</Big>

Oryginalny pilot działa dalej jak wcześniej, a cały system można odłączyć bez śladu.

</Section>
<!-- content:end -->
