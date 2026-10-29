// src/data/alerts.ts — the seam between the emergency flow and the backend
// docs/architecture/MOBILE.md: screens and the store call these functions; later
// they call Supabase (create incident → Edge Function alerts members) instead of
// the demo implementation below, and nothing above this file has to change.
//
// Every call carries the incident id as an idempotency key, so a retry after a
// timeout can never create a second emergency or alert a member twice.

import { DEMO_MODE } from '../config';

export interface AlertRequest {
  incidentId: string;
  memberName: string;
  attempt: number;
}

export interface AlertResult {
  memberName: string;
  delivered: boolean;
  deliveredAt?: string;
  error?: string;
}

/** Raise the emergency for one member (push now; SMS fallback is a backend concern). */
export async function sendEmergencyAlert(req: AlertRequest): Promise<AlertResult> {
  if (DEMO_MODE) {
    // Demo data: every alert is delivered at once (screens 55 / 60 show "Emergency alert delivered").
    return { memberName: req.memberName, delivered: true, deliveredAt: new Date().toISOString() };
  }
  // TODO(backend): call the `alert-network` Edge Function with { incidentId, memberName }
  // using the incident id as the idempotency key, and resolve with the delivery receipt.
  throw new Error('Emergency alerts are not connected to the backend yet');
}

/** Tell the network the wearer is safe again. */
export async function sendEmergencyEnded(incidentId: string): Promise<void> {
  if (DEMO_MODE) return;
  // TODO(backend): update incidents.status = 'resolved' and notify members.
  throw new Error(`Ending incident ${incidentId} is not connected to the backend yet`);
}
