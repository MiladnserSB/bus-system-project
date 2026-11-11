import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../../shared/constants/theme';
import { MOCK_NOTIFICATIONS, AppNotification } from '../../../shared/constants/mockData';

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [allowNonCritical, setAllowNonCritical] = useState(true);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>→</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>مركز الإشعارات</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Toggle Non-Critical Notifications (REQ-NOTF-08) */}
        <View style={styles.toggleCard}>
          <Switch
            value={allowNonCritical}
            onValueChange={setAllowNonCritical}
            trackColor={{ false: '#CBD5E1', true: Colors.primary }}
            thumbColor={Colors.white}
          />
          <View style={styles.toggleTexts}>
            <Text style={styles.toggleTitle}>الإشعارات غير الضرورية</Text>
            <Text style={styles.toggleSub}>
              تنبيهات إلغاء الرحلات ضرورية وتبقى مفعلة دائماً.
            </Text>
          </View>
        </View>

        {/* Notifications List */}
        {notifications.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onPress={() => handleMarkAsRead(item.id)}
            style={[styles.notifCard, !item.isRead && styles.notifCardUnread]}
          >
            <View style={styles.cardHeader}>
              {!item.isRead ? (
                <View style={styles.unreadDot} />
              ) : (
                <Text style={styles.readCheck}>✓</Text>
              )}
              <Text style={styles.notifTitle}>{item.title}</Text>
            </View>

            <Text style={styles.notifBody}>{item.body}</Text>
            <Text style={styles.notifDate}>{item.dateStr}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPage,
  },
  topHeader: {
    backgroundColor: Colors.surface,
    paddingTop: 50,
    paddingBottom: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    padding: Layout.spacing.xs,
  },
  backText: {
    fontSize: 22,
    color: Colors.textMain,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textMain,
  },
  scroll: {
    padding: Layout.spacing.lg,
    paddingBottom: 40,
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.lg,
  },
  toggleTexts: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: Layout.spacing.md,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textMain,
    textAlign: 'right',
  },
  toggleSub: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 2,
  },
  notifCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.sm,
  },
  notifCardUnread: {
    backgroundColor: '#F0F7FF',
    borderColor: '#BAE6FD',
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textMain,
    textAlign: 'right',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: Layout.spacing.sm,
  },
  readCheck: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: 'bold',
    marginLeft: Layout.spacing.sm,
  },
  notifBody: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
    lineHeight: 18,
    marginBottom: 6,
  },
  notifDate: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'right',
  },
});
