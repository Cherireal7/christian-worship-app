type NotificationData = {
  url?: unknown;
  [key: string]: unknown;
};

export type NotificationResponseLike = {
  notification: {
    request: {
      identifier: string;
      content: {
        data?: NotificationData;
      };
    };
  };
};

type NotificationSubscriptionLike = {
  remove: () => void;
};

type NotificationHandlerLike = {
  handleNotification: () => Promise<{
    shouldShowBanner: boolean;
    shouldShowList: boolean;
    shouldPlaySound: boolean;
    shouldSetBadge: boolean;
  }>;
};

type NotificationModules = {
  addNotificationResponseReceivedListener: (
    listener: (response: NotificationResponseLike) => void,
  ) => NotificationSubscriptionLike;
  cancelScheduledNotificationAsync: (identifier: string) => Promise<void>;
  getLastNotificationResponseAsync: () => Promise<NotificationResponseLike | null>;
  getPermissionsAsync: () => Promise<{ granted: boolean }>;
  requestPermissionsAsync: () => Promise<{ granted: boolean }>;
  scheduleNotificationAsync: (request: unknown) => Promise<string>;
  setNotificationChannelAsync: (channelId: string, channel: unknown) => Promise<unknown>;
  setNotificationHandler: (handler: NotificationHandlerLike | null) => void;
};

export const ANDROID_IMPORTANCE_DEFAULT = 5;
const DATE_TRIGGER_TYPE = 'date';

let hasWarnedAboutNotifications = false;

function warnAboutMissingNotifications(error: unknown) {
  if (hasWarnedAboutNotifications) {
    return;
  }

  hasWarnedAboutNotifications = true;
  console.warn(
    '[notifications] Expo notifications native module is unavailable until the app is rebuilt.',
    error,
  );
}

function loadNotificationsModules(): NotificationModules | null {
  try {
    const emitter = require('expo-notifications/build/NotificationsEmitter') as {
      addNotificationResponseReceivedListener: NotificationModules['addNotificationResponseReceivedListener'];
      getLastNotificationResponseAsync: NotificationModules['getLastNotificationResponseAsync'];
    };
    const handler = require('expo-notifications/build/NotificationsHandler') as {
      setNotificationHandler: NotificationModules['setNotificationHandler'];
    };
    const permissions = require('expo-notifications/build/NotificationPermissions') as {
      getPermissionsAsync: NotificationModules['getPermissionsAsync'];
      requestPermissionsAsync: NotificationModules['requestPermissionsAsync'];
    };
    const channel = require('expo-notifications/build/setNotificationChannelAsync') as {
      setNotificationChannelAsync: NotificationModules['setNotificationChannelAsync'];
    };
    const scheduler = require('expo-notifications/build/scheduleNotificationAsync') as {
      scheduleNotificationAsync: NotificationModules['scheduleNotificationAsync'];
    };
    const canceler = require('expo-notifications/build/cancelScheduledNotificationAsync') as {
      cancelScheduledNotificationAsync: NotificationModules['cancelScheduledNotificationAsync'];
    };

    return {
      addNotificationResponseReceivedListener: emitter.addNotificationResponseReceivedListener,
      cancelScheduledNotificationAsync: canceler.cancelScheduledNotificationAsync,
      getLastNotificationResponseAsync: emitter.getLastNotificationResponseAsync,
      getPermissionsAsync: permissions.getPermissionsAsync,
      requestPermissionsAsync: permissions.requestPermissionsAsync,
      scheduleNotificationAsync: scheduler.scheduleNotificationAsync,
      setNotificationChannelAsync: channel.setNotificationChannelAsync,
      setNotificationHandler: handler.setNotificationHandler,
    };
  } catch (error) {
    warnAboutMissingNotifications(error);
    return null;
  }
}

export function notificationsAreAvailable() {
  return loadNotificationsModules() !== null;
}

export function setNotificationHandlerSafe(handler: NotificationHandlerLike | null) {
  loadNotificationsModules()?.setNotificationHandler(handler);
}

export async function getLastNotificationResponseAsyncSafe() {
  const notifications = loadNotificationsModules();
  return notifications ? notifications.getLastNotificationResponseAsync() : null;
}

export function addNotificationResponseReceivedListenerSafe(
  listener: (response: NotificationResponseLike) => void,
): NotificationSubscriptionLike {
  const notifications = loadNotificationsModules();

  if (!notifications) {
    return {
      remove() {},
    };
  }

  return notifications.addNotificationResponseReceivedListener(listener);
}

export async function getPermissionsAsyncSafe() {
  const notifications = loadNotificationsModules();
  return notifications ? notifications.getPermissionsAsync() : { granted: false };
}

export async function requestPermissionsAsyncSafe() {
  const notifications = loadNotificationsModules();
  return notifications ? notifications.requestPermissionsAsync() : { granted: false };
}

export async function setNotificationChannelAsyncSafe(channelId: string, channel: unknown) {
  const notifications = loadNotificationsModules();
  return notifications ? notifications.setNotificationChannelAsync(channelId, channel) : null;
}

export async function scheduleNotificationAsyncSafe(request: unknown) {
  const notifications = loadNotificationsModules();
  return notifications ? notifications.scheduleNotificationAsync(request) : null;
}

export async function cancelScheduledNotificationAsyncSafe(identifier: string) {
  const notifications = loadNotificationsModules();

  if (!notifications) {
    return;
  }

  await notifications.cancelScheduledNotificationAsync(identifier);
}

export function createDateTrigger(date: Date, channelId?: string) {
  return {
    type: DATE_TRIGGER_TYPE,
    date,
    channelId,
  };
}
