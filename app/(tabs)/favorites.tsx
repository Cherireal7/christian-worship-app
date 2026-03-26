import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppPreferences } from '../../components/providers/app-preferences';
import { CONFESSIONS } from '../../constants/confessions';
import { HYMNS } from '../../constants/hymns';
import { PRAYERS } from '../../constants/prayers';
import { getAppTheme } from '../../constants/theme';

function DividerMark({ color, accent }: { color: string; accent: string }) {
  return (
    <View style={styles.dividerWrap}>
      <View style={[styles.dividerLine, { backgroundColor: color }]} />
      <View style={styles.dividerCenter}>
        <View style={[styles.dividerCenterDot, { borderColor: accent }]} />
        <View style={[styles.dividerCenterStem, { backgroundColor: accent }]} />
        <View style={[styles.dividerCenterBar, { backgroundColor: accent }]} />
      </View>
      <View style={[styles.dividerLine, { backgroundColor: color }]} />
    </View>
  );
}

type FavoriteFilter = 'all' | 'hymns' | 'confessions' | 'prayers';

const FILTERS: Array<{ key: FavoriteFilter; label: string }> = [
  { key: 'all', label: 'ሁሉም' },
  { key: 'hymns', label: 'መዝሙሮች' },
  { key: 'confessions', label: 'መግለጫዎች' },
  { key: 'prayers', label: 'ጸሎቶች' },
];

export default function FavoritesScreen() {
  const [filter, setFilter] = useState<FavoriteFilter>('all');
  const { darkMode, fontScale } = useAppPreferences();
  const theme = getAppTheme(darkMode);

  const items = useMemo(() => {
    const merged = [
      ...HYMNS.slice(0, 4).map(item => ({
        key: item.id,
        number: item.number,
        title: item.title,
        subtitle: 'መዝሙር',
        type: 'hymns' as const,
        route: `/hymn-book/${item.id}` as const,
      })),
      ...CONFESSIONS.slice(0, 3).map((item, index) => ({
        key: item.id,
        number: String(index + 1).padStart(2, '0'),
        title: item.title,
        subtitle: 'መግለጫ',
        type: 'confessions' as const,
        route: `/declaration-of-faith/${item.id}` as const,
      })),
      ...PRAYERS.slice(0, 3).map((item, index) => ({
        key: item.id,
        number: String(index + 1).padStart(2, '0'),
        title: item.title,
        subtitle: 'ጸሎት',
        type: 'prayers' as const,
        route: `/other-prayers/${item.id}` as const,
      })),
    ];

    if (filter === 'all') {
      return merged;
    }

    return merged.filter(item => item.type === filter);
  }, [filter]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.headerButton} />
          <Text style={[styles.headerTitle, { color: theme.text, fontSize: 22 * fontScale }]}>ተወዳጆች</Text>
          <View style={styles.headerButton} />
        </View>

        <DividerMark color={theme.divider} accent={theme.accent} />

        <View style={styles.filterRow}>
          {FILTERS.map(item => {
            const active = item.key === filter;

            return (
              <Pressable
                key={item.key}
                onPress={() => setFilter(item.key)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active ? theme.control : theme.surface,
                    borderColor: active ? theme.accent : theme.border,
                  },
                ]}
              >
                <Text style={[styles.filterText, { color: active ? theme.accent : theme.text, fontSize: 13 * fontScale }]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.listWrap}>
          {items.map(item => (
            <Pressable
              key={item.key}
              onPress={() => router.push(item.route)}
              style={[styles.row, { backgroundColor: theme.surfaceStrong, borderColor: theme.border }]}
            >
              <Text style={[styles.rowNumber, { color: theme.accent, fontSize: 22 * fontScale }]}>{item.number}</Text>
              <View style={styles.rowBody}>
                <Text style={[styles.rowTitle, { color: theme.text, fontSize: 18 * fontScale }]}>{item.title}</Text>
                <Text style={[styles.rowSubtitle, { color: theme.textMuted, fontSize: 12 * fontScale }]}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.text} />
            </Pressable>
          ))}

          {items.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.surfaceStrong, borderColor: theme.border }]}>
              <Feather name="heart" size={22} color={theme.accent} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>ባዶ ዝርዝር</Text>
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                በዚህ ምድብ ላይ የተወዳጁ ንጥሎች አልተገኙም።
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  contentContainer: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 96 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerButton: { width: 34, height: 34 },
  headerTitle: { fontWeight: '800' },
  dividerWrap: { flexDirection: 'row', alignItems: 'center', marginTop: 14, marginBottom: 22 },
  dividerLine: { flex: 1, height: 1 },
  dividerCenter: { width: 32, height: 24, alignItems: 'center', justifyContent: 'center' },
  dividerCenterDot: { width: 7, height: 7, borderRadius: 999, backgroundColor: '#08132C', borderWidth: 1 },
  dividerCenterStem: { position: 'absolute', width: 2, height: 18, opacity: 0.78 },
  dividerCenterBar: { position: 'absolute', width: 16, height: 2, opacity: 0.78 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterText: { fontWeight: '700' },
  listWrap: { gap: 10 },
  row: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  rowNumber: { width: 38, fontWeight: '800' },
  rowBody: { flex: 1, paddingRight: 10 },
  rowTitle: { fontWeight: '700', marginBottom: 4 },
  rowSubtitle: { fontWeight: '600' },
  emptyState: {
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyTitle: { fontSize: 18, fontWeight: '800', marginTop: 10, marginBottom: 6 },
  emptyText: { textAlign: 'center', fontSize: 14, lineHeight: 22 },
});
