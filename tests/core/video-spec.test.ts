import {describe, expect, it} from 'vitest';
import {defineVideo, getVideoDurationInFrames} from '@/core/dsl';

describe('defineVideo', () => {
  it('derives total duration from scene durations', () => {
    const video = defineVideo({
      id: 'intro-to-two-sum',
      title: 'Two Sum walkthrough',
      scenes: [
        {
          type: 'chapter',
          id: 'chapter-open',
          durationInFrames: 45,
          title: 'Two Sum',
          eyebrow: 'Array / Hash Map',
        },
        {
          type: 'code',
          id: 'code-main',
          durationInFrames: 120,
          title: 'Brute force',
          code: 'for (let i = 0; i < nums.length; i++) {}',
          language: 'ts',
          focusLines: [1],
        },
      ],
    });

    expect(video.fps).toBe(30);
    expect(video.width).toBe(1920);
    expect(video.height).toBe(1080);
    expect(getVideoDurationInFrames(video)).toBe(165);
  });
});
