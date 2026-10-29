// src/config.ts — app-wide switches
// Source: docs/architecture/MOBILE.md (suggested structure)

// Demo-only controls and "Prototype only…" notes (DESIGN-SPEC §15.8, decision D7).
export const DEMO_MODE = true;

// SOS countdown length. 3 s per the emergency-flow brief; this overrides decision D1 (5 s)
// and is logged in design/OPEN-DECISIONS.md and docs/architecture/OPEN-QUESTIONS.md.
export const SOS_COUNTDOWN_SECONDS = 3;

// How long the in-app "Activate SOS" button must be held before the countdown starts.
// An ordinary tap never starts it.
export const SOS_HOLD_MS = 1500;

// South African emergency number dialled from a mobile phone (DESIGN-SPEC §10.2).
export const EMERGENCY_NUMBER = '112';

// Alert dispatch retry: the delay doubles after each failed attempt, up to the cap,
// and retries never stop while the emergency is active (SOS-FLOW: never silently fail).
export const ALERT_RETRY_BASE_MS = 2000;
export const ALERT_RETRY_MAX_MS = 60000;
