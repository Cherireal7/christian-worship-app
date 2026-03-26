import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, usePathname } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getAppTheme } from '../../constants/theme';
import { useAppPreferences } from '../providers/app-preferences';

type NavItem = {
  label: string;
  route: string;
  icon: (color: string) => React.ReactNode;
  matches: string[];
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'ዋና መንገዶች',
    items: [
      {
        label: 'መነሻ',
        route: '/(tabs)',
        matches: ['/'],
        icon: color => <Feather name="home" size={18} color={color} />,
      },
      {
        label: 'ተወዳጆች',
        route: '/(tabs)/favorites',
        matches: ['/favorites'],
        icon: color => <Feather name="heart" size={18} color={color} />,
      },
      {
        label: 'ቅንብሮች',
        route: '/settings',
        matches: ['/settings'],
        icon: color => <Feather name="settings" size={18} color={color} />,
      },
    ],
  },
  {
    title: 'የአምልኮ ይዘት',
    items: [
      {
        label: 'መዝሙር',
        route: '/hymn-book',
        matches: ['/hymn-book'],
        icon: color => (
          <MaterialCommunityIcons name="book-open-variant-outline" size={19} color={color} />
        ),
      },
      {
        label: 'መግለጫዎች',
        route: '/declaration-of-faith',
        matches: ['/declaration-of-faith'],
        icon: color => <Ionicons name="document-text-outline" size={18} color={color} />,
      },
      {
        label: 'ሌሎች ጸሎቶች',
        route: '/other-prayers',
        matches: ['/other-prayers'],
        icon: color => <Feather name="book-open" size={18} color={color} />,
      },
    ],
  },
  {
    title: 'መሳሪያዎች',
    items: [
      {
        label: 'የዕለቱ ንባቦች',
        route: '/calendar',
        matches: ['/calendar'],
        icon: color => <Ionicons name="calendar-outline" size={18} color={color} />,
      },
    ],
  },
];

function matchesPath(pathname: string, patterns: string[]) {
  return patterns.some(pattern => pathname === pattern || pathname.startsWith(`${pattern}/`));
}

export function QuickNavMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { darkMode } = useAppPreferences();
  const theme = getAppTheme(darkMode);
  const progress = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

  const drawerWidth = Math.min(width * 0.82, 320);

  useEffect(() => {
    if (!open) {
      return;
    }

    setMounted(true);
    Animated.timing(progress, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [open, progress]);

  const closeDrawer = () => {
    Animated.timing(progress, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setMounted(false);
        setOpen(false);
      }
    });
  };

  const overlayStyle = useMemo(
    () => ({
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    }),
    [progress],
  );

  const drawerStyle = useMemo(
    () => ({
      width: drawerWidth,
      transform: [
        {
          translateX: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-drawerWidth - 24, 0],
          }),
        },
      ],
    }),
    [drawerWidth, progress],
  );

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.button, { backgroundColor: theme.control, borderColor: theme.border }]}
      >
        <Feather name="menu" size={18} color={theme.text} />
      </Pressable>

      {mounted ? (
        <Modal visible transparent animationType="none" onRequestClose={closeDrawer}>
          <View style={styles.modalRoot}>
            <Animated.View style={[styles.overlay, overlayStyle]}>
              <Pressable style={styles.overlayTap} onPress={closeDrawer} />
            </Animated.View>

            <Animated.View
              style={[
                styles.drawer,
                drawerStyle,
                { backgroundColor: theme.control, borderColor: theme.border },
              ]}
            >
              <SafeAreaView edges={['top', 'left', 'bottom']} style={styles.safeArea}>
                <View style={[styles.hero, { borderBottomColor: theme.divider }]}>
                  <View style={[styles.heroBadge, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Ionicons name="library-outline" size={18} color={theme.accent} />
                  </View>
                  <Text style={[styles.heroTitle, { color: theme.text }]}>የክርስቲያን አምልኮ</Text>
                  <Text style={[styles.heroSubtitle, { color: theme.textMuted }]}>
                    መጽሐፍት፣ ጸሎቶች እና የቀን መረጃዎች
                  </Text>

                  <Pressable
                    onPress={closeDrawer}
                    style={[styles.closeButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  >
                    <Feather name="x" size={18} color={theme.text} />
                  </Pressable>
                </View>

                <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {NAV_SECTIONS.map(section => (
                    <View key={section.title} style={styles.section}>
                      <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
                        {section.title}
                      </Text>

                      {section.items.map(item => {
                        const active = matchesPath(pathname, item.matches);

                        return (
                          <Pressable
                            key={item.route}
                            onPress={() => {
                              closeDrawer();
                              router.push(item.route as never);
                            }}
                            style={[
                              styles.navItem,
                              {
                                backgroundColor: active ? theme.surface : 'transparent',
                                borderColor: active ? theme.border : 'transparent',
                              },
                            ]}
                          >
                            <View
                              style={[
                                styles.navIconWrap,
                                {
                                  backgroundColor: active ? `${theme.accent}22` : theme.surface,
                                  borderColor: active ? `${theme.accent}55` : theme.border,
                                },
                              ]}
                            >
                              {item.icon(active ? theme.accent : theme.text)}
                            </View>

                            <Text
                              style={[
                                styles.navText,
                                { color: active ? theme.text : theme.textMuted },
                              ]}
                            >
                              {item.label}
                            </Text>

                            <Feather
                              name="chevron-right"
                              size={18}
                              color={active ? theme.accent : theme.textMuted}
                            />
                          </Pressable>
                        );
                      })}
                    </View>
                  ))}
                </ScrollView>
              </SafeAreaView>
            </Animated.View>
          </View>
        </Modal>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.5)',
  },
  overlayTap: {
    flex: 1,
  },
  drawer: {
    flex: 1,
    maxWidth: 320,
    borderRightWidth: 1,
    shadowColor: '#020617',
    shadowOpacity: 0.34,
    shadowRadius: 20,
    shadowOffset: { width: 8, height: 0 },
    elevation: 24,
  },
  safeArea: {
    flex: 1,
  },
  hero: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  heroBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    maxWidth: '88%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 18,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
    paddingHorizontal: 8,
    textTransform: 'uppercase',
  },
  navItem: {
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 12,
  },
  navIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  navText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
});
