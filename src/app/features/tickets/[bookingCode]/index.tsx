import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Layout } from '@/app/shared/constants/theme';
import { AppButton } from '@/app/shared/components/AppButton';
import { Toast } from '@/app/shared/components/Toast';
import { ConfirmModal } from '@/app/shared/components/ConfirmModal';
import { MOCK_BOOKINGS, Booking } from '@/app/shared/constants/mockData';

export default function DigitalTicketScreen() {
  const router = useRouter();
  const { bookingCode } = useLocalSearchParams<{ bookingCode: string }>();

  const booking: Booking =
    MOCK_BOOKINGS.find((b: Booking) => b.code === bookingCode) || MOCK_BOOKINGS[0];

  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const handleSaveTicket = () => {
    setToastMessage('تم حفظ صورة التذكرة في معرض الهاتف بنجاح 💾');
    setToastVisible(true);
  };

  const handleShareTicket = async () => {
    try {
      await Share.share({
        message: `تذكرة مسار الرسمية\nرقم الحجز: ${booking.code}\nالمسار: ${booking.origin} ← ${booking.destination}\nالموعد: ${booking.departDate} · ${booking.departTime}\nالمقعد: ${booking.seatNumbers.join(', ')}\nالمسافر: ${booking.passengerName}\nالقيمة: ${booking.totalPrice.toLocaleString('ar-SY')} ل.س`,
      });
    } catch (error) {
      console.warn('Share error:', error);
    }
  };

  const handleConfirmCancel = () => {
    booking.status = 'CANCELLED';
    booking.cancelReason = 'إلغاء من قبل المسافر';
    setCancelModalVisible(false);
    setToastMessage('تم إلغاء الحجز بنجاح');
    setToastVisible(true);
    setTimeout(() => {
      router.replace('/features/(tabs)/my-bookings' as any);
    }, 1000);
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
        <TouchableOpacity
          onPress={() => router.replace('/features/(tabs)/my-bookings' as any)}
          style={styles.closeBtn}
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>بطاقة التذكرة الرقمية</Text>
          <Text style={styles.headerSubtitle}>حجوزاتي · تذكرة مؤكدة</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.replace('/features/(tabs)' as any)}
          style={styles.homeBtn}
        >
          <Text style={styles.homeIcon}>🏠</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Ticket Blue Card */}
        <View style={styles.ticketTopCard}>
          <View style={styles.topCardRow}>
            <View style={styles.badgeConfirmed}>
              <Text style={styles.badgeDot}>•</Text>
              <Text style={styles.badgeText}>
                {booking.status === 'CONFIRMED' ? 'مؤكد' : 'ملغى'}
              </Text>
            </View>
            <Text style={styles.ticketPrice}>
              {booking.totalPrice.toLocaleString('ar-SY')} ل.س
            </Text>
          </View>

          <Text style={styles.ticketRoute}>
            {booking.origin} (القابون) ← {booking.destination} (الكراج)
          </Text>

          <Text style={styles.ticketTimeSeat}>
            {booking.departDate} - {booking.departTime} · مقعد {booking.seatNumbers.join(', ')} · {booking.busTypeName}
          </Text>

          <View style={styles.ticketDivider} />

          <Text style={styles.ticketCodeNumber}>{booking.code}</Text>
        </View>

        {/* QR Code White Card */}
        <View style={styles.ticketBottomCard}>
          <View style={styles.qrWrapper}>
            <View style={styles.qrBox}>
              <View style={[styles.qrCorner, styles.qrTopLeft]}>
                <View style={styles.qrCornerInner} />
              </View>
              <View style={[styles.qrCorner, styles.qrTopRight]}>
                <View style={styles.qrCornerInner} />
              </View>
              <View style={[styles.qrCorner, styles.qrBottomLeft]}>
                <View style={styles.qrCornerInner} />
              </View>
              <View style={styles.qrPatternGrid}>
                <View style={styles.qrDot} />
                <View style={styles.qrDot} />
                <View style={styles.qrDotEmpty} />
                <View style={styles.qrDot} />
                <View style={styles.qrDot} />
                <View style={styles.qrDotEmpty} />
                <View style={styles.qrDot} />
                <View style={styles.qrDot} />
                <View style={styles.qrDot} />
              </View>
            </View>
            <Text style={styles.qrScanNotice}>يُمسح عند صعود البولمان</Text>
          </View>

          <Text style={styles.passengerNameText}>{booking.passengerName}</Text>
          <Text style={styles.passengerPhoneText}>{booking.passengerPhone}</Text>
        </View>

        {/* Actions */}
        <AppButton
          title="حفظ صورة التذكرة"
          onPress={handleSaveTicket}
          style={styles.saveBtn}
        />

        <AppButton
          title="مشاركة التذكرة"
          variant="outline"
          onPress={handleShareTicket}
          style={styles.shareBtn}
        />

        {/* Cancel Link */}
        {booking.status === 'CONFIRMED' && (
          <TouchableOpacity
            style={styles.cancelLinkBox}
            onPress={() => setCancelModalVisible(true)}
          >
            <Text style={styles.cancelLinkText}>إلغاء هذا الحجز</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.policySubtext}>
          الإلغاء مجاني قبل موعد الانطلاق بـ 3 ساعات على الأقل.{'\n'}
          REQ-CUST-06 / REQ-TICK-01..03
        </Text>
      </ScrollView>

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        visible={cancelModalVisible}
        title="تأكيد إلغاء الحجز"
        confirmTitle="نعم، تأكيد الإلغاء"
        cancelTitle="الاحتفاظ بالحجز"
        isDestructive
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelModalVisible(false)}
      >
        <Text style={styles.modalSub}>
          هل أنت متأكد من رغبتك في إلغاء الحجز رقم ({booking.code})؟ سيتم تحرير المقاعد فوراً.
        </Text>
      </ConfirmModal>
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
  closeBtn: {
    padding: Layout.spacing.xs,
  },
  closeText: {
    fontSize: 20,
    color: Colors.textMuted,
    fontWeight: 'bold',
  },
  headerTitles: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.textMain,
  },
  headerSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  homeBtn: {
    padding: Layout.spacing.xs,
  },
  homeIcon: {
    fontSize: 20,
  },
  scroll: {
    padding: Layout.spacing.lg,
    paddingBottom: 40,
  },
  ticketTopCard: {
    backgroundColor: Colors.primary,
    borderTopLeftRadius: Layout.borderRadius.xl,
    borderTopRightRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
  },
  topCardRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  badgeConfirmed: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Layout.borderRadius.full,
    gap: 4,
  },
  badgeDot: {
    color: Colors.success,
    fontSize: 14,
  },
  badgeText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: '800',
  },
  ticketPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.white,
  },
  ticketRoute: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.white,
    textAlign: 'right',
    marginBottom: 6,
  },
  ticketTimeSeat: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
    marginBottom: Layout.spacing.md,
  },
  ticketDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: Layout.spacing.sm,
  },
  ticketCodeNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'right',
    letterSpacing: 1,
  },
  ticketBottomCard: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: Layout.borderRadius.xl,
    borderBottomRightRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopWidth: 0,
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  qrWrapper: {
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  qrBox: {
    width: 170,
    height: 170,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: Layout.borderRadius.md,
    padding: 10,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCorner: {
    width: 32,
    height: 32,
    borderWidth: 5,
    borderColor: Colors.primary,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCornerInner: {
    width: 12,
    height: 12,
    backgroundColor: Colors.primary,
  },
  qrTopLeft: {
    top: 10,
    left: 10,
  },
  qrTopRight: {
    top: 10,
    right: 10,
  },
  qrBottomLeft: {
    bottom: 10,
    left: 10,
  },
  qrPatternGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 60,
    gap: 4,
    justifyContent: 'center',
  },
  qrDot: {
    width: 14,
    height: 14,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  qrDotEmpty: {
    width: 14,
    height: 14,
  },
  qrScanNotice: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: Layout.spacing.sm,
  },
  passengerNameText: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.textMain,
    marginBottom: 4,
  },
  passengerPhoneText: {
    fontSize: 13,
    color: Colors.textMuted,
    direction: 'ltr',
  },
  saveBtn: {
    width: '100%',
    marginBottom: Layout.spacing.sm,
  },
  shareBtn: {
    width: '100%',
    marginBottom: Layout.spacing.md,
  },
  cancelLinkBox: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xs,
    marginBottom: Layout.spacing.sm,
  },
  cancelLinkText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: '800',
  },
  policySubtext: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalSub: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'right',
    lineHeight: 20,
    marginBottom: Layout.spacing.md,
  },
});
