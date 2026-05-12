import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppPreferences } from '../../components/providers/app-preferences';
import { QuickNavMenu } from '../../components/ui/quick-nav-menu';
import { getAppTheme } from '../../constants/theme';

export default function SmallCatechismIndexScreen() {
  const { darkMode, fontScale } = useAppPreferences();
  const theme = getAppTheme(darkMode);

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <QuickNavMenu />
          <Pressable
            onPress={() => router.replace('/home')}
            style={[
              styles.headerButton,
              { backgroundColor: theme.control, borderColor: theme.border },
            ]}
          >
            <Feather name="arrow-left" size={22} color={theme.text} />
          </Pressable>
        </View>
        <Text style={[styles.headerTitle, { color: theme.text, fontSize: 22 * fontScale }]}>
          Small Catechism
        </Text>
        <View style={styles.headerButtonSpacer} />
      </View>

      <View style={styles.contentContainer}>
        <View style={[styles.comingSoonCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Feather name="clock" size={48} color={theme.accent} style={styles.icon} />
          <Text style={[styles.comingSoonTitle, { color: theme.text, fontSize: 24 * fontScale }]}>
            Coming Soon
          </Text>
          <Text style={[styles.comingSoonText, { color: theme.textMuted, fontSize: 16 * fontScale }]}>
            The Small Catechism content is currently being prepared and will be available in a future update.
          </Text>
          <Pressable
            onPress={() => router.replace('/home')}
            style={[styles.backButton, { backgroundColor: theme.accent }]}
          >
            <Text style={[styles.backButtonText, { fontSize: 16 * fontScale }]}>Return Home</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#06164B' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerButtonSpacer: {
    width: 38,
    height: 38,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonCard: {
    width: '100%',
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  icon: {
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  comingSoonText: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
