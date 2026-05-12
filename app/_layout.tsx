import '../global.css';

import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { type NotificationResponse } from 'expo-notifications/build/Notifications.types';
import {
  addNotificationResponseReceivedListener,
  getLastNotificationResponseAsync,
} from 'expo-notifications/build/NotificationsEmitter';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppPreferencesProvider, useAppPreferences } from '../components/providers/app-preferences';
import { LiturgicalProvider } from '../data/LiturgicalContext';

if (Platform.OS !== 'web') {
  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

function NotificationObserver() {
  const router = useRouter();
  const lastHandledIdentifier = useRef<string | null>(null);

  useEffect(() => {
    // expo-notifications APIs are not available on web
    if (Platform.OS === 'web') {
      return;
    }

    function navigateFromResponse(response: NotificationResponse | null) {
      const identifier = response?.notification.request.identifier;

      if (!identifier || lastHandledIdentifier.current === identifier) {
        return;
      }

      const url = response.notification.request.content.data?.url;

      if (typeof url !== 'string') {
        return;
      }

      lastHandledIdentifier.current = identifier;
      router.push(url as never);
    }

    void getLastNotificationResponseAsync().then(navigateFromResponse);

    const subscription = addNotificationResponseReceivedListener(navigateFromResponse);

    return () => {
      subscription.remove();
    };
  }, [router]);

  return null;
}

function RootNavigator() {
  const { darkMode } = useAppPreferences();

  return (
    <>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <NotificationObserver />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: darkMode ? '#020617' : '#E7EEF9' },
          animation: 'slide_from_right',
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
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
