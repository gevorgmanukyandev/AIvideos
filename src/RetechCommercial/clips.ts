import type {SceneDefinition} from './types';

/**
 * Drop real footage into `public/clips/` and set the matching `clip`
 * filename below. Anything left as `null` renders as a labeled
 * placeholder card instead, so the full 25s cut can still be timed and
 * previewed before all footage exists.
 *
 * fps = 30. Frame counts below match the client's second-by-second brief
 * exactly (0-3s, 3-6s, 6-9s, 9-13s, 13-19s, 19-22s, 22-25s = 750 frames / 25s).
 */
export const scenes: SceneDefinition[] = [
	{
		id: 'hook',
		durationInFrames: 90, // 0–3s
		clip: null,
		label: 'HOOK',
		description:
			'Well-dressed young Armenian businessman rushing to a meeting — phone slips, slow-motion fall, CRACK on pavement, shocked reaction.',
	},
	{
		id: 'panic',
		durationInFrames: 90, // 3–6s
		clip: null,
		label: 'PANIC',
		description:
			'He picks up the cracked, unresponsive phone. Worried close-up on his face and the broken screen.',
	},
	{
		id: 'branding',
		durationInFrames: 90, // 6–9s
		clip: null,
		label: 'RETECH.AM',
		description:
			'Fast transition: he opens retech.am, then calls 098 588 935. "Phone broken? No time to waste."',
	},
	{
		id: 'vehicleArrival',
		durationInFrames: 120, // 9–13s
		clip: null,
		label: 'WE COME TO YOU',
		description:
			'Retech mobile repair vehicle (logo clearly visible, unaltered) drives fast through Yerevan and arrives — dynamic tracking shot.',
		showLogoHint: true,
	},
	{
		id: 'repair-01-receive',
		durationInFrames: 30,
		clip: null,
		label: 'RECEIVE',
		description: 'Technician gets out, receives the damaged phone.',
	},
	{
		id: 'repair-02-tools',
		durationInFrames: 30,
		clip: null,
		label: 'TOOLS',
		description: 'Close-up of professional repair tools.',
	},
	{
		id: 'repair-03-open',
		durationInFrames: 30,
		clip: null,
		label: 'OPEN',
		description: 'Phone being carefully opened.',
	},
	{
		id: 'repair-04-replace',
		durationInFrames: 30,
		clip: null,
		label: 'REPLACE',
		description: 'Damaged component being replaced.',
	},
	{
		id: 'repair-05-test',
		durationInFrames: 30,
		clip: null,
		label: 'TEST',
		description: 'Technician carefully testing the phone.',
	},
	{
		id: 'repair-06-poweron',
		durationInFrames: 30,
		clip: null,
		label: 'WORKS',
		description: 'Screen turns on — phone works perfectly.',
	},
	{
		id: 'relief',
		durationInFrames: 90, // 19–22s
		clip: null,
		label: 'RELIEF',
		description:
			'Businessman receives the repaired phone, checks it, stress turns to relief, confidently heads to his meeting.',
	},
	{
		id: 'brandEnding',
		durationInFrames: 36, // first ~1.2s of the 22–25s beat
		clip: null,
		label: 'BRAND ENDING — DRIVE AWAY',
		description: 'Retech vehicle drives away through Yerevan, logo visible.',
		showLogoHint: true,
	},
];

/** Remaining ~1.8s of the 22–25s beat: the static premium end card. */
export const END_CARD_DURATION_IN_FRAMES = 54;

export const TOTAL_DURATION_IN_FRAMES =
	scenes.reduce((sum, s) => sum + s.durationInFrames, 0) +
	END_CARD_DURATION_IN_FRAMES;
