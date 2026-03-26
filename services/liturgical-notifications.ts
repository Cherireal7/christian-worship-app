import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { Platform } from 'react-native';
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import { cancelScheduledNotificationAsync } from 'expo-notifications/build/cancelScheduledNotificationAsync';
import { scheduleNotificationAsync as scheduleExpoNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';

import { getDay, type LiturgicalDay } from '../data/LiturgicalService';

const NOTIFICATION_IDS_KEY = 'liturgical_notification_ids_v1';
const NOTIFICATION_CHANNEL_ID = 'liturgical-morning-reminders';
const MORNING_HOUR = 7;
const DAILY_READING_MINUTE = 0;
const SPECIAL_DAY_MINUTE = 5;
const SUNDAY_READING_MINUTE = 10;
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

function buildDailyReadingNotification(day: LiturgicalDay) {
  const body = joinParts([
    day.dailyReadings.firstReading,
    day.dailyReadings.secondReading,
  ]);

  if (!body) {
    return null;
  }

  return {
    title: 'የዕለቱ ንባቦች',
    body,
  };
}

function buildSpecialDayNotification(day: LiturgicalDay) {
  const title = day.festivalTitle || day.moveableFeast || day.saintsDay;

  if (!title) {
    return null;
  }

  return {
    title: 'የቅዱሳን እና በዓላት ማስታወሻ',
    body: joinParts([
      day.festivalTitle || day.moveableFeast,
      day.saintsDay,
    ]) || title,
  };
}

function buildSundayReadingNotification(day: LiturgicalDay) {
  if (!day.isSunday) {
    return null;
  }

  const body = joinParts([
    day.propers.oldTestament,
    day.propers.epistle,
    day.propers.gospel,
  ]);

  if (!body) {
    return null;
  }

  return {
    title: `የእሁድ ንባቦች${day.weekName ? ` · ${day.weekName}` : ''}`,
    body,
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

  if (existingPermissions.granted) {
    return true;
  }

  const requestedPermissions = await requestPermissionsAsync();
  return requestedPermissions.granted;
}

async function scheduleNotificationAsync(
  day: LiturgicalDay,
  minute: number,
  content: { title: string; body: string | null },
  kind: 'daily' | 'special' | 'sunday',
) {
  const triggerDate = buildTriggerDate(day.date, MORNING_HOUR, minute);

  if (!triggerDate) {
    return null;
  }

  return scheduleExpoNotificationAsync({
    content: {
      title: content.title,
      body: content.body ?? 'የቀኑን ዝርዝር ለማየት ይክፈቱ።',
      sound: true,
      data: {
        url: `/calendar/${day.date}`,
        date: day.date,
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

    const dailyNotification = buildDailyReadingNotification(day);
    if (dailyNotification) {
      const id = await scheduleNotificationAsync(day, DAILY_READING_MINUTE, dailyNotification, 'daily');
      if (id) {
        notificationIds.push(id);
      }
    }

    const specialNotification = buildSpecialDayNotification(day);
    if (specialNotification) {
      const id = await scheduleNotificationAsync(day, SPECIAL_DAY_MINUTE, specialNotification, 'special');
      if (id) {
        notificationIds.push(id);
      }
    }

    const sundayNotification = buildSundayReadingNotification(day);
    if (sundayNotification) {
      const id = await scheduleNotificationAsync(day, SUNDAY_READING_MINUTE, sundayNotification, 'sunday');
      if (id) {
        notificationIds.push(id);
      }
    }
  }

  await storeNotificationIds(notificationIds);
  return true;
}
