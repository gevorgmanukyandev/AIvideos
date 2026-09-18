# Retech commercial — clip slots

Drop the raw filmed/generated clips here with these exact filenames, then
set the matching `clip` field (currently `null`) in
`src/RetechCommercial/clips.ts` to the filename. Vertical 9:16 source
footage (1080x1920 or higher) works best with the `object-fit: cover`
scaling already set up in `ClipScene.tsx`.

| Filename (suggested)     | Scene (timecode)                    |
|---------------------------|--------------------------------------|
| `01-hook.mp4`              | Hook — phone falls & cracks (0–3s)   |
| `02-panic.mp4`             | Panic — broken screen close-up (3–6s)|
| `03-branding.mp4`          | Opens retech.am / calls (6–9s)       |
| `04-vehicle-arrival.mp4`   | Vehicle arrives (9–13s)              |
| `05-repair-receive.mp4`    | Technician receives phone            |
| `06-repair-tools.mp4`      | Repair tools close-up                |
| `07-repair-open.mp4`       | Phone opened                         |
| `08-repair-replace.mp4`    | Component replaced                   |
| `09-repair-test.mp4`       | Testing the phone                    |
| `10-repair-poweron.mp4`    | Screen turns on / works               |
| `11-relief.mp4`            | Businessman relieved (19–22s)        |
| `12-brand-ending.mp4`      | Vehicle drives away (22–~23.2s)      |

The end card (last ~1.8s) is generated entirely in code from the real
Retech logo at `public/logo/retech-logo.png` — no clip needed there.
