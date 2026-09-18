import React from 'react';

/** Small service table with a tool tray, used during the repair montage. */
export const Workbench: React.FC<{position: [number, number, number]}> = ({
	position,
}) => (
	<group position={position}>
		<mesh position={[0, 0.42, 0]} castShadow receiveShadow>
			<boxGeometry args={[0.7, 0.06, 0.5]} />
			<meshStandardMaterial color="#2b2f36" roughness={0.6} metalness={0.3} />
		</mesh>
		<mesh position={[0, 0.2, 0]}>
			<cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
			<meshStandardMaterial color="#1a1c20" />
		</mesh>
		{/* tool tray */}
		<mesh position={[0.2, 0.47, 0.1]} castShadow>
			<boxGeometry args={[0.22, 0.02, 0.14]} />
			<meshStandardMaterial color="#4fc3ff" metalness={0.5} roughness={0.3} />
		</mesh>
		{/* screwdriver */}
		<group position={[0.18, 0.49, 0.1]} rotation={[0, 0.3, Math.PI / 2.2]}>
			<mesh>
				<cylinderGeometry args={[0.008, 0.008, 0.16, 8]} />
				<meshStandardMaterial color="#e0e0e0" metalness={0.8} roughness={0.2} />
			</mesh>
			<mesh position={[0, -0.1, 0]}>
				<cylinderGeometry args={[0.014, 0.014, 0.05, 8]} />
				<meshStandardMaterial color="#ffb020" roughness={0.5} />
			</mesh>
		</group>
	</group>
);
