import React from "react";
import {Composition} from "remotion";
import {
  MusicVideo,
  FPS,
  DURATION_IN_FRAMES,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
} from "./MusicVideo";
import {LogoReveal, LOGO_REVEAL_FRAMES} from "./instagram/LogoReveal";
import {Countdown, COUNTDOWN_FRAMES} from "./instagram/Countdown";
import {IG_FPS, IG_WIDTH, IG_HEIGHT} from "./instagram/config";

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
      {/* ilayya Instagram launch campaign (see instagram-launch/README.md) */}
      <Composition
        id="IlayyaLogoReveal"
        component={LogoReveal}
        durationInFrames={LOGO_REVEAL_FRAMES}
        fps={IG_FPS}
        width={IG_WIDTH}
        height={IG_HEIGHT}
      />
      <Composition
        id="IlayyaCountdown"
        component={Countdown}
        durationInFrames={COUNTDOWN_FRAMES}
        fps={IG_FPS}
        width={IG_WIDTH}
        height={IG_HEIGHT}
        defaultProps={{}}
      />
    </>
  );
};
