import React, {useMemo} from 'react';
import {makeNoiseTexture} from './proceduralTextures';

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
	/** Suit/uniform color. */
	bodyColor: string;
	/** Shirt/accent panel color, visible at the collar and torso front. */
	accentColor: string;
	/** Warm matte skin tone for head/neck/hands. */
	skinTone?: string;
	height?: number;
};

/**
 * Faceless "mannequin-silhouette" humanoid — a deliberate premium
 * stylization (seen in real auto/tech commercials) rather than an attempt
 * at a photoreal or cartoon character. Matte fabric + skin materials and
 * grounded proportions (neck, hands, shoes) keep it from reading as a
 * glossy plastic toy.
 */
export const Mannequin: React.FC<MannequinProps> = ({
	position,
	rotationY,
	pose,
	bodyColor,
	accentColor,
	skinTone = '#c99a72',
	height = 1.75,
}) => {
	const legLength = height * 0.49 - pose.crouch * 0.15;
	const torsoHeight = height * 0.32;
	const headRadius = height * 0.065;
	const hipY = legLength;
	const shoulderY = hipY + torsoHeight * 0.88;
	const neckY = hipY + torsoHeight * 1.02;

	const legSwingL = Math.sin(pose.stridePhase) * pose.strideAmount;
	const legSwingR = Math.sin(pose.stridePhase + Math.PI) * pose.strideAmount;
	const armSwingL = Math.sin(pose.stridePhase + Math.PI) * pose.strideAmount * 0.7;
	const armSwingR = Math.sin(pose.stridePhase) * pose.strideAmount * 0.7;

	const fabricTexture = useMemo(
		() => makeNoiseTexture(bodyColor, 0.06),
		[bodyColor]
	);
	const skinTexture = useMemo(
		() => makeNoiseTexture(skinTone, 0.05),
		[skinTone]
	);

	const fabricMat = (
		<meshPhysicalMaterial
			map={fabricTexture}
			roughness={0.72}
			metalness={0.02}
			clearcoat={0.05}
		/>
	);
	const skinMat = (
		<meshPhysicalMaterial
			map={skinTexture}
			roughness={0.55}
			metalness={0}
			clearcoat={0.08}
		/>
	);
	const shoeMat = (
		<meshStandardMaterial color="#14161a" roughness={0.45} metalness={0.1} />
	);

	return (
		<group position={position} rotation={[0, rotationY, 0]}>
			<group rotation={[pose.torsoTilt, 0, 0]}>
				{/* legs + shoes */}
				{[0.12, -0.12].map((x, idx) => (
					<group
						key={x}
						position={[x, hipY, 0]}
						rotation={[idx === 0 ? legSwingL : legSwingR, 0, 0]}
					>
						<mesh position={[0, -legLength / 2, 0]} castShadow>
							<capsuleGeometry args={[0.085, legLength * 0.82, 4, 8]} />
							{fabricMat}
						</mesh>
						<mesh position={[0, -legLength - 0.02, 0.05]} castShadow>
							<boxGeometry args={[0.1, 0.08, 0.24]} />
							{shoeMat}
						</mesh>
					</group>
				))}

				{/* torso (jacket) */}
				<mesh position={[0, hipY + torsoHeight / 2, 0]} castShadow>
					<capsuleGeometry args={[0.205, torsoHeight * 0.55, 4, 8]} />
					{fabricMat}
				</mesh>
				{/* shirt/accent panel at the chest */}
				<mesh position={[0, neckY - 0.05, 0.17]} castShadow>
					<boxGeometry args={[0.16, 0.24, 0.03]} />
					<meshPhysicalMaterial color={accentColor} roughness={0.5} metalness={0.05} />
				</mesh>

				{/* neck */}
				<mesh position={[0, neckY, 0]} castShadow>
					<cylinderGeometry args={[0.055, 0.065, 0.12, 12]} />
					{skinMat}
				</mesh>

				{/* head */}
				<group rotation={[pose.headTilt, 0, 0]}>
					<mesh position={[0, neckY + 0.1 + headRadius, 0]} castShadow>
						<sphereGeometry args={[headRadius, 24, 24]} />
						{skinMat}
					</mesh>
				</group>

				{/* arms + hands */}
				{[1, -1].map((side) => (
					<group
						key={side}
						position={[side * 0.25, shoulderY, 0]}
						rotation={[
							(side > 0 ? armSwingL - pose.armRaiseL : armSwingR - pose.armRaiseR),
							0,
							side * 0.1,
						]}
					>
						<mesh castShadow>
							<sphereGeometry args={[0.075, 16, 16]} />
							{fabricMat}
						</mesh>
						<mesh position={[0, -height * 0.21, 0]} castShadow>
							<capsuleGeometry args={[0.065, height * 0.34, 4, 8]} />
							{fabricMat}
						</mesh>
						<mesh position={[0, -height * 0.4, 0]} castShadow>
							<sphereGeometry args={[0.055, 12, 12]} />
							{skinMat}
						</mesh>
					</group>
				))}
			</group>
		</group>
	);
};
