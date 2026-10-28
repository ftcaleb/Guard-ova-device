# Guard’Ova

A personal-safety product: a **wearable panic button**, a **mobile app**, and a private circle of up to **5 trusted people** who are alerted with your live location when you need help.

This repo is the starting point for the team. It holds the **final visual design** (everything you need to build it so it looks *exactly* like the Figma design) and the **architecture docs** for the app and its Supabase backend.

## What’s in here

| Path | What it is |
|---|---|
| [`design/`](design/) | The complete design package: spec, 47 reference screenshots, exact measurements of every element, the original Figma Make code, fonts and images |
| [`design/HOW-TO-MATCH-THE-DESIGN.md`](design/HOW-TO-MATCH-THE-DESIGN.md) | **How to build the UI so it’s identical to Figma:** the method, the rules, and the lessons learned (read before writing UI code) |
| [`docs/architecture/`](docs/architecture/) | How the system fits together: wearable → app → Supabase → network members, the SOS flow, data, mobile pieces, open questions |
| [`docs/brief/`](docs/brief/) | The original Technical App Brief (PDF) |
| [`CLAUDE.md`](CLAUDE.md) | Instructions that AI coding agents (Claude Code etc.) read automatically |

## Where to start

1. **Everyone:** read [`docs/architecture/README.md`](docs/architecture/README.md) (10 minutes) for the big picture.
2. **Building screens:** read [`design/HOW-TO-MATCH-THE-DESIGN.md`](design/HOW-TO-MATCH-THE-DESIGN.md), then [`design/DESIGN-SPEC.md`](design/DESIGN-SPEC.md).
3. **Backend / data:** [`docs/architecture/SUPABASE.md`](docs/architecture/SUPABASE.md) and [`docs/architecture/DATA.md`](docs/architecture/DATA.md).
4. **See the design live:** run the original Figma prototype:
   ```bash
   cd design/reference-prototype
   npm install
   npm run dev        # http://localhost:5173, then set your browser to 402 × 874 (F12 → device toolbar)
   ```

## Stack
- **Mobile:** React Native with **Expo** (TypeScript, expo-router). One codebase for iOS and Android.
- **Backend:** **Supabase** (Postgres, Auth, Row Level Security, Realtime, Edge Functions).
- **Design:** final and signed off. The UI must match `design/` exactly.

## Status
- ✅ Design final (`design/`)
- ✅ Architecture outlined (`docs/architecture/`): a map with starting points, not strict rules
- 🔜 App build
- 🔜 Supabase backend
- 🔜 Wearable (hardware + Bluetooth)

## Never commit
- `.env` files with real keys, and **never the Supabase `service_role` key** (it bypasses all security)
- `node_modules/`, `android/`, `ios/`, `dist/` (generated)
