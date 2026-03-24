import {defineVideo} from '../core/dsl';
import {createTheme} from '../themes/create-theme';

export const treeTraversalVideo = defineVideo({
  id: 'TreeTraversal',
  title: 'Binary Search Tree Traversal',
  theme: createTheme({
    name: 'signal-tree',
    colors: {
      accent: '#ff8a5b',
      accentSoft: 'rgba(255, 138, 91, 0.16)',
      success: '#89e089',
    },
  }),
  scenes: [
    {
      type: 'chapter',
      id: 'tree-intro',
      durationInFrames: 70,
      title: 'Binary Search Tree',
      eyebrow: 'Tree Visualization',
      summary:
        'Introduce the tree structure first, then show how traversal or search walks a specific path.',
    },
    {
      type: 'algorithm',
      id: 'bst-search-path',
      durationInFrames: 210,
      title: 'Search for value 6',
      structure: 'tree',
      complexity: {
        time: 'O(h)',
        space: 'O(1)',
      },
      steps: [
        {
          label: 'Start at the root',
          description: 'Compare the target value with the root and decide which subtree to enter.',
          state: {
            rootId: '8',
            nodes: [
              {id: '8', value: '8'},
              {id: '3', value: '3'},
              {id: '10', value: '10'},
              {id: '1', value: '1'},
              {id: '6', value: '6'},
              {id: '14', value: '14'},
            ],
            edges: [
              {id: '8-3', source: '8', target: '3'},
              {id: '8-10', source: '8', target: '10'},
              {id: '3-1', source: '3', target: '1'},
              {id: '3-6', source: '3', target: '6'},
              {id: '10-14', source: '10', target: '14'},
            ],
            levels: [['8'], ['3', '10'], ['1', '6', '14']],
            activeNodeIds: ['8'],
            visitedNodeIds: ['8'],
            activePath: ['8'],
          },
        },
        {
          label: 'Move left',
          description: 'Since 6 is less than 8, continue into the left subtree rooted at 3.',
          state: {
            rootId: '8',
            nodes: [
              {id: '8', value: '8'},
              {id: '3', value: '3'},
              {id: '10', value: '10'},
              {id: '1', value: '1'},
              {id: '6', value: '6'},
              {id: '14', value: '14'},
            ],
            edges: [
              {id: '8-3', source: '8', target: '3'},
              {id: '8-10', source: '8', target: '10'},
              {id: '3-1', source: '3', target: '1'},
              {id: '3-6', source: '3', target: '6'},
              {id: '10-14', source: '10', target: '14'},
            ],
            levels: [['8'], ['3', '10'], ['1', '6', '14']],
            activeNodeIds: ['3'],
            visitedNodeIds: ['8', '3'],
            activePath: ['8', '3'],
          },
        },
        {
          label: 'Found the target',
          description: 'The search path reaches node 6, which matches the target value.',
          state: {
            rootId: '8',
            nodes: [
              {id: '8', value: '8'},
              {id: '3', value: '3'},
              {id: '10', value: '10'},
              {id: '1', value: '1'},
              {id: '6', value: '6'},
              {id: '14', value: '14'},
            ],
            edges: [
              {id: '8-3', source: '8', target: '3'},
              {id: '8-10', source: '8', target: '10'},
              {id: '3-1', source: '3', target: '1'},
              {id: '3-6', source: '3', target: '6'},
              {id: '10-14', source: '10', target: '14'},
            ],
            levels: [['8'], ['3', '10'], ['1', '6', '14']],
            activeNodeIds: ['6'],
            visitedNodeIds: ['8', '3', '6'],
            activePath: ['8', '3', '6'],
          },
        },
      ],
    },
  ],
});
