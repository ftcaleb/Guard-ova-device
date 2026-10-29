// app/_layout.tsx — Root layout
// Loads ALL font files before hiding splash screen.
// Sets up expo-router Stack with the app shell visible on every screen.
// Per CLAUDE.md: "Top bar and tab bar on every screen"

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useStore } from '../src/state/store';
import { useSosEngine } from '../src/features/sos/useSosEngine';

// Keep splash screen visible until fonts load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    // DM Sans — all weights at opsz 14 (static files — per CLAUDE.md decision D11)
    'DMSans-400': require('../assets/fonts/DMSans-400.ttf'),
    'DMSans-450': require('../assets/fonts/DMSans-450.ttf'),
    'DMSans-500': require('../assets/fonts/DMSans-500.ttf'),
    'DMSans-550': require('../assets/fonts/DMSans-550.ttf'),
    'DMSans-600': require('../assets/fonts/DMSans-600.ttf'),
    'DMSans-650': require('../assets/fonts/DMSans-650.ttf'),
    'DMSans-700': require('../assets/fonts/DMSans-700.ttf'),
    // Manrope — headings, avatar initials, SOS countdown
    'Manrope-400': require('../assets/fonts/Manrope-400.ttf'),
    'Manrope-500': require('../assets/fonts/Manrope-500.ttf'),
    'Manrope-600': require('../assets/fonts/Manrope-600.ttf'),
    'Manrope-650': require('../assets/fonts/Manrope-650.ttf'),
    'Manrope-700': require('../assets/fonts/Manrope-700.ttf'),
    'Manrope-750': require('../assets/fonts/Manrope-750.ttf'),
    'Manrope-800': require('../assets/fonts/Manrope-800.ttf'),
    // Inter — map labels only (per DESIGN-SPEC §16 bug 5 fix)
    'Inter-400': require('../assets/fonts/Inter-400.ttf'),
  });

  // The persisted emergency state must be loaded before the first screen renders,
  // so an active emergency reopens straight onto Emergency Active (no flash of Home).
  const hasHydrated = useStore((s) => s.hasHydrated);
  const ready = (fontsLoaded || !!fontError) && hasHydrated;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  useSosEngine(ready);

  if (!ready) {
    return null;
  }

  return (
    <>
      {/* Light status bar — per HOW-TO-MATCH: dark icons on white strip above topbar */}
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="alert/[member]" options={{ headerShown: false }} />
        {/* Emergency flow: no screen transitions (HOW-TO-MATCH §3) */}
        <Stack.Screen name="sos/index" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="sos/countdown" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="emergency" options={{ headerShown: false, animation: 'none', gestureEnabled: false }} />
      </Stack>
    </>
  );
}

