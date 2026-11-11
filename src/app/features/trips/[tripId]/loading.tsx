import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Layout } from '../../../shared/constants/theme';

export default function TripLoadingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.cardHeader}>
        <Text style={styles.headerTitle}>دمشق ← حلب</Text>
        <Text style={styles.headerSub}>توقيت دمشق · جلب المقاعد المتاحة</Text>
      </View>

      <View style={styles.loaderRow}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.loaderText}>جارٍ فحص خريطة مقاعد الحافلة...</Text>
      </View>

      {/* Skeleton Blocks */}
      <View style={styles.skeletonCard}>
        <View style={styles.skeletonBlockLarge} />
        <View style={styles.skeletonRow}>
          <View style={styles.skeletonBlockSmall} />
          <View style={styles.skeletonBlockSmall} />
          <View style={styles.skeletonBlockSmall} />
        </View>
      </View>

      <View style={styles.skeletonCard}>
        <View style={styles.skeletonBlockLarge} />
        <View style={styles.skeletonRow}>
          <View style={styles.skeletonBlockSmall} />
          <View style={styles.skeletonBlockSmall} />
          <View style={styles.skeletonBlockSmall} />
        </View>
      </View>

      <Text style={styles.footerNote}>
        نحدّث المواعيد والأسعار وإتاحة المقاعد. يرجى الانتظار.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPage,
    padding: Layout.spacing.lg,
    paddingTop: 60,
  },
  cardHeader: {
    backgroundColor: Colors.surface,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'flex-end',
    marginBottom: Layout.spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textMain,
  },
  headerSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  loaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginVertical: Layout.spacing.sm,
    justifyContent: 'center',
  },
  loaderText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '700',
  },
  skeletonCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  skeletonBlockLarge: {
    height: 24,
    backgroundColor: '#E2E8F0',
    borderRadius: Layout.borderRadius.sm,
    marginBottom: Layout.spacing.md,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  skeletonBlockSmall: {
    flex: 1,
    height: 48,
    backgroundColor: '#F1F5F9',
    borderRadius: Layout.borderRadius.sm,
  },
  footerNote: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Layout.spacing.xl,
  },
});
