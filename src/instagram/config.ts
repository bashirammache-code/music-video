// Single source of truth for the ilayya Instagram launch.
// Set LAUNCH_DATE once the date is decided (ISO "YYYY-MM-DD"); the countdown
// and the plan in instagram-launch/README.md are written around this value.
export const LAUNCH_DATE: string | null = null; // TBD, "next week maybe"

export const BRAND = {
  name: "ilayya",
  tagline: "ALREADY YOURS",
  place: "BEIRUT",
  year: "2026",
  red: "#8B0A0A",
  cream: "#F6F4F0",
} as const;

export const IG_FPS = 30;
export const IG_WIDTH = 1080;
export const IG_HEIGHT = 1920;

/** Whole days from today until launch, or null while the date is TBD. */
export const daysUntilLaunch = (now: Date = new Date()): number | null => {
  if (!LAUNCH_DATE) return null;
  const ms = new Date(`${LAUNCH_DATE}T00:00:00`).getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / 86_400_000));
};
