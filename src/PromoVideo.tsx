import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

type PromoVideoProps = {
	title: string;
	subtitle: string;
};

export const PromoVideo: React.FC<PromoVideoProps> = ({title, subtitle}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const titleScale = spring({
		frame,
		fps,
		config: {damping: 200},
	});

	const subtitleOpacity = interpolate(frame, [20, 45], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const hue = interpolate(frame, [0, durationInFrames], [220, 320]);

	const fadeOut = interpolate(
		frame,
		[durationInFrames - 30, durationInFrames],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(135deg, hsl(${hue}, 70%, 25%), hsl(${
					hue + 40
				}, 80%, 45%))`,
				justifyContent: 'center',
				alignItems: 'center',
				opacity: fadeOut,
			}}
		>
			<div
				style={{
					transform: `scale(${titleScale})`,
					fontSize: 120,
					fontWeight: 'bold',
					color: 'white',
					fontFamily: 'Helvetica, Arial, sans-serif',
					textShadow: '0 8px 30px rgba(0,0,0,0.35)',
				}}
			>
				{title}
			</div>
			<div
				style={{
					marginTop: 30,
					fontSize: 48,
					color: 'white',
					opacity: subtitleOpacity,
					fontFamily: 'Helvetica, Arial, sans-serif',
					letterSpacing: 4,
				}}
			>
				{subtitle}
			</div>
		</AbsoluteFill>
	);
};
