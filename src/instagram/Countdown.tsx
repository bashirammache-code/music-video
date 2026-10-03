import React from "react";
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {BRAND, daysUntilLaunch} from "./config";

export const COUNTDOWN_FRAMES = 120; // 4s

const SANS = "'Helvetica Neue', Arial, sans-serif";

type Props = {
  /** Override the computed days (handy for rendering the whole series). */
  daysLeft?: number | null;
};

// Story: hero photo, tinted, with "N DAYS" / "SOON" over it.
export const Countdown: React.FC<Props> = ({daysLeft}) => {
  const frame = useCurrentFrame();
  const days = daysLeft === undefined ? daysUntilLaunch() : daysLeft;
  const label =
    days === null ? "SOON" : days === 0 ? "TODAY" : `${days} ${days === 1 ? "DAY" : "DAYS"}`;

  const textOpacity = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoom = interpolate(frame, [0, COUNTDOWN_FRAMES], [1, 1.06]);

  return (
    <AbsoluteFill style={{backgroundColor: BRAND.cream}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <Img
          src={staticFile("ilayya/hero.png")}
          style={{width: "100%", height: "100%", objectFit: "cover"}}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{backgroundColor: "rgba(139,10,10,0.18)"}} />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 220,
          opacity: textOpacity,
          color: BRAND.cream,
          fontFamily: SANS,
          textAlign: "center",
        }}
      >
        <div style={{fontSize: 130, letterSpacing: 14, fontWeight: 300}}>{label}</div>
        <div style={{fontSize: 38, letterSpacing: 10, marginTop: 28}}>
          {BRAND.name.toUpperCase()} · {BRAND.tagline}
        </div>
        <div style={{fontSize: 30, letterSpacing: 8, marginTop: 16, opacity: 0.85}}>
          {BRAND.place} {BRAND.year}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
