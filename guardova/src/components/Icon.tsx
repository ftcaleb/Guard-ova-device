// Guard'Ova — Icon component
// 19 SVG paths from DESIGN-SPEC.md §6
// stroke-width 1.65, round caps and joins, fill="none"
// Source: design/reference-prototype/src/App.tsx (copied exactly)

import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export type IconName =
  | 'home' | 'shield' | 'people' | 'pin' | 'clock' | 'settings'
  | 'arrow' | 'chevron' | 'bell' | 'battery' | 'gps' | 'wifi'
  | 'check' | 'plus' | 'phone' | 'close' | 'lock' | 'activity' | 'logout';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

/**
 * Guard'Ova icon component.
 * Uses the exact 19 SVG paths from DESIGN-SPEC §6.
 * stroke-width 1.65, strokeLinecap="round", strokeLinejoin="round"
 * Never use an icon library — only these exact paths.
 */
export function Icon({ name, size = 20, color = 'currentColor' }: IconProps) {
  const strokeProps = {
    stroke: color,
    strokeWidth: 1.65,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  const renderPath = () => {
    switch (name) {
      case 'home':
        return <Path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" {...strokeProps} />;

      case 'shield':
        return (
          <>
            <Path d="M12 3 3.5 6v6c0 5 8.5 9 8.5 9s8.5-4 8.5-9V6Z" {...strokeProps} />
            <Path d="m8 12 3 3 5-6" {...strokeProps} />
          </>
        );

      case 'people':
        return (
          <>
            <Circle cx={9} cy={8} r={3} {...strokeProps} />
            <Path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5" {...strokeProps} />
          </>
        );

      case 'pin':
        return (
          <>
            <Path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" {...strokeProps} />
            <Circle cx={12} cy={10} r={2.5} {...strokeProps} />
          </>
        );

      case 'clock':
        return (
          <>
            <Circle cx={12} cy={12} r={9} {...strokeProps} />
            <Path d="M12 7v5l3 2" {...strokeProps} />
          </>
        );

      case 'settings':
        return (
          <>
            <Path d="m9 3-1 3-3 1-2 3 2 2v4l3 1 1 4h6l1-4 3-1v-4l2-2-2-3-3-1-1-3Z" {...strokeProps} />
            <Circle cx={12} cy={12} r={3} {...strokeProps} />
          </>
        );

      case 'arrow':
        return <Path d="M4 12h16m-6-6 6 6-6 6" {...strokeProps} />;

      case 'chevron':
        return <Path d="m9 5 7 7-7 7" {...strokeProps} />;

      case 'bell':
        return (
          <>
            <Path d="M6 8a6 6 0 0 1 12 0v6l2 3H4l2-3Zm4 12h4" {...strokeProps} />
          </>
        );

      case 'battery':
        return (
          <>
            <Rect x={2} y={6} width={17} height={12} rx={3} {...strokeProps} />
            <Path d="M22 10v4M6 10v4m4-4v4m4-4v4" {...strokeProps} />
          </>
        );

      case 'gps':
        return (
          <>
            <Circle cx={12} cy={12} r={6} {...strokeProps} />
            <Circle cx={12} cy={12} r={2} {...strokeProps} />
            <Path d="M12 2v4m0 12v4M2 12h4m12 0h4" {...strokeProps} />
          </>
        );

      case 'wifi':
        return (
          <>
            <Path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-11 4a6 6 0 0 1 8 0" {...strokeProps} />
            <Circle cx={12} cy={20} r={0.6} {...strokeProps} />
          </>
        );

      case 'check':
        return <Path d="m5 12 4 4L19 6" {...strokeProps} />;

      case 'plus':
        return <Path d="M12 5v14M5 12h14" {...strokeProps} />;

      case 'phone':
        return (
          <Path d="m6 3 4 5-3 3a14 14 0 0 0 6 6l3-3 5 4c-1 5-5 5-8 3C7 18 3 14 2 8c-1-3 1-5 4-5Z" {...strokeProps} />
        );

      case 'close':
        return <Path d="m6 6 12 12M6 18 18 6" {...strokeProps} />;

      case 'lock':
        return (
          <>
            <Rect x={5} y={10} width={14} height={11} rx={3} {...strokeProps} />
            <Path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" {...strokeProps} />
          </>
        );

      case 'activity':
        return <Path d="M2 12h5l3-8 4 16 3-8h5" {...strokeProps} />;

      case 'logout':
        return (
          <>
            <Path d="M10 4H4v16h6m4-12 4 4-4 4m-5-4h12" {...strokeProps} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {renderPath()}
    </Svg>
  );
}

