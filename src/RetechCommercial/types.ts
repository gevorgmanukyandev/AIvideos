export type SceneId =
	| 'hook'
	| 'panic'
	| 'branding'
	| 'vehicleArrival'
	| 'repair-01-receive'
	| 'repair-02-tools'
	| 'repair-03-open'
	| 'repair-04-replace'
	| 'repair-05-test'
	| 'repair-06-poweron'
	| 'relief'
	| 'brandEnding';

export type SceneDefinition = {
	id: SceneId;
	durationInFrames: number;
	/**
	 * Filename of the clip inside `public/clips/`, e.g. "01-hook.mp4".
	 * Leave `null` until the real footage is supplied — a labeled
	 * placeholder card is rendered instead so timing/pacing can still
	 * be previewed and rendered.
	 */
	clip: string | null;
	label: string;
	description: string;
	/** Shows a small corner logo watermark on the placeholder card only,
	 * as a reminder that the Retech logo must be visible on the vehicle
	 * in this shot's real footage. Has no effect once `clip` is set. */
	showLogoHint?: boolean;
};
