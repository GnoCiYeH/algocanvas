import {describe, expect, it} from 'vitest';
import {getPreviousArrayState} from '@/visualizers/array-motion';
import type {AlgorithmSceneSpec} from '@/core/types';

describe('previous array state', () => {
  it('finds the previous array step for style interpolation', () => {
    const scene: AlgorithmSceneSpec = {
      type: 'algorithm',
      id: 'array-history',
      durationInFrames: 120,
      title: 'Array history',
      structure: 'array',
      timing: {
        compare: 1.3,
        swap: 0.9,
        default: 1,
      },
      steps: [
        {
          label: 'Step 1',
          timingKey: 'compare',
          description: 'First state.',
          state: {
            values: [3, 2, 1],
            itemStates: {
              'item-0': ['compare'],
            },
          },
        },
        {
          label: 'Step 2',
          timingKey: 'swap',
          description: 'Second state.',
          state: {
            values: [2, 3, 1],
            itemStates: {
              'item-1': ['swap'],
            },
          },
        },
        {
          label: 'Step 3',
          timingKey: 'compare',
          description: 'Third state.',
          state: {
            values: [2, 3, 1],
            itemStates: {
              'item-2': ['compare'],
            },
          },
        },
      ],
    };

    expect(getPreviousArrayState(scene, 0.8)?.itemStates).toEqual({
      'item-1': ['swap'],
    });
  });
});
