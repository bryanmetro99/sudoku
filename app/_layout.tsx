import { GameProvider, useGame } from '@/contexts/GameContext';
import { Colors } from '@/utils/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function RootStack() {
  const router = useRouter();
  const { settings } = useGame();
  const dark = settings.theme === 'dark';
  const headerTint = dark ? Colors.textPrimaryDark : Colors.textPrimary;
  const handleSettingsBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="game" />
        <Stack.Screen name="create" />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Réglages',
            headerShown: true,
            animation: 'slide_from_right',
            headerStyle: {
              backgroundColor: dark ? Colors.backgroundDark : Colors.background,
            },
            headerTintColor: headerTint,
            headerTitleStyle: {
              fontWeight: '800',
            },
            headerLeft: () => (
              <Pressable
                onPress={handleSettingsBack}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Retour"
                style={({ pressed }) => [
                  styles.headerBackButton,
                  pressed && styles.headerBackButtonPressed,
                ]}
              >
                <Ionicons name="chevron-back" size={24} color={headerTint} />
              </Pressable>
            ),
          }}
        />
      </Stack>
      <StatusBar style={dark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  useFonts(Ionicons.font);

  return (
    <SafeAreaProvider>
      <GameProvider>
        <RootStack />
      </GameProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerBackButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBackButtonPressed: {
    opacity: 0.65,
  },
});
