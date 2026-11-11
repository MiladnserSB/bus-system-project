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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Layout } from '@/app/shared/constants/theme';
import { AppButton } from '@/app/shared/components/AppButton';
import { AppInput } from '@/app/shared/components/AppInput';
import { useCountdown } from '@/app/shared/hooks/useCountdown';
import { MOCK_TRIPS, Trip, MOCK_BOOKINGS } from '@/app/shared/constants/mockData';

export default function BookingFormScreen() {
  const router = useRouter();
  const { tripId, seats, totalPrice } = useLocalSearchParams<{
    tripId: string;
    seats?: string;
    totalPrice?: string;
  }>();

  const trip: Trip =
    MOCK_TRIPS.find((t: Trip) => t.id === tripId) || MOCK_TRIPS[0];

  const selectedSeats = seats ? seats.split(',') : ['12'];
  const priceNum = totalPrice ? parseInt(totalPrice, 10) : trip.price;

  const [passengerName, setPassengerName] = useState('أحمد خالد الحسن');
  const [passengerPhone, setPassengerPhone] = useState('944 218 630');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  // 10-minute hold timer for review step
  const { formattedTime } = useCountdown(582);

  const handleConfirmBooking = () => {
    if (!passengerName.trim()) {
      alert('يرجى إدخال اسم المسافر');
      return;
    }
    if (!passengerPhone.trim()) {
      alert('يرجى إدخال رقم الهاتف');
      return;
    }
    if (!agreedToTerms) {
      alert('يرجى الموافقة على شروط الحجز وسياسة الإلغاء');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const bookingCode = `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-0042`;

      MOCK_BOOKINGS.unshift({
        code: bookingCode,
        tripId: trip.id,
        origin: trip.origin,
        destination: trip.destination,
        departDate: trip.dateStr,
        departTime: trip.departTime,
        seatNumbers: selectedSeats,
        passengerName,
        passengerPhone: `+963 ${passengerPhone}`,
        totalPrice: priceNum,
        status: 'CONFIRMED',
        busTypeName: trip.busTypeName,
        paymentMethod: 'CASH_OFFICE',
      });

      router.replace(`/features/tickets/${bookingCode}` as any);
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>→</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>بيانات المسافر</Text>
        <TouchableOpacity
          onPress={() => router.push('/features/(tabs)/profile/help' as any)}
          style={styles.helpBtn}
        >
          <Text style={styles.helpText}>🎧</Text>
        </TouchableOpacity>
      </View>

      {/* Stepper Bar */}
      <View style={styles.stepperRow}>
        <Text style={styles.stepItemActive}>3 البيانات والمراجعة</Text>
        <Text style={styles.stepDot}>·</Text>
        <Text style={styles.stepItemDone}>✓ المقعد</Text>
        <Text style={styles.stepDot}>·</Text>
        <Text style={styles.stepItemDone}>✓ الرحلة</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Hold Alert Banner */}
        <View style={styles.holdBanner}>
          <Text style={styles.holdIcon}>🕒</Text>
          <View style={styles.holdTexts}>
            <Text style={styles.holdTitle}>
              المقعد {selectedSeats.join(', ')} محفوظ لك مؤقتاً
            </Text>
            <Text style={styles.holdSub}>الوقت المتبقي {formattedTime}</Text>
          </View>
        </View>

        {/* Trip Overview Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.badgeAvailable}>
              <Text style={styles.badgeText}>متاحة</Text>
            </View>
            <Text style={styles.operatorText}>{trip.operator} 🚌</Text>
          </View>

          <View style={styles.timeRow}>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{trip.arrivalTime}</Text>
              <Text style={styles.cityText}>{trip.destination}</Text>
            </View>
            <View style={styles.durationCol}>
              <Text style={styles.durationText}>{trip.duration}</Text>
              <Text style={styles.arrowIcon}>←</Text>
              <Text style={styles.directText}>مباشرة · مكيفة</Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{trip.departTime}</Text>
              <Text style={styles.cityText}>{trip.origin}</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.seatsLeftText}>{trip.availableSeats} مقاعد متاحة</Text>
            <Text style={styles.tripPriceText}>
              {trip.price.toLocaleString('ar-SY')} ل.س / مسافر
            </Text>
          </View>
        </View>

        {/* Passenger Details Form */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>بيانات المسافر</Text>

          <AppInput
            label="الاسم الكامل"
            placeholder="ادخل الاسم كما في الهوية"
            value={passengerName}
            onChangeText={setPassengerName}
            helperText="كما يظهر في وثيقة الهوية"
          />

          <AppInput
            label="رقم الهاتف"
            placeholder="9XX XXX XXX"
            value={passengerPhone}
            onChangeText={setPassengerPhone}
            keyboardType="phone-pad"
            prefix="+963"
            helperText="أدخل 9 أرقام دون الصفر الأول"
          />
        </View>

        {/* Payment Method Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>طريقة الدفع</Text>
          <View style={styles.paymentBox}>
            <Text style={styles.radioSelected}>◉</Text>
            <Text style={styles.paymentMethodLabel}>الدفع في المكتب</Text>
          </View>
          <Text style={styles.paymentHelper}>
            راجع مكتب الشركة لإتمام الدفع. لا توجد دفعة إلكترونية في هذه الخطوة.
          </Text>
        </View>

        {/* Booking Summary Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>مراجعة الحجز</Text>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryVal}>{trip.code}</Text>
            <Text style={styles.summaryLabel}>رقم الرحلة</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryVal}>
              المقعد {selectedSeats.join(', ')} · مسافر واحد
            </Text>
            <Text style={styles.summaryLabel}>المقعد</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryVal}>
              {trip.dateStr} · {trip.departTime}
            </Text>
            <Text style={styles.summaryLabel}>الانطلاق</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryVal}>{trip.originStation}</Text>
            <Text style={styles.summaryLabel}>نقطة الانطلاق</Text>
          </View>

          <View style={[styles.summaryItem, styles.totalItem]}>
            <Text style={styles.totalVal}>
              {priceNum.toLocaleString('ar-SY')} ل.س
            </Text>
            <Text style={styles.totalLabel}>الإجمالي</Text>
          </View>
          <Text style={styles.feeNote}>شامل جميع الرسوم · لا مبالغ إضافية</Text>
        </View>

        {/* Conflict Protection Notice */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ⓘ</Text>
          <Text style={styles.infoText}>
            إذا تعارض المقعد عند التأكيد، ستبقى بياناتك محفوظة؛ اختر مقعداً متاحاً آخر دون إعادة إدخالها.
          </Text>
        </View>

        {/* Terms Checkbox */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAgreedToTerms(!agreedToTerms)}
        >
          <Text style={styles.checkboxText}>
            أوافق على شروط الحجز وسياسة الإلغاء، وأؤكد صحة بيانات المسافر.
          </Text>
          <Text style={[styles.checkboxIcon, agreedToTerms && styles.checkboxActive]}>
            {agreedToTerms ? '☑' : '☐'}
          </Text>
        </TouchableOpacity>

        {/* Confirm Booking Button */}
        <AppButton
          title="تأكيد الحجز"
          onPress={handleConfirmBooking}
          loading={loading}
          style={styles.confirmBtn}
        />
        <Text style={styles.confirmSub}>ستظهر التذكرة وحالة الدفع بعد التأكيد.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPage,
  },
  topHeader: {
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingBottom: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: Layout.spacing.xs,
  },
  backText: {
    fontSize: 22,
    color: Colors.white,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
  },
  helpBtn: {
    padding: Layout.spacing.xs,
  },
  helpText: {
    fontSize: 20,
  },
  stepperRow: {
    flexDirection: 'row-reverse',
    backgroundColor: Colors.primaryDark,
    paddingVertical: Layout.spacing.xs + 2,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  stepItemActive: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '800',
  },
  stepItemDone: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  stepDot: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  scroll: {
    padding: Layout.spacing.lg,
    paddingBottom: 40,
  },
  holdBanner: {
    flexDirection: 'row-reverse',
    backgroundColor: Colors.warningBg,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.md,
  },
  holdIcon: {
    fontSize: 18,
  },
  holdTexts: {
    alignItems: 'flex-end',
    flex: 1,
  },
  holdTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textMain,
  },
  holdSub: {
    fontSize: 11,
    color: Colors.warning,
    fontWeight: '700',
    marginTop: 2,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  operatorText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textMain,
  },
  badgeAvailable: {
    backgroundColor: Colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Layout.borderRadius.full,
  },
  badgeText: {
    color: Colors.success,
    fontSize: 11,
    fontWeight: '800',
  },
  timeRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Layout.spacing.sm,
  },
  timeBox: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textMain,
  },
  cityText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  durationCol: {
    alignItems: 'center',
  },
  durationText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  arrowIcon: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  directText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  priceRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Layout.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  tripPriceText: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.primary,
  },
  seatsLeftText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.textMain,
    textAlign: 'right',
    marginBottom: Layout.spacing.md,
  },
  paymentBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.bgPage,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    padding: Layout.spacing.md,
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.xs,
  },
  radioSelected: {
    fontSize: 16,
    color: Colors.primary,
  },
  paymentMethodLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textMain,
  },
  paymentHelper: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'right',
  },
  summaryItem: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMain,
  },
  totalItem: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    marginTop: Layout.spacing.xs,
    paddingTop: Layout.spacing.sm,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textMain,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primary,
  },
  feeNote: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'right',
  },
  infoBox: {
    flexDirection: 'row-reverse',
    backgroundColor: Colors.infoBg,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
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
  checkboxRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.lg,
  },
  checkboxIcon: {
    fontSize: 18,
    color: Colors.textMuted,
  },
  checkboxActive: {
    color: Colors.primary,
  },
  checkboxText: {
    flex: 1,
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'right',
    lineHeight: 18,
  },
  confirmBtn: {
    width: '100%',
  },
  confirmSub: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
});
