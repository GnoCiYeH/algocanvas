import {describe, expect, it} from 'vitest';
import {normalizeAlgorithmStep} from '@/visualizers/build-visualization-model';
import type {AlgorithmSceneSpec} from '@/core/types';

describe('sequence visualization foundation', () => {
  it('normalizes cell-based sequence state for array-content algorithms', () => {
    const scene: AlgorithmSceneSpec = {
      type: 'algorithm',
      id: 'sliding-window',
      durationInFrames: 180,
      title: 'Sliding window',
      structure: 'sequence',
      steps: [
        {
          label: 'Expand right pointer',
          description: 'Grow the window to include the next item.',
          state: {
            variant: 'cells',
            items: [
              {id: '0', value: '2'},
              {id: '1', value: '1'},
              {id: '2', value: '3'},
              {id: '3', value: '2'},
            ],
            activeIndices: [1, 2],
            highlightedRanges: [{start: 1, end: 2, tone: 'accent', label: 'window'}],
            pointerMarkers: [
              {id: 'left', index: 1, label: 'L'},
              {id: 'right', index: 2, label: 'R'},
            ],
          },
        },
      ],
    };

    const normalized = normalizeAlgorithmStep(scene, 0);

    expect(normalized.kind).toBe('sequence');
    if (normalized.kind !== 'sequence') {
      throw new Error('expected sequence visualization');
    }

    expect(normalized.sequence.variant).toBe('cells');
    expect(normalized.sequence.pointerMarkers).toHaveLength(2);
    expect(normalized.sequence.highlightedRanges[0]?.label).toBe('window');
  });

  it('normalizes token-based sequence state for string algorithms', () => {
    const scene: AlgorithmSceneSpec = {
      type: 'algorithm',
      id: 'string-match',
      durationInFrames: 180,
      title: 'String matching',
      structure: 'sequence',
      steps: [
        {
          label: 'Compare current token',
          description: 'Match the pattern against the current text window.',
          state: {
            variant: 'tokens',
            items: [
              {id: '0', value: 'a'},
              {id: '1', value: 'b'},
              {id: '2', value: 'a'},
              {id: '3', value: 'b'},
            ],
            matchedIndices: [0, 1],
            pointerMarkers: [{id: 'pattern', index: 1, label: 'P'}],
            annotations: [{id: 'match', index: 1, text: 'matched'}],
          },
        },
      ],
    };

    const normalized = normalizeAlgorithmStep(scene, 0);

    expect(normalized.kind).toBe('sequence');
    if (normalized.kind !== 'sequence') {
      throw new Error('expected sequence visualization');
    }

    expect(normalized.sequence.variant).toBe('tokens');
    expect(normalized.sequence.matchedIndices).toEqual([0, 1]);
    expect(normalized.sequence.annotations[0]?.text).toBe('matched');
  });
});
