import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Layout } from '@/app/shared/constants/theme';

export default function TicketLoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.title}>جارٍ إصدار التذكرة الرقمية...</Text>
      <Text style={styles.sub}>يتم توليد رمز الـ QR وتثبيت بيانات الصعود.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPage,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.xl,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textMain,
    marginTop: Layout.spacing.lg,
    marginBottom: 4,
  },
  sub: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
