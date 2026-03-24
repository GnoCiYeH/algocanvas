import {describe, expect, it} from 'vitest';
import {sortingAlgorithmVideo} from '@/examples/sorting-algorithm';

describe('sorting example', () => {
  it('shows a full 10-element bubble sort walkthrough', () => {
    const scene = sortingAlgorithmVideo.scenes.find(
      (entry) => entry.type === 'algorithm' && entry.id === 'bubble-sort-array',
    );

    expect(scene?.type).toBe('algorithm');

    if (!scene || scene.type !== 'algorithm') {
      throw new Error('expected algorithm scene');
    }

    expect(scene.steps[0]?.state).toMatchObject({
      values: expect.any(Array),
    });

    const firstState = scene.steps[0]?.state;
    const lastState = scene.steps.at(-1)?.state;

    if (!firstState || !('values' in firstState) || !lastState || !('values' in lastState)) {
      throw new Error('expected sort array states');
    }

    expect(scene.timing).toMatchObject({
      compare: expect.any(Number),
      swap: expect.any(Number),
      passComplete: expect.any(Number),
      finale: expect.any(Number),
    });
    expect(firstState.values).toHaveLength(10);
    expect(firstState.stateStyles?.compare).toBeDefined();
    expect(firstState.itemStates).toBeDefined();
    expect(scene.steps.length).toBeGreaterThan(20);
    expect(lastState.values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(Object.values(lastState.itemStates ?? {}).every((states) => states.includes('sorted'))).toBe(true);
  });
});
