import React, {useMemo} from 'react';
import * as THREE from 'three';
import {makeWindowTexture} from './proceduralTextures';

const BUILDING_COLORS = ['#caa27a', '#cf8f7c', '#d9c48a', '#b98f6a'];

type BuildingSpec = {
	x: number;
	z: number;
	width: number;
	depth: number;
	height: number;
	color: string;
};

const generateBuildings = (): BuildingSpec[] => {
	const buildings: BuildingSpec[] = [];
	let seed = 42;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	for (const side of [-1, 1]) {
		for (let i = 0; i < 16; i++) {
			const z = -20 + i * 12 + rand() * 3;
			buildings.push({
				x: side * (13 + rand() * 3),
				z,
				width: 8 + rand() * 4,
				depth: 8 + rand() * 4,
				height: 14 + rand() * 22,
				color: BUILDING_COLORS[Math.floor(rand() * BUILDING_COLORS.length)],
			});
		}
	}
	return buildings;
};

const Building: React.FC<{spec: BuildingSpec}> = ({spec}) => {
	const texture = useMemo(
		() => makeWindowTexture(spec.color, 0.35),
		[spec.color]
	);
	return (
		<mesh
			position={[spec.x, spec.height / 2, spec.z]}
			castShadow
			receiveShadow
		>
			<boxGeometry args={[spec.width, spec.height, spec.depth]} />
			<meshStandardMaterial map={texture} roughness={0.85} metalness={0.05} />
		</mesh>
	);
};

const RoadMarkings: React.FC = () => {
	const stripes = useMemo(
		() => Array.from({length: 30}, (_, i) => -30 + i * 8),
		[]
	);
	return (
		<>
			{stripes.map((z) => (
				<mesh
					key={z}
					position={[0, 0.02, z]}
					rotation={[-Math.PI / 2, 0, 0]}
					receiveShadow
				>
					<planeGeometry args={[0.35, 3]} />
					<meshStandardMaterial
						color="#e8e2d0"
						emissive="#e8e2d0"
						emissiveIntensity={0.05}
					/>
				</mesh>
			))}
		</>
	);
};

/** Distant Ararat-like silhouette for atmosphere. */
const DistantMountain: React.FC = () => (
	<mesh position={[10, 18, -160]} rotation={[0, 0.3, 0]}>
		<coneGeometry args={[70, 55, 4]} />
		<meshStandardMaterial
			color="#93a7c2"
			roughness={1}
			fog
			transparent
			opacity={0.55}
		/>
	</mesh>
);

/** Persistent street environment: ground, buildings, sky, lighting. */
export const World: React.FC = () => {
	const buildings = useMemo(() => generateBuildings(), []);

	return (
		<>
			<color attach="background" args={['#bcd3ea']} />
			<fog attach="fog" args={['#bcd3ea', 40, 150]} />

			<hemisphereLight args={['#cfe3ff', '#3a3226', 0.9]} />
			<ambientLight intensity={0.5} />
			<directionalLight
				position={[-18, 26, 12]}
				intensity={3.4}
				color="#fff3df"
				castShadow
				shadow-mapSize-width={1024}
				shadow-mapSize-height={1024}
				shadow-camera-left={-25}
				shadow-camera-right={25}
				shadow-camera-top={25}
				shadow-camera-bottom={-25}
				shadow-camera-far={80}
			/>
			<directionalLight
				position={[14, 10, -10]}
				intensity={0.5}
				color="#8fb8ff"
			/>
			{/* soft frontal fill so subjects read clearly to camera */}
			<directionalLight
				position={[0, 12, 25]}
				intensity={1.3}
				color="#eef3ff"
			/>

			<DistantMountain />

			<mesh
				rotation={[-Math.PI / 2, 0, 0]}
				position={[0, 0, -20]}
				receiveShadow
			>
				<planeGeometry args={[34, 260]} />
				<meshStandardMaterial color="#454a52" roughness={0.95} />
			</mesh>

			{[-1, 1].map((side) => (
				<mesh
					key={side}
					rotation={[-Math.PI / 2, 0, 0]}
					position={[side * 9.2, 0.01, -20]}
					receiveShadow
				>
					<planeGeometry args={[4.2, 260]} />
					<meshStandardMaterial color="#9a9284" roughness={0.9} />
				</mesh>
			))}

			<RoadMarkings />

			{buildings.map((spec, i) => (
				<Building key={i} spec={spec} />
			))}
		</>
	);
};
