import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {CameraRig, type CameraState} from './CameraRig';
import {World} from './World';
import {Mannequin, idlePose, type MannequinPose} from './Mannequin';
import {Phone} from './Phone';
import {Vehicle} from './Vehicle';
import {Workbench} from './Workbench';
import {sceneRanges} from './timeline';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

const local = (frame: number, id: keyof typeof sceneRanges) => {
	const r = sceneRanges[id];
	return {t: clamp01((frame - r.start) / (r.duration - 1)), r};
};

const inRange = (frame: number, id: keyof typeof sceneRanges) => {
	const r = sceneRanges[id];
	return frame >= r.start && frame <= r.end;
};

// Fixed world-space anchor points reused across scenes so the vehicle,
// businessman and workbench line up consistently between hard cuts.
const MEETING_SPOT: [number, number, number] = [1.1, 0, -1];
const VEHICLE_PARK_SPOT: [number, number, number] = [-2.4, 0, -0.6];
const WORKBENCH_SPOT: [number, number, number] = [-1.1, 0, -1.6];

const CAMERA_DEFAULT: CameraState = {
	position: [0, 1.6, 8],
	lookAt: [0, 1.2, 0],
	fov: 45,
};

export const Scene: React.FC = () => {
	const frame = useCurrentFrame();

	let camera: CameraState = CAMERA_DEFAULT;
	let businessman: {pos: [number, number, number]; rotY: number; pose: MannequinPose} | null =
		null;
	let technician: {pos: [number, number, number]; rotY: number; pose: MannequinPose} | null =
		null;
	let phone: {
		pos: [number, number, number];
		rot: [number, number, number];
		scale: number;
		crack: number;
		screen: number;
	} | null = null;
	let vehicle: {pos: [number, number, number]; rotY: number} | null = null;
	let showWorkbench = false;

	// ---------- HOOK (0–89): rushing, phone falls & cracks ----------
	if (inRange(frame, 'hook')) {
		const {t} = local(frame, 'hook');
		if (t < 0.62) {
			// segment A: wide tracking shot, walking fast
			const walkT = t / 0.62;
			const z = lerp(6, -1, walkT);
			businessman = {
				pos: [0.4, 0, z],
				rotY: Math.PI,
				pose: {...idlePose, stridePhase: frame * 0.9, strideAmount: 0.7},
			};
			camera = {
				position: [1.9, 1.5, z - 3.6],
				lookAt: [0.4, 1.15, z],
				fov: 40,
			};
			phone = null;
		} else if (t < 0.85) {
			// segment B: crash-zoom on the falling phone, slow motion
			const fallT = clamp01((t - 0.62) / (0.85 - 0.62));
			const y = lerp(1.3, 0.02, Math.min(1, fallT * 1.3));
			const spin = fallT * 9;
			phone = {
				pos: [0.15, y, -1],
				rot: [spin, spin * 0.6, 0],
				scale: 1.4,
				crack: fallT > 0.92 ? 1 : 0,
				screen: fallT > 0.92 ? 0 : 0.5,
			};
			businessman = {
				pos: [0.4, 0, -1],
				rotY: Math.PI,
				pose: {...idlePose, armRaiseR: 0.3},
			};
			camera = {
				position: [0.75, 0.75, -1.9],
				lookAt: [0.18, 0.15, -1],
				fov: 36,
			};
		} else {
			// segment C: hard cut to shocked reaction close-up
			businessman = {
				pos: [0.4, 0, -1],
				rotY: Math.PI,
				pose: {...idlePose, torsoTilt: -0.12, armRaiseR: 0.5, headTilt: -0.1},
			};
			phone = {
				pos: [0.15, 0.02, -1],
				rot: [1.4, 0.5, 0],
				scale: 1.4,
				crack: 1,
				screen: 0,
			};
			camera = {
				position: [1.3, 1.65, -2.4],
				lookAt: [0.4, 1.45, -1],
				fov: 38,
			};
		}
	}

	// ---------- PANIC (90–179): cracked phone, worried close-up ----------
	if (inRange(frame, 'panic')) {
		const {t} = local(frame, 'panic');
		const shakeX = Math.sin(frame * 1.7) * 0.01 + Math.sin(frame * 0.6) * 0.006;
		const kneel = t < 0.35 ? 1 - t / 0.35 : 0;
		businessman = {
			pos: [0.4, 0, -1],
			rotY: Math.PI,
			pose: {
				...idlePose,
				crouch: kneel * 0.6,
				torsoTilt: -0.18 + kneel * 0.15,
				headTilt: -0.08,
			},
		};
		const flicker = 0.15 + Math.max(0, Math.sin(frame * 2.2)) * 0.15;
		phone = {
			pos: [0.22, lerp(0.05, 0.95, clamp01(t / 0.35)), -1 + lerp(0, 0.15, clamp01(t / 0.35))],
			rot: [0, 0.4, 0.15],
			scale: 1.3,
			crack: 1,
			screen: flicker,
		};
		camera = {
			position: [1.0 + shakeX, 1.4, -2.4],
			lookAt: [0.35, 1.15, -1],
			fov: 34,
		};
	}

	// ---------- BRANDING (180–269): calling Retech ----------
	if (inRange(frame, 'branding')) {
		const {t} = local(frame, 'branding');
		const raise = clamp01(t / 0.5);
		businessman = {
			pos: [0.4, 0, -1],
			rotY: Math.PI - 0.3,
			pose: {...idlePose, armRaiseR: raise * 1.3, headTilt: raise * 0.15},
		};
		phone = {
			pos: [0.58 + raise * 0.08, lerp(1.05, 1.6, raise), -1 + raise * 0.15],
			rot: [0, 0.3, 0],
			scale: 1.1,
			crack: 0.5,
			screen: 0.6,
		};
		camera = {
			position: [2.2, lerp(1.35, 1.55, t), lerp(0.4, -0.9, t)],
			lookAt: [0.45, 1.35, -1],
			fov: lerp(40, 30, t),
		};
	}

	// ---------- VEHICLE ARRIVAL (270–389) ----------
	if (inRange(frame, 'vehicleArrival')) {
		const {t} = local(frame, 'vehicleArrival');
		businessman = {
			pos: MEETING_SPOT,
			rotY: Math.PI - 0.3,
			pose: idlePose,
		};
		phone = {
			pos: [MEETING_SPOT[0] - 0.15, 1.3, MEETING_SPOT[2]],
			rot: [0, 0.3, 0],
			scale: 1,
			crack: 0.5,
			screen: 0.6,
		};

		if (t < 0.6) {
			const driveT = t / 0.6;
			const z = lerp(38, VEHICLE_PARK_SPOT[2], driveT);
			vehicle = {pos: [VEHICLE_PARK_SPOT[0], 0, z], rotY: Math.PI};
			camera = {
				position: [VEHICLE_PARK_SPOT[0] + 7, 2.4, z + 6],
				lookAt: [VEHICLE_PARK_SPOT[0], 1, z],
				fov: 40,
			};
		} else {
			const arriveT = clamp01((t - 0.6) / 0.4);
			vehicle = {pos: VEHICLE_PARK_SPOT, rotY: Math.PI};
			technician = {
				pos: [
					VEHICLE_PARK_SPOT[0] + lerp(0.6, 1.1, arriveT),
					0,
					VEHICLE_PARK_SPOT[2] + lerp(0.4, 0.9, arriveT),
				],
				rotY: Math.PI - 0.6,
				pose: {...idlePose, stridePhase: frame * 0.6, strideAmount: 0.35 * (1 - arriveT)},
			};
			const angle = lerp(-0.6, 0.35, arriveT);
			camera = {
				position: [
					MEETING_SPOT[0] + Math.sin(angle) * 8.5,
					2.0,
					MEETING_SPOT[2] + 2 + Math.cos(angle) * 8.5,
				],
				lookAt: [
					(MEETING_SPOT[0] + VEHICLE_PARK_SPOT[0]) / 2,
					1,
					(MEETING_SPOT[2] + VEHICLE_PARK_SPOT[2]) / 2,
				],
				fov: 40,
			};
		}
	}

	// ---------- REPAIR MONTAGE (390–569): 6 fast sub-beats ----------
	const repairBeats = [
		'repair-01-receive',
		'repair-02-tools',
		'repair-03-open',
		'repair-04-replace',
		'repair-05-test',
		'repair-06-poweron',
	] as const;
	for (let i = 0; i < repairBeats.length; i++) {
		const id = repairBeats[i];
		if (inRange(frame, id)) {
			const {t} = local(frame, id);
			showWorkbench = true;
			vehicle = {pos: VEHICLE_PARK_SPOT, rotY: Math.PI};
			technician = {
				pos: [WORKBENCH_SPOT[0] + 1.4, 0, WORKBENCH_SPOT[2] + 1.0],
				rotY: Math.PI - 0.7,
				pose: {...idlePose, headTilt: Math.sin(frame * 0.3) * 0.03},
			};
			businessman = {
				pos: MEETING_SPOT,
				rotY: Math.PI - 0.3,
				pose: idlePose,
			};

			const snap = clamp01(t / 0.25); // quick snap-in at the start of each cut
			const angles: Record<string, {pos: [number, number, number]; look: [number, number, number]; fov: number}> = {
				'repair-01-receive': {
					pos: [WORKBENCH_SPOT[0] + 2.6, 1.6, WORKBENCH_SPOT[2] + 2.2],
					look: [WORKBENCH_SPOT[0] + 0.9, 1.15, WORKBENCH_SPOT[2] + 0.7],
					fov: 32,
				},
				'repair-02-tools': {
					pos: [WORKBENCH_SPOT[0] + 0.5, 0.85, WORKBENCH_SPOT[2] + 0.9],
					look: [WORKBENCH_SPOT[0] + 0.2, 0.48, WORKBENCH_SPOT[2]],
					fov: 22,
				},
				'repair-03-open': {
					pos: [WORKBENCH_SPOT[0] + 0.4, 0.85, WORKBENCH_SPOT[2] + 0.9],
					look: [WORKBENCH_SPOT[0], 0.45, WORKBENCH_SPOT[2]],
					fov: 24,
				},
				'repair-04-replace': {
					pos: [WORKBENCH_SPOT[0] + 0.3, 0.8, WORKBENCH_SPOT[2] + 0.85],
					look: [WORKBENCH_SPOT[0], 0.48, WORKBENCH_SPOT[2]],
					fov: 20,
				},
				'repair-05-test': {
					pos: [WORKBENCH_SPOT[0] - 0.8, 1.3, WORKBENCH_SPOT[2] + 1.6],
					look: [WORKBENCH_SPOT[0], 0.6, WORKBENCH_SPOT[2]],
					fov: 28,
				},
				'repair-06-poweron': {
					pos: [WORKBENCH_SPOT[0] + 2.2, 1.7, WORKBENCH_SPOT[2] + 2.6],
					look: [WORKBENCH_SPOT[0] + 0.6, 0.9, WORKBENCH_SPOT[2] + 0.5],
					fov: 36,
				},
			};
			const a = angles[id];
			camera = {position: a.pos, lookAt: a.look, fov: lerp(a.fov + 6, a.fov, snap)};

			const crackByBeat = [0.5, 0.5, 0.35, 0.15, 0.05, 0];
			const screenByBeat = [0.4, 0.4, 0.2, 0.2, 0.5, 1];
			const crack = crackByBeat[i];
			const screen =
				id === 'repair-06-poweron' ? lerp(0.3, 1, t) : screenByBeat[i];

			phone = {
				pos: [WORKBENCH_SPOT[0] + 0.2, 0.5, WORKBENCH_SPOT[2] + 0.02],
				rot: [-Math.PI / 2, 0, 0.3 + i * 0.05],
				scale: 0.9,
				crack,
				screen,
			};
		}
	}

	// ---------- RELIEF (570–659) ----------
	if (inRange(frame, 'relief')) {
		const {t} = local(frame, 'relief');
		vehicle = {pos: VEHICLE_PARK_SPOT, rotY: Math.PI};

		if (t < 0.3) {
			// hand-off
			const handoffT = t / 0.3;
			technician = {
				pos: [WORKBENCH_SPOT[0] + 1.4, 0, WORKBENCH_SPOT[2] + 1.0],
				rotY: Math.PI - 0.6,
				pose: idlePose,
			};
			businessman = {
				pos: MEETING_SPOT,
				rotY: Math.PI - 0.3,
				pose: {...idlePose, armRaiseR: 0.6},
			};
			phone = {
				pos: [
					lerp(WORKBENCH_SPOT[0] + 1.4, MEETING_SPOT[0] - 0.1, handoffT),
					lerp(1.1, 1.3, handoffT),
					lerp(WORKBENCH_SPOT[2] + 1.0, MEETING_SPOT[2], handoffT),
				],
				rot: [0, 0.3, 0],
				scale: 1,
				crack: 0,
				screen: 1,
			};
			camera = {
				position: [2.9, 1.7, 1.4],
				lookAt: [0.7, 1.2, -0.8],
				fov: 38,
			};
		} else {
			// relief + walk away
			const walkT = clamp01((t - 0.3) / 0.7);
			const z = lerp(MEETING_SPOT[2], MEETING_SPOT[2] - 9, walkT);
			businessman = {
				pos: [MEETING_SPOT[0] - 0.1, 0, z],
				rotY: Math.PI - 0.15,
				pose: {
					...idlePose,
					stridePhase: frame * 0.85,
					strideAmount: 0.6 * walkT,
					headTilt: -0.05,
				},
			};
			phone = {
				pos: [MEETING_SPOT[0] - 0.25, 1.3, z],
				rot: [0, 0.3, 0],
				scale: 1,
				crack: 0,
				screen: 1 - walkT * 0.6,
			};
			camera = {
				position: [1.8, lerp(1.4, 2.3, walkT), z + 4.5],
				lookAt: [0.3, 1.1, z],
				fov: lerp(34, 46, walkT),
			};
		}
	}

	// ---------- BRAND ENDING drive-away (660–695) ----------
	if (inRange(frame, 'brandEnding')) {
		const {t} = local(frame, 'brandEnding');
		const z = lerp(VEHICLE_PARK_SPOT[2], 34, t);
		vehicle = {pos: [VEHICLE_PARK_SPOT[0], 0, z], rotY: Math.PI};
		camera = {
			position: [2.6, 1.7, VEHICLE_PARK_SPOT[2] + 2],
			lookAt: [VEHICLE_PARK_SPOT[0] * 0.5, 0.9, z],
			fov: 40,
		};
	}

	return (
		<AbsoluteFill>
			<ThreeCanvas width={1080} height={1920} shadows>
				<CameraRig state={camera} />
				<World />
				{vehicle ? <Vehicle position={vehicle.pos} rotationY={vehicle.rotY} /> : null}
				{showWorkbench ? <Workbench position={WORKBENCH_SPOT} /> : null}
				{businessman ? (
					<Mannequin
						position={businessman.pos}
						rotationY={businessman.rotY}
						pose={businessman.pose}
						bodyColor="#22345c"
						accentColor="#2f4a86"
					/>
				) : null}
				{technician ? (
					<Mannequin
						position={technician.pos}
						rotationY={technician.rotY}
						pose={technician.pose}
						bodyColor="#3d5b78"
						accentColor="#4fc3ff"
					/>
				) : null}
				{phone ? (
					<Phone
						position={phone.pos}
						rotation={phone.rot}
						scale={phone.scale}
						crackAmount={phone.crack}
						screenOn={phone.screen}
					/>
				) : null}
			</ThreeCanvas>
		</AbsoluteFill>
	);
};
