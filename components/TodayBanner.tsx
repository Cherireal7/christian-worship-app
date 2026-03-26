import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppPreferences } from './providers/app-preferences';
import { useLiturgical } from '../data/LiturgicalContext';
import { getAccentColor } from '../data/liturgicalColors';
import { getAppTheme } from '../constants/theme';

export function TodayBanner() {
  const { today, setSelectedDate } = useLiturgical();
  const { darkMode, fontScale } = useAppPreferences();
  const theme = getAppTheme(darkMode);

  if (!today) {
    return null;
  }

  const accent = getAccentColor(today.color);
  const title = today.festivalTitle || today.moveableFeast || today.weekName || today.season;
  const references = [today.dailyReadings.firstReading, today.dailyReadings.secondReading].filter(Boolean);

  return (
    <Pressable
      onPress={() => {
        setSelectedDate(today.date);
        router.push(`/calendar/${today.date}`);
      }}
      style={[
        styles.card,
        {
          backgroundColor: theme.surfaceStrong,
          borderColor: theme.border,
          borderLeftColor: accent,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <View style={styles.metaRow}>
            <View style={[styles.dot, { backgroundColor: accent }]} />
            <Text style={[styles.season, { color: accent, fontSize: 12 * fontScale }]}>
              {today.season}
            </Text>
            {today.weekName ? (
              <Text style={[styles.weekName, { color: theme.text, fontSize: 12 * fontScale }]}>
                {today.weekName}
              </Text>
            ) : null}
          </View>

          <Text style={[styles.title, { color: theme.text, fontSize: 17 * fontScale }]}>{title}</Text>

          {today.saintsDay ? (
            <Text style={[styles.subtitle, { color: theme.textMuted, fontSize: 13 * fontScale }]}>
              {today.saintsDay}
            </Text>
          ) : null}
        </View>

        <Ionicons name="chevron-forward" size={20} color={theme.text} />
      </View>

      {references.length > 0 ? (
        <Text style={[styles.references, { color: theme.textMuted, fontSize: 12 * fontScale }]}>
          {references.join('  •  ')}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderLeftWidth: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerCopy: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 999,
  },
  season: {
    fontWeight: '800',
  },
  weekName: {
    fontWeight: '700',
  },
  title: {
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontWeight: '600',
    lineHeight: 20,
  },
  references: {
    marginTop: 10,
    fontWeight: '600',
    lineHeight: 18,
  },
});
