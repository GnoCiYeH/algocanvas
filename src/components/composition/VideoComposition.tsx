import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {buildSceneTimeline} from '../../core/dsl';
import type {SceneSpec, VideoSpec} from '../../core/types';
import {AlgorithmScene} from '../scenes/AlgorithmScene';
import {ChapterScene} from '../scenes/ChapterScene';
import {CodeScene} from '../scenes/CodeScene';

type VideoCompositionProps = {
  spec: VideoSpec;
};

const renderScene = (scene: SceneSpec, spec: VideoSpec) => {
  switch (scene.type) {
    case 'chapter':
      return <ChapterScene scene={scene} theme={spec.theme} />;
    case 'code':
      return <CodeScene scene={scene} theme={spec.theme} />;
    case 'algorithm':
      return <AlgorithmScene scene={scene} theme={spec.theme} />;
  }
};

export const VideoComposition: React.FC<VideoCompositionProps> = ({spec}) => {
  const timeline = buildSceneTimeline(spec);

  return (
    <AbsoluteFill>
      {spec.scenes.map((scene, index) => {
        const segment = timeline[index];

        if (!segment) {
          return null;
        }

        return (
          <Sequence key={scene.id} from={segment.from} durationInFrames={segment.durationInFrames}>
            {renderScene(scene, spec)}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
