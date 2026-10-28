# SOS flow: the heart of the product

Everything else in Guard’Ova exists to make this flow reliable. If you only deeply understand one doc, make it this one.

## The happy path
```
 1. Wearable button pressed      → BLE message to the phone app
 2. App shows the countdown (5 s) → user can cancel ("I'm safe") → nothing is sent
 3. Countdown ends               → app creates an EMERGENCY (incident) in Supabase
 4. App starts sending location   → every few seconds, while the emergency is active
 5. Backend alerts the network    → urgent push notification to each member
 6. Members open the alert        → see live location, can call, tap "I'm responding"
 7. Wearer sees who's responding  → "Responding · On their way"
 8. Wearer ends the emergency     → "Are you safe now?" → incident closed, network told, saved to history
```
Each step already has a designed screen (SOS, Countdown, Emergency Active, Member Alert, Incident History); see `design/SCREENS.md`.

## What can go wrong (and ideas to explore)
| Situation | Why it matters | Ideas to explore |
|---|---|---|
| Phone has **no signal** when the countdown ends | The emergency never reaches the backend | Save it on the phone and retry when the signal returns; tell the user clearly it’s still trying |
| **Push notification doesn’t arrive** (phone off, app removed, notifications blocked) | A member never hears about it | Track delivery per member; if there’s no confirmation within ~30 s, send an **SMS** fallback |
| Member’s phone is **locked / on silent** | The alert is missed | iOS **Critical Alerts** (needs Apple approval) and Android high-priority / full-screen notifications |
| **Accidental press** | False alarms erode trust | The countdown + cancel exists for this; maybe a press pattern on the wearable later |
| **GPS lost** (indoors) | Members can’t find the person | Send the last known location, with its age (“updated 3 min ago”), and the accuracy |
| **Wearable disconnected** or flat battery | The button press never reaches the phone | Show the device status in the app (already designed: Disconnected / Low battery states); warn early |
| **App killed** by the OS in the background | No BLE, no location | Background modes / foreground service; test on real phones (Samsung and Huawei are aggressive) |
| Emergency **never ended** (user forgets) | Location keeps being shared | Maybe an auto-check after X hours (“Are you still in danger?”) |

## Watch out for
- **Never silently fail.** If something didn’t send, the wearer should know, and the system should keep retrying.
- **Make it safe to retry.** Steps should be safe to run twice. Retrying “create emergency” must not create two emergencies or alert people twice (look up *idempotency keys*).
- **Log every step of every incident** (pressed, created, alerted, delivered, opened, responding, ended). When something goes wrong in real life you’ll need to know exactly where.
- **Test on real, locked phones.** Simulators lie about background behaviour.

## Good starting points
1. **Spike first.** Before building the whole flow, prove on real iPhone and Android devices that (a) an urgent push reaches a locked, silenced phone, and (b) the app keeps location and BLE alive in the background. The technical brief calls this Phase 0.
2. Model the incident as a **state machine** (`countdown → active → resolved / cancelled`) on both the phone and the backend.
3. Build the happy path end to end with Supabase (create incident → alert members → member responds) before adding the failure handling.
4. Write a simple script or test that runs the whole flow, so you can re-run it after every change.
