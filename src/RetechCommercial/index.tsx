import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {BrandingOverlay} from './BrandingOverlay';
import {END_CARD_DURATION_IN_FRAMES, scenes} from './clips';
import {ClipScene} from './ClipScene';
import {EndCard} from './EndCard';

export const RetechCommercial: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			<Series>
				{scenes.map((scene) => (
					<Series.Sequence key={scene.id} durationInFrames={scene.durationInFrames}>
						<ClipScene scene={scene} />
						{scene.id === 'branding' ? <BrandingOverlay /> : null}
					</Series.Sequence>
				))}
				<Series.Sequence durationInFrames={END_CARD_DURATION_IN_FRAMES}>
					<EndCard />
				</Series.Sequence>
			</Series>
		</AbsoluteFill>
	);
};
