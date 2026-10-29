// src/features/network/NetworkScreen.tsx
// My Network — DESIGN-SPEC §9.3
// Reference screenshots: 30-network.png (+ --full), 36-network-full-5of5.png
// Layout reference: design/layout/30-network.json
//
// A. Page heading: "YOUR PRIVATE SAFETY CIRCLE" / "My Network — n/5"
// B. Full network card: member tiles (48 pt avatars), Add tile while under 5 (hidden at 5/5, decision N6),
//    footer "Your circle is private. Always." + "View live map →"
// C. Two info cards: "Closer, even from a distance." · "Trust is the connection."
// D1 (approved addition): "Location on / off" line under each member's status

import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Icon } from '../../components/Icon';
import { Avatar } from '../../components/ui/Avatar';
import { CountPill } from '../../components/ui/CountPill';
import { PageHeading } from '../../components/ui/PageHeading';
import { HeadingIcon } from '../../components/ui/HeadingIcon';
import { Button, TextLink } from '../../components/ui/Button';
import { useStore, Member, MAX_MEMBERS } from '../../state/store';
import { DESIGN_ADDITIONS } from '../../config';
import { memberProfileHref } from '../../navigation/routes';

const noPad = Platform.OS === 'android' ? { includeFontPadding: false } : {};

export function NetworkScreen() {
  const router = useRouter();
  const members = useStore((s) => s.members);
  const setSelectedMember = useStore((s) => s.setSelectedMember);
  const setModal = useStore((s) => s.setModal);

  const free = MAX_MEMBERS - members.length;

  const openProfile = (m: Member) => {
    setSelectedMember(m);
    router.push(memberProfileHref(m.name));
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <PageHeading
        eyebrow="YOUR PRIVATE SAFETY CIRCLE"
        title={`My Network — ${members.length}/5`}
        description="The people who have your back. Wherever life takes you."
      />

      {/* ─── Full network card ─────────────────────────────────────── */}
      <View style={styles.networkCard}>
        <View style={styles.cardHeading}>
          <HeadingIcon name="people" />
          <View style={styles.titleRow}>
            {/* The prototype has a space before the count pill: "My Network <span class=count>" */}
            <Text style={styles.cardTitle}>My Network </Text>
            {/* inline span: sits 1.45 below the h2 line top, not centred (layout/30-network.json) */}
            <View style={styles.countPill}>
              <CountPill current={members.length} total={5} />
            </View>
          </View>
          <TextLink label="Manage network" size={9} gap={6} onPress={() => router.push('/(tabs)/settings')} />
        </View>

        <Text style={styles.cardDescription}>
          People you trust who can see your safety status and receive emergency alerts.
        </Text>

        <View style={styles.membersRow}>
          {members.map((m) => (
            <Pressable
              key={m.name}
              style={styles.memberTile}
              onPress={() => openProfile(m)}
              accessibilityRole="button"
              accessibilityLabel={`${m.name}, ${m.status}`}
            >
              <Avatar member={m} size={48} />
              <Text style={styles.memberName} numberOfLines={1}>
                {m.name}
              </Text>
              <Text style={[styles.memberStatus, m.status === 'Away' && styles.memberStatusAway]} numberOfLines={1}>
                {m.status}
              </Text>
              {DESIGN_ADDITIONS && (
                <View style={styles.locationLine}>
                  <View style={[styles.locationDot, m.status === 'Invited' && styles.locationDotOff]} />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {m.status === 'Invited' ? 'Location off' : 'Location on'}
                  </Text>
                </View>
              )}
            </Pressable>
          ))}

          {free > 0 && (
            <Pressable
              style={styles.memberTile}
              onPress={() => setModal('invite')}
              accessibilityRole="button"
              accessibilityLabel="Add member"
            >
              <View style={styles.addAvatar}>
                <Icon name="plus" size={20} color={colors.addMemberPlusIcon} />
              </View>
              <Text style={[styles.memberName, styles.addLabel]} numberOfLines={1}>
                Add member
              </Text>
              <Text style={[styles.memberStatus, styles.addSub]} numberOfLines={1}>
                {free} {free === 1 ? 'spot' : 'spots'} available
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.privateNote}>
          <Icon name="lock" size={14} color={colors.privateNote} />
          <Text style={styles.privateNoteText}>Your circle is private. Always.</Text>
          <TextLink
            label="View live map"
            size={8}
            arrowSize={15}
            onPress={() => router.push('/(tabs)/map')}
            style={styles.pushRight}
          />
        </View>
      </View>

      {/* ─── Info cards ────────────────────────────────────────────── */}
      <View style={styles.infoCards}>
        <View style={styles.infoCard}>
          <HeadingIcon name="pin" size={40} style={styles.infoIcon} />
          <Text style={styles.infoTitle}>Closer, even from a distance.</Text>
          <Text style={styles.infoText}>
            Your trusted people can see your shared location and safety status. In an emergency, they’ll know exactly where to find you.
          </Text>
          <Button label="Open network live map" arrow onPress={() => router.push('/(tabs)/map')} />
        </View>

        <View style={styles.infoCard}>
          <HeadingIcon name="lock" variant="green" size={40} style={styles.infoIcon} />
          <Text style={styles.infoTitle}>Trust is the connection.</Text>
          <Text style={styles.infoText}>
            No followers. No public profiles. Just up to five people you choose, with permissions you control.
          </Text>
          <Button
            label="Manage sharing permissions"
            variant="secondary"
            arrow
            onPress={() => router.push('/(tabs)/settings')}
          />
        </View>
      </View>
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

  // Full network card (padding 22 / 20 / 0)
  networkCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingTop: 22,
    paddingHorizontal: 20,
  },
  cardHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: fonts.manrope750,
    fontSize: 15,
    lineHeight: 22.5,
    letterSpacing: -0.45,
    color: colors.ink,
    ...noPad,
  },
  countPill: {
    paddingTop: 1.4,
  },
  cardDescription: {
    fontFamily: fonts.dmSans400,
    fontSize: 11,
    lineHeight: 20.35,
    letterSpacing: 0,
    color: colors.cardDescription,
    marginTop: 13,
    ...noPad,
  },

  // Member tiles (padding 35 vertical, gap 3, five equal columns)
  membersRow: {
    flexDirection: 'row',
    gap: 3,
    paddingVertical: 35,
  },
  memberTile: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
  },
  memberName: {
    fontFamily: fonts.dmSans550,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
    color: colors.ink,
    marginTop: 13,
    maxWidth: '100%',
    textAlign: 'center',
    ...noPad,
  },
  memberStatus: {
    fontFamily: fonts.dmSans400,
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 0,
    color: colors.memberStatusText,
    marginTop: 5,
    textAlign: 'center',
    ...noPad,
  },
  memberStatusAway: {
    color: colors.awayText,
  },
  addAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.addMemberDashedBorder,
    backgroundColor: colors.addMemberTileBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLabel: {
    color: colors.addMemberLabel,
  },
  addSub: {
    color: colors.addMemberSubLabel,
  },

  // D1: location line (map-list sub-text style + live dot)
  locationLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    maxWidth: '100%',
  },
  locationDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.safeLiveDot,
  },
  locationDotOff: {
    backgroundColor: colors.inactiveDot,
  },
  locationText: {
    flexShrink: 1,
    fontFamily: fonts.dmSans400,
    fontSize: 7,
    lineHeight: 10.5,
    letterSpacing: 0,
    color: colors.mapListSub,
    ...noPad,
  },

  // Footer: border-top, padding 16 vertical, gap 7
  privateNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  privateNoteText: {
    fontFamily: fonts.dmSans400,
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 0,
    color: colors.privateNote,
    ...noPad,
  },
  pushRight: {
    marginLeft: 'auto',
  },

  // Info cards (margin-top 23, gap 18, padding 25)
  infoCards: {
    marginTop: 23,
    gap: 18,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 25,
  },
  infoIcon: {
    marginBottom: 20,
  },
  infoTitle: {
    fontFamily: fonts.manrope750,
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: -0.45,
    color: colors.ink,
    ...noPad,
  },
  infoText: {
    fontFamily: fonts.dmSans400,
    fontSize: 12,
    lineHeight: 22.2,
    letterSpacing: 0,
    color: colors.infoCardText,
    marginTop: 13,
    marginBottom: 23,
    ...noPad,
  },
});
