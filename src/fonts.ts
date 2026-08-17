import {continueRender, delayRender, staticFile} from "remotion";

// Self-hosted font (bundled in public/fonts) rather than a Google Fonts /
// CDN fetch: this keeps rendering deterministic and network-independent,
// which matters for CI, Docker, and Lambda rendering environments.
export const FONT_FAMILY = "MusicVideoSans";

const waitForFont = delayRender("Loading MusicVideoSans font");

const font = new FontFace(
  FONT_FAMILY,
  `url("${staticFile("fonts/DejaVuSans-Bold.ttf")}") format("truetype")`,
  {weight: "700"}
);

font
  .load()
  .then((loadedFont) => {
    document.fonts.add(loadedFont);
    continueRender(waitForFont);
  })
  .catch((err) => {
    console.error("Failed to load font", err);
    continueRender(waitForFont);
  });
