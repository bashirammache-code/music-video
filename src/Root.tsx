import React from "react";
import {Composition} from "remotion";
import {
  MusicVideo,
  FPS,
  DURATION_IN_FRAMES,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
} from "./MusicVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MusicVideo"
        component={MusicVideo}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
