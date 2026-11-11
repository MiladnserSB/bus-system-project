import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Colors, Layout } from '../constants/theme';
import { AppButton } from './AppButton';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  confirmTitle?: string;
  cancelTitle?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  subtitle,
  confirmTitle = 'تأكيد',
  cancelTitle = 'إلغاء',
  isDestructive = false,
  onConfirm,
  onCancel,
  children,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <View style={styles.handleBar} />
              
              <View style={styles.header}>
                <TouchableOpacity onPress={onCancel} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{title}</Text>
              </View>

              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

              {children && <View style={styles.content}>{children}</View>}

              <View style={styles.actions}>
                <AppButton
                  title={confirmTitle}
                  variant={isDestructive ? 'danger' : 'primary'}
                  onPress={onConfirm}
                  style={styles.actionBtn}
                />
                <AppButton
                  title={cancelTitle}
                  variant="outline"
                  onPress={onCancel}
                  style={styles.actionBtn}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.xl,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Layout.spacing.md,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textMain,
    textAlign: 'right',
  },
  closeIcon: {
    fontSize: 16,
    color: Colors.textMuted,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'right',
    lineHeight: 20,
    marginBottom: Layout.spacing.md,
  },
  content: {
    marginBottom: Layout.spacing.lg,
  },
  actions: {
    gap: Layout.spacing.sm,
  },
  actionBtn: {
    width: '100%',
  },
});
