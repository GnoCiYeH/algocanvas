import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';
import {ArrayVisualizer} from '@/components/visualizers/ArrayVisualizer';
import {defaultTheme} from '@/themes/default-theme';

describe('ArrayVisualizer state transition', () => {
  it('renders the final target style after the transition completes', () => {
    const html = renderToStaticMarkup(
      <ArrayVisualizer
        state={{
          values: [9, 4, 7, 1],
          itemStates: {
            'item-2': ['compare'],
          },
          stateStyles: {
            compare: {
              fill: '#ff8844',
              opacity: 1,
            },
          },
        }}
        theme={defaultTheme}
        motionProgress={1}
        previousState={{
          values: [9, 4, 7, 1],
          itemStates: {
            'item-1': ['compare'],
          },
          stateStyles: {
            compare: {
              fill: '#44aaff',
              opacity: 0.55,
            },
          },
        }}
      />,
    );

    expect(html).not.toContain('opacity:0.55');
    expect(html).toContain('background:rgb(255, 136, 68)');
  });
});
