import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {VideoComposition} from './components/composition/VideoComposition';
import {getVideoDurationInFrames} from './core/dsl';
import type {RegisteredVideo} from './core/types';
import {codeWalkthroughVideo} from './examples/code-walkthrough';
import {graphTraversalVideo} from './examples/graph-traversal';
import {quickSortAlgorithmVideo} from './examples/quicksort-algorithm';
import {slidingWindowSequenceVideo} from './examples/sliding-window-sequence';
import {sortingAlgorithmVideo} from './examples/sorting-algorithm';
import {stringMatchingSequenceVideo} from './examples/string-matching-sequence';
import {treeTraversalVideo} from './examples/tree-traversal';

const registeredVideos: RegisteredVideo[] = [
  {
    id: codeWalkthroughVideo.id,
    spec: codeWalkthroughVideo,
  },
  {
    id: sortingAlgorithmVideo.id,
    spec: sortingAlgorithmVideo,
  },
  {
    id: quickSortAlgorithmVideo.id,
    spec: quickSortAlgorithmVideo,
  },
  {
    id: treeTraversalVideo.id,
    spec: treeTraversalVideo,
  },
  {
    id: graphTraversalVideo.id,
    spec: graphTraversalVideo,
  },
  {
    id: slidingWindowSequenceVideo.id,
    spec: slidingWindowSequenceVideo,
  },
  {
    id: stringMatchingSequenceVideo.id,
    spec: stringMatchingSequenceVideo,
  },
];

export const getRegisteredVideos = () => registeredVideos;

const RemotionRoot: React.FC = () => {
  return (
    <>
      {registeredVideos.map((video) => (
        <Composition
          key={video.id}
          id={video.id}
          component={VideoComposition}
          durationInFrames={getVideoDurationInFrames(video.spec)}
          fps={video.spec.fps}
          width={video.spec.width}
          height={video.spec.height}
          defaultProps={{spec: video.spec}}
        />
      ))}
    </>
  );
};

registerRoot(RemotionRoot);
