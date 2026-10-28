# Overview: the four parts

```
 ┌──────────────┐  Bluetooth   ┌──────────────────┐   internet   ┌──────────────┐   push / SMS   ┌──────────────────────┐
 │   Wearable   │ ───────────▶ │  User’s phone    │ ───────────▶ │   Supabase   │ ─────────────▶ │  Network members’    │
 │ (panic btn)  │  “SOS press” │  (Guard’Ova app) │  emergency,  │  (backend)   │  urgent alert  │  phones (same app)   │
 └──────────────┘              └──────────────────┘  location    └──────────────┘ ◀───────────── └──────────────────────┘
                                                                        ▲            “I’m responding”
                                                                        └── live location / status (realtime) ──┘
```

## 1. Wearable
A small device with a button, an LED and (probably) vibration. It talks to the phone over **Bluetooth Low Energy (BLE)**. It may also have its own GPS or cellular connection; that’s still an open question (see [OPEN-QUESTIONS.md](OPEN-QUESTIONS.md)).
- **Today:** not built yet. The design includes a demo button (“Simulate wearable button press”) so the app can be tested without it.

## 2. The user’s phone app (React Native / Expo)
The centre of the system. It:
- stays connected to the wearable in the background;
- runs the SOS countdown and raises the emergency;
- gets the phone’s location and sends it to the backend;
- shows everything the user sees (all screens are designed in `design/`).

## 3. Backend (Supabase)
Stores accounts, networks, devices and incidents, and decides **who is allowed to see what**. When an emergency starts, it makes sure every network member is alerted, and falls back to SMS if a push notification doesn’t arrive. See [SUPABASE.md](SUPABASE.md).

## 4. Network members’ phones
The **same app**, used by the trusted people. They receive the urgent alert, see the live location (the “Member Alert” screen), call the person, and tap “I’m responding”.

> One app, two roles: everyone can be a **wearer** (has a device and a network) and a **network member** (is in someone else’s network) at the same time.

## What makes this system different from a normal app
- **Seconds matter.** Alerts must arrive fast, including on locked, silenced phones.
- **Phones are hostile to background apps.** iOS and Android limit Bluetooth, location and notifications when the app isn’t open.
- **Failure is normal.** No signal, flat battery, notifications blocked: the design has to assume these happen.
- **Location is very sensitive data.** Only the right people, only when allowed, only for as long as needed.

## Good starting points
- Read [SOS-FLOW.md](SOS-FLOW.md) next; most other decisions follow from it.
- Run the Figma prototype (`design/reference-prototype`, `npm install && npm run dev`) and click through SOS → Countdown → Emergency → Member Alert to see the experience the backend has to support.
- Skim the technical brief’s sections on risks and edge cases.
