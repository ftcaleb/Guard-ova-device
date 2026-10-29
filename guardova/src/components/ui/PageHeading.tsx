// src/components/ui/PageHeading.tsx
// DESIGN-SPEC §8.3: eyebrow → h1 → paragraph, block margin-bottom 25.
// An optional action sits on its own line below (gap 20), as the 402 pt layout wraps it.
// Values: design/layout/30-network.json and 40-live-map.json.

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

const noPad = Platform.OS === 'android' ? { includeFontPadding: false } : {};

interface PageHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function PageHeading({ eyebrow, title, description, action }: PageHeadingProps) {
  return (
    <View style={styles.block}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginBottom: 25,
  },
  eyebrow: {
    fontFamily: fonts.dmSans650,
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 1.5,
    color: colors.eyebrow,
    marginBottom: 10,
    ...noPad,
  },
  title: {
    fontFamily: fonts.manrope750,
    fontSize: 26,
    lineHeight: 35.1,
    letterSpacing: -1,
    color: colors.ink,
    ...noPad,
  },
  description: {
    fontFamily: fonts.dmSans400,
    fontSize: 11,
    lineHeight: 19.8,
    letterSpacing: 0,
    color: colors.pageHeadingPara,
    marginTop: 9,
    ...noPad,
  },
  action: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
});
