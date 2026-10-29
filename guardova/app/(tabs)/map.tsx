// app/(tabs)/map.tsx
// Live Map route entry — renders LiveMapScreen feature component
// Optional params: from=alert&member=<name> (approved addition D5: back to the alert)

import React from 'react';
import { LiveMapScreen } from '../../src/features/map/LiveMapScreen';

export default function MapPage() {
  return <LiveMapScreen />;
}
