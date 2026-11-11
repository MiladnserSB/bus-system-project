import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Layout } from '@/app/shared/constants/theme';
import { AppButton } from '@/app/shared/components/AppButton';
import { useCountdown } from '@/app/shared/hooks/useCountdown';
import { useSeatPolling } from '@/app/shared/hooks/useSeatPolling';
import { MOCK_TRIPS, Trip } from '@/app/shared/constants/mockData';

type SeatStatus = 'AVAILABLE' | 'BOOKED' | 'HELD' | 'SELECTED';

interface BusSeat {
  id: string;
  number: string;
  row: number;
  col: string;
  status: SeatStatus;
  isExtra?: boolean;
}

export default function SeatSelectionScreen() {
  const router = useRouter();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();

  const trip: Trip =
    MOCK_TRIPS.find((t) => t.id === tripId) || MOCK_TRIPS[0];

  const isStandard45 = trip.busType === 'standard_large';
  const seatPrice = isStandard45 ? 45000 : trip.price;

  // Modals state
  const [conflictModalVisible, setConflictModalVisible] = useState(false);
  const [timeoutModalVisible, setTimeoutModalVisible] = useState(false);
  const [conflictSeatName, setConflictSeatName] = useState('5A');

  // Countdown timer (5 minutes = 300s)
  const { formattedTime, isExpired, reset } = useCountdown(272, () => {
    setTimeoutModalVisible(true);
  });

  // Seat Polling simulation every 10s (SRS Section 4.5.3 REQ-SEAT-05)
  useSeatPolling(() => {
    console.log('Polling seat status every 10s for trip:', trip.id);
  });

  // Generate initial seat layout
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<string[]>(['5A', '5B']);

  // Initial booked & held sets matching Figma
  const bookedSeats = new Set(['1A', '1B', '1C', '1D', '2B', '4A', '4B', '4C', '4D', '6C', '7A', '7B', '7C', '8D', '10A', '10B', '10C', '10D', '2', '3', '5', '6', '8', '9', '11', '13', '14', '15', '17', '18', '19', '21', '22', '23', '24', '26', '27', '28', '29', '30', '31', '32']);
  const heldSeats = new Set(['3C', '7D', '9A']);

  const getSeatStatus = (seatId: string): SeatStatus => {
    if (selectedSeatNumbers.includes(seatId)) return 'SELECTED';
    if (heldSeats.has(seatId)) return 'HELD';
    if (bookedSeats.has(seatId)) return 'BOOKED';
    return 'AVAILABLE';
  };

  const handleSeatPress = (seatId: string) => {
    const status = getSeatStatus(seatId);

    if (status === 'BOOKED') {
      return;
    }

    if (status === 'HELD') {
      setConflictSeatName(seatId);
      setConflictModalVisible(true);
      return;
    }

    if (status === 'SELECTED') {
      setSelectedSeatNumbers((prev) => prev.filter((s) => s !== seatId));
    } else {
      if (selectedSeatNumbers.length >= 6) {
        alert('الحد الأقصى للمقاعد في الحجز الواحد هو 6 مقاعد.');
        return;
      }
      setSelectedSeatNumbers((prev) => [...prev, seatId]);
    }
  };

  const handleProceed = () => {
    if (selectedSeatNumbers.length === 0) {
      alert('يرجى اختيار مقعد واحد على الأقل للمتابعة.');
      return;
    }
    router.push({
      pathname: `/features/trips/${trip.id}/booking` as any,
      params: {
        seats: selectedSeatNumbers.join(','),
        totalPrice: (selectedSeatNumbers.length * seatPrice).toString(),
      },
    });
  };

  const renderSeatIcon = (seatId: string, isExtra: boolean = false) => {
    const status = getSeatStatus(seatId);

    const isSelected = status === 'SELECTED';
    const isBooked = status === 'BOOKED';
    const isHeld = status === 'HELD';

    return (
      <TouchableOpacity
        key={seatId}
        activeOpacity={isBooked ? 1 : 0.7}
        onPress={() => handleSeatPress(seatId)}
        style={[
          styles.seatBox,
          isExtra && styles.seatExtraBox,
          status === 'AVAILABLE' && styles.seatAvailable,
          isBooked && styles.seatBooked,
          isHeld && styles.seatHeld,
          isSelected && styles.seatSelected,
        ]}
      >
        <Text
          style={[
            styles.seatNumber,
            isBooked && styles.seatBookedText,
            isHeld && styles.seatHeldText,
            isSelected && styles.seatSelectedText,
            isExtra && styles.seatExtraText,
          ]}
        >
          {seatId}
          {isBooked ? ' ×' : isHeld ? ' 🕒' : isSelected ? ' ✓' : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>→</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>اختيار المقاعد</Text>
        <Text style={styles.stepText}>2 / 3</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Countdown Hold Alert Box matching Figma screen_col09_row1_855h.png */}
        <View style={styles.countdownBanner}>
          <Text style={styles.countdownTime}>{formattedTime}</Text>
          <View style={styles.countdownTexts}>
            <Text style={styles.countdownTitle}>
              {trip.origin} ← {trip.destination} · {trip.departTime}
            </Text>
            <Text style={styles.countdownSub}>
              قفل 5 دقائق · 10 تشرين الثاني 2026
            </Text>
          </View>
        </View>

        {/* Bus Overview Header */}
        <View style={styles.busOverviewRow}>
          <Text style={styles.busClassLabel}>
            {isStandard45 ? 'عادية كبيرة 2+2 · 45 مقعداً' : 'درجة أولى كبيرة 1+2 · 33 مقعداً'}
          </Text>
          <Text style={styles.frontBusLabel}>↑ المقدمة · السائق خارج السعة</Text>
        </View>

        {/* The Bus Seat Grid Box */}
        <View style={styles.busGridContainer}>
          {isStandard45 ? (
            // 2+2 Layout (45 Seats with 11E extra seat)
            Array.from({ length: 10 }).map((_, rowIndex) => {
              const row = rowIndex + 1;
              return (
                <View key={row} style={styles.seatRow}>
                  {/* Left pair (A, B) */}
                  <View style={styles.pairRow}>
                    {renderSeatIcon(`${row}A`)}
                    {renderSeatIcon(`${row}B`)}
                  </View>

                  {/* Center Aisle with Row Number */}
                  <View style={styles.aisleCol}>
                    <Text style={styles.aisleRowNumber}>{row}</Text>
                  </View>

                  {/* Right pair (C, D) */}
                  <View style={styles.pairRow}>
                    {renderSeatIcon(`${row}C`)}
                    {renderSeatIcon(`${row}D`)}
                  </View>
                </View>
              );
            })
          ) : (
            // 1+2 Layout (33 Seats)
            Array.from({ length: 11 }).map((_, rowIndex) => {
              const row = rowIndex + 1;
              const rightSeat = row * 3;
              const midSeat = row * 3 - 1;
              const leftSeat = row * 3 - 2;
              return (
                <View key={row} style={styles.seatRow}>
                  <View style={styles.pairRow}>
                    {renderSeatIcon(`${leftSeat}`)}
                    {renderSeatIcon(`${midSeat}`)}
                  </View>
                  <View style={styles.aisleCol}>
                    <Text style={styles.aisleRowNumber}>ممر</Text>
                  </View>
                  <View style={styles.pairRow}>
                    {renderSeatIcon(`${rightSeat}`)}
                  </View>
                </View>
              );
            })
          )}

          {/* Row 11: Includes the Extra Seat 11E for standard class */}
          {isStandard45 && (
            <View style={styles.seatRow}>
              <View style={styles.pairRow}>
                {renderSeatIcon('11A')}
                {renderSeatIcon('11B')}
              </View>
              <View style={styles.aisleCol}>
                {renderSeatIcon('11E', true)}
              </View>
              <View style={styles.pairRow}>
                {renderSeatIcon('11C')}
                {renderSeatIcon('11D')}
              </View>
            </View>
          )}

          <Text style={styles.rearLabel}>مؤخرة الحافلة</Text>
        </View>

        {/* Legend Row matching Figma */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatAvailable]} />
            <Text style={styles.legendText}>متاح</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatBooked]} />
            <Text style={styles.legendText}>محجوز</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatHeld]} />
            <Text style={styles.legendText}>مؤقت</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatSelected]} />
            <Text style={styles.legendText}>اختيارك</Text>
          </View>
        </View>

        <Text style={styles.legendHelper}>
          حتى 6 مقاعد · تحديث كل 10 ثوانٍ · 11E وسط المؤخرة
        </Text>

        {/* Price & Summary Box */}
        <View style={styles.summaryBar}>
          <View style={styles.priceCalculation}>
            <Text style={styles.selectedSeatsText}>
              {selectedSeatNumbers.join(' + ') || 'لم تختر مقعداً'}
            </Text>
            <Text style={styles.formulaText}>
              {selectedSeatNumbers.length} × {seatPrice.toLocaleString('ar-SY')} ل.س
            </Text>
          </View>
          <Text style={styles.totalPriceText}>
            {(selectedSeatNumbers.length * seatPrice).toLocaleString('ar-SY')} ل.س
          </Text>
        </View>

        {/* Proceed Button */}
        <AppButton
          title="متابعة إلى بيانات الركاب"
          onPress={handleProceed}
          disabled={selectedSeatNumbers.length === 0}
          style={styles.proceedBtn}
        />
        <Text style={styles.proceedNote}>
          المقاعد مقفلة مؤقتاً؛ الحجز غير مؤكد بعد.
        </Text>
      </ScrollView>

      {/* 409 Conflict Dialog matching Figma screen_col09_row2_260h.png */}
      <Modal visible={conflictModalVisible} transparent animationType="fade">
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogCard}>
            <TouchableOpacity
              onPress={() => setConflictModalVisible(false)}
              style={styles.dialogCloseBtn}
            >
              <Text style={styles.dialogCloseText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.dialogHeader}>
              <Text style={styles.dialogWarningIcon}>⚠️</Text>
              <Text style={styles.dialogTitle}>تعارض حجز المقعد</Text>
            </View>

            <Text style={styles.dialogMessage}>
              عذراً، قام مستخدم آخر بحجز المقعد ({conflictSeatName}) للتو. تم تحديث خريطة المقاعد لتظهر المقاعد المتاحة حالياً.
            </Text>

            <AppButton
              title="اختيار مقعد متاح آخر"
              onPress={() => setConflictModalVisible(false)}
              style={styles.dialogBtn}
            />
          </View>
        </View>
      </Modal>

      {/* Timeout Dialog matching Figma screen_col09_row3_260h.png */}
      <Modal visible={timeoutModalVisible} transparent animationType="fade">
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogCard}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogClockIcon}>⏱️</Text>
              <Text style={styles.dialogTitle}>انتهاء مهلة القفل المؤقت</Text>
            </View>

            <Text style={styles.dialogMessage}>
              انتهت مهلة حجز المقعد (5 دقائق). تم تحرير المقاعد لتصبح متاحة للآخرين.
            </Text>

            <AppButton
              title="إعادة اختيار المقاعد"
              onPress={() => {
                setTimeoutModalVisible(false);
                reset(300);
              }}
              style={styles.dialogBtn}
            />
          </View>
        </View>
      </Modal>
    </View>
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
    paddingBottom: Layout.spacing.md,
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
  stepText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: 'bold',
  },
  scroll: {
    padding: Layout.spacing.lg,
    paddingBottom: 40,
  },
  countdownBanner: {
    flexDirection: 'row-reverse',
    backgroundColor: Colors.warningBg,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
  },
  countdownTexts: {
    alignItems: 'flex-end',
  },
  countdownTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textMain,
  },
  countdownSub: {
    fontSize: 11,
    color: Colors.warning,
    marginTop: 2,
    fontWeight: '600',
  },
  countdownTime: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.warning,
  },
  busOverviewRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  busClassLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  frontBusLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  busGridContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.md,
    alignItems: 'center',
  },
  seatRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    width: '100%',
  },
  pairRow: {
    flexDirection: 'row-reverse',
    gap: 6,
  },
  aisleCol: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aisleRowNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textMuted,
  },
  seatBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatExtraBox: {
    width: 40,
    borderColor: Colors.seatExtra,
  },
  seatAvailable: {
    backgroundColor: Colors.seatAvailable,
    borderColor: Colors.seatAvailableBorder,
  },
  seatBooked: {
    backgroundColor: Colors.seatBooked,
    borderColor: Colors.seatBookedBorder,
  },
  seatHeld: {
    backgroundColor: Colors.seatHeld,
    borderColor: Colors.seatHeldBorder,
  },
  seatSelected: {
    backgroundColor: Colors.seatSelected,
    borderColor: Colors.seatSelectedBorder,
  },
  seatNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
  },
  seatBookedText: {
    color: Colors.danger,
  },
  seatHeldText: {
    color: Colors.warning,
  },
  seatSelectedText: {
    color: Colors.white,
  },
  seatExtraText: {
    color: Colors.seatExtra,
  },
  rearLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 10,
  },
  legendRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: Layout.spacing.sm,
  },
  legendItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  legendHelper: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
  summaryBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.md,
  },
  priceCalculation: {
    alignItems: 'flex-end',
  },
  selectedSeatsText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textMain,
  },
  formulaText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primary,
  },
  proceedBtn: {
    width: '100%',
  },
  proceedNote: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.xl,
  },
  dialogCloseBtn: {
    alignSelf: 'flex-start',
    padding: Layout.spacing.xs,
  },
  dialogCloseText: {
    fontSize: 16,
    color: Colors.textMuted,
    fontWeight: 'bold',
  },
  dialogHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.sm,
  },
  dialogWarningIcon: {
    fontSize: 20,
  },
  dialogClockIcon: {
    fontSize: 20,
  },
  dialogTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.textMain,
  },
  dialogMessage: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 20,
    textAlign: 'right',
    marginBottom: Layout.spacing.lg,
  },
  dialogBtn: {
    width: '100%',
  },
});
