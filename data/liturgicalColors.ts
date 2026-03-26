export type LiturgicalPalette = {
  accent: string;
  accentLight: string;
  background: string;
  backgroundDark: string;
  text: string;
  textDark: string;
  label: string;
};

export const COLORS: Record<string, LiturgicalPalette> = {
  Violet: {
    accent: '#6B3FA0',
    accentLight: '#9B6CC8',
    background: '#F3EEF9',
    backgroundDark: '#1E1228',
    text: '#3D1F6B',
    textDark: '#D4B8F0',
    label: 'Violet',
  },
  Blue: {
    accent: '#1E5FA8',
    accentLight: '#4A8FD4',
    background: '#EBF3FB',
    backgroundDark: '#0E2A45',
    text: '#0D3A6E',
    textDark: '#A8CCF0',
    label: 'Blue',
  },
  White: {
    accent: '#C8A84B',
    accentLight: '#E0C97A',
    background: '#FDFAF0',
    backgroundDark: '#2A2410',
    text: '#5A4A1A',
    textDark: '#F0DC9A',
    label: 'White',
  },
  Red: {
    accent: '#B52020',
    accentLight: '#D95050',
    background: '#FDF0F0',
    backgroundDark: '#2D0A0A',
    text: '#7A0F0F',
    textDark: '#F0A0A0',
    label: 'Red',
  },
  Scarlet: {
    accent: '#8B0000',
    accentLight: '#C43030',
    background: '#FAF0F0',
    backgroundDark: '#280808',
    text: '#5C0000',
    textDark: '#E89090',
    label: 'Scarlet',
  },
  Green: {
    accent: '#2E7D4F',
    accentLight: '#5AAD78',
    background: '#EEF8F2',
    backgroundDark: '#0E2A1A',
    text: '#1A4D30',
    textDark: '#90D8AA',
    label: 'Green',
  },
  Black: {
    accent: '#222222',
    accentLight: '#555555',
    background: '#F5F5F5',
    backgroundDark: '#111111',
    text: '#111111',
    textDark: '#CCCCCC',
    label: 'Black',
  },
};

const FALLBACK = COLORS.Green;

export function getLiturgicalColorStyle(colorName: string, darkMode = false) {
  const palette = COLORS[colorName] ?? FALLBACK;

  return {
    accent: palette.accent,
    accentLight: palette.accentLight,
    background: darkMode ? palette.backgroundDark : palette.background,
    text: darkMode ? palette.textDark : palette.text,
    label: palette.label,
  };
}

export function getAccentColor(colorName: string): string {
  return (COLORS[colorName] ?? FALLBACK).accent;
}

export const SEASON_ABBREVIATIONS: Record<string, string> = {
  Advent: 'ADV',
  Christmas: 'CHR',
  Epiphany: 'EPI',
  'Pre-Lent': 'PRL',
  Lent: 'LNT',
  'Holy Week': 'HW',
  Easter: 'EAS',
  Pentecost: 'PEN',
  Trinity: 'TRI',
  'End of Church Year': 'ECY',
  Ordinary: 'ORD',
};
