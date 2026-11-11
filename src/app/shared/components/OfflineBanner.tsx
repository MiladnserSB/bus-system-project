import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Layout } from '../constants/theme';

interface OfflineBannerProps {
  isOffline?: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOffline = false }) => {
  if (!isOffline) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.text}>
        انقطع الاتصال بالإنترنت. يرجى التحقق من الشبكة للمتابعة.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Colors.danger,
    paddingVertical: Layout.spacing.xs + 2,
    paddingHorizontal: Layout.spacing.md,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    width: '100%',
  },
  icon: {
    fontSize: 14,
  },
  text: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
});
