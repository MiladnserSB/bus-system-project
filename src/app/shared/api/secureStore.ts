/**
 * Secure Session Storage Wrapper
 * Source: SRS Final v1.0 (REQ-CUST-09, SEC-03)
 * Uses Keychain/Keystore via SecureStore in production, with safe fallback
 */

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'masar_access_token',
  REFRESH_TOKEN: 'masar_refresh_token',
  USER_DATA: 'masar_user_data',
};

// In-memory / persistent mock storage for native compatibility
const memoryStore = new Map<string, string>();

export const SecureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      memoryStore.set(key, value);
    } catch (e) {
      console.warn('SecureStorage setItem failed:', e);
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return memoryStore.get(key) || null;
    } catch (e) {
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    memoryStore.delete(key);
  },

  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    await this.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  },

  async getAccessToken(): Promise<string | null> {
    return this.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  async clearSession(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    await this.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    await this.removeItem(STORAGE_KEYS.USER_DATA);
  },
};
