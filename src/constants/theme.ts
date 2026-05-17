import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#251E14',
    background: '#FEFAF4',
    backgroundElement: '#F1EDE5',
    backgroundSelected: '#E6E1D8',
    textSecondary: '#6A6052',
    primary: '#EEC234',
    accent: '#D06A35',
    success: '#25A05A',
    warning: '#DFB030',
    destructive: '#C13D2A',
    card: '#FFFFFF',
    border: '#E6E1D8',
  },
  dark: {
    text: '#F4F0EB',
    background: '#1E1910',
    backgroundElement: '#31271B',
    backgroundSelected: '#3D3428',
    textSecondary: '#9E9891',
    primary: '#EEC234',
    accent: '#D06A35',
    success: '#1F8444',
    warning: '#C29420',
    destructive: '#9E2B1F',
    card: '#261E14',
    border: '#3D3428',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-sans)',
    serif: 'serif',
    rounded: 'normal',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
