// src/components/shell/BottomTabBar.tsx
// Guard'Ova — App Shell: Bottom Tab Bar
// DESIGN-SPEC §8.2: position fixed bottom, frosted bg #FFFFFFED, blur 15px, top border 1px #E8ECF3
// 5 tabs: Home · Device · Network · Map · Settings
// Inactive: #A1AABA — Active: #235BE5
// Per CLAUDE.md: tab bar on EVERY screen, only the exact matching screen highlights its tab

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Icon, IconName } from '../Icon';

type TabKey = 'home' | 'device' | 'network' | 'map' | 'settings';

interface TabItem {
  key: TabKey;
  icon: IconName;
  label: string;
}

const TABS: TabItem[] = [
  { key: 'home',     icon: 'home',     label: 'Home'     },
  { key: 'device',   icon: 'shield',   label: 'Device'   },
  { key: 'network',  icon: 'people',   label: 'Network'  },
  { key: 'map',      icon: 'pin',      label: 'Map'      },
  { key: 'settings', icon: 'settings', label: 'Settings' },
];

interface BottomTabBarProps {
  activeTab?: TabKey;         // Which tab is currently highlighted
  onTabPress: (tab: TabKey) => void;
}

/**
 * Guard'Ova bottom tab bar.
 * Frosted glass (BlurView) with #FFFFFFED overlay.
 * 5 tabs, each column: 21px icon + 8px label.
 * Padding bottom = max(12, safe-area-inset-bottom).
 */
export function BottomTabBar({ activeTab, onTabPress }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(12, insets.bottom);

  return (
    <View style={styles.wrapper}>
      {/* Frosted glass — expo-blur. On web use plain bg per HOW-TO-MATCH lesson */}
      {Platform.OS !== 'web' ? (
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
      ) : null}

      {/* Semi-transparent overlay to match #FFFFFFED */}
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      {/* Top border */}
      <View style={styles.topBorder} />

      {/* Tab items */}
      <View style={[styles.row, { paddingBottom: bottomPad }]}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const color = isActive ? colors.blue : colors.tabInactive;
          return (
            <Pressable
              key={tab.key}
              style={styles.tabItem}
              onPress={() => onTabPress(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
            >
              <Icon name={tab.icon} size={21} color={color} />
              <Text style={[styles.tabLabel, { color }]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: '#FFFFFFED',
    // Web: the exact CSS backdrop-filter: blur(15px) (HOW-TO-MATCH §4: expo-blur tints on web)
    ...(Platform.OS === 'web' ? ({ backdropFilter: 'blur(15px)' } as object) : {}),
  },
  topBorder: {
    height: 1,
    backgroundColor: '#E8ECF3',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingHorizontal: 9,
  },
  tabItem: {
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tabLabel: {
    fontFamily: fonts.dmSans400,
    fontSize: 8,
    lineHeight: 12,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
});

