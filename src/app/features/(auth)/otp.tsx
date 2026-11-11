import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Layout } from '../../shared/constants/theme';
import { AppButton } from '../../shared/components/AppButton';
import { SecureStorage } from '../../shared/api/secureStore';

export default function OtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string }>();
  const phone = params.phone || '+963 944 218 630';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (val: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    setErrorMessage('');
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setErrorMessage('يرجى إدخال الرمز كاملاً المكون من 6 أرقام');
      return;
    }

    setLoading(true);

    // Mock verification
    setTimeout(async () => {
      setLoading(false);
      // Save tokens
      await SecureStorage.saveTokens('mock_access_token_123', 'mock_refresh_token_123');
      router.replace('/features/(tabs)' as any);
    }, 600);
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    setErrorMessage('');
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
            <Text style={styles.headerTitle}>التحقق من الرمز</Text>
            <Text style={styles.headerSub}>خطوة واحدة للوصول إلى حجوزاتك</Text>
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.body}>
          {/* Badge */}
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeIcon}>📩</Text>
          </View>

          <Text style={styles.title}>تحقّق من رقم هاتفك</Text>
          <Text style={styles.subtitle}>
            أدخل الرمز المكوّن من 6 أرقام. لا تشارك رمز التحقق مع أي شخص.
          </Text>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>رمز التحقق</Text>
            <Text style={styles.phoneNotice}>أرسلنا رسالة SMS إلى {phone}</Text>

            {/* 6 OTP Boxes */}
            <View style={styles.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  style={[styles.otpBox, !!errorMessage && styles.otpBoxError]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(val) => handleOtpChange(val, i)}
                  textAlign="center"
                />
              ))}
            </View>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : attemptsLeft < 3 ? (
              <Text style={styles.errorText}>
                الرمز غير صحيح. تبقّت {attemptsLeft} محاولات من أصل 3.
              </Text>
            ) : null}

            <Text style={styles.expiryText}>صلاحية الرمز 5 دقائق من وقت الإرسال.</Text>

            <AppButton
              title="تحقّق من الرمز"
              onPress={handleVerify}
              loading={loading}
              style={styles.verifyBtn}
            />
          </View>

          {/* Resend Button */}
          <AppButton
            title={timer > 0 ? `إعادة الإرسال بعد ${timer} ثانية` : 'إعادة إرسال الرمز الآن'}
            variant="secondary"
            disabled={timer > 0}
            onPress={handleResend}
            style={styles.resendBtn}
          />

          {/* Change Phone Button */}
          <AppButton
            title="تغيير رقم الهاتف"
            variant="ghost"
            onPress={() => router.back()}
            style={styles.changePhoneBtn}
          />

          {/* Policy Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>ⓘ</Text>
            <Text style={styles.infoText}>
              الحد الأقصى 3 محاولات لكل رمز. أعد طلب رمز جديد عند انتهاء الصلاحية أو استنفاد المحاولات.
            </Text>
          </View>
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
    fontSize: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textMain,
    textAlign: 'center',
    marginBottom: Layout.spacing.xs,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.md,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.md,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textMain,
    textAlign: 'right',
    marginBottom: 4,
  },
  phoneNotice: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'right',
    marginBottom: Layout.spacing.md,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
    direction: 'ltr',
  },
  otpBox: {
    width: 44,
    height: 52,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    backgroundColor: Colors.bgPage,
  },
  otpBoxError: {
    borderColor: Colors.danger,
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Layout.spacing.xs,
  },
  expiryText: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  verifyBtn: {
    width: '100%',
  },
  resendBtn: {
    width: '100%',
    marginBottom: Layout.spacing.xs,
  },
  changePhoneBtn: {
    width: '100%',
    marginBottom: Layout.spacing.md,
  },
  infoBox: {
    flexDirection: 'row-reverse',
    backgroundColor: Colors.infoBg,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    width: '100%',
    gap: Layout.spacing.sm,
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
});
