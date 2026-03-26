import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CONFESSIONS } from '../../constants/confessions';
import { getAppTheme } from '../../constants/theme';
import { useAppPreferences } from '../providers/app-preferences';
import { QuickNavMenu } from '../ui/quick-nav-menu';

function HomeCrossMark() {
  return (
    <View style={styles.crossWrap}>
      <View style={styles.crossVertical} />
      <View style={styles.crossHorizontal} />
      <View style={styles.crossHalo} />
      <View style={styles.crossRayVertical} />
      <View style={styles.crossRayHorizontal} />
      <View style={styles.crossRayDiagonalLeft} />
      <View style={styles.crossRayDiagonalRight} />
    </View>
  );
}

function DecorativeDivider() {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <View style={styles.dividerCenterWrap}>
        <View style={styles.dividerCenterDot} />
        <View style={styles.dividerCenterCrossVertical} />
        <View style={styles.dividerCenterCrossHorizontal} />
      </View>
      <View style={styles.dividerLine} />
    </View>
  );
}

export function ConfessionsScreen() {
  const { darkMode, fontScale } = useAppPreferences();
  const theme = getAppTheme(darkMode);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { backgroundColor: darkMode ? '#0B3078' : '#DCE7F8' }]}>
          <View style={styles.topActions}>
            <QuickNavMenu />
            <Pressable
              onPress={() => router.push('/settings')}
              style={[styles.settingsButton, { backgroundColor: theme.control, borderColor: theme.border }]}
            >
              <Feather name="settings" size={22} color={theme.text} />
            </Pressable>
          </View>

          <View>
            <HomeCrossMark />

            <Text style={[styles.heroTitle, { color: theme.text, fontSize: 19 * fontScale, lineHeight: 31 * fontScale }]}>
              የሉተር መሠረተ እምነት እና የሥርዓተ አምልኮ ጽሑፎች
            </Text>
            <Text style={[styles.heroSubtitle, { color: theme.textMuted, fontSize: 13 * fontScale }]}>Creeds & Liturgical Texts</Text>

            <DecorativeDivider />
          </View>

          <View style={styles.actionsWrap}>
            {CONFESSIONS.map(confession => (
              <Pressable
                key={confession.id}
                onPress={() =>
                  confession.id === 'other-prayers'
                    ? router.push('/other-prayers')
                    : router.push(`/declaration-of-faith/${confession.id}`)
                }
                style={[styles.actionCard, { backgroundColor: theme.surfaceStrong, borderColor: theme.border }]}
              >
                <View style={styles.actionCopy}>
                  <Text style={[styles.actionTitle, { color: theme.text, fontSize: 20 * fontScale }]}>{confession.title}</Text>
                  <Text style={[styles.actionSubtitle, { color: theme.textMuted, fontSize: 14 * fontScale }]}>{confession.subtitle}</Text>
                </View>
                <View style={styles.actionArrowWrap}>
                  <Ionicons name="chevron-forward" size={20} color={theme.text} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#06164B' },
  contentContainer: { paddingBottom: 96 },
  heroCard: { backgroundColor: '#0B3078', paddingHorizontal: 20, paddingTop: 0, paddingBottom: 0 },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 18,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
  },
  crossWrap: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  crossHalo: { position: 'absolute', width: 76, height: 76, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.03)' },
  crossVertical: { width: 9, height: 56, borderRadius: 999, backgroundColor: '#FFFFFF' },
  crossHorizontal: { position: 'absolute', width: 34, height: 7, borderRadius: 999, backgroundColor: '#FFFFFF' },
  crossRayVertical: { position: 'absolute', width: 1, height: 92, backgroundColor: 'rgba(12, 18, 34, 0.38)' },
  crossRayHorizontal: { position: 'absolute', width: 92, height: 1, backgroundColor: 'rgba(12, 18, 34, 0.38)' },
  crossRayDiagonalLeft: {
    position: 'absolute', width: 92, height: 1, backgroundColor: 'rgba(12, 18, 34, 0.38)', transform: [{ rotate: '45deg' }],
  },
  crossRayDiagonalRight: {
    position: 'absolute', width: 92, height: 1, backgroundColor: 'rgba(12, 18, 34, 0.38)', transform: [{ rotate: '-45deg' }],
  },
  heroTitle: { color: '#F8FAFC', textAlign: 'center', fontSize: 19, lineHeight: 31, fontWeight: '800', marginBottom: 6, paddingHorizontal: 10 },
  heroSubtitle: { color: '#D6E1F3', textAlign: 'center', fontSize: 13, fontWeight: '600', marginBottom: 14 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(125, 211, 252, 0.22)' },
  dividerCenterWrap: { width: 34, height: 24, alignItems: 'center', justifyContent: 'center' },
  dividerCenterDot: { width: 8, height: 8, borderRadius: 999, backgroundColor: '#0B183C', borderWidth: 1, borderColor: '#D8A24F' },
  dividerCenterCrossVertical: { position: 'absolute', width: 2, height: 18, backgroundColor: 'rgba(216, 162, 79, 0.75)' },
  dividerCenterCrossHorizontal: { position: 'absolute', width: 18, height: 2, backgroundColor: 'rgba(216, 162, 79, 0.75)' },
  actionsWrap: { gap: 12, marginBottom: 14 },
  actionCopy: { flex: 1, paddingRight: 12 },
  actionCard: {
    borderRadius: 15,
    backgroundColor: 'rgba(113, 152, 212, 0.48)',
    paddingHorizontal: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#020617',
    shadowOpacity: 0.26,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7,
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.08)',
  },
  actionTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '800', marginBottom: 7 },
  actionSubtitle: { color: '#CBD5E1', fontSize: 14 },
  actionArrowWrap: { width: 28, height: 28, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
});
