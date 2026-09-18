import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	OffthreadVideo,
	staticFile,
	useCurrentFrame,
} from 'remotion';
import type {SceneDefinition} from './types';

const PLACEHOLDER_PALETTES: Record<string, [string, string]> = {
	hook: ['#3a0d0d', '#8f1d1d'],
	panic: ['#1a0d0d', '#5c1414'],
	branding: ['#050b1a', '#0a2a6b'],
	vehicleArrival: ['#03101f', '#0b4f8a'],
	'repair-01-receive': ['#031418', '#0c4c55'],
	'repair-02-tools': ['#031418', '#0c4c55'],
	'repair-03-open': ['#031418', '#0c4c55'],
	'repair-04-replace': ['#031418', '#0c4c55'],
	'repair-05-test': ['#031418', '#0c4c55'],
	'repair-06-poweron': ['#04241a', '#0f9d6b'],
	relief: ['#241a04', '#a8730f'],
	brandEnding: ['#020617', '#0a1a3d'],
};

/**
 * Renders the real clip from public/clips when `scene.clip` is set.
 * Otherwise renders a labeled placeholder card so the cut's timing and
 * pacing can be reviewed before all footage is supplied.
 */
export const ClipScene: React.FC<{scene: SceneDefinition}> = ({scene}) => {
	const frame = useCurrentFrame();

	if (scene.clip) {
		return (
			<AbsoluteFill style={{backgroundColor: '#000'}}>
				<OffthreadVideo
					src={staticFile(`clips/${scene.clip}`)}
					style={{width: '100%', height: '100%', objectFit: 'cover'}}
				/>
			</AbsoluteFill>
		);
	}

	const [from, to] = PLACEHOLDER_PALETTES[scene.id] ?? ['#111', '#333'];
	const scale = interpolate(frame, [0, scene.durationInFrames], [1, 1.06]);

	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(160deg, ${from}, ${to})`,
				justifyContent: 'center',
				alignItems: 'center',
				transform: `scale(${scale})`,
			}}
		>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					padding: 80,
				}}
			>
				<div
					style={{
						fontFamily: 'Helvetica, Arial, sans-serif',
						fontSize: 30,
						letterSpacing: 6,
						color: 'rgba(255,255,255,0.55)',
						marginBottom: 24,
						textTransform: 'uppercase',
					}}
				>
					Placeholder — awaiting footage
				</div>
				<div
					style={{
						fontFamily: 'Helvetica, Arial, sans-serif',
						fontSize: 68,
						fontWeight: 800,
						color: 'white',
						textAlign: 'center',
						marginBottom: 28,
					}}
				>
					{scene.label}
				</div>
				<div
					style={{
						fontFamily: 'Helvetica, Arial, sans-serif',
						fontSize: 32,
						color: 'rgba(255,255,255,0.85)',
						textAlign: 'center',
						maxWidth: 800,
						lineHeight: 1.4,
					}}
				>
					{scene.description}
				</div>
			</AbsoluteFill>
			{scene.showLogoHint ? (
				<div style={{position: 'absolute', top: 60, right: 50}}>
					<Img
						src={staticFile('logo/retech-logo.png')}
						style={{width: 220, height: 'auto', opacity: 0.95}}
					/>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
