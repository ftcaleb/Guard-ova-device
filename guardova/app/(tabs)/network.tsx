// app/(tabs)/network.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NetworkPage() {
  return (
    <View style={styles.container}>
      <Text>My Network Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
});

