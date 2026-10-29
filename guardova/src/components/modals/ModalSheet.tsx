// src/components/modals/ModalSheet.tsx
// DESIGN-SPEC §10.1: modal frame. Layout: design/layout/56-modal-call-emergency.json, 64-modal-end-emergency.json
// Backdrop #17223B45 + blur(6px), padding 18, centred; tapping it closes.
// Sheet: white, max 440 wide, border 1px #E5EAF3, radius 18, padding 30/24, shadow 0 20px 100px #18263724.
// Close ✕ 28×28 (padding 4, icon 20) at top 17 / right 17 inside the border.
// Heading-icon tile 43 (margin-bottom 19) · h2 21/31.5 ls −0.45 (margin-right 8) · p 12/22.8 #9AA4B3 (margin 13 0 23).

import React from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Icon, IconName } from '../Icon';

const TILES = {
  blue: { bg: colors.blueHeadingIconBg, icon: colors.blue },
  green: { bg: colors.greenHeadingIconBg, icon: colors.greenHeadingIcon },
};

interface ModalSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  tile?: { icon: IconName; tone: keyof typeof TILES };
  accessibilityLabel?: string;
  children?: React.ReactNode;
}

export function ModalSheet({
  visible,
  onClose,
  title,
  message,
  tile,
  accessibilityLabel = 'Guard’Ova confirmation',
  children,
}: ModalSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {Platform.OS !== 'web' && (
          <BlurView intensity={15} tint="default" style={StyleSheet.absoluteFill} />
        )}
        <Pressable
          style={[StyleSheet.absoluteFill, styles.backdropTint]}
          onPress={onClose}
          accessibilityLabel="Close dialog"
        />
        <View style={styles.sheet} accessibilityViewIsModal accessibilityLabel={accessibilityLabel}>
          <Pressable
            style={styles.close}
            onPress={onClose}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Close dialog"
          >
            <Icon name="close" size={20} color={colors.modalClose} />
          </Pressable>

          {tile && (
            <View style={[styles.tile, { backgroundColor: TILES[tile.tone].bg }]}>
              <Icon name={tile.icon} size={17} color={TILES[tile.tone].icon} />
            </View>
          )}

          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  backdropTint: {
    backgroundColor: colors.modalBackdrop,
    // Web: the exact CSS blur (HOW-TO-MATCH §4, "Blur").
    ...(Platform.OS === 'web' ? ({ backdropFilter: 'blur(6px)' } as object) : {}),
  },
  sheet: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '90%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.modalBorder,
    borderRadius: 18,
    paddingVertical: 30,
    paddingHorizontal: 24,
    boxShadow: '0px 20px 100px #18263724',
  },
  close: {
    position: 'absolute',
    top: 17,
    right: 17,
    padding: 4,
    zIndex: 1,
  },
  tile: {
    width: 43,
    height: 43,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 19,
  },
  title: {
    fontFamily: fonts.manrope750,
    fontSize: 21,
    lineHeight: 31.5,
    letterSpacing: -0.45,
    color: colors.ink,
    marginRight: 8,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  message: {
    fontFamily: fonts.dmSans400,
    fontSize: 12,
    lineHeight: 22.8,
    letterSpacing: 0,
    color: colors.modalText,
    marginTop: 13,
    marginBottom: 23,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
});
