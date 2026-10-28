# Decisions

**Product owner decision (26 Oct 2026): build everything exactly as it is in the Figma design. No functionality is added in this phase.** The Technical Brief v0.2 does not override the design for this UI build. Prototype logic is fixed only where it is a bug or invisible in the design (DESIGN-SPEC §16 and D15–D19 below).

| # | Topic | Decision |
|---|---|---|
| D1 | SOS countdown length | **5 seconds**, as in Figma, from the constant `SOS_COUNTDOWN_SECONDS` |
| D2 | Colours and fonts | **Figma values**: `#235BE5` / `#248463` / `#DF4E50`, DM Sans + Manrope. Brief palette not used |
| D3 | Emergency visual style | **Figma**: soft rose header + white cards. No full red takeover |
| D4 | Bottom tabs | **Figma**: Home · Device · Network · Map · Settings |
| D5 | Small text (6–9 pt) and tap-target sizes | **Exactly as Figma**. No accessibility resizing in this phase |
| D6 | Incident History on mobile | **Exactly as Figma**: screen built, no mobile entry point added (route `/history` only) |
| D7 | Demo-only controls | **Shown exactly as Figma**, behind `DEMO_MODE = true` |
| D8 | Phone status bar / notch | Content starts below the safe-area inset; everything else identical (technical necessity only) |
| D9 | Greeting | **"Good morning, Siyabonga."** always, as in Figma |
| D10 | Backend, hosting, POPIA, BLE, real alerts | **Out of scope** for this UI build; local demo data only |

## Decided during Phase 0 review

Decided by the product designer on 26 Oct 2026 (Phase 0 go). Guiding rule: the screens must look exactly like Figma; no new features. Prototype logic is fixed only where it is a bug or invisible in the design.

| # | Question | Decision |
|---|---|---|
| D11 | DM Sans optical size | The reference renders DM Sans at **opsz 14 at every size** (Google Fonts serves an opsz-pinned file; verified by glyph advances). Always use DM Sans at opsz 14. Font rule updated in `CLAUDE.md`, `DESIGN-SPEC.md` §15.1 and `fonts/make-static-fonts.py` (files are now `DMSans-<weight>`). |
| D12 | Incident date / reproducible `71` | No longer needed: the pixel-diff process was dropped (26 Oct 2026). The app shows the real incident date, formatted as in the prototype. |
| D13 | Focus ring in `35-modal-invite-filled` | No focus ring in the app (touch device). Ignore the ring when comparing `35`. |
| D14 | “Preview device states” control | The closed state must look exactly like the screenshot. When tapped, use the native picker (iOS action sheet / Android dropdown). |
| D15 | “Wearable vibration” shares state with “Safety notifications” | Bug. Own state `wearableVibration`, default on. Visually unchanged. |
| D16 | Who is marked “Responding” | Bug. Mark the member the alert is viewed as (Mom in the reference, so screenshots are unchanged). |
| D17 | Singular/plural copy | Pluralise correctly (“1 second”, “1 trusted person”, “1 member”), same approach as §16 #3. Keep “Your My Network has been notified.” exactly (“My Network” is the feature name). |
| D18 | Orb pulse | No longer needed: the pixel-diff process was dropped. The app animates exactly as the CSS. |
| D19 | Incident “N members notified” | Bug. Store the member count on each incident when it is saved. |
| D20 | Android back button (outside modals) | Decided 26–27 Oct 2026 (overnight brief): Back closes an open modal first; otherwise it goes to the previous screen; on Home with nothing to go back to, it leaves the app. Invisible in the design. |
| D21 | Android package ID | Keep `com.ftcaleb.guardova` for internal builds; decide before any store release. |
| D22 | Windows path limit for native builds | Option 1: the project moves to `C:\dev\guardova` (done by the designer). No Android builds until then. |

## New questions

Decided on the designer's behalf during the overnight build (27 Oct 2026). Each can be changed.

| # | Question | Chosen | Why |
|---|---|---|---|
| N1 | D14 on Android: React Native core has no native dropdown (Spinner); `@react-native-picker/picker` is outside the decided stack | Web: the real `<select>` (pixel-identical). iOS: `ActionSheetIOS` with a “Cancel” row. Android: a minimal dropdown list in a core `Modal` (white card, 48 dp rows). The closed control looks like the screenshot on all platforms | Closest to “native picker” without adding a library. Approve `@react-native-picker/picker` if you want the true Android Spinner |
| N2 | “← Back to My Network”: Google's DM Sans subset has no “←” (U+2190), so the reference shows the browser's fallback-font arrow (small, thin, low); the app's full DM Sans file has its own, different “←” | The arrow is drawn as a tiny SVG matching the reference glyph (box measured to ±0.1 pt), followed by the DM Sans text | Matches the screenshot on every platform without embedding a system font. It is the only fallback glyph in the copy (’ — – · ° are all in the subset) |
| N3 | Live Map markers: the prototype hard-codes Mom, Thabo, Kabelo and Lerato on the large map, so a removed member would stay on the map and an invited one never appears | Markers are drawn for current members that have a demo position (the same four); removed members disappear; invited members (no location yet) have no marker | Identical in every screenshot; a removed person still on the map would be a bug. Invited people sharing no location matches “Invitation pending” |
| N4 | Invite form with an empty name or a phone under 8 characters: the design has no error state (the prototype relied on the browser's “Please fill out this field” bubble) | Sending does not add anyone; the first invalid field gets focus (as the browser does). No message is shown | Adds no new UI. If you want visible validation messages, they need a design |
