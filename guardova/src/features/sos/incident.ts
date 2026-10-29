// src/features/sos/incident.ts — the incident state machine
// Source: docs/architecture/SOS-FLOW.md ("Model the incident as a state machine")
//
//   countdown ──cancel──▶ cancelled        (no alert is ever sent)
//       │
//       └──timer / activate now──▶ active ──end──▶ resolved
//
// Pure functions only: each transition returns a new Incident, or null when the
// transition is not allowed from the current status. That makes every step safe
// to call twice (a second "activate" on an active incident is a no-op).

export type IncidentStatus = 'countdown' | 'active' | 'resolved' | 'cancelled';
export type SosSource = 'app' | 'wearable';
export type ActivationTrigger = 'timer' | 'immediate' | 'restored';

export type IncidentEventType =
  | 'pressed'
  | 'countdown_started'
  | 'cancelled'
  | 'activated'
  | 'alert_sent'
  | 'alert_delivered'
  | 'alert_failed'
  | 'responding'
  | 'call_emergency_services'
  | 'restored'
  | 'ended'
  | 'end_notified';

export interface IncidentEvent {
  type: IncidentEventType;
  at: string; // ISO timestamp
  details?: Record<string, string | number | boolean>;
}

export type DeliveryStatus = 'pending' | 'delivered' | 'failed';

export interface AlertDelivery {
  memberName: string;
  status: DeliveryStatus;
  attempts: number;
  deliveredAt?: string;
  respondingAt?: string;
}

export interface Incident {
  id: string; // also the idempotency key for every backend call
  source: SosSource;
  status: IncidentStatus;
  startedAt: string;
  countdownEndsAt: number; // epoch ms; the countdown is driven by this deadline, not by ticks
  activatedAt?: string;
  endedAt?: string;
  membersNotified: number; // stored when the alert goes out (decision D19)
  deliveries: AlertDelivery[];
  events: IncidentEvent[];
}

const iso = (ms: number) => new Date(ms).toISOString();

export function newIncidentId(now: number): string {
  return `inc_${now.toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function withEvent(incident: Incident, event: IncidentEvent): Incident {
  return { ...incident, events: [...incident.events, event] };
}

export function createCountdown(source: SosSource, countdownSeconds: number, now: number): Incident {
  const at = iso(now);
  return {
    id: newIncidentId(now),
    source,
    status: 'countdown',
    startedAt: at,
    countdownEndsAt: now + countdownSeconds * 1000,
    membersNotified: 0,
    deliveries: [],
    events: [
      { type: 'pressed', at, details: { source } },
      { type: 'countdown_started', at, details: { seconds: countdownSeconds } },
    ],
  };
}

export function cancel(incident: Incident, now: number): Incident | null {
  if (incident.status !== 'countdown') return null;
  return withEvent(
    { ...incident, status: 'cancelled', endedAt: iso(now) },
    { type: 'cancelled', at: iso(now), details: { secondsLeft: secondsLeft(incident, now) } },
  );
}

export function activate(
  incident: Incident,
  memberNames: string[],
  trigger: ActivationTrigger,
  now: number,
): Incident | null {
  if (incident.status !== 'countdown') return null;
  return withEvent(
    {
      ...incident,
      status: 'active',
      activatedAt: iso(now),
      membersNotified: memberNames.length,
      deliveries: memberNames.map((memberName) => ({ memberName, status: 'pending', attempts: 0 })),
    },
    { type: 'activated', at: iso(now), details: { trigger, members: memberNames.length } },
  );
}

export function end(incident: Incident, now: number): Incident | null {
  if (incident.status !== 'active') return null;
  return withEvent({ ...incident, status: 'resolved', endedAt: iso(now) }, { type: 'ended', at: iso(now) });
}

export function updateDelivery(
  incident: Incident,
  memberName: string,
  patch: Partial<AlertDelivery>,
  event: IncidentEvent,
): Incident {
  return withEvent(
    {
      ...incident,
      deliveries: incident.deliveries.map((d) => (d.memberName === memberName ? { ...d, ...patch } : d)),
    },
    event,
  );
}

export function addEvent(incident: Incident, event: IncidentEvent): Incident {
  return withEvent(incident, event);
}

/** Whole seconds left on the countdown, as shown in the orb (never below 0). */
export function secondsLeft(incident: Incident, now: number): number {
  return Math.max(0, Math.ceil((incident.countdownEndsAt - now) / 1000));
}

export function deliveredCount(incident: Incident): number {
  return incident.deliveries.filter((d) => d.status === 'delivered').length;
}
