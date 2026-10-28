// src/components/ui/Toast.tsx
// DESIGN-SPEC §7.5 & §10: Toast component
// 10px radius, padding 14px 18px, bg #283E38, border 1px #435950, check #A1D7B9, close #C2D5CD
// Fixed on mobile at bottom 90px

import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Icon } from '../Icon';

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  if (!message) return null;

  return (
    <View style={styles.container} role="status">
      <View style={styles.iconWrap}>
        <Icon name="check" size={19} color={colors.toastCheck} />
      </View>
      <Text style={styles.text}>{message}</Text>
      <Pressable onPress={onDismiss} hitSlop={8} accessibilityLabel="Dismiss notification">
        <Icon name="close" size={16} color={colors.toastClose} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    left: 21,
    right: 21,
    zIndex: 100,
    backgroundColor: colors.toastBg,
    borderColor: colors.toastBorder,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#183729',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
  iconWrap: {
    flexShrink: 0,
  },
  text: {
    flex: 1,
    fontFamily: fonts.dmSans400,
    fontSize: 11,
    lineHeight: 16,
    color: '#FFFFFF',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
});

