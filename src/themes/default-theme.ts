import type {ThemeSpec} from '../core/types';

export const defaultTheme: ThemeSpec = {
  name: 'signal',
  fonts: {
    display: '"Space Grotesk", "Avenir Next", sans-serif',
    body: '"Instrument Sans", "Segoe UI", sans-serif',
    mono: '"IBM Plex Mono", "SFMono-Regular", monospace',
  },
  colors: {
    background: '#07111f',
    surface: 'rgba(14, 27, 45, 0.86)',
    surfaceAlt: 'rgba(23, 39, 63, 0.92)',
    foreground: '#f3f7fb',
    muted: '#8aa1be',
    accent: '#4dd4ac',
    accentSoft: 'rgba(77, 212, 172, 0.15)',
    success: '#ffd166',
    border: 'rgba(166, 190, 214, 0.16)',
    codeBackground: '#08101b',
  },
  radii: {
    card: 28,
    pill: 999,
  },
  spacing: {
    pageX: 84,
    pageY: 72,
    stackGap: 24,
  },
  motion: {
    staggerFrames: 6,
    transitionSpring: {
      damping: 16,
      stiffness: 140,
      mass: 0.8,
    },
  },
};
