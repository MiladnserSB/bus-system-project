import { I18nManager } from 'react-native';

/**
 * RTL Support & Configuration
 * Source: SRS Final v1.0 (Section 2.5, p. 12 & Section 3.1.1, p. 14)
 * الواجهات عربية RTL بالكامل في الإصدار الأول
 */

export function ensureRTL() {
  if (!I18nManager.isRTL) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }
}
