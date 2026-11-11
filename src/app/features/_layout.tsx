import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ensureRTL } from '../shared/constants/rtl';

export default function FeaturesLayout() {
  useEffect(() => {
    ensureRTL();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="trips" />
        <Stack.Screen name="tickets" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
