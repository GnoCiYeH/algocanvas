import {defineVideo} from '../core/dsl';
import {createTheme} from '../themes/create-theme';

export const codeWalkthroughVideo = defineVideo({
  id: 'CodeWalkthrough',
  title: 'Two Sum Code Walkthrough',
  theme: createTheme({
    name: 'signal-default',
  }),
  scenes: [
    {
      type: 'chapter',
      id: 'intro',
      durationInFrames: 70,
      title: 'Two Sum',
      eyebrow: 'Code Walkthrough',
      summary: 'Use a chapter card to establish problem framing before diving into the implementation.',
    },
    {
      type: 'code',
      id: 'hash-map-solution',
      durationInFrames: 180,
      title: 'Single-pass hash map',
      language: 'ts',
      focusLines: [2, 4, 5],
      callout: 'Point out that each step checks the complement before storing the current number.',
      output: '[0, 1]',
      code: [
        'function twoSum(nums: number[], target: number): [number, number] | null {',
        '  const seen = new Map<number, number>();',
        '  for (let index = 0; index < nums.length; index++) {',
        '    const complement = target - nums[index]!;',
        '    if (seen.has(complement)) return [seen.get(complement)!, index];',
        '    seen.set(nums[index]!, index);',
        '  }',
        '  return null;',
        '}',
      ].join('\n'),
    },
  ],
});
