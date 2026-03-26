import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppPreferences } from '../../components/providers/app-preferences';
import { getAppTheme } from '../../constants/theme';

const TAB_CONFIG = {
  index: {
    label: 'መነሻ',
    icon: (color: string) => <Feather name="home" size={24} color={color} />,
  },
  'hymn-book': {
    label: 'መዝሙር',
    icon: (color: string) => (
      <MaterialCommunityIcons name="book-open-variant-outline" size={24} color={color} />
    ),
  },
  calendar: {
    label: 'ቀን መቁጠሪያ',
    icon: (color: string) => <Ionicons name="calendar-outline" size={24} color={color} />,
  },
  favorites: {
    label: 'ተወዳጆች',
    icon: (color: string) => <Feather name="heart" size={24} color={color} />,
  },
} as const;

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { darkMode, fontScale } = useAppPreferences();
  const theme = getAppTheme(darkMode);

  return (
    <View style={[styles.tabBarOuter, { bottom: Math.max(insets.bottom, 6) }]}>
      <View style={[styles.tabBar, { backgroundColor: theme.control, borderColor: theme.border }]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const config = TAB_CONFIG[route.name as keyof typeof TAB_CONFIG];
          const color = focused ? theme.accent : theme.text;
          const label = config?.label ?? descriptors[route.key].options.title ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <View key={route.key} style={styles.tabItemWrap}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                onPress={onPress}
                style={[
                  styles.tabButton,
                  focused ? styles.tabButtonActive : null,
                  focused ? { backgroundColor: theme.surface } : null,
                ]}
              >
                {config?.icon(color)}
                <Text style={[styles.tabLabel, { color, fontSize: 10 * fontScale }]} numberOfLines={1}>
                  {label}
                </Text>
              </Pressable>
              {index < state.routes.length - 1 ? <View style={[styles.tabDivider, { backgroundColor: theme.divider }]} /> : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'መነሻ',
        }}
      />
      <Tabs.Screen
        name="hymn-book"
        options={{
          title: 'መዝሙር',
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'ቀን መቁጠሪያ',
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'ተወዳጆች',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarOuter: {
    position: 'absolute',
    left: 10,
    right: 10,
    backgroundColor: 'transparent',
    paddingTop: 0,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 26,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 6,
    shadowColor: '#020617',
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  tabItemWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 48,
    paddingHorizontal: 4,
    borderRadius: 18,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  tabDivider: {
    width: 1,
    height: 30,
  },
});
