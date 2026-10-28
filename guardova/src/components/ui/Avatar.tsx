// src/components/ui/Avatar.tsx
// DESIGN-SPEC §3.7 & §7.6: Avatar with 145deg gradient, white border, ring, presence dot
// LinearGradient start/end for 145 deg: start={x: 0.101, y: -0.070}, end={x: 0.899, y: 1.070}
// Online: #41967D, Away: #DFB554

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

export function Avatar({ member, size = 45, small = false }: AvatarProps) {
  const actualSize = small ? 35 : size;
  const config = GRADIENTS[member.color] || GRADIENTS.blue;
  const fontSize = small ? 11 : actualSize >= 90 ? 27 : 13;
  const presenceSize = 9;

  return (
    <View style={[styles.container, { width: actualSize, height: actualSize }]}>
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
            borderWidth: small ? 2 : 3,
          },
        ]}
      >
        <Text
          style={[
            styles.initials,
            {
              fontSize,
              color: config.textColor,
            },
          ]}
        >
          {member.initials}
        </Text>
      </LinearGradient>

      {/* Presence dot (online or away) */}
      {member.status !== 'Invited' && (
        <View
          style={[
            styles.dot,
            {
              width: presenceSize,
              height: presenceSize,
              borderRadius: presenceSize / 2,
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
  circle: {
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    // 0 0 0 1px #EEE outline simulated via shadow/subtle border in RN
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    elevation: 1,
  },
  initials: {
    fontFamily: fonts.manrope650,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  dot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

