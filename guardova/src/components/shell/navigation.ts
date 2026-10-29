// src/components/shell/navigation.ts
// Leaving a stacked flow (SOS, Countdown, Emergency) for a tab: pop the stack back
// to the tabs screen underneath instead of stacking a second copy of it.
// (router.dismissTo() does not match the "(tabs)" group entry in this expo-router version.)

import type { useRouter } from 'expo-router';

type Router = ReturnType<typeof useRouter>;

export function leaveToTab(router: Router, href: string) {
  if (router.canDismiss()) router.dismissAll();
  router.navigate(href as any);
}
