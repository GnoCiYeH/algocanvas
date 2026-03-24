import {describe, expect, it} from 'vitest';
import {getStateTransitionProgress} from '@/visualizers/array-state-style';

describe('array state transition progress', () => {
  it('completes the style transition within the configured early portion of a step', () => {
    expect(getStateTransitionProgress(0)).toBe(0);
    expect(getStateTransitionProgress(0.19, 0.38)).toBe(0.5);
    expect(getStateTransitionProgress(0.38, 0.38)).toBe(1);
    expect(getStateTransitionProgress(0.8, 0.38)).toBe(1);
  });
});
