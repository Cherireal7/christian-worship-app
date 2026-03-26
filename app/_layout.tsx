import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppPreferencesProvider, useAppPreferences } from '../components/providers/app-preferences';
import { LiturgicalProvider } from '../data/LiturgicalContext';

function RootNavigator() {
  const { darkMode } = useAppPreferences();

  return (
    <>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: darkMode ? '#020617' : '#E7EEF9' },
          animation: 'fade',
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppPreferencesProvider>
        <LiturgicalProvider>
          <RootNavigator />
        </LiturgicalProvider>
      </AppPreferencesProvider>
    </SafeAreaProvider>
  );
}
