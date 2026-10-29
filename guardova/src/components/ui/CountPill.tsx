// src/components/ui/CountPill.tsx
// DESIGN-SPEC §7.4: Count pill
// Inline after heading: "4/5". DM Sans 600 10px, bg #F2F4F8, text #5C6D81, "/5" in #A9B2C0 400.
// padding 4px 7px, radius 5px, margin-left 7px.

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

interface CountPillProps {
  current: number;
  total?: number;
}

export function CountPill({ current, total = 5 }: CountPillProps) {
  return (
    <View style={styles.pill}>
      <Text style={styles.current}>{current}</Text>
      <Text style={styles.slash}>/{total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F4F8',
    paddingVertical: 4,
    paddingHorizontal: 7,
    borderRadius: 5,
    marginLeft: 7,
  },
  current: {
    fontFamily: fonts.dmSans600,
    fontSize: 10,
    lineHeight: 15,
    color: '#5C6D81',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  slash: {
    fontFamily: fonts.dmSans400,
    fontSize: 10,
    lineHeight: 15,
    color: colors.countSlash,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
});

