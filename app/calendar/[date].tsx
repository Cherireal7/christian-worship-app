import Feather from '@expo/vector-icons/Feather';
import dayjs from 'dayjs';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Share, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppPreferences } from '../../components/providers/app-preferences';
import { QuickNavMenu } from '../../components/ui/quick-nav-menu';
import { getDay, type LiturgicalDay } from '../../data/LiturgicalService';
import { getLiturgicalColorStyle } from '../../data/liturgicalColors';
import { getAppTheme } from '../../constants/theme';

function cleanLiturgicalText(text: string | null) {
  if (!text) {
    return null;
  }

  return text.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
}

function buildShareText(day: LiturgicalDay) {
  const primaryTitle =
    day.festivalTitle ||
    day.moveableFeast ||
    day.saintsDay ||
    day.weekName ||
    `${day.season}`;

  const dailyReadings = [
    day.dailyReadings.firstReading,
    day.dailyReadings.secondReading,
  ].filter((reading): reading is string => Boolean(reading));

  const sundayReadings = [
    day.propers.oldTestament,
    day.propers.epistle,
    day.propers.gospel,
  ].filter((reading): reading is string => Boolean(reading));

  const lines = [
    `${dayjs(day.date).format('MMMM D, YYYY')} • ${primaryTitle}`,
    `${day.season} • ${day.color}`,
  ];

  if (dailyReadings.length > 0) {
    lines.push(`የዕለቱ ንባቦች: ${dailyReadings.join(' • ')}`);
  }

  if ((day.isSunday || day.isFestival) && sundayReadings.length > 0) {
    lines.push(`Sunday Propers: ${sundayReadings.join(' • ')}`);
  }

  return lines.join('\n');
}

function Section({
  title,
  children,
  borderColor,
  backgroundColor,
  titleColor,
}: {
  title: string;
  children: React.ReactNode;
  borderColor: string;
  backgroundColor: string;
  titleColor: string;
}) {
  return (
    <View style={[styles.sectionCard, { borderColor, backgroundColor }]}>
      <Text style={[styles.sectionTitle, { color: titleColor }]}>{title}</Text>
      {children}
    </View>
  );
}

function ProperRow({
  label,
  value,
  accent,
  textColor,
}: {
  label: string;
  value: string | null;
  accent: string;
  textColor: string;
}) {
  if (!value) {
    return null;
  }

  return (
    <View style={styles.properRow}>
      <Text style={[styles.properLabel, { color: accent }]}>{label}</Text>
      <Text style={[styles.properValue, { color: textColor }]}>{value}</Text>
    </View>
  );
}

export default function CalendarDayDetailScreen() {
  const params = useLocalSearchParams<{ date?: string | string[] }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { darkMode, fontScale } = useAppPreferences();
  const isDark = typeof darkMode === 'boolean' ? darkMode : colorScheme === 'dark';
  const theme = getAppTheme(isDark);
  const rawDate = Array.isArray(params.date) ? params.date[0] : params.date;

  let day: LiturgicalDay | null = null;

  if (rawDate) {
    try {
      day = getDay(rawDate);
    } catch (error) {
      console.error('[calendar/detail] Failed to load day:', error);
      day = null;
    }
  }

  if (!day) {
    return (
      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.missingWrap}>
          <Text style={[styles.missingTitle, { color: theme.text }]}>የቀኑ መረጃ አልተገኘም</Text>
          <Pressable onPress={() => router.replace('/calendar')} style={styles.backButton}>
            <Text style={styles.backButtonText}>ወደ የዕለቱ ንባቦች ተመለስ</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const liturgicalColors = getLiturgicalColorStyle(day.color, isDark);
  const sectionBackground = isDark ? theme.surface : '#FFFFFF';
  const cleanedCollect = cleanLiturgicalText(day.propers.collect);
  const cleanedIntroit = cleanLiturgicalText(day.propers.introit);
  const previousDate = dayjs(day.date).subtract(1, 'day').format('YYYY-MM-DD');
  const nextDate = dayjs(day.date).add(1, 'day').format('YYYY-MM-DD');

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={[styles.contentContainer, { paddingBottom: Math.max(insets.bottom, 18) + 96 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <QuickNavMenu />
              <Pressable
                onPress={() => router.back()}
                style={[styles.headerButton, { backgroundColor: theme.control, borderColor: theme.border }]}
              >
                <Feather name="arrow-left" size={20} color={theme.text} />
              </Pressable>
            </View>
            <Text style={[styles.headerTitle, { color: theme.text, fontSize: 22 * fontScale }]}>
              የቀን ዝርዝር
            </Text>
            <View style={styles.headerButtonSpacer} />
          </View>

          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: liturgicalColors.background,
                borderColor: `${liturgicalColors.accent}55`,
              },
            ]}
          >
            <View style={styles.heroTopRow}>
              <View style={styles.heroMeta}>
                <View style={[styles.heroDot, { backgroundColor: liturgicalColors.accent }]} />
                <Text style={[styles.heroSeason, { color: liturgicalColors.accent, fontSize: 12 * fontScale }]}>
                  {day.season}
                </Text>
                <Text
                  style={[
                    styles.heroColorChip,
                    {
                      color: liturgicalColors.accent,
                      borderColor: `${liturgicalColors.accent}44`,
                      fontSize: 11 * fontScale,
                    },
                  ]}
                >
                  {day.color}
                </Text>
              </View>
              <Text style={[styles.heroDate, { color: liturgicalColors.text, fontSize: 13 * fontScale }]}>
                {dayjs(day.date).format('MMMM D, YYYY')}
              </Text>
            </View>

            {day.weekName ? (
              <Text style={[styles.heroWeekName, { color: liturgicalColors.text, fontSize: 22 * fontScale }]}>
                {day.weekName}
              </Text>
            ) : null}

            {day.festivalTitle || day.moveableFeast ? (
              <Text style={[styles.heroFestival, { color: liturgicalColors.accent, fontSize: 16 * fontScale }]}>
                {day.festivalTitle || day.moveableFeast}
              </Text>
            ) : null}

            {day.saintsDay ? (
              <Text style={[styles.heroSaint, { color: liturgicalColors.text, fontSize: 14 * fontScale }]}>
                {day.saintsDay}
              </Text>
            ) : null}
          </View>

          <View style={styles.navigationRow}>
            <Pressable
              onPress={() => router.replace(`/calendar/${previousDate}`)}
              style={[styles.navigationButton, { backgroundColor: theme.control, borderColor: theme.border }]}
            >
              <Feather name="chevron-left" size={18} color={theme.text} />
              <View style={styles.navigationCopy}>
                <Text style={[styles.navigationLabel, { color: theme.textMuted, fontSize: 11 * fontScale }]}>
                  ቀዳሚ ቀን
                </Text>
                <Text style={[styles.navigationDate, { color: theme.text, fontSize: 13 * fontScale }]}>
                  {dayjs(previousDate).format('MMM D')}
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => router.replace(`/calendar/${nextDate}`)}
              style={[styles.navigationButton, { backgroundColor: theme.control, borderColor: theme.border }]}
            >
              <View style={[styles.navigationCopy, styles.navigationCopyRight]}>
                <Text style={[styles.navigationLabel, { color: theme.textMuted, fontSize: 11 * fontScale }]}>
                  ቀጣይ ቀን
                </Text>
                <Text style={[styles.navigationDate, { color: theme.text, fontSize: 13 * fontScale }]}>
                  {dayjs(nextDate).format('MMM D')}
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={theme.text} />
            </Pressable>
          </View>

          {(day.isSunday || day.isFestival) && (
            <Section
              title="Sunday Propers"
              borderColor={theme.border}
              backgroundColor={sectionBackground}
              titleColor={theme.text}
            >
              <ProperRow label="Old Testament" value={day.propers.oldTestament} accent={liturgicalColors.accent} textColor={theme.text} />
              <ProperRow label="Epistle" value={day.propers.epistle} accent={liturgicalColors.accent} textColor={theme.text} />
              <ProperRow label="Gospel" value={day.propers.gospel} accent={liturgicalColors.accent} textColor={theme.text} />
              <ProperRow label="Collect" value={cleanedCollect} accent={liturgicalColors.accent} textColor={theme.textMuted} />
              <ProperRow label="Introit" value={cleanedIntroit} accent={liturgicalColors.accent} textColor={theme.textMuted} />
            </Section>
          )}

          {(day.dailyReadings.firstReading || day.dailyReadings.secondReading) && (
            <Section
              title="Daily Readings"
              borderColor={theme.border}
              backgroundColor={sectionBackground}
              titleColor={theme.text}
            >
              <ProperRow
                label="First Reading"
                value={day.dailyReadings.firstReading}
                accent={liturgicalColors.accent}
                textColor={theme.text}
              />
              <ProperRow
                label="Second Reading"
                value={day.dailyReadings.secondReading}
                accent={liturgicalColors.accent}
                textColor={theme.text}
              />
            </Section>
          )}
        </ScrollView>

        <Pressable
          onPress={() => {
            void Share.share({
              message: buildShareText(day),
              title: 'የዕለቱ ንባቦች',
            });
          }}
          style={[
            styles.shareButton,
            {
              bottom: Math.max(insets.bottom, 18) + 8,
              backgroundColor: theme.control,
              borderColor: theme.border,
            },
          ]}
        >
          <Feather name="share-2" size={20} color={theme.text} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  screen: { flex: 1 },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
    fontWeight: '800',
  },
  heroCard: {
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 14,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  heroDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  heroSeason: {
    fontWeight: '800',
  },
  heroColorChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontWeight: '800',
  },
  heroDate: {
    fontWeight: '700',
  },
  heroWeekName: {
    fontWeight: '800',
    marginBottom: 6,
  },
  heroFestival: {
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSaint: {
    fontWeight: '600',
    lineHeight: 22,
  },
  navigationRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  navigationButton: {
    flex: 1,
    minHeight: 58,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navigationCopy: {
    flex: 1,
    marginLeft: 8,
  },
  navigationCopyRight: {
    alignItems: 'flex-end',
    marginLeft: 0,
    marginRight: 8,
  },
  navigationLabel: {
    fontWeight: '700',
    marginBottom: 2,
  },
  navigationDate: {
    fontWeight: '800',
  },
  shareButton: {
    position: 'absolute',
    right: 18,
    width: 54,
    height: 54,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#020617',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 10,
  },
  properRow: {
    marginBottom: 12,
  },
  properLabel: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  properValue: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  missingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  missingTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 18,
  },
  backButton: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#1D4ED8',
  },
  backButtonText: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
});
