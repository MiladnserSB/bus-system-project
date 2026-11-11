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

export default function ChangePhoneScreen() {
  const router = useRouter();

  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [newPhone, setNewPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    if (newPhone.replace(/\s+/g, '').length < 9) {
      setToastMessage('يرجى إدخال 9 أرقام صحيحة');
      setToastVisible(true);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
    }, 600);
  };

  const handleVerify = () => {
    if (otp.length < 6) {
      setToastMessage('يرجى إدخال رمز التحقق المكون من 6 أرقام');
      setToastVisible(true);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToastMessage('تم تحديث وتوثيق رقم الهاتف الجديد بنجاح');
      setToastVisible(true);
      setTimeout(() => router.back(), 1200);
    }, 600);
  };

  return (
    <View style={styles.container}>
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type="success"
        onDismiss={() => setToastVisible(false)}
      />

      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>→</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تغيير رقم الهاتف</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          {step === 'PHONE' ? (
            <>
              <Text style={styles.cardTitle}>أدخل رقم الهاتف الجديد</Text>
              <Text style={styles.cardSub}>
                سنرسل رمز تحقق للتأكد من ملكيتك للرقم الجديد.
              </Text>

              <AppInput
                placeholder="9XX XXX XXX"
                value={newPhone}
                onChangeText={setNewPhone}
                keyboardType="phone-pad"
                prefix="+963"
                helperText="أدخل 9 أرقام دون الصفر الأول"
              />

              <AppButton
                title="إرسال رمز التحقق"
                onPress={handleSendOtp}
                loading={loading}
                style={styles.submitBtn}
              />
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>أدخل رمز التحقق (OTP)</Text>
              <Text style={styles.cardSub}>
                أرسلنا الرمز المكوّن من 6 أرقام إلى +963 {newPhone}.
              </Text>

              <AppInput
                placeholder="••••••"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
              />

              <AppButton
                title="تأكيد التغيير"
                onPress={handleVerify}
                loading={loading}
                style={styles.submitBtn}
              />

              <AppButton
                title="تعديل الرقم"
                variant="ghost"
                onPress={() => setStep('PHONE')}
                style={styles.backStepBtn}
              />
            </>
          )}
        </View>
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
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textMain,
  },
  scroll: {
    padding: Layout.spacing.lg,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textMain,
    textAlign: 'right',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'right',
    marginBottom: Layout.spacing.lg,
    lineHeight: 20,
  },
  submitBtn: {
    marginTop: Layout.spacing.md,
    width: '100%',
  },
  backStepBtn: {
    marginTop: Layout.spacing.xs,
    width: '100%',
  },
});
