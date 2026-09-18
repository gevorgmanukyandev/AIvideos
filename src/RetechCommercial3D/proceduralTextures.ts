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

/**
 * Procedural shattered-glass overlay for the phone screen: a dense
 * spiderweb of primary + secondary fractures around an off-center impact
 * point, plus a few dead-LCD blotches, so it reads as real screen damage
 * rather than a faint decorative line pattern.
 */
export const makeCrackTexture = (): THREE.CanvasTexture => {
	const size = 512;
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d')!;
	ctx.clearRect(0, 0, size, size);

	const cx = size * 0.38;
	const cy = size * 0.32;

	// dead-pixel / LCD bruise blotches under the impact point
	for (let i = 0; i < 5; i++) {
		const bx = cx + (Math.random() - 0.5) * 70;
		const by = cy + (Math.random() - 0.5) * 70;
		const grad = ctx.createRadialGradient(bx, by, 0, bx, by, 18 + Math.random() * 22);
		grad.addColorStop(0, 'rgba(10,10,14,0.85)');
		grad.addColorStop(1, 'rgba(10,10,14,0)');
		ctx.fillStyle = grad;
		ctx.fillRect(bx - 45, by - 45, 90, 90);
	}

	// bright impact core
	const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22);
	coreGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
	coreGrad.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = coreGrad;
	ctx.fillRect(cx - 24, cy - 24, 48, 48);

	const spokeAngles: number[] = [];
	const spokes = 20;
	ctx.lineWidth = 1.6;
	for (let i = 0; i < spokes; i++) {
		const angle = (i / spokes) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
		spokeAngles.push(angle);
		const len = 70 + Math.random() * 210;
		ctx.strokeStyle = `rgba(255,255,255,${0.55 + Math.random() * 0.35})`;
		ctx.beginPath();
		ctx.moveTo(cx, cy);
		let x = cx;
		let y = cy;
		const segments = 5;
		const points: [number, number][] = [[x, y]];
		for (let s = 1; s <= segments; s++) {
			x += Math.cos(angle) * (len / segments) + (Math.random() - 0.5) * 16;
			y += Math.sin(angle) * (len / segments) + (Math.random() - 0.5) * 16;
			ctx.lineTo(x, y);
			points.push([x, y]);
		}
		ctx.stroke();

		// short secondary fractures branching off the main spoke
		for (let b = 1; b < points.length - 1; b++) {
			if (Math.random() > 0.55) continue;
			const [px, py] = points[b];
			const branchAngle = angle + (Math.random() - 0.5) * 1.6;
			const branchLen = 12 + Math.random() * 30;
			ctx.strokeStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.3})`;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(px, py);
			ctx.lineTo(
				px + Math.cos(branchAngle) * branchLen,
				py + Math.sin(branchAngle) * branchLen
			);
			ctx.stroke();
		}
	}

	// concentric rings connecting the spokes, denser near the impact
	ctx.lineWidth = 1.2;
	for (let ring = 1; ring <= 5; ring++) {
		const r = ring * 18 + Math.random() * 8;
		ctx.strokeStyle = `rgba(255,255,255,${0.5 - ring * 0.07})`;
		ctx.beginPath();
		for (let i = 0; i <= spokeAngles.length; i++) {
			const angle = spokeAngles[i % spokeAngles.length];
			const jitter = (Math.random() - 0.5) * 6;
			const x = cx + Math.cos(angle) * (r + jitter);
			const y = cy + Math.sin(angle) * (r + jitter);
			if (i === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		}
		ctx.stroke();
	}

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	return texture;
};
