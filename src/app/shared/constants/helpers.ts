/**
 * Helper utilities for formatting and IDs according to Syrian standards in SRS
 */

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString('ar-SY')} ل.س`;
}

export function formatTime24h(isoDateOrTimeString: string): string {
  if (!isoDateOrTimeString) return '';
  if (isoDateOrTimeString.includes(':') && !isoDateOrTimeString.includes('T')) {
    return isoDateOrTimeString.substring(0, 5);
  }
  const d = new Date(isoDateOrTimeString);
  return d.toLocaleTimeString('ar-SY', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Damascus',
  });
}

export const SYRIAN_MONTHS = [
  'كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران',
  'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'
];

export const ARABIC_DAYS = [
  'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
];

export function formatDateSyrian(date: Date = new Date()): string {
  const dayName = ARABIC_DAYS[date.getDay()];
  const day = date.getDate();
  const monthName = SYRIAN_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}، ${day} ${monthName} ${year}`;
}

export function formatPhone(phone: string): string {
  if (!phone) return '';
  const clean = phone.replace(/\D/g, '');
  if (clean.startsWith('963')) {
    const rest = clean.substring(3);
    return `+963 ${rest.substring(0, 3)} ${rest.substring(3, 6)} ${rest.substring(6)}`;
  }
  return phone;
}
