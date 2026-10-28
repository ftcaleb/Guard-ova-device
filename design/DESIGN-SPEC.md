# Guard'Ova Mobile App — Design Specification

> **Purpose:** a complete, build-ready description of the Guard'Ova mobile app design as it exists in the Figma Make file *"Guard'Ova Mobile App Design"* (chat: "Design My Network Feature"). Every colour, size and string below was taken from the file's own source (`src/App.tsx`, `src/index.css`), not estimated from screenshots. A developer or an AI coding tool should be able to rebuild the screens pixel-for-pixel from this document alone.
>
> **Target frame:** iPhone, **402 × 874 pt** (the Figma Make preview frame). All values in this document are the **mobile values** (the design's `max-width: 760px` breakpoint) unless marked *desktop*.
>
> **Captured:** 26 October 2026 · read-only capture, nothing in the Figma file was changed.
>
> **Source-of-truth order** (when two sources disagree, the higher one wins):
> 1. `design/reference-prototype/src/` — the exact code exported from Figma Make (verified character-for-character)
> 2. `design/screens/*.png` — 1206 × 2622 px (iPhone 402 × 874 pt @3x) renders of that code, every screen and state
> 3. `design/layout/*.json` — the browser's computed position, size and style for every element in every state (exact numbers, already resolved through all CSS breakpoints)
> 4. This document — a structured reading of the above, plus React Native guidance (sections 15–16)
>
> ⚠️ At 402 px wide, **two** CSS breakpoints apply at once (`max-width: 1200px` and then `max-width: 760px`), so some values in the raw CSS are overridden twice. If anything in this document disagrees with `layout/*.json`, the JSON is right.

---

## Contents

1. [Design principles](#1-design-principles)
2. [How the prototype is built](#2-how-the-prototype-is-built)
3. [Colour tokens](#3-colour-tokens)
4. [Typography](#4-typography)
5. [Shape, elevation, spacing & motion](#5-shape-elevation-spacing--motion)
6. [Iconography](#6-iconography)
7. [Core components](#7-core-components)
8. [App shell (mobile)](#8-app-shell-mobile)
9. [Screens](#9-screens)
10. [Modals & toasts](#10-modals--toasts)
11. [State, behaviour & demo data](#11-state-behaviour--demo-data)
12. [Illustrations (exact code)](#12-illustrations-exact-code)
13. [Differences from the Technical App Brief v0.2](#13-differences-from-the-technical-app-brief-v02)
14. [Rebuild checklist](#14-rebuild-checklist)
15. [React Native translation rules](#15-react-native-translation-rules)
16. [Known prototype bugs (do not replicate)](#16-known-prototype-bugs-do-not-replicate)

---

## 1. Design principles

- **Calm by default.** Soft off-white page, white cards with hairline borders, muted green for "safe". No heavy shadows.
- **Red only for emergencies.** Every red/rose tone is reserved for SOS, emergency and alert states.
- **One clear action per area.** Each card has at most one primary link or button.
- **Private, small circle.** "My Network" is capped at 5 people and is always described as private.
- **Honest prototype copy.** Demo-only actions say so ("Prototype only. No real alerts are sent.").
- **Never colour alone.** Every status pairs a colour with a dot/icon and a text label.

Voice: short, warm, reassuring sentences. Headlines usually end with a full stop ("You are safe.", "Make it yours.").

---

## 2. How the prototype is built

| Item | Value |
|---|---|
| Framework | React (single file `src/App.tsx`) + Vite |
| Styling | Plain CSS classes in `src/index.css`. Tailwind v4 is imported: no utility classes are used, **but its base styles apply** (line-height 1.5 everywhere, margins/paddings reset to 0, `button` background transparent, `img`/`svg` display block) |
| Fonts | Google Fonts: **DM Sans** 400/450/500/550/600/650/700 and **Manrope** 400/500/600/650/700/750/800 |
| Navigation | One `screen` state value; 12 screens; no router |
| Assets | `public/guardova-logo.png` (desktop sidebar only). All icons, the wearable and the map are drawn in code |
| Layout | Responsive: desktop sidebar layout above 760 px, mobile layout (top bar + bottom tab bar) at 760 px and below |

**Breakpoints**

| Breakpoint | Layout |
|---|---|
| ≥ 1500 px | Desktop, larger spacing |
| ≤ 1200 px | Desktop, narrower sidebar (205 px) |
| 761–1000 px | Tablet: sidebar 185 px, cards stack to one column |
| **≤ 760 px** | **Mobile (this spec)**: sidebar hidden, bottom tab bar shown |

---

## 3. Colour tokens

### 3.1 Core

| Token | Hex | Use |
|---|---|---|
| `--blue` (Primary) | `#235BE5` | Primary buttons, links, active tab, greeting full stop, toggle on |
| `--green` | `#248463` | Safe brand green (reference) |
| `--red` (Danger) | `#DF4E50` | `danger-button` fill and border |
| `--muted` | `#8A919B` | Generic muted text |
| `--border` | `#E9ECF0` | Card borders, dividers |
| Ink (text) | `#20292E` | Default text colour |
| Page background | `#F6F7F9` | App background |
| Surface | `#FFFFFF` | Cards, top bar, modal |
| Focus ring | `#9BB9FF` | 3 px outline, 4 px offset on `:focus-visible` |

### 3.2 Neutral text scale (light → dark)

| Hex | Where |
|---|---|
| `#B3BDCA` | Input placeholder |
| `#A9B2C0` | "/5" in count pill |
| `#A1AABA` | Inactive tab-bar item |
| `#A0A7B1` | Private note |
| `#A0A7B0` | Location footer sub-text |
| `#9BA4AF` | Recipient label, map footer sub-text |
| `#949CA6` | Device stat labels |
| `#939BA6` | Card description |
| `#939AA4` | Breadcrumb |
| `#929AA5` | Eyebrow |
| `#9198A3` | Page-heading paragraph |
| `#83909E` | Detail-row label |
| `#7D8695` | Bell icon |
| `#5D6B7E` | Secondary-button text |
| `#546775` | Detail-row value |
| `#4C5867` | Device stat values |
| `#49515E` | Breadcrumb current page |

### 3.3 Safe (green family)

| Hex | Use |
|---|---|
| `#E9F3EF` / `#DCEAE3` | Safety card background / border |
| `#DBE9E1` | Decorative rings in safety card |
| `#D6E5DC` | Safety card footer divider |
| `#D5E9DD` / `#C7DFD1` / `#338064` | Shield tile bg / border / icon |
| `#285E4C` | "You are safe." heading |
| `#7C9D8C` | Safety card body text |
| `#568372` | "YOUR SAFETY STATUS" label |
| `#8AA496` | "Updated just now" |
| `#69927E` | Safety footer location text |
| `#367456` | "View live location" link |
| `#30916E` | Small live dots |
| `#EDF6F0` / `#E3EFE7` / `#368064` | Status pill bg / border / text |
| `#41967D` | Avatar "online" dot |
| `#EAF5EE` / `#31845E` | Green heading-icon bg / icon |
| `#E6F5EB` / `#D4E7DB` / `#2C8157` | "You're responding" button bg / border / text |
| `#EDF7F0` / `#518D6D` | Permission check circle bg / icon |
| `#EDF5F0` / `#76A18C` | History empty-state icon bg / icon |
| `#5D977B` | Profile "Safe and connected" text |
| `#6F9B87` | Response-row check icon |
| `#283E38` / `#435950` / `#A1D7B9` / `#C2D5CD` | Toast bg / border / check icon / close icon |

### 3.4 Primary (blue family)

| Hex | Use |
|---|---|
| `#EDF2FF` | Blue heading-icon bg |
| `#DCE7FF` | (desktop) nav count bg |
| `#F7F9FF` / `#CAD7EF` / `#6488D5` / `#6585C2` / `#A9B3C6` | "Add member" tile bg / dashed border / plus icon / label / sub-label |
| `#4476ED` | Map "you" pulse fill |
| `#467BEE` at 8 % (`#467bee14`) and 4 % (`#467bee0b`) | Pulse halo rings |
| `#526B9E` | Map "YOU" label |
| `#EDF3FE` / `#F0F4FB` / `#5383E6` | Welcome shield circle / halo / icon |
| `#CEDAF1` | Onboarding dashed ring |
| `#DCE3EE` | Inactive onboarding dot |
| `#E9EEF8` / `#516586` | Top-bar avatar bg / initials |

### 3.5 Warning (amber family)

| Hex | Use |
|---|---|
| `#FFF6DF` / `#F5EBCA` / `#A08129` / `#D3AC4F` | Warning status pill bg / border / text / dot |
| `#FFF8E7` / `#F2E6C3` / `#A6863C` | Warning box bg / border / text |
| `#DFB554` | Avatar "away" dot |
| `#B8A57E` | "Away" text under avatar |

### 3.6 Emergency (red/rose family)

| Hex | Use |
|---|---|
| `#FCF5F3` / `#F2E6E2` | SOS banner bg / border |
| `#F9EAE6` / `#F4DFD9` / `#C27E74` | SOS banner icon tile bg / border / icon |
| `#765B56` / `#AC9290` | SOS banner heading / text |
| `#DD625E` / `#D66562` | "Activate SOS" banner button fill / border (shadow `0 3px 8px #dd625e1c`) |
| `#CB5C5F` / `#D35D60` | Emergency label text / dot |
| `#F7E4E4` / `#EDD5D5` / `#D65E62` | SOS orb fill / border / number & icon |
| `#F9EEEE` / `#FCF5F5` | SOS orb halo rings |
| `#FCEEEE` / `#F3DCDC` / `#BF565B` / `#B68488` | Emergency header bg / border / text / paragraph |
| `#CB7F83` / `#CA646A` / `#D65F69` | Emergency metric icon / value / dot |
| `#D86165` / `#B86566` | Emergency map pulse / label |
| `#F6E6E6` / `#A95B62` | Alert person circle bg / initials |
| `#F9EAEA` / `#C46065` | "Emergency Active" badge bg / text |
| `#FBECEC` / `#EFDBDB` / `#BD6265` / `#F4DEDE` / `#EED1D1` / `#BF6469` | Home safety card in emergency: bg / border / heading / shield bg / shield border / shield icon |

### 3.7 Avatar gradients (145°)

| Name | Gradient | Initials colour |
|---|---|---|
| `rose` | `#EFE5DE → #D3B7A3` | `#835F4D` |
| `blue` | `#E1E9F5 → #A3B8D5` | `#4C6488` |
| `sage` | `#E3E9DF → #AABDA4` | `#5C715A` |
| `purple` | `#EBE4F2 → #BEAAD1` | `#77628F` |

### 3.8 Map palette

Base `#EDECE7` (container `#ECECE5`), parks `#D8E7D4` / `#DCE9D7`, streets white 17 px with `#D8D8D2` 1 px centre line, main road `#F9F6E9` 26 px with `#E2D9BD` 2 px centre line, buildings `#D9DBD5`, suburb labels `#91998E`, street labels `#A7A79C`.

---

## 4. Typography

| Role | Font | Notes |
|---|---|---|
| Body, UI, numbers | **DM Sans** | Default for everything (`:root`) |
| Headings (`h1`, `h2`, `h3`), avatar initials, SOS countdown number, peace-card title | **Manrope** | |

`font-synthesis: none`. Inputs and buttons inherit the font.

### 4.1 Base heading styles

| Element | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| `h1` | 32 px | 750 | −1.15 px | 1.35 |
| `h2` | 17 px | 750 | −0.45 px | 1.5 (inherited) |
| `h3` | 15 px | 700 | — | 1.5 (inherited) |

### 4.2 Mobile type scale in use

| Style | Size / weight | Colour | Example |
|---|---|---|---|
| Page title (`.page-heading h1`) | 26 / 750, ls −1 px | Ink | "Good morning, Siyabonga." |
| Hero status (`.safety-body h2`) | 32 / 750, ls −1.2 px | `#285E4C` | "You are safe." |
| Focused title (SOS) | 28 / 750 | Ink | "You don't have to face it alone." |
| Emergency / alert / profile title | 27 / 750 | Ink or `#BF565B` | "You're not alone." |
| Welcome title | 30 / 750 | Ink | "Personal safety that moves with you." |
| Card title (`.card-heading h2`) | 15 / 750 | Ink | "My Guard'Ova" |
| Info-card title | 20 / 750 | Ink | "Closer, even from a distance." |
| Body | 12 / 400, lh 1.8–1.9 | `#9098A3`-ish | Info-card copy |
| Small body | 10–11 / 400, lh 1.7–1.85 | `#939BA6` | Card descriptions |
| Button | 12 / 550 | — | "Send invitation" |
| Link (`.text-button`) | 10 / 550 (9 px in card headers) | `#235BE5` | "View network →" |
| Eyebrow | 8 / 650, ls 1.5 px, UPPERCASE | `#929AA5` | "YOUR EVERYDAY PEACE OF MIND" |
| Status label | 8–9 / 650, ls 0.9–1.6 px, UPPERCASE | per state | "YOUR SAFETY STATUS" |
| Tab-bar label | 8 / 400 | `#A1AABA` / blue | "Home" |
| Micro | 6–7 px | muted | Map attribution, "1 spot available" |

---

## 5. Shape, elevation, spacing & motion

### 5.1 Radii

| Radius | Used on |
|---|---|
| 50 % | Avatars, dots, circle-arrow, SOS orb, toggle knob |
| 25 px | History empty-state icon |
| 21 px | Shield tile (mobile) |
| 18 px | Modal |
| 14 px | Cards, safety card, emergency header |
| 13 px | SOS banner |
| 11 px | SOS banner icon (mobile) |
| 10 px | Toast |
| 9 px | Alert map |
| 8 px | Buttons, heading icons, warning box, settings note |
| 7 px | Inputs |
| 5–6 px | Status pills, count pill, badges, select |
| 4 px | Map labels |
| 20 px | Toggle track |

### 5.2 Borders & elevation

- Cards: `1px solid #E9ECF0`, **no shadow**.
- Shield tile: `0 5px 15px #3a765008`.
- Map "you" pulse: `0 0 0 11px #467bee14, 0 0 0 25px #467bee0b` (large map: 25 px / 50 px).
- SOS orb: `0 0 0 18px #F9EEEE, 0 0 0 36px #FCF5F5`.
- Toast: `0 7px 25px #18372926`. Modal: `0 20px 100px #18263724`.
- Toggle knob: `0 1px 4px #00000015`.

### 5.3 Spacing (mobile)

- Screen padding: **28 px top, 21 px sides, 100 px bottom** (bottom clears the tab bar).
- Gap between stacked cards: **18 px** (and 23 px above `.two-col` groups).
- Card inner padding: 21–25 px (see each component).
- Divider rows: 15–22 px vertical padding with a 1 px `#E9ECF0` top or bottom border.

### 5.4 Motion

| Motion | Spec |
|---|---|
| Button hover | `filter: brightness(.98)` |
| Button press | `transform: translateY(1px)` |
| Button transition | `background .18s, transform .18s` |
| Toggle knob | `transform .2s`, moves 15 px |
| SOS orb pulse (countdown) | `orb-pulse` 1 s infinite: halo rings grow from 18/36 px to 24/46 px at 50 % |
| Toast entry | `toast-in` .2 s ease: fades in while rising. The keyframes animate `bottom` 15 → 28 px (desktop values), so on mobile the toast snaps to 90 px when the animation ends. To rebuild cleanly, animate 77 → 90 px on mobile. |
| Screen change | `window.scrollTo({ top: 0, behavior: 'smooth' })` |
| Reduced motion | All animations and transitions disabled under `prefers-reduced-motion: reduce` |

```css
@keyframes orb-pulse { 50% { box-shadow: 0 0 0 24px #f9eeee, 0 0 0 46px #fcf5f5 } }
@keyframes toast-in  { from { opacity: 0; bottom: 15px } to { opacity: 1; bottom: 28px } }
```

---

## 6. Iconography

All icons are inline SVG: `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, **`stroke-width="1.65"`**, round caps and joins, default size 20 px, `flex-shrink: 0`. Colour comes from the parent's `color`.

| Name | SVG content |
|---|---|
| home | `<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>` |
| shield | `<path d="M12 3 3.5 6v6c0 5 8.5 9 8.5 9s8.5-4 8.5-9V6Z"/><path d="m8 12 3 3 5-6"/>` |
| people | `<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5"/>` |
| pin | `<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>` |
| clock | `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>` |
| settings | `<path d="m9 3-1 3-3 1-2 3 2 2v4l3 1 1 4h6l1-4 3-1v-4l2-2-2-3-3-1-1-3Z"/><circle cx="12" cy="12" r="3"/>` |
| arrow | `<path d="M4 12h16m-6-6 6 6-6 6"/>` |
| chevron | `<path d="m9 5 7 7-7 7"/>` |
| bell | `<path d="M6 8a6 6 0 0 1 12 0v6l2 3H4l2-3Zm4 12h4"/>` |
| battery | `<rect x="2" y="6" width="17" height="12" rx="3"/><path d="M22 10v4M6 10v4m4-4v4m4-4v4"/>` |
| gps | `<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>` |
| wifi | `<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-11 4a6 6 0 0 1 8 0"/><circle cx="12" cy="20" r=".6"/>` |
| check | `<path d="m5 12 4 4L19 6"/>` |
| plus | `<path d="M12 5v14M5 12h14"/>` |
| phone | `<path d="m6 3 4 5-3 3a14 14 0 0 0 6 6l3-3 5 4c-1 5-5 5-8 3C7 18 3 14 2 8c-1-3 1-5 4-5Z"/>` |
| close | `<path d="m6 6 12 12M6 18 18 6"/>` |
| lock | `<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>` |
| activity | `<path d="M2 12h5l3-8 4 16 3-8h5"/>` |
| logout | `<path d="M10 4H4v16h6m4-12 4 4-4 4m-5-4h12"/>` |

The **activity** icon (a heartbeat line) is the SOS symbol throughout. The **shield-with-tick** is the brand/safety symbol.

---

## 7. Core components

### 7.1 Card

`background #FFF · border 1px #E9ECF0 · radius 14px · overflow hidden`. No shadow.

**Card heading row:** flex, `gap 10px`, vertically centred: optional heading icon → `h2` (flex 1, 15 px) → trailing status pill or text link.

### 7.2 Heading icon (square icon tile)

30 × 30 px, radius 8 px, icon 17 px wide. Variants:

| Variant | Background | Icon |
|---|---|---|
| `blue-icon` | `#EDF2FF` | `#235BE5` |
| `neutral-icon` | `#F3F5F7` | `#81909E` |
| `green-icon` | `#EAF5EE` | `#31845E` |

Larger uses: 40 × 40 (info cards, `margin-bottom 20px`), 43 × 43 (modals, `margin-bottom 19px`).

### 7.3 Status pill

Inline-flex, `gap 6px`, `padding 5px 8px`, radius 5 px, 9 px / 550, no wrap, leading 5 px dot.

| Variant | Background | Border | Text | Dot |
|---|---|---|---|---|
| Default (OK) | `#EDF6F0` | `#E3EFE7` | `#368064` | `#30916E` |
| Warning | `#FFF6DF` | `#F5EBCA` | `#A08129` | `#D3AC4F` |

Labels used: Connected, Disconnected, Low battery, GPS unavailable, Live, Online, Away, Invited, Resolved, Location sharing active, Emergency sharing active.

### 7.4 Count pill

Inline after a heading: "4/5". DM Sans 600 10 px, bg `#F2F4F8`, text `#5C6D81`, the "/5" part `#A9B2C0` weight 400, `padding 4px 7px`, radius 5, `margin-left 7px`.

### 7.5 Buttons

Shared base (`primary`, `secondary`, `danger`, `responding`): inline-flex, centred, `gap 10px`, radius 8 px, **12 px / 550**, `padding 14px 20px`, **min-height 44 px**. Icons sit before the label (arrows after). Add `.wide` for `width: 100%`.

| Variant | Fill | Border | Text |
|---|---|---|---|
| Primary | `#235BE5` | `#235BE5` | `#FFF` |
| Secondary | `#FFF` | `#DDE3EC` | `#5D6B7E` |
| Danger | `#DF4E50` | `#DF4E50` | `#FFF` |
| Responding (confirmed) | `#E6F5EB` | `#D4E7DB` | `#2C8157` |

**Text button (link):** no padding, blue `#235BE5`, 10 px / 550, `gap 9px`, usually with a trailing arrow (15–17 px).

**SOS banner button (home only):** full width, `padding 17px 22px`, 13 px / 550, fill `#DD625E`, border `#D66562`, radius 8, shadow `0 3px 8px #dd625e1c`; activity icon pinned left, arrow pinned right (`margin-right:auto` / `margin-left:auto`), label centred.

**Circle arrow:** 29 × 29 circle, 1 px `#E9ECF0` border, arrow 17 px `#778796`.

### 7.6 Avatar

- Size: **45 px** on dashboard cards, 48 px on the full network screen, 35 px `small` (2 px border), 30 px in map list, 60 px onboarding, 90 px profile.
- Circle with gradient (see 3.7), **3 px white border** plus `0 0 0 1px #EEE` outline ring.
- Initials in Manrope 650, 13 px (scales with size).
- Presence dot: 9 × 9 at bottom-right, 2 px white border; online `#41967D`, away `#DFB554`.

**Add-member tile avatar:** same size, `1px dashed #CAD7EF`, fill `#F7F9FF`, plus icon `#6488D5`. Label "Add member" `#6585C2`, sub-label "N spot available" 6 px `#A9B3C6`.

**Member tile:** column, avatar → name (9 px / 550, `margin-top 9px`, ellipsis) → status (8 px `#93A29B`, "Away" in `#B8A57E`).

### 7.7 Toggle switch

Track 37 × 22, radius 20, `padding 3px`, off `#DBE0E9`, on `#235BE5`. Knob 16 × 16 white circle, shadow `0 1px 4px #00000015`, moves `translateX(15px)` when on. `role="switch"` with `aria-checked`.

**Toggle row:** title 12 px / 550, description 9 px `#9CA5B2` lh 1.7; `padding 22px 0`, bottom divider.

### 7.8 Detail row

Icon (`#94A3B0`) · label (11 px `#83909E`) · value right-aligned (10 px / 550 `#546775`). `padding 22px 0`, `gap 10px`, bottom divider.

### 7.9 Simulation note

Centred, 10 px (9 px under focused layouts), `#A1A8B1`, lh 1.7, optional 13 px lock icon. Used for every "this is a prototype" line.

### 7.10 Live dot

6 × 6 px circle `#30916E` (red variant `#D35D60`), used before uppercase labels.

---

## 8. App shell (mobile)

```
┌──────────────────────────────────────┐  402 pt
│ My safety › Overview        🔔•  (SN)│  Top bar 66 px, white, bottom border
├──────────────────────────────────────┤
│                                      │
│  Screen content                      │  padding 28 / 21 / 100
│  (scrolls)                           │
│                                      │
├──────────────────────────────────────┤
│  ⌂      ◇       👥      ⌖      ⚙      │  Bottom tab bar, fixed, frosted
│ Home  Device Network   Map  Settings │
└──────────────────────────────────────┘
```

### 8.1 Top bar

- Height **66 px**, `padding 0 22px`, background `#FFF`, bottom border `1px #E9ECF0`.
- **Left — breadcrumb:** "My safety" (10 px `#939AA4`) · chevron 13 px `#BEC3CC` · current page title (10 px / 500 `#49515E`), `gap 9px`.
- **Right** (`gap 17px`):
  - Bell button: 20 px icon `#7D8695`, `padding 6px`; unread dot 5 × 5 blue with 1 px white border at `top 5px, right 6px`. Opens the notifications modal.
  - Avatar button: 31 × 31 circle, bg `#E9EEF8`, initials "SN" 10 px / 650 `#516586`. Opens Settings.
- Desktop-only "All systems operational" label is hidden on mobile.

**Page titles shown in the breadcrumb:** Overview · My Device · My Network (also on Member Profile) · Live Map · Emergency SOS (SOS and Countdown) · Emergency Active · Network Member View · Incident History · Settings · Welcome to Guard'Ova.

### 8.2 Bottom tab bar

- `position: fixed; bottom 0; left 0; right 0; z-index 40`.
- Background `#FFFFFFED` with `backdrop-filter: blur(15px)`, top border `1px #E8ECF3`.
- `display: flex; justify-content: space-around; padding: 12px 9px max(12px, env(safe-area-inset-bottom))`.
- Five items, each a column (`gap 5px`, `padding 2px 8px`): 21 px icon + 8 px label.
- Inactive `#A1AABA`; active `#235BE5`.

| Tab | Icon | Screen |
|---|---|---|
| Home | home | Overview |
| Device | shield | My Device |
| Network | people | My Network |
| Map | pin | Live Map |
| Settings | settings | Settings |

Only the exact matching screen highlights its tab (e.g. Member Profile does not highlight Network).

### 8.3 Page heading (used on most screens)

Eyebrow (8 px / 650, ls 1.5 px, UPPERCASE, `#929AA5`, `margin-bottom 10px`) → `h1` (26 px, ls −1 px) → paragraph (11 px, lh 1.8, `#9198A3`, `margin-top 9px`). Block `margin-bottom 25px`. An optional action button wraps below on mobile.

---

## 9. Screens

All screens below sit inside the app shell from section 8. Copy is exact. The design uses typographic apostrophes (’) and em dashes (—): use `’` wherever this document shows `'` in user-facing text (e.g. "We’ll", "Guard’Ova").

### 9.1 Home — Overview (default screen)

> 📸 Reference screenshots: `design/screens/` → 10-home, 22-home-device-*, 38-home-network-5of5, 61-home-emergency, 53/65 (toasts) (see `design/SCREENS.md`)

**Page heading**
- Eyebrow: `YOUR EVERYDAY PEACE OF MIND`
- Title: `Good morning, Siyabonga` + a blue `.`
- Text: `You go about your day. We'll look out for you.`

**A. Safety status card** (`safety-card`)
- bg `#E9F3EF`, border `#DCEAE3`, radius 14, `padding 21px 22px 0`, min-height 242 px, overflow hidden.
- Two decorative outline circles (1 px `#DBE9E1`) bleeding off the right edge: 360 px (`right −158px, top −22px`) and 290 px (`right −122px, top 12px`). Content sits above them (`z-index 1`).
- **Top row** (space-between): `● YOUR SAFETY STATUS` (8 px / 650, ls 0.9, `#568372`, green dot) · activity icon 14 px + `Updated just now` (8 px `#8AA496`).
- **Body** (`padding 33px 0`, `gap 20px`): shield tile 67 × 75, radius 21, bg `#D5E9DD`, border `#C7DFD1`, shield icon 40 px `#338064` → text block: `You are safe.` (32 px / 750, `#285E4C`) and `Connected. Protected. Free to be you.` (10 px, lh 1.7, max-width 200, `#7C9D8C`, `margin-top 9px`).
- **Footer** (top border `#D6E5DC`, `padding 18px 0`, 9 px): pin 16 px + `Rosebank, Johannesburg` (`#69927E`) · `View live location →` (600, `#367456`, gap 6) → Live Map.
- **Emergency variant** (when an emergency is active): bg `#FBECEC`, border `#EFDBDB`, heading `Emergency active` (30 px `#BD6265`), text `Your trusted network has been notified.`, shield tile `#F4DEDE`/`#EED1D1`/`#BF6469`, link `View emergency →` → Emergency Active.

**B. My Guard'Ova card** (`device-card`, `padding 21px 22px 0`)
- Heading: `My Guard'Ova` + status pill `Connected` (or the warning state name).
- Content row (min-height 167, centred, `gap 20px`): wearable illustration (145 × 155, scaled 1.05; see 12.1) → stats column (max-width 230, `gap 20px`):

| Icon (17 px, `#A1A8B0`) | Label (10 px `#949CA6`) | Value (11 px / 550 `#4C5867`, right) |
|---|---|---|
| battery | Battery | 87% (12% when "Low battery") |
| gps | GPS | Active (Unavailable when "GPS unavailable") |
| wifi | Connectivity | Online (Offline when "Disconnected") |

- Footer button (top divider, `padding 17px 0`, 9 px `#949DA7`): `Your wearable is looking out for you` + arrow 17 px `#5A6B7E` → My Device.
- Tapping the wearable face starts the SOS countdown.

**C. My Network card** (`network-card`, `padding 22px 20px 0`)
- Heading: blue people icon tile · `My Network` + count pill `4/5` · `View network →` (9 px).
- Description: `People you trust who can see your safety status and receive emergency alerts.` (10 px, lh 1.85, `#939BA6`, `margin-top 13px`).
- Member row (`padding 25px 0`, `gap 3px`, space-between): Mom · Thabo · Kabelo · Lerato (Away) · **Add member** tile (`1 spot available`). Tapping a member → Member Profile; tapping Add → Invite modal.
- Footer note (top divider, `padding 16px 0`, 8 px `#A0A7B1`): lock 14 px + `Your circle is private. Always.`

**D. Your location card** (`location-card`)
- Heading (`padding 20px`): neutral pin tile · `Your location` (14 px) · status pill `Live`.
- Map (full-bleed, **180 px** high, see 12.2) with a "YOU" marker; whole map is a button → Live Map.
- Footer (`padding 17px 20px`): `Rosebank, Johannesburg` (11 px / 550) / `Shared with your trusted network` (9 px `#A0A7B0`) · circle-arrow → Live Map.

**E. SOS banner** (`margin-top 20px`)
- bg `#FCF5F3`, border `#F2E6E2`, radius 13, `padding 22px`, wraps, `gap 15px`.
- Icon tile 43 × 43, radius 11, bg `#F9EAE6`, border `#F4DFD9`, activity icon 26 px `#C27E74`.
- Copy: `Help is always within reach.` (14 px, `#765B56`) / `Press your wearable or activate SOS here. Your network will be there.` (10 px, lh 1.8, `#AC9290`).
- Full-width banner button: `Activate SOS` (see 7.5) → SOS Activation.

**F. Footer line** (centred, 8 px `#A3AAB3`, `margin-top 24px`): lock 13 px + `Your safety. Your people. Your privacy.`

Card order on mobile: Safety → Device → Network → Location → SOS banner → footer.

---

### 9.2 My Device

> 📸 Reference screenshots: `design/screens/` → 20-device-connected, 21-device-disconnected / -low-battery / -gps-unavailable, 23 (toast), 24 (modal) (see `design/SCREENS.md`)

**Page heading:** `SMALL DEVICE. BIG PEACE OF MIND.` / `Your everyday guardian.` / `Everything you need to know about your Guard'Ova wearable.`

**A. Product card** (`device-product`, centred, `padding 28px 22px`)
- Status pill (`Connected` or warning state).
- Large wearable: scene 280 × 260, wearable `rotate(-19deg) scale(1.7)`, orbit rings 255 px and 205 px, shadow `bottom 53px; left 89px; width 126px`.
- `Guard'Ova Device` (h2 23 px) / `Guard'Ova One · Midnight` (12 px `#9BA3AF`).
- Serial: `DEVICE ID · GO–2849–SN` (8 px, ls 1.5, `#ADB5C0`, `margin 18px 0 25px`).
- Primary button: activity icon + `Simulate wearable button press` → countdown.
- Note: `Prototype only. No real alerts are sent.`

**B. Device health card** (`device-details`, `padding 24px`)
- `Device health` (h2 19 px).
- **Warning box** (only when not Connected): bg `#FFF8E7`, border `#F2E6C3`, radius 8, `padding 15px`, `margin-top 18px`, `#A6863C`; bold `Attention required` + 11 px text:
  - Disconnected → `Keep your wearable nearby and enable Bluetooth to reconnect.`
  - Low battery → `Charge your wearable soon to stay protected.`
  - GPS unavailable → `Move outdoors to restore your GPS signal.`
- Detail rows:

| Icon | Label | Value (normal) | Value (warning) |
|---|---|---|---|
| battery | Battery level | 87% · About 4 days left | 12% · Charge soon |
| gps | GPS | Active · Signal strong | Unavailable |
| shield | Device connection | Connected · Bluetooth | Disconnected |
| wifi | Cloud connection | Online | Offline |
| clock | Last synced | Just now | Just now |

- Secondary wide button `Test device ✓` (`margin-top 24px`) → toast: `Device test passed. Button, GPS, Bluetooth and cloud connection are working.` (or `Device test needs attention. Resolve the warning shown above.`).
- Text button `Device settings ⚙` (`padding 18px 0`) → Device preferences modal.
- **Demo state switcher** (top divider, `padding-top 18px`): label `Preview device states` (10 px `#9BA4AD`) + select (border `#DDE3EA`, radius 6, bg `#FAFBFC`, 10 px `#65738A`, `padding 7px`) with options **Connected · Disconnected · Low battery · GPS unavailable**.

---

### 9.3 My Network

> 📸 Reference screenshots: `design/screens/` → 30-network, 36-network-full-5of5 (see `design/SCREENS.md`)

**Page heading:** `YOUR PRIVATE SAFETY CIRCLE` / `My Network — 4/5` / `The people who have your back. Wherever life takes you.`

**A. Full network card** — same as the home network card with these changes: avatars 48 px (initials 14 px), names 10 px, status 8 px, description 11 px; header link reads `Manage network →` (→ Settings); footer note wraps and adds `View live map →` (8 px) → Live Map.

**B. Two info cards** (stacked, `gap 18px`, `margin-top 23px`), each `padding 25px`, 40 px heading-icon tile, h2 20 px, body 12 px lh 1.85 `#9098A3` (`margin 13px 0 23px`):

1. Blue pin tile · `Closer, even from a distance.` · `Your trusted people can see your shared location and safety status. In an emergency, they'll know exactly where to find you.` · Primary `Open network live map →`
2. Green lock tile · `Trust is the connection.` · `No followers. No public profiles. Just up to five people you choose, with permissions you control.` · Secondary `Manage sharing permissions →` (→ Settings)

---

### 9.4 Member Profile (example: Mom / Thabo)

> 📸 Reference screenshots: `design/screens/` → 31-profile-mom-online, 32-profile-lerato-away, 37-profile-invited, 33 (call modal) (see `design/SCREENS.md`)

- Back link: `← Back to My Network` (12 px `#8190A3`, `margin-bottom 23px`).

**A. Profile card** (centred, `padding 32px`)
- Avatar 90 px (initials 27 px), `margin-bottom 20px`.
- Name h1 27 px (e.g. `Thabo`).
- `{Relation} · Trusted network member` (12 px `#949EAA`, `margin 10px 0 15px`). Relations: Mom = Family, Thabo = Friend, Kabelo = Brother, Lerato = Friend.
- Status pill (`Online`, or warning style for `Away`).
- Safe row (top + bottom dividers, `padding 22px`, `margin-top 27px`, 12 px `#5D977B`): shield + `Safe and connected` (`Invitation pending` for invited members).
- Actions (column, `gap 12px`, `margin-top 25px`): Primary `📞 Call {Name}` → call modal · Secondary `📍 View location` → Live Map.

**B. Permissions card** (`info-card`)
- `A trusted connection` / `{Name} is part of your private safety circle and can support you when you need it most.`
- Four permission rows (12 px `#7E8A98`, `padding 12px 0`, `gap 13px`), each with a 26 px green check circle:
  - See your safety status
  - See your shared live location
  - Receive emergency notifications
  - Respond to your emergency
- Divider (`margin 21px 0`) → h3 `Explore the other side` → `See what your trusted person receives when you trigger an emergency.` → Secondary wide `Preview emergency alert →` → Member Alert.

---

### 9.5 Live Map

> 📸 Reference screenshots: `design/screens/` → 40-live-map, 62-live-map-emergency (see `design/SCREENS.md`)

**Page heading:** `CONNECTED, WHEREVER YOU ARE` / `Your people. In view.` / `A little reassurance, in real time. Only visible to your trusted circle.` + action Secondary `👥 My Network`.
During an emergency: `Your emergency. Live.` / `Your location is being shared with your entire trusted network.`

**A. Map card** (`full-map`)
- Large map **400 px** high. "YOU" marker at 47 % / 45 %, pulse 45 px with 25/50 px halos, label 10 px.
- Member markers (small avatar + name chip 8 px `#68768B` on `#FFFFFFDF`): Mom at (27 %, 32 %), Thabo (67 %, 26 %), Kabelo (63 %, 65 %), `Lerato · Away` (22 %, 68 %).
- Footer (`padding 18px`, `gap 10px`, wraps): blue pin tile · `Rosebank, Johannesburg` (11 px / 550) / `26.1467° S, 28.0436° E · Updated just now` (9 px) · status pill `Location sharing active` (`Emergency sharing active`) with `margin-left 40px`.

**B. Member list** — 2-column grid, `gap 10px`, `margin-top 22px`. Each is a card button (`padding 12px 10px`, `gap 8px`): 30 px avatar · name (10 px / 550) + `Live location available` or `Last seen 12 min ago` (Away) (7 px `#9AABB4`) · chevron 13 px `#A5AFBC`. → Member Profile.

**C. Note:** `Illustrative prototype map. Locations are simulated, not real GPS data.`

---

### 9.6 SOS Activation

> 📸 Reference screenshots: `design/screens/` → 50-sos-activation (see `design/SCREENS.md`)

Focused, centred layout (max-width 530, `margin 15px auto`), no cards:

1. Label: red dot + `EMERGENCY SOS · DEMO` (9 px / 650, ls 1.2, `#CB5C5F`).
2. **SOS orb:** 140 × 140 circle, bg `#F7E4E4`, border `#EDD5D5`, halos 18 px `#F9EEEE` and 36 px `#FCF5F5`, `margin 70px 0 58px`; activity icon 64 px `#D65E62`.
3. Title h1 28 px (max-width 350): `You don't have to face it alone.`
4. Text 12 px lh 1.8 `#939DAB` (`margin-top 17px`): `Activate SOS to instantly share your live location and alert every person in your trusted network.`
5. Network strip (`margin 30px 0`, max-width 280): four 35 px avatars overlapping by 9 px, then on a new line `4 trusted people are here for you` (10 px `#929DAB`).
6. Danger wide button: activity icon + `Activate SOS` → Countdown.
7. Text button (`margin-top 20px`): `Go back — I'm safe` → Home.
8. Note (`margin-top 35px`, 9 px): lock + `This is a prototype. No real emergency services are contacted.`

### 9.7 SOS Countdown

> 📸 Reference screenshots: `design/screens/` → 51-sos-countdown-5, 52-sos-countdown-3, 54-countdown-from-wearable (see `design/SCREENS.md`)

Same layout as 9.6 with:
- Orb shows the number (**5 → 4 → 3 → 2 → 1**, Manrope 70 px / 650 `#D65E62`) and pulses (`orb-pulse` 1 s).
- Title: `Help is on its way.`
- Text: `Your wearable triggered SOS. Your network will be notified in {n} seconds.`
- Buttons: Secondary wide `✕ Cancel SOS — I'm safe` → Home + toast `SOS cancelled. No alerts were sent.` · Text button `Activate immediately →` → Emergency Active.
- At 0 the app switches automatically to Emergency Active.

---

### 9.8 Emergency Active

> 📸 Reference screenshots: `design/screens/` → 55-emergency-active, 60-emergency-someone-responding, 56 (call modal), 64 (end modal) (see `design/SCREENS.md`)

**A. Emergency header** — bg `#FCEEEE`, border `#F3DCDC`, radius 14, `padding 25px 22px`, text `#BF565B`, flex space-between:
- Red dot + `EMERGENCY ACTIVE` (9 px / 650 ls 1.2).
- h1 27 px `You're not alone.` (`margin-top 14px`).
- `Your My Network has been notified. Your location is being shared.` (11 px lh 1.8 `#B68488`).
- Shield icon on the right, 37 px wide, opacity 0.6.

**B. Metrics** — 3-column grid, `gap 10px`, `margin-top 17px`. Each card: column, centred, `padding 17px 5px`, `gap 10px`; icon 20 px `#CB7F83`; label 8 px `#929BAA`; value 14 px `#CA646A`:

| Icon | Label | Value |
|---|---|---|
| pin | Location sharing | ACTIVE ● |
| people | Network notified | 4/4 (tap → My Network) |
| gps | Current location | Live ● |

**C. Location card** (`margin-top 23px`): map 255 px high with the **red** "SIYABONGA" marker (pulse `#D86165`, label `#B86566`) · footer `Rosebank, Johannesburg` / `Live location shared with your network` · full-width primary `View location →` (`margin-top 6px`) → Live Map.

**D. Network updates card** (`padding 22px`): h2 18 px `Your network is here.` → one row per member (35 px avatar · name 11 px · status 10 px `#9AA6B2` · check `#6F9B87`). Status = `Emergency alert delivered`; the first member changes to `Responding · On their way` once someone taps "I'm responding". Bottom: divider + text button `Preview a network member's alert →` → Member Alert.

**E. Bottom actions** (column, `gap 12px`, `margin 24px 0 15px`): Danger `📞 Call emergency services` → modal · Secondary `End emergency — I'm safe` → end modal.

**F. Note:** `Simulated emergency. No real alerts or calls are made.`

---

### 9.9 Member Alert (what a trusted person sees)

> 📸 Reference screenshots: `design/screens/` → 57-member-alert, 59-member-alert-responding, 58 (call modal) (see `design/SCREENS.md`)

Max-width 630, centred.

- **Viewer strip** (9 px `#9BA4AF`, wraps, `gap 8px`, `margin-bottom 25px`): 35 px avatar · `You're viewing as **Thabo**` (`#68788D`) · text button `Return to your view →`.
- **Alert card** (centred, `padding 25px 19px`):
  1. Red dot + `GUARD'OVA ALERT`.
  2. Person circle 67 px, bg `#F6E6E6`, initials `SN` 20 px / 600 `#A95B62`, `margin 25px auto 18px`.
  3. h1 27 px `Siyabonga needs you.`
  4. `Siyabonga has triggered an emergency.` (12 px `#929AAA`).
  5. Badge `Emergency Active` (9 px `#C46065` on `#F9EAEA`, `padding 6px 10px`, radius 5, `margin 5px 0 25px`).
  6. Map (180 px, radius 9) with the red SIYABONGA marker.
  7. Location row (`margin 17px 0 24px`): pin 18 px · `Rosebank, Johannesburg` (11 px `#69778A`) / `Live location available · Updated just now` (10 px).
  8. Primary wide `View live location →`.
  9. Two buttons side by side (`gap 8px`, `margin-top 12px`, each 10 px, `padding 12px 8px`): Secondary `📞 Call Siyabonga` · Danger `🛡 I'm responding` → becomes the green Responding button `✓ You're responding` + toast `Siyabonga has been notified that you're responding.`
  10. Note: `Trusted member preview · Simulated alert`

---

### 9.10 Incident History

> 📸 Reference screenshots: `design/screens/` → 70-history-empty, 71-history-with-incident (see `design/SCREENS.md`)

**Page heading:** `YOUR SAFETY, OVER TIME` / `Incident history.` / `A private record of your alerts, responses, and moments of reassurance.`

**Empty state** (card, centred, `padding 38px 23px`, min-height 420):
- Icon tile 86 × 86, radius 25, bg `#EDF5F0`, shield 42 px `#76A18C`, `margin-bottom 25px`.
- h2 21 px `Nothing to report. That's a good thing.`
- `You haven't had any emergencies. If you ever need help, your incident details will be kept here, securely.` (12 px lh 1.8 `#949FAB`, max-width 420).
- Secondary `Explore the SOS experience →` → SOS Activation.

**With incidents:** h2 `Recent incidents`, then rows (`padding 24px 0`, bottom divider, wraps): green check tile · `Emergency ended · You're safe` (11 px) / `{date} · SOS simulation · 4 members notified` (9 px) · status pill `Resolved` (`margin-left 40px`).

> History is reached from the desktop sidebar; there is no tab for it on mobile.

---

### 9.11 Settings

> 📸 Reference screenshots: `design/screens/` → 80-settings, 81-settings-toggle-off, 82 (remove modal), 83-settings-member-removed (see `design/SCREENS.md`)

**Page heading:** `SAFETY, ON YOUR TERMS` / `Make it yours.` / `Your account, your device, your trusted people. You're in control.`

**A. Settings card** (`padding 23px`)
- Account row (bottom divider, `padding-bottom 25px`, `margin-bottom 25px`): 51 px avatar `SN` (16 px) · `Siyabonga Nkosi` (h2 16 px) / `Personal safety account` (11 px).
- h3 `Privacy & sharing` (12 px `#6D7B8C`, ls 0.3).
- Toggle `Share my location` — `Allow your trusted network to see your location.` (on).
- Toggle `Safety notifications` — `Device updates and network activity.` (on).
- Note box (bg `#F4F6FA`, radius 8, `padding 16px`, `margin 18px 0 30px`, `#9BA7B8`, 10 px lh 1.8): lock + `During an active SOS, emergency location sharing remains enabled to help your network find you.`
- h3 `My device`.
- Link rows (`padding 21px 0`, 11 px `#7B8A9D`, bottom divider): shield `Guard'Ova One` · status pill · chevron → My Device; activity `How Guard'Ova works` · chevron → Welcome.

**B. Manage network card** (`padding 23px`)
- Heading `My Network — 4/5` + people icon.
- `Your trusted circle. Only invite people you know.`
- One row per member (`padding 20px 0`, `gap 12px`): 35 px avatar · name (12 px) / `{Relation} · {Status}` (10 px `#9DA6B2`) · ✕ remove button (`#A9B1BE`, `padding 7px`) → Remove modal.
- Secondary wide `+ Add trusted member` (`margin-top 23px`, only while fewer than 5) → Invite modal.
- Note: `Up to 5 people. A small circle, a stronger connection.`

---

### 9.12 Welcome / Onboarding (3 steps)

> 📸 Reference screenshots: `design/screens/` → 01-welcome-step1, 02-welcome-step2, 03-welcome-step3 (see `design/SCREENS.md`)

Centred column, max-width 520.

1. Eyebrow `WELCOME TO GUARD'OVA`.
2. Visual area 300 × 265:
   - Step 1: wearable illustration scaled 1.65 (tap → next step).
   - Step 2: 250 × 250 "network" ring: dashed circle (`inset 25px`, `1px dashed #CEDAF1`) with four 60 px avatars at top, right, bottom, left and a 42 px blue shield in the centre.
   - Step 3: 175 px circle bg `#EDF3FE`, 23 px halo `#F0F4FB`, shield 90 px `#5383E6`.
3. Title h1 30 px (max-width 420) and text 12 px lh 1.9 `#98A2B0` (`margin 20px 0`):

| Step | Title | Text |
|---|---|---|
| 1 | Personal safety that moves with you. | A discreet wearable. A connected app. The people you trust. Always by your side. |
| 2 | Your people. Your peace of mind. | Create your private circle of up to five people. Share your safety status, and get support when it matters. |
| 3 | Small device. Connected protection. | One press alerts your network and shares your live location. So help knows where to find you. |

4. Dots (`gap 7px`, `margin 10px 0 29px`): 6 × 6 `#DCE3EE`; current = 20 × 6 blue pill.
5. Primary wide (max-width 340): `Continue →` (step 3: `Enter my safety space →` → Home).
6. Text button `Skip introduction` (`margin 20px`) → Home.
7. Ecosystem line (8 px `#98A5B9`, `gap 6px`, `margin-top 30px`, icons 12 px): `🛡 Wearable → App → My Network → Response`.

---

## 10. Modals & toasts

### 10.1 Modal frame

- Backdrop: fixed, `#17223B45` + `backdrop-filter: blur(6px)`, `padding 18px`, centred, `z-index 90`; tapping it closes.
- Sheet: white, width 100 % (max 440), max-height 90 vh, scrolls, border `1px #E5EAF3`, radius 18, `padding 30px 24px`, shadow `0 20px 100px #18263724`.
- Close ✕ at `top 17px; right 17px`, `#A0AABB`.
- Heading-icon tile 43 px (`margin-bottom 19px`) · h2 21 px lh 1.5 · paragraph 12 px lh 1.9 `#9AA4B3` (`margin 13px 0 23px`).
- Form labels 11 px / 550 `#778498` (`margin 18px 0 8px`); inputs full width, border `#DFE5EF`, radius 7, bg `#FBFCFE`, `padding 12px`, 12 px `#5B6A83`.

### 10.2 Modal list

> 📸 Screenshots: 24, 33, 34, 35, 56, 58, 63, 64, 82, 90 (modals); 23, 36, 53, 59, 65, 83 (toasts)

| Modal | Contents |
|---|---|
| **Invite** | Blue people tile · `A trusted person. One invitation.` · `Add someone who will be there when you need them. They'll receive an invitation to your private network.` · `Their name` (placeholder `e.g. Nomsa`, max 30) · `Mobile number` (tel, placeholder `+27 82 123 4567`, min 8) · Primary `Send invitation →` · note `Private by design. Maximum 5 trusted people.` → adds an "Invited" member, toast `Demo invitation created. No SMS was sent.` |
| **Notifications** | `Your safety updates` · row: green shield `Your Guard'Ova is connected` / `All systems ready. You're good to go.` / `Just now` · row: blue people `Your circle is ready` / `4 trusted people are in your network.` / `Today` · (if emergency) Danger `View active emergency →` |
| **End emergency** | Green shield · `Are you safe now?` · `Ending this emergency tells your network that you're safe. The incident will be saved to your history.` · Primary `Yes, I'm safe — end emergency` · Secondary `Keep emergency active` → toast `Emergency ended. Your network has been notified that you're safe.` |
| **Remove member** | `Remove {Name}?` · `They'll no longer see your safety status, shared location, or emergency alerts.` · Danger `Remove from My Network` · Secondary `Keep in my network` → toast `{Name} was removed from your trusted network.` |
| **Call** (member / Siyabonga / emergency) | Blue phone tile · `Call {Name}` or `Call emergency services` · member: `This prototype demonstrates the call action. No real phone call will be placed.` · emergency: `In a real emergency in South Africa, dial 112 from a mobile phone. This prototype does not make calls.` · Primary `📞 Demonstrate call` → toast `Call action demonstrated. No real call was made.` |
| **Device preferences** | `Device preferences` · `Your Guard'Ova One is paired with this account.` · Toggle `Wearable vibration` / `Haptic feedback when SOS is triggered.` · rows `Firmware — v2.4.1 · Up to date`, `SOS countdown — 5 seconds` · Primary `Save preferences` → toast `Device preferences saved for this session.` |

### 10.3 Toast

Fixed, centred (`left 50%`, `translateX(-50%)`), **90 px above the bottom** (clears the tab bar), max-width `calc(100% − 30px)`, `z-index 100`. bg `#283E38`, border `#435950`, radius 10, `padding 14px 16px`, 11 px white text, `gap 12px`: check icon 19 px `#A1D7B9` · message · ✕ 16 px `#C2D5CD`. Auto-dismiss after **4.5 s**. `role="status"`.

---

## 11. State, behaviour & demo data

### 11.1 Demo user and members

- User: **Siyabonga Nkosi**, initials **SN**, location **Rosebank, Johannesburg** (26.1467° S, 28.0436° E).
- Device: **Guard'Ova One · Midnight**, ID `GO–2849–SN`, firmware v2.4.1.

| Name | Initials | Relation | Avatar colour | Status |
|---|---|---|---|---|
| Mom | NM | Family | rose | Online |
| Thabo | TM | Friend | blue | Online |
| Kabelo | KM | Brother | sage | Online |
| Lerato | LM | Friend | purple | Away |

Maximum 5 members. Invited members get colour `blue`, relation `Trusted person`, status `Invited`, initials from the first letters of their name.

### 11.2 Screen flow

```
Welcome (3 steps) ──► Home
Home ──► My Device · My Network · Live Map · SOS · Settings (tabs / cards)
Home wearable tap / Device "Simulate press" ──► Countdown
SOS Activation ──"Activate SOS"──► Countdown (5 s) ──► Emergency Active
Countdown ──"Cancel"──► Home (+ toast)    Countdown ──"Activate immediately"──► Emergency Active
Emergency Active ──"End emergency"──► modal ──► Home (+ incident saved, toast)
Emergency Active / Member Profile ──► Member Alert ──"I'm responding"──► responding state
My Network / Map list ──► Member Profile
```

### 11.3 State variables

| State | Default | Effect |
|---|---|---|
| `screen` | `home` | Which screen is shown |
| `members` | 4 demo members | Network lists, counts ("4/5", "4/4") |
| `countdown` | 5 | Countdown seconds, ticks every 1 s |
| `emergency` | false | Switches home safety card, map marker and Live Map copy to emergency style |
| `responding` | false | First member shows "Responding · On their way"; alert button turns green |
| `deviceState` | Connected | Connected / Disconnected / Low battery / GPS unavailable |
| `shareLocation`, `notifications` | true | Settings toggles |
| `incidents` | [] | Incident history rows |
| `onboardingStep` | 0 | Welcome step (0–2) |

---

## 12. Illustrations (exact code)

### 12.1 Wearable (pure CSS)

Markup:

```html
<div class="wearable-scene">
  <div class="device-orbit orbit-one"></div>
  <div class="device-orbit orbit-two"></div>
  <div class="wearable-shadow"></div>
  <div class="wearable">
    <div class="wearable-loop"></div>
    <button class="wearable-face" aria-label="Simulate pressing the Guard’Ova wearable SOS button">
      <span class="device-led"></span>
      <!-- shield icon, 40px -->
      <span class="device-wordmark">GUARD’OVA</span>
      <span class="device-button"></span>
    </button>
  </div>
</div>
```

Styles (verbatim):

```css
.wearable-scene{position:relative;width:175px;height:155px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.device-orbit{position:absolute;width:135px;height:135px;border:1px solid #f0f2f5;border-radius:50%}
.orbit-two{width:105px;height:105px}
.wearable{width:65px;height:106px;position:relative;transform:rotate(-19deg);margin-top:12px}
.wearable-face{position:relative;z-index:2;border-radius:23px 23px 28px 28px;
  background:linear-gradient(125deg,#454952 0%,#272c34 24%,#12171e 65%,#252a34 100%);
  border:2px solid #515761;
  box-shadow:inset 1px 0 2px #ffffff61,3px 4px 0 #111922,5px 6px 0 #383e48,7px 10px 9px #1d242b30;
  width:65px;height:100px;padding:20px 0 0;display:flex;align-items:center;flex-direction:column;color:#d2d8e0}
.wearable-face>svg{stroke-width:1.05;opacity:.85;width:27px;height:28px}
.device-wordmark{font-size:5px;letter-spacing:.45px;font-weight:600;margin-top:4px}
.device-led{position:absolute;width:3px;height:3px;box-shadow:0 0 6px #96ffcb;background:#97d4b5;border-radius:50%;top:10px;left:31px}
.device-button{position:absolute;border:1px solid #474c56;background:#252b35;width:19px;height:8px;border-radius:4px;bottom:13px;left:21px}
.wearable-loop{position:absolute;width:19px;height:20px;border:5px solid #464b53;border-radius:50%;top:-15px;left:21px;background:#fafbfc;box-shadow:2px 1px 0 #151b23}
.wearable-shadow{width:81px;height:15px;background:#26314224;filter:blur(7px);position:absolute;bottom:13px;left:45px;transform:rotate(-14deg)}

/* Mobile home card */
.device-card .wearable-scene{width:145px;transform:scale(1.05)}
/* Device screen */
.device-product>.wearable-scene{width:280px;height:260px}
.device-product .wearable{transform:rotate(-19deg) scale(1.7)}
.device-product .wearable-shadow{bottom:53px;left:89px;width:126px}
.device-product .device-orbit{width:255px;height:255px}
.device-product .orbit-two{width:205px;height:205px}
/* Welcome */
.welcome-visual .wearable-scene{transform:scale(1.65)}
```

### 12.2 Live map (inline SVG, illustrative)

```html
<div class="live-map">  <!-- height: 180px home, 400px Live Map, 255px emergency, 180px alert -->
  <svg class="map-art" viewBox="0 0 700 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="700" height="400" fill="#edece7"/>
    <path d="M0 320 150 280 240 340 340 300 420 390 700 370V400H0Z" fill="#d8e7d4"/>
    <path d="m480 0-30 80 25 75 70 30 30 80 125 10V0Z" fill="#dce9d7"/>
    <path d="M0 115 700 320M90 0l125 400M0 250 700 120M390 0l-55 400M620 0 475 400M0 40l700 200M10 400 700 45" stroke="#fff" stroke-width="17"/>
    <path d="M0 115 700 320M90 0l125 400M0 250 700 120M390 0l-55 400M620 0 475 400M0 40l700 200M10 400 700 45" stroke="#d8d8d2" stroke-width="1"/>
    <path d="m0 370 155-135L270 85 310 0" stroke="#f9f6e9" stroke-width="26" fill="none"/>
    <path d="m0 370 155-135L270 85 310 0" stroke="#e2d9bd" stroke-width="2" fill="none"/>
    <g fill="#d9dbd5">
      <rect x="231" y="174" width="43" height="24" rx="3" transform="rotate(-12 231 174)"/>
      <rect x="404" y="160" width="37" height="22" rx="3"/>
      <rect x="265" y="263" width="43" height="29" rx="3"/>
      <rect x="101" y="117" width="38" height="27" rx="3"/>
    </g>
    <g fill="#91998e" font-family="Inter, sans-serif" font-size="11">
      <text x="290" y="70">ROSEBANK</text><text x="455" y="325">SAXONWOLD</text>
      <text x="49" y="188">PARKTOWN NORTH</text><text x="535" y="88">Melrose</text>
    </g>
    <g fill="#a7a79c" font-size="9" font-family="Inter, sans-serif">
      <text x="278" y="230" transform="rotate(-11 278 230)">Jellicoe Avenue</text>
      <text x="372" y="330" transform="rotate(-81 372 330)">Oxford Road</text>
      <text x="99" y="305" transform="rotate(-40 99 305)">Jan Smuts Ave</text>
    </g>
  </svg>
  <div class="map-you"><!-- add class "danger" in emergencies -->
    <div class="you-label">YOU</div><!-- "SIYABONGA" in emergencies -->
    <div class="location-pulse"><!-- shield icon 17px --></div>
  </div>
  <span class="map-live"><i></i> Live location</span>
  <span class="map-attribution">Guard’Ova · Demo map</span>
</div>
```

```css
.live-map{position:relative;overflow:hidden;background:#ecece5}
.map-art{position:absolute;width:100%;height:100%;left:0;top:0}
.map-you{position:absolute;top:47%;left:48%;display:flex;align-items:center;flex-direction:column;transform:translate(-50%,-50%);gap:7px}
.you-label{padding:4px 8px;font-size:7px;font-weight:700;letter-spacing:1px;background:#fff;box-shadow:0 2px 8px #00000010;border-radius:4px;color:#526b9e}
.location-pulse{width:31px;height:31px;background:#4476ed;color:#fff;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 11px #467bee14,0 0 0 25px #467bee0b;display:grid;place-items:center}
.map-you.danger .location-pulse{background:#d86165;box-shadow:0 0 0 11px #d8616514,0 0 0 25px #d861650b}
.map-you.danger .you-label{color:#b86566}
.map-live{position:absolute;bottom:9px;left:13px;display:flex;align-items:center;gap:5px;border:1px solid #edf0e6;background:#ffffffeb;font-size:7px;color:#799080;padding:4px 6px;border-radius:4px}
.map-live i{width:4px;height:4px;background:#30916e;border-radius:50%}
.map-attribution{font-size:6px;position:absolute;bottom:5px;right:7px;color:#8b9285;background:#ffffff8c;padding:2px 4px}
```

In production this is replaced by a real map SDK (Mapbox or Google Maps) styled to match: warm grey base, pale green parks, white roads, small uppercase suburb labels.

---

## 13. Differences from the Technical App Brief v0.2

The Figma design has moved on from the brief in a few places. Developers should confirm which is the source of truth.

| Topic | Technical Brief v0.2 | Figma design |
|---|---|---|
| Primary blue | `#1F6BFF` | `#235BE5` |
| Safe green | `#17B26A` (bright) | `#248463` / muted mint card `#E9F3EF` |
| Emergency red | `#E5322D` | `#DF4E50` (buttons), softer rose surfaces |
| Text / background | `#0B1630` / `#F4F7FB` | `#20292E` / `#F6F7F9` |
| Font | System (SF Pro / Roboto) | DM Sans (body) + Manrope (headings) |
| SOS countdown | 3 s | **5 s** (also shown in Device preferences) |
| Emergency screen | Full red takeover | Soft rose header + white cards on the normal page background |
| Home SOS | Large red SOS button | Rose banner with an "Activate SOS" button |
| Min tap target | 48 dp, emergency ≥ 56 dp | Buttons min 44 px; tab items and some links are smaller |
| Incident history | One of 12 screens | Exists, but has no mobile tab (desktop sidebar only) |
| Bottom navigation | Device · My Network · SOS · Settings | Home · Device · Network · Map · Settings |

Several text sizes in the design are very small for a phone (6–9 px). If the app must meet the brief's accessibility rules, scale the type up (suggest a 13 px minimum for readable text and 11 px for labels) while keeping the same hierarchy.

---

## 14. Rebuild checklist

- [ ] Load DM Sans and Manrope with the exact weights listed in section 2.
- [ ] Define the colour tokens in section 3 (as CSS variables, Swift `Color` assets or Kotlin `Color` constants).
- [ ] Build the 19 icons from section 6 with stroke width 1.65 and round caps.
- [ ] Build the components in section 7: card, heading icon, status pill, count pill, the four buttons plus text button, avatar, toggle, detail row.
- [ ] Build the shell: 66 px top bar and fixed, frosted 5-tab bar.
- [ ] Build the 12 screens in section 9 in the order listed, using the exact copy.
- [ ] Add the 6 modals and the toast from section 10.
- [ ] Wire the state and flows from section 11 (5-second countdown, device states, responding state).
- [ ] Recreate the wearable and map illustrations from section 12 (or swap the map for a styled SDK map).
- [ ] Resolve the differences in section 13 with the CTO before final build.

---

## 15. React Native translation rules

The prototype is web (CSS). These rules convert it to React Native **without changing what it looks like**. Units: **1 CSS px = 1 RN dp/pt**. The reference frame (402 × 874) is exactly an iPhone 16 Pro screen in points.

### 15.1 Fonts (most common cause of "almost right")

- The ready-made files are in `design/fonts/static/` (built by `design/fonts/make-static-fonts.py`). Copy them into the app and load all of them with `expo-font` before hiding the splash screen.
- DM Sans: the prototype loads it from Google Fonts, which serves a file with **no optical-size axis, pinned at opsz 14** (verified: glyph advances match the source font at opsz 14 exactly). So the reference renders **every DM Sans string at opsz 14**, whatever its size. Each static file freezes one weight at opsz 14: `DMSans-<weight>`. Manrope: `Manrope-<weight>`. Map labels: `Inter-400`. (Decision D11, 26 Oct 2026.)
- Never set `fontWeight` alongside these families (Android would fake-bold them).
- `fonts-used.json` lists every family/size/weight actually rendered in the design (52 combinations).
- **Line height:** the prototype includes Tailwind v4's base styles, which set `line-height: 1.5` on the whole page. So **every text element is 1.5 × its font size unless a rule says otherwise** (h1 = 1.35; card descriptions 1.75–1.85; etc.). RN needs absolute numbers: set `lineHeight` on every text style = multiplier × font size (e.g. 11 px × 1.85 = 20.35). The exact computed `lineHeight` of every element is in `design/layout/*.json`.
- Android: set `includeFontPadding: false` and `textAlignVertical: 'center'` on all text, or vertical positions drift by 1–3 dp.
- Letter-spacing values transfer 1:1 (px → `letterSpacing`).
- Ellipsis (`text-overflow: ellipsis`) → `numberOfLines={1}`.

### 15.2 Colour

- 8-digit hex (`#RRGGBBAA`, e.g. `#ffffffed`, `#17223b45`) is supported by RN as-is. Put every value in `theme/colors.ts`; no inline hex in components.

### 15.3 Shadows, rings and borders

| CSS | React Native |
|---|---|
| `box-shadow: 0 0 0 Npx color` (solid ring: SOS orb, location pulse, avatar outline, onboarding halo) | Concentric `View`s behind the element (RN shadows have no spread). E.g. SOS orb = 212 px circle `#FCF5F5` → 176 px circle `#F9EEEE` → 140 px orb |
| Blurred shadow (`0 20px 100px #18263724`) | iOS: `shadowColor/Offset/Opacity/Radius`; Android: `elevation` is not colour-accurate → use `react-native-shadow-2` or `boxShadow` style (RN 0.76+ New Architecture supports CSS `boxShadow`, including spread — preferred if available) |
| `border: 1px dashed` (Add-member avatar) | `borderStyle: 'dashed'` (on a View with uniform radius only) |
| `border-top` divider rows | `borderTopWidth: 1` (exactly 1 px as designed; do not use `StyleSheet.hairlineWidth`) |

### 15.4 Gradients, blur, SVG

- Avatar fills: `expo-linear-gradient`, CSS 145° on a square → `start={{x:0.101,y:-0.070}} end={{x:0.899,y:1.070}}` (the CSS gradient line is 1.393× the box side; corrected 27 Oct 2026).
- Wearable: use the exported transparent PNGs in `design/assets/` (`wearable-home-card`, `wearable-device-screen`, `wearable-welcome`, each @1x/@2x/@3x). They are pixel renders of the CSS illustration, so they are exact. Place them so their bounding box matches the `.wearable-scene` box in the spec. Only the wearable face is a button (starts the SOS countdown).
- Icons and the map: `react-native-svg`. Copy the paths from section 6 and the map SVG from 12.2 verbatim. Icon stroke width 1.65 and round caps/joins on every icon.
- Bottom tab bar `backdrop-filter: blur(15px)` + `#ffffffed` → `expo-blur` `BlurView` (intensity ≈ 40, tint light) under a `#ffffffed` overlay.
- Modal backdrop `#17223B45` + `blur(6px)` → `BlurView` (intensity ≈ 15) + `rgba(23,34,59,0.27)` overlay.

### 15.5 Layout

- The web layout uses flex everywhere, so it maps cleanly. Watch for: CSS `gap` → RN `gap` (supported); `display:grid` (map member list 2 columns, emergency metrics 3 columns) → rows of flex children with `flex: 1` and the same `gap`.
- `position: fixed` tab bar and toast → render them outside the ScrollView (absolute, bottom). Content `paddingBottom: 100`.
- **Safe areas:** the Figma frame ignores the status bar / Dynamic Island. In the app, the top bar's 66 px starts *below* `insets.top`, and the tab bar's bottom padding is `max(12, insets.bottom)` (exactly what the CSS does with `env(safe-area-inset-bottom)`). This is the only intended layout difference from the screenshots, which have no status bar.
- Smooth scroll-to-top on every screen change (prototype does `window.scrollTo({top:0, behavior:'smooth'})`).

### 15.6 Motion

| Prototype | React Native |
|---|---|
| SOS orb pulse (`orb-pulse` 1 s infinite, halos 18/36 → 24/46 px at 50%) | `react-native-reanimated` loop animating the two halo circle sizes |
| Toast entry 0.2 s ease (fade + rise 13 px) | Reanimated `FadeInDown`-style, 200 ms, ease |
| Toggle knob `translateX(15px)` 0.2 s | Reanimated / Animated timing 200 ms |
| Button press `translateY(1px)` | `Pressable` style when `pressed` |
| `prefers-reduced-motion` | `AccessibilityInfo.isReduceMotionEnabled()` → disable loops/transitions |

Hover (`filter: brightness(.98)`) and focus rings do not apply on touch devices.

### 15.7 Navigation map (prototype screen → app route)

| Prototype `screen` | Suggested expo-router route | Tab highlighted |
|---|---|---|
| `home` | `/(tabs)/index` | Home |
| `device` | `/(tabs)/device` | Device |
| `network` | `/(tabs)/network` | Network |
| `profile` | `/network/[member]` | none (prototype highlights nothing) |
| `map` | `/(tabs)/map` | Map |
| `settings` | `/(tabs)/settings` | Settings |
| `sos`, `countdown` | `/sos`, `/sos/countdown` | none |
| `emergency` | `/emergency` | none |
| `alert` | `/alert/[member]` | none |
| `history` | `/history` | none |
| `welcome` | `/welcome` | none |

The top bar and the bottom tab bar are visible on **every** screen in the prototype, including SOS, emergency, alert and welcome. Keep it that way.

### 15.8 Demo-only affordances

These exist only because the prototype has no hardware or backend. Build them exactly as shown, behind one flag `DEMO_MODE` (default `true`, so screens match the screenshots):

- "Simulate wearable button press" button, "Preview device states" select, all "Prototype only…/Simulated…" notes
- "Explore the other side / Preview emergency alert", "Preview a network member's alert", "You're viewing as …" strip
- "Demonstrate call" modals (in production these become real `tel:` links; emergency = **112**)

---

## 16. Known prototype bugs (do not replicate)

| # | Where | Bug | Correct behaviour |
|---|---|---|---|
| 1 | Invite modal, "Their name" | `pattern=".*\\S.*"` in JSX means a literal backslash is required, so **every real name fails** with "Please match the requested format." The form can never be submitted (screenshot `35b`). | Valid when `name.trim().length > 0`. Phone required, min 8 characters. On submit: add member (status `Invited`, relation `Trusted person`, colour `blue`, initials = first letters of the first two words), close modal, toast. Screenshots `36`–`38` show the intended result. |
| 2 | Toast keyframes | `toast-in` animates `bottom` 15 → 28 px (desktop values) but the mobile toast sits at 90 px, so it jumps at the end. | Animate opacity 0 → 1 and translateY 13 → 0 at the mobile position (bottom 90). |
| 3 | Home "Add member" tile | Says "1 spot available" — always singular ("2 spot available" if two are free). | Keep the exact text when 1 is free; use "spots" for 2 or more. |
| 4 | Incident History | No way to reach it on mobile (the link only exists in the desktop sidebar). | Build the screen exactly; how users reach it on mobile is an open decision (see `design/OPEN-DECISIONS.md`). |
| 5 | Map labels | The SVG asks for "Inter", which the prototype never loads, so browsers fall back to a system font. | Use `Inter-400` from the font build (the designer's stated intent). |
