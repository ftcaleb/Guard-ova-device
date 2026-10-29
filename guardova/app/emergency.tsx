// app/emergency.tsx — Screen 9, Emergency Active
// Breadcrumb: "My safety › Emergency Active"

import React from 'react';
import { ScreenShell } from '../src/components/shell/ScreenShell';
import { EmergencyActiveScreen } from '../src/features/emergency/EmergencyActiveScreen';

export default function EmergencyPage() {
  return (
    <ScreenShell title="Emergency Active">
      <EmergencyActiveScreen />
    </ScreenShell>
  );
}
