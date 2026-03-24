import {describe, expect, it} from 'vitest';
import {getRegisteredVideos} from '@/index';

describe('registered videos', () => {
  it('exposes the built-in example compositions', () => {
    const videos = getRegisteredVideos();

    expect(videos.map((video) => video.id)).toEqual([
      'CodeWalkthrough',
      'SortingAlgorithm',
      'QuickSortAlgorithm',
      'TreeTraversal',
      'GraphTraversal',
      'SlidingWindowSequence',
      'StringMatchingSequence',
    ]);
    expect(videos[0]?.spec.scenes.length).toBeGreaterThan(0);
    expect(videos[1]?.spec.scenes.length).toBeGreaterThan(0);
    expect(videos[2]?.spec.scenes.length).toBeGreaterThan(0);
    expect(videos[3]?.spec.scenes.length).toBeGreaterThan(0);
    expect(videos[4]?.spec.scenes.length).toBeGreaterThan(0);
    expect(videos[5]?.spec.scenes.length).toBeGreaterThan(0);
    expect(videos[6]?.spec.scenes.length).toBeGreaterThan(0);
  });
});
