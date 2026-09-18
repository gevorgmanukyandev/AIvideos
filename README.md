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

Render the `RetechCommercial` composition to `out/retech-commercial.mp4`:

```bash
npm run render:retech
```

## Project structure

- `src/index.ts` — Remotion entry point, registers the root component.
- `src/Root.tsx` — Declares all video compositions (`<Composition>`).
- `src/PromoVideo.tsx` — A 10-second (300 frames @ 30fps, 1920x1080) sample
  promotional video with an animated title, subtitle, and color-shifting
  background gradient, ending with a fade-out.
- `src/RetechCommercial/` — A 25-second (750 frames @ 30fps, 1080x1920
  vertical) commercial for Retech.am, cut scene-by-scene to the client's
  second-by-second brief (hook → panic → branding → vehicle arrival →
  repair montage → relief → brand ending/end card).
  [`src/RetechCommercial/clips.ts`](src/RetechCommercial/clips.ts) is the
  single source of truth for scene timing. The end card is generated from
  the real, unaltered Retech logo at `public/logo/retech-logo.png`.
- `src/RetechCommercial3D/` — The stylized 3D world the commercial is
  rendered in: a Three.js scene (via `@remotion/three`) with a procedural
  Yerevan street, a faceless "glossy mannequin" businessman/technician
  (`Mannequin.tsx`), a phone prop with a procedural crack texture
  (`Phone.tsx`), a service vehicle with the real logo texture-mapped onto
  it (`Vehicle.tsx`), and `Scene.tsx`, which stages the camera/characters
  for every beat. Everything renders natively — no external video
  generator or paid API involved.
- `remotion.config.ts` — Build/render configuration.

## Notes on this environment

This sandbox cannot download Remotion's default `chrome-headless-shell`
binary (network egress is restricted), so `remotion.config.ts` points
Chromium rendering at a preinstalled Chrome-for-Testing binary instead. If
you run this project elsewhere with unrestricted network access, you can
remove the `Config.setBrowserExecutable(...)` and `Config.setChromeMode(...)`
lines from `remotion.config.ts` and Remotion will download and manage its
own browser automatically.
