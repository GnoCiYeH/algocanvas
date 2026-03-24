import {describe, expect, it} from 'vitest';
import {normalizeAlgorithmStep} from '@/visualizers/build-visualization-model';
import type {AlgorithmSceneSpec} from '@/core/types';

describe('motion normalization', () => {
  it('preserves reorder motion for sort-specific array steps', () => {
    const scene: AlgorithmSceneSpec = {
      type: 'algorithm',
      id: 'sort-motion',
      durationInFrames: 120,
      title: 'Swap demo',
      structure: 'array',
      steps: [
        {
          label: 'Swap neighbors',
          description: 'Swap adjacent values.',
          state: {
            itemIds: ['a', 'b', 'c'],
            values: [1, 4, 3],
            motion: {
              kind: 'reorder',
              fromOrder: ['b', 'a', 'c'],
              toOrder: ['a', 'b', 'c'],
            },
          },
        },
      ],
    };

    const normalized = normalizeAlgorithmStep(scene, 0.4);

    expect(normalized.kind).toBe('array');
    if (normalized.kind !== 'array') {
      throw new Error('expected array visualization');
    }
    expect(normalized.motion?.kind).toBe('reorder');
    expect(normalized.motionProgress).toBeGreaterThan(0);
  });

  it('preserves focus motion for sequence steps', () => {
    const scene: AlgorithmSceneSpec = {
      type: 'algorithm',
      id: 'sequence-focus',
      durationInFrames: 120,
      title: 'Focus demo',
      structure: 'sequence',
      steps: [
        {
          label: 'Focus range',
          description: 'Focus on current pointers.',
          state: {
            variant: 'cells',
            items: [
              {id: '0', value: '2'},
              {id: '1', value: '1'},
            ],
            motion: {
              kind: 'focus',
              mode: 'pulse',
              targetIndices: [0, 1],
            },
          },
        },
      ],
    };

    const normalized = normalizeAlgorithmStep(scene, 0.25);

    expect(normalized.kind).toBe('sequence');
    if (normalized.kind !== 'sequence') {
      throw new Error('expected sequence visualization');
    }
    expect(normalized.motion?.kind).toBe('focus');
    expect(normalized.motionProgress).toBeGreaterThan(0);
  });

  it('preserves range motion for sequence steps', () => {
    const scene: AlgorithmSceneSpec = {
      type: 'algorithm',
      id: 'sequence-range',
      durationInFrames: 120,
      title: 'Range demo',
      structure: 'sequence',
      steps: [
        {
          label: 'Move window',
          description: 'Advance the current window boundary.',
          state: {
            variant: 'cells',
            items: [
              {id: '0', value: '2'},
              {id: '1', value: '1'},
              {id: '2', value: '3'},
            ],
            highlightedRanges: [{start: 1, end: 2, tone: 'accent', label: 'window'}],
            motion: {
              kind: 'range',
              fromRange: {start: 0, end: 1},
              toRange: {start: 1, end: 2},
              tone: 'accent',
              label: 'window',
            },
          },
        },
      ],
    };

    const normalized = normalizeAlgorithmStep(scene, 0.5);

    expect(normalized.kind).toBe('sequence');
    if (normalized.kind !== 'sequence') {
      throw new Error('expected sequence visualization');
    }
    expect(normalized.motion?.kind).toBe('range');
    expect(normalized.motionProgress).toBeGreaterThan(0);
  });
});
