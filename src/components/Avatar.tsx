import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

/**
 * Safe dynamic import for `expo-linear-gradient`.
 *
 * Senior Engineering Context:
 * The design spec (§15.2) mandates `expo-linear-gradient` for avatar rendering.
 * To prevent the component from throwing a catastrophic "Cannot find module" crash
 * during early development phases or before `npx expo install` is run, we dynamically
 * resolve the module with a graceful solid-color fallback.
 */
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
  /** Member entity containing name, initials, and assigned theme color */
  member: Member;
  /** Bounding box dimension (diameter) in dp/pt. Defaults to 60 for onboarding */
  size?: number;
}

/**
 * Guard'Ova Member Avatar Primitive
 *
 * Source: `design/DESIGN-SPEC.md` §7.6 & §15.2
 *
 * Visual & Mathematical Requirements:
 * 1. CSS 145° Gradient Mapping:
 *    Figma uses CSS `linear-gradient(145deg, ...)`. In CSS, 145° on a 1x1 square
 *    produces a gradient line of length 1.393x. In React Native's unit coordinate
 *    space [0, 1], this corresponds precisely to:
 *      start = { x: 0.101, y: -0.070 }
 *      end   = { x: 0.899, y: 1.070 }
 * 2. Border Hierarchy:
 *    The design specifies a 3px white inner border with an outer 1px #EEEEEE outline.
 *    Because React Native does not support CSS multi-borders or shadow-spread (`box-shadow: 0 0 0 1px #EEE`),
 *    this is achieved via nested concentric Views (`outerRing` + `innerCircle`).
 * 3. Typography:
 *    Initials are set in `Manrope-650` (17px on onboarding size 60, scaled proportionally).
 */
export function Avatar({ member, size = 60 }: AvatarProps) {
  const gradient = colors.avatar[member.color] || colors.avatar.blue;
  // Scaled font size: 17pt at size 60 (~29% of avatar diameter)
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
          start={{ x: 0.101, y: -0.07 }}
          end={{ x: 0.899, y: 1.07 }}
          style={[styles.innerCircle, containerStyle]}
        >
          {renderContent()}
        </LinearGradient>
      ) : (
        /* Graceful fallback when expo-linear-gradient is not yet installed in node_modules */
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
    // 1px #EEEEEE outer boundary ring (emulates Figma 0 0 0 1px #EEE outline)
    borderWidth: 1,
    borderColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  innerCircle: {
    // 3px solid white border separating avatar gradient from outer ring
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontFamily: 'Manrope-650',
    fontWeight: '600',
    textAlign: 'center',
    // Android font metric fix: prevents unwanted clipping on non-standard line-heights
    includeFontPadding: false,
  },
});
