import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {FONT_FAMILY} from "../fonts";

const FADE_IN_FRAMES = 15; // 0.5s
const HOLD_FRAMES = 60; // 2s
const FADE_OUT_FRAMES = 15; // 0.5s

export const HOOK_DURATION_IN_FRAMES =
  FADE_IN_FRAMES + HOLD_FRAMES + FADE_OUT_FRAMES; // 90 frames / 3s

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();

  // Frame-driven opacity: fade in, hold, fade out. Using interpolate()
  // (not CSS transitions) keeps this deterministic frame-by-frame,
  // which is required for reliable rendering.
  const opacity = interpolate(
    frame,
    [0, FADE_IN_FRAMES, FADE_IN_FRAMES + HOLD_FRAMES, HOOK_DURATION_IN_FRAMES],
    [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 8%",
      }}
    >
      <h1
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: 84,
          lineHeight: 1.15,
          color: "#ffffff",
          textAlign: "center",
          opacity,
          margin: 0,
        }}
      >
        Where do you even buy music anymore?
      </h1>
    </AbsoluteFill>
  );
};
