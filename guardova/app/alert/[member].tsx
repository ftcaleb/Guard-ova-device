// app/alert/[member].tsx
// Route entry for Network Member View (Member Alert Screen)
// Breadcrumb: "My safety › Network Member View"
// Per CLAUDE.md: Top bar and tab bar on every screen (no tab active)

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { TopBar } from '../../src/components/shell/TopBar';
import { BottomTabBar } from '../../src/components/shell/BottomTabBar';
import { Toast } from '../../src/components/ui/Toast';
import { MemberAlertScreen } from '../../src/features/alert/MemberAlertScreen';
import { useStore } from '../../src/state/store';
import { colors } from '../../src/theme/colors';

export default function MemberAlertPage() {
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
      {/* Top Bar: My safety › Network Member View */}
      <TopBar
        title="Network Member View"
        onBellPress={() => setModal('notifications')}
        onAvatarPress={() => router.push('/(tabs)/settings')}
      />

      {/* Screen Content */}
      <View style={styles.content}>
        <MemberAlertScreen />
      </View>

      {/* Toast Alert */}
      <Toast message={toast} onDismiss={() => setToast('')} />

      {/* Bottom Tab Bar (no tab highlighted) */}
      <BottomTabBar activeTab={undefined} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  content: {
    flex: 1,
  },
});

