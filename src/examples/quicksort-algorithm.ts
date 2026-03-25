import type {AlgorithmStepSpec, ArrayItemStateStyleSpec, ArrayStateSpec} from '../core/types';
import {defineVideo} from '../core/dsl';
import {createTheme} from '../themes/create-theme';

const initialValues = [9, 4, 7, 1, 6, 3, 10, 2, 8, 5];
const itemIds = initialValues.map((_, index) => `quick-value-${index}`);

const quickSortStateStyles: Record<string, ArrayItemStateStyleSpec> = {
  pivot: {
    priority: 40,
    fill: '#ff6b7f',
    shadowColor: 'rgba(255, 107, 127, 0.32)',
    shadowOpacity: 1,
  },
  scan: {
    priority: 30,
    fill: '#ffb36b',
    shadowColor: 'rgba(255, 179, 107, 0.26)',
    shadowOpacity: 1,
  },
  swap: {
    priority: 35,
    fill: '#ffc98d',
    shadowColor: 'rgba(255, 201, 141, 0.30)',
    shadowOpacity: 1,
  },
  sorted: {
    priority: 50,
    fill: '#ffd166',
    shadowColor: 'rgba(255, 209, 102, 0.28)',
    shadowOpacity: 1,
  },
};

const buildItemStates = (
  ids: string[],
  assignments: Array<[number, string[]]>,
  finalized: Set<number>,
) => {
  const itemStates: Record<string, string[]> = {};

  for (const index of finalized) {
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

const createQuickSortSteps = (values: number[]): AlgorithmStepSpec[] => {
  const workingValues = [...values];
  const workingIds = [...itemIds];
  const finalized = new Set<number>();
  const createState = (
    assignments: Array<[number, string[]]>,
    overrides: Partial<ArrayStateSpec> = {},
  ): ArrayStateSpec => ({
    itemIds: [...workingIds],
    values: [...workingValues],
    itemStates: buildItemStates(workingIds, assignments, finalized),
    stateStyles: quickSortStateStyles,
    ...overrides,
  });

  const steps: AlgorithmStepSpec[] = [
    {
      label: 'Initial state',
      description: 'Start from an unsorted 10-element array and choose the rightmost value as the first pivot.',
      state: createState([[workingValues.length - 1, ['pivot']]], {
        stateTransition: {
          portion: 0.4,
        },
      }),
    },
  ];

  const pushStep = (
    label: string,
    description: string,
    stateOverrides: Partial<ArrayStateSpec>,
    timingKey?: AlgorithmStepSpec['timingKey'],
    durationWeight?: number,
  ) => {
    steps.push({
      label,
      description,
      timingKey,
      durationWeight,
      state: createState([], stateOverrides),
    });
  };

  const swapValues = (leftIndex: number, rightIndex: number) => {
    const fromOrder = [...workingIds];
    const leftValue = workingValues[leftIndex]!;
    const rightValue = workingValues[rightIndex]!;

    [workingValues[leftIndex], workingValues[rightIndex]] = [rightValue, leftValue];
    [workingIds[leftIndex], workingIds[rightIndex]] = [workingIds[rightIndex]!, workingIds[leftIndex]!];

    return {
      fromOrder,
      toOrder: [...workingIds],
      leftValue,
      rightValue,
    };
  };

  const sortRange = (low: number, high: number) => {
    if (low > high) {
      return;
    }

    if (low === high) {
      if (!finalized.has(low)) {
        finalized.add(low);
        pushStep(
          `Single element ${workingValues[low]} fixed`,
          'A one-element partition is already sorted, so this index is now locked.',
          {
            itemStates: buildItemStates(workingIds, [], finalized),
            stateStyles: quickSortStateStyles,
            stateTransition: {
              portion: 0.36,
            },
          },
          'passComplete',
          0.8,
        );
      }

      return;
    }

    const pivotIndex = high;
    const pivotValue = workingValues[pivotIndex]!;

    pushStep(
      `Partition ${low}-${high} around pivot ${pivotValue}`,
      'Choose the rightmost value as the pivot and scan the partition from left to right.',
      {
        itemStates: buildItemStates(workingIds, [[pivotIndex, ['pivot']]], finalized),
        stateStyles: quickSortStateStyles,
        stateTransition: {
          portion: 0.38,
        },
      },
      undefined,
      1.05,
    );

    let storeIndex = low;

    for (let scanIndex = low; scanIndex < high; scanIndex++) {
      const currentValue = workingValues[scanIndex]!;

      pushStep(
        `Compare ${currentValue} with pivot ${pivotValue}`,
        currentValue <= pivotValue
          ? 'This value belongs on the left side of the pivot.'
          : 'This value stays on the right side for now.',
        {
          itemStates: buildItemStates(
            workingIds,
            [
              [pivotIndex, ['pivot']],
              [scanIndex, ['scan']],
            ],
            finalized,
          ),
          stateStyles: quickSortStateStyles,
          stateTransition: {
            portion: 0.42,
          },
        },
        'compare',
      );

      if (currentValue <= pivotValue) {
        if (storeIndex !== scanIndex) {
          const swap = swapValues(storeIndex, scanIndex);

          pushStep(
            `Move ${swap.leftValue} behind ${swap.rightValue}`,
            'Swap the value into the growing left partition.',
            {
              itemStates: buildItemStates(
                workingIds,
                [
                  [pivotIndex, ['pivot']],
                  [storeIndex, ['swap']],
                  [scanIndex, ['swap']],
                ],
                finalized,
              ),
              stateStyles: quickSortStateStyles,
              stateTransition: {
                portion: 0.52,
              },
              motion: {
                kind: 'reorder',
                fromOrder: swap.fromOrder,
                toOrder: swap.toOrder,
              },
            },
            'swap',
          );
        }

        storeIndex += 1;
      }
    }

    if (storeIndex !== pivotIndex) {
      const swap = swapValues(storeIndex, pivotIndex);

      pushStep(
        `Place pivot ${pivotValue} at index ${storeIndex}`,
        'Swap the pivot into its final sorted position.',
        {
          itemStates: buildItemStates(
            workingIds,
            [
              [storeIndex, ['pivot', 'swap']],
              [pivotIndex, ['swap']],
            ],
            finalized,
          ),
          stateStyles: quickSortStateStyles,
          stateTransition: {
            portion: 0.55,
          },
          motion: {
            kind: 'reorder',
            fromOrder: swap.fromOrder,
            toOrder: swap.toOrder,
          },
        },
        'swap',
        1.05,
      );
    }

    finalized.add(storeIndex);
    pushStep(
      `Pivot ${workingValues[storeIndex]} fixed at index ${storeIndex}`,
      'The pivot is now locked. Recurse into the left and right partitions.',
      {
        itemStates: buildItemStates(workingIds, [], finalized),
        stateStyles: quickSortStateStyles,
        stateTransition: {
          portion: 0.4,
        },
      },
      'passComplete',
      0.9,
    );

    sortRange(low, storeIndex - 1);
    sortRange(storeIndex + 1, high);
  };

  sortRange(0, workingValues.length - 1);

  steps.push({
    label: 'Array sorted',
    description: 'All recursive partitions are complete, and the full array is now in ascending order.',
    timingKey: 'finale',
    state: createState([], {
      itemStates: buildItemStates(
        workingIds,
        [],
        new Set(Array.from({length: workingValues.length}, (_, index) => index)),
      ),
      stateStyles: quickSortStateStyles,
      stateTransition: {
        portion: 0.5,
      },
    }),
  });

  return steps;
};

const quickSortSteps = createQuickSortSteps(initialValues);

export const quickSortAlgorithmVideo = defineVideo({
  id: 'QuickSortAlgorithm',
  title: 'Quick Sort Algorithm Visualization',
  theme: createTheme({
    name: 'signal-quicksort',
    colors: {
      accent: '#ff8f5a',
      accentSoft: 'rgba(255, 143, 90, 0.16)',
      success: '#ffd166',
    },
  }),
  scenes: [
    {
      type: 'chapter',
      id: 'quicksort-intro',
      durationInFrames: 70,
      title: 'Quick Sort',
      eyebrow: 'Algorithm Visualization',
      summary:
        'Partition the array around a pivot, lock that pivot in place, and recurse on the two remaining ranges.',
    },
    {
      type: 'algorithm',
      id: 'quick-sort-array',
      durationInFrames: quickSortSteps.length * 16,
      title: 'Quick sort with Lomuto partitioning',
      structure: 'array',
      timing: {
        compare: 1.2,
        swap: 0.95,
        passComplete: 0.75,
        finale: 1.6,
        default: 1,
      },
      complexity: {
        time: 'O(n log n) avg',
        space: 'O(log n)',
      },
      steps: quickSortSteps,
    },
  ],
});
