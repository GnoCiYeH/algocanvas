import {describe, expect, it} from 'vitest';
import {getAnimatedRange} from '@/visualizers/sequence-motion';

describe('range motion', () => {
  it('interpolates range boundaries between two windows', () => {
    const range = getAnimatedRange(
      {
        kind: 'range',
        fromRange: {start: 0, end: 1},
        toRange: {start: 1, end: 2},
        tone: 'accent',
        label: 'window',
      },
      0.5,
    );

    expect(range.start).toBe(0.5);
    expect(range.end).toBe(1.5);
    expect(range.label).toBe('window');
  });
});
