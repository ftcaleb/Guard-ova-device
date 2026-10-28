# Mobile: from demo data to real data

## A structure that works (suggestion)
React Native with Expo + TypeScript + expo-router. `design/HOW-TO-MATCH-THE-DESIGN.md` has the full UI method and a stack that’s been proven on this design.

- `app/`: screens (routes).
- `src/features/`: screen content, grouped by feature (home, device, network, sos, emergency, alert, history, settings…).
- `src/components/`: shared UI pieces (primitives, shell, cards, illustrations).
- `src/state/store.ts`: **one data store** (e.g. zustand) that every screen reads and writes through, seeded with demo data first.
- `src/config.ts`: switches like `DEMO_MODE` and `SOS_COUNTDOWN_SECONDS`.
- `design/`: the visual source of truth. Keep the UI identical to it.

## The seam: where real data plugs in
Build the UI first against the store with **demo data**. Screens only ask the store for data and call its actions (`endEmergency`, `invite`, `removeMember`, `respond`…). Later, point those actions at Supabase instead of demo data, and **the screens shouldn’t need to change.** This lets UI work and backend work run in parallel.

One possible approach (not the only one):
- keep the store’s shape, and replace its actions with calls to Supabase;
- add a small data layer (e.g. `src/data/`) for Supabase queries, so the store isn’t full of SQL details;
- keep `DEMO_MODE` working, so the demo can still run without a backend (useful for showing people and for UI work).

## Native pieces still to build
| Piece | What it does | Notes / ideas |
|---|---|---|
| **Bluetooth (BLE)** | Talk to the wearable: pairing, button press, battery, LED/vibration | e.g. `react-native-ble-plx`; needs a development build (not Expo Go); background mode on iOS, foreground service on Android |
| **Location** | Get the phone’s position, including in the background during an emergency | `expo-location` (+ background task); needs “Always” permission, so explain why to the user |
| **Push notifications** | Receive urgent alerts as a network member | `expo-notifications` or direct FCM/APNs; iOS Critical Alerts need Apple’s approval (apply early) |
| **Calling** | “Call Mom”, “Call emergency services (112)” | A `tel:` link; replaces today’s “Demonstrate call” demo modal |
| **Offline queue** | Keep an SOS until the network is back | Store pending actions on the phone and retry |

## Watch out for
- **Background behaviour can only be trusted on real phones.** Test locked, silenced, low-battery, and on Samsung/Huawei.
- **Android builds need a short project path on Windows** (e.g. `C:\dev\guardova`) because of the 260-character path limit.
- **The UI must stay identical to the design,** so connecting data shouldn’t change how anything looks. If a screen needs a new state (loading, error, empty), discuss it with design first.
- **Permissions:** ask at the moment they’re needed, with a short reason. Users deny vague requests.

## Good starting points
1. Build the store from DESIGN-SPEC §11.3 (state) and §11.2 (flows), and list every piece of data and action. That list is your API.
2. Add Supabase login (phone + code) and load the real profile into the store, leaving everything else on demo data.
3. Connect **My Network** next (read members, invite, remove). It’s a simple, self-contained screen.
4. Then the emergency: create the incident in Supabase from the countdown, and show `alert_deliveries` on Emergency Active.
5. In parallel, someone spikes **BLE** with a dev board (ESP32/nRF52) pretending to be the wearable.
