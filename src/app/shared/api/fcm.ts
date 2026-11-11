/**
 * Firebase Cloud Messaging Service
 * Source: SRS Final v1.0 (Section 4.10, REQ-NOTF-06)
 */

import { apiRequest } from './client';

export const FcmService = {
  async registerDeviceToken(token: string): Promise<void> {
    try {
      await apiRequest('/devices/', {
        method: 'POST',
        body: { token, platform: 'mobile' },
      });
      console.log('FCM Token registered successfully');
    } catch (e) {
      console.warn('Failed to register FCM token:', e);
    }
  },

  async unregisterDeviceToken(token: string): Promise<void> {
    try {
      await apiRequest('/devices/', {
        method: 'DELETE',
        body: { token },
      });
    } catch (e) {
      console.warn('Failed to unregister FCM token:', e);
    }
  },
};
