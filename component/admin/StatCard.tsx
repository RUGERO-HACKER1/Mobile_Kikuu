// components/admin/StatCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // Or any icon library

type StatCardProps = {
  title: string;
  value: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  colors: [string, string];
};

const StatCard = ({ title, value, iconName, colors }: StatCardProps) => {
  return (
    <LinearGradient colors={colors} style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={28} color="white" />
      </View>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    width: 170, // Fixed width for horizontal scroll
    marginRight: 16,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default StatCard;