// src/features/sos/SosFocusedLayout.tsx
// DESIGN-SPEC §9.6 / §9.7 — the focused, centred layout shared by SOS Activation and SOS Countdown.
// Layout reference: design/layout/50-sos-activation.json, 52-sos-countdown-3.json
//
//   y 109  label "EMERGENCY SOS · DEMO"   (main padding 28 + focused margin 15)
//   +70    orb 140 (halos 18 / 36 px as concentric circles, §15.3)
//   +58    h1 28 / 37.8, max-width 350
//   +17    p 12 / 21.6
//   +30    network strip: 35 px avatars overlapping 9 px, then the count line
//   +30    actions (children)
//          note (margin-top 35)

import React, { useEffect } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Avatar } from '../../components/ui/Avatar';
import { SimulationNote } from '../../components/ui/SimulationNote';
import { Icon } from '../../components/Icon';
import { useStore } from '../../state/store';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

const ORB = 140;
const HALO_INNER = ORB + 2 * 18; // 0 0 0 18px #F9EEEE
const HALO_OUTER = ORB + 2 * 36; // 0 0 0 36px #FCF5F5

/** "4 trusted people are here for you" — pluralised per decision D17. */
export function trustedPeopleLine(count: number) {
  return count === 1 ? '1 trusted person is here for you' : `${count} trusted people are here for you`;
}

function SosOrb({ countdown }: { countdown?: number }) {
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(0);
  const counting = countdown !== undefined;

  // orb-pulse 1s infinite: halos grow from 18/36 px to 24/46 px at 50 % (DESIGN-SPEC §5.4).
  useEffect(() => {
    if (!counting || reduceMotion) {
      cancelAnimation(pulse);
      pulse.value = 0;
      return;
    }
    pulse.value = withRepeat(withTiming(1, { duration: 500, easing: Easing.ease }), -1, true);
    return () => cancelAnimation(pulse);
  }, [counting, reduceMotion, pulse]);

  const innerHalo = useAnimatedStyle(() => ({
    transform: [{ scale: (HALO_INNER + 12 * pulse.value) / HALO_INNER }],
  }));
  const outerHalo = useAnimatedStyle(() => ({
    transform: [{ scale: (HALO_OUTER + 20 * pulse.value) / HALO_OUTER }],
  }));

  return (
    <View style={styles.orbBox}>
      <Animated.View style={[styles.halo, styles.haloOuter, outerHalo]} />
      <Animated.View style={[styles.halo, styles.haloInner, innerHalo]} />
      <View style={styles.orb}>
        {counting ? (
          <Text style={styles.orbNumber} accessibilityLiveRegion="assertive">
            {countdown}
          </Text>
        ) : (
          <Icon name="activity" size={64} color={colors.emergencyOrbNumber} />
        )}
      </View>
    </View>
  );
}

export function SosFocusedLayout({
  title,
  text,
  countdown,
  children,
}: {
  title: string;
  text: string;
  countdown?: number;
  children: React.ReactNode;
}) {
  const members = useStore((s) => s.members);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.focused}>
        <View style={styles.label}>
          <View style={styles.labelDot} />
          <Text style={styles.labelText}>EMERGENCY SOS · DEMO</Text>
        </View>

        <SosOrb countdown={countdown} />

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>

        <View style={styles.network}>
          <View style={styles.avatars}>
            {members.map((m) => (
              <View key={m.name} style={styles.avatarOverlap}>
                <Avatar member={m} small />
              </View>
            ))}
          </View>
          <Text style={styles.networkText}>{trustedPeopleLine(members.length)}</Text>
        </View>

        {children}

        <SimulationNote
          small
          lock
          text="This is a prototype. No real emergency services are contacted."
          style={styles.note}
        />
      </View>
    </ScrollView>
  );
}

const androidText = Platform.OS === 'android' ? { includeFontPadding: false } : {};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 28,
    paddingHorizontal: 21,
    paddingBottom: 100,
  },
  focused: {
    marginVertical: 15,
    alignItems: 'center',
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  labelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.emergencyLabelDot,
  },
  labelText: {
    fontFamily: fonts.dmSans650,
    fontSize: 9,
    lineHeight: 13.5,
    letterSpacing: 1.2,
    color: colors.emergencyLabelText,
    ...androidText,
  },
  orbBox: {
    width: ORB,
    height: ORB,
    marginTop: 70,
    marginBottom: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
  },
  haloOuter: {
    width: HALO_OUTER,
    height: HALO_OUTER,
    borderRadius: HALO_OUTER / 2,
    backgroundColor: colors.emergencyOrbHalo2,
  },
  haloInner: {
    width: HALO_INNER,
    height: HALO_INNER,
    borderRadius: HALO_INNER / 2,
    backgroundColor: colors.emergencyOrbHalo1,
  },
  orb: {
    width: ORB,
    height: ORB,
    borderRadius: ORB / 2,
    backgroundColor: colors.emergencyOrbFill,
    borderWidth: 1,
    borderColor: colors.emergencyOrbBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbNumber: {
    fontFamily: fonts.manrope650,
    fontSize: 70,
    lineHeight: 105,
    letterSpacing: 0,
    color: colors.emergencyOrbNumber,
    textAlign: 'center',
    ...androidText,
  },
  title: {
    maxWidth: 350,
    fontFamily: fonts.manrope750,
    fontSize: 28,
    lineHeight: 37.8,
    letterSpacing: -1.15,
    color: colors.ink,
    textAlign: 'center',
    ...androidText,
  },
  text: {
    marginTop: 17,
    fontFamily: fonts.dmSans400,
    fontSize: 12,
    lineHeight: 21.6,
    letterSpacing: 0,
    color: colors.sosBodyText,
    textAlign: 'center',
    ...androidText,
  },
  network: {
    marginVertical: 30,
    maxWidth: 280,
    alignItems: 'center',
  },
  avatars: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 3,
  },
  avatarOverlap: {
    marginLeft: -9,
  },
  networkText: {
    // row-gap 12 + margin-top 3; margin-bottom 5
    marginTop: 15,
    marginBottom: 5,
    fontFamily: fonts.dmSans400,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
    color: colors.sosNetworkText,
    textAlign: 'center',
    ...androidText,
  },
  note: {
    marginTop: 35,
  },
});
