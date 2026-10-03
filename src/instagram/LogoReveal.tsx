import React from "react";
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {BRAND} from "./config";

export const LOGO_REVEAL_FRAMES = 150; // 5s

// Cream card, logo fades/scales in, holds, fades out. Reel opener / cover.
export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30, 120, 150], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 150], [0.96, 1.02], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{backgroundColor: BRAND.cream}}>
      <AbsoluteFill style={{opacity, transform: `scale(${scale})`}}>
        <Img
          src={staticFile("ilayya/logo.png")}
          style={{width: "100%", height: "100%", objectFit: "contain"}}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
