import React from 'react';
import { Tabs } from 'expo-router';
import { Text, StyleSheet } from 'react-native';
import { Colors, Layout } from '../../shared/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'البحث',
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>🚌</Text>,
        }}
      />
      <Tabs.Screen
        name="my-bookings/index"
        options={{
          title: 'حجوزاتي',
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>🎟️</Text>,
        }}
      />
      <Tabs.Screen
        name="notifications/index"
        options={{
          title: 'الإشعارات',
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>🔔</Text>,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'حسابي',
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>👤</Text>,
        }}
      />
      {/* Hidden sub-screens inside profile */}
      <Tabs.Screen
        name="profile/change-phone"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/help"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  tabIcon: {
    fontSize: 20,
    minHeight: Layout.minTouchSize / 2,
  },
});
