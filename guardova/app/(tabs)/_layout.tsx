// app/(tabs)/_layout.tsx
// Shell layout for tabs: renders TopBar, Tab Content, BottomTabBar, and Toast
// Per CLAUDE.md: TopBar & BottomTabBar are present on every screen

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { TopBar } from '../../src/components/shell/TopBar';
import { BottomTabBar } from '../../src/components/shell/BottomTabBar';
import { Toast } from '../../src/components/ui/Toast';
import { useStore } from '../../src/state/store';
import { colors } from '../../src/theme/colors';

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const toast = useStore((s) => s.toast);
  const setToast = useStore((s) => s.setToast);
  const setModal = useStore((s) => s.setModal);

  // Determine active tab & breadcrumb title based on route
  const getTabInfo = () => {
    if (pathname.includes('/device')) {
      return { tab: 'device' as const, title: 'My Device' };
    }
    if (pathname.includes('/network')) {
      return { tab: 'network' as const, title: 'My Network' };
    }
    if (pathname.includes('/map')) {
      return { tab: 'map' as const, title: 'Live Map' };
    }
    if (pathname.includes('/settings')) {
      return { tab: 'settings' as const, title: 'Settings' };
    }
    return { tab: 'home' as const, title: 'Overview' };
  };

  const { tab, title } = getTabInfo();

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
      {/* Top Bar (Breadcrumbs, Bell, SN Avatar) */}
      <TopBar
        title={title}
        onBellPress={() => setModal('notifications')}
        onAvatarPress={() => router.push('/(tabs)/settings')}
      />

      {/* Screen contents */}
      <View style={styles.content}>
        <Slot />
      </View>

      {/* Toast alert message if active */}
      <Toast message={toast} onDismiss={() => setToast('')} />

      {/* Bottom frosted Tab Bar */}
      <BottomTabBar activeTab={tab} onTabPress={handleTabPress} />
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

