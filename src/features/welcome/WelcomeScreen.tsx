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

const DEMO_MEMBERS: Member[] = [
  { name: 'Mom', initials: 'NM', relation: 'Family', color: 'rose', status: 'Online' },
  { name: 'Thabo', initials: 'TM', relation: 'Friend', color: 'blue', status: 'Online' },
  { name: 'Kabelo', initials: 'KM', relation: 'Brother', color: 'sage', status: 'Online' },
  { name: 'Lerato', initials: 'LM', relation: 'Friend', color: 'purple', status: 'Away' },
];

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
  onComplete?: () => void;
}

/**
 * Guard'Ova 3-Step Welcome / Onboarding Screen
 * Visual reference: design/screens/01-welcome-step1.png, 02-welcome-step2.png, 03-welcome-step3.png
 * Layout spec: design/layout/01-welcome-step1.json, 02-welcome-step2.json, 03-welcome-step3.json
 * Code reference: design/reference-prototype/src/App.tsx#L141
 */
export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [onboardingStep, setOnboardingStep] = useState<number>(0);

  const handleNext = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(prev => prev + 1);
    } else {
      onComplete?.();
    }
  };

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
          {/* 1. Eyebrow */}
          <Text style={styles.eyebrow}>WELCOME TO GUARD’OVA</Text>

          {/* 2. Visual area: 300 × 265 pt */}
          <View style={styles.visualContainer}>
            {onboardingStep === 0 && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setOnboardingStep(1)}
                style={styles.wearableScene}
                accessibilityLabel="Wearable device preview. Tap to advance to step 2."
              >
                <Image
                  source={require('../../../design/assets/wearable-welcome.png')}
                  style={styles.wearableImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}

            {onboardingStep === 1 && (
              <View style={styles.networkOrbitContainer}>
                {/* 200x200 dashed circle (inset 25px within 250x250) */}
                <View style={styles.dashedOrbitCircle} />

                {/* 4 Network Member Avatars */}
                {/* Mom (Top) */}
                <View style={styles.avatarMom}>
                  <Avatar member={DEMO_MEMBERS[0]} size={60} />
                </View>
                {/* Thabo (Right) */}
                <View style={styles.avatarThabo}>
                  <Avatar member={DEMO_MEMBERS[1]} size={60} />
                </View>
                {/* Kabelo (Bottom) */}
                <View style={styles.avatarKabelo}>
                  <Avatar member={DEMO_MEMBERS[2]} size={60} />
                </View>
                {/* Lerato (Left) */}
                <View style={styles.avatarLerato}>
                  <Avatar member={DEMO_MEMBERS[3]} size={60} />
                </View>

                {/* Center Shield Icon */}
                <View style={styles.networkCenterShield}>
                  <Icon name="shield" size={42} color={colors.primary} />
                </View>
              </View>
            )}

            {onboardingStep === 2 && (
              <View style={styles.haloOuterRing}>
                <View style={styles.shieldInnerCircle}>
                  <Icon name="shield" size={90} color={colors.primaryShieldIcon} />
                </View>
              </View>
            )}
          </View>

          {/* 3. Title */}
          <Text style={styles.title}>{STEP_DATA[onboardingStep].title}</Text>

          {/* 4. Description */}
          <Text style={styles.description}>
            {STEP_DATA[onboardingStep].description}
          </Text>

          {/* 5. Onboarding Dots */}
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
                  accessibilityLabel={`Go to onboarding step ${index + 1}`}
                />
              );
            })}
          </View>

          {/* 6. Primary Action Button */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleNext}
            style={styles.primaryButton}
            accessibilityLabel={
              onboardingStep === 2 ? 'Enter my safety space' : 'Continue'
            }
          >
            <Text style={styles.primaryButtonText}>
              {onboardingStep === 2 ? 'Enter my safety space' : 'Continue'}
            </Text>
            <Icon name="arrow" size={18} color={colors.white} />
          </TouchableOpacity>

          {/* 7. Skip Introduction */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSkip}
            style={styles.skipButton}
          >
            <Text style={styles.skipButtonText}>Skip introduction</Text>
          </TouchableOpacity>

          {/* 8. Ecosystem Line */}
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
  },

  // 2. Visual Container: 300 x 265 pt
  visualContainer: {
    width: 300,
    height: 265,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Step 1: Wearable Scene
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

  // Step 2: Network Orbit Ring
  networkOrbitContainer: {
    width: 250,
    height: 250,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  // 175px circle + 23px halo => 175 + 46 = 221px outer ring
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

  // 3. Title
  title: {
    ...typography.welcome.title,
    textAlign: 'center',
    maxWidth: 360,
    marginTop: 0,
    marginBottom: 0,
  },

  // 4. Description
  description: {
    ...typography.welcome.description,
    textAlign: 'center',
    maxWidth: 360,
    marginVertical: 20,
    includeFontPadding: false,
  },

  // 5. Dots Indicator
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

  // 6. Primary Button
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
  },

  // 7. Skip Introduction Button
  skipButton: {
    marginVertical: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  skipButtonText: {
    ...typography.welcome.skipButton,
  },

  // 8. Ecosystem Line
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
  },
});
