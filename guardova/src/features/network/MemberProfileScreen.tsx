// src/features/network/MemberProfileScreen.tsx
// Member Profile — DESIGN-SPEC §9.4
// Reference screenshots: 31-profile-mom-online.png, 32-profile-lerato-away.png, 37-profile-invited.png, 33 (call)
// Layout reference: design/layout/31-profile-mom-online.json
//
// "← Back to My Network" → profile card (avatar 90, name, relation, presence pill, safety row, Call / View location)
// → permissions card ("A trusted connection", 4 rows, "Explore the other side", "Preview emergency alert →").
// Approved additions (DESIGN_ADDITIONS): D2 location rows, D3 Remove, D6 "Preview invitation →" (invited only).

import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Icon, IconName } from '../../components/Icon';
import { Avatar } from '../../components/ui/Avatar';
import { StatusPill } from '../../components/ui/StatusPill';
import { BackLink } from '../../components/ui/BackLink';
import { Button } from '../../components/ui/Button';
import { useStore } from '../../state/store';
import { DESIGN_ADDITIONS } from '../../config';
import { invitationHref } from '../../navigation/routes';

const noPad = Platform.OS === 'android' ? { includeFontPadding: false } : {};

const PERMISSIONS = [
  'See your safety status',
  'See your shared live location',
  'Receive emergency notifications',
  'Respond to your emergency',
];

export function MemberProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ member?: string }>();
  const members = useStore((s) => s.members);
  const setSelectedMember = useStore((s) => s.setSelectedMember);
  const setModal = useStore((s) => s.setModal);

  const member = members.find((m) => m.name === params.member);

  // Keep the store's selected member in sync (Call / Remove modals read it)
  useEffect(() => {
    if (member) setSelectedMember(member);
  }, [member, setSelectedMember]);

  // Member no longer in the network (removed / declined): go back to My Network
  useEffect(() => {
    if (!member) router.replace('/(tabs)/network');
  }, [member, router]);

  if (!member) return null;

  const invited = member.status === 'Invited';
  const backToNetwork = () => router.replace('/(tabs)/network');

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <BackLink label="Back to My Network" onPress={backToNetwork} />

      {/* ─── Profile card ──────────────────────────────────────────── */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Avatar member={member} size={90} />
        </View>
        <Text style={styles.name}>{member.name}</Text>
        <Text style={styles.relation}>{member.relation} · Trusted network member</Text>
        <View style={styles.pill}>
          <StatusPill label={member.status} variant={member.status === 'Away' ? 'warning' : 'ok'} />
        </View>

        <View style={styles.safeRow}>
          <Icon name="shield" size={20} color={colors.profileSafeText} />
          <Text style={styles.safeText}>{invited ? 'Invitation pending' : 'Safe and connected'}</Text>
        </View>

        {/* D2: location sharing status + last location (approved addition) */}
        {DESIGN_ADDITIONS && (
          <>
            <DetailRow icon="pin" label="Location sharing" value={invited ? 'Off' : 'On'} />
            <DetailRow
              icon="clock"
              label="Last location"
              value={
                invited
                  ? 'Not shared yet'
                  : `Rosebank, Johannesburg · ${member.status === 'Away' ? '12 min ago' : 'Just now'}`
              }
            />
          </>
        )}

        <View style={styles.actions}>
          <Button label={`Call ${member.name}`} icon="phone" wide onPress={() => setModal('call-member')} />
          <Button
            label="View location"
            icon="pin"
            variant="secondary"
            wide
            onPress={() => router.push('/(tabs)/map')}
          />
          {/* D3: remove from the profile, same confirm modal as Settings (approved addition) */}
          {DESIGN_ADDITIONS && (
            <Button
              label={`Remove ${member.name}`}
              icon="close"
              variant="secondary"
              wide
              onPress={() => setModal('remove')}
            />
          )}
        </View>
      </View>

      {/* ─── Permissions card ──────────────────────────────────────── */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>A trusted connection</Text>
        <Text style={styles.infoText}>
          {member.name} is part of your private safety circle and can support you when you need it most.
        </Text>

        {PERMISSIONS.map((t) => (
          <View key={t} style={styles.permissionRow}>
            <View style={styles.permissionCheck}>
              <Icon name="check" size={15} color={colors.permissionCheckIcon} />
            </View>
            <Text style={styles.permissionText}>{t}</Text>
          </View>
        ))}

        <View style={styles.divider} />

        <Text style={styles.exploreTitle}>Explore the other side</Text>
        <Text style={styles.infoText}>See what your trusted person receives when you trigger an emergency.</Text>
        <Button
          label="Preview emergency alert"
          variant="secondary"
          arrow
          wide
          onPress={() => router.push(`/alert/${encodeURIComponent(member.name)}`)}
        />
        {/* D6: entry to the invitee's view, invited members only (approved addition) */}
        {DESIGN_ADDITIONS && invited && (
          <Button
            label="Preview invitation"
            variant="secondary"
            arrow
            wide
            onPress={() => router.push(invitationHref(member.name))}
            style={styles.invitePreview}
          />
        )}
      </View>
    </ScrollView>
  );
}

// Detail row (DESIGN-SPEC §7.8): icon #94A3B0 · label 11 #83909E · value 10 / 550 #546775, padding 22, divider
function DetailRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Icon name={icon} size={20} color={colors.detailIcon} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
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

  // Profile card (padding 32, centred)
  profileCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 20,
  },
  name: {
    fontFamily: fonts.manrope750,
    fontSize: 27,
    lineHeight: 36.45,
    letterSpacing: -1.15,
    color: colors.ink,
    textAlign: 'center',
    ...noPad,
  },
  relation: {
    fontFamily: fonts.dmSans400,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
    color: colors.profileRelation,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
    ...noPad,
  },
  pill: {
    alignItems: 'center',
  },
  safeRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 22,
    marginTop: 27,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  safeText: {
    fontFamily: fonts.dmSans400,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
    color: colors.profileSafeText,
    ...noPad,
  },
  detailRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontFamily: fonts.dmSans400,
    fontSize: 11,
    lineHeight: 16.5,
    letterSpacing: 0,
    color: colors.detailRowLabel,
    ...noPad,
  },
  detailValue: {
    flexShrink: 1,
    marginLeft: 'auto',
    fontFamily: fonts.dmSans550,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
    color: colors.detailRowValue,
    textAlign: 'right',
    ...noPad,
  },
  actions: {
    alignSelf: 'stretch',
    gap: 12,
    marginTop: 25,
  },

  // Permissions card (padding 25, 18 below the profile card)
  infoCard: {
    marginTop: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 25,
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
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 21,
  },
  exploreTitle: {
    fontFamily: fonts.manrope700,
    fontSize: 15,
    lineHeight: 22.5,
    letterSpacing: 0,
    color: colors.ink,
    ...noPad,
  },
  invitePreview: {
    marginTop: 12,
  },
});
