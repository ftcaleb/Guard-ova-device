// app/sos/countdown.tsx — Screen 8, SOS Countdown
// Breadcrumb: "My safety › Emergency SOS" (same title as SOS Activation)

import React from 'react';
import { ScreenShell } from '../../src/components/shell/ScreenShell';
import { SosCountdownScreen } from '../../src/features/sos/SosCountdownScreen';

export default function SosCountdownPage() {
  return (
    <ScreenShell title="Emergency SOS">
      <SosCountdownScreen />
    </ScreenShell>
  );
}
