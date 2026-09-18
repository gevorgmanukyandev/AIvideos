import React, {useMemo} from 'react';
import * as THREE from 'three';
import {makeNoiseTexture, makeWindowTexture} from './proceduralTextures';

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

const StreetLamp: React.FC<{position: [number, number, number]}> = ({
	position,
}) => (
	<group position={position}>
		<mesh position={[0, 1.6, 0]} castShadow>
			<cylinderGeometry args={[0.035, 0.045, 3.2, 8]} />
			<meshStandardMaterial color="#20232a" roughness={0.5} metalness={0.6} />
		</mesh>
		<mesh position={[0, 3.25, 0.12]} rotation={[Math.PI / 2.4, 0, 0]}>
			<cylinderGeometry args={[0.03, 0.03, 0.35, 8]} />
			<meshStandardMaterial color="#20232a" roughness={0.5} metalness={0.6} />
		</mesh>
		<mesh position={[0, 3.15, 0.28]}>
			<sphereGeometry args={[0.09, 12, 12]} />
			<meshStandardMaterial
				color="#ffdfa0"
				emissive="#ffcf7e"
				emissiveIntensity={1.6}
			/>
		</mesh>
	</group>
);

const ParkedCar: React.FC<{
	position: [number, number, number];
	rotationY: number;
	color: string;
}> = ({position, rotationY, color}) => (
	<group position={position} rotation={[0, rotationY, 0]}>
		<mesh position={[0, 0.42, 0]} castShadow receiveShadow>
			<boxGeometry args={[1.7, 0.5, 3.6]} />
			<meshPhysicalMaterial color={color} roughness={0.35} metalness={0.3} clearcoat={0.5} />
		</mesh>
		<mesh position={[0, 0.78, -0.2]} castShadow>
			<boxGeometry args={[1.55, 0.42, 1.9]} />
			<meshPhysicalMaterial color={color} roughness={0.35} metalness={0.3} clearcoat={0.5} />
		</mesh>
		{[
			[0.75, 0.24, 1.2],
			[-0.75, 0.24, 1.2],
			[0.75, 0.24, -1.2],
			[-0.75, 0.24, -1.2],
		].map((p, i) => (
			<mesh key={i} position={p as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
				<cylinderGeometry args={[0.28, 0.28, 0.22, 16]} />
				<meshStandardMaterial color="#0d0d0d" roughness={0.7} />
			</mesh>
		))}
	</group>
);

const Tree: React.FC<{position: [number, number, number]}> = ({position}) => (
	<group position={position}>
		<mesh position={[0, 0.9, 0]} castShadow>
			<cylinderGeometry args={[0.09, 0.13, 1.8, 8]} />
			<meshStandardMaterial color="#4a3a2c" roughness={0.9} />
		</mesh>
		<mesh position={[0, 2.3, 0]} castShadow>
			<sphereGeometry args={[1.1, 10, 10]} />
			<meshStandardMaterial color="#3f6b3a" roughness={0.85} />
		</mesh>
	</group>
);

type StreetPropSpec =
	| {kind: 'lamp'; x: number; z: number}
	| {kind: 'tree'; x: number; z: number}
	| {kind: 'car'; x: number; z: number; rotationY: number; color: string};

const CAR_COLORS = ['#8a1f1f', '#dedede', '#1c2a44', '#5a5a5a'];

const generateStreetProps = (): StreetPropSpec[] => {
	const props: StreetPropSpec[] = [];
	let seed = 7;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	for (const side of [-1, 1]) {
		for (let i = 0; i < 12; i++) {
			const z = -16 + i * 9 + rand() * 2;
			if (i % 2 === 0) {
				props.push({kind: 'lamp', x: side * 8.9, z});
			} else {
				props.push({kind: 'tree', x: side * 8.7, z: z + 1});
			}
			if (rand() > 0.45) {
				props.push({
					kind: 'car',
					x: side * 7.7,
					z: z - 2,
					rotationY: side > 0 ? Math.PI / 2 : -Math.PI / 2,
					color: CAR_COLORS[Math.floor(rand() * CAR_COLORS.length)],
				});
			}
		}
	}
	return props;
};

const StreetProps: React.FC = () => {
	const props = useMemo(() => generateStreetProps(), []);
	return (
		<>
			{props.map((p, i) => {
				if (p.kind === 'lamp') return <StreetLamp key={i} position={[p.x, 0, p.z]} />;
				if (p.kind === 'tree') return <Tree key={i} position={[p.x, 0, p.z]} />;
				return (
					<ParkedCar
						key={i}
						position={[p.x, 0, p.z]}
						rotationY={p.rotationY}
						color={p.color}
					/>
				);
			})}
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
	const asphaltTexture = useMemo(() => {
		const tex = makeNoiseTexture('#4a4f57', 0.16, 256);
		tex.repeat.set(6, 45);
		return tex;
	}, []);
	const sidewalkTexture = useMemo(() => {
		const tex = makeNoiseTexture('#a29a8c', 0.12, 256);
		tex.repeat.set(2, 45);
		return tex;
	}, []);

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
				<meshStandardMaterial map={asphaltTexture} roughness={0.92} />
			</mesh>

			{[-1, 1].map((side) => (
				<mesh
					key={side}
					rotation={[-Math.PI / 2, 0, 0]}
					position={[side * 9.2, 0.01, -20]}
					receiveShadow
				>
					<planeGeometry args={[4.2, 260]} />
					<meshStandardMaterial map={sidewalkTexture} roughness={0.88} />
				</mesh>
			))}

			<RoadMarkings />
			<StreetProps />

			{buildings.map((spec, i) => (
				<Building key={i} spec={spec} />
			))}
		</>
	);
};
