import {describe, expect, it} from 'vitest';
import {getFocusPulseScale, getReorderLift, getSpotlightOpacity} from '@/visualizers/motion-style';
import {getAnimatedRangeLabelCenter} from '@/visualizers/sequence-motion';

describe('motion style helpers', () => {
  it('computes a lifted arc for reorder motion', () => {
    expect(getReorderLift(0)).toBe(0);
    expect(getReorderLift(0.5)).toBeGreaterThan(0);
    expect(getReorderLift(1)).toBe(0);
  });

  it('computes focus pulse scale and spotlight opacity', () => {
    expect(getFocusPulseScale(0)).toBe(1);
    expect(getFocusPulseScale(0.5)).toBeGreaterThan(1);
    expect(getSpotlightOpacity(0.5)).toBeGreaterThan(0);
  });

  it('computes the animated center for a moving range label', () => {
    const center = getAnimatedRangeLabelCenter(
      {
        kind: 'range',
        fromRange: {start: 0, end: 1},
        toRange: {start: 2, end: 3},
        tone: 'accent',
        label: 'window',
      },
      0.5,
    );

    expect(center).toBe(2);
  });
});
