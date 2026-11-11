import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../../shared/constants/theme';

export default function HelpScreen() {
  const router = useRouter();

  const faqs = [
    {
      q: 'كيف يتم دفع قيمة التذكرة؟',
      a: 'نقداً حصراً عند المكتب أو عند صعود البولمان.',
    },
    {
      q: 'هل يمكن إلغاء الحجز؟',
      a: 'نعم، مجاناً عبر التطبيق قبل موعد الانطلاق بـ 3 ساعات على الأقل.',
    },
    {
      q: 'متى يجب أن أحضر للمحطة؟',
      a: 'قبل 30 دقيقة على الأقل من موعد الرحلة.',
    },
    {
      q: 'كم مقعداً يمكنني حجزه معاً؟',
      a: 'حتى 6 مقاعد كحد أقصى في المعاملة الواحدة.',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>→</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>المساعدة والأسئلة الشائعة</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionSub}>كل ما تحتاج معرفته قبل رحلتك · القسم 2.6</Text>

        {faqs.map((faq, idx) => (
          <View key={idx} style={styles.faqCard}>
            <Text style={styles.question}>{faq.q}</Text>
            <Text style={styles.answer}>{faq.a}</Text>
          </View>
        ))}

        {/* Customer Support Banner matching Figma */}
        <View style={styles.contactBanner}>
          <Text style={styles.contactTitle}>هل تحتاج مساعدة؟</Text>
          <Text style={styles.contactPhone}>اتصل بخدمة العملاء: 2233445-011</Text>
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
    paddingBottom: 40,
  },
  sectionSub: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'right',
    marginBottom: Layout.spacing.md,
  },
  faqCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.md,
  },
  question: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textMain,
    textAlign: 'right',
    marginBottom: 6,
  },
  answer: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'right',
    lineHeight: 20,
  },
  contactBanner: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    alignItems: 'center',
    marginTop: Layout.spacing.md,
  },
  contactTitle: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  contactPhone: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '600',
  },
});
