import {createTheme} from '../themes/create-theme';
import type {SceneSpec, ThemeSpec, VideoSpec} from './types';

type VideoInput = {
  id: string;
  title: string;
  fps?: number;
  width?: number;
  height?: number;
  scenes: SceneSpec[];
  theme?: ThemeSpec;
};

export const defineVideo = (input: VideoInput): VideoSpec => {
  return {
    id: input.id,
    title: input.title,
    fps: input.fps ?? 30,
    width: input.width ?? 1920,
    height: input.height ?? 1080,
    scenes: input.scenes,
    theme: input.theme ?? createTheme(),
  };
};

export const getVideoDurationInFrames = (video: VideoSpec): number => {
  return video.scenes.reduce((total, scene) => total + scene.durationInFrames, 0);
};

export const buildSceneTimeline = (video: VideoSpec) => {
  let currentFrame = 0;

  return video.scenes.map((scene) => {
    const segment = {
      id: scene.id,
      from: currentFrame,
      durationInFrames: scene.durationInFrames,
    };

    currentFrame += scene.durationInFrames;

    return segment;
  });
};
