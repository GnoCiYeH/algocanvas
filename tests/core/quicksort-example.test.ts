import {describe, expect, it} from 'vitest';
import {quickSortAlgorithmVideo} from '@/examples/quicksort-algorithm';

describe('quicksort example', () => {
  it('shows a full 10-element quicksort walkthrough using the array DSL', () => {
    const scene = quickSortAlgorithmVideo.scenes.find(
      (entry) => entry.type === 'algorithm' && entry.id === 'quick-sort-array',
    );

    expect(scene?.type).toBe('algorithm');

    if (!scene || scene.type !== 'algorithm') {
      throw new Error('expected algorithm scene');
    }

    const firstState = scene.steps[0]?.state;
    const lastState = scene.steps.at(-1)?.state;

    if (!firstState || !('values' in firstState) || !lastState || !('values' in lastState)) {
      throw new Error('expected sort array states');
    }

    expect(scene.structure).toBe('array');
    expect(firstState.values).toHaveLength(10);
    expect(firstState.stateStyles?.pivot).toBeDefined();
    expect(scene.steps.length).toBeGreaterThan(20);
    expect(lastState.values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(Object.values(lastState.itemStates ?? {}).every((states) => states.includes('sorted'))).toBe(true);
  });

  it('keeps the pivot explicitly marked during partition compare and swap steps', () => {
    const scene = quickSortAlgorithmVideo.scenes.find(
      (entry) => entry.type === 'algorithm' && entry.id === 'quick-sort-array',
    );

    if (!scene || scene.type !== 'algorithm') {
      throw new Error('expected algorithm scene');
    }

    const compareStep = scene.steps.find(
      (step) => step.timingKey === 'compare' && 'values' in step.state,
    );
    const swapStep = scene.steps.find(
      (step) => step.timingKey === 'swap' && 'values' in step.state,
    );

    if (!compareStep || !('values' in compareStep.state) || !swapStep || !('values' in swapStep.state)) {
      throw new Error('expected compare and swap quicksort steps');
    }

    expect(compareStep.state.stateStyles?.pivot).toBeDefined();
    expect(compareStep.state.itemStates).toBeDefined();
    expect(Object.values(compareStep.state.itemStates ?? {})).toContainEqual(['pivot']);
    expect(swapStep.state.stateStyles?.pivot).toBeDefined();
    expect(Object.values(swapStep.state.itemStates ?? {}).some((states) => states.includes('pivot'))).toBe(true);
  });
});
