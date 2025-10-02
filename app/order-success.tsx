import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OrderSuccess() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>✅</Text>
      <Text style={styles.title}>Order Placed!</Text>
      <Text style={styles.subtitle}>Thank you for your purchase.</Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.btnText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 16 },
  emoji: { fontSize: 64, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: '#555', marginBottom: 16 },
  btn: { backgroundColor: '#4f46e5', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: '700' },
});


