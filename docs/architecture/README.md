# Guard’Ova architecture: start here

These docs are a **map, not a rulebook.** They explain how Guard’Ova fits together, what’s hard about it, and where to start. They don’t make every decision for you. Use your judgement, discuss, and write down what you decide.

## What Guard’Ova is (in one paragraph)
A person wears a small **wearable** with a panic button. Pressing it tells their **phone app**, which runs a short countdown (5 s, cancellable). If it isn’t cancelled, the app raises an **emergency**: it shares the person’s live location and alerts up to **5 trusted people** (“My Network”). Those people get an urgent notification, see the person on a map, can call them, and can tap **“I’m responding”** so everyone knows help is coming.

## Where things stand
- ✅ **The design is final:** `design/` has everything needed to build the UI identical to Figma (see `design/HOW-TO-MATCH-THE-DESIGN.md`).
- 🔜 **The app:** React Native (Expo). Build the UI first on **demo data**, then connect it to Supabase.
- 🔜 **The backend:** **Supabase**, then real alerts, real location and, later, the real wearable.

## Read in this order
| Doc | What it covers |
|---|---|
| [OVERVIEW.md](OVERVIEW.md) | The four parts of the system and how they talk to each other |
| [SOS-FLOW.md](SOS-FLOW.md) | The heart of the product: from button press to “I’m responding”, and what can go wrong |
| [SUPABASE.md](SUPABASE.md) | How Supabase’s building blocks map onto Guard’Ova |
| [DATA.md](DATA.md) | The main things we store and how they relate (a starting shape) |
| [MOBILE.md](MOBILE.md) | Where the finished UI ends and real data begins, plus the native pieces still to build |
| [OPEN-QUESTIONS.md](OPEN-QUESTIONS.md) | Things the team still has to figure out |

## Other places to look
- `docs/brief/` (PDF): the original product and technical brief, with more detail on requirements and risks.
- `design/`: the visual design. `design/DESIGN-SPEC.md` §11 lists the app’s state and flows, which is a good picture of the data each screen needs.
- `design/reference-prototype/src/App.tsx`: the clickable Figma prototype, including the demo people (Siyabonga, Mom, Thabo, Kabelo, Lerato).

## How to use these docs (people and AI agents)
- Treat every “Good starting points” section as a suggestion of where to begin, not the only way.
- **“Watch out for”** notes mark the places where a mistake can hurt a real person (missed alerts, leaked location). Take those seriously.
- When you decide something, add a short note under **Decisions log** in [OPEN-QUESTIONS.md](OPEN-QUESTIONS.md): what you chose and why. Keep these docs updated as the system grows.
