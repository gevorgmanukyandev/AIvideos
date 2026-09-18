import React from 'react';

export type MannequinPose = {
	/** Walk-cycle phase in radians; drives leg/arm swing. */
	stridePhase: number;
	strideAmount: number;
	torsoTilt: number;
	headTilt: number;
	armRaiseL: number;
	armRaiseR: number;
	crouch: number;
};

export const idlePose: MannequinPose = {
	stridePhase: 0,
	strideAmount: 0,
	torsoTilt: 0,
	headTilt: 0,
	armRaiseL: 0,
	armRaiseR: 0,
	crouch: 0,
};

type MannequinProps = {
	position: [number, number, number];
	rotationY: number;
	pose: MannequinPose;
	bodyColor: string;
	accentColor: string;
	height?: number;
};

/**
 * Faceless, glossy "mannequin-silhouette" humanoid — a deliberate premium
 * stylization (seen in real auto/tech commercials) rather than an attempt
 * at a photoreal or cartoon character.
 */
export const Mannequin: React.FC<MannequinProps> = ({
	position,
	rotationY,
	pose,
	bodyColor,
	accentColor,
	height = 1.75,
}) => {
	const legLength = height * 0.5 - pose.crouch * 0.15;
	const torsoHeight = height * 0.33;
	const headRadius = height * 0.09;
	const hipY = legLength;
	const shoulderY = hipY + torsoHeight * 0.92;

	const legSwingL = Math.sin(pose.stridePhase) * pose.strideAmount;
	const legSwingR = Math.sin(pose.stridePhase + Math.PI) * pose.strideAmount;
	const armSwingL = Math.sin(pose.stridePhase + Math.PI) * pose.strideAmount * 0.7;
	const armSwingR = Math.sin(pose.stridePhase) * pose.strideAmount * 0.7;

	const bodyMat = (
		<meshPhysicalMaterial
			color={bodyColor}
			roughness={0.28}
			metalness={0.15}
			clearcoat={0.6}
			clearcoatRoughness={0.25}
		/>
	);

	return (
		<group position={position} rotation={[0, rotationY, 0]}>
			<group rotation={[pose.torsoTilt, 0, 0]}>
				{/* legs */}
				<group position={[0.12, hipY, 0]} rotation={[legSwingL, 0, 0]}>
					<mesh position={[0, -legLength / 2, 0]} castShadow>
						<capsuleGeometry args={[0.09, legLength * 0.8, 4, 8]} />
						{bodyMat}
					</mesh>
				</group>
				<group position={[-0.12, hipY, 0]} rotation={[legSwingR, 0, 0]}>
					<mesh position={[0, -legLength / 2, 0]} castShadow>
						<capsuleGeometry args={[0.09, legLength * 0.8, 4, 8]} />
						{bodyMat}
					</mesh>
				</group>

				{/* torso */}
				<mesh position={[0, hipY + torsoHeight / 2, 0]} castShadow>
					<capsuleGeometry args={[0.22, torsoHeight * 0.6, 4, 8]} />
					<meshPhysicalMaterial
						color={accentColor}
						roughness={0.32}
						metalness={0.2}
						clearcoat={0.6}
					/>
				</mesh>

				{/* head */}
				<group rotation={[pose.headTilt, 0, 0]}>
					<mesh
						position={[0, shoulderY + headRadius * 1.6, 0]}
						castShadow
					>
						<sphereGeometry args={[headRadius, 24, 24]} />
						{bodyMat}
					</mesh>
				</group>

				{/* arms */}
				{[1, -1].map((side) => (
					<group
						key={side}
						position={[side * 0.27, shoulderY, 0]}
						rotation={[
							(side > 0 ? armSwingL - pose.armRaiseL : armSwingR - pose.armRaiseR),
							0,
							side * 0.12,
						]}
					>
						<mesh castShadow>
							<sphereGeometry args={[0.09, 16, 16]} />
							<meshPhysicalMaterial
								color={accentColor}
								roughness={0.32}
								metalness={0.2}
								clearcoat={0.6}
							/>
						</mesh>
						<mesh position={[0, -height * 0.22, 0]} castShadow>
							<capsuleGeometry args={[0.075, height * 0.36, 4, 8]} />
							{bodyMat}
						</mesh>
					</group>
				))}
			</group>
		</group>
	);
};
