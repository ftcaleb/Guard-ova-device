// src/features/sos/log.ts — one log line per step of every incident
// SOS-FLOW.md: "Log every step of every incident". Events are also stored on the
// incident itself (Incident.events), which is what later goes to incident_events.

import type { Incident, IncidentEvent } from './incident';

export function logIncidentEvent(incident: Pick<Incident, 'id' | 'status'>, event: IncidentEvent) {
  const details = event.details ? ` ${JSON.stringify(event.details)}` : '';
  // eslint-disable-next-line no-console
  console.info(`[SOS] ${event.at} ${incident.id} ${event.type} (status: ${incident.status})${details}`);
}

export function logIncidentError(incidentId: string, step: string, error: unknown) {
  // eslint-disable-next-line no-console
  console.error(`[SOS] ${new Date().toISOString()} ${incidentId} ${step} FAILED`, error);
}
