import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

const fadeWindow = (
	frame: number,
	inStart: number,
	inEnd: number,
	outStart: number,
	outEnd: number
) =>
	interpolate(
		frame,
		[inStart, inEnd, outStart, outEnd],
		[0, 1, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

/**
 * Overlay for the 6–9s "RETECH" beat: retech.am, then the phone number,
 * then the tagline — matching the brief's sequence within one scene.
 */
export const BrandingOverlay: React.FC = () => {
	const frame = useCurrentFrame();

	const websiteOpacity = fadeWindow(frame, 0, 6, 34, 42);
	const phoneOpacity = fadeWindow(frame, 18, 26, 54, 62);
	const taglineOpacity = fadeWindow(frame, 46, 56, 84, 90);

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'flex-end',
				alignItems: 'center',
				paddingBottom: 220,
			}}
		>
			<div
				style={{
					opacity: websiteOpacity,
					fontFamily: 'Helvetica, Arial, sans-serif',
					fontWeight: 800,
					fontSize: 76,
					color: 'white',
					textShadow: '0 6px 24px rgba(0,0,0,0.6)',
					letterSpacing: 1,
				}}
			>
				retech.am
			</div>
			<div
				style={{
					opacity: phoneOpacity,
					fontFamily: 'Helvetica, Arial, sans-serif',
					fontWeight: 700,
					fontSize: 56,
					color: '#4fc3ff',
					textShadow: '0 4px 18px rgba(0,0,0,0.6)',
					marginTop: 14,
					letterSpacing: 1,
				}}
			>
				098 588 935
			</div>
			<div
				style={{
					opacity: taglineOpacity,
					fontFamily: 'Helvetica, Arial, sans-serif',
					fontWeight: 500,
					fontSize: 34,
					color: 'rgba(255,255,255,0.92)',
					marginTop: 30,
					textAlign: 'center',
					padding: '0 60px',
				}}
			>
				Phone broken? No time to waste.
			</div>
		</AbsoluteFill>
	);
};
