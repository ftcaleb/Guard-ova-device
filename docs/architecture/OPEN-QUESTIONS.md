# Open questions

Things the team still has to figure out. Discuss, try things, and when you decide, move the item to the **Decisions log** with a line about why.

## Product and hardware
- **Does the wearable have its own connection (cellular/GPS), or does it rely on the phone?** This affects cost, battery and reliability, and what happens if the phone is out of reach. *Probably the biggest open question.*
- **What exactly does the wearable send?** Button patterns (single, double, long press?), battery level, LED/vibration commands. Write a small BLE message list together with the hardware team.
- **How long should an emergency share location** if the user never ends it?

## Backend (Supabase)
- **Region and POPIA:** which Supabase region, and is storing personal data outside South Africa acceptable for our users? Needs a legal check before real users.
- **Push provider:** Expo’s push service, or Firebase (FCM) + Apple (APNs) directly? Check which one supports iOS Critical Alerts and Android high-priority alerts the way we need.
- **SMS provider** for login codes and alert fallback: one with good South African delivery (e.g. Clickatell, BulkSMS, Twilio). Compare price and speed.
- **SMS fallback timing:** how long to wait for a push delivery confirmation before sending an SMS (the brief suggests about 30 s)?
- **Location retention:** how long to keep location points after an incident ends.

## Mobile
- **Expo development builds** are needed for BLE and some notification features. When do we switch from Expo Go?
- **iOS:** we need an Apple Developer account and to apply for the **Critical Alerts entitlement** (approval can take time, so apply early).
- **Background limits:** what actually works on our test phones? (Results of the Phase 0 spike go here.)

## Process
- Who reviews changes to the SOS flow and the security (RLS) rules before they merge?
- How do we test the full SOS flow end to end on real phones before each release?

---

## Decisions log
| Date | Decision | Why |
|---|---|---|
| 2026-10-29 | **Incident state machine on the phone:** `countdown → active → resolved`, or `countdown → cancelled`. Pure transitions in `guardova/src/features/sos/incident.ts`; every transition is a no-op when not allowed, so it is safe to call twice | SOS-FLOW “model the incident as a state machine” and “safe to retry”. The same states can be mirrored by `incidents.status` |
| 2026-10-29 | **The countdown runs on a deadline** (`countdownEndsAt`), app-wide (`useSosEngine`), not on the countdown screen | Leaving the screen, Android back or a stalled JS thread must not silently stop an SOS. Only an explicit “Cancel SOS” stops it |
| 2026-10-29 | **The open incident is persisted** (zustand `persist` + AsyncStorage, key `guardova-emergency`). On launch: active → reopen Emergency Active and re-send undelivered alerts; countdown with time left → resume it; **countdown that ran out while the app was closed → raise the emergency** | Restore after a crash or close. The user pressed SOS and never cancelled, so failing safe means sending. Revisit if false alarms turn out to be a problem |
| 2026-10-29 | **Cancelled SOS is recorded** (incident with status `cancelled` and its events) and never creates deliveries | Requirement: cancel sends nothing and records the cancellation. Later feeds `incidents` + `incident_events` |
| 2026-10-29 | **Alerts go through one seam**, `guardova/src/data/alerts.ts`, with the incident id as idempotency key. Undelivered alerts retry with backoff (2 s doubling, capped at 60 s) for as long as the emergency is active, with at most one request in flight per member | “Never silently fail”, “don’t alert people twice”. The demo implementation delivers at once; the Supabase Edge Function drops in behind the same functions |
| 2026-10-29 | **Wearable presses arrive as events** (`features/sos/wearable.ts`). The demo simulator (Home wearable face, “Simulate wearable button press”) emits the same event the BLE layer will. A press during an open incident never starts a second one | One path for every SOS source |
| 2026-10-29 | **Every step is logged** (`[SOS] <time> <incident> <event>`) and stored on the incident: pressed, countdown_started, cancelled, activated (timer / immediate / restored), alert_sent, alert_delivered, alert_failed, responding, call_emergency_services, restored, ended, end_notified | SOS-FLOW “log every step”. These map 1:1 to `incident_events` |
| 2026-10-27 | Backend is **Supabase** | Managed auth, database, security rules, realtime and functions; fewer moving parts for the team |
| 2026-10-26 | Mobile app is **React Native (Expo)**, UI identical to the Figma design (`design/`) | One codebase for iOS + Android; the design package was verified in a full React Native build |
