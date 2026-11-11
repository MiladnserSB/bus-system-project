import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../shared/constants/theme';
import { AppButton } from '../../shared/components/AppButton';
import { AppInput } from '../../shared/components/AppInput';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('944 218 630');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    const cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.length < 9) {
      setError('يرجى إدخال 9 أرقام صحيحة لرقم الهاتف السوري');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/features/(auth)/otp' as any,
        params: { phone: `+963 ${phone}` },
      });
    }, 600);
  };

  const handleGuest = () => {
    // Navigate directly as guest
    router.replace('/features/(tabs)' as any);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header Bar */}
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>→</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>الدخول برقم الهاتف</Text>
            <Text style={styles.headerSub}>مسار · رحلتك تبدأ بوضوح</Text>
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.body}>
          {/* Logo / Badge */}
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeIcon}>🚌</Text>
          </View>

          <Text style={styles.welcomeTitle}>أهلاً بك في مسار</Text>
          <Text style={styles.welcomeSub}>
            ادخل برقم هاتفك لمتابعة حجوزاتك وتلقي تنبيهات رحلاتك.
          </Text>

          {/* Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.cardLabel}>رقم الهاتف</Text>
            <AppInput
              placeholder="9XX XXX XXX"
              value={phone}
              onChangeText={(t) => {
                setPhone(t);
                setError('');
              }}
              keyboardType="phone-pad"
              prefix="+963"
              errorText={error}
              helperText="أدخل 9 أرقام دون الصفر الأول"
            />

            <AppButton
              title="إرسال رمز التحقق"
              onPress={handleSendOtp}
              loading={loading}
              style={styles.submitBtn}
            />

            <Text style={styles.smsNote}>
              سنرسل رمزاً عبر SMS للتحقق من ملكيتك للرقم.
            </Text>
          </View>

          {/* Consent Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>ⓘ</Text>
            <Text style={styles.infoText}>
              باستمرارك، توافق على استخدام رقمك للتواصل بشأن الحجز والتحقق من هويتك فقط.
            </Text>
          </View>

          {/* Links */}
          <View style={styles.linksRow}>
            <TouchableOpacity onPress={() => router.push('/features/(tabs)/profile/help')}>
              <Text style={styles.linkText}>سياسة الخصوصية</Text>
            </TouchableOpacity>
            <Text style={styles.dot}>·</Text>
            <TouchableOpacity onPress={() => router.push('/features/(tabs)/profile/help')}>
              <Text style={styles.linkText}>شروط الاستخدام</Text>
            </TouchableOpacity>
          </View>

          {/* Guest Checkout */}
          <AppButton
            title="المتابعة كضيف"
            variant="outline"
            onPress={handleGuest}
            style={styles.guestBtn}
          />
          <Text style={styles.guestSub}>
            يمكنك البحث والحجز دون إنشاء حساب.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPage,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  topHeader: {
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingBottom: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.lg,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  backBtn: {
    padding: Layout.spacing.xs,
  },
  backText: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'right',
  },
  headerSub: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'right',
  },
  body: {
    padding: Layout.spacing.lg,
    alignItems: 'center',
  },
  badgeContainer: {
    width: 64,
    height: 64,
    borderRadius: Layout.borderRadius.lg,
    backgroundColor: Colors.seatAvailable,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  badgeIcon: {
    fontSize: 32,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textMain,
    textAlign: 'center',
    marginBottom: Layout.spacing.xs,
  },
  welcomeSub: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.md,
  },
  formCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.md,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textMain,
    textAlign: 'right',
    marginBottom: Layout.spacing.sm,
  },
  submitBtn: {
    marginTop: Layout.spacing.sm,
    width: '100%',
  },
  smsNote: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Layout.spacing.sm,
  },
  infoBox: {
    flexDirection: 'row-reverse',
    backgroundColor: Colors.infoBg,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    width: '100%',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.md,
  },
  infoIcon: {
    fontSize: 16,
    color: Colors.info,
  },
  infoText: {
    flex: 1,
    fontSize: 11,
    color: Colors.info,
    lineHeight: 18,
    textAlign: 'right',
  },
  linksRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.lg,
  },
  linkText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  dot: {
    color: Colors.textMuted,
  },
  guestBtn: {
    width: '100%',
    marginBottom: Layout.spacing.xs,
  },
  guestSub: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
