import {describe, expect, it} from 'vitest';
import {resolveAlgorithmStep} from '@/visualizers/build-visualization-model';
import type {AlgorithmSceneSpec} from '@/core/types';

describe('algorithm timing', () => {
  it('resolves steps using weighted timing instead of uniform timing', () => {
    const scene: AlgorithmSceneSpec = {
      type: 'algorithm',
      id: 'timing-demo',
      durationInFrames: 120,
      title: 'Timing demo',
      structure: 'array',
      timing: {
        compare: 2,
        swap: 1,
        passComplete: 1,
        finale: 1,
      },
      steps: [
        {
          label: 'Compare',
          description: 'Longer compare beat.',
          timingKey: 'compare',
          state: {
            values: [2, 1],
          },
        },
        {
          label: 'Swap',
          description: 'Shorter swap beat.',
          timingKey: 'swap',
          state: {
            values: [1, 2],
            motion: {
              kind: 'reorder',
              fromOrder: ['a', 'b'],
              toOrder: ['b', 'a'],
            },
          },
        },
      ],
    };

    expect(resolveAlgorithmStep(scene, 0.2)?.label).toBe('Compare');
    expect(resolveAlgorithmStep(scene, 0.7)?.label).toBe('Swap');
  });
});
