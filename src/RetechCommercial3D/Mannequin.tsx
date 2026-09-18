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
	hairColor?: string;
	height?: number;
};

/**
 * Faceless "mannequin-silhouette" humanoid — a deliberate premium
 * stylization (seen in real auto/tech commercials) rather than an attempt
 * at a photoreal or cartoon character. Two-segment limbs with elbow/knee
 * bend, matte fabric + skin materials, and grounded proportions (hair,
 * neck, belt, hands, shoes) keep it from reading as a rigid plastic toy.
 */
export const Mannequin: React.FC<MannequinProps> = ({
	position,
	rotationY,
	pose,
	bodyColor,
	accentColor,
	skinTone = '#c99a72',
	hairColor = '#231a14',
	height = 1.75,
}) => {
	const legLength = height * 0.49;
	const thighLength = legLength * 0.52;
	const shinLength = legLength * 0.48;
	const torsoHeight = height * 0.32;
	const headRadius = height * 0.065;
	const bodyDrop = pose.crouch * height * 0.16;
	const hipY = legLength - bodyDrop;
	const shoulderY = hipY + torsoHeight * 0.88;
	const neckY = hipY + torsoHeight * 1.02;

	const legSwingL = Math.sin(pose.stridePhase) * pose.strideAmount;
	const legSwingR = Math.sin(pose.stridePhase + Math.PI) * pose.strideAmount;
	const armSwingL = Math.sin(pose.stridePhase + Math.PI) * pose.strideAmount * 0.7;
	const armSwingR = Math.sin(pose.stridePhase) * pose.strideAmount * 0.7;

	const kneeBendBase = pose.crouch * 1.15;
	const kneeBendL = kneeBendBase + Math.max(0, Math.sin(pose.stridePhase)) * pose.strideAmount * 1.3;
	const kneeBendR =
		kneeBendBase + Math.max(0, Math.sin(pose.stridePhase + Math.PI)) * pose.strideAmount * 1.3;
	const elbowBendL = Math.max(0, Math.sin(pose.stridePhase + Math.PI)) * pose.strideAmount * 0.5;
	const elbowBendR = Math.max(0, Math.sin(pose.stridePhase)) * pose.strideAmount * 0.5;

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
				{/* legs: thigh -> knee -> shin -> shoe */}
				{[
					{x: 0.11, swing: legSwingL, knee: kneeBendL},
					{x: -0.11, swing: legSwingR, knee: kneeBendR},
				].map((leg, idx) => (
					<group key={idx} position={[leg.x, hipY, 0]} rotation={[leg.swing, 0, 0]}>
						<mesh position={[0, -thighLength / 2, 0]} castShadow>
							<capsuleGeometry args={[0.085, thighLength * 0.75, 4, 8]} />
							{fabricMat}
						</mesh>
						<group position={[0, -thighLength, 0]} rotation={[leg.knee, 0, 0]}>
							<mesh position={[0, -shinLength / 2, 0]} castShadow>
								<capsuleGeometry args={[0.07, shinLength * 0.8, 4, 8]} />
								{fabricMat}
							</mesh>
							<mesh position={[0, -shinLength - 0.02, 0.05]} castShadow>
								<boxGeometry args={[0.095, 0.075, 0.23]} />
								{shoeMat}
							</mesh>
						</group>
					</group>
				))}

				{/* torso (jacket) */}
				<mesh position={[0, hipY + torsoHeight / 2, 0]} castShadow>
					<capsuleGeometry args={[0.2, torsoHeight * 0.55, 4, 8]} />
					{fabricMat}
				</mesh>
				{/* belt line */}
				<mesh position={[0, hipY + 0.02, 0]} castShadow>
					<torusGeometry args={[0.205, 0.02, 8, 20]} />
					<meshStandardMaterial color="#15151a" roughness={0.5} metalness={0.3} />
				</mesh>
				{/* shirt/accent panel at the chest */}
				<mesh position={[0, neckY - 0.05, 0.16]} castShadow>
					<boxGeometry args={[0.15, 0.24, 0.03]} />
					<meshPhysicalMaterial color={accentColor} roughness={0.5} metalness={0.05} />
				</mesh>

				{/* neck */}
				<mesh position={[0, neckY, 0]} castShadow>
					<cylinderGeometry args={[0.052, 0.062, 0.12, 12]} />
					{skinMat}
				</mesh>

				{/* head + hair */}
				<group rotation={[pose.headTilt, 0, 0]}>
					<mesh position={[0, neckY + 0.1 + headRadius, 0]} castShadow>
						<sphereGeometry args={[headRadius, 24, 24]} />
						{skinMat}
					</mesh>
					<mesh
						position={[0, neckY + 0.1 + headRadius * 1.35, -headRadius * 0.12]}
						scale={[1.04, 0.62, 1.08]}
						castShadow
					>
						<sphereGeometry args={[headRadius * 0.98, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
						<meshStandardMaterial color={hairColor} roughness={0.75} />
					</mesh>
				</group>

				{/* arms: shoulder -> elbow -> forearm -> hand */}
				{[1, -1].map((side) => {
					const armSwing = side > 0 ? armSwingL - pose.armRaiseL : armSwingR - pose.armRaiseR;
					const elbowBend = side > 0 ? elbowBendL : elbowBendR;
					return (
						<group
							key={side}
							position={[side * 0.24, shoulderY, 0]}
							rotation={[armSwing, 0, side * 0.1]}
						>
							<mesh castShadow>
								<sphereGeometry args={[0.07, 16, 16]} />
								{fabricMat}
							</mesh>
							<mesh position={[0, -height * 0.135, 0]} castShadow>
								<capsuleGeometry args={[0.062, height * 0.19, 4, 8]} />
								{fabricMat}
							</mesh>
							<group position={[0, -height * 0.27, 0]} rotation={[-elbowBend, 0, 0]}>
								<mesh position={[0, -height * 0.12, 0]} castShadow>
									<capsuleGeometry args={[0.05, height * 0.17, 4, 8]} />
									{fabricMat}
								</mesh>
								<mesh position={[0, -height * 0.22, 0]} castShadow>
									<sphereGeometry args={[0.048, 12, 12]} />
									{skinMat}
								</mesh>
							</group>
						</group>
					);
				})}
			</group>
		</group>
	);
};
