// src/components/shell/ScreenShell.tsx
// App shell for routes outside the (tabs) group (SOS, Countdown, Emergency Active).
// CLAUDE.md / DESIGN-SPEC §15.7: top bar and tab bar on every screen; on these
// screens no tab is highlighted.

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { leaveToTab } from './navigation';
import { TopBar } from './TopBar';
import { BottomTabBar } from './BottomTabBar';
import { Toast } from '../ui/Toast';
import { useStore } from '../../state/store';
import { colors } from '../../theme/colors';

type TabKey = 'home' | 'device' | 'network' | 'map' | 'settings';

const TAB_ROUTES: Record<TabKey, string> = {
  home: '/',
  device: '/device',
  network: '/network',
  map: '/map',
  settings: '/settings',
};

export function ScreenShell({ title, children }: { title: string; children: React.ReactNode }) {
  const router = useRouter();
  const toast = useStore((s) => s.toast);
  const setToast = useStore((s) => s.setToast);
  const setModal = useStore((s) => s.setModal);

  return (
    <View style={styles.container}>
      <TopBar
        title={title}
        hasUnread
        onBellPress={() => setModal('notifications')}
        onAvatarPress={() => router.push('/(tabs)/settings' as any)}
      />
      <View style={styles.content}>{children}</View>
      <Toast message={toast} onDismiss={() => setToast('')} />
      <BottomTabBar activeTab={undefined} onTabPress={(t) => leaveToTab(router, TAB_ROUTES[t])} />
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
