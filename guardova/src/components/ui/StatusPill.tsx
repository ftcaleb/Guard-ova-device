// src/components/ui/StatusPill.tsx
// DESIGN-SPEC §7.3: Status pill
// Inline-flex, gap 6px, padding 5px 8px, radius 5px, 9px / 550, leading 5px dot.
// Default (OK): bg #EDF6F0, border #E3EFE7, text #368064, dot #30916E
// Warning: bg #FFF6DF, border #F5EBCA, text #A08129, dot #D3AC4F

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

interface StatusPillProps {
  label: string;
  variant?: 'ok' | 'warning';
}

export function StatusPill({ label, variant = 'ok' }: StatusPillProps) {
  const isWarning = variant === 'warning';

  return (
    <View style={[styles.pill, isWarning ? styles.pillWarning : styles.pillOk]}>
      <View style={[styles.dot, isWarning ? styles.dotWarning : styles.dotOk]} />
      <Text style={[styles.text, isWarning ? styles.textWarning : styles.textOk]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  pillOk: {
    backgroundColor: colors.greenPillBg,
    borderColor: colors.greenPillBorder,
  },
  pillWarning: {
    backgroundColor: colors.amberPillBg,
    borderColor: colors.amberPillBorder,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  dotOk: {
    backgroundColor: colors.greenPillDot,
  },
  dotWarning: {
    backgroundColor: colors.amberPillDot,
  },
  text: {
    fontFamily: fonts.dmSans550,
    fontSize: 9,
    lineHeight: 13.5, // pill 25.5 high (layout/31-profile-mom-online.json)
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  textOk: {
    color: colors.greenPillText,
  },
  textWarning: {
    color: colors.amberPillText,
  },
});

