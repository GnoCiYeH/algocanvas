import {defineVideo} from '../core/dsl';
import {createTheme} from '../themes/create-theme';

export const stringMatchingSequenceVideo = defineVideo({
  id: 'StringMatchingSequence',
  title: 'String Matching Sequence Visualization',
  theme: createTheme({
    name: 'signal-string',
    colors: {
      accent: '#58c4ff',
      accentSoft: 'rgba(88, 196, 255, 0.16)',
      success: '#ffd166',
    },
  }),
  scenes: [
    {
      type: 'chapter',
      id: 'string-intro',
      durationInFrames: 65,
      title: 'String Matching',
      eyebrow: 'Sequence Visualization',
      summary: 'Treat strings as token sequences so pointer motion and matched ranges stay explicit in the video.',
    },
    {
      type: 'algorithm',
      id: 'string-demo',
      durationInFrames: 210,
      title: 'Scan for the pattern "aba"',
      structure: 'sequence',
      complexity: {
        time: 'O(nm)',
        space: 'O(1)',
      },
      steps: [
        {
          label: 'Align the pattern',
          description: 'Start comparing the pattern from the first character.',
          state: {
            variant: 'tokens',
            items: [
              {id: '0', value: 'a'},
              {id: '1', value: 'b'},
              {id: '2', value: 'a'},
              {id: '3', value: 'b'},
              {id: '4', value: 'a'},
            ],
            matchedIndices: [0, 1],
            highlightedRanges: [{start: 0, end: 2, tone: 'info', label: 'candidate'}],
            pointerMarkers: [{id: 'pattern', index: 1, label: 'P'}],
            annotations: [{id: 'match', index: 1, text: 'matched'}],
          },
        },
        {
          label: 'Complete the match',
          description: 'The whole candidate range matches the pattern.',
          state: {
            variant: 'tokens',
            items: [
              {id: '0', value: 'a'},
              {id: '1', value: 'b'},
              {id: '2', value: 'a'},
              {id: '3', value: 'b', tone: 'muted'},
              {id: '4', value: 'a', tone: 'muted'},
            ],
            matchedIndices: [0, 1, 2],
            dimmedIndices: [3, 4],
            highlightedRanges: [{start: 0, end: 2, tone: 'success', label: 'match'}],
            pointerMarkers: [{id: 'pattern', index: 2, label: 'P'}],
            annotations: [{id: 'done', index: 2, text: 'full match'}],
          },
        },
      ],
    },
  ],
});
