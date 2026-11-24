# Magnoliowa Twin (EN)

Treść do wklejenia w panelu: /admin/case-studies → pola w języku EN.

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

## Pola tekstowe (EN)

### Name

Magnoliowa Twin

### Description

A gate opened from a phone: iOS and Android apps, a server on a Raspberry Pi and an optional BLE button.

### Lead

A system that opens a gate with one tap: from the app, from a widget or with a physical Bluetooth button.

### Headline

Magnoliowa Twin — a gate opened from a phone

### Role

Fullstack developer — architecture, frontend, API and deployment

### Problem (homepage card)

The gate could only be opened with its physical remote.

### Approach (homepage card)

iOS (SwiftUI) and Android (Compose) apps, a FastAPI service on a Raspberry Pi driving a relay, an optional BLE button on an ESP32 and an admin panel in Next.js.

### Result (homepage card)

One tap opens the gate — in the app, a widget or on the Bluetooth button — with no changes to the drive.

### Extra facts

platforms: iOS · Android · Raspberry Pi

## Content (MDX)

Wklej do pola „Content” wszystko spomiędzy znaczników.

<!-- content:start -->
<Section title="problem">
<Big>

Only the gate’s own radio remote could open it. The goal was to open it from a phone — without touching the gate drive.

</Big>

This is a project where software ends at a physical relay: mobile apps, a server, firmware and a panel have to work together within a second.

</Section>

<Section title="how it works">
<Flow>
<Step title="Phone" highlight>A tap in the app, a widget or a quick settings tile.</Step>
<Arrow label="HTTPS" />
<Step title="Gate server">FastAPI on a Raspberry Pi checks the token and switches the relay.</Step>
<Arrow label="GPIO" />
<Step title="Gate remote">The relay “presses” the button of the original remote.</Step>
<Arrow label="RF" />
<Step title="Drive">The gate opens as if someone had used the remote.</Step>
</Flow>

An optional ESP32-C3 button sends a signal to the phone over Bluetooth. The app running in the background passes it to the server and returns the result, which the button confirms with an LED.

</Section>

<Section title="key decisions">
<Decisions>
<Decision title="Leave the drive alone">The relay is wired into the existing remote, not the motor. The gate keeps working as before and the system can be removed without a trace.</Decision>
<Decision title="Phone as the main path, Bluetooth as an extra">The basis is an authenticated request from the app. The BLE button is for those who do not want to unlock their phone.</Decision>
<Decision title="Two native apps with the same scope">SwiftUI on iOS and Jetpack Compose on Android. That is what makes the Control Center widget and the quick settings tile possible.</Decision>
<Decision title="One API for every client">Both apps, the firmware and the Next.js admin panel use the same API. The contract is described in one place.</Decision>
</Decisions>
</Section>

<Section title="what it consists of">
<Chips>

- iOS app
- Android app
- Control Center widget
- Quick Settings tile
- push notifications
- opening history
- BLE button on an ESP32
- gate state sensor
- admin panel
- public site in Astro

</Chips>
</Section>

<Section title="result">
<Big>

One tap opens the gate — in the app, a widget or on the Bluetooth button — with no changes to the drive.

</Big>

The original remote keeps working as before, and the whole system can be removed without a trace.

</Section>
<!-- content:end -->
