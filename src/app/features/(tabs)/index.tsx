import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../shared/constants/theme';
import { AppButton } from '../../shared/components/AppButton';

export default function SearchHomeScreen() {
  const router = useRouter();

  const [origin, setOrigin] = useState('دمشق');
  const [destination, setDestination] = useState('حلب');
  const [passengersCount, setPassengersCount] = useState(1);
  const [travelDate, setTravelDate] = useState('الأحد، 8 تشرين الثاني 2026');

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    router.push({
      pathname: '/features/trips' as any,
      params: {
        origin,
        destination,
        date: travelDate,
        passengers: passengersCount.toString(),
      },
    });
  };

  const handleSelectPopular = (orig: string, dest: string) => {
    setOrigin(orig);
    setDestination(dest);
    router.push({
      pathname: '/features/trips' as any,
      params: {
        origin: orig,
        destination: dest,
        date: travelDate,
        passengers: '1',
      },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => router.push('/features/(tabs)/profile/help')}
          style={styles.headerIconBtn}
        >
          <Text style={styles.headerIconText}>🎧</Text>
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>البحث عن رحلة</Text>
          <Text style={styles.headerSubtitle}>مسار · رحلتك تبدأ بوضوح</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Banner Heading */}
        <Text style={styles.mainHeading}>إلى أين وجهتك؟</Text>
        <Text style={styles.mainSub}>
          رحلات بين المدن السورية، ومقعد تختاره بنفسك.
        </Text>

        {/* Plan Trip Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>خطط لرحلتك</Text>

          {/* Origin */}
          <Text style={styles.inputLabel}>مدينة الانطلاق</Text>
          <View style={styles.selectorBox}>
            <Text style={styles.selectorValue}>{origin}</Text>
            <Text style={styles.arrowIcon}>▼</Text>
          </View>

          {/* Swap Button */}
          <View style={styles.swapRow}>
            <TouchableOpacity onPress={handleSwap} style={styles.swapBtn}>
              <Text style={styles.swapText}>⇅ تبديل المدينتين</Text>
            </TouchableOpacity>
          </View>

          {/* Destination */}
          <Text style={styles.inputLabel}>مدينة الوصول</Text>
          <View style={styles.selectorBox}>
            <Text style={styles.selectorValue}>{destination}</Text>
            <Text style={styles.arrowIcon}>▼</Text>
          </View>

          {/* Travel Date */}
          <Text style={styles.inputLabel}>تاريخ السفر</Text>
          <View style={styles.selectorBox}>
            <Text style={styles.selectorValue}>{travelDate}</Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </View>

          {/* Passengers Counter */}
          <Text style={styles.inputLabel}>عدد المسافرين</Text>
          <View style={styles.counterRow}>
            <TouchableOpacity
              onPress={() => setPassengersCount((c) => Math.min(6, c + 1))}
              style={styles.counterBtn}
            >
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
            
            <Text style={styles.counterVal}>
              {passengersCount === 1
                ? 'مسافر واحد'
                : passengersCount === 2
                ? 'مسافران'
                : `${passengersCount} مسافرين`}
            </Text>

            <TouchableOpacity
              onPress={() => setPassengersCount((c) => Math.max(1, c - 1))}
              style={styles.counterBtn}
            >
              <Text style={styles.counterBtnText}>-</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.counterHelper}>
            أضف حتى 6 مسافرين في الحجز الواحد
          </Text>

          {/* Search Button */}
          <AppButton
            title="البحث عن الرحلات"
            onPress={handleSearch}
            style={styles.searchBtn}
          />
        </View>

        {/* Popular Routes Section */}
        <Text style={styles.sectionTitle}>مسارات شائعة</Text>

        {/* Route 1 */}
        <TouchableOpacity
          style={styles.routeCard}
          onPress={() => handleSelectPopular('دمشق', 'حلب')}
        >
          <View style={styles.routeTop}>
            <Text style={styles.routeIcon}>🔄</Text>
            <Text style={styles.routeName}>دمشق ← حلب</Text>
          </View>
          <Text style={styles.routeDetails}>4 س و 30 د · رحلات يومية</Text>
          <Text style={styles.routePrice}>من 90,000 ل.س</Text>
        </TouchableOpacity>

        {/* Route 2 */}
        <TouchableOpacity
          style={styles.routeCard}
          onPress={() => handleSelectPopular('دمشق', 'حمص')}
        >
          <View style={styles.routeTop}>
            <Text style={styles.routeIcon}>🔄</Text>
            <Text style={styles.routeName}>دمشق ← حمص</Text>
          </View>
          <Text style={styles.routeDetails}>ساعتان · رحلات يومية</Text>
          <Text style={styles.routePrice}>من 75,000 ل.س</Text>
        </TouchableOpacity>

        {/* Route 3 */}
        <TouchableOpacity
          style={styles.routeCard}
          onPress={() => handleSelectPopular('حلب', 'اللاذقية')}
        >
          <View style={styles.routeTop}>
            <Text style={styles.routeIcon}>🔄</Text>
            <Text style={styles.routeName}>حلب ← اللاذقية</Text>
          </View>
          <Text style={styles.routeDetails}>3 ساعات · مواعيد متعددة</Text>
          <Text style={styles.routePrice}>من 110,000 ل.س</Text>
        </TouchableOpacity>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ⓘ</Text>
          <Text style={styles.infoText}>
            اختر الرحلة أولاً، ثم مقعدك من توزيع الحافلة الفعلي.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPage,
  },
  scroll: {
    paddingBottom: 40,
  },
  topHeader: {
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingBottom: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.lg,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIconBtn: {
    padding: Layout.spacing.xs,
  },
  headerIconText: {
    fontSize: 20,
  },
  headerTitles: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
    textAlign: 'right',
  },
  content: {
    padding: Layout.spacing.lg,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.textMain,
    textAlign: 'right',
    marginTop: Layout.spacing.sm,
    marginBottom: 4,
  },
  mainSub: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'right',
    marginBottom: Layout.spacing.lg,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.xl,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textMain,
    textAlign: 'right',
    marginBottom: Layout.spacing.md,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'right',
    marginBottom: 6,
  },
  selectorBox: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bgPage,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.md,
    minHeight: Layout.minTouchSize,
    paddingHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  selectorValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMain,
  },
  arrowIcon: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  calendarIcon: {
    fontSize: 16,
  },
  swapRow: {
    alignItems: 'center',
    marginVertical: 2,
  },
  swapBtn: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 2,
  },
  swapText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgPage,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    minHeight: Layout.minTouchSize,
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: Layout.borderRadius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  counterVal: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMain,
  },
  counterHelper: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 4,
    marginBottom: Layout.spacing.lg,
  },
  searchBtn: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textMain,
    textAlign: 'right',
    marginBottom: Layout.spacing.md,
  },
  routeCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.sm,
  },
  routeTop: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginBottom: 4,
  },
  routeIcon: {
    fontSize: 16,
  },
  routeName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textMain,
  },
  routeDetails: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'right',
    marginBottom: 4,
  },
  routePrice: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'right',
  },
  infoBox: {
    flexDirection: 'row-reverse',
    backgroundColor: Colors.infoBg,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    gap: Layout.spacing.sm,
    marginTop: Layout.spacing.md,
  },
  infoIcon: {
    fontSize: 16,
    color: Colors.info,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: Colors.info,
    lineHeight: 18,
    textAlign: 'right',
  },
});
