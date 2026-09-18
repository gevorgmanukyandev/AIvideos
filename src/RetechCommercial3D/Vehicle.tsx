import React from 'react';
import {useStaticTexture} from './useStaticTexture';

const LOGO_ASPECT = 1983 / 793;

type VehicleProps = {
	position: [number, number, number];
	rotationY?: number;
};

/**
 * Retech service vehicle. The logo plane uses the client-supplied PNG
 * (public/logo/retech-logo.png) verbatim — only scaled/placed here, never
 * redrawn or recolored.
 */
export const Vehicle: React.FC<VehicleProps> = ({
	position,
	rotationY = 0,
}) => {
	const logoTexture = useStaticTexture('logo/retech-logo.png');
	const logoWidth = 1.7;
	const logoHeight = logoWidth / LOGO_ASPECT;

	return (
		<group position={position} rotation={[0, rotationY, 0]}>
			{/* body */}
			<mesh position={[0, 0.62, 0]} castShadow receiveShadow>
				<boxGeometry args={[1.9, 0.85, 4.2]} />
				<meshPhysicalMaterial
					color="#0b3fa0"
					roughness={0.25}
					metalness={0.4}
					clearcoat={0.9}
					clearcoatRoughness={0.15}
				/>
			</mesh>
			{/* upper cabin (white) */}
			<mesh position={[0, 1.28, -0.3]} castShadow receiveShadow>
				<boxGeometry args={[1.85, 0.62, 3]} />
				<meshPhysicalMaterial
					color="#eef2f7"
					roughness={0.3}
					metalness={0.15}
					clearcoat={0.8}
				/>
			</mesh>
			{/* windshield */}
			<mesh position={[0, 1.32, 1.35]} rotation={[0.35, 0, 0]}>
				<boxGeometry args={[1.6, 0.5, 0.05]} />
				<meshPhysicalMaterial
					color="#12202e"
					roughness={0.05}
					metalness={0.2}
					transparent
					opacity={0.85}
				/>
			</mesh>

			{/* logo on both side panels */}
			{[1, -1].map((side) => (
				<mesh
					key={side}
					position={[side * 0.955, 0.75, 0.1]}
					rotation={[0, side > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
				>
					<planeGeometry args={[logoWidth, logoHeight]} />
					<meshStandardMaterial
						map={logoTexture ?? undefined}
						transparent
						toneMapped={false}
						color={logoTexture ? '#ffffff' : '#0b3fa0'}
					/>
				</mesh>
			))}

			{/* logo on rear */}
			<mesh position={[0, 0.85, -2.11]} rotation={[0, Math.PI, 0]}>
				<planeGeometry args={[logoWidth * 0.8, (logoWidth * 0.8) / LOGO_ASPECT]} />
				<meshStandardMaterial
					map={logoTexture ?? undefined}
					transparent
					toneMapped={false}
					color={logoTexture ? '#ffffff' : '#0b3fa0'}
				/>
			</mesh>

			{/* roof light bar */}
			<mesh position={[0, 1.63, -0.3]}>
				<boxGeometry args={[0.7, 0.08, 0.3]} />
				<meshStandardMaterial
					color="#4fc3ff"
					emissive="#4fc3ff"
					emissiveIntensity={1.2}
				/>
			</mesh>

			{/* wheels */}
			{[
				[0.95, 0.35, 1.3],
				[-0.95, 0.35, 1.3],
				[0.95, 0.35, -1.5],
				[-0.95, 0.35, -1.5],
			].map((p, i) => (
				<mesh key={i} position={p as [number, number, number]} rotation={[0, 0, Math.PI / 2]} castShadow>
					<cylinderGeometry args={[0.35, 0.35, 0.28, 20]} />
					<meshStandardMaterial color="#141414" roughness={0.6} />
				</mesh>
			))}
		</group>
	);
};
