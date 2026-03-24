import {defineVideo} from '../core/dsl';
import {createTheme} from '../themes/create-theme';

export const slidingWindowSequenceVideo = defineVideo({
  id: 'SlidingWindowSequence',
  title: 'Sliding Window Sequence Visualization',
  theme: createTheme({
    name: 'signal-sequence',
    colors: {
      accent: '#ff7c5c',
      accentSoft: 'rgba(255, 124, 92, 0.16)',
      success: '#8ddf8d',
    },
  }),
  scenes: [
    {
      type: 'chapter',
      id: 'window-intro',
      durationInFrames: 65,
      title: 'Sliding Window',
      eyebrow: 'Sequence Visualization',
      summary: 'Use a general sequence renderer for array-content algorithms that care about positions, ranges, and pointers.',
    },
    {
      type: 'algorithm',
      id: 'window-demo',
      durationInFrames: 210,
      title: 'Track the current window sum',
      structure: 'sequence',
      complexity: {
        time: 'O(n)',
        space: 'O(1)',
      },
      steps: [
        {
          label: 'Initialize the window',
          description: 'Start with the first two values inside the current window.',
          state: {
            variant: 'cells',
            items: [
              {id: '0', value: '2'},
              {id: '1', value: '1'},
              {id: '2', value: '3'},
              {id: '3', value: '2'},
              {id: '4', value: '4'},
            ],
            activeIndices: [0, 1],
            highlightedRanges: [{start: 0, end: 1, tone: 'accent', label: 'window'}],
            pointerMarkers: [
              {id: 'left', index: 0, label: 'L'},
              {id: 'right', index: 1, label: 'R'},
            ],
            annotations: [{id: 'sum', index: 1, text: 'sum = 3'}],
            motion: {
              kind: 'focus',
              mode: 'pulse',
              targetIndices: [0, 1],
            },
          },
        },
        {
          label: 'Expand right',
          description: 'Move the right pointer and include the next value in the window.',
          state: {
            variant: 'cells',
            items: [
              {id: '0', value: '2'},
              {id: '1', value: '1'},
              {id: '2', value: '3'},
              {id: '3', value: '2'},
              {id: '4', value: '4'},
            ],
            activeIndices: [0, 1, 2],
            highlightedRanges: [{start: 0, end: 2, tone: 'accent', label: 'window'}],
            pointerMarkers: [
              {id: 'left', index: 0, label: 'L'},
              {id: 'right', index: 2, label: 'R'},
            ],
            annotations: [{id: 'sum', index: 2, text: 'sum = 6'}],
            motion: {
              kind: 'range',
              fromRange: {start: 0, end: 1},
              toRange: {start: 0, end: 2},
              tone: 'accent',
              label: 'window',
            },
          },
        },
        {
          label: 'Shrink from the left',
          description: 'Drop the leftmost item to keep the window valid.',
          state: {
            variant: 'cells',
            items: [
              {id: '0', value: '2', tone: 'muted'},
              {id: '1', value: '1'},
              {id: '2', value: '3'},
              {id: '3', value: '2'},
              {id: '4', value: '4'},
            ],
            activeIndices: [1, 2],
            dimmedIndices: [0],
            highlightedRanges: [{start: 1, end: 2, tone: 'accent', label: 'window'}],
            pointerMarkers: [
              {id: 'left', index: 1, label: 'L'},
              {id: 'right', index: 2, label: 'R'},
            ],
            annotations: [{id: 'sum', index: 2, text: 'sum = 4'}],
            motion: {
              kind: 'range',
              fromRange: {start: 0, end: 2},
              toRange: {start: 1, end: 2},
              tone: 'accent',
              label: 'window',
            },
          },
        },
      ],
    },
  ],
});
