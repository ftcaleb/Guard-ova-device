// src/components/ui/Toast.tsx
// DESIGN-SPEC §10.3 & layout/36-network-full-5of5.json: centred, content-sized (max width = screen − 30),
// 90 pt above the bottom, bg #283E38, border 1px #435950, radius 10, padding 14px 16px, gap 12,
// check 19 #A1D7B9 · 11 / 16.5 white text · close 16 #C2D5CD (8 pt extra margin), shadow 0 7 25 #18372926.
// Entry (DESIGN-SPEC §16 #2 fixed): opacity 0 → 1 and rise 13 pt, 200 ms ease.

import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Platform, Animated, Easing } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Icon } from '../Icon';

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!message) return;
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [message, progress]);

  if (!message) return null;

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [13, 0] });

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <Animated.View style={[styles.container, { opacity: progress, transform: [{ translateY }] }]} role="status">
        <Icon name="check" size={19} color={colors.toastCheck} />
        <Text style={styles.text}>{message}</Text>
        <Pressable onPress={onDismiss} hitSlop={8} accessibilityLabel="Dismiss notification" style={styles.close}>
          <Icon name="close" size={16} color={colors.toastClose} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 90,
    left: 15,
    right: 15,
    zIndex: 100,
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.toastBg,
    borderColor: colors.toastBorder,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0px 7px 25px #18372926',
  },
  text: {
    flexShrink: 1,
    fontFamily: fonts.dmSans400,
    fontSize: 11,
    lineHeight: 16.5,
    letterSpacing: 0,
    color: '#FFFFFF',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  close: {
    marginLeft: 8,
  },
});
