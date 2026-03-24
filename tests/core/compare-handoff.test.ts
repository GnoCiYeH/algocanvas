import {describe, expect, it} from 'vitest';
import {getStateTransitionProgress} from '@/visualizers/array-state-style';

describe('array state transition progress', () => {
  it('finishes the style transition within the configured early portion of a step', () => {
    expect(getStateTransitionProgress(0)).toBe(0);
    expect(getStateTransitionProgress(0.2, 0.4)).toBe(0.5);
    expect(getStateTransitionProgress(0.4, 0.4)).toBe(1);
    expect(getStateTransitionProgress(0.8, 0.4)).toBe(1);
  });
});
