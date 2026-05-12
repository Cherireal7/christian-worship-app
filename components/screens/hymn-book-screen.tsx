import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { HYMNS, type Hymn } from '../../constants/hymns';
import { getAppTheme } from '../../constants/theme';
import { buildSearchForms } from '../../services/amharic-search';
import { useAppPreferences } from '../providers/app-preferences';
import { QuickNavMenu } from '../ui/quick-nav-menu';

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

export function HymnBookScreen() {
  const [query, setQuery] = useState('');
  const [showFloatingSearch, setShowFloatingSearch] = useState(false);
  const { darkMode, fontScale } = useAppPreferences();
  const theme = getAppTheme(darkMode);
  const insets = useSafeAreaInsets();

  const hymns = useMemo(() => {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length === 0) {
      return HYMNS;
    }

    const queryForms = buildSearchForms(normalizedQuery);

    return HYMNS.filter(hymn => {
      if (queryForms.original && hymn.searchOriginal.includes(queryForms.original)) {
        return true;
      }

      if (queryForms.latin && hymn.searchLatin.includes(queryForms.latin)) {
        return true;
      }

      if (queryForms.skeleton.length >= 2 && hymn.searchSkeleton.includes(queryForms.skeleton)) {
        return true;
      }

      return false;
    });
  }, [query]);

  function renderHymnItem({ item }: { item: Hymn }) {
    return (
      <Pressable
        onPress={() => router.push(`/hymn-detail/${item.id}`)}
        style={[styles.hymnRow, { backgroundColor: theme.surfaceStrong, borderBottomColor: theme.divider }]}
      >
        <View style={styles.hymnNumberWrap}>
          <Text style={[styles.hymnNumber, { color: theme.accent, fontSize: 20 * fontScale }]}>
            {item.number}
          </Text>
        </View>

        <View style={styles.hymnTextWrap}>
          <Text style={[styles.hymnTitle, { color: theme.text, fontSize: 20 * fontScale }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text
            style={[styles.hymnOpening, { color: theme.textMuted, fontSize: 13 * fontScale }]}
            numberOfLines={2}
          >
            {item.opening}
          </Text>
        </View>

        <View style={[styles.hymnArrowWrap, { backgroundColor: theme.surface }]}>
          <Ionicons name="chevron-forward" size={18} color={theme.text} />
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {showFloatingSearch ? (
        <View
          style={[
            styles.floatingSearchWrap,
            {
              top: Math.max(insets.top + 52, 64),
            },
          ]}
          pointerEvents="box-none"
        >
          <View style={[styles.searchShell, styles.floatingSearchShell, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Feather name="search" size={19} color={theme.textMuted} />
            <TextInput
              placeholder="በቁጥር ወይም በርዕስ ፈልግ..."
              placeholderTextColor={theme.textMuted}
              selectionColor={theme.accent}
              style={[styles.searchInput, { color: theme.text, fontSize: 16 * fontScale }]}
              value={query}
              onChangeText={setQuery}
            />
            {query.length > 0 ? (
              <Pressable onPress={() => setQuery('')} style={styles.clearButton}>
                <Ionicons name="close" size={18} color={theme.textMuted} />
              </Pressable>
            ) : null}
          </View>
        </View>
      ) : null}

      <FlatList
        data={hymns}
        keyExtractor={item => item.id}
        renderItem={renderHymnItem}
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        initialNumToRender={18}
        maxToRenderPerBatch={18}
        windowSize={8}
        removeClippedSubviews
        onScroll={event => {
          const nextVisible = event.nativeEvent.contentOffset.y > 170;
          if (nextVisible !== showFloatingSearch) {
            setShowFloatingSearch(nextVisible);
          }
        }}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <>
            <View style={styles.headerRow}>
              <QuickNavMenu />
              <Pressable
                onPress={() => router.push('/settings')}
                style={[styles.headerButton, { backgroundColor: theme.control, borderColor: theme.border }]}
              >
                <Feather name="settings" size={18} color={theme.text} />
              </Pressable>
            </View>

            <View style={styles.heroSection}>
              <View style={styles.topGlow} />
              <Text style={[styles.heroTitle, { color: theme.text, fontSize: 18 * fontScale, lineHeight: 28 * fontScale }]}>
                የክርስቲያን አምልኮ መዝሙር መጽሐፍ
              </Text>
              <Text style={[styles.heroSubtitle, { color: theme.textMuted, fontSize: 12 * fontScale }]}>
                በቁጥር እና በርዕስ የሚፈለጉ መዝሙሮች
              </Text>
              <DividerMark />
            </View>

            <View style={styles.controlsRow}>
              <View style={[styles.searchShell, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Feather name="search" size={19} color={theme.textMuted} />
                <TextInput
                  placeholder="በቁጥር ወይም በርዕስ ፈልግ..."
                  placeholderTextColor={theme.textMuted}
                  selectionColor={theme.accent}
                  style={[styles.searchInput, { color: theme.text, fontSize: 16 * fontScale }]}
                  value={query}
                  onChangeText={setQuery}
                />
                {query.length > 0 ? (
                  <Pressable onPress={() => setQuery('')} style={styles.clearButton}>
                    <Ionicons name="close" size={18} color={theme.textMuted} />
                  </Pressable>
                ) : null}
              </View>
            </View>

            <View style={styles.metaRow}>
              <Text style={[styles.metaText, { color: theme.accent, fontSize: 13 * fontScale }]}>
                {hymns.length} መዝሙሮች
              </Text>
              <Text style={[styles.metaTextSecondary, { color: theme.textMuted, fontSize: 12 * fontScale }]}>
                ለመክፈት ይጫኑ
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={[styles.emptyState, { backgroundColor: theme.surfaceStrong, borderColor: theme.border }]}>
            <Feather name="search" size={22} color={theme.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>ምንም መዝሙር አልተገኘም</Text>
            <Text style={[styles.emptyDescription, { color: theme.textMuted }]}>
              የፍለጋ ቃልዎን ይቀይሩ።
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#06164B',
  },
  floatingSearchWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 20,
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 44,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  heroSection: {
    position: 'relative',
    paddingTop: 8,
    paddingBottom: 2,
  },
  topGlow: {
    position: 'absolute',
    top: 2,
    left: 56,
    right: 56,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(84, 170, 255, 0.08)',
  },
  heroTitle: {
    color: '#F8FAFC',
    textAlign: 'center',
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '800',
    marginBottom: 2,
  },
  heroSubtitle: {
    color: '#CBD5E1',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(203, 213, 225, 0.22)',
  },
  dividerCenter: {
    width: 32,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerCenterDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: '#08132C',
    borderWidth: 1,
    borderColor: '#D8A24F',
  },
  dividerCenterStem: {
    position: 'absolute',
    width: 2,
    height: 18,
    backgroundColor: 'rgba(216, 162, 79, 0.78)',
  },
  dividerCenterBar: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: 'rgba(216, 162, 79, 0.78)',
  },
  controlsRow: {
    marginBottom: 10,
    zIndex: 2,
  },
  searchShell: {
    flex: 1,
    minHeight: 54,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.26)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
    shadowColor: '#020617',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 16,
    paddingVertical: 14,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingSearchShell: {
    shadowOpacity: 0.24,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 10,
  },
  metaText: {
    color: '#D8A24F',
    fontSize: 13,
    fontWeight: '700',
  },
  metaTextSecondary: {
    color: '#94A3B8',
    fontSize: 12,
  },
  hymnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.18)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 24,
    marginBottom: 10,
  },
  hymnNumberWrap: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  hymnNumber: {
    color: '#D8A24F',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  hymnTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  hymnTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  hymnOpening: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 20,
  },
  hymnArrowWrap: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  emptyState: {
    borderWidth: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 36,
    marginTop: 12,
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 14,
    marginBottom: 6,
  },
  emptyDescription: {
    color: '#CBD5E1',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
