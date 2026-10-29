// src/components/shell/TopBar.tsx
// Guard'Ova — App Shell: Top Bar
// DESIGN-SPEC §8.1: Height 66px, padding 0 22px, bg white, bottom border 1px #E9ECF0
// Left: breadcrumb ("My safety" › current page)
// Right: bell button (notifications) + avatar button (settings)

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Icon } from '../Icon';

interface TopBarProps {
  title: string;           // Current page title shown in breadcrumb
  onBellPress?: () => void;
  onAvatarPress?: () => void;
  hasUnread?: boolean;     // Whether to show the unread dot on the bell
}

/**
 * Guard'Ova Top Bar — shown on EVERY screen (CLAUDE.md rule).
 * 66 px high, sitting below the safe-area inset.
 * Left: "My safety" (muted) › chevron › "{title}" (current, 500)
 * Right: bell icon (with optional unread dot) + SN avatar circle
 */
export function TopBar({
  title,
  onBellPress,
  onAvatarPress,
  hasUnread = false,
}: TopBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        {/* ── LEFT: Breadcrumb ────────────────────────────────────── */}
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbParent}>My safety</Text>
          <Icon name="chevron" size={13} color="#BEC3CC" />
          <Text style={styles.breadcrumbCurrent} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* ── RIGHT: Bell + Avatar ─────────────────────────────────── */}
        <View style={styles.rightGroup}>
          {/* Bell button */}
          <Pressable
            style={styles.bellButton}
            onPress={onBellPress}
            accessibilityLabel="View notifications"
            accessibilityRole="button"
          >
            <Icon name="bell" size={20} color={colors.bell} />
            {hasUnread && <View style={styles.unreadDot} />}
          </Pressable>

          {/* Avatar/initials circle → opens Settings */}
          <Pressable
            style={styles.topAvatar}
            onPress={onAvatarPress}
            accessibilityLabel="Open settings"
            accessibilityRole="button"
          >
            <Text style={styles.topAvatarText}>SN</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 50,
  },
  inner: {
    // layout/*.json: header.topbar is 66 tall including its 1px bottom border
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  // Breadcrumb
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flex: 1,
    marginRight: 12,
  },
  breadcrumbParent: {
    fontFamily: fonts.dmSans400,
    fontSize: 10,
    lineHeight: 15,
    color: colors.breadcrumb,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  breadcrumbCurrent: {
    fontFamily: fonts.dmSans500,
    fontSize: 10,
    lineHeight: 15,
    color: colors.breadcrumbCurrent,
    flexShrink: 1,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  // Right side
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 17,
  },
  bellButton: {
    padding: 6,
    position: 'relative',
  },
  unreadDot: {
    // 5×5 blue dot with 1px white border, positioned at top-right of bell
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.blue,
    borderWidth: 1,
    borderColor: colors.surface,
    top: 5,
    right: 6,
  },
  topAvatar: {
    width: 31,
    height: 31,
    borderRadius: 15.5,
    backgroundColor: colors.topAvatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topAvatarText: {
    fontFamily: fonts.dmSans650,
    fontSize: 10,
    lineHeight: 15,
    color: colors.topAvatarInitials,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
});

