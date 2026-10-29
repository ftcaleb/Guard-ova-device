// src/features/emergency/EmergencyModals.tsx
// DESIGN-SPEC §10.2 — "End emergency" (screenshot 64) and "Call emergency services" (screenshot 56).
// Copy is exact from design/reference-prototype/src/App.tsx (lines 149, 151).

import React from 'react';
import { StyleSheet } from 'react-native';
import { ModalSheet } from '../../components/modals/ModalSheet';
import { Button } from '../../components/ui/Button';

export function EndEmergencyModal({
  visible,
  onConfirm,
  onClose,
}: {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <ModalSheet
      visible={visible}
      onClose={onClose}
      tile={{ icon: 'shield', tone: 'green' }}
      title="Are you safe now?"
      message="Ending this emergency tells your network that you’re safe. The incident will be saved to your history."
    >
      <Button variant="primary" label="Yes, I’m safe — end emergency" onPress={onConfirm} />
      <Button
        variant="secondary"
        label="Keep emergency active"
        onPress={onClose}
        style={styles.secondButton}
      />
    </ModalSheet>
  );
}

/** Demo-only: in production "Call emergency services" dials 112 directly (DESIGN-SPEC §15.8). */
export function CallEmergencyModal({
  visible,
  onDemonstrate,
  onClose,
}: {
  visible: boolean;
  onDemonstrate: () => void;
  onClose: () => void;
}) {
  return (
    <ModalSheet
      visible={visible}
      onClose={onClose}
      tile={{ icon: 'phone', tone: 'blue' }}
      title="Call emergency services"
      message="In a real emergency in South Africa, dial 112 from a mobile phone. This prototype does not make calls."
    >
      <Button variant="primary" icon="phone" iconSize={18} label="Demonstrate call" onPress={onDemonstrate} />
    </ModalSheet>
  );
}

const styles = StyleSheet.create({
  secondButton: {
    marginTop: 12,
  },
});
