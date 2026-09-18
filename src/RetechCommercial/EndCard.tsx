import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

/**
 * Premium end card. Uses the client-supplied Retech logo file verbatim —
 * it is only scaled/positioned here, never redrawn, recolored or
 * re-typeset.
 */
export const EndCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const logoIn = spring({frame, fps, config: {damping: 200}});
	const textOpacity = interpolate(frame, [10, 24], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const bgFade = interpolate(frame, [0, 12], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#03050c',
				opacity: bgFade,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(circle at 50% 35%, rgba(20,90,200,0.35), transparent 60%)',
				}}
			/>
			<div
				style={{
					transform: `scale(${logoIn})`,
					marginBottom: 46,
				}}
			>
				<Img
					src={staticFile('logo/retech-logo.png')}
					style={{width: 620, height: 'auto'}}
				/>
			</div>
			<div
				style={{
					opacity: textOpacity,
					fontFamily: 'Helvetica, Arial, sans-serif',
					textAlign: 'center',
					color: 'white',
				}}
			>
				<div style={{fontSize: 42, fontWeight: 700, marginBottom: 18}}>
					Retech.am
				</div>
				<div
					style={{
						fontSize: 30,
						fontWeight: 400,
						color: 'rgba(255,255,255,0.85)',
						marginBottom: 10,
					}}
				>
					Հեռախոսների առք • վաճառք • վերանորոգում
				</div>
				<div
					style={{
						fontSize: 30,
						fontWeight: 400,
						color: 'rgba(255,255,255,0.85)',
						marginBottom: 26,
					}}
				>
					Վերանորոգում Ձեր հասցեում
				</div>
				<div style={{fontSize: 44, fontWeight: 800, color: '#4fc3ff'}}>
					098 588 935
				</div>
			</div>
		</AbsoluteFill>
	);
};
