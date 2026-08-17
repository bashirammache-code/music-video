# music-video

A [Remotion](https://www.remotion.dev/) project: a 30-second, 30fps video.

## Structure

- `src/Root.tsx` — registers the `MusicVideo` composition (900 frames / 30s @ 30fps, 1080×1920 vertical).
- `src/MusicVideo.tsx` — assembles the video's scenes as `<Sequence>` blocks in time.
- `src/scenes/Hook.tsx` — opening hook: white text on black, "Where do you even buy music anymore?", fades in (0.5s), holds (2s), fades out (0.5s).
- `src/fonts.ts` — self-hosted font loader (bundled TTF in `public/fonts/`, no network fetch at render time).

Only the hook (first 3s / 90 frames) is built so far. The remaining runtime up to 900 frames is left as black — add further scenes as additional `<Sequence>` blocks in `src/MusicVideo.tsx` (see the comment there).

## Commands

```bash
npm install
npm start          # opens Remotion Studio for live preview
npm run build       # renders the final MP4 to out/
npm run still       # renders a single still frame
```
