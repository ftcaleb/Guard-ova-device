// src/components/modals/CallModal.tsx
// DESIGN-SPEC §9.9 & Reference screenshot: 58-modal-call-siyabonga.png
// Layout reference: design/layout/58-modal-call-siyabonga.json
// Modal: radius 18px, padding 30px 24px, bg white, border 1px #E5EAF3
// Contains:
// - Blue icon tile with phone icon (43×43, radius 8px, bg #EDF2FF)
// - Title "Call Siyabonga" (h2 21px / 750)
// - Text "This prototype demonstrates the call action. No real phone call will be placed." (12px #9AA4B3)
// - Primary button wide "Demonstrate call" + phone icon
// - On tap: toast "Call action demonstrated. No real call was made."

import React from 'react';
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

interface CallModalProps {
  visible: boolean;
  targetName?: string;
  onClose: () => void;
}

export function CallModal({
  visible,
  targetName = 'Siyabonga',
  onClose,
}: CallModalProps) {
  const notify = useStore((s) => s.notify);

  const handleDemonstrateCall = () => {
    onClose();
    notify('Call action demonstrated. No real call was made.');
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

          {/* Heading Icon Tile */}
          <View style={styles.headingIconTile}>
            <Icon name="phone" size={17} color={colors.blue} />
          </View>

          {/* Modal Title */}
          <Text style={styles.modalTitle}>Call {targetName}</Text>

          {/* Description */}
          <Text style={styles.modalSub}>
            This prototype demonstrates the call action. No real phone call will be placed.
          </Text>

          {/* Primary Action Button */}
          <Pressable
            style={styles.demonstrateButton}
            onPress={handleDemonstrateCall}
            accessibilityRole="button"
            accessibilityLabel="Demonstrate call"
          >
            <Icon name="phone" size={18} color="#FFFFFF" />
            <Text style={styles.demonstrateButtonText}>Demonstrate call</Text>
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
  headingIconTile: {
    width: 43,
    height: 43,
    borderRadius: 8,
    backgroundColor: colors.blueHeadingIconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 19,
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
  demonstrateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.blue,
    borderColor: colors.blue,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    minHeight: 48,
  },
  demonstrateButtonText: {
    fontFamily: fonts.dmSans550,
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
});

