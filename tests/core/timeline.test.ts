import {describe, expect, it} from 'vitest';
import {buildSceneTimeline, defineVideo} from '@/core/dsl';

describe('buildSceneTimeline', () => {
  it('creates cumulative frame offsets for each scene', () => {
    const video = defineVideo({
      id: 'timeline-demo',
      title: 'Timeline demo',
      scenes: [
        {
          type: 'chapter',
          id: 'chapter',
          durationInFrames: 30,
          title: 'Chapter',
          eyebrow: 'Setup',
        },
        {
          type: 'algorithm',
          id: 'algorithm',
          durationInFrames: 90,
          title: 'Bubble sort',
          structure: 'array',
          steps: [
            {
              label: 'Initial state',
              description: 'Start with the unsorted array.',
              state: {
                values: [5, 1, 4, 2],
              },
            },
          ],
        },
      ],
    });

    expect(buildSceneTimeline(video)).toEqual([
      {id: 'chapter', from: 0, durationInFrames: 30},
      {id: 'algorithm', from: 30, durationInFrames: 90},
    ]);
  });
});
