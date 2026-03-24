import {describe, expect, it} from 'vitest';
import {createTheme} from '@/themes/create-theme';

describe('createTheme', () => {
  it('merges partial overrides into the default theme tokens', () => {
    const theme = createTheme({
      name: 'custom',
      colors: {
        accent: '#ff6b57',
      },
      motion: {
        staggerFrames: 10,
      },
    });

    expect(theme.name).toBe('custom');
    expect(theme.colors.accent).toBe('#ff6b57');
    expect(theme.colors.background).toBeTypeOf('string');
    expect(theme.motion.staggerFrames).toBe(10);
    expect(theme.motion.transitionSpring.damping).toBeGreaterThan(0);
  });
});
