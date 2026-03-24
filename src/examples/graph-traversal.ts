import {defineVideo} from '../core/dsl';
import {createTheme} from '../themes/create-theme';

export const graphTraversalVideo = defineVideo({
  id: 'GraphTraversal',
  title: 'Breadth-First Search Traversal',
  theme: createTheme({
    name: 'signal-graph',
    colors: {
      accent: '#58c4ff',
      accentSoft: 'rgba(88, 196, 255, 0.16)',
      success: '#8ce38c',
    },
  }),
  scenes: [
    {
      type: 'chapter',
      id: 'graph-intro',
      durationInFrames: 70,
      title: 'Breadth-First Search',
      eyebrow: 'Graph Visualization',
      summary:
        'Start from one source node, expand layer by layer, and use stable layout and state colors to keep the traversal readable.',
    },
    {
      type: 'algorithm',
      id: 'bfs-graph',
      durationInFrames: 240,
      title: 'Expand the frontier layer by layer',
      structure: 'graph',
      complexity: {
        time: 'O(V + E)',
        space: 'O(V)',
      },
      steps: [
        {
          label: 'Initialize the queue',
          description: 'Begin at source node A and mark it as both active and visited.',
          state: {
            layout: 'layered',
            legend: [
              {id: 'source', label: 'Source', tone: 'accent'},
              {id: 'frontier', label: 'Frontier', tone: 'info'},
              {id: 'visited', label: 'Visited path', tone: 'success'},
            ],
            nodes: [
              {id: 'A', value: 'A', group: 'layer-0'},
              {id: 'B', value: 'B', group: 'layer-1'},
              {id: 'C', value: 'C', group: 'layer-1'},
              {id: 'D', value: 'D', group: 'layer-2'},
              {id: 'E', value: 'E', group: 'layer-2'},
              {id: 'F', value: 'F', group: 'layer-2'},
            ],
            edges: [
              {id: 'A-B', source: 'A', target: 'B', directed: true},
              {id: 'A-C', source: 'A', target: 'C', directed: true},
              {id: 'B-D', source: 'B', target: 'D', directed: true},
              {id: 'B-E', source: 'B', target: 'E', directed: true},
              {id: 'C-F', source: 'C', target: 'F', directed: true},
            ],
            activeNodeIds: ['A'],
            visitedNodeIds: ['A'],
            highlightedNodeIds: ['B', 'C'],
            highlightedEdgeIds: ['A-B', 'A-C'],
            pathNodeIds: ['A'],
            pathEdgeIds: [],
          },
        },
        {
          label: 'Visit the first layer',
          description: 'Process A, then enqueue B and C as the next frontier.',
          state: {
            layout: 'layered',
            legend: [
              {id: 'source', label: 'Source', tone: 'accent'},
              {id: 'frontier', label: 'Frontier', tone: 'info'},
              {id: 'visited', label: 'Visited path', tone: 'success'},
            ],
            nodes: [
              {id: 'A', value: 'A', group: 'layer-0'},
              {id: 'B', value: 'B', group: 'layer-1'},
              {id: 'C', value: 'C', group: 'layer-1'},
              {id: 'D', value: 'D', group: 'layer-2'},
              {id: 'E', value: 'E', group: 'layer-2'},
              {id: 'F', value: 'F', group: 'layer-2'},
            ],
            edges: [
              {id: 'A-B', source: 'A', target: 'B', directed: true},
              {id: 'A-C', source: 'A', target: 'C', directed: true},
              {id: 'B-D', source: 'B', target: 'D', directed: true},
              {id: 'B-E', source: 'B', target: 'E', directed: true},
              {id: 'C-F', source: 'C', target: 'F', directed: true},
            ],
            activeNodeIds: ['B', 'C'],
            visitedNodeIds: ['A', 'B', 'C'],
            highlightedNodeIds: ['D', 'E', 'F'],
            highlightedEdgeIds: ['B-D', 'B-E', 'C-F'],
            pathNodeIds: ['A', 'B', 'C'],
            pathEdgeIds: ['A-B', 'A-C'],
          },
        },
        {
          label: 'Expand to the second layer',
          description: 'The frontier moves outward again, preserving the breadth-first order.',
          state: {
            layout: 'layered',
            legend: [
              {id: 'source', label: 'Source', tone: 'accent'},
              {id: 'frontier', label: 'Frontier', tone: 'info'},
              {id: 'visited', label: 'Visited path', tone: 'success'},
            ],
            nodes: [
              {id: 'A', value: 'A', group: 'layer-0'},
              {id: 'B', value: 'B', group: 'layer-1'},
              {id: 'C', value: 'C', group: 'layer-1'},
              {id: 'D', value: 'D', group: 'layer-2'},
              {id: 'E', value: 'E', group: 'layer-2'},
              {id: 'F', value: 'F', group: 'layer-2'},
            ],
            edges: [
              {id: 'A-B', source: 'A', target: 'B', directed: true},
              {id: 'A-C', source: 'A', target: 'C', directed: true},
              {id: 'B-D', source: 'B', target: 'D', directed: true},
              {id: 'B-E', source: 'B', target: 'E', directed: true},
              {id: 'C-F', source: 'C', target: 'F', directed: true},
            ],
            activeNodeIds: ['D', 'E', 'F'],
            visitedNodeIds: ['A', 'B', 'C', 'D', 'E', 'F'],
            highlightedNodeIds: [],
            highlightedEdgeIds: [],
            pathNodeIds: ['A', 'B', 'D'],
            pathEdgeIds: ['A-B', 'B-D'],
          },
        },
      ],
    },
  ],
});
