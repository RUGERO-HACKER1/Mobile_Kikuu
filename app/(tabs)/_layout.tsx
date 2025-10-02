import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
// Use Expo vector icons typings (already present in dependencies)
import { Ionicons } from '@expo/vector-icons';

// Optional HapticTab (for press feedback)
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';


function HapticTab({ children, onPress, accessibilityState }: BottomTabBarButtonProps & { children: React.ReactNode }) {
  const focused = accessibilityState.selected;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 6 }}
    >
      {children}
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarButton: HapticTab, // Optional: use TouchableOpacity with haptic feedback
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          height: 60,
          borderTopWidth: 0,
          paddingBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="category"
        options={{
          title: 'Category',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'grid' : 'grid-outline'} size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="My_Kikuu"
        options={{
          title: 'My Kikuu',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'bag-outline'} size={28} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'grid' : 'person-outline'} size={28} color={color} />
          ),
        }}
      />

      {/** Cart tab removed; cart is managed within the Dashboard */}
    </Tabs>
  );
}
