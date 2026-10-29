// src/features/sos/useSosEngine.ts — keeps the emergency flow running app-wide
// Mounted once in the root layout, after fonts and the persisted store are loaded.
//
// 1. Restore: if the app was closed or crashed with an open incident, reopen it
//    (Emergency Active, or the countdown if it still has time left).
// 2. Countdown deadline: when the countdown runs out the emergency is raised and the
//    app switches to Emergency Active, whichever screen the user is on.
// 3. Wearable: an SOS press (simulator today, BLE later) starts the countdown.

import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useStore } from '../../state/store';
import { subscribeWearable } from './wearable';

export function useSosEngine(ready: boolean) {
  const router = useRouter();
  const incidentId = useStore((s) => s.incident?.id);
  const status = useStore((s) => s.incident?.status);
  const endsAt = useStore((s) => s.incident?.countdownEndsAt);
  const restored = useRef(false);

  // 1. Restore once, after the persisted incident has been loaded.
  useEffect(() => {
    if (!ready || restored.current) return;
    restored.current = true;
    const result = useStore.getState().restoreIncident();
    if (result === 'active') router.replace('/emergency' as any);
    else if (result === 'countdown') router.replace('/sos/countdown' as any);
  }, [ready, router]);

  // 2. Fire the countdown at its deadline.
  useEffect(() => {
    if (!ready || status !== 'countdown' || endsAt === undefined) return;
    const id = setTimeout(() => {
      if (useStore.getState().activateEmergency('timer')) router.replace('/emergency' as any);
    }, Math.max(0, endsAt - Date.now()));
    return () => clearTimeout(id);
  }, [ready, incidentId, status, endsAt, router]);

  // 3. Wearable SOS presses.
  useEffect(() => {
    if (!ready) return;
    return subscribeWearable(() => {
      const incident = useStore.getState().startCountdown('wearable');
      router.navigate((incident.status === 'active' ? '/emergency' : '/sos/countdown') as any);
    });
  }, [ready, router]);
}
