// app/(tabs)/member/[member].tsx
// Member Profile route entry. Breadcrumb "My Network", no tab highlighted (DESIGN-SPEC §8.2, §15.7)

import React from 'react';
import { MemberProfileScreen } from '../../../src/features/network/MemberProfileScreen';

export default function MemberProfilePage() {
  return <MemberProfileScreen />;
}
