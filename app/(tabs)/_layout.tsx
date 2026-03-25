import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#22d3ee',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#020617',
          borderTopColor: 'rgba(255,255,255,0.08)',
          height: 64 + Math.max(insets.bottom, 8),
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
        }}
      />
    </Tabs>
  );
}
