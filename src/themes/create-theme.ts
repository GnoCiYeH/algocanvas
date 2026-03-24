import type {ThemeSpec} from '../core/types';
import {defaultTheme} from './default-theme';

type ThemeOverride = {
  name?: string;
  fonts?: Partial<ThemeSpec['fonts']>;
  colors?: Partial<ThemeSpec['colors']>;
  radii?: Partial<ThemeSpec['radii']>;
  spacing?: Partial<ThemeSpec['spacing']>;
  motion?: Partial<ThemeSpec['motion']> & {
    transitionSpring?: Partial<ThemeSpec['motion']['transitionSpring']>;
  };
};

export const createTheme = (override: ThemeOverride = {}): ThemeSpec => {
  return {
    ...defaultTheme,
    ...override,
    fonts: {
      ...defaultTheme.fonts,
      ...override.fonts,
    },
    colors: {
      ...defaultTheme.colors,
      ...override.colors,
    },
    radii: {
      ...defaultTheme.radii,
      ...override.radii,
    },
    spacing: {
      ...defaultTheme.spacing,
      ...override.spacing,
    },
    motion: {
      ...defaultTheme.motion,
      ...override.motion,
      transitionSpring: {
        ...defaultTheme.motion.transitionSpring,
        ...override.motion?.transitionSpring,
      },
    },
    name: override.name ?? defaultTheme.name,
  };
};
