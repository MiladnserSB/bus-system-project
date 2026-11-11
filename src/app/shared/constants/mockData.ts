/**
 * Comprehensive Mock Data Store matching Figma Designs (Row 3 · Mobile) & SRS
 */

export interface Trip {
  id: string;
  code: string;
  operator: string;
  origin: string;
  destination: string;
  originStation: string;
  destinationStation: string;
  departTime: string;
  arrivalTime: string;
  duration: string;
  dateStr: string;
  price: number;
  busType: 'standard_large' | 'first_large' | 'business_large';
  busTypeName: string;
  totalSeats: number;
  availableSeats: number;
  isAirConditioned: boolean;
  isDirect: boolean;
  status: 'OPEN' | 'FULL' | 'CLOSED' | 'DEPARTED' | 'CANCELLED';
}

export interface Booking {
  code: string;
  tripId: string;
  origin: string;
  destination: string;
  departDate: string;
  departTime: string;
  seatNumbers: string[];
  passengerName: string;
  passengerPhone: string;
  totalPrice: number;
  status: 'CONFIRMED' | 'CANCELLED';
  busTypeName: string;
  paymentMethod: 'CASH_OFFICE' | 'CASH_BOARDING';
  cancelReason?: string;
  cancelledAt?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  tripCode?: string;
  dateStr: string;
  isRead: boolean;
  type: 'CONFIRM' | 'REMIND_24H' | 'REMIND_3H' | 'TIME_CHANGE' | 'CANCEL';
}

export const MOCK_TRIPS: Trip[] = [
  {
    id: 'TR-1082',
    code: 'TR-1082',
    operator: 'شركة الشام للنقل',
    origin: 'دمشق',
    destination: 'حلب',
    originStation: 'كراج العباسيين',
    destinationStation: 'كراج الراموسة',
    departTime: '08:00',
    arrivalTime: '12:30',
    duration: '4 س و 30 د',
    dateStr: 'الأحد، 8 تشرين الثاني 2026',
    price: 125000,
    busType: 'first_large',
    busTypeName: 'أولى كبيرة · 33 مقعداً (1+2)',
    totalSeats: 33,
    availableSeats: 9,
    isAirConditioned: true,
    isDirect: true,
    status: 'OPEN',
  },
  {
    id: 'TR-1083',
    code: 'TR-1083',
    operator: 'شركة الشام للنقل',
    origin: 'دمشق',
    destination: 'حلب',
    originStation: 'كراج القابون',
    destinationStation: 'كراج الراموسة',
    departTime: '10:00',
    arrivalTime: '14:30',
    duration: '4 س و 30 د',
    dateStr: 'الأحد، 8 تشرين الثاني 2026',
    price: 90000,
    busType: 'standard_large',
    busTypeName: 'عادية كبيرة · 45 مقعداً (2+2)',
    totalSeats: 45,
    availableSeats: 18,
    isAirConditioned: true,
    isDirect: true,
    status: 'OPEN',
  },
  {
    id: 'TR-1084',
    code: 'TR-1084',
    operator: 'شركة الشام للنقل',
    origin: 'دمشق',
    destination: 'حلب',
    originStation: 'كراج العباسيين',
    destinationStation: 'كراج الراموسة',
    departTime: '12:00',
    arrivalTime: '16:30',
    duration: '4 س و 30 د',
    dateStr: 'الأحد، 8 تشرين الثاني 2026',
    price: 180000,
    busType: 'business_large',
    busTypeName: 'أعمال كبيرة · 22 مقعداً (1+1)',
    totalSeats: 22,
    availableSeats: 4,
    isAirConditioned: true,
    isDirect: true,
    status: 'OPEN',
  },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    code: 'BK-20261109-0073',
    tripId: 'TR-1082',
    origin: 'دمشق',
    destination: 'حلب',
    departDate: 'الثلاثاء 10 تشرين الثاني 2026',
    departTime: '08:00',
    seatNumbers: ['5A'],
    passengerName: 'أحمد خالد الحسن',
    passengerPhone: '+963 944 218 630',
    totalPrice: 45000,
    status: 'CONFIRMED',
    busTypeName: 'عادية 2+2',
    paymentMethod: 'CASH_BOARDING',
  },
  {
    code: 'BK-20261107-0021',
    tripId: 'TR-1083',
    origin: 'حلب',
    destination: 'دمشق',
    departDate: '8 تشرين الثاني 2026',
    departTime: '16:00',
    seatNumbers: ['3C'],
    passengerName: 'أحمد خالد الحسن',
    passengerPhone: '+963 944 218 630',
    totalPrice: 45000,
    status: 'CANCELLED',
    busTypeName: 'عادية 2+2',
    paymentMethod: 'CASH_OFFICE',
    cancelReason: 'أسباب تشغيلية من قبل الشركة',
    cancelledAt: '7 تشرين الثاني، 19:00',
  },
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'تم تأكيد حجزك',
    body: 'دمشق ← حلب · 10 تشرين الثاني، 08:00\nالمقعد 5A · BK-20261109-0073',
    dateStr: 'الآن · غير مقروء',
    isRead: false,
    type: 'CONFIRM',
  },
  {
    id: 'n2',
    title: 'تذكير: رحلتك بعد 24 ساعة',
    body: 'انطلاق رحلتك إلى حلب غداً الساعة 08:00.',
    dateStr: 'اليوم، 08:00 · غير مقروء',
    isRead: false,
    type: 'REMIND_24H',
  },
  {
    id: 'n3',
    title: 'تذكير قبل الانطلاق بـ 3 ساعات',
    body: 'رحلتك السابقة: يرجى الحضور قبل 30 دقيقة.',
    dateStr: '8 تشرين الثاني، 05:00 · مقروء',
    isRead: true,
    type: 'REMIND_3H',
  },
  {
    id: 'n4',
    title: 'تغيّر موعد الرحلة',
    body: 'دمشق ← حمص · 6 تشرين الثاني، أصبح الانطلاق 17:00 بدلاً من 16:00.',
    dateStr: '5 تشرين الثاني، 18:10 · مقروء',
    isRead: true,
    type: 'TIME_CHANGE',
  },
  {
    id: 'n5',
    title: 'أُلغيت الرحلة',
    body: 'حلب ← دمشق · 8 تشرين الثاني، 16:00. بقي سجل الحجز محفوظاً.',
    dateStr: '7 تشرين الثاني، 19:00 · مقروء',
    isRead: true,
    type: 'CANCEL',
  },
];
