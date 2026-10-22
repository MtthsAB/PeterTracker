import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Barlow_400Regular, Barlow_500Medium, Barlow_600SemiBold, Barlow_700Bold } from '@expo-google-fonts/barlow';
import { BarlowCondensed_700Bold } from '@expo-google-fonts/barlow-condensed';
import { colors } from '../theme/tokens';

export default function RootLayout() {
  const [loaded] = useFonts({
    Barlow_400Regular, Barlow_500Medium, Barlow_600SemiBold, Barlow_700Bold, BarlowCondensed_700Bold,
  });
  if (!loaded) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="call" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
        <Stack.Screen name="emergencia/index" options={{ presentation: 'modal' }} />
        <Stack.Screen name="emergencia/confirmado" options={{ gestureEnabled: false }} />
      </Stack>
    </>
  );
}
