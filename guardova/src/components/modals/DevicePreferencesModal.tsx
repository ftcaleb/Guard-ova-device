// src/components/modals/DevicePreferencesModal.tsx
// DESIGN-SPEC §9.2 & §10: Device preferences modal
// Reference screenshot: 24-modal-device-preferences.png
// Layout reference: design/layout/24-modal-device-preferences.json
// Modal card: radius 18px, padding 30px 24px, bg white, border 1px #E5EAF3
// Contains:
// - Title "Device preferences" (h2 21px / 750)
// - Subtitle "Your Guard’Ova One is paired with this account." (12px #9AA4B3)
// - Toggle "Wearable vibration" - "Haptic feedback when SOS is triggered."
// - Detail row "Firmware" - "v2.4.1 · Up to date"
// - Detail row "SOS countdown" - "5 seconds"
// - Primary button wide "Save preferences"

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Icon } from '../Icon';
import { useStore } from '../../state/store';

interface DevicePreferencesModalProps {
  visible: boolean;
  onClose: () => void;
}

export function DevicePreferencesModal({
  visible,
  onClose,
}: DevicePreferencesModalProps) {
  const notify = useStore((s) => s.notify);
  const [wearableVibration, setWearableVibration] = useState(true);

  const handleSave = () => {
    onClose();
    notify('Device preferences saved for this session.');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={styles.modalCard}
          onPress={(e) => e.stopPropagation()}
          accessibilityRole="none"
        >
          {/* Close button top right */}
          <Pressable
            style={styles.closeButton}
            onPress={onClose}
            accessibilityLabel="Close dialog"
            accessibilityRole="button"
          >
            <Icon name="close" size={20} color="#A0AABB" />
          </Pressable>

          {/* Heading */}
          <Text style={styles.modalTitle}>Device preferences</Text>
          <Text style={styles.modalSub}>
            Your Guard’Ova One is paired with this account.
          </Text>

          {/* Toggle row: Wearable vibration */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleTextGroup}>
              <Text style={styles.toggleTitle}>Wearable vibration</Text>
              <Text style={styles.toggleDescription}>
                Haptic feedback when SOS is triggered.
              </Text>
            </View>

            <Pressable
              role="switch"
              aria-checked={wearableVibration}
              accessibilityLabel="Wearable vibration"
              style={[
                styles.toggleTrack,
                wearableVibration ? styles.toggleOn : styles.toggleOff,
              ]}
              onPress={() => setWearableVibration(!wearableVibration)}
            >
              <View
                style={[
                  styles.toggleKnob,
                  wearableVibration ? styles.knobOn : styles.knobOff,
                ]}
              />
            </Pressable>
          </View>

          {/* Detail row: Firmware */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Firmware</Text>
            <Text style={styles.detailValue}>v2.4.1 · Up to date</Text>
          </View>

          {/* Detail row: SOS countdown */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>SOS countdown</Text>
            <Text style={styles.detailValue}>5 seconds</Text>
          </View>

          {/* Save preferences button */}
          <Pressable
            style={styles.saveButton}
            onPress={handleSave}
            accessibilityRole="button"
            accessibilityLabel="Save preferences"
          >
            <Text style={styles.saveButtonText}>Save preferences</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(23, 34, 59, 0.27)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  modalCard: {
    width: '100%',
    maxWidth: 366,
    backgroundColor: colors.surface,
    borderColor: '#E5EAF3',
    borderWidth: 1,
    borderRadius: 18,
    paddingTop: 30,
    paddingHorizontal: 24,
    paddingBottom: 30,
    position: 'relative',
    shadowColor: '#182637',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.14,
    shadowRadius: 100,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    padding: 6,
    zIndex: 10,
  },
  modalTitle: {
    fontFamily: fonts.manrope750,
    fontSize: 21,
    lineHeight: 31.5,
    letterSpacing: -0.45,
    color: colors.ink,
    marginRight: 24,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  modalSub: {
    fontFamily: fonts.dmSans400,
    fontSize: 12,
    lineHeight: 22.8,
    color: '#9AA4B3',
    marginTop: 13,
    marginBottom: 23,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 20,
  },
  toggleTextGroup: {
    flex: 1,
  },
  toggleTitle: {
    fontFamily: fonts.dmSans550,
    fontSize: 12,
    lineHeight: 18,
    color: colors.ink,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  toggleDescription: {
    fontFamily: fonts.dmSans400,
    fontSize: 9,
    lineHeight: 15.3,
    color: '#9CA5B2',
    marginTop: 7,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  toggleTrack: {
    width: 37,
    height: 22,
    borderRadius: 20,
    padding: 3,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: colors.blue,
  },
  toggleOff: {
    backgroundColor: '#DBE0E9',
  },
  toggleKnob: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  knobOn: {
    alignSelf: 'flex-end',
  },
  knobOff: {
    alignSelf: 'flex-start',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontFamily: fonts.dmSans400,
    fontSize: 11,
    lineHeight: 16.5,
    color: colors.detailRowLabel,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  detailValue: {
    fontFamily: fonts.dmSans550,
    fontSize: 10,
    lineHeight: 15,
    color: colors.detailRowValue,
    textAlign: 'right',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  saveButton: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    fontFamily: fonts.dmSans550,
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
});

