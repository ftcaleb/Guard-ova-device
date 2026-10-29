// src/features/sos/SosActivationScreen.tsx
// Screen 7 — SOS Activation. DESIGN-SPEC §9.6, screenshot design/screens/50-sos-activation.png
// "Activate SOS" uses the shared HoldToActivateButton: the countdown starts only after a
// press-and-hold; an ordinary tap does nothing.

import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { leaveToTab } from '../../components/shell/navigation';
import { HoldToActivateButton } from '../../components/ui/HoldToActivateButton';
import { TextButton } from '../../components/ui/Button';
import { useStore } from '../../state/store';
import { SosFocusedLayout } from './SosFocusedLayout';

export function SosActivationScreen() {
  const router = useRouter();
  const startCountdown = useStore((s) => s.startCountdown);

  const handleActivate = () => {
    const incident = startCountdown('app');
    router.replace((incident.status === 'active' ? '/emergency' : '/sos/countdown') as any);
  };

  return (
    <SosFocusedLayout
      title="You don’t have to face it alone."
      text="Activate SOS to instantly share your live location and alert every person in your trusted network."
    >
      <HoldToActivateButton
        testID="sos-activate"
        variant="danger"
        icon="activity"
        iconSize={20}
        label="Activate SOS"
        accessibilityHint="Press and hold to start the SOS countdown"
        onActivate={handleActivate}
        style={styles.wide}
      />
      <TextButton
        label="Go back — I’m safe"
        onPress={() => leaveToTab(router, '/')}
        style={styles.back}
      />
    </SosFocusedLayout>
  );
}

const styles = StyleSheet.create({
  wide: {
    alignSelf: 'stretch',
  },
  back: {
    marginTop: 20,
  },
});
