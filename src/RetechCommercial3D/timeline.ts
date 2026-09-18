import {scenes} from '../RetechCommercial/clips';

export type SceneRange = {start: number; end: number; duration: number};

const build = (): Record<string, SceneRange> => {
	const ranges: Record<string, SceneRange> = {};
	let cursor = 0;
	for (const s of scenes) {
		ranges[s.id] = {
			start: cursor,
			end: cursor + s.durationInFrames - 1,
			duration: s.durationInFrames,
		};
		cursor += s.durationInFrames;
	}
	return ranges;
};

/** Absolute frame ranges for each story beat, derived from clips.ts so
 * the 3D staging and the 2D overlay timing never drift apart. */
export const sceneRanges = build();

export const TOTAL_3D_FRAMES = Object.values(sceneRanges).reduce(
	(max, r) => Math.max(max, r.end + 1),
	0
);
