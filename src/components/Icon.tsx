import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

/**
 * Supported Icon identifiers in the Guard'Ova design system.
 * Source: `design/DESIGN-SPEC.md` §6 (Iconography).
 *
 * NOTE: The design strictly mandates inline custom SVG paths rather than external
 * icon libraries (e.g., FontAwesome, Ionicons, Lucide). This ensures uniform 1.65 stroke
 * weight, round caps, round joins, and exact bounding-box metrics across platforms.
 */
export type IconName =
  | 'home'
  | 'shield'
  | 'people'
  | 'pin'
  | 'clock'
  | 'settings'
  | 'arrow'
  | 'chevron'
  | 'bell'
  | 'battery'
  | 'gps'
  | 'wifi'
  | 'check'
  | 'plus'
  | 'phone'
  | 'close'
  | 'lock'
  | 'activity'
  | 'logout';

interface IconProps {
  /** The icon glyph identifier */
  name: IconName;
  /** Bounding box width and height in dp/pt (defaults to 20 per spec) */
  size?: number;
  /** Stroke color override; defaults to currentColor or parent text color */
  color?: string;
}

/**
 * Guard'Ova Vector Icon Component
 *
 * Standard Specs:
 * - viewBox: "0 0 24 24"
 * - fill: "none"
 * - stroke: currentColor (or explicit tint)
 * - strokeWidth: 1.65 (non-negotiable across all screen densities)
 * - strokeLinecap: "round"
 * - strokeLinejoin: "round"
 */
export function Icon({ name, size = 20, color = 'currentColor' }: IconProps) {
  // Common vector presentation attributes shared across all glyphs
  const commonProps = {
    fill: 'none',
    stroke: color,
    strokeWidth: 1.65,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    // Brand & safety indicator: shield with embedded status tick
    case 'shield':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="M12 3 3.5 6v6c0 5 8.5 9 8.5 9s8.5-4 8.5-9V6Z" />
          <Path d="m8 12 3 3 5-6" />
        </Svg>
      );

    // Directional CTA navigation indicator (Continue, Explore, Ecosystem flow)
    case 'arrow':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="M4 12h16m-6-6 6 6-6 6" />
        </Svg>
      );

    // Tab bar: Overview / Dashboard root
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
        </Svg>
      );

    // Tab bar & Network Management: Private circle of up to 5 trusted contacts
    case 'people':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Circle cx={9} cy={8} r={3} />
          <Path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5" />
        </Svg>
      );

    // Live Map: User and contact geographic pins
    case 'pin':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
          <Circle cx={12} cy={10} r={2.5} />
        </Svg>
      );

    // Incident History: Timeline log
    case 'clock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Circle cx={12} cy={12} r={9} />
          <Path d="M12 7v5l3 2" />
        </Svg>
      );

    // App Preferences & Pairing management
    case 'settings':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="m9 3-1 3-3 1-2 3 2 2v4l3 1 1 4h6l1-4 3-1v-4l2-2-2-3-3-1-1-3Z" />
          <Circle cx={12} cy={12} r={3} />
        </Svg>
      );

    // Breadcrumbs & list navigation chevrons
    case 'chevron':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="m9 5 7 7-7 7" />
        </Svg>
      );

    // Top bar notification trigger
    case 'bell':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="M6 8a6 6 0 0 1 12 0v6l2 3H4l2-3Zm4 12h4" />
        </Svg>
      );

    // Device telemetry: battery level indicator
    case 'battery':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Rect x={2} y={6} width={17} height={12} rx={3} />
          <Path d="M22 10v4M6 10v4m4-4v4m4-4v4" />
        </Svg>
      );

    // Device telemetry: GPS fix indicator
    case 'gps':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Circle cx={12} cy={12} r={6} />
          <Circle cx={12} cy={12} r={2} />
          <Path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
        </Svg>
      );

    // Device telemetry: Cellular / Wi-Fi status
    case 'wifi':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-11 4a6 6 0 0 1 8 0" />
          <Circle cx={12} cy={20} r={0.6} />
        </Svg>
      );

    // Success confirmation & toast badge
    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="m5 12 4 4L19 6" />
        </Svg>
      );

    // Add member action tile
    case 'plus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="M12 5v14M5 12h14" />
        </Svg>
      );

    // Member & emergency contact call modal
    case 'phone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="m6 3 4 5-3 3a14 14 0 0 0 6 6l3-3 5 4c-1 5-5 5-8 3C7 18 3 14 2 8c-1-3 1-5 4-5Z" />
        </Svg>
      );

    // Modal dismiss & member remove icon
    case 'close':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="m6 6 12 12M6 18 18 6" />
        </Svg>
      );

    // Privacy lock note on settings screen
    case 'lock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Rect x={5} y={10} width={14} height={11} rx={3} />
          <Path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" />
        </Svg>
      );

    // SOS activity heartbeat symbol
    case 'activity':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="M2 12h5l3-8 4 16 3-8h5" />
        </Svg>
      );

    // Sign out / disconnect
    case 'logout':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="M10 4H4v16h6m4-12 4 4-4 4m-5-4h12" />
        </Svg>
      );

    default:
      return null;
  }
}
