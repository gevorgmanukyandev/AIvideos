import * as THREE from 'three';

/** Low-contrast noise texture used to break up flat colors (fabric weave,
 * skin micro-variation, asphalt/concrete speckle) so materials don't read
 * as flat plastic. */
export const makeNoiseTexture = (
	baseColor: string,
	noiseAlpha: number,
	size = 128
): THREE.CanvasTexture => {
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d')!;
	ctx.fillStyle = baseColor;
	ctx.fillRect(0, 0, size, size);

	const imageData = ctx.getImageData(0, 0, size, size);
	for (let i = 0; i < imageData.data.length; i += 4) {
		const n = (Math.random() - 0.5) * 255 * noiseAlpha;
		imageData.data[i] = Math.min(255, Math.max(0, imageData.data[i] + n));
		imageData.data[i + 1] = Math.min(
			255,
			Math.max(0, imageData.data[i + 1] + n)
		);
		imageData.data[i + 2] = Math.min(
			255,
			Math.max(0, imageData.data[i + 2] + n)
		);
	}
	ctx.putImageData(imageData, 0, 0);

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	return texture;
};

/**
 * Cheap procedural window-grid texture for building facades — drawn once
 * on an offscreen canvas, no async asset loading required.
 */
export const makeWindowTexture = (
	baseColor: string,
	litRatio: number
): THREE.CanvasTexture => {
	const size = 256;
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d')!;
	ctx.fillStyle = baseColor;
	ctx.fillRect(0, 0, size, size);

	const cols = 6;
	const rows = 10;
	const padX = size / cols;
	const padY = size / rows;
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const lit = Math.random() < litRatio;
			ctx.fillStyle = lit
				? 'rgba(255, 214, 120, 0.9)'
				: 'rgba(20, 24, 34, 0.55)';
			const w = padX * 0.6;
			const h = padY * 0.55;
			const x = c * padX + (padX - w) / 2;
			const y = r * padY + (padY - h) / 2;
			ctx.fillRect(x, y, w, h);
		}
	}

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	return texture;
};

/** Procedural cracked-glass overlay for the phone screen. */
export const makeCrackTexture = (): THREE.CanvasTexture => {
	const size = 512;
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d')!;
	ctx.clearRect(0, 0, size, size);

	const cx = size * 0.42;
	const cy = size * 0.38;
	ctx.strokeStyle = 'rgba(255,255,255,0.85)';
	ctx.lineWidth = 2;

	const spokes = 14;
	for (let i = 0; i < spokes; i++) {
		const angle = (i / spokes) * Math.PI * 2 + Math.random() * 0.2;
		const len = 90 + Math.random() * 160;
		ctx.beginPath();
		ctx.moveTo(cx, cy);
		let x = cx;
		let y = cy;
		const segments = 4;
		for (let s = 1; s <= segments; s++) {
			x += Math.cos(angle) * (len / segments) + (Math.random() - 0.5) * 14;
			y += Math.sin(angle) * (len / segments) + (Math.random() - 0.5) * 14;
			ctx.lineTo(x, y);
		}
		ctx.stroke();
	}

	for (let ring = 1; ring <= 3; ring++) {
		ctx.beginPath();
		ctx.ellipse(
			cx,
			cy,
			ring * 28 + Math.random() * 6,
			ring * 24 + Math.random() * 6,
			0,
			0,
			Math.PI * 2
		);
		ctx.stroke();
	}

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	return texture;
};
