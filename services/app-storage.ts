type StorageValue = string | null;

type StorageLike = {
  getItem: (key: string) => Promise<StorageValue>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const memoryStorage = new Map<string, string>();
let hasWarnedAboutFallback = false;

function warnAboutFallback(error: unknown) {
  if (hasWarnedAboutFallback) {
    return;
  }

  hasWarnedAboutFallback = true;
  console.warn('[storage] Falling back to temporary storage until the native app is rebuilt.', error);
}

function getNativeStorage(): StorageLike | null {
  try {
    const module = require('@react-native-async-storage/async-storage') as {
      default?: StorageLike;
    };

    return module.default ?? null;
  } catch (error) {
    warnAboutFallback(error);
    return null;
  }
}

function getWebStorage(): StorageLike | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  return {
    async getItem(key) {
      return window.localStorage.getItem(key);
    },
    async setItem(key, value) {
      window.localStorage.setItem(key, value);
    },
    async removeItem(key) {
      window.localStorage.removeItem(key);
    },
  };
}

const fallbackStorage: StorageLike = {
  async getItem(key) {
    return memoryStorage.get(key) ?? null;
  },
  async setItem(key, value) {
    memoryStorage.set(key, value);
  },
  async removeItem(key) {
    memoryStorage.delete(key);
  },
};

function resolveStorage() {
  return getNativeStorage() ?? getWebStorage() ?? fallbackStorage;
}

export const appStorage: StorageLike = {
  async getItem(key) {
    return resolveStorage().getItem(key);
  },
  async setItem(key, value) {
    return resolveStorage().setItem(key, value);
  },
  async removeItem(key) {
    return resolveStorage().removeItem(key);
  },
};
