import React from 'react';
import {Composition} from 'remotion';
import {PromoVideo} from './PromoVideo';
import {RetechCommercial} from './RetechCommercial';
import {TOTAL_DURATION_IN_FRAMES} from './RetechCommercial/clips';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="PromoVideo"
				component={PromoVideo}
				durationInFrames={300}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					title: 'AI Videos',
					subtitle: 'Made with Remotion',
				}}
			/>
			<Composition
				id="RetechCommercial"
				component={RetechCommercial}
				durationInFrames={TOTAL_DURATION_IN_FRAMES}
				fps={30}
				width={1080}
				height={1920}
			/>
		</>
	);
};
