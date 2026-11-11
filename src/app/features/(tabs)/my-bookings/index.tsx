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
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import { AppInput } from '../../../shared/components/AppInput';
import { Toast } from '../../../shared/components/Toast';
import { MOCK_BOOKINGS, Booking } from '../../../shared/constants/mockData';

export default function MyBookingsScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

  // Cancellation Modal state
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const upcomingBookings = bookings.filter((b) => b.status === 'CONFIRMED');
  const pastBookings = bookings.filter((b) => b.status === 'CANCELLED');

  const handleOpenCancel = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelReason('');
    setCancelModalVisible(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedBooking) return;

    // Soft cancel in mock store
    setBookings((prev) =>
      prev.map((b) =>
        b.code === selectedBooking.code
          ? {
              ...b,
              status: 'CANCELLED',
              cancelReason: cancelReason || 'إلغاء من قبل الزبون',
              cancelledAt: 'الآن',
            }
          : b
      )
    );

    setCancelModalVisible(false);
    setToastMessage('تم إلغاء الحجز بنجاح وتحرير المقاعد');
    setToastVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Toast */}
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
        <Text style={styles.headerTitle}>حجوزاتي</Text>
      </View>

      {/* Tabs Switcher */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          onPress={() => setActiveTab('UPCOMING')}
          style={[styles.tabButton, activeTab === 'UPCOMING' && styles.tabButtonActive]}
        >
          <Text
            style={[styles.tabText, activeTab === 'UPCOMING' && styles.tabTextActive]}
          >
            القادمة ({upcomingBookings.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('PAST')}
          style={[styles.tabButton, activeTab === 'PAST' && styles.tabButtonActive]}
        >
          <Text
            style={[styles.tabText, activeTab === 'PAST' && styles.tabTextActive]}
          >
            السابقة ({pastBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {activeTab === 'UPCOMING' ? (
          <>
            {upcomingBookings.map((b) => (
              <View key={b.code} style={styles.bookingCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusDot}>•</Text>
                    <Text style={styles.statusText}>مؤكدة</Text>
                  </View>
                  <Text style={styles.tripRoute}>
                    {b.origin} ← {b.destination}
                  </Text>
                </View>

                <Text style={styles.tripDate}>
                  {b.departDate} · {b.departTime}
                </Text>
                <Text style={styles.bookingCode}>{b.code}</Text>

                <View style={styles.detailsRow}>
                  <Text style={styles.detailsVal}>
                    المقعد: {b.seatNumbers.join(', ')} · القيمة: {b.totalPrice.toLocaleString('ar-SY')} ل.س
                  </Text>
                </View>

                <View style={styles.cardActions}>
                  <AppButton
                    title="عرض التذكرة"
                    variant="outline"
                    onPress={() => router.push(`/features/tickets/${b.code}` as any)}
                    style={styles.viewTicketBtn}
                  />
                  <TouchableOpacity
                    onPress={() => handleOpenCancel(b)}
                    style={styles.cancelTextBtn}
                  >
                    <Text style={styles.cancelTextBtnLabel}>إلغاء الحجز</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.policyNotice}>
                  الإلغاء مجاني حتى قبل 3 ساعات من انطلاق الرحلة.
                </Text>
              </View>
            ))}

            {upcomingBookings.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🎟️</Text>
                <Text style={styles.emptyTitle}>لا توجد حجوزات قادمة</Text>
                <Text style={styles.emptySub}>
                  ابدأ بالبحث عن رحلة جديدة واحجز مقعدك الآن.
                </Text>
                <AppButton
                  title="البحث عن رحلات"
                  onPress={() => router.push('/features/(tabs)' as any)}
                  style={styles.emptyBtn}
                />
              </View>
            )}
          </>
        ) : (
          <>
            <Text style={styles.pastHeading}>من حجوزاتك السابقة · تشمل الملغاة</Text>
            {pastBookings.map((b) => (
              <View key={b.code} style={[styles.bookingCard, styles.pastCard]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.statusBadge, styles.cancelledBadge]}>
                    <Text style={styles.statusTextCancelled}>ملغى</Text>
                  </View>
                  <Text style={styles.tripRoute}>
                    {b.origin} ← {b.destination}
                  </Text>
                </View>

                <Text style={styles.tripDate}>
                  {b.departDate} · {b.departTime}
                </Text>
                <Text style={styles.bookingCode}>{b.code}</Text>

                <Text style={styles.detailsVal}>
                  مقعد: {b.seatNumbers.join(', ')} · {b.totalPrice.toLocaleString('ar-SY')} ل.س
                </Text>

                {b.cancelReason && (
                  <Text style={styles.cancelReasonText}>السبب: {b.cancelReason}</Text>
                )}
              </View>
            ))}
          </>
        )}

        <Text style={styles.footerNotice}>
          تظهر هنا حجوزاتك المرتبطة برقم هاتفك فقط.
        </Text>
      </ScrollView>

      {/* Cancellation Modal matching Figma screen_col04_row2_690h.png */}
      <ConfirmModal
        visible={cancelModalVisible}
        title="تأكيد إلغاء الحجز"
        confirmTitle="نعم، تأكيد الإلغاء"
        cancelTitle="الاحتفاظ بالحجز"
        isDestructive
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelModalVisible(false)}
      >
        {selectedBooking && (
          <View>
            <Text style={styles.modalFieldLabel}>الحجز القادم</Text>
            <View style={styles.modalBox}>
              <Text style={styles.modalBoxText}>
                {selectedBooking.origin} ← {selectedBooking.destination} · مقعد{' '}
                {selectedBooking.seatNumbers.join(', ')}
              </Text>
              <Text style={styles.modalBoxSub}>
                {selectedBooking.departDate} · {selectedBooking.departTime}
              </Text>
            </View>

            <Text style={styles.modalFieldLabel}>رمز الحجز</Text>
            <View style={styles.modalBox}>
              <Text style={styles.modalBoxText}>{selectedBooking.code}</Text>
              <Text style={styles.modalBoxSub}>
                {selectedBooking.totalPrice.toLocaleString('ar-SY')} ل.س · الدفع نقداً
              </Text>
            </View>

            {/* Warning Box */}
            <View style={styles.warningAlert}>
              <Text style={styles.warningIcon}>🕒</Text>
              <Text style={styles.warningText}>
                الإلغاء مجاني قبل الانطلاق بـ 3 ساعات. سيُحرَّر المقعد فور تأكيد الإلغاء.
              </Text>
            </View>

            <AppInput
              label="سبب الإلغاء (اختياري)"
              placeholder="اختر سبباً أو اكتب ملاحظتك"
              value={cancelReason}
              onChangeText={setCancelReason}
            />
          </View>
        )}
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
  tabSwitcher: {
    flexDirection: 'row-reverse',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  scroll: {
    padding: Layout.spacing.lg,
    paddingBottom: 40,
  },
  bookingCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.md,
  },
  pastCard: {
    opacity: 0.9,
    backgroundColor: '#FAFBFD',
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  tripRoute: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textMain,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Layout.borderRadius.full,
    gap: 4,
  },
  statusDot: {
    color: Colors.success,
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: '800',
  },
  cancelledBadge: {
    backgroundColor: Colors.dangerBg,
  },
  statusTextCancelled: {
    color: Colors.danger,
    fontSize: 12,
    fontWeight: '800',
  },
  tripDate: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'right',
    marginBottom: Layout.spacing.xs,
  },
  bookingCode: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'right',
    marginBottom: Layout.spacing.sm,
  },
  detailsRow: {
    marginBottom: Layout.spacing.md,
  },
  detailsVal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  cardActions: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Layout.spacing.md,
    marginTop: Layout.spacing.xs,
    marginBottom: Layout.spacing.sm,
  },
  viewTicketBtn: {
    flex: 1,
  },
  cancelTextBtn: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.sm,
  },
  cancelTextBtnLabel: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  policyNotice: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  pastHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textMuted,
    textAlign: 'right',
    marginBottom: Layout.spacing.md,
  },
  cancelReasonText: {
    fontSize: 12,
    color: Colors.danger,
    textAlign: 'right',
    marginTop: Layout.spacing.xs,
  },
  footerNotice: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Layout.spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Layout.spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textMain,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
  emptyBtn: {
    minWidth: 160,
  },
  modalFieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textAlign: 'right',
    marginBottom: 4,
  },
  modalBox: {
    backgroundColor: Colors.bgPage,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.sm,
  },
  modalBoxText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textMain,
    textAlign: 'right',
  },
  modalBoxSub: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 2,
  },
  warningAlert: {
    flexDirection: 'row-reverse',
    backgroundColor: Colors.warningBg,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    gap: Layout.spacing.sm,
    marginVertical: Layout.spacing.sm,
  },
  warningIcon: {
    fontSize: 16,
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    color: Colors.warning,
    lineHeight: 18,
    textAlign: 'right',
    fontWeight: '600',
  },
});
