import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LibraryCard({ name, seats }: { name: string; seats: number }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.seats}>{seats} seats available</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f4ff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seats: {
    marginTop: 4,
    color: '#333',
  },
});
