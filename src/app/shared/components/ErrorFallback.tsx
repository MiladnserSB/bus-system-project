import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Layout } from '../constants/theme';
import { AppButton } from './AppButton';

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  title = 'حدث خطأ غير متوقع',
  message = 'تعذّر إكمال طلبك. يرجى التحقق من اتصال الإنترنت وإعادة المحاولة.',
  actionText = 'إعادة المحاولة',
  onAction,
  icon = '⚠️',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onAction && (
        <AppButton
          title={actionText}
          variant="outline"
          onPress={onAction}
          style={styles.btn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.xl,
    backgroundColor: Colors.bgPage,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.md,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textMain,
    marginBottom: Layout.spacing.xs,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Layout.spacing.lg,
  },
  btn: {
    minWidth: 160,
  },
});
