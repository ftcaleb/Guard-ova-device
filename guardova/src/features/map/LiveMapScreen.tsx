// src/features/map/LiveMapScreen.tsx
// Live Map — DESIGN-SPEC §9.5
// Reference screenshots: 40-live-map.png (+ --full), 62-live-map-emergency.png (+ --full)
// Layout reference: design/layout/40-live-map.json
//
// A. Page heading + Secondary "My Network" action
// B. Map card: 400 pt map (YOU at centre, member markers), footer with location + sharing pill
// C. Member list: 2 columns → Member Profile
// D. Simulation note
// Approved addition D5: "← Back to the alert" when opened from Member Alert (route param from=alert).

import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Icon } from '../../components/Icon';
import { Avatar } from '../../components/ui/Avatar';
import { StatusPill } from '../../components/ui/StatusPill';
import { LiveMap } from '../../components/ui/LiveMap';
import { PageHeading } from '../../components/ui/PageHeading';
import { HeadingIcon } from '../../components/ui/HeadingIcon';
import { BackLink } from '../../components/ui/BackLink';
import { Button } from '../../components/ui/Button';
import { useStore, Member } from '../../state/store';
import { DESIGN_ADDITIONS } from '../../config';
import { memberProfileHref } from '../../navigation/routes';

const noPad = Platform.OS === 'android' ? { includeFontPadding: false } : {};

export function LiveMapScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string; member?: string }>();
  const members = useStore((s) => s.members);
  const emergency = useStore((s) => s.emergency);
  const setSelectedMember = useStore((s) => s.setSelectedMember);

  const fromAlert = DESIGN_ADDITIONS && params.from === 'alert' && !!params.member;

  const openProfile = (m: Member) => {
    setSelectedMember(m);
    router.push(memberProfileHref(m.name));
  };

  const backToAlert = () => {
    if (router.canGoBack()) router.back();
    else router.replace(`/alert/${encodeURIComponent(params.member ?? '')}`);
  };

  // Rows of two for the 2-column grid
  const rows: Member[][] = [];
  for (let i = 0; i < members.length; i += 2) rows.push(members.slice(i, i + 2));

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {fromAlert && <BackLink label="Back to the alert" onPress={backToAlert} />}

      <PageHeading
        eyebrow="CONNECTED, WHEREVER YOU ARE"
        title={emergency ? 'Your emergency. Live.' : 'Your people. In view.'}
        description={
          emergency
            ? 'Your location is being shared with your entire trusted network.'
            : 'A little reassurance, in real time. Only visible to your trusted circle.'
        }
        action={
          <Button
            label="My Network"
            icon="people"
            iconSize={18}
            variant="secondary"
            onPress={() => router.push('/(tabs)/network')}
          />
        }
      />

      {/* ─── Map card ──────────────────────────────────────────────── */}
      <View style={styles.mapCard}>
        <LiveMap large emergency={emergency} height={400} members={members} />
        <View style={styles.mapFooter}>
          <View style={styles.footerTop}>
            <HeadingIcon name="pin" />
            <View>
              <Text style={styles.place}>Rosebank, Johannesburg</Text>
              <Text style={styles.coords}>26.1467° S, 28.0436° E · Updated just now</Text>
            </View>
          </View>
          <View style={styles.pill}>
            <StatusPill label={emergency ? 'Emergency sharing active' : 'Location sharing active'} />
          </View>
        </View>
      </View>

      {/* ─── Member list (2 columns) ───────────────────────────────── */}
      <View style={styles.list}>
        {rows.map((row) => (
          <View key={row.map((m) => m.name).join('|')} style={styles.listRow}>
            {row.map((m) => (
              <Pressable
                key={m.name}
                style={styles.person}
                onPress={() => openProfile(m)}
                accessibilityRole="button"
                accessibilityLabel={m.name}
              >
                <Avatar member={m} size={30} />
                <View>
                  <Text style={styles.personName}>{m.name}</Text>
                  <Text style={styles.personSub}>
                    {m.status === 'Away' ? 'Last seen 12 min ago' : 'Live location available'}
                  </Text>
                </View>
                <View style={styles.chevron}>
                  <Icon name="chevron" size={13} color={colors.mapListChevron} />
                </View>
              </Pressable>
            ))}
            {row.length === 1 && <View style={styles.personSpacer} />}
          </View>
        ))}
      </View>

      <Text style={styles.note}>Illustrative prototype map. Locations are simulated, not real GPS data.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  content: {
    paddingTop: 28,
    paddingHorizontal: 21,
    paddingBottom: 100,
  },

  // Map card (no padding, overflow hidden)
  mapCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    overflow: 'hidden',
  },
  // Footer: padding 18, gap 10; the pill wraps to its own line, 40 in from the content edge
  mapFooter: {
    padding: 18,
    gap: 10,
  },
  footerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  place: {
    fontFamily: fonts.dmSans550,
    fontSize: 11,
    lineHeight: 16.5,
    // inline <strong> on the baseline of a 24 pt line box (16 px strut): 4.9 above, 2.6 below
    marginTop: 4.9,
    marginBottom: 2.6,
    letterSpacing: 0,
    color: colors.ink,
    ...noPad,
  },
  coords: {
    fontFamily: fonts.dmSans400,
    fontSize: 9,
    lineHeight: 13.5,
    letterSpacing: 0,
    color: colors.mapFooterSub,
    marginTop: 6,
    ...noPad,
  },
  pill: {
    marginLeft: 40,
  },

  // Member list: 2 columns, gap 10, margin-top 22
  list: {
    marginTop: 22,
    gap: 10,
  },
  listRow: {
    flexDirection: 'row',
    gap: 10,
  },
  person: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
  },
  personSpacer: {
    flex: 1,
  },
  personName: {
    fontFamily: fonts.dmSans550,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
    color: colors.ink,
    ...noPad,
  },
  personSub: {
    fontFamily: fonts.dmSans400,
    fontSize: 7,
    lineHeight: 10.5,
    letterSpacing: 0,
    color: colors.mapListSub,
    marginTop: 5,
    ...noPad,
  },
  chevron: {
    marginLeft: 'auto',
  },
  note: {
    fontFamily: fonts.dmSans400,
    fontSize: 10,
    lineHeight: 17,
    letterSpacing: 0,
    color: colors.simulationNote,
    textAlign: 'center',
    marginTop: 15,
    ...noPad,
  },
});
