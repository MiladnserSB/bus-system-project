import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../shared/constants/theme';
import { SecureStorage } from '../shared/api/secureStore';

export default function RootFeaturesIndex() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = await SecureStorage.getAccessToken();
      setChecking(false);
      if (token) {
        router.replace('/features/(tabs)' as any);
      } else {
        router.replace('/features/(tabs)' as any); // default to home tabs for immediate preview
      }
    }
    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>مسار</Text>
      <Text style={styles.sub}>رحلتك تبدأ بوضوح 🚌</Text>
      <ActivityIndicator size="small" color={Colors.white} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 2,
  },
  sub: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 8,
    fontWeight: '600',
  },
  loader: {
    marginTop: 24,
  },
});
