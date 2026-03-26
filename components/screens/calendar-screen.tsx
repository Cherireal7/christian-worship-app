import Feather from '@expo/vector-icons/Feather';
import dayjs from 'dayjs';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Calendar from 'react-native-calendars/src/calendar';
import type { DateData } from 'react-native-calendars/src/types';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TodayBanner } from '../TodayBanner';
import { useAppPreferences } from '../providers/app-preferences';
import { QuickNavMenu } from '../ui/quick-nav-menu';
import { useLiturgical } from '../../data/LiturgicalContext';
import { getAccentColor, getLiturgicalColorStyle } from '../../data/liturgicalColors';
import { getAppTheme } from '../../constants/theme';

type MarkedDate = {
  dots: Array<{ key: string; color: string }>;
  marked?: boolean;
  selected?: boolean;
  selectedColor?: string;
  selectedTextColor?: string;
};

function cleanLiturgicalText(text: string | null) {
  if (!text) {
    return null;
  }

  return text.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
}

function ReadingRow({
  label,
  value,
  color,
  textColor,
  fontScale,
}: {
  label: string;
  value: string | null;
  color: string;
  textColor: string;
  fontScale: number;
}) {
  if (!value) {
    return null;
  }

  return (
    <View style={styles.readingRow}>
      <Text style={[styles.readingLabel, { color, fontSize: 13 * fontScale }]}>{label}</Text>
      <Text style={[styles.readingValue, { color: textColor, fontSize: 14 * fontScale }]}>
        {value}
      </Text>
    </View>
  );
}

export function CalendarScreen() {
  const { darkMode, fontScale } = useAppPreferences();
  const theme = getAppTheme(darkMode);
  const {
    calendarGrid,
    selectedDate,
    selectedDay,
    selectedDateFormatted,
    selectedMonthLabel,
    setSelectedDate,
    today,
  } = useLiturgical();

  const selectedDateKey = dayjs(selectedDate).format('YYYY-MM-DD');
  const selectedAccent = selectedDay ? getAccentColor(selectedDay.color) : theme.accent;
  const liturgicalColorStyle = selectedDay
    ? getLiturgicalColorStyle(selectedDay.color, darkMode)
    : getLiturgicalColorStyle('Green', darkMode);

  const markedDates = useMemo<Record<string, MarkedDate>>(() => {
    const nextMarkedDates: Record<string, MarkedDate> = {};

    calendarGrid.flat().forEach(day => {
      if (!day) {
        return;
      }

      const accent = getAccentColor(day.color);
      const dots = [{ key: 'liturgical', color: accent }];

      if (day.saintsDay || day.festivalTitle || day.moveableFeast) {
        dots.push({ key: 'special', color: '#888' });
      }

      nextMarkedDates[day.date] = {
        dots,
        marked: dots.length > 0,
      };
    });

    if (today) {
      const accent = getAccentColor(today.color);
      nextMarkedDates[today.date] = {
        ...(nextMarkedDates[today.date] ?? { dots: [] }),
        selected: true,
        selectedColor: accent,
        selectedTextColor: '#FFFFFF',
      };
    }

    if (selectedDateKey !== today?.date) {
      nextMarkedDates[selectedDateKey] = {
        ...(nextMarkedDates[selectedDateKey] ?? { dots: [] }),
        selected: true,
        selectedColor: darkMode ? '#14336C' : '#DCE7F8',
        selectedTextColor: theme.text,
      };
    }

    return nextMarkedDates;
  }, [calendarGrid, darkMode, selectedDateKey, theme.text, today]);

  const handleDayPress = ({ dateString }: DateData) => {
    setSelectedDate(dateString);
    router.push(`/calendar/${dateString}`);
  };

  const handleMonthChange = ({ year, month }: DateData) => {
    setSelectedDate(new Date(year, month - 1, 1));
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <QuickNavMenu />
          <Pressable
            onPress={() => router.push('/settings')}
            style={[styles.headerButton, { backgroundColor: theme.control, borderColor: theme.border }]}
          >
            <Feather name="settings" size={18} color={theme.text} />
          </Pressable>
        </View>

        <Text style={[styles.screenTitle, { color: theme.text, fontSize: 24 * fontScale }]}>
          የዕለቱ ንባቦች
        </Text>
        <Text style={[styles.screenSubtitle, { color: theme.textMuted, fontSize: 13 * fontScale }]}>
          Liturgical calendar, saints, and appointed readings
        </Text>

        <TodayBanner />

        <View style={[styles.calendarShell, { backgroundColor: theme.surfaceStrong, borderColor: theme.border }]}>
          <View style={styles.monthHeader}>
            <View>
              <Text style={[styles.monthLabel, { color: theme.text, fontSize: 20 * fontScale }]}>
                {selectedMonthLabel}
              </Text>
              <Text style={[styles.monthHint, { color: theme.textMuted, fontSize: 12 * fontScale }]}>
                ቀን ይምረጡ እና ዝርዝሩን ይመልከቱ
              </Text>
            </View>
            <Pressable
              onPress={() => {
                if (today) {
                  setSelectedDate(today.date);
                  router.push(`/calendar/${today.date}`);
                }
              }}
              style={[styles.todayButton, { backgroundColor: theme.control, borderColor: theme.border }]}
            >
              <Text style={[styles.todayButtonText, { color: theme.text, fontSize: 12 * fontScale }]}>
                Today
              </Text>
            </Pressable>
          </View>

          <Calendar
            current={selectedDateKey}
            onDayPress={handleDayPress}
            onMonthChange={handleMonthChange}
            markingType="multi-dot"
            markedDates={markedDates}
            enableSwipeMonths
            firstDay={0}
            theme={{
              calendarBackground: 'transparent',
              monthTextColor: theme.text,
              textMonthFontWeight: '800',
              textMonthFontSize: 18 * fontScale,
              arrowColor: selectedAccent,
              dayTextColor: theme.text,
              textDisabledColor: theme.textMuted,
              todayTextColor: '#FFFFFF',
              textDayFontSize: 15 * fontScale,
              textDayHeaderFontSize: 12 * fontScale,
              textDayFontWeight: '600',
              textDayHeaderFontWeight: '700',
            }}
            style={styles.calendar}
          />
        </View>

        {selectedDay ? (
          <View style={[styles.detailCard, { backgroundColor: theme.surfaceStrong, borderColor: theme.border }]}>
            <View style={styles.detailHeader}>
              <View style={styles.detailTitleWrap}>
                <View style={styles.detailMetaRow}>
                  <View style={[styles.accentDot, { backgroundColor: selectedAccent }]} />
                  <Text style={[styles.detailSeason, { color: selectedAccent, fontSize: 12 * fontScale }]}>
                    {selectedDay.season}
                  </Text>
                </View>
                <Text style={[styles.detailDate, { color: theme.text, fontSize: 18 * fontScale }]}>
                  {selectedDateFormatted}
                </Text>
                <Text style={[styles.detailHeading, { color: liturgicalColorStyle.text, fontSize: 15 * fontScale }]}>
                  {selectedDay.festivalTitle || selectedDay.moveableFeast || selectedDay.weekName || 'Daily Office'}
                </Text>
                {selectedDay.saintsDay ? (
                  <Text style={[styles.detailSubheading, { color: theme.textMuted, fontSize: 13 * fontScale }]}>
                    {selectedDay.saintsDay}
                  </Text>
                ) : null}
              </View>

              <Pressable
                onPress={() => router.push(`/calendar/${selectedDay.date}`)}
                style={[styles.openButton, { borderColor: selectedAccent }]}
              >
                <Text style={[styles.openButtonText, { color: selectedAccent, fontSize: 12 * fontScale }]}>
                  Open
                </Text>
              </Pressable>
            </View>

            <View style={[styles.readingsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.text, fontSize: 16 * fontScale }]}>
                Daily Readings
              </Text>
              <ReadingRow
                label="First Reading"
                value={selectedDay.dailyReadings.firstReading}
                color={selectedAccent}
                textColor={theme.text}
                fontScale={fontScale}
              />
              <ReadingRow
                label="Second Reading"
                value={selectedDay.dailyReadings.secondReading}
                color={selectedAccent}
                textColor={theme.text}
                fontScale={fontScale}
              />
            </View>

            {selectedDay.isSunday || selectedDay.isFestival ? (
              <View style={[styles.readingsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.text, fontSize: 16 * fontScale }]}>
                  Sunday Propers
                </Text>
                <ReadingRow
                  label="Old Testament"
                  value={selectedDay.propers.oldTestament}
                  color={selectedAccent}
                  textColor={theme.text}
                  fontScale={fontScale}
                />
                <ReadingRow
                  label="Epistle"
                  value={selectedDay.propers.epistle}
                  color={selectedAccent}
                  textColor={theme.text}
                  fontScale={fontScale}
                />
                <ReadingRow
                  label="Gospel"
                  value={selectedDay.propers.gospel}
                  color={selectedAccent}
                  textColor={theme.text}
                  fontScale={fontScale}
                />
                <ReadingRow
                  label="Collect"
                  value={cleanLiturgicalText(selectedDay.propers.collect)}
                  color={selectedAccent}
                  textColor={theme.textMuted}
                  fontScale={fontScale}
                />
              </View>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  screenTitle: {
    fontWeight: '800',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  calendarShell: {
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
    marginBottom: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 12,
  },
  monthLabel: {
    fontWeight: '800',
    marginBottom: 2,
  },
  monthHint: {
    fontWeight: '600',
  },
  todayButton: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  todayButtonText: {
    fontWeight: '800',
  },
  calendar: {
    borderRadius: 18,
  },
  detailCard: {
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  detailTitleWrap: {
    flex: 1,
  },
  detailMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  accentDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  detailSeason: {
    fontWeight: '800',
  },
  detailDate: {
    fontWeight: '800',
    marginBottom: 4,
  },
  detailHeading: {
    fontWeight: '700',
    marginBottom: 4,
  },
  detailSubheading: {
    fontWeight: '600',
    lineHeight: 20,
  },
  openButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  openButtonText: {
    fontWeight: '800',
  },
  readingsCard: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 10,
  },
  sectionTitle: {
    fontWeight: '800',
    marginBottom: 10,
  },
  readingRow: {
    marginBottom: 10,
  },
  readingLabel: {
    fontWeight: '800',
    marginBottom: 4,
  },
  readingValue: {
    fontWeight: '600',
    lineHeight: 22,
  },
});
