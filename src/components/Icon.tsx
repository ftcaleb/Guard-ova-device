import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

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
  name: IconName;
  size?: number;
  color?: string;
}

/**
 * Guard'Ova Icon System
 * Exactly matches design/DESIGN-SPEC.md §6
 * viewBox="0 0 24 24", strokeWidth="1.65", round caps and joins.
 */
export function Icon({ name, size = 20, color = 'currentColor' }: IconProps) {
  const commonProps = {
    fill: 'none',
    stroke: color,
    strokeWidth: 1.65,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'shield':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="M12 3 3.5 6v6c0 5 8.5 9 8.5 9s8.5-4 8.5-9V6Z" />
          <Path d="m8 12 3 3 5-6" />
        </Svg>
      );
    case 'arrow':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="M4 12h16m-6-6 6 6-6 6" />
        </Svg>
      );
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
        </Svg>
      );
    case 'people':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Circle cx={9} cy={8} r={3} />
          <Path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5" />
        </Svg>
      );
    case 'pin':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
          <Circle cx={12} cy={10} r={2.5} />
        </Svg>
      );
    case 'clock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Circle cx={12} cy={12} r={9} />
          <Path d="M12 7v5l3 2" />
        </Svg>
      );
    case 'settings':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="m9 3-1 3-3 1-2 3 2 2v4l3 1 1 4h6l1-4 3-1v-4l2-2-2-3-3-1-1-3Z" />
          <Circle cx={12} cy={12} r={3} />
        </Svg>
      );
    case 'chevron':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="m9 5 7 7-7 7" />
        </Svg>
      );
    case 'bell':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="M6 8a6 6 0 0 1 12 0v6l2 3H4l2-3Zm4 12h4" />
        </Svg>
      );
    case 'battery':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Rect x={2} y={6} width={17} height={12} rx={3} />
          <Path d="M22 10v4M6 10v4m4-4v4m4-4v4" />
        </Svg>
      );
    case 'gps':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Circle cx={12} cy={12} r={6} />
          <Circle cx={12} cy={12} r={2} />
          <Path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
        </Svg>
      );
    case 'wifi':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-11 4a6 6 0 0 1 8 0" />
          <Circle cx={12} cy={20} r={0.6} />
        </Svg>
      );
    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="m5 12 4 4L19 6" />
        </Svg>
      );
    case 'plus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="M12 5v14M5 12h14" />
        </Svg>
      );
    case 'phone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="m6 3 4 5-3 3a14 14 0 0 0 6 6l3-3 5 4c-1 5-5 5-8 3C7 18 3 14 2 8c-1-3 1-5 4-5Z" />
        </Svg>
      );
    case 'close':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="m6 6 12 12M6 18 18 6" />
        </Svg>
      );
    case 'lock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Rect x={5} y={10} width={14} height={11} rx={3} />
          <Path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" />
        </Svg>
      );
    case 'activity':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
          <Path d="M2 12h5l3-8 4 16 3-8h5" />
        </Svg>
      );
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
