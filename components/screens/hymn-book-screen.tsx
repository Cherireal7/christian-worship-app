import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HYMNS, HYMN_CATEGORIES, type HymnCategory } from '../../constants/hymns';
import { getAppTheme } from '../../constants/theme';
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
  const [selectedCategory, setSelectedCategory] = useState<HymnCategory>('all');
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const { darkMode, fontScale } = useAppPreferences();
  const theme = getAppTheme(darkMode);

  const normalizedQuery = query.trim().toLowerCase();
  const hymns = HYMNS.filter(hymn => {
    const matchesCategory =
      selectedCategory === 'all' ? true : hymn.category === selectedCategory;
    const haystack = `${hymn.number} ${hymn.title} ${hymn.subtitle} ${hymn.opening}`.toLowerCase();
    const matchesQuery = normalizedQuery.length === 0 ? true : haystack.includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });

  const selectedCategoryLabel =
    HYMN_CATEGORIES.find(category => category.key === selectedCategory)?.label ?? 'ሁሉም መዝሙሮች';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
            የክርስቲያን አምልኮ መመሪያ
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.textMuted, fontSize: 12 * fontScale }]}>
            Christians worship guide
          </Text>
          <DividerMark />
        </View>

        <View style={styles.controlsRow}>
          <View style={[styles.searchShell, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Feather name="search" size={19} color={theme.textMuted} />
            <TextInput
              placeholder="ፈልግ..."
              placeholderTextColor={theme.textMuted}
              selectionColor={theme.accent}
              style={[styles.searchInput, { color: theme.text, fontSize: 16 * fontScale }]}
              value={query}
              onChangeText={setQuery}
            />
          </View>

          <View style={styles.filterWrap}>
            <Pressable
              onPress={() => setCategoryMenuOpen(open => !open)}
              style={[styles.filterButton, { backgroundColor: theme.control, borderColor: theme.border }]}
            >
              <Text style={[styles.filterLabel, { color: theme.text, fontSize: 13 * fontScale }]} numberOfLines={1}>
                {selectedCategoryLabel}
              </Text>
              <Ionicons
                name={categoryMenuOpen ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={theme.text}
              />
            </Pressable>

            {categoryMenuOpen ? (
              <View style={[styles.filterMenu, { backgroundColor: theme.control, borderColor: theme.border }]}>
                {HYMN_CATEGORIES.map(category => {
                  const active = category.key === selectedCategory;

                  return (
                    <Pressable
                      key={category.key}
                      onPress={() => {
                        setSelectedCategory(category.key);
                        setCategoryMenuOpen(false);
                      }}
                      style={[styles.filterMenuItem, active ? styles.filterMenuItemActive : null]}
                    >
                      <Text
                        style={[
                          styles.filterMenuText,
                          { color: active ? theme.accent : theme.textMuted, fontSize: 13 * fontScale },
                        ]}
                      >
                        {category.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
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

        <View style={[styles.listWrap, { borderTopColor: theme.divider, backgroundColor: theme.surface }]}>
          {hymns.map(hymn => (
            <Pressable
              key={hymn.id}
              onPress={() => router.push(`/hymn-book/${hymn.id}`)}
              style={[styles.hymnRow, { backgroundColor: theme.surfaceStrong, borderBottomColor: theme.divider }]}
            >
              <View style={styles.hymnNumberWrap}>
                <Text style={[styles.hymnNumber, { color: theme.accent, fontSize: 28 * fontScale }]}>{hymn.number}</Text>
              </View>

              <View style={styles.hymnTextWrap}>
                <Text style={[styles.hymnTitle, { color: theme.text, fontSize: 22 * fontScale }]}>{hymn.title}</Text>
                <Text style={[styles.hymnOpening, { color: theme.textMuted, fontSize: 13 * fontScale }]} numberOfLines={1}>
                  {hymn.opening}
                </Text>
              </View>

              <View style={[styles.hymnArrowWrap, { backgroundColor: theme.surface }]}>
                <Ionicons name="chevron-forward" size={18} color={theme.text} />
              </View>
            </Pressable>
          ))}

          {hymns.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.surfaceStrong, borderColor: theme.border }]}>
              <Feather name="search" size={22} color={theme.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>ምንም መዝሙር አልተገኘም</Text>
              <Text style={[styles.emptyDescription, { color: theme.textMuted }]}>
                የፍለጋ ቃልዎን ወይም ማጣሪያውን ይቀይሩ።
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#06164B',
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
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
  filterWrap: {
    width: 138,
    position: 'relative',
  },
  filterButton: {
    minHeight: 54,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.2)',
    backgroundColor: 'rgba(12, 32, 79, 0.72)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  filterLabel: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  filterMenu: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    borderRadius: 18,
    backgroundColor: 'rgba(7, 23, 63, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.16)',
    paddingVertical: 8,
    shadowColor: '#020617',
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  filterMenuItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterMenuItemActive: {
    backgroundColor: 'rgba(216, 162, 79, 0.12)',
  },
  filterMenuText: { fontSize: 13, fontWeight: '600' },
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
  listWrap: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.16)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    overflow: 'hidden',
  },
  hymnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.18)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  hymnNumberWrap: {
    width: 48,
  },
  hymnNumber: {
    color: '#D8A24F',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  hymnTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  hymnTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  hymnOpening: {
    color: '#CBD5E1',
    fontSize: 13,
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
