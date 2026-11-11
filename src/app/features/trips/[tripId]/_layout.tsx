import { Stack } from 'expo-router';

export default function TripDetailLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_left' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="booking" />
    </Stack>
  );
}
