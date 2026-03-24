import {describe, expect, it} from 'vitest';
import {normalizeAlgorithmStep} from '@/visualizers/build-visualization-model';
import type {AlgorithmSceneSpec} from '@/core/types';

describe('normalizeAlgorithmStep', () => {
  it('converts tree state into a graph-backed visualization model', () => {
    const scene: AlgorithmSceneSpec = {
      type: 'algorithm',
      id: 'bst-search',
      durationInFrames: 180,
      title: 'BST search',
      structure: 'tree',
      steps: [
        {
          label: 'Visit root',
          description: 'Start from the root and compare with the target value.',
          state: {
            rootId: '8',
            nodes: [
              {id: '8', value: '8'},
              {id: '3', value: '3'},
              {id: '10', value: '10'},
              {id: '6', value: '6'},
            ],
            edges: [
              {id: '8-3', source: '8', target: '3'},
              {id: '8-10', source: '8', target: '10'},
              {id: '3-6', source: '3', target: '6'},
            ],
            levels: [['8'], ['3', '10'], ['6']],
            activeNodeIds: ['8'],
            visitedNodeIds: ['8'],
            activePath: ['8'],
          },
        },
      ],
    };

    const normalized = normalizeAlgorithmStep(scene, 0);

    expect(normalized.kind).toBe('tree');
    if (normalized.kind !== 'tree') {
      throw new Error('expected tree visualization');
    }
    expect(normalized.graph.nodes).toHaveLength(4);
    expect(normalized.graph.edges).toHaveLength(3);
    expect(normalized.tree.rootId).toBe('8');
    expect(normalized.tree.levels[1]).toEqual(['3', '10']);
    expect(normalized.tree.activePath).toEqual(['8']);
  });

  it('preserves graph state for future graph visualizers', () => {
    const scene: AlgorithmSceneSpec = {
      type: 'algorithm',
      id: 'graph-search',
      durationInFrames: 120,
      title: 'Graph search',
      structure: 'graph',
      steps: [
        {
          label: 'Start BFS',
          description: 'The source node is marked active.',
          state: {
            nodes: [
              {id: 'A', value: 'A'},
              {id: 'B', value: 'B'},
            ],
            edges: [{id: 'A-B', source: 'A', target: 'B'}],
            activeNodeIds: ['A'],
            highlightedEdgeIds: ['A-B'],
          },
        },
      ],
    };

    const normalized = normalizeAlgorithmStep(scene, 0);

    expect(normalized.kind).toBe('graph');
    if (normalized.kind !== 'graph') {
      throw new Error('expected graph visualization');
    }
    expect(normalized.graph.activeNodeIds).toEqual(['A']);
    expect(normalized.graph.highlightedEdgeIds).toEqual(['A-B']);
  });
});
