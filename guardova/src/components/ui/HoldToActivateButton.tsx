// src/components/ui/HoldToActivateButton.tsx
// Shared hold-to-activate button for safety-critical actions (SOS).
// Looks exactly like the regular Button of the same variant (DESIGN-SPEC §7.5,
// layout/50-sos-activation.json "Activate SOS"): the hold has no extra visual cue
// (decision recorded in design/OPEN-DECISIONS.md). Only the normal 1px press offset shows.
//
// Behaviour:
// - `onActivate` fires only after the press has been held for `holdMs`.
// - An ordinary tap, a short press, or sliding the finger off the button does nothing.
// - Screen readers: the button exposes a "longpress" action (VoiceOver / TalkBack
//   double-tap-and-hold), never a plain "activate", so it cannot fire on a single tap there either.

import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { SOS_HOLD_MS } from '../../config';
import { IconName } from '../Icon';
import { ButtonContent, ButtonVariant, buttonStyles, buttonVariants } from './Button';

interface HoldToActivateButtonProps {
  label: string;
  onActivate: () => void;
  holdMs?: number;
  variant?: ButtonVariant;
  icon?: IconName;
  iconSize?: number;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function HoldToActivateButton({
  label,
  onActivate,
  holdMs = SOS_HOLD_MS,
  variant = 'danger',
  icon,
  iconSize,
  accessibilityHint = 'Press and hold to activate',
  style,
  testID,
}: HoldToActivateButtonProps) {
  const v = buttonVariants[variant];
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityActions={[{ name: 'longpress', label: accessibilityHint }]}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === 'longpress') onActivate();
      }}
      delayLongPress={holdMs}
      onLongPress={onActivate}
      style={({ pressed }) => [
        buttonStyles.base,
        { backgroundColor: v.bg, borderColor: v.border },
        pressed && buttonStyles.pressed,
        style,
      ]}
    >
      <ButtonContent label={label} color={v.text} icon={icon} iconSize={iconSize} />
    </Pressable>
  );
}
