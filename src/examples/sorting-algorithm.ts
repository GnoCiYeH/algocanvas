import type {AlgorithmStepSpec, ArrayItemStateStyleSpec, ArrayStateSpec} from '../core/types';
import {defineVideo} from '../core/dsl';
import {createTheme} from '../themes/create-theme';

const initialValues = [9, 4, 7, 1, 6, 3, 10, 2, 8, 5];
const itemIds = initialValues.map((_, index) => `value-${index}`);

const bubbleStateStyles: Record<string, ArrayItemStateStyleSpec> = {
  compare: {
    priority: 30,
    fill: '#7ab6ff',
    shadowColor: 'rgba(122, 182, 255, 0.30)',
    brightness: 1.05,
    scale: 1.03,
  },
  swap: {
    priority: 35,
    fill: '#9fd0ff',
    outlineColor: '#d6ebff',
    outlineWidth: 3,
    shadowColor: 'rgba(159, 208, 255, 0.32)',
    brightness: 1.07,
    scale: 1.02,
  },
  sorted: {
    priority: 40,
    fill: '#ffd166',
    outlineColor: '#ffe3a3',
    outlineWidth: 2,
    shadowColor: 'rgba(255, 209, 102, 0.28)',
    brightness: 1.04,
  },
};

const buildItemStates = (
  ids: string[],
  assignments: Array<[number, string[]]>,
  sortedIndices: number[] = [],
) => {
  const itemStates: Record<string, string[]> = {};

  for (const index of sortedIndices) {
    const itemId = ids[index];

    if (itemId) {
      itemStates[itemId] = ['sorted'];
    }
  }

  for (const [index, states] of assignments) {
    const itemId = ids[index];

    if (itemId) {
      itemStates[itemId] = states;
    }
  }

  return itemStates;
};

const createBubbleSortSteps = (values: number[]): AlgorithmStepSpec[] => {
  const workingValues = [...values];
  const workingIds = [...itemIds];
  const createState = (
    assignments: Array<[number, string[]]>,
    sortedIndices: number[],
    overrides: Partial<ArrayStateSpec> = {},
  ): ArrayStateSpec => ({
    itemIds: [...workingIds],
    values: [...workingValues],
    itemStates: buildItemStates(workingIds, assignments, sortedIndices),
    stateStyles: bubbleStateStyles,
    ...overrides,
  });
  const steps: AlgorithmStepSpec[] = [
    {
      label: 'Initial state',
      description: 'Start from an unsorted 10-element array and begin the first pass from the left.',
      state: createState([[0, ['compare']], [1, ['compare']]], [], {
        stateTransition: {
          portion: 0.42,
        },
      }),
    },
  ];

  for (let pass = 0; pass < workingValues.length - 1; pass++) {
    const sortedStart = workingValues.length - pass;

    for (let index = 0; index < sortedStart - 1; index++) {
      const sortedIndices = Array.from(
        {length: pass},
        (_, offset) => workingValues.length - 1 - offset,
      ).reverse();

      steps.push({
        label: `Pass ${pass + 1} · Compare ${workingValues[index]} and ${workingValues[index + 1]}`,
        description:
          workingValues[index] > workingValues[index + 1]
            ? 'The left value is larger, so it must move right.'
            : 'The pair is already ordered, so the scan advances.',
        timingKey: 'compare',
        state: createState([[index, ['compare']], [index + 1, ['compare']]], sortedIndices, {
          stateTransition: {
            portion: 0.42,
          },
        }),
      });

      if (workingValues[index] > workingValues[index + 1]) {
        const fromOrder = [...workingIds];
        [workingValues[index], workingValues[index + 1]] = [workingValues[index + 1]!, workingValues[index]!];
        [workingIds[index], workingIds[index + 1]] = [workingIds[index + 1]!, workingIds[index]!];
        const toOrder = [...workingIds];

        steps.push({
          label: `Pass ${pass + 1} · Swap ${workingValues[index]} and ${workingValues[index + 1]}`,
          description: 'Swap the pair so the larger element keeps bubbling toward the end.',
          timingKey: 'swap',
          state: createState([[index, ['swap']], [index + 1, ['swap']]], sortedIndices, {
            stateTransition: {
              portion: 0.5,
            },
            motion: {
              kind: 'reorder',
              fromOrder,
              toOrder,
            },
          }),
        });
      }
    }

    const sortedIndices = Array.from(
      {length: pass + 1},
      (_, offset) => workingValues.length - 1 - offset,
    ).reverse();

    steps.push({
      label: `Pass ${pass + 1} complete`,
      description: `The value ${workingValues[workingValues.length - 1 - pass]} is now locked in its final position.`,
      timingKey: 'passComplete',
      state: createState(
        pass < workingValues.length - 2 ? [[0, ['compare']], [1, ['compare']]] : [],
        sortedIndices,
        {
          stateTransition: {
            portion: 0.38,
          },
        },
      ),
    });
  }

  steps.push({
    label: 'Array sorted',
    description: 'Every pass is complete, and the full array is now in ascending order.',
    timingKey: 'finale',
    state: createState(
      [],
      Array.from({length: workingValues.length}, (_, index) => index),
      {
        stateTransition: {
          portion: 0.5,
        },
      },
    ),
  });

  return steps;
};

const bubbleSortSteps = createBubbleSortSteps(initialValues);

export const sortingAlgorithmVideo = defineVideo({
  id: 'SortingAlgorithm',
  title: 'Bubble Sort Algorithm Visualization',
  theme: createTheme({
    name: 'signal-algorithm',
    colors: {
      accent: '#7ab6ff',
      accentSoft: 'rgba(122, 182, 255, 0.16)',
    },
  }),
  scenes: [
    {
      type: 'chapter',
      id: 'sorting-intro',
      durationInFrames: 70,
      title: 'Bubble Sort',
      eyebrow: 'Algorithm Visualization',
      summary:
        'Follow all 10 elements through repeated compare-and-swap passes until the array is fully sorted.',
    },
    {
      type: 'algorithm',
      id: 'bubble-sort-array',
      durationInFrames: bubbleSortSteps.length * 16,
      title: 'Complete 10-element bubble sort',
      structure: 'array',
      timing: {
        compare: 1.3,
        swap: 0.9,
        passComplete: 0.6,
        finale: 1.6,
        default: 1,
      },
      complexity: {
        time: 'O(n^2)',
        space: 'O(1)',
      },
      steps: bubbleSortSteps,
    },
  ],
});
