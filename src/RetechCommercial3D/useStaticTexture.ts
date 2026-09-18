import {useEffect, useState} from 'react';
import * as THREE from 'three';
import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * Loads a texture from `public/` and blocks Remotion's render until it's
 * ready, so frames never get captured mid-load.
 */
export const useStaticTexture = (path: string): THREE.Texture | null => {
	const [texture, setTexture] = useState<THREE.Texture | null>(null);

	useEffect(() => {
		const handle = delayRender(`loading texture ${path}`);
		const loader = new THREE.TextureLoader();
		let cancelled = false;
		loader.load(
			staticFile(path),
			(tex) => {
				tex.colorSpace = THREE.SRGBColorSpace;
				tex.needsUpdate = true;
				if (!cancelled) setTexture(tex);
				continueRender(handle);
			},
			undefined,
			() => {
				continueRender(handle);
			}
		);
		return () => {
			cancelled = true;
		};
	}, [path]);

	return texture;
};
