import React from 'react';
import { useRouter } from 'expo-router';
import { ErrorFallback } from '../../shared/components/ErrorFallback';

export default function TripsErrorScreen() {
  const router = useRouter();

  return (
    <ErrorFallback
      title="تعذر تحميل الرحلات"
      message="حدث خطأ أثناء جلب قائمة الرحلات أو انتهت مهلة الاتصال بالخادم. يرجى إعادة المحاولة."
      actionText="إعادة المحاولة"
      onAction={() => router.replace('/features/trips' as any)}
      icon="🚌"
    />
  );
}
