# How to match the design exactly

This is the method that produced a React Native build visually identical to the Figma design, plus everything learned along the way. Read it before writing UI code.

## 1. What you have

| File / folder | Use it for |
|---|---|
| `reference-prototype/src/App.tsx` + `index.css` | **The source of truth.** The exact code exported from Figma Make. Copy text from here; read any CSS value here |
| `layout/<state>.json` | **Exact numbers:** x / y / width / height and computed style (font, colour, border, radius, shadow, padding, gap) of every element, for each of the 47 states |
| `screens/<state>.png` (+ `--full.png`) | **What it must look like:** 1206 × 2622 px = iPhone 402 × 874 pt @3x, no status bar |
| `SCREENS.md` | Index of the 47 states and what each one shows |
| `DESIGN-SPEC.md` | The readable spec: tokens, type, components, screens, flows, React Native translation (§15), known prototype bugs (§16) |
| `fonts/static/` | **Ready-to-use font files** (15 TTFs + `font-map.json`). No need to run the font script |
| `assets/` | The wearable illustration as transparent PNGs (@1x/@2x/@3x) |
| `OPEN-DECISIONS.md` | Every design decision already made (all: “exactly as Figma”) |

## 2. The method (for every screen state)

1. **Build from numbers, never from the picture.** Open `layout/<state>.json` and take every position, size, padding, gap, radius, colour and font value from it. If something isn’t there, read `index.css`. Never estimate from the image.
2. **Screenshot your app** in the same state at **402 × 874** (Expo web in a 402 × 874 browser window, an iPhone 16 Pro simulator, or an Android emulator with 1206 × 2622 px @ 480 dpi).
3. **Compare side by side** with `screens/<state>.png` (and `--full` below the fold). Go top to bottom: spacing, alignment, **line breaks**, font weight and size, colours, borders, radii, shadows, icons, copy. Write down each difference, fix it, look again.
4. **Done** when there’s no visible difference except the safe-area inset, for every state of that screen in `SCREENS.md`.

**Tip:** build the shared pieces first (theme tokens → `Text` → buttons, pills, avatars, cards → top bar, tab bar, toast, modal sheet), measuring each against an element in `layout/*.json`. After that, screens go quickly.

## 3. Rules that keep it identical

- **Copy:** exact, character for character, from `App.tsx`, including ’ — · and the blue “.” after “Siyabonga”. Copy it, don’t retype. A script that checks every string in your app against `App.tsx` is worth writing.
- **Fonts:** only `fonts/static/*`. Pick the family by weight (`DMSans-550`, `Manrope-750`). **Never** also set `fontWeight` (Android fakes bold).
- **Every text style** sets `fontSize`, absolute `lineHeight`, `letterSpacing`, `color`. Android: `includeFontPadding: false`.
- **Colours / sizes:** from theme tokens only, every token traceable to a value in `layout/*.json`. 1 CSS px = 1 dp/pt. Borders are exactly 1 px (not hairline).
- **Icons:** the 19 SVG paths in DESIGN-SPEC §6, stroke 1.65, round caps and joins. No icon library.
- **Top bar + tab bar on every screen,** including SOS, Emergency, Member Alert and Welcome.
- **No screen transitions;** scroll to the top on every screen change (that’s what the prototype does).
- **Don’t improve the design:** no extra padding, bigger tap targets, new animations or reordering. Ask instead.

## 4. Lessons learned (these will save you hours)

| Gotcha | What to do |
|---|---|
| **DM Sans optical size** | Google Fonts serves DM Sans pinned at **optical size 14**, so the reference renders every DM Sans string at opsz 14 regardless of size. The files in `fonts/static/` are already opsz 14 (decision D11). |
| **Line height** | Tailwind’s base styles in the prototype set **line-height 1.5 everywhere**, not the browser default. Unless a rule says otherwise, line height = 1.5 × font size. |
| **Two breakpoints at once** | At 402 pt wide, both `max-width:1200px` and `max-width:760px` CSS rules apply, so values are overridden twice. Don’t resolve the cascade by hand; the numbers in `layout/*.json` are already final. |
| **Avatar gradient** | CSS 145° on a square = `start {x:0.101, y:-0.070}` → `end {x:0.899, y:1.070}` (the CSS gradient line is 1.39× the box). |
| **Inline titles sit ~1 pt lower** | Some titles (toggle rows, notifications, history rows) are inline text inside a bigger text block; the browser puts them on that block’s baseline. Reproduce that offset, or they’ll look 1 pt high. |
| **“←” in “Back to My Network”** | It’s a fallback-font glyph in the reference. Draw it as a tiny SVG to match. |
| **Blur** | `expo-blur` on web adds saturation and tint, so on web use the exact CSS (`blur(15px)` over `#FFFFFFED`). On Android, `expo-blur` needs its newer blur method/target setup to blur at all. Check it. |
| **Status bar** | The reference has no status bar. Put content below the safe-area inset; the strip above the top bar is **white**, with dark status-bar icons. |
| **Reference capture quirks, don’t copy** | `35`: browser focus ring on the phone field (no focus rings on touch). `81`: off toggle 2 % darker (mouse hover during capture). `51/52/54`: SOS orb halos caught mid-pulse. Map labels: the reference falls back to a system font where the design intends **Inter** (use `Inter-400`). |
| **Prototype bugs, fix don’t copy** | DESIGN-SPEC §16 and OPEN-DECISIONS D15–D19: the invite form never submits (bad regex); “1 spot available” plural; vibration toggle sharing state with notifications; “Responding” always marking the first member; history using the current member count. |
| **Windows + Android builds** | Native builds fail if the project path is long (Windows’ 260-character limit). Keep the project at a short path like `C:\dev\guardova`. |
| **Tab bar placement** | With expo-router, render the tab bar once in the root layout, not only in the `(tabs)` layout, because it must also show on non-tab screens. |
| **Demo-only controls** | “Simulate wearable button press”, “Preview device states”, member-alert preview and “Demonstrate call” are in the design. Build them behind a `DEMO_MODE` flag. |

## 5. A stack that worked
Expo SDK 58 · React Native 0.88 · expo-router · react-native-svg · expo-linear-gradient · expo-blur · expo-font + expo-splash-screen (fonts load before first paint) · react-native-reanimated (orb pulse, toast, toggle) · react-native-safe-area-context · zustand (one store mirroring the prototype’s state, seeded with the demo people). Plain `StyleSheet` + typed tokens. No UI kit.

## 6. Starter prompt for an AI coding agent

```
You're building the Guard'Ova mobile UI in React Native (Expo, TypeScript, expo-router) so it is
visually identical to the design in design/. UI only, on local demo data. No backend yet.

Read first: CLAUDE.md, design/HOW-TO-MATCH-THE-DESIGN.md, design/DESIGN-SPEC.md (esp. §15–16),
design/reference-prototype/src/App.tsx + index.css, design/SCREENS.md, design/OPEN-DECISIONS.md.
Then reply with a short summary of the screens, any questions, and your plan, and wait for my go.

Order: theme tokens + fonts (design/fonts/static) → Text primitive → primitives (measure each against
design/layout/*.json) → shell (top bar, tab bar, toast, modal) → screens in this order: Home, My Device,
My Network, Member Profile, Live Map, SOS, Countdown, Emergency, Member Alert, History, Settings, Welcome
→ modals, toasts and all flows (DESIGN-SPEC §11.2).

For every state: build from design/layout/<state>.json → screenshot at 402×874 → compare side by side
with design/screens/<state>.png → fix every difference. Commit per screen. Stop and show me after the
shell and after Home.
```
