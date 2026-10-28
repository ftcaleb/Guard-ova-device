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
| 2026-10-27 | Backend is **Supabase** | Managed auth, database, security rules, realtime and functions; fewer moving parts for the team |
| 2026-10-26 | Mobile app is **React Native (Expo)**, UI identical to the Figma design (`design/`) | One codebase for iOS + Android; the design package was verified in a full React Native build |
