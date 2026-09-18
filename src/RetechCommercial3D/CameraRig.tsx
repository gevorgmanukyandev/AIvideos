import React from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';

export type CameraState = {
	position: [number, number, number];
	lookAt: [number, number, number];
	fov: number;
};

export const CameraRig: React.FC<{state: CameraState}> = ({state}) => {
	const {camera} = useThree();
	camera.position.set(...state.position);
	camera.up.set(0, 1, 0);
	camera.lookAt(state.lookAt[0], state.lookAt[1], state.lookAt[2]);
	if (camera instanceof THREE.PerspectiveCamera) {
		camera.fov = state.fov;
		camera.updateProjectionMatrix();
	}
	return null;
};
