// src/features/emergency/EmergencyActiveScreen.tsx
// Screen 9 — Emergency Active. DESIGN-SPEC §9.8
// Screenshots: design/screens/55-emergency-active.png, 60-emergency-someone-responding.png,
// 56 (call modal), 64 (end modal). Layout: design/layout/55-emergency-active.json
//
// Everything shown comes from the persisted incident, so after a crash or restart the
// app reopens straight onto this screen with the same state (see useSosEngine).

import React, { useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { leaveToTab } from '../../components/shell/navigation';
import { Avatar } from '../../components/ui/Avatar';
import { Button, TextButton } from '../../components/ui/Button';
import { LiveMap } from '../../components/ui/LiveMap';
import { SimulationNote } from '../../components/ui/SimulationNote';
import { Icon, IconName } from '../../components/Icon';
import { DEMO_MODE, EMERGENCY_NUMBER } from '../../config';
import { Member, useStore } from '../../state/store';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { AlertDelivery, deliveredCount } from '../sos/incident';
import { CallEmergencyModal, EndEmergencyModal } from './EmergencyModals';

// Delivery rows. "pending" and "failed" have no design yet (see design/OPEN-DECISIONS.md);
// they must never read as "delivered", so they get honest interim copy and no check mark.
function deliveryStatusText(d: AlertDelivery) {
  if (d.status === 'delivered') return d.respondingAt ? 'Responding · On their way' : 'Emergency alert delivered';
  if (d.status === 'failed') return 'Alert not delivered yet · Retrying';
  return 'Sending emergency alert…';
}

function memberFor(name: string, members: Member[]): Member {
  return (
    members.find((m) => m.name === name) ?? {
      name,
      initials: name.slice(0, 2).toUpperCase(),
      relation: 'Trusted person',
      color: 'blue',
      status: 'Online',
    }
  );
}

function Metric({
  icon,
  label,
  value,
  dot = false,
  onPress,
}: {
  icon: IconName;
  label: string;
  value: string;
  dot?: boolean;
  onPress?: () => void;
}) {
  const content = (
    <>
      <Icon name={icon} size={20} color={colors.emergencyMetricIcon} />
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.metricValueRow}>
        <Text style={styles.metricValue}>{value}</Text>
        {dot && <View style={styles.metricDot} />}
      </View>
    </>
  );
  if (!onPress) return <View style={[styles.card, styles.metric]}>{content}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
      style={[styles.card, styles.metric]}
    >
      {content}
    </Pressable>
  );
}

export function EmergencyActiveScreen() {
  const router = useRouter();
  const incident = useStore((s) => s.incident);
  const members = useStore((s) => s.members);
  const selectedMember = useStore((s) => s.selectedMember);
  const endEmergency = useStore((s) => s.endEmergency);
  const recordEmergencyCall = useStore((s) => s.recordEmergencyCall);
  const notify = useStore((s) => s.notify);
  const [modal, setModal] = useState<'call' | 'end' | null>(null);
  // Guard only for a screen opened without an active emergency; after "end" the
  // confirm handler navigates Home itself.
  const [openedActive] = useState(incident?.status === 'active');

  if (!openedActive) return <Redirect href={'/(tabs)' as any} />;
  if (!incident || incident.status !== 'active') return null;

  const delivered = deliveredCount(incident);
  const total = incident.deliveries.length;

  const callEmergencyServices = () => {
    if (DEMO_MODE) {
      setModal('call');
      return;
    }
    recordEmergencyCall(true);
    Linking.openURL(`tel:${EMERGENCY_NUMBER}`);
  };

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* A. Emergency header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <View style={styles.label}>
              <View style={styles.labelDot} />
              <Text style={styles.labelText}>EMERGENCY ACTIVE</Text>
            </View>
            <Text style={styles.headerTitle}>You’re not alone.</Text>
            <Text style={styles.headerPara}>
              Your My Network has been notified. Your location is being shared.
            </Text>
          </View>
          {/* svg is 37 × 55 in the reference; the 24-unit icon scales to the 37 px width */}
          <View style={styles.headerShield}>
            <Icon name="shield" size={37} color={colors.emergencyHeaderText} />
          </View>
        </View>

        {/* B. Metrics */}
        <View style={styles.metrics}>
          <Metric icon="pin" label="Location sharing" value="ACTIVE" dot />
          <Metric
            icon="people"
            label="Network notified"
            value={`${delivered}/${total}`}
            onPress={() => router.push('/(tabs)/network' as any)}
          />
          <Metric icon="gps" label="Current location" value="Live" dot />
        </View>

        {/* C. Location card */}
        <View style={[styles.card, styles.locationCard]}>
          <LiveMap emergency height={255} />
          <View style={styles.locationFooter}>
            <View>
              <Text style={styles.locationTitle}>Rosebank, Johannesburg</Text>
              <Text style={styles.locationSub}>Live location shared with your network</Text>
            </View>
            <Button
              testID="emergency-view-location"
              variant="primary"
              label="View location"
              trailingIcon="arrow"
              trailingIconSize={16}
              onPress={() => router.push('/(tabs)/map' as any)}
              style={styles.viewLocation}
            />
          </View>
        </View>

        {/* D. Network updates */}
        <View style={[styles.card, styles.updates]}>
          <Text style={styles.updatesTitle}>Your network is here.</Text>
          {incident.deliveries.map((d) => (
            <View key={d.memberName} style={styles.responseRow}>
              <Avatar member={memberFor(d.memberName, members)} small />
              <View style={styles.responseText}>
                <Text style={styles.responseName}>{d.memberName}</Text>
                <Text style={styles.responseStatus}>{deliveryStatusText(d)}</Text>
              </View>
              {d.status === 'delivered' && <Icon name="check" size={17} color={colors.responseCheck} />}
            </View>
          ))}
          {DEMO_MODE && (
            <TextButton
              label="Preview a network member’s alert"
              trailingIcon="arrow"
              trailingIconSize={16}
              onPress={() => router.push(`/alert/${encodeURIComponent(selectedMember.name)}` as any)}
              style={styles.previewAlert}
            />
          )}
        </View>

        {/* E. Bottom actions */}
        <View style={styles.bottom}>
          <Button
            testID="emergency-call"
            variant="danger"
            icon="phone"
            iconSize={19}
            label="Call emergency services"
            onPress={callEmergencyServices}
          />
          <Button
            testID="emergency-end"
            variant="secondary"
            label="End emergency — I’m safe"
            onPress={() => setModal('end')}
          />
        </View>

        {/* F. Note */}
        <SimulationNote text="Simulated emergency. No real alerts or calls are made." />
      </ScrollView>

      <CallEmergencyModal
        visible={modal === 'call'}
        onClose={() => setModal(null)}
        onDemonstrate={() => {
          setModal(null);
          recordEmergencyCall(false);
          notify('Call action demonstrated. No real call was made.');
        }}
      />
      <EndEmergencyModal
        visible={modal === 'end'}
        onClose={() => setModal(null)}
        onConfirm={() => {
          setModal(null);
          endEmergency();
          leaveToTab(router, '/');
        }}
      />
    </>
  );
}

const androidText = Platform.OS === 'android' ? { includeFontPadding: false } : {};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 28,
    paddingHorizontal: 21,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    overflow: 'hidden',
  },

  // A. Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 25,
    paddingHorizontal: 22,
    backgroundColor: colors.emergencyHeaderBg,
    borderWidth: 1,
    borderColor: colors.emergencyHeaderBorder,
    borderRadius: 14,
  },
  headerText: {
    flex: 1,
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
    backgroundColor: colors.emergencyLabelDot,
  },
  labelText: {
    fontFamily: fonts.dmSans650,
    fontSize: 9,
    lineHeight: 13.5,
    letterSpacing: 1.2,
    color: colors.emergencyLabelText,
    ...androidText,
  },
  headerTitle: {
    marginTop: 14,
    fontFamily: fonts.manrope750,
    fontSize: 27,
    lineHeight: 36.45,
    letterSpacing: -1.15,
    color: colors.emergencyHeaderText,
    ...androidText,
  },
  headerPara: {
    marginTop: 10,
    fontFamily: fonts.dmSans400,
    fontSize: 11,
    lineHeight: 19.8,
    letterSpacing: 0,
    color: colors.emergencyHeaderPara,
    ...androidText,
  },
  headerShield: {
    width: 37,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },

  // B. Metrics
  metrics: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 17,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
    paddingVertical: 17,
    paddingHorizontal: 5,
  },
  metricLabel: {
    fontFamily: fonts.dmSans400,
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 0,
    color: colors.emergencyMetricLabel,
    textAlign: 'center',
    ...androidText,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  metricValue: {
    fontFamily: fonts.dmSans700,
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
    color: colors.emergencyMetricValue,
    ...androidText,
  },
  metricDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.emergencyMetricDot,
  },

  // C. Location card
  locationCard: {
    marginTop: 23,
  },
  locationFooter: {
    paddingVertical: 17,
    paddingHorizontal: 20,
  },
  locationTitle: {
    fontFamily: fonts.dmSans550,
    fontSize: 11,
    lineHeight: 16.5,
    letterSpacing: 0,
    color: colors.ink,
    ...androidText,
  },
  locationSub: {
    marginTop: 5,
    fontFamily: fonts.dmSans400,
    fontSize: 9,
    lineHeight: 13.5,
    letterSpacing: 0,
    color: colors.locationFooterSub,
    ...androidText,
  },
  viewLocation: {
    // wrap gap 10 + margin-top 6
    marginTop: 16,
  },

  // D. Network updates (CSS margins collapse to 16 between title, rows and link)
  updates: {
    marginTop: 18,
    padding: 22,
  },
  updatesTitle: {
    marginBottom: 16,
    fontFamily: fonts.manrope750,
    fontSize: 18,
    lineHeight: 27,
    letterSpacing: -0.45,
    color: colors.ink,
    ...androidText,
  },
  responseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  responseText: {
    flex: 1,
  },
  responseName: {
    fontFamily: fonts.dmSans700,
    fontSize: 11,
    lineHeight: 16.5,
    letterSpacing: 0,
    color: colors.ink,
    ...androidText,
  },
  responseStatus: {
    marginTop: 4,
    fontFamily: fonts.dmSans400,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
    color: colors.responseStatusText,
    ...androidText,
  },
  previewAlert: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  // E. Bottom actions
  bottom: {
    gap: 12,
    marginTop: 24,
    marginBottom: 15,
  },
});
