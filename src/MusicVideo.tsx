import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {Hook, HOOK_DURATION_IN_FRAMES} from "./scenes/Hook";

// Video timing
export const FPS = 30;
export const DURATION_IN_SECONDS = 30;
export const DURATION_IN_FRAMES = FPS * DURATION_IN_SECONDS; // 900

// Vertical short-form format (TikTok / Reels / Shorts).
// Adjust here if a different aspect ratio is needed.
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

export const MusicVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: "#000000"}}>
      <Sequence from={0} durationInFrames={HOOK_DURATION_IN_FRAMES} name="Hook">
        <Hook />
      </Sequence>

      {/*
        Next scenes go here as additional <Sequence> blocks, starting at
        frame HOOK_DURATION_IN_FRAMES and filling the remaining runtime
        up to DURATION_IN_FRAMES (900 frames / 30s total). Example:

        <Sequence
          from={HOOK_DURATION_IN_FRAMES}
          durationInFrames={DURATION_IN_FRAMES - HOOK_DURATION_IN_FRAMES}
          name="NextScene"
        >
          <NextScene />
        </Sequence>
      */}
    </AbsoluteFill>
  );
};
