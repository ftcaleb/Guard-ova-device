// src/components/ui/WearableImage.tsx
// DESIGN-SPEC §12.1 & §15.4: Use pre-rendered transparent PNGs from assets
// For mobile home card: wearable-home-card@3x.png (145×155 scaled 1.05)
// Tapping the wearable face triggers the SOS countdown.

import React from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';

interface WearableImageProps {
  variant?: 'home' | 'device';
  onPress?: () => void;
}

export function WearableImage({ variant = 'home', onPress }: WearableImageProps) {
  const isDevice = variant === 'device';

  return (
    <View style={isDevice ? styles.deviceContainer : styles.homeContainer}>
      <Pressable
        onPress={onPress}
        style={styles.pressable}
        accessibilityRole="button"
        accessibilityLabel="Simulate pressing the Guard’Ova wearable SOS button"
      >
        <Image
          source={
            isDevice
              ? require('../../../assets/images/wearable-device-screen.png')
              : require('../../../assets/images/wearable-home-card.png')
          }
          style={isDevice ? styles.deviceImage : styles.homeImage}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    width: 145,
    height: 155,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeImage: {
    width: 145,
    height: 155,
    transform: [{ scale: 1.05 }],
  },
  deviceContainer: {
    width: 280,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceImage: {
    width: 280,
    height: 260,
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

