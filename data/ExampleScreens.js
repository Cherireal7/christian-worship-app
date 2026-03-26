/**
 * ExampleScreens.js
 *
 * Drop-in example screens showing how to wire the lectionary module
 * into a React Native / Expo app.
 *
 * Screens included:
 *   1. TodayCard       — compact widget showing today's liturgical info
 *   2. CalendarScreen  — month grid with liturgical color dots
 *   3. DayDetailScreen — full propers, readings, saint's day for selected date
 *
 * These are standalone examples. Copy what you need into your own screens.
 */

import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, useColorScheme, SafeAreaView,
} from 'react-native';
import dayjs from 'dayjs';
import { useLiturgical } from './LiturgicalContext';
import { getLiturgicalColorStyle, getAccentColor, SEASON_ABBREVIATIONS } from './liturgicalColors';

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ─── TodayCard ────────────────────────────────────────────────────────────────
/**
 * Compact card for a home screen or dashboard.
 * Shows: season · week name · liturgical color · today's saint
 *
 * @example
 * <TodayCard />
 */
export function TodayCard() {
  const { today } = useLiturgical();
  const dark = useColorScheme() === 'dark';

  if (!today) return null;

  const colorStyle = getLiturgicalColorStyle(today.color, dark);

  return (
    <View style={[styles.card, { backgroundColor: colorStyle.background, borderLeftColor: colorStyle.accent, borderLeftWidth: 4 }]}>
      <View style={styles.cardRow}>
        <View style={[styles.colorDot, { backgroundColor: colorStyle.accent }]} />
        <Text style={[styles.seasonLabel, { color: colorStyle.accent }]}>
          {today.season.toUpperCase()}
        </Text>
        {today.weekName && (
          <Text style={[styles.weekLabel, { color: colorStyle.text }]}>
            {' · '}{today.weekName}
          </Text>
        )}
      </View>

      {(today.festivalTitle || today.moveableFeast) && (
        <Text style={[styles.festivalTitle, { color: colorStyle.accent }]}>
          {today.festivalTitle || today.moveableFeast}
        </Text>
      )}

      {today.saintsDay && (
        <Text style={[styles.saintsDay, { color: colorStyle.text }]}>
          ✦ {today.saintsDay}
        </Text>
      )}

      {today.dailyReadings.firstReading && (
        <View style={styles.readingRow}>
          <Text style={[styles.readingLabel, { color: colorStyle.text }]}>
            First Reading:
          </Text>
          <Text style={[styles.readingText, { color: colorStyle.text }]}>
            {' '}{today.dailyReadings.firstReading}
          </Text>
        </View>
      )}

      {today.dailyReadings.secondReading && (
        <View style={styles.readingRow}>
          <Text style={[styles.readingLabel, { color: colorStyle.text }]}>
            Second Reading:
          </Text>
          <Text style={[styles.readingText, { color: colorStyle.text }]}>
            {' '}{today.dailyReadings.secondReading}
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── CalendarScreen ───────────────────────────────────────────────────────────
/**
 * Month calendar grid with liturgical color indicators.
 * Tapping a day selects it and navigates to DayDetailScreen
 * (wire up navigation yourself — the example shows the pattern).
 *
 * @example
 * // In your navigator:
 * <Stack.Screen name="Calendar" component={CalendarScreen} />
 */
export function CalendarScreen({ navigation }) {
  const dark = useColorScheme() === 'dark';
  const {
    calendarGrid,
    selectedDate,
    setSelectedDate,
    selectedMonthLabel,
  } = useLiturgical();

  const today = dayjs().format('YYYY-MM-DD');

  function handlePrevMonth() {
    setSelectedDate(dayjs(selectedDate).subtract(1, 'month').toDate());
  }
  function handleNextMonth() {
    setSelectedDate(dayjs(selectedDate).add(1, 'month').toDate());
  }
  function handleDayPress(day) {
    setSelectedDate(day.date);
    navigation?.navigate('DayDetail');
  }

  return (
    <SafeAreaView style={[styles.screen, dark && styles.screenDark]}>
      {/* Month navigation header */}
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navBtn}>
          <Text style={[styles.navBtnText, dark && styles.textDark]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.monthLabel, dark && styles.textDark]}>{selectedMonthLabel}</Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.navBtn}>
          <Text style={[styles.navBtnText, dark && styles.textDark]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Day-of-week headers */}
      <View style={styles.dayHeaderRow}>
        {DAY_HEADERS.map(h => (
          <Text key={h} style={[styles.dayHeader, dark && styles.textMutedDark]}>{h}</Text>
        ))}
      </View>

      {/* Calendar grid */}
      {calendarGrid.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.calRow}>
          {row.map((day, colIdx) => {
            if (!day) {
              return <View key={colIdx} style={styles.calCell} />;
            }

            const isToday     = day.date === today;
            const isSelected  = day.date === dayjs(selectedDate).format('YYYY-MM-DD');
            const accent      = getAccentColor(day.color);
            const isSunday    = colIdx === 0;

            return (
              <TouchableOpacity
                key={colIdx}
                style={[
                  styles.calCell,
                  isSelected && { backgroundColor: accent + '30' },
                ]}
                onPress={() => handleDayPress(day)}
              >
                {/* Date number */}
                <View style={[
                  styles.dateCircle,
                  isToday && { backgroundColor: accent },
                ]}>
                  <Text style={[
                    styles.dateNum,
                    isSunday    && { color: accent },
                    isToday     && { color: '#fff' },
                    dark && !isToday && styles.textDark,
                  ]}>
                    {dayjs(day.date).date()}
                  </Text>
                </View>

                {/* Liturgical color dot */}
                <View style={[styles.colorDotSmall, { backgroundColor: accent }]} />

                {/* Festival / saint indicator */}
                {(day.festivalTitle || day.moveableFeast || day.saintsDay) && (
                  <View style={[styles.festivalDot, { backgroundColor: accent }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </SafeAreaView>
  );
}

// ─── DayDetailScreen ──────────────────────────────────────────────────────────
/**
 * Full liturgical detail for the selected day.
 * Shows: season/color, festival, saint, all propers, daily readings.
 *
 * @example
 * <Stack.Screen name="DayDetail" component={DayDetailScreen} />
 */
export function DayDetailScreen() {
  const dark = useColorScheme() === 'dark';
  const { selectedDay, selectedDateFormatted } = useLiturgical();

  if (!selectedDay) return null;

  const cs = getLiturgicalColorStyle(selectedDay.color, dark);

  return (
    <SafeAreaView style={[styles.screen, dark && styles.screenDark]}>
      <ScrollView contentContainerStyle={styles.detailScroll}>

        {/* Header */}
        <View style={[styles.detailHeader, { backgroundColor: cs.background, borderBottomColor: cs.accent, borderBottomWidth: 2 }]}>
          <View style={styles.cardRow}>
            <View style={[styles.colorDot, { backgroundColor: cs.accent }]} />
            <Text style={[styles.seasonLabel, { color: cs.accent }]}>
              {selectedDay.season.toUpperCase()}
            </Text>
            <Text style={[styles.colorChip, { borderColor: cs.accent, color: cs.accent }]}>
              {selectedDay.color}
            </Text>
          </View>
          <Text style={[styles.detailDate, { color: cs.text }]}>{selectedDateFormatted}</Text>
          {selectedDay.weekName && (
            <Text style={[styles.detailWeekName, { color: cs.accent }]}>
              {selectedDay.weekName}
            </Text>
          )}
          {(selectedDay.festivalTitle || selectedDay.moveableFeast) && (
            <Text style={[styles.festivalTitle, { color: cs.accent }]}>
              {selectedDay.festivalTitle || selectedDay.moveableFeast}
            </Text>
          )}
          {selectedDay.saintsDay && (
            <Text style={[styles.saintsDay, { color: cs.text }]}>
              ✦ {selectedDay.saintsDay}
            </Text>
          )}
        </View>

        {/* Sunday Propers */}
        {selectedDay.isSunday && (selectedDay.propers.gospel || selectedDay.propers.epistle) && (
          <Section title="Sunday Propers" accent={cs.accent} dark={dark}>
            <ProperRow label="Epistle"       value={selectedDay.propers.epistle}      accent={cs.accent} dark={dark} />
            <ProperRow label="Gospel"        value={selectedDay.propers.gospel}       accent={cs.accent} dark={dark} />
            <ProperRow label="Old Testament" value={selectedDay.propers.oldTestament} accent={cs.accent} dark={dark} />
            <ProperRow label="Collect"       value={selectedDay.propers.collect}      accent={cs.accent} dark={dark} multiline />
            <ProperRow label="Introit"       value={selectedDay.propers.introit}      accent={cs.accent} dark={dark} multiline />
            <ProperRow label="Gradual"       value={selectedDay.propers.gradual}      accent={cs.accent} dark={dark} multiline />
          </Section>
        )}

        {/* Festival Propers (non-Sunday festivals) */}
        {!selectedDay.isSunday && (selectedDay.propers.gospel || selectedDay.propers.epistle) && (
          <Section title="Festival Propers" accent={cs.accent} dark={dark}>
            <ProperRow label="Epistle"       value={selectedDay.propers.epistle}      accent={cs.accent} dark={dark} />
            <ProperRow label="Gospel"        value={selectedDay.propers.gospel}       accent={cs.accent} dark={dark} />
            <ProperRow label="Old Testament" value={selectedDay.propers.oldTestament} accent={cs.accent} dark={dark} />
            <ProperRow label="Collect"       value={selectedDay.propers.collect}      accent={cs.accent} dark={dark} multiline />
          </Section>
        )}

        {/* Daily Readings */}
        {(selectedDay.dailyReadings.firstReading || selectedDay.dailyReadings.secondReading) && (
          <Section title="Daily Readings" accent={cs.accent} dark={dark}>
            <ProperRow label="First Reading"  value={selectedDay.dailyReadings.firstReading}  accent={cs.accent} dark={dark} />
            <ProperRow label="Second Reading" value={selectedDay.dailyReadings.secondReading} accent={cs.accent} dark={dark} />
          </Section>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, accent, dark, children }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: accent }]}>{title}</Text>
      <View style={[styles.sectionDivider, { backgroundColor: accent }]} />
      {children}
    </View>
  );
}

function ProperRow({ label, value, accent, dark, multiline = false }) {
  if (!value) return null;
  // Strip HTML tags from liturgical text (introit/gradual may contain <b>, <i>, <br/>)
  const clean = String(value).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
  return (
    <View style={styles.properRow}>
      <Text style={[styles.properLabel, { color: accent }]}>{label}</Text>
      <Text style={[styles.properValue, dark && styles.textDark]} numberOfLines={multiline ? 0 : 2}>
        {clean}
      </Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen:             { flex: 1, backgroundColor: '#FAFAF8' },
  screenDark:         { backgroundColor: '#111110' },

  // TodayCard
  card:               { margin: 16, padding: 16, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  cardRow:            { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  colorDot:           { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  colorDotSmall:      { width: 5, height: 5, borderRadius: 3, marginTop: 2 },
  festivalDot:        { width: 4, height: 4, borderRadius: 2, marginTop: 1 },
  seasonLabel:        { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  weekLabel:          { fontSize: 13, fontWeight: '500' },
  festivalTitle:      { fontSize: 16, fontWeight: '700', marginTop: 4 },
  saintsDay:          { fontSize: 13, marginTop: 4, fontStyle: 'italic' },
  readingRow:         { flexDirection: 'row', marginTop: 6 },
  readingLabel:       { fontSize: 13, fontWeight: '600' },
  readingText:        { fontSize: 13 },

  // CalendarScreen
  monthHeader:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  monthLabel:         { fontSize: 18, fontWeight: '600', color: '#1A1A1A' },
  navBtn:             { padding: 8 },
  navBtnText:         { fontSize: 24, color: '#1A1A1A', lineHeight: 28 },
  dayHeaderRow:       { flexDirection: 'row', paddingHorizontal: 4, marginBottom: 4 },
  dayHeader:          { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '600', color: '#888', letterSpacing: 0.5 },
  calRow:             { flexDirection: 'row', paddingHorizontal: 4 },
  calCell:            { flex: 1, aspectRatio: 0.9, alignItems: 'center', paddingTop: 6, borderRadius: 8, margin: 1 },
  dateCircle:         { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  dateNum:            { fontSize: 14, fontWeight: '500', color: '#1A1A1A' },

  // DayDetailScreen
  detailScroll:       { paddingBottom: 40 },
  detailHeader:       { padding: 20, marginBottom: 8 },
  detailDate:         { fontSize: 14, marginTop: 4 },
  detailWeekName:     { fontSize: 20, fontWeight: '700', marginTop: 4 },
  colorChip:          { fontSize: 11, borderWidth: 1, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },

  // Sections
  section:            { margin: 16, marginBottom: 8 },
  sectionTitle:       { fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 },
  sectionDivider:     { height: 1, opacity: 0.3, marginBottom: 12 },
  properRow:          { marginBottom: 12 },
  properLabel:        { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 2 },
  properValue:        { fontSize: 15, lineHeight: 22, color: '#1A1A1A' },

  // Dark mode text
  textDark:           { color: '#E8E6DF' },
  textMutedDark:      { color: '#888' },
});
