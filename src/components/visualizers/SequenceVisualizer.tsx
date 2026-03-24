import React from 'react';
import type {MotionSpec, SequenceStateSpec, ThemeSpec} from '../../core/types';
import {getFocusPulseScale, getSpotlightOpacity} from '../../visualizers/motion-style';
import {getAnimatedRange, getAnimatedRangeLabelCenter} from '../../visualizers/sequence-motion';

type SequenceVisualizerProps = {
  sequence: Required<
    Pick<
      SequenceStateSpec,
      | 'variant'
      | 'items'
      | 'activeIndices'
      | 'matchedIndices'
      | 'dimmedIndices'
      | 'highlightedRanges'
      | 'pointerMarkers'
      | 'annotations'
    >
  >;
  theme: ThemeSpec;
  motion?: MotionSpec;
  motionProgress?: number;
};

const getToneColor = (tone: string | undefined, theme: ThemeSpec) => {
  switch (tone) {
    case 'accent':
      return theme.colors.accent;
    case 'success':
      return theme.colors.success;
    case 'info':
      return '#7ab6ff';
    case 'muted':
      return theme.colors.muted;
    default:
      return theme.colors.surfaceAlt;
  }
};

export const SequenceVisualizer: React.FC<SequenceVisualizerProps> = ({
  sequence,
  theme,
  motion,
  motionProgress = 1,
}) => {
  const gridTemplateColumns = `repeat(${sequence.items.length}, minmax(0, 1fr))`;
  const animatedRange = motion?.kind === 'range' ? getAnimatedRange(motion, motionProgress) : null;
  const rangeCenter = motion?.kind === 'range' ? getAnimatedRangeLabelCenter(motion, motionProgress) : null;
  const spotlightOpacity = motion?.kind === 'focus' ? getSpotlightOpacity(motionProgress) : 0;

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
      {sequence.highlightedRanges.length > 0 ? (
        <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
          {sequence.highlightedRanges.map((range) => (
            <div
              key={`${range.start}-${range.end}-${range.label ?? 'range'}`}
              style={{
                padding: '8px 12px',
                borderRadius: theme.radii.pill,
                background: theme.colors.surfaceAlt,
                color: getToneColor(range.tone, theme),
                fontSize: 16,
              }}
            >
              {range.label ?? `${range.start}-${range.end}`}
            </div>
          ))}
        </div>
      ) : null}
      <div style={{position: 'relative'}}>
        {spotlightOpacity > 0 ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 50% 38%, rgba(255,255,255,${spotlightOpacity}) 0%, rgba(255,255,255,0.02) 25%, rgba(3,7,17,0.22) 100%)`,
              borderRadius: 28,
              pointerEvents: 'none',
            }}
          />
        ) : null}
        {animatedRange ? (
          <div
            style={{
              position: 'absolute',
              top: 30,
              left: `calc(${(animatedRange.start / sequence.items.length) * 100}% + ${animatedRange.start * 14}px)`,
              width: `calc(${(((animatedRange.end - animatedRange.start) + 1) / sequence.items.length) * 100}% + ${(animatedRange.end - animatedRange.start) * 14}px)`,
              height: sequence.variant === 'tokens' ? 122 : 144,
              borderRadius: 24,
              background:
                animatedRange.tone === 'success'
                  ? 'rgba(141, 223, 141, 0.12)'
                  : animatedRange.tone === 'info'
                    ? 'rgba(122, 182, 255, 0.12)'
                    : animatedRange.tone === 'muted'
                      ? 'rgba(138, 161, 190, 0.12)'
                      : theme.colors.accentSoft,
              border: `1px solid ${
                animatedRange.tone === 'success'
                  ? theme.colors.success
                  : animatedRange.tone === 'info'
                    ? '#7ab6ff'
                    : animatedRange.tone === 'muted'
                      ? theme.colors.muted
                      : theme.colors.accent
              }`,
              pointerEvents: 'none',
              boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 0 36px ${
                animatedRange.tone === 'success'
                  ? 'rgba(141, 223, 141, 0.18)'
                  : animatedRange.tone === 'info'
                    ? 'rgba(122, 182, 255, 0.18)'
                    : animatedRange.tone === 'muted'
                      ? 'rgba(138, 161, 190, 0.18)'
                      : 'rgba(255, 124, 92, 0.18)'
              }`,
            }}
          />
        ) : null}
        {animatedRange?.label && rangeCenter !== null ? (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: `calc(${(rangeCenter / sequence.items.length) * 100}% + ${rangeCenter * 14}px)`,
              transform: 'translateX(-50%)',
              padding: '6px 10px',
              borderRadius: theme.radii.pill,
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.foreground,
              fontSize: 14,
              fontFamily: theme.fonts.mono,
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
            {animatedRange.label}
          </div>
        ) : null}
        <div style={{display: 'grid', gridTemplateColumns, gap: 14, alignItems: 'start', position: 'relative', zIndex: 1}}>
        {sequence.items.map((item, index) => {
          const isActive = sequence.activeIndices.includes(index);
          const isMatched = sequence.matchedIndices.includes(index);
          const isDimmed = sequence.dimmedIndices.includes(index);
          const pointer = sequence.pointerMarkers.filter((marker) => marker.index === index);
          const annotation = sequence.annotations.find((entry) => entry.index === index);
          const isFocusTarget =
            motion?.kind === 'focus' &&
            ((motion.targetIndices?.includes(index) ?? false) ||
              (motion.targetIds?.includes(item.id) ?? false));
          const focusScale = isFocusTarget ? getFocusPulseScale(motionProgress) : 1;

          const background = isActive
            ? theme.colors.accent
            : isMatched
              ? theme.colors.success
              : getToneColor(item.tone, theme);

          const textColor =
            isActive || isMatched || item.tone === 'accent' || item.tone === 'success'
              ? theme.colors.background
              : theme.colors.foreground;

          return (
            <div key={item.id} style={{display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center'}}>
              <div style={{display: 'flex', gap: 8, minHeight: 24}}>
                {pointer.map((marker) => (
                  <span
                    key={marker.id}
                    style={{
                      padding: '2px 8px',
                      borderRadius: theme.radii.pill,
                      background: theme.colors.accentSoft,
                      color: theme.colors.accent,
                      fontFamily: theme.fonts.mono,
                      fontSize: 14,
                    }}
                  >
                    {marker.label}
                  </span>
                ))}
              </div>
              <div
                style={{
                  width: '100%',
                  minHeight: sequence.variant === 'tokens' ? 86 : 108,
                  borderRadius: 20,
                  background,
                  border: `1px solid ${theme.colors.border}`,
                  display: 'grid',
                  placeItems: 'center',
                  opacity: isDimmed ? 0.35 : 1,
                  fontFamily: sequence.variant === 'tokens' ? theme.fonts.display : theme.fonts.mono,
                  fontSize: sequence.variant === 'tokens' ? 38 : 30,
                  fontWeight: 700,
                  color: textColor,
                  boxShadow: isActive || isFocusTarget ? `0 0 0 4px ${theme.colors.accentSoft}` : undefined,
                  transform: `scale(${focusScale})`,
                  filter: isFocusTarget ? 'brightness(1.08)' : undefined,
                }}
              >
                {item.value}
              </div>
              <div style={{fontSize: 14, color: theme.colors.muted, fontFamily: theme.fonts.mono}}>
                {index}
              </div>
              <div style={{minHeight: 22, fontSize: 14, color: theme.colors.muted}}>
                {annotation?.text ?? item.label ?? ''}
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};
