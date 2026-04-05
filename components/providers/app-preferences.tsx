import {
  AppState,
  type AppStateStatus,
} from 'react-native';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  cancelLiturgicalNotificationsAsync,
  syncLiturgicalNotificationsAsync,
} from '../../services/liturgical-notifications';
import { appStorage } from '../../services/app-storage';

type FontSize = 'small' | 'medium' | 'large';
export type FavoriteKind = 'hymn' | 'confession' | 'prayer';

export type FavoriteItem = {
  kind: FavoriteKind;
  id: string;
};

type StoredPreferences = {
  darkMode: boolean;
  fontSize: FontSize;
  notificationsEnabled: boolean;
  favorites: FavoriteItem[];
};

type AppPreferencesContextValue = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  fontSize: FontSize;
  fontScale: number;
  setFontSize: (value: FontSize) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
  favoriteItems: FavoriteItem[];
  isFavorite: (kind: FavoriteKind, id: string) => boolean;
  toggleFavorite: (kind: FavoriteKind, id: string) => void;
  hasHydrated: boolean;
};

const STORAGE_KEY = 'app_preferences_v1';

const FONT_SCALES: Record<FontSize, number> = {
  small: 0.92,
  medium: 1,
  large: 1.12,
};

const DEFAULT_PREFERENCES: StoredPreferences = {
  darkMode: true,
  fontSize: 'medium',
  notificationsEnabled: true,
  favorites: [],
};

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null);

export function AppPreferencesProvider({ children }: PropsWithChildren) {
  const [darkMode, setDarkMode] = useState(DEFAULT_PREFERENCES.darkMode);
  const [fontSize, setFontSize] = useState<FontSize>(DEFAULT_PREFERENCES.fontSize);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    DEFAULT_PREFERENCES.notificationsEnabled,
  );
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>(DEFAULT_PREFERENCES.favorites);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadPreferences() {
      try {
        const raw = await appStorage.getItem(STORAGE_KEY);
        if (!raw) {
          return;
        }

        const parsed = JSON.parse(raw) as Partial<StoredPreferences>;

        if (!active) {
          return;
        }

        if (typeof parsed.darkMode === 'boolean') {
          setDarkMode(parsed.darkMode);
        }

        if (
          parsed.fontSize === 'small' ||
          parsed.fontSize === 'medium' ||
          parsed.fontSize === 'large'
        ) {
          setFontSize(parsed.fontSize);
        }

        if (typeof parsed.notificationsEnabled === 'boolean') {
          setNotificationsEnabled(parsed.notificationsEnabled);
        }

        if (Array.isArray(parsed.favorites)) {
          const favorites = parsed.favorites.filter((item): item is FavoriteItem => {
            if (!item || typeof item !== 'object') {
              return false;
            }

            const candidate = item as Partial<FavoriteItem>;
            return (
              (candidate.kind === 'hymn' ||
                candidate.kind === 'confession' ||
                candidate.kind === 'prayer') &&
              typeof candidate.id === 'string'
            );
          });

          setFavoriteItems(favorites);
        }
      } catch (error) {
        console.error('[preferences] Failed to load preferences:', error);
      } finally {
        if (active) {
          setHasHydrated(true);
        }
      }
    }

    void loadPreferences();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const payload: StoredPreferences = {
      darkMode,
      fontSize,
      notificationsEnabled,
      favorites: favoriteItems,
    };

    void appStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [darkMode, favoriteItems, fontSize, hasHydrated, notificationsEnabled]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    let active = true;

    async function syncNotifications() {
      if (!notificationsEnabled) {
        await cancelLiturgicalNotificationsAsync();
        return;
      }

      const success = await syncLiturgicalNotificationsAsync();

      if (!success && active) {
        setNotificationsEnabled(false);
      }
    }

    void syncNotifications();

    return () => {
      active = false;
    };
  }, [hasHydrated, notificationsEnabled]);

  useEffect(() => {
    if (!hasHydrated || !notificationsEnabled) {
      return;
    }

    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        void syncLiturgicalNotificationsAsync();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [hasHydrated, notificationsEnabled]);

  const value = useMemo<AppPreferencesContextValue>(
    () => ({
      darkMode,
      setDarkMode,
      fontSize,
      fontScale: FONT_SCALES[fontSize],
      setFontSize,
      notificationsEnabled,
      setNotificationsEnabled,
      favoriteItems,
      isFavorite: (kind, id) =>
        favoriteItems.some(item => item.kind === kind && item.id === id),
      toggleFavorite: (kind, id) => {
        setFavoriteItems(current => {
          const exists = current.some(item => item.kind === kind && item.id === id);

          if (exists) {
            return current.filter(item => !(item.kind === kind && item.id === id));
          }

          return [...current, { kind, id }];
        });
      },
      hasHydrated,
    }),
    [darkMode, favoriteItems, fontSize, hasHydrated, notificationsEnabled],
  );

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>;
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);

  if (!context) {
    throw new Error('useAppPreferences must be used within AppPreferencesProvider');
  }

  return context;
}
