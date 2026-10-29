// src/components/ui/BackLink.tsx
// DESIGN-SPEC §9.4: "← Back to My Network" (12px #8190A3, margin-bottom 23).
// Decision N2: the reference "←" is a browser fallback glyph, so it is drawn as an SVG measured from
// design/screens/31-profile-mom-online.png (ink x 2.3–9.3, centre y 11 within the 18 pt line; text starts at 15).

import React from 'react';
import { Pressable, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

const noPad = Platform.OS === 'android' ? { includeFontPadding: false } : {};

interface BackLinkProps {
  label: string;
  onPress: () => void;
}

export function BackLink({ label, onPress }: BackLinkProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`← ${label}`} style={styles.link}>
      <Svg width={15} height={18} viewBox="0 0 15 18">
        <Path
          d="M2.6 11h6.7M4.4 9.5 2.6 11l1.8 1.5"
          stroke={colors.backLink}
          strokeWidth={0.7}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: 4, // inline-block in a 24 pt line box: sits 4 below the content top (layout/31: y 98)
    marginBottom: 23,
  },
  label: {
    fontFamily: fonts.dmSans400,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
    color: colors.backLink,
    ...noPad,
  },
});
