// src/features/alert/MemberAlertScreen.tsx
// Screen 3: Network Member View (Member Alert Screen)
// Reference: design/DESIGN-SPEC.md §9.9 & Reference screens: 57, 58, 59
// Layout reference: design/layout/57-member-alert.json & 59-member-alert-responding.json
//
// ⚡ Performance: Visible within 3 seconds guaranteed — zero blocking network calls,
// pre-computed theme styles, and instant local state mounts.
//
// Content:
// - Viewer strip: 35px avatar · "You’re viewing as Thabo" · "Return to your view →"
// - Alert card:
//   1. Red dot + "GUARD’OVA ALERT"
//   2. 67px Person circle with "SN" initials
//   3. h1 "Siyabonga needs you."
//   4. "Siyabonga has triggered an emergency."
//   5. Badge "Emergency Active"
//   6. Alert map (180px, radius 9) with red SIYABONGA marker
//   7. Location row: pin 18px · "Rosebank, Johannesburg" / "Live location available · Updated just now"
//   8. Primary wide button "View live location →"
//   9. Two buttons side by side:
//      - Secondary: "📞 Call Siyabonga" -> Call modal
//      - Danger: "🛡 I’m responding" -> transforms into green "✓ You’re responding" + toast
//   10. Note: "Trusted member preview · Simulated alert"

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Icon } from '../../components/Icon';
import { Avatar } from '../../components/ui/Avatar';
import { LiveMap } from '../../components/ui/LiveMap';
import { CallModal } from '../../components/modals/CallModal';
import { useStore } from '../../state/store';

export function MemberAlertScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ member?: string }>();

  // State
  const members = useStore((s) => s.members);
  const selectedMember = useStore((s) => s.selectedMember);
  const responding = useStore((s) => s.responding);
  const setResponding = useStore((s) => s.setResponding);
  const notify = useStore((s) => s.notify);

  const [callModalVisible, setCallModalVisible] = useState(false);

  // Determine which trusted member is viewing
  const viewingMemberName = params.member || selectedMember?.name || 'Thabo';
  const viewingMember =
    members.find((m) => m.name.toLowerCase() === viewingMemberName.toLowerCase()) ||
    members[1] || // Thabo default
    members[0];

  const handleRespondingPress = () => {
    if (!responding) {
      setResponding(true);
      notify('Siyabonga has been notified that you’re responding.');
    }
  };

  const handleReturnView = () => {
    router.replace('/(tabs)');
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.alertLayout}>
        {/* ─── Viewer Strip ────────────────────────────────────────── */}
        <View style={styles.recipientLabel}>
          <View style={styles.recipientLeft}>
            <Avatar member={viewingMember} size={35} small />
            <Text style={styles.viewingText}>
              You’re viewing as <Text style={styles.viewingName}>{viewingMember.name}</Text>
            </Text>
          </View>

          <Pressable
            style={styles.returnBtn}
            onPress={handleReturnView}
            accessibilityRole="button"
            accessibilityLabel="Return to your view"
          >
            <Text style={styles.returnText}>Return to your view</Text>
            <Icon name="arrow" size={16} color={colors.blue} />
          </Pressable>
        </View>

        {/* ─── Alert Card ──────────────────────────────────────────── */}
        <View style={styles.alertCard}>
          {/* 1. Red Alert Dot + "GUARD'OVA ALERT" */}
          <View style={styles.emergencyLabel}>
            <View style={styles.emergencyDot} />
            <Text style={styles.emergencyLabelText}>GUARD’OVA ALERT</Text>
          </View>

          {/* 2. Person Circle (67px, bg #F6E6E6, initials "SN") */}
          <View style={styles.alertPersonCircle}>
            <Text style={styles.alertPersonInitials}>SN</Text>
          </View>

          {/* 3. Heading */}
          <Text style={styles.alertTitle}>Siyabonga needs you.</Text>

          {/* 4. Subtext */}
          <Text style={styles.alertSubtext}>
            Siyabonga has triggered an emergency.
          </Text>

          {/* 5. Emergency Active Badge */}
          <View style={styles.emergencyBadge}>
            <Text style={styles.emergencyBadgeText}>Emergency Active</Text>
          </View>

          {/* 6. Alert Map (180px, radius 9, red SIYABONGA marker) */}
          <View style={styles.alertMapWrapper}>
            <LiveMap
              height={180}
              emergency={true}
              onPress={() => router.push('/(tabs)/map')}
            />
          </View>

          {/* 7. Location Row */}
          <View style={styles.locationRow}>
            <Icon name="pin" size={18} color="#9A8E96" />
            <View style={styles.locationTextGroup}>
              <Text style={styles.locationTitle}>Rosebank, Johannesburg</Text>
              <Text style={styles.locationSub}>
                Live location available · Updated just now
              </Text>
            </View>
          </View>

          {/* 8. Primary Wide Button: View live location */}
          <Pressable
            style={styles.viewLocationButton}
            onPress={() => router.push('/(tabs)/map')}
            accessibilityRole="button"
            accessibilityLabel="View live location"
          >
            <Text style={styles.viewLocationButtonText}>View live location</Text>
            <Icon name="arrow" size={18} color="#FFFFFF" />
          </Pressable>

          {/* 9. Action Buttons Side-by-Side: Call Siyabonga & I'm Responding */}
          <View style={styles.alertButtonsRow}>
            {/* Call button */}
            <Pressable
              style={styles.callButton}
              onPress={() => setCallModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Call Siyabonga"
            >
              <Icon name="phone" size={17} color={colors.secondaryButtonText} />
              <Text style={styles.callButtonText}>Call Siyabonga</Text>
            </Pressable>

            {/* I'm responding / You're responding button */}
            <Pressable
              style={[
                styles.respondingButtonBase,
                responding ? styles.respondingActiveBtn : styles.dangerRespondingBtn,
              ]}
              onPress={handleRespondingPress}
              accessibilityRole="button"
              accessibilityLabel={responding ? "You're responding" : "I'm responding"}
            >
              <Icon
                name={responding ? 'check' : 'shield'}
                size={17}
                color={responding ? colors.respondingBtnText : '#FFFFFF'}
              />
              <Text
                style={[
                  styles.respondingBtnText,
                  responding ? styles.respondingActiveText : styles.dangerRespondingText,
                ]}
              >
                {responding ? 'You’re responding' : 'I’m responding'}
              </Text>
            </Pressable>
          </View>

          {/* 10. Simulation Note */}
          <Text style={styles.simulationNote}>
            Trusted member preview · Simulated alert
          </Text>
        </View>
      </View>

      {/* Call Siyabonga Modal */}
      <CallModal
        visible={callModalVisible}
        targetName="Siyabonga"
        onClose={() => setCallModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  contentContainer: {
    paddingTop: 28,
    paddingHorizontal: 21,
    paddingBottom: 100, // clears bottom tab bar
    alignItems: 'center',
  },
  alertLayout: {
    width: '100%',
    maxWidth: 630,
  },

  // Viewer Strip
  recipientLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 25,
  },
  recipientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewingText: {
    fontFamily: fonts.dmSans400,
    fontSize: 9,
    lineHeight: 13.5,
    color: colors.recipientLabel,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  viewingName: {
    fontFamily: fonts.dmSans700,
    fontWeight: '700',
    color: '#68788D',
  },
  returnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  returnText: {
    fontFamily: fonts.dmSans550,
    fontSize: 9,
    lineHeight: 13.5,
    color: colors.blue,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // Alert Card
  alertCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    paddingTop: 25,
    paddingHorizontal: 19,
    paddingBottom: 25,
    alignItems: 'center',
    overflow: 'hidden',
  },

  // Emergency Mode Label
  emergencyLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emergencyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.emergencyLabelDot,
  },
  emergencyLabelText: {
    fontFamily: fonts.dmSans650,
    fontSize: 9,
    lineHeight: 13.5,
    letterSpacing: 1.2,
    color: colors.emergencyLabelText,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // Alert Person Circle
  alertPersonCircle: {
    width: 67,
    height: 67,
    borderRadius: 33.5,
    backgroundColor: colors.alertPersonCircleBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 18,
  },
  alertPersonInitials: {
    fontFamily: fonts.dmSans600,
    fontSize: 20,
    lineHeight: 30,
    color: colors.alertPersonInitials,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // Headings
  alertTitle: {
    fontFamily: fonts.manrope750,
    fontSize: 27,
    lineHeight: 36.45,
    letterSpacing: -1.15,
    color: colors.ink,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  alertSubtext: {
    fontFamily: fonts.dmSans400,
    fontSize: 12,
    lineHeight: 18,
    color: '#929AAA',
    marginTop: 12,
    marginBottom: 12,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // Emergency Active Badge
  emergencyBadge: {
    backgroundColor: colors.alertBadgeBg,
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 25,
  },
  emergencyBadgeText: {
    fontFamily: fonts.dmSans400,
    fontSize: 9,
    lineHeight: 13.5,
    color: colors.alertBadgeText,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // Alert Map
  alertMapWrapper: {
    width: '100%',
    borderRadius: 9,
    overflow: 'hidden',
  },

  // Location Row
  locationRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 17,
    marginBottom: 24,
  },
  locationTextGroup: {
    flex: 1,
  },
  locationTitle: {
    fontFamily: fonts.dmSans700,
    fontSize: 11,
    lineHeight: 16.5,
    fontWeight: '700',
    color: '#69778A',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  locationSub: {
    fontFamily: fonts.dmSans400,
    fontSize: 10,
    lineHeight: 15,
    color: '#9BA5B2',
    marginTop: 5,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // View Live Location Button
  viewLocationButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.blue,
    borderColor: colors.blue,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    minHeight: 48,
  },
  viewLocationButtonText: {
    fontFamily: fonts.dmSans550,
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // Side-by-side buttons
  alertButtonsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE3EC',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    minHeight: 44,
  },
  callButtonText: {
    fontFamily: fonts.dmSans550,
    fontSize: 10,
    lineHeight: 15,
    color: colors.secondaryButtonText,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  respondingButtonBase: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    minHeight: 44,
  },
  dangerRespondingBtn: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
  respondingActiveBtn: {
    backgroundColor: colors.respondingBtnBg,
    borderColor: colors.respondingBtnBorder,
  },
  respondingBtnText: {
    fontFamily: fonts.dmSans550,
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  dangerRespondingText: {
    color: '#FFFFFF',
  },
  respondingActiveText: {
    color: colors.respondingBtnText,
  },

  // Simulation Note
  simulationNote: {
    fontFamily: fonts.dmSans400,
    fontSize: 12,
    lineHeight: 20.4,
    color: '#929AAA',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
});

