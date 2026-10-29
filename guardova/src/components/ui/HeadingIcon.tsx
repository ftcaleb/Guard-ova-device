// src/components/ui/HeadingIcon.tsx
// DESIGN-SPEC §7.2: square icon tile, radius 8, icon 17 wide.
// Sizes: 30 (card headings), 40 (info cards), 43 (modals).

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { Icon, IconName } from '../Icon';

const VARIANTS = {
  blue: { bg: colors.blueHeadingIconBg, icon: colors.blue },
  green: { bg: colors.greenHeadingIconBg, icon: colors.greenHeadingIcon },
} as const;

interface HeadingIconProps {
  name: IconName;
  variant?: keyof typeof VARIANTS;
  size?: 30 | 40 | 43;
  style?: StyleProp<ViewStyle>;
}

export function HeadingIcon({ name, variant = 'blue', size = 30, style }: HeadingIconProps) {
  const v = VARIANTS[variant];
  return (
    <View style={[styles.tile, { width: size, height: size, backgroundColor: v.bg }, style]}>
      <Icon name={name} size={17} color={v.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
