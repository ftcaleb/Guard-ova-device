// app/(tabs)/device.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DevicePage() {
  return (
    <View style={styles.container}>
      <Text>My Device Screen (Phase 2)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
});

