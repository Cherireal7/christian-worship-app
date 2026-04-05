import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  useAppPreferences,
  type FavoriteKind,
} from '../../components/providers/app-preferences';
import { QuickNavMenu } from '../../components/ui/quick-nav-menu';
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

type FavoriteFilter = 'all' | FavoriteKind;

type FavoriteListItem = {
  key: string;
  id: string;
  kind: FavoriteKind;
  badge: string;
  title: string;
  subtitle: string;
  route: string;
};

const FILTERS: Array<{ key: FavoriteFilter; label: string }> = [
  { key: 'all', label: 'ሁሉም' },
  { key: 'hymn', label: 'መዝሙሮች' },
  { key: 'confession', label: 'ኑዛዜዎች' },
  { key: 'prayer', label: 'ጸሎቶች' },
];

export default function FavoritesScreen() {
  const [filter, setFilter] = useState<FavoriteFilter>('all');
  const { darkMode, fontScale, favoriteItems, toggleFavorite } = useAppPreferences();
  const theme = getAppTheme(darkMode);

  const items = useMemo(() => {
    const orderedFavorites = [...favoriteItems].reverse();

    const resolved = orderedFavorites
      .map<FavoriteListItem | null>(favorite => {
        if (favorite.kind === 'hymn') {
          const hymn = HYMNS.find(item => item.id === favorite.id);
          return hymn
            ? {
                key: `hymn:${hymn.id}`,
                id: hymn.id,
                kind: 'hymn',
                badge: hymn.number,
                title: hymn.title,
                subtitle: 'መዝሙር',
                route: `/hymn-book/${hymn.id}`,
              }
            : null;
        }

        if (favorite.kind === 'confession') {
          const confession = CONFESSIONS.find(item => item.id === favorite.id);
          return confession
            ? {
                key: `confession:${confession.id}`,
                id: confession.id,
                kind: 'confession',
                badge: 'መግ',
                title: confession.title,
                subtitle: 'የእምነት ኑዛዜ',
                route: `/declaration-of-faith/${confession.id}`,
              }
            : null;
        }

        const prayer = PRAYERS.find(item => item.id === favorite.id);
        return prayer
          ? {
              key: `prayer:${prayer.id}`,
              id: prayer.id,
              kind: 'prayer',
              badge: 'ጸ',
              title: prayer.title,
              subtitle: 'ጸሎት',
              route: `/other-prayers/${prayer.id}`,
            }
          : null;
      })
      .filter((item): item is FavoriteListItem => item !== null);

    if (filter === 'all') {
      return resolved;
    }

    return resolved.filter(item => item.kind === filter);
  }, [favoriteItems, filter]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <QuickNavMenu />
          <Text style={[styles.headerTitle, { color: theme.text, fontSize: 22 * fontScale }]}>ተወዳጆች</Text>
          <View style={styles.headerSpacer} />
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
            <View
              key={item.key}
              style={[styles.row, { backgroundColor: theme.surfaceStrong, borderColor: theme.border }]}
            >
              <Pressable onPress={() => router.push(item.route as never)} style={styles.rowMain}>
                <View style={[styles.rowBadge, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Text style={[styles.rowBadgeText, { color: theme.accent, fontSize: item.kind === 'hymn' ? 18 * fontScale : 12 * fontScale }]}>
                    {item.badge}
                  </Text>
                </View>
                <View style={styles.rowBody}>
                  <Text style={[styles.rowTitle, { color: theme.text, fontSize: 17 * fontScale }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.rowSubtitle, { color: theme.textMuted, fontSize: 12 * fontScale }]}>
                    {item.subtitle}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.text} />
              </Pressable>

              <Pressable
                onPress={() => toggleFavorite(item.kind, item.id)}
                style={[styles.removeButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <Feather name="heart" size={16} color={theme.accent} />
              </Pressable>
            </View>
          ))}

          {items.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.surfaceStrong, borderColor: theme.border }]}>
              <Feather name="heart" size={22} color={theme.accent} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>ተወዳጅ ዝርዝር ባዶ ነው</Text>
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                በመዝሙር፣ በመግለጫ ወይም በጸሎት ገጾች ላይ ያለውን የልብ ምልክት በመጫን እዚህ ያከማቹ።
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
  headerSpacer: { width: 46, height: 46 },
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
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowBadgeText: { fontWeight: '800' },
  rowBody: { flex: 1, paddingRight: 10 },
  rowTitle: { fontWeight: '700', marginBottom: 4 },
  rowSubtitle: { fontWeight: '600' },
  removeButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
