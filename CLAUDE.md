# Guard’Ova: notes for AI coding agents

Guard’Ova is a personal-safety app: a wearable panic button, a React Native (Expo) app, a Supabase backend, and up to 5 trusted people who get alerted with the user’s live location. Start with `README.md`.

## Two kinds of work, two styles

### 1. UI work: strict
The visual design is final. The UI must be **visually identical** to the reference, screen for screen. Read `design/HOW-TO-MATCH-THE-DESIGN.md` before writing UI code.

Source of truth, highest first:
1. `design/reference-prototype/src/` (exact Figma Make code)
2. `design/layout/<state>.json` (computed position and style of every element)
3. `design/screens/<state>.png` (1206 × 2622 = iPhone 402 × 874 pt @3x)
4. `design/DESIGN-SPEC.md` (§15 = React Native translation rules, §16 = prototype bugs to fix, not copy)

Non-negotiables:
- Copy exactly from `App.tsx` (’ — · included). Don’t retype it.
- Fonts: only the static files in `design/fonts/static/`. DM Sans by weight only (optical size 14 is baked in), Manrope by weight. Never set `fontWeight` with them, and no system-font fallback.
- Every text style sets fontSize + an absolute lineHeight (default 1.5 × size) + letterSpacing + color. Android: `includeFontPadding: false`.
- Colours, spacing, radii and shadows come from theme tokens traced to the reference. Borders are 1 px.
- Icons are the 19 SVG paths in DESIGN-SPEC §6. No icon libraries, no UI kits, no NativeWind.
- Top bar and tab bar on every screen. The only intended deviation is safe-area insets.
- Don’t “improve” the design. Questions go in `design/OPEN-DECISIONS.md` and get asked.
- Text must wrap at the same words as the reference. If it doesn’t, fix the cause; never add manual line breaks.
- Don’t modify `design/` (except adding questions to `OPEN-DECISIONS.md`).

Done for a screen state = built from `design/layout/<state>.json`, then a screenshot at 402 × 874 compared side by side with `design/screens/<state>.png` with every difference fixed.

### 2. Architecture / backend work: guided, not strict
For Supabase, the SOS flow, data, Bluetooth, location and notifications, start with `docs/architecture/README.md`. Those docs are a **map with starting points**, not rules: use judgement, propose options, and record decisions in `docs/architecture/OPEN-QUESTIONS.md` → Decisions log.

Always:
- Row Level Security on for every Supabase table. Never put the `service_role` key in the app or in git.
- Treat the SOS / alert path as safety-critical: no silent failures, safe to retry, log every step.
