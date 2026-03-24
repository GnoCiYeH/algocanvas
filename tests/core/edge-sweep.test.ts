import {describe, expect, it} from 'vitest';
import {getEdgeRevealSegment} from '@/visualizers/graph-motion';

describe('edge sweep motion', () => {
  it('computes a progressively revealed segment along an edge', () => {
    const segment = getEdgeRevealSegment(
      {
        start: {x: 0, y: 0},
        end: {x: 100, y: 0},
      },
      0.5,
    );

    expect(segment.start.x).toBe(0);
    expect(segment.end.x).toBe(50);
    expect(segment.start.y).toBe(0);
    expect(segment.end.y).toBe(0);
  });
});
