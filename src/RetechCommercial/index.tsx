import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {BrandingOverlay} from './BrandingOverlay';
import {END_CARD_DURATION_IN_FRAMES, TOTAL_DURATION_IN_FRAMES} from './clips';
import {EndCard} from './EndCard';
import {Scene} from '../RetechCommercial3D/Scene';
import {sceneRanges} from '../RetechCommercial3D/timeline';

const brandingRange = sceneRanges.branding;
const threeDDuration = TOTAL_DURATION_IN_FRAMES - END_CARD_DURATION_IN_FRAMES;

export const RetechCommercial: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			<Sequence from={0} durationInFrames={threeDDuration}>
				<Scene />
			</Sequence>
			<Sequence from={brandingRange.start} durationInFrames={brandingRange.duration}>
				<BrandingOverlay />
			</Sequence>
			<Sequence from={threeDDuration} durationInFrames={END_CARD_DURATION_IN_FRAMES}>
				<EndCard />
			</Sequence>
		</AbsoluteFill>
	);
};
