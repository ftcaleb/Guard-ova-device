// src/components/ui/Avatar.tsx
// DESIGN-SPEC §3.7 & §7.6: Avatar with 145deg gradient, white border, 1px #EEE ring, presence dot
// LinearGradient start/end for 145 deg: start={x: 0.101, y: -0.070}, end={x: 0.899, y: 1.070}
// Online: #41967D, Away: #DFB554
// Sizes (design/layout): 45 home cards, 48 My Network, 35 small (2px border), 30 map list, 90 profile.
// The dot is 9 × 9 with a 2px white border, inside the avatar's white border (CSS bottom 0 / right 0 of the
// padding box), so its offset equals the border width. Invited members show the online dot too (refs 36, 37).

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Member } from '../../state/store';

interface AvatarProps {
  member: Member;
  size?: number; // default 45
  small?: boolean; // 35px
  showPresence?: boolean; // default true (map markers in the reference have no dot)
}

const GRADIENTS = {
  rose: {
    colors: [colors.avatarRoseStart, colors.avatarRoseEnd] as const,
    textColor: colors.avatarRoseInitials,
  },
  blue: {
    colors: [colors.avatarBlueStart, colors.avatarBlueEnd] as const,
    textColor: colors.avatarBlueInitials,
  },
  sage: {
    colors: [colors.avatarSageStart, colors.avatarSageEnd] as const,
    textColor: colors.avatarSageInitials,
  },
  purple: {
    colors: [colors.avatarPurpleStart, colors.avatarPurpleEnd] as const,
    textColor: colors.avatarPurpleInitials,
  },
};

// Initials size per avatar size (index.css: .avatar 13, .small 10, map list 9, My Network 14, profile 27)
function initialsSize(size: number) {
  if (size >= 90) return 27;
  if (size >= 48) return 14;
  if (size >= 45) return 13;
  if (size >= 35) return 10;
  return 9;
}

export function Avatar({ member, size = 45, small = false, showPresence = true }: AvatarProps) {
  const actualSize = small ? 35 : size;
  const config = GRADIENTS[member.color] || GRADIENTS.blue;
  const fontSize = initialsSize(actualSize);
  const borderWidth = actualSize <= 35 ? 2 : 3;
  const presenceSize = 9;

  return (
    <View style={[styles.container, { width: actualSize, height: actualSize }]}>
      {/* 0 0 0 1px #EEE outline ring, outside the box */}
      <View
        style={[
          styles.ring,
          { width: actualSize + 2, height: actualSize + 2, borderRadius: (actualSize + 2) / 2 },
        ]}
      />
      <LinearGradient
        colors={config.colors}
        start={{ x: 0.101, y: -0.07 }}
        end={{ x: 0.899, y: 1.07 }}
        style={[
          styles.circle,
          {
            width: actualSize,
            height: actualSize,
            borderRadius: actualSize / 2,
            borderWidth,
          },
        ]}
      >
        <Text
          style={[
            styles.initials,
            {
              fontSize,
              lineHeight: fontSize * 1.5,
              color: config.textColor,
            },
          ]}
        >
          {member.initials}
        </Text>
      </LinearGradient>

      {/* Presence dot (online or away) */}
      {showPresence && (
        <View
          style={[
            styles.dot,
            {
              width: presenceSize,
              height: presenceSize,
              borderRadius: presenceSize / 2,
              bottom: borderWidth,
              right: borderWidth,
              backgroundColor:
                member.status === 'Away'
                  ? colors.awayPresenceDot
                  : colors.onlinePresenceDot,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    top: -1,
    left: -1,
    borderWidth: 1,
    borderColor: colors.avatarRing,
  },
  circle: {
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: fonts.manrope650,
    letterSpacing: 0,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  dot: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
