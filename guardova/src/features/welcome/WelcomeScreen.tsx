// guardova/src/features/welcome/WelcomeScreen.tsx
// Guard'Ova — 3-Step Welcome / Onboarding Screen (Lesedi's Screen 1)
//
// Spec & Layout References:
// - DESIGN-SPEC §9.12 (Welcome / Onboarding — 3 steps)
// - design/layout/01-welcome-step1.json (wearable hero)
// - design/layout/02-welcome-step2.json (network orbit ring)
// - design/layout/03-welcome-step3.json (connected shield + halo)
// - design/screens/01-welcome-step1.png, 02, 03 (visual targets)
// - design/reference-prototype/src/App.tsx#L141 (exact JSX & copy)
//
// Visual Rules:
// 1. Centred column, max-width 520 (at 402 pt mobile, resolves to 360 usable).
// 2. Visual area fixed at 300 × 265 pt.
// 3. Step 1: wearable illustration from design/assets/ scaled 1.65 — tap advances.
// 4. Step 2: 250×250 pt orbit with 200 pt dashed ring (inset 25px), 4 avatars, centre shield.
// 5. Step 3: 175 pt inner circle + 23 pt halo ring, 90 pt shield icon.
// 6. Copy verbatim from App.tsx including curly apostrophes.
// 7. Top bar and tab bar visible (handled by ScreenShell wrapper in the route).

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Icon } from '../../components/Icon';
import { Avatar } from '../../components/ui/Avatar';
import { useStore, Member } from '../../state/store';

// ─── Demo Network Circle (exact copy from store/App.tsx §11.1) ────────────────
const DEMO_MEMBERS: Member[] = [
  { name: 'Mom', initials: 'NM', relation: 'Family', color: 'rose', status: 'Online' },
  { name: 'Thabo', initials: 'TM', relation: 'Friend', color: 'blue', status: 'Online' },
  { name: 'Kabelo', initials: 'KM', relation: 'Brother', color: 'sage', status: 'Online' },
  { name: 'Lerato', initials: 'LM', relation: 'Friend', color: 'purple', status: 'Away' },
];

// ─── Step Content (verbatim from App.tsx#L141) ────────────────────────────────
// NOTE: Do NOT retype these strings. They are character-for-character copies
// including the curly apostrophes (\u2019) and exact punctuation.
const STEP_CONTENT = [
  {
    title: 'Personal safety that moves with you.',
    description:
      'A discreet wearable. A connected app. The people you trust. Always by your side.',
  },
  {
    title: 'Your people. Your peace of mind.',
    description:
      'Create your private circle of up to five people. Share your safety status, and get support when it matters.',
  },
  {
    title: 'Small device. Connected protection.',
    description:
      'One press alerts your network and shares your live location. So help knows where to find you.',
  },
];

interface WelcomeScreenProps {
  /** Called when the user finishes step 3 or taps "Skip introduction" */
  onComplete?: () => void;
}

/**
 * Guard\u2019Ova 3-Step Welcome / Onboarding Screen
 *
 * Consumes the global Zustand store for `onboardingStep` state so the step
 * persists if the user navigates away and returns (e.g. via Settings →
 * "How Guard\u2019Ova works" link per DESIGN-SPEC §9.11).
 */
export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  // Read onboarding step from global store (matches prototype state §11.3)
  const onboardingStep = useStore((s) => s.onboardingStep);
  const setOnboardingStep = useStore((s) => s.setOnboardingStep);

  /** Advance through steps 0 → 1 → 2 → Home */
  const handleNext = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      onComplete?.();
    }
  };

  /** Skip directly to Home */
  const handleSkip = () => {
    onComplete?.();
  };

  const step = STEP_CONTENT[onboardingStep];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── 1. Eyebrow ─────────────────────────────────────────────────────── */}
      <Text style={styles.eyebrow}>WELCOME TO GUARD\u2019OVA</Text>

      {/* ── 2. Visual Area (300 × 265 pt) ──────────────────────────────────── */}
      <View style={styles.visualContainer}>
        {/* Step 0: Wearable illustration (tap advances to step 1) */}
        {onboardingStep === 0 && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setOnboardingStep(1)}
            style={styles.wearableScene}
            accessibilityRole="button"
            accessibilityLabel="Wearable device. Tap to continue."
          >
            <Image
              source={require('../../../assets/images/wearable-welcome.png')}
              style={styles.wearableImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {/* Step 1: 250×250 pt Network Orbit Ring + 4 Avatars + Centre Shield */}
        {onboardingStep === 1 && (
          <View style={styles.networkOrbit}>
            {/* 200 pt dashed orbit circle (inset 25px within 250×250) */}
            <View style={styles.dashedCircle} />

            {/* Mom (Top): top 3, left 95 */}
            <View style={[styles.avatarPos, { top: 3, left: 95 }]}>
              <Avatar member={DEMO_MEMBERS[0]} size={60} />
            </View>
            {/* Thabo (Right): top 100, right 0 */}
            <View style={[styles.avatarPos, { top: 100, right: 0 }]}>
              <Avatar member={DEMO_MEMBERS[1]} size={60} />
            </View>
            {/* Kabelo (Bottom): bottom 0, left 95 */}
            <View style={[styles.avatarPos, { bottom: 0, left: 95 }]}>
              <Avatar member={DEMO_MEMBERS[2]} size={60} />
            </View>
            {/* Lerato (Left): top 100, left 0 */}
            <View style={[styles.avatarPos, { top: 100, left: 0 }]}>
              <Avatar member={DEMO_MEMBERS[3]} size={60} />
            </View>

            {/* Centre shield icon (42 pt, primary blue) */}
            <View style={styles.centreShield}>
              <Icon name="shield" size={42} color={colors.blue} />
            </View>
          </View>
        )}

        {/* Step 2: 175 pt circle + 23 pt halo ring, 90 pt shield */}
        {/* CSS: box-shadow: 0 0 0 23px #F0F4FB → concentric outer View */}
        {onboardingStep === 2 && (
          <View style={styles.haloRing}>
            <View style={styles.shieldCircle}>
              <Icon name="shield" size={90} color="#5383E6" />
            </View>
          </View>
        )}
      </View>

      {/* ── 3. Title (30 pt Manrope-750, ink) ──────────────────────────────── */}
      <Text style={styles.title}>{step.title}</Text>

      {/* ── 4. Description (12 pt DM Sans 400, #98A2B0, lh 1.9) ────────────── */}
      <Text style={styles.description}>{step.description}</Text>

      {/* ── 5. Onboarding Dots (gap 7, margin 10 0 29) ─────────────────────── */}
      <View style={styles.dotsRow}>
        {[0, 1, 2].map((i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setOnboardingStep(i)}
            style={[
              styles.dot,
              i === onboardingStep ? styles.dotActive : styles.dotInactive,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Step ${i + 1}`}
          />
        ))}
      </View>

      {/* ── 6. Primary Button (340 × 48 pt, #235BE5, radius 10) ────────────── */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handleNext}
        style={styles.primaryButton}
        accessibilityRole="button"
        accessibilityLabel={
          onboardingStep === 2 ? 'Enter my safety space' : 'Continue'
        }
      >
        <Text style={styles.primaryButtonText}>
          {onboardingStep === 2 ? 'Enter my safety space' : 'Continue'}
        </Text>
        <Icon name="arrow" size={18} color="#FFFFFF" />
      </TouchableOpacity>

      {/* ── 7. Skip Introduction ────────────────────────────────────────────── */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleSkip}
        style={styles.skipButton}
        accessibilityRole="button"
        accessibilityLabel="Skip introduction"
      >
        <Text style={styles.skipText}>Skip introduction</Text>
      </TouchableOpacity>

      {/* ── 8. Ecosystem Footer (8 pt, #98A5B9, gap 6) ─────────────────────── */}
      <View style={styles.ecosystem}>
        <Icon name="shield" size={12} color={colors.eyebrow} />
        <Text style={styles.ecoText}>Wearable</Text>
        <Icon name="arrow" size={12} color={colors.eyebrow} />
        <Text style={styles.ecoText}>App</Text>
        <Icon name="arrow" size={12} color={colors.eyebrow} />
        <Text style={styles.ecoText}>My Network</Text>
        <Icon name="arrow" size={12} color={colors.eyebrow} />
        <Text style={styles.ecoText}>Response</Text>
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
// All values from design/layout/01-welcome-step1.json and index.css
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 21,
    paddingTop: 10,
    paddingBottom: 85,
  },

  // 1. Eyebrow: 9px DMSans-550, #929AA5, uppercase
  eyebrow: {
    fontFamily: fonts.dmSans550,
    fontSize: 9,
    lineHeight: 13.5,
    letterSpacing: 1.2,
    color: colors.eyebrow,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 10,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // 2. Visual container: 300 × 265 pt
  visualContainer: {
    width: 300,
    height: 265,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Step 0: Wearable scene (scaled 1.65 in CSS → bounding box 288.75 × 255.75)
  wearableScene: {
    width: 288.75,
    height: 255.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wearableImage: {
    width: '100%',
    height: '100%',
  },

  // Step 1: Network orbit (250 × 250 pt)
  networkOrbit: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  // Dashed orbit ring: inset 25px → 200 × 200 pt circle
  dashedCircle: {
    position: 'absolute',
    top: 25,
    left: 25,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#CEDAF1',
    borderStyle: 'dashed',
  },
  // Shared positioning style for the 4 avatars
  avatarPos: {
    position: 'absolute',
  },
  // Centre shield: 60 × 60 at top 95, left 95
  centreShield: {
    position: 'absolute',
    top: 95,
    left: 95,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Step 2: Halo ring (175 + 23×2 = 221 pt outer)
  // Emulates CSS: box-shadow: 0 0 0 23px #F0F4FB
  haloRing: {
    width: 221,
    height: 221,
    borderRadius: 110.5,
    backgroundColor: '#F0F4FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Inner shield circle: 175 × 175 pt, bg #EDF3FE
  shieldCircle: {
    width: 175,
    height: 175,
    borderRadius: 87.5,
    backgroundColor: '#EDF3FE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 3. Title: 30px Manrope-750, ink, lh 40.5
  title: {
    fontFamily: fonts.manrope750,
    fontSize: 30,
    lineHeight: 40.5,
    letterSpacing: -0.5,
    color: colors.ink,
    textAlign: 'center',
    maxWidth: 360,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // 4. Description: 12px DMSans-400, #98A2B0, lh 22.8 (1.9×), margin 20 0
  description: {
    fontFamily: fonts.dmSans400,
    fontSize: 12,
    lineHeight: 22.8,
    color: '#98A2B0',
    textAlign: 'center',
    maxWidth: 360,
    marginVertical: 20,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // 5. Onboarding dots: gap 7, margin 10 0 29
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 10,
    marginBottom: 29,
  },
  dot: {
    height: 6,
  },
  dotInactive: {
    width: 6,
    borderRadius: 3,
    backgroundColor: '#DCE3EE',
  },
  dotActive: {
    width: 20,
    borderRadius: 5,
    backgroundColor: colors.blue,
  },

  // 6. Primary button: max-width 340, height 48, bg blue, radius 10
  primaryButton: {
    width: '100%',
    maxWidth: 340,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontFamily: fonts.dmSans550,
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // 7. Skip introduction: 10px DMSans-550, blue, margin 20
  skipButton: {
    marginVertical: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  skipText: {
    fontFamily: fonts.dmSans550,
    fontSize: 10,
    lineHeight: 15,
    color: colors.blue,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // 8. Ecosystem: 8px DMSans-550, #98A5B9, gap 6, margin-top 30
  ecosystem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  ecoText: {
    fontFamily: fonts.dmSans550,
    fontSize: 8,
    lineHeight: 12,
    color: '#98A5B9',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
});
