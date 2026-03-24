import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ThemeSpec} from '../../core/types';

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  translateY?: number;
  theme: ThemeSpec;
};

export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  translateY = 24,
  theme,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: theme.motion.transitionSpring,
  });

  return (
    <div
      style={{
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [translateY, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
};
