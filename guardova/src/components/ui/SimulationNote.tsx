// src/components/ui/SimulationNote.tsx
// DESIGN-SPEC §7.9: centred demo note, #A1A8B1, optional 13px lock icon, gap 6px.
// Two sizes in use: 9px / lh 15.3 under focused layouts (layout/50), 10px / lh 17 elsewhere (layout/55).
// Demo-only (DESIGN-SPEC §15.8): renders nothing when DEMO_MODE is off.

import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle, Platform } from 'react-native';
import { DEMO_MODE } from '../../config';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Icon } from '../Icon';

export function SimulationNote({
  text,
  lock = false,
  small = false,
  style,
}: {
  text: string;
  lock?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  if (!DEMO_MODE) return null;
  return (
    <View style={[styles.row, style]}>
      {lock && <Icon name="lock" size={13} color={colors.simulationNote} />}
      <Text style={[styles.text, small ? styles.small : styles.regular]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  text: {
    fontFamily: fonts.dmSans400,
    letterSpacing: 0,
    color: colors.simulationNote,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  small: { fontSize: 9, lineHeight: 15.3 },
  regular: { fontSize: 10, lineHeight: 17 },
});
