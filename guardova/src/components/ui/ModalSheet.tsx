// src/components/ui/ModalSheet.tsx
// DESIGN-SPEC §10.1: modal frame. Values from design/layout/34-modal-invite-empty.json:
// backdrop #17223B45 (+ blur 6), padding 18, centred; sheet white, max 440 wide, radius 18,
// padding 30 / 24, border #E5EAF3, shadow 0 20 100 #18263724; close 28 × 28 at 18 / 18, icon 20 #A0AABB.
// Shared text styles: title h2 21 / 31.5, paragraph 12 / 22.8 #9AA4B3 (margin 13 / 23).
// Android back closes the modal (D20).

import React from 'react';
import { Modal, Pressable, View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Icon } from '../Icon';

const noPad = Platform.OS === 'android' ? { includeFontPadding: false } : {};

interface ModalSheetProps {
  visible: boolean;
  onClose: () => void;
  accessibilityLabel: string;
  children: React.ReactNode;
}

export function ModalSheet({ visible, onClose, accessibilityLabel, children }: ModalSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {Platform.OS === 'web' ? (
          <View style={[StyleSheet.absoluteFill, styles.webBlur]} />
        ) : (
          <BlurView intensity={15} tint="default" style={StyleSheet.absoluteFill} />
        )}
        <Pressable style={[StyleSheet.absoluteFill, styles.dim]} onPress={onClose} accessibilityLabel="Close dialog" />
        <View style={styles.sheet} accessibilityViewIsModal accessibilityLabel={accessibilityLabel}>
          <ScrollView bounces={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
          <Pressable style={styles.close} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close dialog">
            <Icon name="close" size={20} color={colors.modalClose} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export function ModalTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function ModalText({ children }: { children: React.ReactNode }) {
  return <Text style={styles.text}>{children}</Text>;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  // CSS backdrop-filter: blur(6px) — exact on web (HOW-TO-MATCH: expo-blur tints on web)
  webBlur: { backdropFilter: 'blur(6px)' } as object,
  dim: {
    backgroundColor: colors.modalBackdrop,
  },
  sheet: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '90%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.modalBorder,
    borderRadius: 18,
    overflow: 'hidden',
    boxShadow: '0px 20px 100px #18263724',
  },
  content: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  close: {
    position: 'absolute',
    top: 17,
    right: 17,
    width: 28,
    height: 28,
    padding: 4,
  },
  title: {
    fontFamily: fonts.manrope750,
    fontSize: 21,
    lineHeight: 31.5,
    letterSpacing: -0.45,
    color: colors.ink,
    marginRight: 8,
    ...noPad,
  },
  text: {
    fontFamily: fonts.dmSans400,
    fontSize: 12,
    lineHeight: 22.8,
    letterSpacing: 0,
    color: colors.modalText,
    marginTop: 13,
    marginBottom: 23,
    ...noPad,
  },
});
