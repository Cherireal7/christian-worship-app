import Feather from '@expo/vector-icons/Feather';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppPreferences } from '../../components/providers/app-preferences';
import { QuickNavMenu } from '../../components/ui/quick-nav-menu';
import { getHymnById } from '../../constants/hymns';
import { getAppTheme } from '../../constants/theme';

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

export default function HymnDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const hymn = params.id ? getHymnById(params.id) : undefined;
  const insets = useSafeAreaInsets();
  const [fontScale, setFontScale] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [textAlignMode, setTextAlignMode] = useState<'left' | 'center' | 'right'>('center');
  const { darkMode, fontScale: appFontScale } = useAppPreferences();
  const theme = getAppTheme(darkMode);

  if (!hymn) {
    return (
      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.missingWrap}>
          <Text style={[styles.missingTitle, { color: theme.text }]}>መዝሙሩ አልተገኘም</Text>
          <Pressable onPress={() => router.replace('/hymn-book')} style={styles.backHomeButton}>
            <Text style={styles.backHomeText}>ወደ መዝሙር መጽሐፍ ተመለስ</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const baseFontSize = 17 * appFontScale * fontScale;
  const baseLineHeight = 30 * appFontScale * fontScale;
  const nextAlignMode =
    textAlignMode === 'left' ? 'center' : textAlignMode === 'center' ? 'right' : 'left';
  const alignIcon =
    textAlignMode === 'left'
      ? 'align-left'
      : textAlignMode === 'center'
        ? 'align-center'
        : 'align-right';

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <QuickNavMenu />
              <Pressable
                onPress={() => router.back()}
                style={[styles.headerButton, { backgroundColor: theme.control, borderColor: theme.border }]}
              >
                <Feather name="arrow-left" size={23} color={theme.text} />
              </Pressable>
            </View>

            <Text style={[styles.headerTitle, { color: theme.text, fontSize: 22 * appFontScale }]} numberOfLines={1}>
              {hymn.title}
            </Text>

            <Pressable
              onPress={() => setFavorite(current => !current)}
              style={[styles.headerButton, { backgroundColor: theme.control, borderColor: theme.border }]}
            >
              <Feather
                name="heart"
                size={22}
                color={favorite ? theme.accent : theme.text}
              />
            </Pressable>
          </View>

          <DividerMark />

          <View style={[styles.readerCard, { backgroundColor: theme.surfaceStrong, borderColor: theme.border }]}>
            <Text style={[styles.hymnTitle, { color: theme.text, fontSize: 24 * appFontScale, lineHeight: 34 * appFontScale }]}>
              {hymn.title}
            </Text>

            <Text
              style={[
                styles.lyricsText,
                {
                  color: theme.text,
                  fontSize: baseFontSize,
                  lineHeight: baseLineHeight,
                  textAlign: textAlignMode,
                },
              ]}
            >
              {hymn.lyrics}
            </Text>
          </View>
        </ScrollView>

        <View style={[styles.bottomControls, { bottom: Math.max(insets.bottom, 10) }]}>
          <View style={[styles.leftControls, { backgroundColor: theme.control, borderColor: theme.border }]}>
            <Pressable onPress={() => router.replace('/hymn-book')} style={styles.controlButton}>
              <Feather name="menu" size={18} color={theme.text} />
            </Pressable>
            <Pressable
              onPress={() => setTextAlignMode(nextAlignMode)}
              style={[styles.controlButton, styles.controlButtonActive]}
            >
              <Feather name={alignIcon} size={18} color={theme.text} />
            </Pressable>
          </View>

          <View style={[styles.rightControls, { backgroundColor: theme.control, borderColor: theme.border }]}>
            <Pressable
              onPress={() => setFontScale(current => Math.max(0.9, Number((current - 0.1).toFixed(1))))}
              style={styles.typeButton}
            >
              <Text style={[styles.typeButtonText, { color: theme.text }]}>-</Text>
            </Pressable>
            <View style={styles.typePreview}>
              <Text style={[styles.typePreviewSmall, { color: theme.text }]}>A</Text>
              <Text style={[styles.typePreviewValue, { color: theme.textMuted }]}>
                {Math.round(appFontScale * fontScale * 100)}%
              </Text>
              <Text style={[styles.typePreviewLarge, { color: theme.text }]}>A</Text>
            </View>
            <Pressable
              onPress={() => setFontScale(current => Math.min(1.4, Number((current + 0.1).toFixed(1))))}
              style={styles.typeButton}
            >
              <Text style={[styles.typeButtonText, { color: theme.text }]}>+</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#06164B',
  },
  screen: {
    flex: 1,
    backgroundColor: '#06164B',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 22,
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
  readerCard: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(173, 208, 255, 0.2)',
    backgroundColor: 'rgba(71, 126, 206, 0.18)',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    shadowColor: '#020617',
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  hymnTitle: {
    color: '#F8FAFC',
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 34,
    fontWeight: '800',
    marginBottom: 18,
  },
  lyricsText: {
    color: '#F8FAFC',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  bottomControls: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 51, 108, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 51, 108, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  controlButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  typeButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeButtonText: {
    color: '#F8FAFC',
    fontSize: 22,
    lineHeight: 22,
    fontWeight: '500',
  },
  typePreview: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  typePreviewValue: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 3,
  },
  typePreviewSmall: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '500',
  },
  typePreviewLarge: {
    color: '#F8FAFC',
    fontSize: 28,
    lineHeight: 28,
    fontWeight: '500',
  },
  missingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  missingTitle: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 18,
  },
  backHomeButton: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#1D4ED8',
  },
  backHomeText: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
});
