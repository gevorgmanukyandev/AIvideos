# Retech.am — 3D animated commercial: AI video-gen prompt kit

> **Status:** superseded as the default pipeline. The project now renders
> the whole commercial natively in Remotion + Three.js
> (`src/RetechCommercial3D/`) at zero cost, with no external tool needed.
> This kit is kept only as an optional future upgrade path, if a paid
> AI video generator is ever wanted for a higher-fidelity pass — it's not
> part of the current render.

Use this with a 3D/cinematic-capable AI video generator (Runway Gen-3/4,
Kling, Pika, Luma, Veo, Sora, etc). Generate each clip separately, save it
with the suggested filename into `public/clips/`, then tell me the
filenames — I'll wire them into `src/RetechCommercial/clips.ts` and render
the final 1080×1920 cut in Remotion (which already handles all overlays,
timing, and the end card).

**Duration note:** most tools have a ~4–6s minimum clip length even for
beats that only need 1–3s in the final edit. Generate at the tool's
minimum length; I'll trim/speed-ramp in the edit to hit the exact timing
below. Generate everything at **9:16 vertical**, 24 or 30fps.

**Logo note:** do not ask the video generator to invent the Retech logo —
these tools cannot reproduce a specific provided logo accurately and will
hallucinate distorted text. Instead, generate the vehicle with a **clean
blue/white liveried body and a blank rectangular panel on the side** (no
text, no logo). I will composite your real, unaltered logo onto that panel
and onto the end card in Remotion, exactly as required by the brief. If
your chosen tool supports reference-image/"ingredients"/"elements"
conditioning, you can optionally feed it `public/logo/retech-logo.png` for
the vehicle panel — but the blank-panel + post-compositing route is the
reliable default.

---

## Global style prefix

Prepend this to every prompt for visual consistency:

> Premium 3D commercial animation, cinematic realistic proportions,
> modern polished CGI advertising style (think automotive/tech commercial
> 3D render, not a video game cutscene), detailed environments, physically
> based rendering, soft realistic lighting with defined shadows and subtle
> rim light, shallow depth of field, dynamic camera movement, color-graded
> teal-and-blue premium palette with warm skin tones, slightly stylized
> character proportions (realistic body proportions, subtly smoothed
> facial features — not cartoonish). Vertical 9:16 frame.
>
> Negative: no anime, no chibi, no exaggerated cartoon proportions, no
> big-eyed Pixar-style comedic characters, no childish look, no low-poly
> flat-shaded look, no claymation, no photorealistic human (this is
> stylized 3D, not live-action), no on-screen text or logos unless stated.

## Character sheets (reuse verbatim for consistency across clips)

**Businessman:** Young Armenian man, late 20s, short dark well-groomed
hair, light stubble, sharp navy tailored suit with white shirt and no tie
(top button open), confident but rushed posture, carrying a leather
messenger bag, modern smartphone with a dark glass back.

**Technician:** Male, early 30s, short hair, athletic build, wearing a
fitted dark-blue technical jumpsuit/polo with light-blue piping (matching
the Retech brand blue), sleeves rolled up, calm and precise movements,
professional demeanor.

**Vehicle:** Compact modern service van/hatchback, two-tone livery: deep
blue lower body fading to white upper body (matching the logo's blue
gradient), clean minimal design, one blank rectangular panel on each side
and the rear for the logo (leave empty, no text), roof-mounted subtle
service light bar.

**Environment:** Recognizable modern Yerevan streetscape — Cascade
Complex steps, Republic Square colonnades, or a tree-lined central
avenue with pink-tuff-stone buildings — golden-hour or crisp daylight,
light traffic, realistic urban detail.

---

## Scene 1 — HOOK (0–3s)

> [style prefix] Low tracking shot following [businessman] as he strides
> fast down a Yerevan avenue with pink-stone buildings, checking his
> watch, clearly late for a meeting. He reaches into his jacket pocket and
> his smartphone slips from his fingers. Extreme slow motion as the phone
> tumbles through the air, camera whip-pans down to track it. The phone
> hits the pavement screen-first — sharp impact, a spark of shattered
> glass fragments freezing mid-air at the moment of impact. Hard cut to
> his face: eyes widening in shock, mouth opening. Fast dynamic camera,
> high contrast dramatic lighting.

Filename: `01-hook.mp4`

## Scene 2 — PANIC (3–6s)

> [style prefix] Close-up: [businessman] kneels and snatches the phone off
> the pavement. The screen is visibly cracked with a fractured glass
> pattern, flickering, dim. He taps the screen urgently with his thumb —
> no response. Extreme close-up on his furrowed, worried face lit by the
> faint dying glow of the broken screen. Quick handheld camera shake,
> tense, claustrophobic framing.

Filename: `02-panic.mp4`

## Scene 3 — RETECH BRANDING (6–9s)

> [style prefix] [Businessman] straightens up, pulls out a second device
> (or the same phone with a miraculously readable browser for this shot),
> taps rapidly with urgency and purpose — a determined, hopeful
> expression replacing panic. Quick cut to him raising the phone to his
> ear, speaking briefly and firmly. Fast punchy editing rhythm, camera
> pushes in tight on his face and hands. Leave the upper third and lower
> third of frame relatively uncluttered — text will be added in post.

Filename: `03-branding.mp4`

## Scene 4 — VEHICLE ARRIVAL (9–13s)

> [style prefix] The Retech [vehicle] accelerates down a wide Yerevan
> boulevard, dynamic low-angle side tracking shot, camera speed-matched
> to the van, motion-blurred background buildings. Hard cut to a sweeping
> drone-style tracking shot as the van brakes and pulls up at the curb
> near [businessman], side panel facing camera (panel left blank for the
> logo). Sun flare, confident and heroic camera language.

Filename: `04-vehicle-arrival.mp4`

## Scene 5 — REPAIR MONTAGE (13–19s, ~6s total)

Generate as **one continuous ~6–8s take** (or 2–3 shorter connected
shots) — I will cut it into fast sub-beats in the edit:

> [style prefix] [Technician] steps out of the van and walks briskly to
> [businessman], receiving the cracked phone with both hands — quick
> close-up on the hand-off. Cut to a macro close-up of a precision
> screwdriver and repair tools laid out on a portable service tray. Cut
> to the phone's back panel being carefully lifted with a suction tool,
> revealing clean stylized internal components glowing faintly blue. A
> small component is lifted out with tweezers and a new one placed in.
> Cut to the technician pressing a diagnostic button, phone screen
> flickers. Final beat: the screen turns fully on, bright and flawless,
> reflecting in the technician's satisfied half-smile. Fast rhythmic
> editing, macro lens close-ups, crisp studio-quality product lighting
> mixed with the ambient street scene.

Filename: `05-repair-montage.mp4`

## Scene 6 — RELIEF (19–22s)

> [style prefix] [Businessman] takes the repaired phone back from
> [technician] with a firm grateful handshake gesture, glances at the
> screen — swipes through it naturally — his expression shifts from
> tension to visible relief and a confident smile. He tucks the phone
> into his jacket, adjusts his cuff, and strides off purposefully toward
> a glass office building entrance, energetic forward-tracking camera.

Filename: `06-relief.mp4`

## Scene 7 — BRAND ENDING / DRIVE AWAY (22–~23.5s)

> [style prefix] Wide cinematic shot: the Retech [vehicle] pulls away
> from the curb and drives off down the Yerevan avenue, camera holds
> static or slow-pans as it recedes into soft background blur, warm
> late-afternoon light. Clean, calm, confident closing composition with
> negative space at top for a logo overlay.

Filename: `07-brand-ending.mp4`

*(The final end card itself — logo, "Retech.am", the two Armenian lines,
and the phone number — is already built entirely in code from your real
logo file and needs no video generation.)*

---

## Mapping back into the project

Once you have the files, drop them into `public/clips/` using the names
above and tell me — I'll update the `clip` field for each entry in
`src/RetechCommercial/clips.ts` (currently `null`) and re-render
`npm run render:retech` for the final MP4.
