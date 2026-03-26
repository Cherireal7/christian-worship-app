import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PRAYERS } from '../../constants/prayers';
import { getAppTheme } from '../../constants/theme';
import { useAppPreferences } from '../../components/providers/app-preferences';
import { QuickNavMenu } from '../../components/ui/quick-nav-menu';

function DividerMark() {
  return (
    <View style={styles.dividerWrap}>
      <View style={styles.dividerLine} />
      <View style={styles.dividerCenter}>
        <View style={styles.dividerCenterDot} />
        <View style={styles.dividerCenterStem} />
        <View style={styles.dividerCenterBar} />
      </View>
      <View style={styles.dividerLine} />
    </View>
  );
}

export default function OtherPrayersScreen() {
  const { darkMode, fontScale } = useAppPreferences();
  const theme = getAppTheme(darkMode);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <QuickNavMenu />
            <Pressable
              onPress={() => router.back()}
              style={[styles.headerButton, { backgroundColor: theme.control, borderColor: theme.border }]}
            >
              <Feather name="arrow-left" size={22} color={theme.text} />
            </Pressable>
          </View>
          <Text style={[styles.headerTitle, { color: theme.text, fontSize: 22 * fontScale }]}>ሌሎች ጸሎቶች</Text>
          <View style={styles.headerButton} />
        </View>

        <Text style={[styles.headerSubtitle, { color: theme.textMuted, fontSize: 14 * fontScale }]}>Other Prayers</Text>
        <DividerMark />

        <View style={styles.listWrap}>
          {PRAYERS.map(prayer => (
            <Pressable
              key={prayer.id}
              onPress={() => router.push(`/other-prayers/${prayer.id}`)}
              style={[styles.row, { backgroundColor: theme.surfaceStrong, borderColor: theme.border }]}
            >
              <View>
                <Text style={[styles.rowTitle, { color: theme.text, fontSize: 20 * fontScale }]}>{prayer.title}</Text>
                <Text style={[styles.rowSubtitle, { color: theme.textMuted, fontSize: 14 * fontScale }]}>{prayer.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.text} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#06164B' },
  contentContainer: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 96 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
  },
  headerTitle: { color: '#F8FAFC', fontSize: 22, fontWeight: '800' },
  headerSubtitle: { color: '#D6E1F3', textAlign: 'center', fontSize: 14, fontWeight: '500', marginTop: 8 },
  dividerWrap: { flexDirection: 'row', alignItems: 'center', marginTop: 14, marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(203, 213, 225, 0.22)' },
  dividerCenter: { width: 32, height: 24, alignItems: 'center', justifyContent: 'center' },
  dividerCenterDot: { width: 7, height: 7, borderRadius: 999, backgroundColor: '#08132C', borderWidth: 1, borderColor: '#D8A24F' },
  dividerCenterStem: { position: 'absolute', width: 2, height: 18, backgroundColor: 'rgba(216, 162, 79, 0.78)' },
  dividerCenterBar: { position: 'absolute', width: 16, height: 2, backgroundColor: 'rgba(216, 162, 79, 0.78)' },
  listWrap: { gap: 10 },
  row: {
    borderRadius: 16,
    backgroundColor: 'rgba(113, 152, 212, 0.48)',
    paddingHorizontal: 18,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.08)',
  },
  rowTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '800', marginBottom: 6 },
  rowSubtitle: { color: '#CBD5E1', fontSize: 14 },
});
