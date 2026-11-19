import { i as __toESM } from "../_runtime.mjs";
import { c as CanvasTexture, g as Vector3, h as RepeatWrapping, n as useFrame, t as Canvas, v as require_jsx_runtime, y as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { a as WORLD, c as MEMORY_ANCHOR, d as ZONE_NAME, f as recordById, h as setHumLevel, i as SKINS, l as MEMORY_ID, m as chime, n as Settling, o as CANON_LABEL, p as useGameStore, r as CLOTHS, s as COMPANION_SHELF, u as PLACE_NOTES } from "./routes-DhP25J7r.mjs";
import { a as useRapier, i as RigidBody, n as CuboidCollider, r as Physics, t as CapsuleCollider } from "../_libs/@react-three/rapier+[...].mjs";
import { a as Camera, n as VolumeX, o as BookOpen, r as Volume2, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Play-CnFAut_V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GAME_KEYS = /* @__PURE__ */ new Set([
	"KeyW",
	"KeyA",
	"KeyS",
	"KeyD",
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Space",
	"ShiftLeft",
	"ShiftRight",
	"KeyE"
]);
var keys = /* @__PURE__ */ new Set();
var holds = {
	jump: false,
	run: false,
	interact: false
};
var stick = {
	x: 0,
	y: 0,
	active: false
};
var override = null;
var blocked = false;
function setKeyOverride(codes) {
	override = codes ? new Set(codes) : null;
}
function setInputBlocked(next) {
	blocked = next;
}
function setHold(name, active) {
	holds[name] = active;
}
function setStick(x, y, active) {
	stick.x = x;
	stick.y = y;
	stick.active = active;
}
function resetInput() {
	keys.clear();
	holds.jump = false;
	holds.run = false;
	holds.interact = false;
	stick.x = 0;
	stick.y = 0;
	stick.active = false;
	override = null;
	blocked = false;
}
function readMove() {
	if (blocked) return {
		x: 0,
		z: 0,
		run: false,
		jump: false,
		interact: false
	};
	let x = 0;
	let z = 0;
	const down = (code) => override ? override.has(code) : keys.has(code);
	if (down("KeyD") || down("ArrowRight")) x += 1;
	if (down("KeyA") || down("ArrowLeft")) x -= 1;
	if (down("KeyW") || down("ArrowUp")) z += 1;
	if (down("KeyS") || down("ArrowDown")) z -= 1;
	if (!override && stick.active) {
		x += stick.x;
		z += -stick.y;
	}
	let jump = down("Space") || !override && holds.jump;
	let run = down("ShiftLeft") || down("ShiftRight") || !override && holds.run;
	let interact = down("KeyE") || !override && holds.interact;
	if (!override && typeof navigator !== "undefined" && navigator.getGamepads) {
		const pads = navigator.getGamepads();
		for (const pad of pads) {
			if (!pad) continue;
			let gx = pad.axes[0] ?? 0;
			let gy = pad.axes[1] ?? 0;
			const mag = Math.hypot(gx, gy);
			if (mag < .18) {
				gx = 0;
				gy = 0;
			} else {
				const scale = (mag - .18) / (.82 * mag);
				gx *= scale;
				gy *= scale;
			}
			x += gx;
			z += -gy;
			if (pad.buttons[0]?.pressed) jump = true;
			if (pad.buttons[1]?.pressed) interact = true;
			if ((pad.buttons[7]?.value ?? 0) > .45) run = true;
		}
	}
	const len = Math.hypot(x, z);
	if (len > 1) {
		x /= len;
		z /= len;
	}
	return {
		x,
		z,
		run,
		jump,
		interact
	};
}
function bindInput(target) {
	const down = (event) => {
		if (!GAME_KEYS.has(event.code)) return;
		event.preventDefault();
		if (override) return;
		keys.add(event.code);
	};
	const up = (event) => {
		if (!GAME_KEYS.has(event.code)) return;
		keys.delete(event.code);
	};
	const clear = () => keys.clear();
	const onHide = () => {
		if (document.hidden) clear();
	};
	target.addEventListener("keydown", down);
	target.addEventListener("keyup", up);
	target.addEventListener("blur", clear);
	document.addEventListener("visibilitychange", onHide);
	return () => {
		target.removeEventListener("keydown", down);
		target.removeEventListener("keyup", up);
		target.removeEventListener("blur", clear);
		document.removeEventListener("visibilitychange", onHide);
		resetInput();
	};
}
function tryRecord(id) {
	const fresh = useGameStore.getState().recordMemory(id);
	if (fresh && !useGameStore.getState().muted) chime();
	return fresh;
}
var probe = {
	yaw: 0,
	speed: 0,
	x: 0,
	y: 0,
	z: 0,
	near: false
};
function publishProbe() {
	window.__controlsTest = {
		getYaw: () => probe.yaw,
		getSpeed: () => probe.speed,
		setKeys: (codes) => setKeyOverride(codes.length ? codes : null),
		getPos: () => ({
			x: probe.x,
			y: probe.y,
			z: probe.z,
			near: probe.near
		})
	};
}
function writeProbe(yaw, speed, x = 0, y = 0, z = 0, near = false) {
	probe.yaw = yaw;
	probe.speed = speed;
	probe.x = x;
	probe.y = y;
	probe.z = z;
	probe.near = near;
}
function clearProbe() {
	delete window.__controlsTest;
}
var BOXES = [
	{
		position: [
			0,
			.47,
			-2.5
		],
		size: [
			4.2,
			.3,
			5.2
		],
		color: "sand",
		rotation: [
			.22,
			0,
			0
		]
	},
	{
		position: [
			0,
			.55,
			-8.2
		],
		size: [
			16,
			1.1,
			6.2
		],
		color: "stone"
	},
	{
		position: [
			0,
			1.15,
			-13.1
		],
		size: [
			18,
			2.3,
			4.4
		],
		color: "clay"
	},
	{
		position: [
			-10.2,
			.9,
			-9.2
		],
		size: [
			5.2,
			1.8,
			5
		],
		color: "sand"
	},
	{
		position: [
			9.2,
			1.15,
			-10.2
		],
		size: [
			5,
			2.3,
			5.4
		],
		color: "stone"
	},
	{
		position: [
			-8,
			1.5,
			3.4
		],
		size: [
			4.2,
			3,
			4.2
		],
		color: "clay"
	},
	{
		position: [
			-8,
			3.15,
			3.4
		],
		size: [
			4.6,
			.38,
			4.6
		],
		color: "dark"
	},
	{
		position: [
			7.6,
			1.35,
			1.2
		],
		size: [
			3.6,
			2.7,
			4.8
		],
		color: "sand"
	},
	{
		position: [
			7.6,
			2.85,
			1.2
		],
		size: [
			4,
			.34,
			5.2
		],
		color: "dark"
	},
	{
		position: [
			-6.4,
			1.1,
			-1.6
		],
		size: [
			3.2,
			2.2,
			3
		],
		color: "stone"
	},
	{
		position: [
			-2.3,
			1.55,
			6.3
		],
		size: [
			.7,
			3.1,
			.75
		],
		color: "dark"
	},
	{
		position: [
			2.3,
			1.55,
			6.3
		],
		size: [
			.7,
			3.1,
			.75
		],
		color: "dark"
	},
	{
		position: [
			0,
			3.2,
			6.3
		],
		size: [
			5.4,
			.5,
			.85
		],
		color: "clay"
	},
	{
		position: [
			1.7,
			.45,
			4.2
		],
		size: [
			1.15,
			.9,
			1.15
		],
		color: "dark"
	},
	{
		position: [
			-12,
			2.4,
			-18.5
		],
		size: [
			3.2,
			4.8,
			3.2
		],
		color: "stone"
	},
	{
		position: [
			-6,
			3.1,
			-19
		],
		size: [
			3.4,
			6.2,
			3.2
		],
		color: "clay"
	},
	{
		position: [
			.5,
			2.2,
			-18.2
		],
		size: [
			4,
			4.4,
			3
		],
		color: "sand"
	},
	{
		position: [
			6.5,
			3.4,
			-19.2
		],
		size: [
			3,
			6.8,
			3.2
		],
		color: "dark"
	},
	{
		position: [
			12,
			2.6,
			-18
		],
		size: [
			3.6,
			5.2,
			3.4
		],
		color: "stone"
	}
];
var CHIMNEYS = [
	{
		position: [
			-3.5,
			0,
			5.5
		],
		height: 3.5
	},
	{
		position: [
			.6,
			1.1,
			-8.2
		],
		height: 3.3
	},
	{
		position: [
			-10.2,
			1.8,
			-9.2
		],
		height: 2.6
	},
	{
		position: [
			9.2,
			2.3,
			-10.2
		],
		height: 3.1
	}
];
var HUM_SOURCES = CHIMNEYS.map((chimney) => ({
	x: chimney.position[0],
	z: chimney.position[2]
}));
var PALMS = [
	[
		-5.2,
		0,
		8.2
	],
	[
		5.4,
		0,
		8.6
	],
	[
		4.6,
		0,
		-.4
	]
];
function dampAngle(current, target, lambda, dt) {
	return current + Math.atan2(Math.sin(target - current), Math.cos(target - current)) * (1 - Math.exp(-lambda * dt));
}
var WALK = 4.6;
var RUN = 7.6;
var INTERACT_RADIUS = 3.2;
function Player({ onReady }) {
	const body = (0, import_react.useRef)(null);
	const visual = (0, import_react.useRef)(null);
	const ctrl = (0, import_react.useRef)(null);
	const { world } = useRapier();
	const move = (0, import_react.useMemo)(() => ({
		x: 0,
		y: 0,
		z: 0
	}), []);
	const desired = (0, import_react.useMemo)(() => new Vector3(), []);
	const look = (0, import_react.useMemo)(() => new Vector3(), []);
	const bodyYaw = (0, import_react.useRef)(0);
	const camYaw = (0, import_react.useRef)(0);
	const pitch = (0, import_react.useRef)(.32);
	const dragging = (0, import_react.useRef)(false);
	const lookPointer = (0, import_react.useRef)(null);
	const coyote = (0, import_react.useRef)(.14);
	const jumpBuffer = (0, import_react.useRef)(0);
	const jumpPrev = (0, import_react.useRef)(false);
	const interactPrev = (0, import_react.useRef)(false);
	const vy = (0, import_react.useRef)(0);
	const booted = (0, import_react.useRef)(false);
	const published = (0, import_react.useRef)(false);
	const readySent = (0, import_react.useRef)(false);
	const nearRef = (0, import_react.useRef)(false);
	const modePrev = (0, import_react.useRef)(useGameStore.getState().cameraMode);
	(0, import_react.useEffect)(() => {
		const controller = world.createCharacterController(.04);
		controller.enableSnapToGround(.4);
		controller.enableAutostep(.45, .2, true);
		controller.setSlideEnabled(true);
		controller.setMaxSlopeClimbAngle(48 * Math.PI / 180);
		controller.setMinSlopeSlideAngle(36 * Math.PI / 180);
		ctrl.current = controller;
		return () => {
			world.removeCharacterController(controller);
			ctrl.current = null;
			clearProbe();
		};
	}, [world]);
	(0, import_react.useEffect)(() => {
		const down = (event) => {
			if (useGameStore.getState().archiveOpen) return;
			if (event.target?.closest("[data-ui]")) return;
			if (event.pointerType === "mouse" && event.button !== 0 && event.button !== 2) return;
			lookPointer.current = event.pointerId;
		};
		const movePointer = (event) => {
			if (lookPointer.current !== event.pointerId) return;
			if (event.movementX === 0 && event.movementY === 0) return;
			dragging.current = true;
			const mode = useGameStore.getState().cameraMode;
			const sens = mode === "first" ? .0026 : .0034;
			camYaw.current -= event.movementX * sens;
			pitch.current = Math.max(mode === "first" ? -1.05 : -.15, Math.min(mode === "first" ? 1.15 : .9, pitch.current - event.movementY * sens));
		};
		const up = (event) => {
			if (lookPointer.current !== event.pointerId) return;
			lookPointer.current = null;
			dragging.current = false;
		};
		window.addEventListener("pointerdown", down);
		window.addEventListener("pointermove", movePointer);
		window.addEventListener("pointerup", up);
		window.addEventListener("pointercancel", up);
		return () => {
			window.removeEventListener("pointerdown", down);
			window.removeEventListener("pointermove", movePointer);
			window.removeEventListener("pointerup", up);
			window.removeEventListener("pointercancel", up);
		};
	}, []);
	useFrame((state, delta) => {
		const dt = Math.min(delta, .1);
		const rb = body.current;
		const controller = ctrl.current;
		if (!rb || !controller) return;
		const collider = rb.collider(0);
		if (!collider) return;
		const store = useGameStore.getState();
		if (store.cameraMode !== modePrev.current) {
			if (store.cameraMode === "first") {
				camYaw.current = bodyYaw.current;
				pitch.current = 0;
			}
			modePrev.current = store.cameraMode;
		}
		const input = readMove();
		const speed = input.run ? RUN : WALK;
		const basis = camYaw.current;
		const fx = -Math.sin(basis);
		const fz = -Math.cos(basis);
		const rx = Math.cos(basis);
		const rz = -Math.sin(basis);
		let wx = fx * input.z + rx * input.x;
		let wz = fz * input.z + rz * input.x;
		const moving = wx * wx + wz * wz > 1e-4;
		if (moving) {
			const inv = 1 / Math.hypot(wx, wz);
			wx *= inv;
			wz *= inv;
		}
		const grounded = controller.computedGrounded();
		if (grounded) coyote.current = .14;
		else coyote.current = Math.max(0, coyote.current - dt);
		if (input.jump && !jumpPrev.current) jumpBuffer.current = .14;
		jumpPrev.current = input.jump;
		jumpBuffer.current = Math.max(0, jumpBuffer.current - dt);
		if (jumpBuffer.current > 0 && (grounded || coyote.current > 0) && vy.current <= .2) {
			vy.current = 7.4;
			jumpBuffer.current = 0;
			coyote.current = 0;
		}
		vy.current -= 22 * dt;
		if (vy.current < -18) vy.current = -18;
		if (grounded && vy.current < 0) vy.current = -2;
		if (vy.current > 0) controller.disableSnapToGround();
		else controller.enableSnapToGround(.4);
		const air = grounded || coyote.current > 0 ? 1 : .7;
		move.x = wx * speed * air * dt;
		move.y = vy.current * dt;
		move.z = wz * speed * air * dt;
		controller.computeColliderMovement(collider, move);
		const deltaMove = controller.computedMovement();
		const p = rb.translation();
		const nx = p.x + deltaMove.x;
		const ny = p.y + deltaMove.y;
		const nz = p.z + deltaMove.z;
		rb.setNextKinematicTranslation({
			x: nx,
			y: ny,
			z: nz
		});
		if (store.cameraMode === "first") bodyYaw.current = camYaw.current;
		else if (moving) bodyYaw.current = dampAngle(bodyYaw.current, Math.atan2(-wx, -wz), 12, dt);
		if (store.cameraMode === "third" && !dragging.current && !moving) {
			camYaw.current = dampAngle(camYaw.current, bodyYaw.current, 6, dt);
			pitch.current += (.32 - pitch.current) * (1 - Math.exp(-3 * dt));
		}
		if (visual.current) {
			visual.current.rotation.y = bodyYaw.current + Math.PI;
			visual.current.visible = store.cameraMode !== "first";
			visual.current.position.y = .12 + (moving ? Math.sin(state.clock.elapsedTime * (input.run ? 14 : 9)) * .035 : 0);
		}
		if (store.cameraMode === "first") {
			const c = Math.cos(pitch.current);
			const s = Math.sin(pitch.current);
			const eyeY = ny + .5;
			const ffx = -Math.sin(camYaw.current);
			const ffz = -Math.cos(camYaw.current);
			desired.set(nx, eyeY, nz);
			look.set(nx + ffx * c, eyeY + s, nz + ffz * c);
		} else {
			const back = 6.1 * Math.cos(pitch.current);
			const height = 1.15 + 6.1 * Math.sin(pitch.current);
			const cfx = -Math.sin(camYaw.current);
			const cfz = -Math.cos(camYaw.current);
			desired.set(nx - cfx * back, ny + height, nz - cfz * back);
			look.set(nx, ny + .85, nz);
		}
		const cam = state.camera;
		if (!booted.current) {
			cam.position.copy(desired);
			booted.current = true;
		} else cam.position.lerp(desired, 1 - Math.exp(-8 * dt));
		cam.lookAt(look);
		const dx = nx - MEMORY_ANCHOR.x;
		const dz = nz - MEMORY_ANCHOR.z;
		const near = dx * dx + dz * dz < INTERACT_RADIUS * INTERACT_RADIUS;
		if (near !== nearRef.current) {
			nearRef.current = near;
			useGameStore.getState().setNearMemory(near);
		}
		if (input.interact && !interactPrev.current && near) tryRecord(MEMORY_ID);
		interactPrev.current = input.interact;
		let nearest = Infinity;
		for (const source of HUM_SOURCES) {
			const dist = Math.hypot(nx - source.x, nz - source.z);
			if (dist < nearest) nearest = dist;
		}
		setHumLevel(Math.max(.005, .048 - nearest * .0035), useGameStore.getState().muted);
		if (!published.current) {
			publishProbe();
			published.current = true;
		}
		writeProbe(bodyYaw.current, moving ? speed : 0, nx, ny, nz, near);
		if (!readySent.current) {
			readySent.current = true;
			onReady();
		}
	});
	const avatar = useGameStore((s) => s.avatar);
	const skin = SKINS[avatar.skin];
	const cloth = CLOTHS[avatar.cloth];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		ref: body,
		type: "kinematicPosition",
		colliders: false,
		position: [
			0,
			1.35,
			9
		],
		enabledRotations: [
			false,
			false,
			false
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapsuleCollider, { args: [.4, .28] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: visual,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					castShadow: true,
					position: [
						0,
						0,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
						.28,
						.78,
						6,
						10
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: cloth,
						roughness: .78
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					castShadow: true,
					position: [
						.32,
						.12,
						0
					],
					rotation: [
						0,
						0,
						.18
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
						.07,
						.36,
						4,
						8
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: skin,
						roughness: .7
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					castShadow: true,
					position: [
						-.32,
						.12,
						0
					],
					rotation: [
						0,
						0,
						-.18
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
						.07,
						.36,
						4,
						8
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: skin,
						roughness: .7
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					castShadow: true,
					position: [
						0,
						.62,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.2,
						16,
						14
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: skin,
						roughness: .62
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						.64,
						.16
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.07,
						.045,
						.06
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: WORLD.skinDeep,
						roughness: .5
					})]
				})
			]
		})]
	});
}
var BOX_COLOR = {
	sand: WORLD.sand,
	stone: WORLD.stone,
	clay: WORLD.clay,
	dark: WORLD.dark
};
function Stone({ position, size, color, rotation }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		type: "fixed",
		colliders: "cuboid",
		position,
		rotation,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: size }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: BOX_COLOR[color],
				roughness: .92,
				metalness: .02
			})]
		})
	});
}
function Chimney({ position, height }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		type: "fixed",
		colliders: false,
		position,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
				args: [
					.42,
					height / 2,
					.42
				],
				position: [
					0,
					height / 2,
					0
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					height / 2,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.28,
					.42,
					height,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: WORLD.copper,
					metalness: .62,
					roughness: .38
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					height + .08,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.36,
					.3,
					.22,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: WORLD.copperDark,
					metalness: .5,
					roughness: .42,
					emissive: WORLD.gemEmissive,
					emissiveIntensity: .4
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
				position: [
					0,
					height + .2,
					0
				],
				color: WORLD.gem,
				intensity: 1.6,
				distance: 7,
				decay: 2
			})
		]
	});
}
function Palm({ position }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		type: "fixed",
		colliders: false,
		position,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
				args: [
					.18,
					1.05,
					.18
				],
				position: [
					0,
					1.05,
					0
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					1.05,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.1,
					.16,
					2.1,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: WORLD.trunk,
					roughness: .9
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					2.25,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.48,
					8,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: WORLD.leaf,
					roughness: .82
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.42,
					2.05,
					0
				],
				rotation: [
					.3,
					0,
					.8
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
					.16,
					.85,
					5
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: WORLD.leaf,
					roughness: .8
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.38,
					2.02,
					.12
				],
				rotation: [
					.2,
					.4,
					-.9
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
					.15,
					.8,
					5
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: WORLD.leaf,
					roughness: .8
				})]
			})
		]
	});
}
function MemoryGem() {
	const ref = (0, import_react.useRef)(null);
	const recorded = useGameStore((s) => s.memories.includes(MEMORY_ID));
	useFrame(({ clock }) => {
		const mesh = ref.current;
		if (!mesh) return;
		mesh.rotation.y = clock.elapsedTime * .55;
		mesh.position.y = 1.42 + Math.sin(clock.elapsedTime * 1.6) * .06;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref,
		position: [
			1.7,
			1.42,
			4.2
		],
		castShadow: true,
		onClick: (event) => {
			event.stopPropagation();
			tryRecord(MEMORY_ID);
		},
		onPointerOver: () => {
			document.body.style.cursor = "pointer";
		},
		onPointerOut: () => {
			document.body.style.cursor = "";
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("icosahedronGeometry", { args: [.36, 1] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: recorded ? "#8d7350" : WORLD.gem,
			emissive: recorded ? "#3a2a16" : WORLD.gemEmissive,
			emissiveIntensity: recorded ? .25 : 1.15,
			roughness: .35,
			metalness: .2
		})]
	});
}
function Ground() {
	const texture = (0, import_react.useMemo)(() => {
		const size = 64;
		const canvas = document.createElement("canvas");
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext("2d");
		if (!ctx) return null;
		const image = ctx.createImageData(size, size);
		for (let i = 0; i < image.data.length; i += 4) {
			const n = 150 + Math.random() * 90;
			image.data[i] = n;
			image.data[i + 1] = n;
			image.data[i + 2] = n;
			image.data[i + 3] = 255;
		}
		ctx.putImageData(image, 0, 0);
		const tex = new CanvasTexture(canvas);
		tex.wrapS = RepeatWrapping;
		tex.wrapT = RepeatWrapping;
		tex.repeat.set(12, 12);
		return tex;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: false,
			position: [
				0,
				-.5,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, { args: [
				40,
				.5,
				40
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				0,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [80, 80] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: WORLD.ground,
				roughness: 1,
				roughnessMap: texture ?? void 0
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				.02,
				5
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [3.2, 8] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: WORLD.groundAlt,
				roughness: .95
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				-4.8,
				.025,
				3
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [1.15, 11] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: WORLD.water,
				roughness: .22,
				metalness: .18
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				4.7,
				.08,
				7.4
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.9,
				.95,
				.16,
				16
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: WORLD.dark,
				roughness: .88
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				4.7,
				.15,
				7.4
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.62,
				.62,
				.06,
				16
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: WORLD.water,
				roughness: .2,
				metalness: .2
			})]
		})
	] });
}
function Bounds() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: [
		[
			0,
			3,
			-26,
			30,
			3,
			.5
		],
		[
			0,
			3,
			18,
			30,
			3,
			.5
		],
		[
			-24,
			3,
			0,
			.5,
			3,
			24
		],
		[
			24,
			3,
			0,
			.5,
			3,
			24
		]
	].map((wall) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		type: "fixed",
		position: [
			wall[0],
			wall[1],
			wall[2]
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, { args: [
			wall[3],
			wall[4],
			wall[5]
		] })
	}, wall.join(","))) });
}
function World() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ground, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bounds, {}),
		BOXES.map((box) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stone, { ...box }, box.position.join(":") + box.size.join("x"))),
		CHIMNEYS.map((chimney) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chimney, { ...chimney }, chimney.position.join(":"))),
		PALMS.map((position) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palm, { position }, position.join(":"))),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemoryGem, {})
	] });
}
function Scene({ onReady }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
			attach: "background",
			args: [WORLD.sky]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
			attach: "fog",
			args: [
				WORLD.fog,
				16,
				52
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
			"#ffe0b8",
			"#6b4a32",
			.55
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .28 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				16,
				24,
				10
			],
			intensity: 1.45,
			color: "#ffd7a8",
			castShadow: true,
			"shadow-mapSize-width": 1024,
			"shadow-mapSize-height": 1024,
			"shadow-camera-near": 1,
			"shadow-camera-far": 48,
			"shadow-camera-left": -22,
			"shadow-camera-right": 22,
			"shadow-camera-top": 22,
			"shadow-camera-bottom": -22,
			"shadow-bias": -6e-4
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
				gravity: [
					0,
					-22,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, { onReady })]
			})
		})
	] });
}
function Joystick() {
	const pad = (0, import_react.useRef)(null);
	const pointer = (0, import_react.useRef)(null);
	const [knob, setKnob] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	function place(event) {
		const rect = pad.current?.getBoundingClientRect();
		if (!rect) return;
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		let x = (event.clientX - cx) / (rect.width / 2);
		let y = (event.clientY - cy) / (rect.height / 2);
		const mag = Math.hypot(x, y);
		if (mag < .12) {
			x = 0;
			y = 0;
		} else if (mag > 1) {
			x /= mag;
			y /= mag;
		}
		setKnob({
			x,
			y
		});
		setStick(x, y, mag >= .12);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: pad,
		"data-ui": true,
		className: "relative size-32 rounded-full border border-border bg-surface/80",
		onPointerDown: (event) => {
			event.currentTarget.setPointerCapture(event.pointerId);
			pointer.current = event.pointerId;
			place(event);
		},
		onPointerMove: (event) => {
			if (pointer.current !== event.pointerId) return;
			place(event);
		},
		onPointerUp: (event) => {
			if (pointer.current !== event.pointerId) return;
			pointer.current = null;
			setKnob({
				x: 0,
				y: 0
			});
			setStick(0, 0, false);
		},
		onPointerCancel: () => {
			pointer.current = null;
			setKnob({
				x: 0,
				y: 0
			});
			setStick(0, 0, false);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute top-1/2 left-1/2 size-12 rounded-full bg-accent",
			style: { transform: `translate(calc(-50% + ${knob.x * 36}px), calc(-50% + ${knob.y * 36}px))` }
		})
	});
}
function HoldButton({ label, hold, disabled, onPress }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"data-ui": true,
		disabled,
		className: "min-h-14 min-w-14 rounded-full border border-border bg-surface px-4 text-sm font-medium text-fg disabled:opacity-40",
		onPointerDown: (event) => {
			event.preventDefault();
			setHold(hold, true);
			onPress?.();
		},
		onPointerUp: () => setHold(hold, false),
		onPointerLeave: () => setHold(hold, false),
		onPointerCancel: () => setHold(hold, false),
		onContextMenu: (event) => event.preventDefault(),
		children: label
	});
}
function Badge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full border border-border px-2 py-1 text-xs tracking-widest text-accent uppercase",
		children: CANON_LABEL[status]
	});
}
function Hud({ onLeave }) {
	const playerName = useGameStore((s) => s.playerName);
	const cameraMode = useGameStore((s) => s.cameraMode);
	const toggleCamera = useGameStore((s) => s.toggleCamera);
	const nearMemory = useGameStore((s) => s.nearMemory);
	const memories = useGameStore((s) => s.memories);
	const archiveOpen = useGameStore((s) => s.archiveOpen);
	const setArchiveOpen = useGameStore((s) => s.setArchiveOpen);
	const muted = useGameStore((s) => s.muted);
	const setMuted = useGameStore((s) => s.setMuted);
	const justRecordedId = useGameStore((s) => s.justRecordedId);
	const clearNotice = useGameStore((s) => s.clearNotice);
	const recorded = memories.includes(MEMORY_ID);
	(0, import_react.useEffect)(() => {
		if (!justRecordedId) return;
		const timer = window.setTimeout(clearNotice, 4200);
		return () => window.clearTimeout(timer);
	}, [justRecordedId, clearNotice]);
	(0, import_react.useEffect)(() => {
		const down = (event) => {
			if (event.repeat) return;
			if (event.code === "KeyC") toggleCamera();
			if (event.code === "Escape") setArchiveOpen(false);
		};
		window.addEventListener("keydown", down);
		return () => window.removeEventListener("keydown", down);
	}, [setArchiveOpen, toggleCamera]);
	const notice = justRecordedId ? recordById(justRecordedId) : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "hud-top pointer-events-none flex items-start justify-between gap-3 px-4 pt-4 pb-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto",
					"data-ui": true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-widest text-accent uppercase",
						children: ZONE_NAME
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl leading-none text-fg",
						children: playerName
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto flex gap-2",
					"data-ui": true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex size-11 items-center justify-center rounded-lg border border-border bg-surface text-fg",
							onClick: () => setMuted(!muted),
							"aria-label": muted ? "Unmute the Hum" : "Mute the Hum",
							children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex size-11 items-center justify-center rounded-lg border border-border bg-surface text-fg",
							onClick: toggleCamera,
							"aria-label": cameraMode === "third" ? "Switch to first person" : "Switch to third person",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex size-11 items-center justify-center rounded-lg border border-border bg-surface text-fg",
							onClick: () => setArchiveOpen(true),
							"aria-label": "Open archive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-5" })
						})
					]
				})]
			}),
			notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "pointer-events-none absolute top-20 left-1/2 w-[min(24rem,calc(100%-2rem))] -translate-x-1/2 rounded-lg border border-border bg-surface px-4 py-3 text-center text-sm text-fg",
				children: ["Memory recorded — ", notice.title]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 rounded-lg bg-surface px-4 py-2 text-center text-sm text-fg md:block",
				children: nearMemory ? recorded ? "Already in the archive" : "Press E to record this memory" : cameraMode === "third" ? "WASD move · Shift run · Space jump · drag to look · C camera" : "WASD move · Shift run · Space jump · drag to look · C camera"
			}),
			nearMemory && !recorded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute bottom-40 left-1/2 -translate-x-1/2 text-center text-sm text-fg md:hidden",
				children: "A memory is close"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-5 md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Joystick, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-end gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldButton, {
							label: "Run",
							hold: "run"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldButton, {
							label: recorded ? "Kept" : "Record",
							hold: "interact",
							disabled: !nearMemory || recorded,
							onPress: () => {
								if (nearMemory) tryRecord(MEMORY_ID);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldButton, {
							label: "Jump",
							hold: "jump"
						})
					]
				})]
			}),
			cameraMode === "first" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vignette pointer-events-none absolute inset-0" }),
			archiveOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-auto absolute inset-0 z-20 flex items-end justify-center bg-bg/80 sm:items-center",
				"data-ui": true,
				role: "dialog",
				"aria-modal": "true",
				"aria-labelledby": "archive-title",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-[86dvh] w-full max-w-lg overflow-y-auto rounded-t-xl border border-border bg-surface p-6 sm:rounded-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-5 flex items-start justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-widest text-accent uppercase",
								children: "Archive"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "archive-title",
								className: "font-display text-4xl leading-none text-fg",
								children: "What was kept"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "flex size-11 items-center justify-center rounded-lg border border-border text-fg",
								onClick: () => setArchiveOpen(false),
								"aria-label": "Close archive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mb-6 flex flex-col gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-medium text-fg",
								children: "Recorded by you"
							}), memories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Nothing yet. The golden fragment in the courtyard can be kept."
							}) : memories.map((id) => {
								const record = recordById(id);
								if (!record) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "rounded-lg border border-border bg-bg p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-2 flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-medium text-fg",
											children: record.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { status: record.canonStatus })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted",
										children: record.body
									})]
								}, id);
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mb-6 flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-medium text-fg",
									children: "How a record is marked"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "flex flex-col gap-2 text-sm text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-fg",
											children: "Canon"
										}), " — stated by the novels."] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-fg",
											children: "Interpretation"
										}), " — how the game pictures it."] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-fg",
											children: "Expansion"
										}), " — made for play."] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-fg",
											children: "Documented history"
										}), " — nonfiction, kept apart from the cosmology."] })
									]
								}),
								PLACE_NOTES.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "rounded-lg border border-border p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-2 flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-medium text-fg",
											children: note.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { status: note.canonStatus })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted",
										children: note.body
									})]
								}, note.id))
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mb-6 flex flex-col gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-medium text-fg",
								children: "Companion shelf"
							}), COMPANION_SHELF.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "rounded-lg border border-border bg-bg p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2 flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-medium text-fg",
										children: note.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { status: note.canonStatus })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: note.body
								})]
							}, note.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-fg underline decoration-border underline-offset-4",
							onClick: onLeave,
							children: "Leave the terrace"
						})
					]
				})
			}) : null
		]
	});
}
function Play({ onLeave }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	const archiveOpen = useGameStore((s) => s.archiveOpen);
	(0, import_react.useEffect)(() => {
		const unbind = bindInput(window);
		return () => {
			unbind();
			setHumLevel(0, true);
			document.body.style.cursor = "";
		};
	}, []);
	(0, import_react.useEffect)(() => {
		setInputBlocked(archiveOpen);
	}, [archiveOpen]);
	function leave() {
		resetInput();
		useGameStore.getState().setArchiveOpen(false);
		useGameStore.getState().setNearMemory(false);
		onLeave();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full overflow-hidden bg-bg touch-none",
		onContextMenu: (event) => event.preventDefault(),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
				shadows: { type: 1 },
				dpr: [1, 1.5],
				camera: {
					fov: 62,
					near: .08,
					far: 120,
					position: [
						0,
						4,
						15
					]
				},
				gl: {
					antialias: true,
					powerPreference: "high-performance"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, { onReady: () => setReady(true) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, { onLeave: leave }),
			ready ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settling, { overlay: true })
		]
	});
}
//#endregion
export { Play as default };
