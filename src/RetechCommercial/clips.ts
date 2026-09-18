import type {SceneDefinition} from './types';

/**
 * Single source of truth for the commercial's timing. The 3D staging in
 * `src/RetechCommercial3D/Scene.tsx` and the `retech.am`/phone-number
 * overlay both derive their frame ranges from this list, so the two never
 * drift apart.
 *
 * fps = 30. Frame counts match the client's second-by-second brief exactly
 * (0-3s, 3-6s, 6-9s, 9-13s, 13-19s, 19-22s, 22-25s = 750 frames / 25s).
 */
export const scenes: SceneDefinition[] = [
	{id: 'hook', durationInFrames: 90}, // 0–3s
	{id: 'panic', durationInFrames: 90}, // 3–6s
	{id: 'branding', durationInFrames: 90}, // 6–9s
	{id: 'vehicleArrival', durationInFrames: 120}, // 9–13s
	{id: 'repair-01-receive', durationInFrames: 30},
	{id: 'repair-02-tools', durationInFrames: 30},
	{id: 'repair-03-open', durationInFrames: 30},
	{id: 'repair-04-replace', durationInFrames: 30},
	{id: 'repair-05-test', durationInFrames: 30},
	{id: 'repair-06-poweron', durationInFrames: 30},
	{id: 'relief', durationInFrames: 90}, // 19–22s
	{id: 'brandEnding', durationInFrames: 36}, // first ~1.2s of 22–25s
];

/** Remaining ~1.8s of the 22–25s beat: the static premium end card. */
export const END_CARD_DURATION_IN_FRAMES = 54;

export const TOTAL_DURATION_IN_FRAMES =
	scenes.reduce((sum, s) => sum + s.durationInFrames, 0) +
	END_CARD_DURATION_IN_FRAMES;
