import { createContext, type PropsWithChildren, useContext, useState } from 'react';

type FontSize = 'small' | 'medium' | 'large';

type AppPreferencesContextValue = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  fontSize: FontSize;
  fontScale: number;
  setFontSize: (value: FontSize) => void;
};

const FONT_SCALES: Record<FontSize, number> = {
  small: 0.92,
  medium: 1,
  large: 1.12,
};

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null);

export function AppPreferencesProvider({ children }: PropsWithChildren) {
  const [darkMode, setDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState<FontSize>('medium');

  return (
    <AppPreferencesContext.Provider
      value={{
        darkMode,
        setDarkMode,
        fontSize,
        fontScale: FONT_SCALES[fontSize],
        setFontSize,
      }}
    >
      {children}
    </AppPreferencesContext.Provider>
  );
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);

  if (!context) {
    throw new Error('useAppPreferences must be used within AppPreferencesProvider');
  }

  return context;
}
