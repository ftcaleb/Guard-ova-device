# Screen reference index

Every screen and state of the Figma Make design, rendered from the exact prototype code at **iPhone 402 × 874 pt @3x (1206 × 2622 px)**.

- `NN-name.png`: exactly what the phone shows at the top of the screen (scroll position 0), including the fixed tab bar.
- `NN-name--full.png`: the whole scrollable screen in one image (the fixed tab bar appears at the very bottom).
- Screens have **no status bar**; in the app, content starts below the safe-area inset (see DESIGN-SPEC §15.5).
- Each screenshot has a matching `design/layout/<name>.json` with the exact computed position and style of every element.
- Demo data: user Siyabonga Nkosi (SN); members Mom, Thabo, Kabelo, Lerato (Away).

To re-render any state yourself: run the reference prototype (`design/reference-prototype`, `npm i && npm run dev`) and `node design/tools/capture-reference.cjs` (Playwright).

## Onboarding

| Screenshot | State | Full-length |
|---|---|---|
| [`01-welcome-step1.png`](screens/01-welcome-step1.png) | Welcome / onboarding, step 1 of 3 (wearable) | — (fits on one screen / overlay) |
| [`02-welcome-step2.png`](screens/02-welcome-step2.png) | Welcome / onboarding, step 2 of 3 (network ring) | — (fits on one screen / overlay) |
| [`03-welcome-step3.png`](screens/03-welcome-step3.png) | Welcome / onboarding, step 3 of 3 (shield) – button reads "Enter my safety space" | — (fits on one screen / overlay) |

## Home

| Screenshot | State | Full-length |
|---|---|---|
| [`10-home.png`](screens/10-home.png) | Home / Overview – default state (safe, device connected, 4/5 network) | [`10-home--full.png`](screens/10-home--full.png) |

## My Device

| Screenshot | State | Full-length |
|---|---|---|
| [`20-device-connected.png`](screens/20-device-connected.png) | My Device – Connected (normal) | [`20-device-connected--full.png`](screens/20-device-connected--full.png) |
| [`21-device-disconnected.png`](screens/21-device-disconnected.png) | My Device – "Disconnected" warning state (amber pill + warning box + changed values) | [`21-device-disconnected--full.png`](screens/21-device-disconnected--full.png) |
| [`21-device-gps-unavailable.png`](screens/21-device-gps-unavailable.png) | My Device – "GPS unavailable" warning state (amber pill + warning box + changed values) | [`21-device-gps-unavailable--full.png`](screens/21-device-gps-unavailable--full.png) |
| [`21-device-low-battery.png`](screens/21-device-low-battery.png) | My Device – "Low battery" warning state (amber pill + warning box + changed values) | [`21-device-low-battery--full.png`](screens/21-device-low-battery--full.png) |
| [`22-home-device-disconnected.png`](screens/22-home-device-disconnected.png) | Home – device card in "Disconnected" state | [`22-home-device-disconnected--full.png`](screens/22-home-device-disconnected--full.png) |
| [`22-home-device-gps-unavailable.png`](screens/22-home-device-gps-unavailable.png) | Home – device card in "GPS unavailable" state | [`22-home-device-gps-unavailable--full.png`](screens/22-home-device-gps-unavailable--full.png) |
| [`22-home-device-low-battery.png`](screens/22-home-device-low-battery.png) | Home – device card in "Low battery" state | [`22-home-device-low-battery--full.png`](screens/22-home-device-low-battery--full.png) |
| [`23-device-toast-test-passed.png`](screens/23-device-toast-test-passed.png) | My Device – toast after "Test device" | — (fits on one screen / overlay) |
| [`24-modal-device-preferences.png`](screens/24-modal-device-preferences.png) | Modal – Device preferences | — (fits on one screen / overlay) |

## My Network & profiles

| Screenshot | State | Full-length |
|---|---|---|
| [`30-network.png`](screens/30-network.png) | My Network – 4/5 members, Add member tile | [`30-network--full.png`](screens/30-network--full.png) |
| [`31-profile-mom-online.png`](screens/31-profile-mom-online.png) | Member profile – Mom (Online) | [`31-profile-mom-online--full.png`](screens/31-profile-mom-online--full.png) |
| [`32-profile-lerato-away.png`](screens/32-profile-lerato-away.png) | Member profile – Lerato (Away, amber pill) | [`32-profile-lerato-away--full.png`](screens/32-profile-lerato-away--full.png) |
| [`33-modal-call-member.png`](screens/33-modal-call-member.png) | Modal – Call member (demo) | — (fits on one screen / overlay) |
| [`34-modal-invite-empty.png`](screens/34-modal-invite-empty.png) | Modal – Invite a trusted person (empty form) | — (fits on one screen / overlay) |
| [`35-modal-invite-filled.png`](screens/35-modal-invite-filled.png) | Modal – Invite form filled in (focus ring on input) | — (fits on one screen / overlay) |
| [`35b-modal-invite-validation-bug.png`](screens/35b-modal-invite-validation-bug.png) | PROTOTYPE BUG – name field pattern rejects every name, so the form never submits. Do NOT replicate (see README) | — (fits on one screen / overlay) |
| [`36-network-full-5of5.png`](screens/36-network-full-5of5.png) | My Network – 5/5 after invite (intended behaviour: no Add tile, new "Invited" member) + toast | [`36-network-full-5of5--full.png`](screens/36-network-full-5of5--full.png) |
| [`37-profile-invited.png`](screens/37-profile-invited.png) | Member profile – invited member ("Invitation pending") | [`37-profile-invited--full.png`](screens/37-profile-invited--full.png) |
| [`38-home-network-5of5.png`](screens/38-home-network-5of5.png) | Home – network card at 5/5 | [`38-home-network-5of5--full.png`](screens/38-home-network-5of5--full.png) |

## Live Map

| Screenshot | State | Full-length |
|---|---|---|
| [`40-live-map.png`](screens/40-live-map.png) | Live Map – normal (member markers + member list) | [`40-live-map--full.png`](screens/40-live-map--full.png) |

## SOS & countdown

| Screenshot | State | Full-length |
|---|---|---|
| [`50-sos-activation.png`](screens/50-sos-activation.png) | SOS Activation (before countdown) | [`50-sos-activation--full.png`](screens/50-sos-activation--full.png) |
| [`51-sos-countdown-5.png`](screens/51-sos-countdown-5.png) | SOS Countdown – 5 seconds (orb pulses) | — (fits on one screen / overlay) |
| [`52-sos-countdown-3.png`](screens/52-sos-countdown-3.png) | SOS Countdown – 3 seconds | — (fits on one screen / overlay) |
| [`53-home-toast-sos-cancelled.png`](screens/53-home-toast-sos-cancelled.png) | Home – toast after cancelling SOS | — (fits on one screen / overlay) |
| [`54-countdown-from-wearable.png`](screens/54-countdown-from-wearable.png) | SOS Countdown triggered from the wearable (same screen) | — (fits on one screen / overlay) |
| [`55-emergency-active.png`](screens/55-emergency-active.png) | Emergency Active – alerts delivered | [`55-emergency-active--full.png`](screens/55-emergency-active--full.png) |
| [`56-modal-call-emergency.png`](screens/56-modal-call-emergency.png) | Modal – Call emergency services (112 note) | — (fits on one screen / overlay) |
| [`57-member-alert.png`](screens/57-member-alert.png) | Member Alert – what Mom sees ("I’m responding" not yet tapped) | [`57-member-alert--full.png`](screens/57-member-alert--full.png) |
| [`58-modal-call-siyabonga.png`](screens/58-modal-call-siyabonga.png) | Modal – Call Siyabonga | — (fits on one screen / overlay) |
| [`59-member-alert-responding.png`](screens/59-member-alert-responding.png) | Member Alert – after "I’m responding" (green button + toast) | [`59-member-alert-responding--full.png`](screens/59-member-alert-responding--full.png) |

## Emergency, member alert & emergency side-effects

| Screenshot | State | Full-length |
|---|---|---|
| [`60-emergency-someone-responding.png`](screens/60-emergency-someone-responding.png) | Emergency Active – Mom shows "Responding · On their way" | [`60-emergency-someone-responding--full.png`](screens/60-emergency-someone-responding--full.png) |
| [`61-home-emergency.png`](screens/61-home-emergency.png) | Home – during an active emergency (rose safety card) | [`61-home-emergency--full.png`](screens/61-home-emergency--full.png) |
| [`62-live-map-emergency.png`](screens/62-live-map-emergency.png) | Live Map – during an emergency (red marker, emergency copy) | [`62-live-map-emergency--full.png`](screens/62-live-map-emergency--full.png) |
| [`63-modal-notifications-emergency.png`](screens/63-modal-notifications-emergency.png) | Modal – Notifications during emergency ("View active emergency") | — (fits on one screen / overlay) |
| [`64-modal-end-emergency.png`](screens/64-modal-end-emergency.png) | Modal – Are you safe now? | — (fits on one screen / overlay) |
| [`65-home-toast-emergency-ended.png`](screens/65-home-toast-emergency-ended.png) | Home – back to safe + toast "Emergency ended…" | — (fits on one screen / overlay) |

## Incident History

| Screenshot | State | Full-length |
|---|---|---|
| [`70-history-empty.png`](screens/70-history-empty.png) | Incident History – empty state (no mobile tab; reached from desktop sidebar) | — (fits on one screen / overlay) |
| [`71-history-with-incident.png`](screens/71-history-with-incident.png) | Incident History – with one resolved incident | — (fits on one screen / overlay) |

## Settings

| Screenshot | State | Full-length |
|---|---|---|
| [`80-settings.png`](screens/80-settings.png) | Settings – both toggles on | [`80-settings--full.png`](screens/80-settings--full.png) |
| [`81-settings-toggle-off.png`](screens/81-settings-toggle-off.png) | Settings – "Share my location" toggled off | [`81-settings-toggle-off--full.png`](screens/81-settings-toggle-off--full.png) |
| [`82-modal-remove-member.png`](screens/82-modal-remove-member.png) | Modal – Remove member (Thabo) | — (fits on one screen / overlay) |
| [`83-settings-member-removed.png`](screens/83-settings-member-removed.png) | Settings – after removing a member (3/5) + toast | [`83-settings-member-removed--full.png`](screens/83-settings-member-removed--full.png) |

## Other modals

| Screenshot | State | Full-length |
|---|---|---|
| [`90-modal-notifications.png`](screens/90-modal-notifications.png) | Modal – Notifications (normal) | — (fits on one screen / overlay) |

## Illustration assets

Transparent PNG renders of the CSS wearable illustration at the three sizes used (each at @1x, @2x, @3x) in `design/assets/`:

| File | Used on | @1x size (pt) |
|---|---|---|
| `wearable-home-card` | Home → My Guard’Ova card | 153 × 164 (the 145 × 155 scene scaled 1.05, centred in its slot) |
| `wearable-device-screen` | My Device product card | 280 × 261 |
| `wearable-welcome` | Welcome step 1 visual area | 300 × 266 (whole visual area) |
