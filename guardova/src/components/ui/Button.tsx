// src/components/ui/Button.tsx
// DESIGN-SPEC §7.5: primary / secondary / danger buttons and the text button (link).
// Base: radius 8, 12px / 550, padding 14px 20px, gap 10, 1px border (48 pt high, layout/30-network.json).
// Icons sit before the label; arrows after. `wide` = full width, otherwise content width (inline-flex).

import React from 'react';
import { Pressable, Text, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Icon, IconName } from '../Icon';

const noPad = Platform.OS === 'android' ? { includeFontPadding: false } : {};

type Variant = 'primary' | 'secondary' | 'danger';

const VARIANTS: Record<Variant, { bg: string; border: string; text: string }> = {
  primary: { bg: colors.blue, border: colors.blue, text: '#FFFFFF' },
  secondary: { bg: colors.surface, border: colors.secondaryButtonBorder, text: colors.secondaryButtonText },
  danger: { bg: colors.red, border: colors.red, text: '#FFFFFF' },
};

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: IconName;
  iconSize?: number;
  arrow?: boolean;       // trailing arrow, 17 pt
  wide?: boolean;
  compact?: boolean;     // side-by-side pair (.alert-buttons): 10 / 15, padding 12 / 8, gap 7
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, variant = 'primary', icon, iconSize = 17, arrow = false, wide = false, compact = false, style }: ButtonProps) {
  const v = VARIANTS[variant];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: v.bg, borderColor: v.border, alignSelf: wide ? 'stretch' : 'flex-start' },
        compact && styles.compact,
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon && <Icon name={icon} size={iconSize} color={v.text} />}
      <Text style={[styles.label, compact && styles.compactLabel, { color: v.text }]}>{label}</Text>
      {arrow && <Icon name="arrow" size={17} color={v.text} />}
    </Pressable>
  );
}

interface TextLinkProps {
  label: string;
  onPress: () => void;
  size?: 8 | 9 | 10;     // 9 in card headers, 8 in card footers
  arrowSize?: number;
  gap?: number;
  style?: StyleProp<ViewStyle>;
}

// Text button: no padding, blue, 550, trailing arrow (.text-button)
export function TextLink({ label, onPress, size = 10, arrowSize = 16, gap = 9, style }: TextLinkProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.textLink, { gap }, pressed && styles.pressed, style]}
    >
      <Text style={[styles.textLinkLabel, { fontSize: size, lineHeight: size * 1.5 }]}>{label}</Text>
      <Icon name="arrow" size={arrowSize} color={colors.blue} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  pressed: {
    transform: [{ translateY: 1 }],
  },
  compact: {
    flex: 1,
    alignSelf: 'auto',
    gap: 7,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  compactLabel: {
    fontSize: 10,
    lineHeight: 15,
  },
  label: {
    fontFamily: fonts.dmSans550,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: 'center',
    ...noPad,
  },
  textLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLinkLabel: {
    fontFamily: fonts.dmSans550,
    letterSpacing: 0,
    color: colors.blue,
    ...noPad,
  },
});
