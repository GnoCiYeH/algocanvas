import React from 'react';
import type {ArrayStateSpec, ThemeSpec} from '../../core/types';
import {getDefaultArrayItemStyle, getStateTransitionProgress, interpolateArrayItemStyle, resolveArrayItemStyle} from '../../visualizers/array-state-style';

type ArrayVisualizerProps = {
  state: ArrayStateSpec;
  theme: ThemeSpec;
  motionProgress?: number;
  previousState?: ArrayStateSpec;
};

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
  state,
  theme,
  motionProgress = 1,
  previousState,
}) => {
  const maxValue = Math.max(...state.values, 1);
  const itemIds = state.itemIds ?? state.values.map((_, index) => `item-${index}`);
  const reorderMotion = state.motion?.kind === 'reorder' ? state.motion : null;
  const columns = state.values.length;
  const gap = 18;
  const itemWidth = (100 - ((columns - 1) * gap) / columns) / columns;
  const defaults = getDefaultArrayItemStyle(theme);
  const transitionProgress = getStateTransitionProgress(
    motionProgress,
    state.stateTransition?.portion,
  );
  const mergedStateStyles = {
    ...(previousState?.stateStyles ?? {}),
    ...(state.stateStyles ?? {}),
  };

  return (
    <div
      style={{
        height: 360,
        position: 'relative',
      }}
    >
      {state.values.map((value, index) => {
        const itemId = itemIds[index] ?? `item-${index}`;
        const previousStyle = resolveArrayItemStyle(
          itemId,
          previousState?.itemStates,
          mergedStateStyles,
          defaults,
        );
        const nextStyle = resolveArrayItemStyle(itemId, state.itemStates, mergedStateStyles, defaults);
        const visualStyle = interpolateArrayItemStyle(previousStyle, nextStyle, transitionProgress);
        const fromIndex = reorderMotion ? reorderMotion.fromOrder.indexOf(itemId) : index;
        const toIndex = reorderMotion ? reorderMotion.toOrder.indexOf(itemId) : index;
        const start = fromIndex === -1 ? index : fromIndex;
        const end = toIndex === -1 ? index : toIndex;
        const translateColumns = (end - start) * motionProgress;
        const shadowActive = visualStyle.shadowOpacity > 0.001;

        return (
          <div
            key={itemId}
            style={{
              position: 'absolute',
              left: `calc(${start * itemWidth}% + ${start * gap}px + ${translateColumns * itemWidth}% + ${translateColumns * gap}px)`,
              width: `calc(${itemWidth}% - ${gap}px)`,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              transition: 'none',
              opacity: visualStyle.opacity,
            }}
          >
            <div
              style={{
                width: '100%',
                minHeight: 60,
                height: `${Math.max(60, (value / maxValue) * 280)}px`,
                borderRadius: 22,
                background: visualStyle.fill,
                boxSizing: 'border-box',
                border:
                  visualStyle.outlineWidth > 0
                    ? `${visualStyle.outlineWidth}px solid ${visualStyle.outlineColor}`
                    : undefined,
                boxShadow: shadowActive
                  ? `0 18px 40px ${visualStyle.shadowColor}`
                  : undefined,
                transform: `scale(${visualStyle.scale})`,
                filter:
                  visualStyle.brightness !== 1
                    ? `brightness(${visualStyle.brightness})`
                    : undefined,
              }}
            />
            <div
              style={{
                width: 58,
                height: 40,
                borderRadius: 14,
                border: `1px solid ${theme.colors.border}`,
                display: 'grid',
                placeItems: 'center',
                fontFamily: theme.fonts.mono,
                fontWeight: 600,
                color: theme.colors.foreground,
                background: theme.colors.surface,
              }}
            >
              {value}
            </div>
          </div>
        );
      })}
    </div>
  );
};
