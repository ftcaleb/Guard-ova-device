# Guard’Ova design package

Everything needed to rebuild the Figma Make design **“Guard’Ova Mobile App Design”** screen for screen in React Native. Captured read-only on 26 Oct 2026; the Figma file was not changed.

| Path | What it is | Use it for |
|---|---|---|
| `reference-prototype/` | The exact source code exported from Figma Make (React + CSS), verified character-for-character, plus a minimal Vite setup | **Source of truth.** Read the CSS for any value. Run it (`npm i && npm run dev` → http://localhost:5173, set the browser to 402 × 874) to see live behaviour |
| `screens/` | 47 states, 73 PNGs at 1206 × 2622 (iPhone 402 × 874 pt @3x), viewport + full-length | The visual target for side-by-side review |
| `layout/` | One JSON per screenshot: the browser’s computed x / y / width / height and style of **every element** (fonts, colours, borders, radii, shadows, padding, gaps) | Exact numbers. Resolves the overlapping CSS breakpoints for you |
| `SCREENS.md` | Index of every screenshot and what state it shows | Find the right image fast |
| `DESIGN-SPEC.md` | Tokens, type, components, every screen, modals, flows, React Native translation rules, known bugs | The structured spec |
| `assets/` | Transparent PNGs of the wearable illustration (@1x/@2x/@3x) | Drop-in images |
| `fonts/static/` | **Ready-to-use** static font files (DM Sans 400–700 at opsz 14, Manrope 400–800, Inter 400) + `font-map.json` | Copy into the app (e.g. `assets/fonts/`) and load with expo-font |
| `fonts/make-static-fonts.py` | The script that built `fonts/static/` | Only needed to rebuild them: `pip install fonttools && python design/fonts/make-static-fonts.py` |
| `fonts-used.json` | Every font family + size + weight actually rendered in the design | Font build input and type audit |
| `tools/capture-reference.cjs` | The Playwright script that produced `screens/`, `layout/` and `fonts-used.json` | Optional: re-render reference states. Not required for the build |
| `OPEN-DECISIONS.md` | Every design decision made (all “exactly as Figma”) plus prototype bugs to fix | Check before asking; add new questions at the bottom |
| `HOW-TO-MATCH-THE-DESIGN.md` | The build method, rules and lessons learned | **Read this first** |

Notes
- The desktop sidebar logo (`/guardova-logo.png`) is not included; it only appears on the desktop layout, which this app does not use.
- The reference prototype loads fonts from Google Fonts, so it needs internet access to render correctly.
