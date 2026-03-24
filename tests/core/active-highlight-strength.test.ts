import {describe, expect, it} from 'vitest';
import {resolveArrayItemStyle} from '@/visualizers/array-state-style';
import {defaultTheme} from '@/themes/default-theme';
import type {ArrayItemStateStyleSpec} from '@/core/types';

describe('array style resolution', () => {
  it('merges item states by style priority', () => {
    const stateStyles: Record<string, ArrayItemStateStyleSpec> = {
      scan: {
        priority: 10,
        fill: '#335577',
        scale: 1.02,
      },
      pivot: {
        priority: 20,
        fill: '#ff6677',
        outlineColor: '#ffd0d8',
        outlineWidth: 3,
      },
    };

    const style = resolveArrayItemStyle(
      'item-1',
      {
        'item-1': ['scan', 'pivot'],
      },
      stateStyles,
      {
        fill: defaultTheme.colors.surfaceAlt,
        outlineColor: 'rgba(0, 0, 0, 0)',
        outlineWidth: 0,
        shadowColor: defaultTheme.colors.accent,
        shadowOpacity: 0,
        brightness: 1,
        scale: 1,
        opacity: 1,
      },
    );

    expect(style.fill).toBe('#ff6677');
    expect(style.outlineColor).toBe('#ffd0d8');
    expect(style.outlineWidth).toBe(3);
    expect(style.scale).toBe(1.02);
  });

  it('falls back to the default style when an item has no assigned states', () => {
    const defaults = {
      fill: defaultTheme.colors.surfaceAlt,
      outlineColor: 'rgba(0, 0, 0, 0)',
      outlineWidth: 0,
      shadowColor: defaultTheme.colors.accent,
      shadowOpacity: 0,
      brightness: 1,
      scale: 1,
      opacity: 1,
    };

    expect(resolveArrayItemStyle('item-2', {}, {}, defaults)).toEqual(defaults);
  });
});
