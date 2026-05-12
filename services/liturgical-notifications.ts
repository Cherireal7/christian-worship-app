import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { Platform } from 'react-native';
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import { cancelScheduledNotificationAsync } from 'expo-notifications/build/cancelScheduledNotificationAsync';
import { scheduleNotificationAsync as scheduleExpoNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';

import { getDay, type LiturgicalDay } from '../data/LiturgicalService';

const NOTIFICATION_IDS_KEY = 'liturgical_notification_ids_v1';
const NOTIFICATION_CHANNEL_ID = 'liturgical-morning-reminders';

// Notification times
const MORNING_PRAYER_HOUR = 6;
const MORNING_PRAYER_MINUTE = 30;

const DAILY_READING_HOUR = 7;
const DAILY_READING_MINUTE = 0;

const NIGHT_PRAYER_HOUR = 21; // 9:00 PM
const NIGHT_PRAYER_MINUTE = 0;

const DAYS_TO_SCHEDULE = 21;

function buildTriggerDate(dateString: string, hour: number, minute: number) {
  const triggerDate = dayjs(dateString)
    .hour(hour)
    .minute(minute)
    .second(0)
    .millisecond(0);

  if (triggerDate.isBefore(dayjs())) {
    return null;
  }

  return triggerDate.toDate();
}

function joinParts(parts: Array<string | null | undefined>) {
  return parts.filter((value): value is string => Boolean(value && value.trim())).join(' • ');
}

/**
 * Builds a single consolidated daily notification that merges:
 * - Daily readings (first & second)
 * - Saints / festival day
 * - Sunday propers (if applicable)
 * All combined into one 7:00 AM notification.
 */
function buildConsolidatedDailyNotification(day: LiturgicalDay) {
  const parts: string[] = [];

  // Daily readings
  const readingBody = joinParts([
    day.dailyReadings.firstReading,
    day.dailyReadings.secondReading,
  ]);
  if (readingBody) {
    parts.push(readingBody);
  }

  // Saints / festivals
  const specialBody = joinParts([
    day.festivalTitle || day.moveableFeast,
    day.saintsDay,
  ]);
  if (specialBody) {
    parts.push(specialBody);
  }

  // Sunday propers
  if (day.isSunday) {
    const sundayBody = joinParts([
      day.propers.oldTestament,
      day.propers.epistle,
      day.propers.gospel,
    ]);
    if (sundayBody) {
      parts.push(sundayBody);
    }
  }

  if (parts.length === 0) {
    return null;
  }

  // Build a descriptive title
  let title = 'የዕለቱ ንባቦች';
  if (day.isSunday && day.weekName) {
    title = `የእሁድ ንባቦች · ${day.weekName}`;
  } else if (day.festivalTitle || day.moveableFeast) {
    title = day.festivalTitle || day.moveableFeast || title;
  }

  return {
    title,
    body: parts.join('\n'),
  };
}

function buildMorningPrayerNotification() {
  return {
    title: 'የጠዋት ጸሎት',
    body: 'የጠዋት ጸሎትዎን ጀምሩ።',
  };
}

function buildNightPrayerNotification() {
  return {
    title: 'የማታ ጸሎት',
    body: 'የምሽት ጸሎትዎን ጀምሩ።',
  };
}

async function getStoredNotificationIds() {
  const raw = await AsyncStorage.getItem(NOTIFICATION_IDS_KEY);

  if (!raw) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

async function storeNotificationIds(ids: string[]) {
  await AsyncStorage.setItem(NOTIFICATION_IDS_KEY, JSON.stringify(ids));
}

export async function cancelLiturgicalNotificationsAsync() {
  const ids = await getStoredNotificationIds();

  await Promise.all(
    ids.map(async id => {
      try {
        await cancelScheduledNotificationAsync(id);
      } catch {
        // Ignore stale identifiers.
      }
    }),
  );

  await AsyncStorage.removeItem(NOTIFICATION_IDS_KEY);
}

/** 
 * Type-safe check: reads `.granted` off any object at runtime.
 * Avoids relying on the broken TS inheritance chain in NotificationPermissionsStatus.
 */
function permissionGranted(result: object): boolean {
  return 'granted' in result && (result as { granted: boolean }).granted === true;
}

async function ensureNotificationsReadyAsync() {
  if (Platform.OS === 'android') {
    await setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: 'Liturgical reminders',
      importance: AndroidImportance.DEFAULT,
      vibrationPattern: [0, 150, 100, 150],
      lightColor: '#D8A24F',
    });
  }

  const existingPermissions = await getPermissionsAsync();

  if (permissionGranted(existingPermissions)) {
    return true;
  }

  const requestedPermissions = await requestPermissionsAsync();
  return permissionGranted(requestedPermissions);
}

async function scheduleAtAsync(
  dateString: string,
  hour: number,
  minute: number,
  content: { title: string; body: string },
  kind: string,
  deepLinkUrl?: string,
) {
  const triggerDate = buildTriggerDate(dateString, hour, minute);

  if (!triggerDate) {
    return null;
  }

  return scheduleExpoNotificationAsync({
    content: {
      title: content.title,
      body: content.body,
      sound: true,
      data: {
        url: deepLinkUrl ?? '/home',
        kind,
      },
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId: Platform.OS === 'android' ? NOTIFICATION_CHANNEL_ID : undefined,
    },
  });
}

export async function syncLiturgicalNotificationsAsync() {
  const hasPermission = await ensureNotificationsReadyAsync();

  if (!hasPermission) {
    await cancelLiturgicalNotificationsAsync();
    return false;
  }

  await cancelLiturgicalNotificationsAsync();

  const notificationIds: string[] = [];

  for (let offset = 0; offset < DAYS_TO_SCHEDULE; offset += 1) {
    const dateString = dayjs().add(offset, 'day').format('YYYY-MM-DD');
    const day = getDay(dateString);

    // 1. Morning Prayer — 6:30 AM
    const morningPrayer = buildMorningPrayerNotification();
    const morningId = await scheduleAtAsync(
      dateString,
      MORNING_PRAYER_HOUR,
      MORNING_PRAYER_MINUTE,
      morningPrayer,
      'morning-prayer',
    );
    if (morningId) {
      notificationIds.push(morningId);
    }

    // 2. Consolidated Daily Reading — 7:00 AM (readings + saints + Sunday propers)
    const dailyNotification = buildConsolidatedDailyNotification(day);
    if (dailyNotification) {
      const dailyId = await scheduleAtAsync(
        dateString,
        DAILY_READING_HOUR,
        DAILY_READING_MINUTE,
        dailyNotification,
        'daily-reading',
        `/calendar-detail/${day.date}`,
      );
      if (dailyId) {
        notificationIds.push(dailyId);
      }
    }

    // 3. Night Prayer — 9:00 PM
    const nightPrayer = buildNightPrayerNotification();
    const nightId = await scheduleAtAsync(
      dateString,
      NIGHT_PRAYER_HOUR,
      NIGHT_PRAYER_MINUTE,
      nightPrayer,
      'night-prayer',
    );
    if (nightId) {
      notificationIds.push(nightId);
    }
  }

  await storeNotificationIds(notificationIds);
  return true;
}
