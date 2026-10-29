// src/components/ui/Button.tsx
// DESIGN-SPEC §7.5: primary / secondary / danger buttons and the text button (link)
// Layout reference: design/layout/50-sos-activation.json (danger), 52 (secondary, text),
// 55-emergency-active.json (primary, danger, secondary)
// Shared base: radius 8, border 1px, padding 14px 20px, gap 10px, 12px / 550, min-height 44.
// Press: translateY(1px). Icons sit before the label, arrows after.

import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
  Platform,
} from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Icon, IconName } from '../Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

const VARIANTS: Record<ButtonVariant, { bg: string; border: string; text: string }> = {
  primary: { bg: colors.blue, border: colors.blue, text: '#FFFFFF' },
  secondary: { bg: colors.surface, border: colors.secondaryButtonBorder, text: colors.secondaryButtonText },
  danger: { bg: colors.red, border: colors.red, text: '#FFFFFF' },
};

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  variant?: ButtonVariant;
  icon?: IconName;     // before the label
  iconSize?: number;
  trailingIcon?: IconName; // after the label (arrows)
  trailingIconSize?: number;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  variant = 'primary',
  icon,
  iconSize = 18,
  trailingIcon,
  trailingIconSize = 16,
  style,
  ...pressable
}: ButtonProps) {
  const v = VARIANTS[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      {...pressable}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: v.bg, borderColor: v.border },
        pressed && styles.pressed,
        style,
      ]}
    >
      <ButtonContent
        label={label}
        color={v.text}
        icon={icon}
        iconSize={iconSize}
        trailingIcon={trailingIcon}
        trailingIconSize={trailingIconSize}
      />
    </Pressable>
  );
}

export function ButtonContent({
  label,
  color,
  icon,
  iconSize = 18,
  trailingIcon,
  trailingIconSize = 16,
}: {
  label: string;
  color: string;
  icon?: IconName;
  iconSize?: number;
  trailingIcon?: IconName;
  trailingIconSize?: number;
}) {
  return (
    <>
      {icon && <Icon name={icon} size={iconSize} color={color} />}
      <Text style={[styles.label, { color }]}>{label}</Text>
      {trailingIcon && <Icon name={trailingIcon} size={trailingIconSize} color={color} />}
    </>
  );
}

// ─── Text button (link) ─────────────────────────────────────────────────────
// 10px / 550 #235BE5, gap 9px, no padding, usually a trailing arrow.
export function TextButton({
  label,
  trailingIcon,
  trailingIconSize = 16,
  style,
  ...pressable
}: Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  trailingIcon?: IconName;
  trailingIconSize?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      {...pressable}
      style={({ pressed }) => [styles.textButton, pressed && styles.pressed, style]}
    >
      <Text style={styles.textButtonLabel}>{label}</Text>
      {trailingIcon && <Icon name={trailingIcon} size={trailingIconSize} color={colors.blue} />}
    </Pressable>
  );
}

// Used by HoldToActivateButton so both share one visual definition.
export const buttonStyles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    minHeight: 44,
  },
  pressed: {
    transform: [{ translateY: 1 }],
  },
});

export const buttonVariants = VARIANTS;

const styles = StyleSheet.create({
  ...buttonStyles,
  label: {
    fontFamily: fonts.dmSans550,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  textButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  textButtonLabel: {
    fontFamily: fonts.dmSans550,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
    color: colors.blue,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
});
