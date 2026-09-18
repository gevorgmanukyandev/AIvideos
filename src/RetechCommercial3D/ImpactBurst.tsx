import React, {useMemo} from 'react';

type ImpactBurstProps = {
	position: [number, number, number];
	/** Frames elapsed since the impact instant (0 = the exact hit frame). */
	sinceImpact: number;
};

type Shard = {angle: number; speed: number; size: number; spin: number};

const SHARD_COUNT = 10;
const LIFETIME = 16;

/**
 * A brief shockwave ring + a handful of glass shards flying off the
 * impact point, so the phone hitting the ground reads as a real break
 * rather than a texture silently appearing.
 */
export const ImpactBurst: React.FC<ImpactBurstProps> = ({
	position,
	sinceImpact,
}) => {
	const shards = useMemo<Shard[]>(
		() =>
			Array.from({length: SHARD_COUNT}, (_, i) => ({
				angle: (i / SHARD_COUNT) * Math.PI * 2 + Math.random() * 0.5,
				speed: 0.55 + Math.random() * 0.75,
				size: 0.02 + Math.random() * 0.035,
				spin: (Math.random() - 0.5) * 18,
			})),
		[]
	);

	if (sinceImpact < 0 || sinceImpact > LIFETIME) return null;

	const t = sinceImpact / LIFETIME;
	const ringRadius = 0.05 + t * 0.55;
	const ringOpacity = Math.max(0, 1 - t * 1.3);

	return (
		<group position={position}>
			{/* shockwave ring, flat on the ground */}
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
				<ringGeometry args={[ringRadius * 0.7, ringRadius, 32]} />
				<meshBasicMaterial
					color="#ffffff"
					transparent
					opacity={ringOpacity}
					toneMapped={false}
				/>
			</mesh>
			{/* flash */}
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
				<circleGeometry args={[0.08 * Math.max(0, 1 - t * 3), 16]} />
				<meshBasicMaterial
					color="#ffffff"
					transparent
					opacity={Math.max(0, 1 - t * 4)}
					toneMapped={false}
				/>
			</mesh>
			{/* flying glass shards */}
			{shards.map((s, i) => {
				const dist = s.speed * t * (1 - t * 0.3);
				const x = Math.cos(s.angle) * dist;
				const z = Math.sin(s.angle) * dist;
				const y = Math.max(0, 0.25 * t - 1.1 * t * t) + 0.01;
				return (
					<mesh
						key={i}
						position={[x, y, z]}
						rotation={[s.spin * t, s.spin * t * 0.6, s.spin * t * 0.3]}
					>
						<planeGeometry args={[s.size, s.size]} />
						<meshBasicMaterial
							color="#dfeeff"
							transparent
							opacity={Math.max(0, 0.9 - t)}
							side={2}
							toneMapped={false}
						/>
					</mesh>
				);
			})}
		</group>
	);
};
