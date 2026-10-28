// src/features/device/DeviceScreen.tsx
// Screen 2: My Device
// Reference: design/DESIGN-SPEC.md §9.2 & Reference screens: 20, 21, 23
// Layout reference: design/layout/20-device-connected.json & 21-device-disconnected.json
// Content:
// - Page heading: "SMALL DEVICE. BIG PEACE OF MIND." / "Your everyday guardian."
// - Product card: Connected badge, large wearable, title, serial, simulate button
// - Device health card:
//   - Amber Warning box with reason + advice when state is not Connected
//   - 5 Detail rows: Battery, GPS, Connection, Cloud, Last synced
//   - "Test device" secondary button (triggers toast feedback)
//   - "Device settings" text button (triggers preferences modal)
//   - Demo state switcher ("Preview device states" picker)

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
import { WearableImage } from '../../components/ui/WearableImage';
import { useStore, DeviceState } from '../../state/store';

export function DeviceScreen() {
  const router = useRouter();

  const deviceState = useStore((s) => s.deviceState);
  const setDeviceState = useStore((s) => s.setDeviceState);
  const startSOS = useStore((s) => s.startSOS);
  const setModal = useStore((s) => s.setModal);
  const notify = useStore((s) => s.notify);

  const isConnected = deviceState === 'Connected';

  // Warning box reason text per state (DESIGN-SPEC §9.2)
  const getWarningReason = () => {
    switch (deviceState) {
      case 'Disconnected':
        return 'Keep your wearable nearby and enable Bluetooth to reconnect.';
      case 'Low battery':
        return 'Charge your wearable soon to stay protected.';
      case 'GPS unavailable':
        return 'Move outdoors to restore your GPS signal.';
      default:
        return '';
    }
  };

  // Row telemetry values dynamically adapting to the state
  const getBatteryValue = () => {
    return deviceState === 'Low battery'
      ? '12% · Charge soon'
      : '87% · About 4 days left';
  };

  const getGpsValue = () => {
    return deviceState === 'GPS unavailable'
      ? 'Unavailable'
      : 'Active · Signal strong';
  };

  const getConnectionValue = () => {
    return deviceState === 'Disconnected'
      ? 'Disconnected'
      : 'Connected · Bluetooth';
  };

  const getCloudValue = () => {
    return deviceState === 'Disconnected' ? 'Offline' : 'Online';
  };

  const handleTestDevice = () => {
    if (isConnected) {
      notify(
        'Device test passed. Button, GPS, Bluetooth and cloud connection are working.'
      );
    } else {
      notify('Device test needs attention. Resolve the warning shown above.');
    }
  };

  const handleSimulatePress = () => {
    startSOS();
    router.push('/sos/countdown' as any);
  };

  const handleStateSelect = (state: DeviceState) => {
    setDeviceState(state);
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Page Heading ────────────────────────────────────────── */}
      <View style={styles.pageHeading}>
        <Text style={styles.eyebrow}>SMALL DEVICE. BIG PEACE OF MIND.</Text>
        <Text style={styles.headingTitle}>Your everyday guardian.</Text>
        <Text style={styles.headingSub}>
          Everything you need to know about your Guard’Ova wearable.
        </Text>
      </View>

      <View style={styles.twoCol}>
        {/* ─── A. Product Card ────────────────────────────────────── */}
        <View style={styles.productCard}>
          {/* Status pill (Connected green or warning amber) */}
          <StatusPill
            label={deviceState}
            variant={isConnected ? 'ok' : 'warning'}
          />

          {/* Large Wearable Illustration (scene 280 × 260) */}
          <View style={styles.wearableWrapper}>
            <WearableImage variant="device" onPress={handleSimulatePress} />
          </View>

          {/* Titles */}
          <Text style={styles.productTitle}>Guard’Ova Device</Text>
          <Text style={styles.productSubtitle}>Guard’Ova One · Midnight</Text>
          <Text style={styles.serialNumber}>DEVICE ID · GO–2849–SN</Text>

          {/* Primary Action Button: Simulate wearable button press */}
          <Pressable
            style={styles.primaryButton}
            onPress={handleSimulatePress}
            accessibilityRole="button"
            accessibilityLabel="Simulate wearable button press"
          >
            <Icon name="activity" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>
              Simulate wearable button press
            </Text>
          </Pressable>

          <Text style={styles.simulationNote}>
            Prototype only. No real alerts are sent.
          </Text>
        </View>

        {/* ─── B. Device Health Card ──────────────────────────────── */}
        <View style={styles.detailsCard}>
          <Text style={styles.healthTitle}>Device health</Text>

          {/* Warning box (displayed only when not Connected) */}
          {!isConnected && (
            <View style={styles.warningBox}>
              <Text style={styles.warningTitle}>Attention required</Text>
              <Text style={styles.warningDescription}>{getWarningReason()}</Text>
            </View>
          )}

          {/* Detail Row 1: Battery level */}
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Icon name="battery" size={20} color="#94A3B0" />
              <Text style={styles.detailLabel}>Battery level</Text>
            </View>
            <Text style={styles.detailValue}>{getBatteryValue()}</Text>
          </View>

          {/* Detail Row 2: GPS */}
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Icon name="gps" size={20} color="#94A3B0" />
              <Text style={styles.detailLabel}>GPS</Text>
            </View>
            <Text style={styles.detailValue}>{getGpsValue()}</Text>
          </View>

          {/* Detail Row 3: Device connection */}
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Icon name="shield" size={20} color="#94A3B0" />
              <Text style={styles.detailLabel}>Device connection</Text>
            </View>
            <Text style={styles.detailValue}>{getConnectionValue()}</Text>
          </View>

          {/* Detail Row 4: Cloud connection */}
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Icon name="wifi" size={20} color="#94A3B0" />
              <Text style={styles.detailLabel}>Cloud connection</Text>
            </View>
            <Text style={styles.detailValue}>{getCloudValue()}</Text>
          </View>

          {/* Detail Row 5: Last synced */}
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Icon name="clock" size={20} color="#94A3B0" />
              <Text style={styles.detailLabel}>Last synced</Text>
            </View>
            <Text style={styles.detailValue}>Just now</Text>
          </View>

          {/* Test device button */}
          <Pressable
            style={styles.secondaryButton}
            onPress={handleTestDevice}
            accessibilityRole="button"
            accessibilityLabel="Test device"
          >
            <Text style={styles.secondaryButtonText}>Test device</Text>
            <Icon name="check" size={18} color={colors.secondaryButtonText} />
          </Pressable>

          {/* Device settings button */}
          <Pressable
            style={styles.textButton}
            onPress={() => setModal('device-settings')}
            accessibilityRole="button"
            accessibilityLabel="Device settings"
          >
            <Text style={styles.textButtonLabel}>Device settings</Text>
            <Icon name="settings" size={17} color={colors.blue} />
          </Pressable>

          {/* Demo state switcher */}
          <View style={styles.demoStateRow}>
            <Text style={styles.demoLabel}>Preview device states</Text>

            {/* Custom interactive picker buttons for rapid state review */}
            <View style={styles.pickerContainer}>
              {(
                [
                  'Connected',
                  'Disconnected',
                  'Low battery',
                  'GPS unavailable',
                ] as DeviceState[]
              ).map((state) => (
                <Pressable
                  key={state}
                  style={[
                    styles.pickerOption,
                    deviceState === state && styles.pickerOptionActive,
                  ]}
                  onPress={() => handleStateSelect(state)}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      deviceState === state && styles.pickerOptionTextActive,
                    ]}
                  >
                    {state}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
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
  },
  // Page heading
  pageHeading: {
    marginBottom: 25,
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
    lineHeight: 35.1,
    letterSpacing: -1,
    color: colors.ink,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  headingSub: {
    fontFamily: fonts.dmSans400,
    fontSize: 11,
    lineHeight: 19.8,
    color: colors.pageHeadingPara,
    marginTop: 9,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  twoCol: {
    gap: 18,
  },

  // A. Product Card
  productCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
    overflow: 'hidden',
  },
  wearableWrapper: {
    marginTop: 15,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productTitle: {
    fontFamily: fonts.manrope750,
    fontSize: 23,
    lineHeight: 34.5,
    letterSpacing: -0.45,
    color: colors.ink,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  productSubtitle: {
    fontFamily: fonts.dmSans400,
    fontSize: 12,
    lineHeight: 18,
    color: '#9BA3AF',
    marginTop: 8,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  serialNumber: {
    fontFamily: fonts.dmSans400,
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 1.5,
    color: '#ADB5C0',
    marginTop: 18,
    marginBottom: 25,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  primaryButton: {
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
  primaryButtonText: {
    fontFamily: fonts.dmSans550,
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  simulationNote: {
    fontFamily: fonts.dmSans400,
    fontSize: 10,
    lineHeight: 17,
    color: '#A1A8B1',
    marginTop: 15,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // B. Health Details Card
  detailsCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 24,
    overflow: 'hidden',
  },
  healthTitle: {
    fontFamily: fonts.manrope750,
    fontSize: 19,
    lineHeight: 28.5,
    letterSpacing: -0.45,
    color: colors.ink,
    marginBottom: 4,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // Amber Warning Box
  warningBox: {
    backgroundColor: colors.amberWarningBoxBg,
    borderColor: colors.amberWarningBoxBorder,
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginTop: 18,
    marginBottom: 6,
  },
  warningTitle: {
    fontFamily: fonts.dmSans700,
    fontSize: 12,
    lineHeight: 18,
    color: colors.amberWarningBoxText,
    fontWeight: '700',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  warningDescription: {
    fontFamily: fonts.dmSans400,
    fontSize: 11,
    lineHeight: 18.7,
    color: colors.amberWarningBoxText,
    marginTop: 7,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // Detail rows
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 10,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  detailLabel: {
    fontFamily: fonts.dmSans400,
    fontSize: 11,
    lineHeight: 16.5,
    color: colors.detailRowLabel,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  detailValue: {
    fontFamily: fonts.dmSans550,
    fontSize: 10,
    lineHeight: 15,
    color: colors.detailRowValue,
    textAlign: 'right',
    flexShrink: 1,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // Secondary button
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE3EC',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 24,
    minHeight: 48,
  },
  secondaryButtonText: {
    fontFamily: fonts.dmSans550,
    fontSize: 12,
    lineHeight: 18,
    color: colors.secondaryButtonText,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // Text link button
  textButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingVertical: 18,
  },
  textButtonLabel: {
    fontFamily: fonts.dmSans550,
    fontSize: 10,
    lineHeight: 15,
    color: colors.blue,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },

  // Demo state switcher
  demoStateRow: {
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },
  demoLabel: {
    fontFamily: fonts.dmSans400,
    fontSize: 10,
    lineHeight: 15,
    color: '#9BA4AD',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pickerOption: {
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDE3EA',
    backgroundColor: '#FAFBFC',
  },
  pickerOptionActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  pickerOptionText: {
    fontFamily: fonts.dmSans400,
    fontSize: 9,
    color: '#65738A',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  pickerOptionTextActive: {
    color: '#FFFFFF',
    fontFamily: fonts.dmSans550,
  },
});
