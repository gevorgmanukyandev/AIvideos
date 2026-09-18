import React, {useMemo} from 'react';
import * as THREE from 'three';
import {makeCrackTexture} from './proceduralTextures';

type PhoneProps = {
	position: [number, number, number];
	rotation?: [number, number, number];
	scale?: number;
	/** 0 = pristine/off, 1 = fully cracked+dark, values in between blend. */
	crackAmount?: number;
	/** Screen glow: 0 = off, 1 = fully lit/working. */
	screenOn?: number;
};

export const Phone: React.FC<PhoneProps> = ({
	position,
	rotation = [0, 0, 0],
	scale = 1,
	crackAmount = 0,
	screenOn = 0,
}) => {
	const crackTexture = useMemo(() => makeCrackTexture(), []);

	const screenColor = useMemo(() => {
		if (screenOn <= 0) return undefined;
		return new THREE.Color('#bfe8ff').lerp(
			new THREE.Color('#ffffff'),
			Math.max(0, screenOn - 0.6) * 2
		);
	}, [screenOn]);

	return (
		<group position={position} rotation={rotation} scale={scale}>
			<mesh castShadow>
				<boxGeometry args={[0.22, 0.46, 0.022]} />
				<meshPhysicalMaterial
					color="#181a1e"
					roughness={0.25}
					metalness={0.6}
					clearcoat={0.8}
				/>
			</mesh>
			<mesh position={[0, 0, 0.012]}>
				<planeGeometry args={[0.19, 0.4]} />
				<meshStandardMaterial
					color={screenOn > 0 ? screenColor : '#050608'}
					emissive={screenOn > 0 ? screenColor : '#000000'}
					emissiveIntensity={screenOn * 1.4}
				/>
			</mesh>
			{crackAmount > 0 ? (
				<mesh position={[0, 0, 0.013]}>
					<planeGeometry args={[0.19, 0.4]} />
					<meshBasicMaterial
						map={crackTexture}
						transparent
						opacity={Math.min(1, crackAmount)}
					/>
				</mesh>
			) : null}
		</group>
	);
};
