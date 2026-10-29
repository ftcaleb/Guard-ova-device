// guardova/app/welcome.tsx
// Route: /welcome
// Renders the 3-step onboarding flow (Lesedi's Screen 1).
// Per CLAUDE.md: Top bar and bottom tab bar on EVERY screen.
// Breadcrumb: "My safety › Welcome to Guard’Ova"

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { WelcomeScreen } from '../src/features/welcome';
import { TopBar } from '../src/components/shell/TopBar';
import { BottomTabBar } from '../src/components/shell/BottomTabBar';
import { Toast } from '../src/components/ui/Toast';
import { useStore } from '../src/state/store';
import { colors } from '../src/theme/colors';

export default function WelcomePage() {
  const router = useRouter();

  const toast = useStore((s) => s.toast);
  const setToast = useStore((s) => s.setToast);
  const setModal = useStore((s) => s.setModal);

  const handleTabPress = (t: 'home' | 'device' | 'network' | 'map' | 'settings') => {
    switch (t) {
      case 'home':
        router.replace('/(tabs)');
        break;
      case 'device':
        router.replace('/(tabs)/device');
        break;
      case 'network':
        router.replace('/(tabs)/network');
        break;
      case 'map':
        router.replace('/(tabs)/map');
        break;
      case 'settings':
        router.replace('/(tabs)/settings');
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar: My safety › Welcome to Guard’Ova */}
      <TopBar
        title="Welcome to Guard’Ova"
        onBellPress={() => setModal('notifications')}
        onAvatarPress={() => router.push('/(tabs)/settings')}
      />

      {/* Screen Content */}
      <View style={styles.content}>
        <WelcomeScreen
          onComplete={() => {
            router.replace('/(tabs)');
          }}
        />
      </View>

      {/* Floating Toast notification */}
      <Toast message={toast} onDismiss={() => setToast('')} />

      {/* Bottom Tab Bar (no tab highlighted on onboarding) */}
      <BottomTabBar activeTab={undefined} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
  },
});
