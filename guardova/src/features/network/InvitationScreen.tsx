// src/features/network/InvitationScreen.tsx
// Invitee accept / decline view — approved addition D6 (docs/build/MY-NETWORK-FEATURE.md §8).
// Not in Figma: built only from existing pieces of the Member Alert screen (DESIGN-SPEC §9.9,
// design/layout/57-member-alert.json), the permission rows (§9.4) and the buttons (§7.5).
// Breadcrumb "Network Member View", no tab active.
//
// Accept → status Invited → Online, back to the profile, toast. Decline → member removed (slot freed),
// back to My Network, toast.

import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Icon } from '../../components/Icon';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { useStore } from '../../state/store';
import { memberProfileHref } from '../../navigation/routes';

const noPad = Platform.OS === 'android' ? { includeFontPadding: false } : {};

const PERMISSIONS = [
  'See their safety status',
  'See their shared live location',
  'Receive their emergency notifications',
  'Respond to their emergency',
];

export function InvitationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ member?: string }>();
  const members = useStore((s) => s.members);
  const acceptInvitation = useStore((s) => s.acceptInvitation);
  const declineInvitation = useStore((s) => s.declineInvitation);

  const member = members.find((m) => m.name === params.member);
  const pending = member?.status === 'Invited';

  // Only an invited member has an invitation to answer
  useEffect(() => {
    if (!member) router.replace('/(tabs)/network');
  }, [member, router]);

  if (!member) return null;

  const profilePath = memberProfileHref(member.name);

  const accept = () => {
    acceptInvitation(member.name);
    router.replace(profilePath);
  };

  const decline = () => {
    router.replace('/(tabs)/network');
    declineInvitation(member.name);
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Viewer strip */}
      <View style={styles.viewer}>
        <Avatar member={member} small />
        <Text style={styles.viewerText}>
          You’re viewing as <Text style={styles.viewerName}>{member.name}</Text>
        </Text>
        <Pressable
          style={styles.returnLink}
          onPress={() => router.replace(profilePath)}
          accessibilityRole="button"
          accessibilityLabel="Return to your view"
        >
          <Text style={styles.returnText}>Return to your view</Text>
          <Icon name="arrow" size={16} color={colors.blue} />
        </Pressable>
      </View>

      {/* Invitation card */}
      <View style={styles.card}>
        <View style={styles.label}>
          <View style={styles.labelDot} />
          <Text style={styles.labelText}>GUARD’OVA INVITATION</Text>
        </View>

        <LinearGradient
          colors={[colors.avatarBlueStart, colors.avatarBlueEnd]}
          start={{ x: 0.101, y: -0.07 }}
          end={{ x: 0.899, y: 1.07 }}
          style={styles.person}
        >
          <Text style={styles.personInitials}>SN</Text>
        </LinearGradient>

        <Text style={styles.title}>Siyabonga invited you.</Text>
        <Text style={styles.subtext}>Join Siyabonga’s private safety circle.</Text>

        <View style={styles.permissions}>
          {PERMISSIONS.map((t) => (
            <View key={t} style={styles.permissionRow}>
              <View style={styles.permissionCheck}>
                <Icon name="check" size={15} color={colors.permissionCheckIcon} />
              </View>
              <Text style={styles.permissionText}>{t}</Text>
            </View>
          ))}
        </View>

        {pending && (
          <View style={styles.buttons}>
            <Button label="Decline" variant="secondary" compact onPress={decline} />
            <Button label="Accept invitation" compact onPress={accept} />
          </View>
        )}

        <Text style={styles.note}>Trusted member preview · Simulated invitation</Text>
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

  // Viewer strip (9 px #9BA4AF, gap 8, margin-bottom 25)
  viewer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 25,
  },
  viewerText: {
    fontFamily: fonts.dmSans400,
    fontSize: 9,
    lineHeight: 13.5,
    letterSpacing: 0,
    color: colors.recipientLabel,
    ...noPad,
  },
  viewerName: {
    fontFamily: fonts.dmSans700,
    color: colors.viewerName,
  },
  returnLink: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  returnText: {
    fontFamily: fonts.dmSans550,
    fontSize: 9,
    lineHeight: 13.5,
    letterSpacing: 0,
    color: colors.blue,
    ...noPad,
  },

  // Card (padding 25 / 19, centred)
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 25,
    paddingHorizontal: 19,
    alignItems: 'center',
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.blue,
  },
  labelText: {
    fontFamily: fonts.dmSans650,
    fontSize: 9,
    lineHeight: 13.5,
    letterSpacing: 1.2,
    color: colors.blue,
    ...noPad,
  },
  person: {
    width: 67,
    height: 67,
    borderRadius: 33.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 18,
  },
  personInitials: {
    fontFamily: fonts.dmSans600,
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: 0,
    color: colors.avatarBlueInitials,
    ...noPad,
  },
  title: {
    fontFamily: fonts.manrope750,
    fontSize: 27,
    lineHeight: 36.45,
    letterSpacing: -1.15,
    color: colors.ink,
    textAlign: 'center',
    ...noPad,
  },
  subtext: {
    fontFamily: fonts.dmSans400,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
    color: colors.alertSubtext,
    textAlign: 'center',
    marginVertical: 12,
    ...noPad,
  },
  // CSS margin 13 / 0 / 12 collapsing with the paragraph's 12 → 1 extra on top
  permissions: {
    alignSelf: 'stretch',
    marginTop: 1,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 12,
  },
  permissionCheck: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.permissionCheckBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionText: {
    fontFamily: fonts.dmSans400,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
    color: colors.permissionText,
    ...noPad,
  },

  // Side-by-side buttons (gap 8, margin-top 12)
  buttons: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  note: {
    fontFamily: fonts.dmSans400,
    fontSize: 12,
    lineHeight: 20.4,
    letterSpacing: 0,
    color: colors.alertSubtext,
    textAlign: 'center',
    marginTop: 12,
    ...noPad,
  },
});
