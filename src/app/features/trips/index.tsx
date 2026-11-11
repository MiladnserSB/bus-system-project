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
import { Colors, Layout } from '../../shared/constants/theme';
import { AppButton } from '../../shared/components/AppButton';
import { MOCK_TRIPS, Trip } from '../../shared/constants/mockData';

export default function TripsListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    origin?: string;
    destination?: string;
    date?: string;
    passengers?: string;
  }>();

  const origin = params.origin || 'دمشق';
  const destination = params.destination || 'حلب';
  const dateStr = params.date || 'الأحد، 8 تشرين الثاني 2026';

  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Filters state
  const [sortBy, setSortBy] = useState<'EARLIEST' | 'PRICE_LOW'>('EARLIEST');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([
    'standard_large',
    'first_large',
  ]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'MORNING' | 'AFTERNOON' | 'EVENING'>('MORNING');

  const handleApplyFilter = () => {
    let list = [...MOCK_TRIPS];
    if (sortBy === 'PRICE_LOW') {
      list.sort((a, b) => a.price - b.price);
    } else {
      list.sort((a, b) => a.departTime.localeCompare(b.departTime));
    }
    setTrips(list);
    setFilterModalVisible(false);
  };

  const handleSelectTrip = (tripId: string) => {
    router.push(`/features/trips/${tripId}` as any);
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>→</Text>
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>نتائج الرحلات</Text>
          <Text style={styles.headerSubtitle}>
            {origin} ← {destination} · {dateStr}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/features/(tabs)/profile/help')}
          style={styles.helpIconBtn}
        >
          <Text style={styles.helpIconText}>🎧</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Results Bar */}
        <View style={styles.resultsBar}>
          <TouchableOpacity
            style={styles.editSearchBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.editSearchText}>تعديل</Text>
          </TouchableOpacity>
          <View style={styles.resultsInfo}>
            <Text style={styles.resultsCount}>{trips.length} رحلات متاحة</Text>
            <Text style={styles.resultsSub}>
              مسافر واحد · جميع الأسعار بالليرة السورية
            </Text>
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterPillsRow}>
          <TouchableOpacity
            style={[styles.pill, styles.pillActive]}
            onPress={() => setFilterModalVisible(true)}
          >
            <Text style={styles.pillTextActive}>✓ الوقت ↑</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pill}
            onPress={() => setFilterModalVisible(true)}
          >
            <Text style={styles.pillText}>السعر</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pill}
            onPress={() => setFilterModalVisible(true)}
          >
            <Text style={styles.pillText}>الفئة</Text>
          </TouchableOpacity>
        </View>

        {/* Trip Cards */}
        {trips.map((trip) => (
          <View key={trip.id} style={styles.tripCard}>
            <View style={styles.cardTopRow}>
              <View style={styles.badgeAvailable}>
                <Text style={styles.badgeDot}>•</Text>
                <Text style={styles.badgeText}>متاحة</Text>
              </View>
              <View style={styles.operatorRow}>
                <Text style={styles.operatorName}>{trip.operator}</Text>
                <Text style={styles.busIcon}>🚌</Text>
              </View>
            </View>

            {/* Time & Route Row */}
            <View style={styles.timeRouteRow}>
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

            {/* Price & Seats */}
            <View style={styles.priceSeatsRow}>
              <Text style={styles.availableSeatsText}>
                {trip.availableSeats} مقاعد متاحة
              </Text>
              <Text style={styles.priceText}>
                {trip.price.toLocaleString('ar-SY')} ل.س / مسافر
              </Text>
            </View>

            <Text style={styles.busClassText}>{trip.busTypeName}</Text>

            {/* Button */}
            <AppButton
              title="اختيار المقعد"
              variant={trip.id === 'TR-1082' ? 'primary' : 'outline'}
              onPress={() => handleSelectTrip(trip.id)}
              style={styles.selectSeatBtn}
            />
          </View>
        ))}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ⓘ</Text>
          <Text style={styles.infoText}>
            السعر لكل مسافر. تتأكد إتاحة المقعد عند اختياره وقبل إتمام الحجز.
          </Text>
        </View>
      </ScrollView>

      {/* Filter Bottom Sheet Modal matching Figma screen_col11_row1_855h.png */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterSheet}>
            <View style={styles.handleBar} />

            <View style={styles.filterHeader}>
              <TouchableOpacity onPress={() => setSortBy('EARLIEST')}>
                <Text style={styles.resetLink}>إعادة ضبط</Text>
              </TouchableOpacity>
              <Text style={styles.filterTitle}>تصفية وترتيب الرحلات</Text>
            </View>

            {/* Sort Section */}
            <Text style={styles.filterSectionTitle}>الترتيب حسب</Text>
            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => setSortBy('EARLIEST')}
            >
              <Text style={styles.radioLabel}>موعد الانطلاق الأبكر</Text>
              <Text style={styles.radioIndicator}>
                {sortBy === 'EARLIEST' ? '◉' : '○'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => setSortBy('PRICE_LOW')}
            >
              <Text style={styles.radioLabel}>السعر الأقل</Text>
              <Text style={styles.radioIndicator}>
                {sortBy === 'PRICE_LOW' ? '◉' : '○'}
              </Text>
            </TouchableOpacity>

            {/* Class Section */}
            <Text style={styles.filterSectionTitle}>فئة الباص</Text>
            <TouchableOpacity style={styles.radioRow}>
              <Text style={styles.radioLabel}>عادية 2+2</Text>
              <Text style={styles.checkbox}>☑</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.radioRow}>
              <Text style={styles.radioLabel}>درجة أولى 1+2</Text>
              <Text style={styles.checkbox}>☑</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.radioRow}>
              <Text style={styles.radioLabel}>رجال أعمال 1+1</Text>
              <Text style={styles.checkbox}>☐</Text>
            </TouchableOpacity>

            {/* Time Slot Section */}
            <Text style={styles.filterSectionTitle}>وقت الانطلاق</Text>
            <View style={styles.slotRow}>
              <TouchableOpacity
                style={[styles.slotPill, selectedTimeSlot === 'MORNING' && styles.slotPillActive]}
                onPress={() => setSelectedTimeSlot('MORNING')}
              >
                <Text style={styles.slotTitle}>صباحاً</Text>
                <Text style={styles.slotHours}>06–12</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.slotPill, selectedTimeSlot === 'AFTERNOON' && styles.slotPillActive]}
                onPress={() => setSelectedTimeSlot('AFTERNOON')}
              >
                <Text style={styles.slotTitle}>بعد الظهر</Text>
                <Text style={styles.slotHours}>12–18</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.slotPill, selectedTimeSlot === 'EVENING' && styles.slotPillActive]}
                onPress={() => setSelectedTimeSlot('EVENING')}
              >
                <Text style={styles.slotTitle}>مساءً</Text>
                <Text style={styles.slotHours}>18–24</Text>
              </TouchableOpacity>
            </View>

            <AppButton
              title={`تطبيق التصفية (عرض ${trips.length} رحلات)`}
              onPress={handleApplyFilter}
              style={styles.applyBtn}
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
  headerTitles: {
    alignItems: 'flex-end',
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  helpIconBtn: {
    padding: Layout.spacing.xs,
  },
  helpIconText: {
    fontSize: 20,
  },
  scroll: {
    padding: Layout.spacing.lg,
    paddingBottom: 40,
  },
  resultsBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  resultsInfo: {
    alignItems: 'flex-end',
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textMain,
  },
  resultsSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  editSearchBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs + 2,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.surface,
  },
  editSearchText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  filterPillsRow: {
    flexDirection: 'row-reverse',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.lg,
  },
  pill: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs + 2,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  pillActive: {
    backgroundColor: Colors.seatAvailable,
    borderColor: Colors.seatAvailableBorder,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMain,
  },
  pillTextActive: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },
  tripCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.md,
  },
  cardTopRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  operatorRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  busIcon: {
    fontSize: 16,
  },
  operatorName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textMain,
  },
  badgeAvailable: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successBg,
    paddingHorizontal: 8,
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
    fontSize: 11,
    fontWeight: '800',
  },
  timeRouteRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
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
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  durationCol: {
    alignItems: 'center',
  },
  durationText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  arrowIcon: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  directText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  priceSeatsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Layout.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    marginBottom: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.primary,
  },
  availableSeatsText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  busClassText: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'right',
    marginBottom: Layout.spacing.md,
  },
  selectSeatBtn: {
    width: '100%',
  },
  infoBox: {
    flexDirection: 'row-reverse',
    backgroundColor: Colors.infoBg,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    gap: Layout.spacing.sm,
    marginTop: Layout.spacing.xs,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  filterSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Layout.borderRadius.xl,
    borderTopRightRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.xl,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Layout.spacing.md,
  },
  filterHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textMain,
  },
  resetLink: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '700',
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textMain,
    textAlign: 'right',
    marginTop: Layout.spacing.sm,
    marginBottom: Layout.spacing.sm,
  },
  radioRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.xs + 2,
  },
  radioLabel: {
    fontSize: 13,
    color: Colors.textMain,
  },
  radioIndicator: {
    fontSize: 16,
    color: Colors.primary,
  },
  checkbox: {
    fontSize: 16,
    color: Colors.primary,
  },
  slotRow: {
    flexDirection: 'row-reverse',
    gap: Layout.spacing.sm,
    marginVertical: Layout.spacing.sm,
  },
  slotPill: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.sm,
    alignItems: 'center',
  },
  slotPillActive: {
    backgroundColor: Colors.seatAvailable,
    borderColor: Colors.primary,
  },
  slotTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textMain,
  },
  slotHours: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  applyBtn: {
    marginTop: Layout.spacing.lg,
    width: '100%',
  },
});
