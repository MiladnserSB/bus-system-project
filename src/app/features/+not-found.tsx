import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../shared/constants/theme';
import { AppButton } from '../shared/components/AppButton';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <Text style={styles.title}>الصفحة غير موجودة (404)</Text>
      <Text style={styles.message}>
        عذراً، المسار الذي تحاول الوصول إليه غير متوفر.
      </Text>
      <AppButton
        title="العودة للرئيسية"
        onPress={() => router.replace('/features/(tabs)' as any)}
        style={styles.btn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.xl,
    backgroundColor: Colors.bgPage,
  },
  icon: {
    fontSize: 48,
    marginBottom: Layout.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textMain,
    marginBottom: Layout.spacing.xs,
  },
  message: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  btn: {
    minWidth: 180,
  },
});
