export type AppTheme = {
  background: string;
  surface: string;
  surfaceStrong: string;
  text: string;
  textMuted: string;
  divider: string;
  accent: string;
  border: string;
  control: string;
};

export function getAppTheme(darkMode: boolean): AppTheme {
  if (darkMode) {
    return {
      background: '#06164B',
      surface: 'rgba(9, 31, 88, 0.72)',
      surfaceStrong: 'rgba(12, 40, 108, 0.9)',
      text: '#F8FAFC',
      textMuted: '#CBD5E1',
      divider: 'rgba(203, 213, 225, 0.22)',
      accent: '#D8A24F',
      border: 'rgba(120, 162, 224, 0.18)',
      control: 'rgba(8, 27, 78, 0.98)',
    };
  }

  return {
    background: '#E7EEF9',
    surface: 'rgba(255, 255, 255, 0.82)',
    surfaceStrong: 'rgba(255, 255, 255, 0.94)',
    text: '#10244D',
    textMuted: '#49607F',
    divider: 'rgba(16, 36, 77, 0.14)',
    accent: '#C4872E',
    border: 'rgba(54, 96, 160, 0.14)',
    control: 'rgba(255, 255, 255, 0.96)',
  };
}
