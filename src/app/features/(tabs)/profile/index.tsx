import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../../shared/constants/theme';
import { AppButton } from '../../../shared/components/AppButton';
import { AppInput } from '../../../shared/components/AppInput';
import { Toast } from '../../../shared/components/Toast';
import { SecureStorage } from '../../../shared/api/secureStore';

export default function ProfileScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('أحمد خالد الحسن');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSaveName = () => {
    setToastMessage('تم تحديث الاسم بنجاح');
    setToastVisible(true);
  };

  const handleLogout = async () => {
    await SecureStorage.clearSession();
    router.replace('/features/(auth)' as any);
  };

  return (
    <View style={styles.container}>
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type="success"
        onDismiss={() => setToastVisible(false)}
      />

      {/* Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>→</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الملف الشخصي</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.userTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{fullName}</Text>
              <Text style={styles.userPhoneBadge}>+963 9•• ••• •22 · رقم موثّق</Text>
            </View>
          </View>

          {/* Name Field */}
          <AppInput
            label="الاسم الكامل"
            value={fullName}
            onChangeText={setFullName}
            helperText="كما يظهر في وثيقة الهوية"
          />

          <AppButton
            title="حفظ الاسم"
            onPress={handleSaveName}
            style={styles.saveNameBtn}
          />

          {/* Phone change row */}
          <View style={styles.phoneChangeRow}>
            <Text style={styles.maskedPhone}>+963 9•• ••• •22</Text>
            <TouchableOpacity
              onPress={() => router.push('/features/(tabs)/profile/change-phone' as any)}
            >
              <Text style={styles.changePhoneLink}>تغيير رقم الهاتف</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.phoneChangeNotice}>
            يتطلب تغيير الرقم التحقق برمز OTP قبل اعتماده.
          </Text>
        </View>

        {/* Links Menu Card */}
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/features/(tabs)/profile/help' as any)}
          >
            <Text style={styles.menuArrow}>‹</Text>
            <View style={styles.menuRight}>
              <Text style={styles.menuLabel}>المساعدة والأسئلة الشائعة</Text>
              <Text style={styles.menuIcon}>❓</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/features/(tabs)/profile/help' as any)}
          >
            <Text style={styles.menuArrow}>‹</Text>
            <View style={styles.menuRight}>
              <Text style={styles.menuLabel}>سياسة الخصوصية</Text>
              <Text style={styles.menuIcon}>🛡️</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/features/(tabs)/profile/help' as any)}
          >
            <Text style={styles.menuArrow}>‹</Text>
            <View style={styles.menuRight}>
              <Text style={styles.menuLabel}>شروط الاستخدام</Text>
              <Text style={styles.menuIcon}>📄</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <AppButton
          title="تسجيل الخروج"
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutBtn}
        />

        <Text style={styles.footerBrand}>
          مسار · بياناتك محفوظة لحجوزاتك فقط
        </Text>
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
  userCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.md,
  },
  userTop: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.seatAvailable,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    fontSize: 26,
  },
  userInfo: {
    alignItems: 'flex-end',
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textMain,
    marginBottom: 4,
  },
  userPhoneBadge: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  saveNameBtn: {
    marginTop: Layout.spacing.sm,
    marginBottom: Layout.spacing.md,
  },
  phoneChangeRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Layout.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  maskedPhone: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    direction: 'ltr',
  },
  changePhoneLink: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
  },
  phoneChangeNotice: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 4,
  },
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.xl,
    paddingHorizontal: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing.md,
    minHeight: Layout.minTouchSize,
  },
  menuRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMain,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuArrow: {
    fontSize: 20,
    color: Colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  logoutBtn: {
    width: '100%',
    marginBottom: Layout.spacing.md,
  },
  footerBrand: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
