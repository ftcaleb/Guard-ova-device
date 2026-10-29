// src/features/home/HomeScreen.tsx
// Screen 1: Home Dashboard (Overview)
// Reference: design/DESIGN-SPEC.md §9.1 & Reference screens: 10, 22, 38, 53, 61, 62, 65
// Content:
// A. Status card (Connected · "You are safe." / Emergency variant "Emergency active")
// B. My Guard'Ova card ("87% · GPS Active · Online" / Amber Warning variant)
// C. My Network card ("4/5", avatars + Add tile, "Your circle is private. Always.")
// D. Your location card ("Rosebank, Johannesburg", LiveMap preview)
// E. SOS Banner ("Help is always within reach.", "Activate SOS" button)
// F. Dashboard footer ("Your safety. Your people. Your privacy.")

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Icon } from '../../components/Icon';
import { StatusPill } from '../../components/ui/StatusPill';
import { CountPill } from '../../components/ui/CountPill';
import { Avatar } from '../../components/ui/Avatar';
import { LiveMap } from '../../components/ui/LiveMap';
import { WearableImage } from '../../components/ui/WearableImage';
import { useStore, Member } from '../../state/store';
import { memberProfileHref } from '../../navigation/routes';

export function HomeScreen() {
  const router = useRouter();

  // State from central Zustand store
  const emergency = useStore((s) => s.emergency);
  const deviceState = useStore((s) => s.deviceState);
  const members = useStore((s) => s.members);
  const startSOS = useStore((s) => s.startSOS);
  const setSelectedMember = useStore((s) => s.setSelectedMember);
  const setModal = useStore((s) => s.setModal);

  // Warning pill state when not 'Connected'
  const isDeviceWarning = deviceState !== 'Connected';

  // Stats values based on device state
  const batteryVal = deviceState === 'Low battery' ? '12%' : '87%';
  const gpsVal = deviceState === 'GPS unavailable' ? 'Unavailable' : 'Active';
  const connVal = deviceState === 'Disconnected' ? 'Offline' : 'Online';

  // Navigation handlers
  const handleWearablePress = () => {
    startSOS();
    router.push('/sos/countdown' as any);
  };

  const handleMemberPress = (m: Member) => {
    setSelectedMember(m);
    // DESIGN-SPEC §9.1: tapping a member opens their profile
    router.push(memberProfileHref(m.name));
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Page Heading ────────────────────────────────────────── */}
      <View style={styles.pageHeading}>
        <Text style={styles.eyebrow}>YOUR EVERYDAY PEACE OF MIND</Text>
        <Text style={styles.headingTitle}>
          Good morning, Siyabonga
          <Text style={styles.greetingDot}>.</Text>
        </Text>
        <Text style={styles.headingSub}>
          You go about your day. We’ll look out for you.
        </Text>
      </View>

      {/* ─── A. Safety Status Card (Green Safe / Rose Emergency) ──── */}
      <View style={[styles.safetyCard, emergency && styles.safetyCardEmergency]}>
        {/* Decorative background outline rings */}
        <View style={styles.safeDecorationOne} />
        <View style={styles.safeDecorationTwo} />

        {/* Top row */}
        <View style={styles.safetyTopRow}>
          <View style={styles.safetyStatusBadge}>
            <View
              style={[
                styles.safetyDot,
                emergency && { backgroundColor: colors.emergencyLabelDot },
              ]}
            />
            <Text
              style={[
                styles.safetyLabelText,
                emergency && { color: colors.emergencyLabelText },
              ]}
            >
              YOUR SAFETY STATUS
            </Text>
          </View>

          <View style={styles.updatedRow}>
            <Icon
              name="activity"
              size={14}
              color={emergency ? colors.emergencyLabelDot : colors.safeUpdated}
            />
            <Text
              style={[
                styles.updatedText,
                emergency && { color: colors.emergencyLabelText },
              ]}
            >
              Updated just now
            </Text>
          </View>
        </View>

        {/* Card Body */}
        <View style={styles.safetyBody}>
          <View
            style={[
              styles.shieldTile,
              emergency && styles.shieldTileEmergency,
            ]}
          >
            <Icon
              name="shield"
              size={40}
              color={emergency ? colors.emergencyShieldIcon : colors.shieldTileIcon}
            />
          </View>

          <View style={styles.safetyTextGroup}>
            <Text
              style={[
                styles.safetyHeroText,
                emergency && styles.safetyHeroTextEmergency,
              ]}
            >
              {emergency ? 'Emergency active' : 'You are safe.'}
            </Text>
            <Text style={styles.safetyDescText}>
              {emergency
                ? 'Your trusted network has been notified.'
                : 'Connected. Protected. Free to be you.'}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View
          style={[
            styles.safetyFooter,
            emergency && { borderTopColor: colors.emergencySafeCardBorder },
          ]}
        >
          <View style={styles.locationPinRow}>
            <Icon
              name="pin"
              size={16}
              color={emergency ? colors.emergencySafeHeading : colors.safeFooterLocation}
            />
            <Text
              style={[
                styles.safetyLocationText,
                emergency && { color: colors.emergencySafeHeading },
              ]}
            >
              Rosebank, Johannesburg
            </Text>
          </View>

          <Pressable
            style={styles.viewLiveLocationBtn}
            onPress={() => router.push(emergency ? ('/emergency' as any) : ('/(tabs)/map' as any))}
          >
            <Text
              style={[
                styles.viewLiveLocationText,
                emergency && { color: colors.emergencySafeHeading },
              ]}
            >
              {emergency ? 'View emergency' : 'View live location'}
            </Text>
            <Icon
              name="arrow"
              size={16}
              color={emergency ? colors.emergencySafeHeading : colors.safeViewLink}
            />
          </Pressable>
        </View>
      </View>

      {/* ─── B. My Guard'Ova Card (Device) ────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>My Guard’Ova</Text>
          <StatusPill
            label={deviceState}
            variant={isDeviceWarning ? 'warning' : 'ok'}
          />
        </View>

        <View style={styles.deviceContentRow}>
          {/* Wearable Illustration - tap to trigger SOS */}
          <WearableImage variant="home" onPress={handleWearablePress} />

          {/* Stats Column */}
          <View style={styles.statsColumn}>
            {/* Battery */}
            <View style={styles.statItem}>
              <Icon name="battery" size={17} color="#A1A8B0" />
              <Text style={styles.statLabel}>Battery</Text>
              <Text style={styles.statValue}>{batteryVal}</Text>
            </View>

            {/* GPS */}
            <View style={styles.statItem}>
              <Icon name="gps" size={17} color="#A1A8B0" />
              <Text style={styles.statLabel}>GPS</Text>
              <Text style={styles.statValue}>{gpsVal}</Text>
            </View>

            {/* Connectivity */}
            <View style={styles.statItem}>
              <Icon name="wifi" size={17} color="#A1A8B0" />
              <Text style={styles.statLabel}>Connectivity</Text>
              <Text style={styles.statValue}>{connVal}</Text>
            </View>
          </View>
        </View>

        {/* Footer Link to My Device */}
        <Pressable
          style={styles.deviceFooter}
          onPress={() => router.push('/(tabs)/device')}
          accessibilityRole="button"
          accessibilityLabel="Open device details"
        >
          <Text style={styles.deviceFooterText}>
            Your wearable is looking out for you
          </Text>
          <Icon name="arrow" size={17} color="#5A6B7E" />
        </Pressable>
      </View>

      {/* ─── C. My Network Card ──────────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headingLeft}>
            <View style={styles.blueHeadingIcon}>
              <Icon name="people" size={17} color={colors.blue} />
            </View>
            <View style={styles.titleWithCount}>
              <Text style={styles.cardTitle}>My Network</Text>
              <CountPill current={members.length} total={5} />
            </View>
          </View>
          <Pressable
            style={styles.textLinkBtn}
            onPress={() => router.push('/(tabs)/network')}
          >
            <Text style={styles.textLink}>View network</Text>
            <Icon name="arrow" size={16} color={colors.blue} />
          </Pressable>
        </View>

        <Text style={styles.cardDescription}>
          People you trust who can see your safety status and receive emergency alerts.
        </Text>

        {/* Members Avatar Row */}
        <View style={styles.membersRow}>
          {members.map((m) => (
            <Pressable
              key={m.name}
              style={styles.memberTile}
              onPress={() => handleMemberPress(m)}
            >
              <Avatar member={m} size={45} />
              <Text style={styles.memberName} numberOfLines={1}>
                {m.name}
              </Text>
              <Text
                style={[
                  styles.memberStatusText,
                  m.status === 'Away' && styles.memberAwayText,
                ]}
              >
                {m.status}
              </Text>
            </Pressable>
          ))}

          {/* Add member tile if under 5 */}
          {members.length < 5 && (
            <Pressable
              style={styles.memberTile}
              onPress={() => setModal('invite')}
            >
              <View style={styles.addAvatarTile}>
                <Icon name="plus" size={18} color={colors.addMemberPlusIcon} />
              </View>
              <Text style={styles.addMemberText}>Add member</Text>
              <Text style={styles.addMemberSub}>
                {5 - members.length} {5 - members.length === 1 ? 'spot' : 'spots'} available
              </Text>
            </Pressable>
          )}
        </View>

        {/* Network Footer Note */}
        <View style={styles.networkFooter}>
          <Icon name="lock" size={14} color={colors.privateNote} />
          <Text style={styles.privateNoteText}>
            Your circle is private. Always.
          </Text>
        </View>
      </View>

      {/* ─── D. Your Location Card ───────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headingLeft}>
            <View style={styles.neutralHeadingIcon}>
              <Icon name="pin" size={17} color="#81909E" />
            </View>
            <Text style={styles.cardTitle}>Your location</Text>
          </View>
          <StatusPill label="Live" variant="ok" />
        </View>

        {/* Map view (180px) */}
        <LiveMap
          height={180}
          emergency={emergency}
          onPress={() => router.push('/(tabs)/map')}
        />

        {/* Location Footer */}
        <View style={styles.locationFooterRow}>
          <View>
            <Text style={styles.locationTitle}>Rosebank, Johannesburg</Text>
            <Text style={styles.locationSub}>
              Shared with your trusted network
            </Text>
          </View>
          <Pressable
            style={styles.circleArrow}
            onPress={() => router.push('/(tabs)/map')}
            accessibilityLabel="View location"
          >
            <Icon name="arrow" size={17} color="#778796" />
          </Pressable>
        </View>
      </View>

      {/* ─── E. SOS Banner ───────────────────────────────────────── */}
      <View style={styles.sosBanner}>
        <View style={styles.sosBannerIcon}>
          <Icon name="activity" size={26} color={colors.sosIconTileIcon} />
        </View>
        <View style={styles.sosCopy}>
          <Text style={styles.sosHeading}>Help is always within reach.</Text>
          <Text style={styles.sosSub}>
            Press your wearable or activate SOS here. Your network will be there.
          </Text>
        </View>

        <Pressable
          style={styles.sosButton}
          onPress={() => {
            startSOS();
            router.push('/sos/countdown' as any);
          }}
          accessibilityRole="button"
          accessibilityLabel="Activate SOS"
        >
          <Icon name="activity" size={21} color="#FFFFFF" />
          <Text style={styles.sosButtonText}>Activate SOS</Text>
          <Icon name="arrow" size={18} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* ─── F. Dashboard Footer ─────────────────────────────────── */}
      <View style={styles.dashboardFooter}>
        <View style={styles.footerRow}>
          <Icon name="lock" size={13} color="#A3AAB3" />
          <Text style={styles.footerText}>
            Your safety. Your people. Your privacy.
          </Text>
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
  contentContainer: {
    paddingTop: 28,
    paddingHorizontal: 21,
    paddingBottom: 100, // clears bottom tab bar
    gap: 18,
  },
  // Page heading
  pageHeading: {
    marginBottom: 7,
  },
  eyebrow: {
    fontFamily: fonts.dmSans650,
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 1.5,
    color: colors.eyebrow,
    marginBottom: 10,
    textTransform: 'uppercase',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  headingTitle: {
    fontFamily: fonts.manrope750,
    fontSize: 26,
    lineHeight: 35,
    letterSpacing: -1,
    color: colors.ink,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  greetingDot: {
    color: colors.blue,
  },
  headingSub: {
    fontFamily: fonts.dmSans400,
    fontSize: 11,
    lineHeight: 20,
    color: colors.pageHeadingPara,
    marginTop: 9,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // A. Safety status card
  safetyCard: {
    backgroundColor: colors.safeCardBg,
    borderColor: colors.safeCardBorder,
    borderWidth: 1,
    borderRadius: 14,
    paddingTop: 21,
    paddingHorizontal: 22,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 242,
  },
  safetyCardEmergency: {
    backgroundColor: colors.emergencySafeCardBg,
    borderColor: colors.emergencySafeCardBorder,
  },
  safeDecorationOne: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    borderWidth: 1,
    borderColor: colors.safeDecoration,
    top: -22,
    right: -158,
  },
  safeDecorationTwo: {
    position: 'absolute',
    width: 290,
    height: 290,
    borderRadius: 145,
    borderWidth: 1,
    borderColor: colors.safeDecoration,
    top: 12,
    right: -122,
  },
  safetyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  safetyStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  safetyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.safeLiveDot,
  },
  safetyLabelText: {
    fontFamily: fonts.dmSans650,
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 0.9,
    color: colors.safeStatusLabel,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  updatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  updatedText: {
    fontFamily: fonts.dmSans400,
    fontSize: 8,
    color: colors.safeUpdated,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  safetyBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 33,
    gap: 20,
    zIndex: 1,
  },
  shieldTile: {
    width: 67,
    height: 75,
    borderRadius: 21,
    backgroundColor: colors.shieldTileBg,
    borderColor: colors.shieldTileBorder,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3A7650',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 2,
  },
  shieldTileEmergency: {
    backgroundColor: colors.emergencyShieldTileBg,
    borderColor: colors.emergencyShieldTileBorder,
  },
  safetyTextGroup: {
    flex: 1,
  },
  safetyHeroText: {
    fontFamily: fonts.manrope750,
    fontSize: 32,
    lineHeight: 43,
    letterSpacing: -1.2,
    color: colors.safeHeading,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  safetyHeroTextEmergency: {
    color: colors.emergencySafeHeading,
    fontSize: 30,
  },
  safetyDescText: {
    fontFamily: fonts.dmSans400,
    fontSize: 10,
    lineHeight: 17,
    color: colors.safeBodyText,
    marginTop: 9,
    maxWidth: 200,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  safetyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.safeFooterDivider,
    paddingVertical: 18,
    zIndex: 1,
  },
  locationPinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  safetyLocationText: {
    fontFamily: fonts.dmSans400,
    fontSize: 9,
    lineHeight: 14,
    color: colors.safeFooterLocation,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  viewLiveLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewLiveLocationText: {
    fontFamily: fonts.dmSans600,
    fontSize: 9,
    lineHeight: 14,
    color: colors.safeViewLink,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // Common card style
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 21,
    paddingHorizontal: 22,
    marginBottom: 8,
  },
  cardTitle: {
    fontFamily: fonts.manrope750,
    fontSize: 15,
    lineHeight: 23,
    color: colors.ink,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  headingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleWithCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blueHeadingIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.blueHeadingIconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  neutralHeadingIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#F3F5F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  textLink: {
    fontFamily: fonts.dmSans550,
    fontSize: 9,
    lineHeight: 14,
    color: colors.blue,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  cardDescription: {
    fontFamily: fonts.dmSans400,
    fontSize: 10,
    lineHeight: 18.5,
    color: colors.cardDescription,
    paddingHorizontal: 22,
    marginTop: 4,
    marginBottom: 13,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // B. Device content
  deviceContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 10,
    gap: 20,
    minHeight: 167,
  },
  statsColumn: {
    flex: 1,
    gap: 18,
    maxWidth: 230,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    flex: 1,
    fontFamily: fonts.dmSans400,
    fontSize: 10,
    lineHeight: 15,
    color: colors.deviceStatLabel,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  statValue: {
    fontFamily: fonts.dmSans550,
    fontSize: 11,
    lineHeight: 17,
    color: colors.deviceStatValue,
    textAlign: 'right',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  deviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 17,
    paddingHorizontal: 22,
  },
  deviceFooterText: {
    fontFamily: fonts.dmSans400,
    fontSize: 9,
    lineHeight: 14,
    color: '#949DA7',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // C. Network members
  membersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 3,
  },
  memberTile: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 68,
  },
  memberName: {
    fontFamily: fonts.dmSans550,
    fontSize: 9,
    lineHeight: 14,
    color: colors.ink,
    marginTop: 9,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  memberStatusText: {
    fontFamily: fonts.dmSans400,
    fontSize: 8,
    lineHeight: 12,
    color: '#93A29B',
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  memberAwayText: {
    color: colors.awayText,
  },
  addAvatarTile: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: colors.addMemberTileBg,
    borderWidth: 1,
    borderColor: colors.addMemberDashedBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMemberText: {
    fontFamily: fonts.dmSans550,
    fontSize: 9,
    lineHeight: 14,
    color: colors.addMemberLabel,
    marginTop: 9,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  addMemberSub: {
    fontFamily: fonts.dmSans400,
    fontSize: 6,
    lineHeight: 9,
    color: colors.addMemberSubLabel,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  networkFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 16,
    paddingHorizontal: 22,
  },
  privateNoteText: {
    fontFamily: fonts.dmSans400,
    fontSize: 8,
    lineHeight: 12,
    color: colors.privateNote,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // D. Location card
  locationFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 17,
    paddingHorizontal: 20,
  },
  locationTitle: {
    fontFamily: fonts.dmSans550,
    fontSize: 11,
    lineHeight: 17,
    color: colors.ink,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  locationSub: {
    fontFamily: fonts.dmSans400,
    fontSize: 9,
    lineHeight: 14,
    color: colors.locationFooterSub,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  circleArrow: {
    width: 29,
    height: 29,
    borderRadius: 14.5,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // E. SOS Banner
  sosBanner: {
    backgroundColor: colors.sosBannerBg,
    borderColor: colors.sosBannerBorder,
    borderWidth: 1,
    borderRadius: 13,
    padding: 22,
    gap: 15,
  },
  sosBannerIcon: {
    width: 43,
    height: 43,
    borderRadius: 11,
    backgroundColor: colors.sosIconTileBg,
    borderColor: colors.sosIconTileBorder,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosCopy: {
    gap: 6,
  },
  sosHeading: {
    fontFamily: fonts.manrope750,
    fontSize: 14,
    lineHeight: 20,
    color: colors.sosBannerHeading,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  sosSub: {
    fontFamily: fonts.dmSans400,
    fontSize: 10,
    lineHeight: 18,
    color: colors.sosBannerText,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.sosButtonFill,
    borderColor: colors.sosButtonBorder,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 17,
    paddingHorizontal: 22,
    shadowColor: colors.sosButtonFill,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  sosButtonText: {
    fontFamily: fonts.dmSans550,
    fontSize: 13,
    lineHeight: 18,
    color: '#FFFFFF',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // F. Dashboard Footer
  dashboardFooter: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontFamily: fonts.dmSans400,
    fontSize: 8,
    lineHeight: 12,
    color: '#A3AAB3',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
});

