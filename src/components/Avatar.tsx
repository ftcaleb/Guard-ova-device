import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

// Safe dynamic import to allow graceful fallback if expo-linear-gradient
// is not yet installed in the current environment
let LinearGradient: any = null;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch {
  LinearGradient = null;
}

export interface Member {
  name: string;
  initials: string;
  relation: string;
  status: 'Online' | 'Away' | 'Invited';
  color: 'rose' | 'blue' | 'sage' | 'purple';
}

interface AvatarProps {
  member: Member;
  size?: number; // default 60 for onboarding
}

/**
 * Guard'Ova Avatar Component
 * Meets design/DESIGN-SPEC.md §7.6 & §15.2
 * Uses expo-linear-gradient with CSS 145deg mapping (start: 0.101,-0.07, end: 0.899,1.07).
 * Gracefully falls back to solid tint if the native module is not yet installed.
 */
export function Avatar({ member, size = 60 }: AvatarProps) {
  const gradient = colors.avatar[member.color] || colors.avatar.blue;
  const fontSize = size === 60 ? 17 : Math.round(size * 0.29);

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const renderContent = () => (
    <Text
      style={[
        styles.initials,
        {
          fontSize,
          color: gradient.text,
          lineHeight: fontSize * 1.2,
        },
      ]}
    >
      {member.initials}
    </Text>
  );

  return (
    <View style={[styles.outerRing, containerStyle]}>
      {LinearGradient ? (
        <LinearGradient
          colors={[gradient.from, gradient.to]}
          // CSS 145deg angle mapped to RN unit square coordinates:
          start={{ x: 0.101, y: -0.07 }}
          end={{ x: 0.899, y: 1.07 }}
          style={[styles.innerCircle, containerStyle]}
        >
          {renderContent()}
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.innerCircle,
            containerStyle,
            { backgroundColor: gradient.from },
          ]}
        >
          {renderContent()}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerRing: {
    // 1px #EEEEEE outer outline ring + 3px white border inside
    borderWidth: 1,
    borderColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  innerCircle: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontFamily: 'Manrope-650',
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
  },
});
