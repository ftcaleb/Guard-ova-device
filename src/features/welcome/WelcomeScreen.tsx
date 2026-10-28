import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { colors, typography } from '../../theme/tokens';
import { Icon } from '../../components/Icon';
import { Avatar, Member } from '../../components/Avatar';

/**
 * Demo Network Circle for Step 2 Onboarding
 * Source: `design/DESIGN-SPEC.md` §11.1 (Demo user and members)
 */
const DEMO_MEMBERS: Member[] = [
  { name: 'Mom', initials: 'NM', relation: 'Family', color: 'rose', status: 'Online' },
  { name: 'Thabo', initials: 'TM', relation: 'Friend', color: 'blue', status: 'Online' },
  { name: 'Kabelo', initials: 'KM', relation: 'Brother', color: 'sage', status: 'Online' },
  { name: 'Lerato', initials: 'LM', relation: 'Friend', color: 'purple', status: 'Away' },
];

/**
 * Content definition for the 3 Onboarding Steps.
 * Copy source: `design/reference-prototype/src/App.tsx#L141`
 *
 * NOTE: Punctuation (curly apostrophes ’ and middle dots ·) must match verbatim.
 * Do not introduce manual newline characters (\n); allow the text container
 * to wrap at natural boundary widths to maintain 1:1 fidelity with Figma captures.
 */
const STEP_DATA = [
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
  /** Callback invoked when the user finishes Step 3 or taps "Skip introduction" */
  onComplete?: () => void;
}

/**
 * Guard'Ova Welcome / Onboarding Screen (3-Step Flow)
 *
 * Spec & Layout References:
 * - Spec: `design/DESIGN-SPEC.md` §9.12 (Welcome / Onboarding)
 * - Step 1: `design/layout/01-welcome-step1.json` & `design/screens/01-welcome-step1.png`
 * - Step 2: `design/layout/02-welcome-step2.json` & `design/screens/02-welcome-step2.png`
 * - Step 3: `design/layout/03-welcome-step3.json` & `design/screens/03-welcome-step3.png`
 * - Prototype JSX: `design/reference-prototype/src/App.tsx#L141`
 *
 * Visual Rules:
 * 1. Centered column with a strict max-width of 360 pt on mobile.
 * 2. Visual presentation area is fixed at 300 × 265 pt.
 * 3. Step 1: Tapping the 3D wearable graphic advances to Step 2 (demo affordance).
 * 4. Step 2: 250 × 250 pt network orbit with a 200 pt dashed ring (`inset: 25px`) and 4 avatars.
 * 5. Step 3: 175 pt circle with a 23 pt halo ring (`box-shadow: 0 0 0 23px #F0F4FB` translated to RN).
 */
export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  // Active onboarding step index: 0, 1, or 2
  const [onboardingStep, setOnboardingStep] = useState<number>(0);

  /**
   * Advances through steps 0 -> 1 -> 2.
   * On step 2, completing the flow transitions to the Home overview.
   */
  const handleNext = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(prev => prev + 1);
    } else {
      onComplete?.();
    }
  };

  /**
   * Immediately skips onboarding and redirects to Home overview.
   */
  const handleSkip = () => {
    onComplete?.();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeLayout}>
          {/* Section 1: Top Eyebrow Header */}
          <Text style={styles.eyebrow}>WELCOME TO GUARD’OVA</Text>

          {/* Section 2: Visual Graphic Container (Fixed 300 × 265 pt) */}
          <View style={styles.visualContainer}>
            {/* Step 1 Visual: Scaled 3D Wearable Device (Tap advances to step 2) */}
            {onboardingStep === 0 && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setOnboardingStep(1)}
                style={styles.wearableScene}
                accessibilityRole="button"
                accessibilityLabel="Wearable panic button. Tap to advance to step 2."
              >
                <Image
                  source={require('../../../design/assets/wearable-welcome.png')}
                  style={styles.wearableImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}

            {/* Step 2 Visual: 250×250 pt Network Orbit Ring + 4 Avatars */}
            {onboardingStep === 1 && (
              <View style={styles.networkOrbitContainer}>
                {/* 200 pt dashed orbit circle (inset: 25px within 250x250) */}
                <View style={styles.dashedOrbitCircle} />

                {/* Network Contact Avatars (Exact coordinates from Figma CSS: top, right, bottom, left) */}
                {/* Mom (Top: top 3px, left 95px) */}
                <View style={styles.avatarMom}>
                  <Avatar member={DEMO_MEMBERS[0]} size={60} />
                </View>

                {/* Thabo (Right: top 100px, right 0px) */}
                <View style={styles.avatarThabo}>
                  <Avatar member={DEMO_MEMBERS[1]} size={60} />
                </View>

                {/* Kabelo (Bottom: bottom 0px, left 95px) */}
                <View style={styles.avatarKabelo}>
                  <Avatar member={DEMO_MEMBERS[2]} size={60} />
                </View>

                {/* Lerato (Left: top 100px, left 0px) */}
                <View style={styles.avatarLerato}>
                  <Avatar member={DEMO_MEMBERS[3]} size={60} />
                </View>

                {/* Central Brand Shield (42pt SVG stroke in primary blue) */}
                <View style={styles.networkCenterShield}>
                  <Icon name="shield" size={42} color={colors.primary} />
                </View>
              </View>
            )}

            {/* Step 3 Visual: Connected Protection Shield with 23 pt Concentric Halo */}
            {onboardingStep === 2 && (
              <View style={styles.haloOuterRing}>
                <View style={styles.shieldInnerCircle}>
                  <Icon name="shield" size={90} color={colors.primaryShieldIcon} />
                </View>
              </View>
            )}
          </View>

          {/* Section 3: Dynamic Step Title (Manrope-750, 30pt) */}
          <Text style={styles.title}>{STEP_DATA[onboardingStep].title}</Text>

          {/* Section 4: Dynamic Step Sub-description (DM Sans 400, 12pt, line-height 1.9) */}
          <Text style={styles.description}>
            {STEP_DATA[onboardingStep].description}
          </Text>

          {/* Section 5: Pagination Dots Indicator */}
          {/* Active: 20×6 pt blue pill; Inactive: 6×6 pt circle with 7 pt spacing */}
          <View style={styles.dotsContainer}>
            {[0, 1, 2].map(index => {
              const isSelected = index === onboardingStep;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setOnboardingStep(index)}
                  style={[
                    styles.dot,
                    isSelected ? styles.dotSelected : styles.dotInactive,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Switch to onboarding step ${index + 1}`}
                />
              );
            })}
          </View>

          {/* Section 6: Primary Action CTA */}
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
            <Icon name="arrow" size={18} color={colors.white} />
          </TouchableOpacity>

          {/* Section 7: Secondary "Skip introduction" Action */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSkip}
            style={styles.skipButton}
            accessibilityRole="button"
            accessibilityLabel="Skip introduction and proceed to home"
          >
            <Text style={styles.skipButtonText}>Skip introduction</Text>
          </TouchableOpacity>

          {/* Section 8: Guard'Ova Ecosystem Footer Pipeline */}
          <View style={styles.ecosystemContainer}>
            <Icon name="shield" size={12} color={colors.textEcosystem} />
            <Text style={styles.ecosystemText}>Wearable</Text>
            <Icon name="arrow" size={12} color={colors.textEcosystem} />
            <Text style={styles.ecosystemText}>App</Text>
            <Icon name="arrow" size={12} color={colors.textEcosystem} />
            <Text style={styles.ecosystemText}>My Network</Text>
            <Icon name="arrow" size={12} color={colors.textEcosystem} />
            <Text style={styles.ecosystemText}>Response</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 21,
    paddingTop: 14,
    paddingBottom: 24,
  },
  welcomeLayout: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },

  // 1. Eyebrow
  eyebrow: {
    ...typography.welcome.eyebrow,
    textAlign: 'center',
    marginBottom: 10,
    includeFontPadding: false,
  },

  // 2. Visual Container: 300 x 265 pt canvas
  visualContainer: {
    width: 300,
    height: 265,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Step 1: Wearable Scene (scaled at 1.65 per index.css)
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

  // Step 2: Network Orbit Container (250 x 250 pt)
  networkOrbitContainer: {
    width: 250,
    height: 250,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Inset 25px on 250x250 = 200px diameter circle
  dashedOrbitCircle: {
    position: 'absolute',
    top: 25,
    left: 25,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.dashedRing,
    borderStyle: 'dashed',
  },
  // Avatar positions matching CSS nth-child rules in index.css:
  avatarMom: {
    position: 'absolute',
    top: 3,
    left: 95,
  },
  avatarThabo: {
    position: 'absolute',
    top: 100,
    right: 0,
  },
  avatarKabelo: {
    position: 'absolute',
    bottom: 0,
    left: 95,
  },
  avatarLerato: {
    position: 'absolute',
    top: 100,
    left: 0,
  },
  // Centered 60x60 container with 42pt shield SVG
  networkCenterShield: {
    position: 'absolute',
    top: 95,
    left: 95,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Step 3: Shield + Halo Ring
  // CSS box-shadow: 0 0 0 23px #F0F4FB emulated via concentric circle:
  // Outer halo diameter: 175 + (23 * 2) = 221 pt
  haloOuterRing: {
    width: 221,
    height: 221,
    borderRadius: 110.5,
    backgroundColor: colors.primaryHalo,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldInnerCircle: {
    width: 175,
    height: 175,
    borderRadius: 87.5,
    backgroundColor: colors.primaryShieldCircle,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 3. Title (30pt Manrope 750)
  title: {
    ...typography.welcome.title,
    textAlign: 'center',
    maxWidth: 360,
    marginTop: 0,
    marginBottom: 0,
    includeFontPadding: false,
  },

  // 4. Description (12pt DM Sans 400, line-height 1.9 = 22.8pt)
  description: {
    ...typography.welcome.description,
    textAlign: 'center',
    maxWidth: 360,
    marginVertical: 20,
    includeFontPadding: false,
  },

  // 5. Onboarding Dots (gap: 7px, margin: 10px 0 29px)
  dotsContainer: {
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
    backgroundColor: colors.dotsInactive,
  },
  dotSelected: {
    width: 20,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },

  // 6. Primary Action CTA Button (height 48pt, max-width 340pt, border-radius 10pt)
  primaryButton: {
    width: '100%',
    maxWidth: 340,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    ...typography.welcome.button,
    includeFontPadding: false,
  },

  // 7. Skip Introduction Button (10pt, color #235BE5, margin 20pt)
  skipButton: {
    marginVertical: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  skipButtonText: {
    ...typography.welcome.skipButton,
    includeFontPadding: false,
  },

  // 8. Ecosystem Pipeline Line (8pt, color #98A5B9, gap 6pt)
  ecosystemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
    marginBottom: 10,
  },
  ecosystemText: {
    ...typography.welcome.ecosystem,
    includeFontPadding: false,
  },
});
