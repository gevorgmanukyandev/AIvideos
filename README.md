# AI Videos

AI-generated promotional videos built with [Remotion](https://www.remotion.dev/).

## Setup

Dependencies are installed via npm:

```bash
npm install
```

## Development

Open the Remotion Studio to preview and edit compositions in the browser:

```bash
npm start
```

## Rendering

Render the `PromoVideo` composition to an MP4 file at `out/promo-video.mp4`:

```bash
npm run render
```

## Project structure

- `src/index.ts` — Remotion entry point, registers the root component.
- `src/Root.tsx` — Declares all video compositions (`<Composition>`).
- `src/PromoVideo.tsx` — A 10-second (300 frames @ 30fps, 1920x1080) sample
  promotional video with an animated title, subtitle, and color-shifting
  background gradient, ending with a fade-out.
- `remotion.config.ts` — Build/render configuration.

## Notes on this environment

This sandbox cannot download Remotion's default `chrome-headless-shell`
binary (network egress is restricted), so `remotion.config.ts` points
Chromium rendering at a preinstalled Chrome-for-Testing binary instead. If
you run this project elsewhere with unrestricted network access, you can
remove the `Config.setBrowserExecutable(...)` and `Config.setChromeMode(...)`
lines from `remotion.config.ts` and Remotion will download and manage its
own browser automatically.
