import {describe, expect, it} from 'vitest';
import {normalizeAlgorithmStep} from '@/visualizers/build-visualization-model';
import type {AlgorithmSceneSpec} from '@/core/types';

describe('graph visualization foundation', () => {
  it('normalizes graph layout, path, legend, and weighted edges for video rendering', () => {
    const scene: AlgorithmSceneSpec = {
      type: 'algorithm',
      id: 'bfs-foundation',
      durationInFrames: 180,
      title: 'BFS',
      structure: 'graph',
      steps: [
        {
          label: 'Expand A',
          description: 'Visit neighbors of A and mark the shortest frontier edges.',
          state: {
            layout: 'layered',
            nodes: [
              {id: 'A', value: 'A', group: 'source'},
              {id: 'B', value: 'B', group: 'frontier'},
              {id: 'C', value: 'C', group: 'frontier'},
            ],
            edges: [
              {id: 'A-B', source: 'A', target: 'B', weight: '1', directed: true},
              {id: 'A-C', source: 'A', target: 'C', weight: '1', directed: true},
            ],
            activeNodeIds: ['A'],
            visitedNodeIds: ['A'],
            highlightedNodeIds: ['B', 'C'],
            highlightedEdgeIds: ['A-B', 'A-C'],
            pathNodeIds: ['A', 'B'],
            pathEdgeIds: ['A-B'],
            legend: [
              {id: 'source', label: 'Source', tone: 'accent'},
              {id: 'frontier', label: 'Frontier', tone: 'info'},
            ],
          },
        },
      ],
    };

    const normalized = normalizeAlgorithmStep(scene, 0);

    expect(normalized.kind).toBe('graph');
    if (normalized.kind !== 'graph') {
      throw new Error('expected graph visualization');
    }

    expect(normalized.graph.layout).toBe('layered');
    expect(normalized.graph.pathNodeIds).toEqual(['A', 'B']);
    expect(normalized.graph.pathEdgeIds).toEqual(['A-B']);
    expect(normalized.graph.legend).toHaveLength(2);
    expect(normalized.graph.edges[0]?.weight).toBe('1');
    expect(normalized.graph.edges[0]?.directed).toBe(true);
  });
});
