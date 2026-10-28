# Data: the main things we store

A **starting shape**, not a final schema. Expect it to change as you build. `design/DESIGN-SPEC.md` §11 (state, flows, demo data) shows what the screens use.

```
 profiles ──< devices                     (a user can pair a wearable)
    │
    ├──< network_members >── profiles     (a wearer's trusted people; max 5; status: invited / active / removed)
    │
    └──< incidents ──< location_points    (an emergency and the locations sent during it)
              │
              ├──< alert_deliveries       (one row per member alerted: push sent? delivered? SMS fallback?)
              └──< incident_events        (timeline log: pressed, created, alerted, opened, responding, ended…)
```

## The main tables (ideas for columns)
| Table | What it holds | Possible columns |
|---|---|---|
| `profiles` | One row per user (linked to Supabase Auth) | id, name, phone, initials, avatar_color, created_at |
| `devices` | A paired wearable | id, owner_id, serial (e.g. `GO–2849–SN`), model, battery, last_seen_at, connection_state |
| `network_members` | Who is in whose network | wearer_id, member_id (or invited phone), relation, status, invited_at |
| `incidents` | One emergency | id, wearer_id, status (`active` / `resolved` / `cancelled`), started_at, ended_at, members_notified |
| `location_points` | Location updates during an incident (or while sharing) | incident_id, lat/lng (PostGIS point), accuracy, recorded_at |
| `alert_deliveries` | Did each member get the alert? | incident_id, member_id, channel (push / sms), sent_at, delivered_at, opened_at, responding_at |
| `incident_events` | Audit trail of everything that happened | incident_id, type, actor_id, created_at, details (json) |
| `settings` | Per-user toggles (share location, notifications, wearable vibration) | user_id, … |

## How the screens map to data (examples)
| Screen | Needs |
|---|---|
| Home | my profile, my device status, my network (members + presence), current incident (if any), my latest location |
| My Network / Profile | network_members joined with profiles |
| Emergency Active | the active incident, alert_deliveries per member, live location |
| Member Alert | the incident I’ve been alerted about, the wearer’s live location, my own delivery row (to mark “responding”) |
| Incident History | my past incidents (+ `members_notified` stored at the time, see design decision D19) |

## Watch out for
- **Invited members may not have an account yet.** Decide how an invite by phone number becomes a real member when they sign up.
- **The 5-member limit belongs in the database** (a constraint or RLS check), not only in the app.
- **Location data is the most sensitive thing we hold.** Think about how long to keep it (e.g. delete points some days after an incident ends) and who can read it (only the wearer and their active network, ideally only during an emergency or while sharing is on).
- **Presence** (“Online / Away / Last seen 12 min ago”) can come from Supabase Realtime Presence rather than a table.

## Good starting points
1. Start with `profiles`, `network_members` and `incidents`, enough to power Home, My Network and a basic emergency.
2. Write the RLS rules **at the same time** as each table.
3. Add `alert_deliveries` and `incident_events` once the basic emergency works, before adding the SMS fallback.
4. Seed a dev database with the same demo people as the app (Siyabonga, Mom, Thabo, Kabelo, Lerato) so screens look familiar.
