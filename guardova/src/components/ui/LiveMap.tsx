// src/components/ui/LiveMap.tsx
// DESIGN-SPEC §12.2: Live Map SVG representation
// Exact SVG paths copied from design/reference-prototype/src/App.tsx line 48-63

import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Svg, { Rect, Path, G, Text as SvgText } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Icon } from '../Icon';

interface LiveMapProps {
  large?: boolean;
  emergency?: boolean;
  onPress?: () => void;
  height?: number;
}

export function LiveMap({
  large = false,
  emergency = false,
  onPress,
  height = 180,
}: LiveMapProps) {
  return (
    <Pressable
      style={[styles.container, { height }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Open live map"
    >
      <Svg
        style={StyleSheet.absoluteFill}
        viewBox="0 0 700 400"
        preserveAspectRatio="xMidYMid slice"
      >
        <Rect width="700" height="400" fill={colors.mapBase} />
        {/* Parks */}
        <Path d="M0 320 150 280 240 340 340 300 420 390 700 370V400H0Z" fill={colors.mapPark1} />
        <Path d="m480 0-30 80 25 75 70 30 30 80 125 10V0Z" fill={colors.mapPark2} />
        {/* Streets */}
        <Path
          d="M0 115 700 320M90 0l125 400M0 250 700 120M390 0l-55 400M620 0 475 400M0 40l700 200M10 400 700 45"
          stroke="#FFFFFF"
          strokeWidth="17"
        />
        <Path
          d="M0 115 700 320M90 0l125 400M0 250 700 120M390 0l-55 400M620 0 475 400M0 40l700 200M10 400 700 45"
          stroke={colors.mapStreetEdge}
          strokeWidth="1"
        />
        {/* Main Road */}
        <Path d="m0 370 155-135L270 85 310 0" stroke={colors.mapMainRoad} strokeWidth="26" fill="none" />
        <Path d="m0 370 155-135L270 85 310 0" stroke={colors.mapMainRoadEdge} strokeWidth="2" fill="none" />
        {/* Buildings */}
        <G fill={colors.mapBuilding}>
          <Rect x="231" y="174" width="43" height="24" rx="3" transform="rotate(-12 231 174)" />
          <Rect x="404" y="160" width="37" height="22" rx="3" />
          <Rect x="265" y="263" width="43" height="29" rx="3" />
          <Rect x="101" y="117" width="38" height="27" rx="3" />
        </G>
        {/* Suburb labels (Inter font) */}
        <G fill={colors.mapSuburbLabel} fontSize="11" fontFamily={fonts.inter400}>
          <SvgText x="290" y="70">ROSEBANK</SvgText>
          <SvgText x="455" y="325">SAXONWOLD</SvgText>
          <SvgText x="49" y="188">PARKTOWN NORTH</SvgText>
          <SvgText x="535" y="88">Melrose</SvgText>
        </G>
        {/* Street labels */}
        <G fill={colors.mapStreetLabel} fontSize="9" fontFamily={fonts.inter400}>
          <SvgText x="278" y="230" transform="rotate(-11 278 230)">Jellicoe Avenue</SvgText>
          <SvgText x="372" y="330" transform="rotate(-81 372 330)">Oxford Road</SvgText>
          <SvgText x="99" y="305" transform="rotate(-40 99 305)">Jan Smuts Ave</SvgText>
        </G>
      </Svg>

      {/* YOU / SIYABONGA Marker centered */}
      <View style={[styles.mapYou, { top: '47%', left: '48%' }]}>
        <View style={[styles.youLabel, emergency && styles.youLabelDanger]}>
          <Text style={[styles.youLabelText, emergency && styles.youLabelTextDanger]}>
            {emergency ? 'SIYABONGA' : 'YOU'}
          </Text>
        </View>
        <View style={[styles.locationPulse, emergency && styles.locationPulseDanger]}>
          <Icon name="shield" size={17} color="#FFFFFF" />
        </View>
      </View>

      {/* Map Live badge bottom left */}
      <View style={styles.mapLiveBadge}>
        <View style={styles.mapLiveDot} />
        <Text style={styles.mapLiveText}>Live location</Text>
      </View>

      {/* Attribution bottom right */}
      <View style={styles.mapAttribution}>
        <Text style={styles.mapAttributionText}>Guard’Ova · Demo map</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colors.mapContainer,
  },
  mapYou: {
    position: 'absolute',
    alignItems: 'center',
    gap: 7,
    transform: [{ translateX: -20 }, { translateY: -28 }],
  },
  youLabel: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  youLabelDanger: {
    backgroundColor: '#FFFFFF',
  },
  youLabelText: {
    fontFamily: fonts.inter400,
    fontSize: 7,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.mapYouLabel,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  youLabelTextDanger: {
    color: '#B86566',
  },
  locationPulse: {
    width: 31,
    height: 31,
    borderRadius: 15.5,
    backgroundColor: colors.mapYouPulse,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: colors.mapYouPulse,
    shadowOpacity: 0.35,
    shadowRadius: 11,
    elevation: 4,
  },
  locationPulseDanger: {
    backgroundColor: '#D86165',
    shadowColor: '#D86165',
  },
  mapLiveBadge: {
    position: 'absolute',
    bottom: 9,
    left: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#EDF0E6',
    backgroundColor: '#FFFFFFEB',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  mapLiveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.safeLiveDot,
  },
  mapLiveText: {
    fontFamily: fonts.dmSans400,
    fontSize: 7,
    color: '#799080',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  mapAttribution: {
    position: 'absolute',
    bottom: 5,
    right: 7,
    backgroundColor: '#FFFFFF8C',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  mapAttributionText: {
    fontFamily: fonts.dmSans400,
    fontSize: 6,
    color: '#8B9285',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
});

