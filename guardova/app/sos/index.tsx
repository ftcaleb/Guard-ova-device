// app/sos/index.tsx — Screen 7, SOS Activation
// Breadcrumb: "My safety › Emergency SOS" (no tab highlighted, DESIGN-SPEC §15.7)

import React from 'react';
import { ScreenShell } from '../../src/components/shell/ScreenShell';
import { SosActivationScreen } from '../../src/features/sos/SosActivationScreen';

export default function SosPage() {
  return (
    <ScreenShell title="Emergency SOS">
      <SosActivationScreen />
    </ScreenShell>
  );
}
