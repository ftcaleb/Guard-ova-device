# Supabase: how its building blocks map onto Guard’Ova

We’re using **Supabase** as the backend. It gives us a managed Postgres database plus login, security rules, realtime updates and server functions, so there’s much less to build and run ourselves.

| Supabase piece | What it does | Where Guard’Ova uses it |
|---|---|---|
| **Auth** | Sign-up / login (phone number + SMS code is supported) | Accounts for wearers and network members |
| **Postgres database** | Tables, relations, SQL | Users, devices, networks, incidents, locations (see [DATA.md](DATA.md)) |
| **Row Level Security (RLS)** | Rules in the database deciding which rows each user can read/write | “Only my network can see my location”, “max 5 members”, “only the wearer can end their emergency” |
| **Realtime** | Push database changes / messages to connected apps instantly | Live location on the map, “Responding · On their way”, emergency status |
| **Edge Functions** | Small server-side TypeScript functions (Deno) | Sending push notifications and SMS, invite handling, anything that needs secrets |
| **Database webhooks / triggers** | Run something when a row changes | e.g. a new incident row → call the “alert network” function |
| **pg_cron / Queues** | Scheduled jobs and background queues inside Postgres | The “no push confirmation after ~30 s → send SMS” fallback; cleaning up old location data |
| **PostGIS** (extension) | Location data types and queries | Storing location points efficiently; maybe distance-based features later |
| **Storage** | File storage | Probably not needed early (profile photos later?) |

Push notifications and SMS are **not** sent by Supabase itself: an Edge Function calls a provider (see [OPEN-QUESTIONS.md](OPEN-QUESTIONS.md)).

## Watch out for
- **RLS is the security of the whole app.** With RLS off, or a rule that’s too loose, anyone with the app can read anyone’s location. Turn RLS on for every table from day one, and test the rules as different users.
- **Never put the `service_role` key in the app.** It bypasses all security. The app uses the **anon** key; Edge Functions use the service role key from secrets.
- **Region and POPIA:** Supabase has no South African region. The nearest regions (e.g. Europe) mean personal data is stored outside SA, which POPIA allows only under certain conditions. Get this confirmed with whoever handles legal before real users.
- **Use separate projects for dev and production.** Never test against real users’ data.
- **Keep schema changes in migrations** (Supabase CLI) in git, so everyone’s database matches.

## Good starting points
1. Create a **dev** Supabase project and install the **Supabase CLI**; run Supabase locally (`supabase start`) for day-to-day work.
2. Create the first tables from [DATA.md](DATA.md) as a migration, with RLS on.
3. Add **phone login** and get a user signed in from the app.
4. Write one Edge Function that sends a test push notification to a device, to prove the alert path early.
5. Try Realtime with a tiny test: one phone updates a row, another sees it change live.

Useful docs: Supabase Auth (phone login), Row Level Security, Realtime, Edge Functions, pg_cron, Queues, PostGIS, Supabase CLI and local development.
