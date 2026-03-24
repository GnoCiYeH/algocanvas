import {describe, expect, it} from 'vitest';
import {interpolateArrayItemStyle} from '@/visualizers/array-state-style';

describe('array style interpolation', () => {
  it('interpolates complete item styles between two states', () => {
    const style = interpolateArrayItemStyle(
      {
        fill: 'rgb(20, 20, 20)',
        outlineColor: 'rgb(0, 0, 0)',
        outlineWidth: 0,
        shadowColor: 'rgba(0, 0, 0, 0)',
        shadowOpacity: 0,
        brightness: 1,
        scale: 1,
        opacity: 1,
      },
      {
        fill: 'rgb(220, 120, 60)',
        outlineColor: 'rgb(255, 255, 255)',
        outlineWidth: 4,
        shadowColor: 'rgba(255, 180, 120, 0.35)',
        shadowOpacity: 1,
        brightness: 1.1,
        scale: 1.08,
        opacity: 0.9,
      },
      0.5,
    );

    expect(style.fill).toBe('rgb(120, 70, 40)');
    expect(style.outlineWidth).toBe(2);
    expect(style.scale).toBe(1.04);
    expect(style.opacity).toBe(0.95);
  });

  it('returns the target style when interpolation is complete', () => {
    const target = {
      fill: 'rgb(220, 120, 60)',
      outlineColor: 'rgb(255, 255, 255)',
      outlineWidth: 4,
      shadowColor: 'rgba(255, 180, 120, 0.35)',
      shadowOpacity: 1,
      brightness: 1.1,
      scale: 1.08,
      opacity: 0.9,
    };

    expect(interpolateArrayItemStyle(target, target, 1)).toMatchObject({
      ...target,
      shadowColor: 'rgb(255, 180, 120)',
    });
  });
});
