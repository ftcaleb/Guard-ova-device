// src/features/sos/SosCountdownScreen.tsx
// Screen 8 — SOS Countdown. DESIGN-SPEC §9.7, screenshots design/screens/51, 52, 54
// The number is read from the incident's deadline (countdownEndsAt), so it stays right
// even if the JS thread stalls. Running out the timer is handled by useSosEngine, not
// here, so the emergency still goes out if the user leaves this screen without cancelling.

import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { leaveToTab } from '../../components/shell/navigation';
import { Button, TextButton } from '../../components/ui/Button';
import { useStore } from '../../state/store';
import { secondsLeft } from './incident';
import { SosFocusedLayout } from './SosFocusedLayout';

/** Pluralised per decision D17 ("1 second"). */
export function countdownText(n: number) {
  return `Your wearable triggered SOS. Your network will be notified in ${n} ${n === 1 ? 'second' : 'seconds'}.`;
}

export function SosCountdownScreen() {
  const router = useRouter();
  const incident = useStore((s) => s.incident);
  const cancelCountdown = useStore((s) => s.cancelCountdown);
  const activateEmergency = useStore((s) => s.activateEmergency);
  const [now, setNow] = useState(Date.now());

  const counting = incident?.status === 'countdown';
  // Guard only for a screen opened with nothing to count down (e.g. a stale link).
  // After cancel / activation the handlers and useSosEngine navigate away themselves.
  const [openedWith] = useState(incident?.status);
  useEffect(() => {
    if (!counting) return;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [counting]);

  if (openedWith === 'active') return <Redirect href={'/emergency' as any} />;
  if (openedWith !== 'countdown') return <Redirect href={'/(tabs)' as any} />;
  if (!incident || incident.status !== 'countdown') return null;

  // Never show 0: at 0 the app has already switched to Emergency Active.
  const n = Math.max(1, secondsLeft(incident, now));

  return (
    <SosFocusedLayout title="Help is on its way." text={countdownText(n)} countdown={n}>
      <Button
        testID="sos-cancel"
        variant="secondary"
        icon="close"
        iconSize={18}
        label="Cancel SOS — I’m safe"
        onPress={() => {
          if (cancelCountdown()) leaveToTab(router, '/');
        }}
        style={styles.wide}
      />
      <TextButton
        testID="sos-activate-now"
        label="Activate immediately"
        trailingIcon="arrow"
        trailingIconSize={16}
        onPress={() => {
          if (activateEmergency('immediate')) router.replace('/emergency' as any);
        }}
        style={styles.now}
      />
    </SosFocusedLayout>
  );
}

const styles = StyleSheet.create({
  wide: {
    alignSelf: 'stretch',
  },
  now: {
    marginTop: 20,
  },
});
