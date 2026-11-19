import { i as __toESM } from "../_runtime.mjs";
import { a as WORLD, c as MEMORY_ANCHOR, d as ZONE_NAME, f as recordById, h as setHumLevel, i as SKINS, l as MEMORY_ID, m as chime, n as Settling, o as CANON_LABEL, p as useGameStore, r as CLOTHS, s as COMPANION_SHELF, u as PLACE_NOTES } from "./routes-C2QMruAD.mjs";
import { _ as Vector3, g as RepeatWrapping, l as CanvasTexture, n as useFrame, t as Canvas, y as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { a as useRapier, i as RigidBody, n as CuboidCollider, r as Physics, t as CapsuleCollider } from "../_libs/@react-three/rapier+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { a as Camera, n as VolumeX, o as BookOpen, r as Volume2, t as X } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/Play-2iOsW__H.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
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
	const clear = () => resetInput();
	const onHide = () => {
		if (document.hidden) resetInput();
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
var _jsxFileName$4 = "/app/applet/src/game/Player.tsx";
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
	const lastPointerPos = (0, import_react.useRef)(null);
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
			lastPointerPos.current = {
				x: event.clientX,
				y: event.clientY
			};
		};
		const movePointer = (event) => {
			if (lookPointer.current !== event.pointerId) return;
			const last = lastPointerPos.current;
			if (!last) {
				lastPointerPos.current = {
					x: event.clientX,
					y: event.clientY
				};
				return;
			}
			const dx = event.clientX - last.x;
			const dy = event.clientY - last.y;
			lastPointerPos.current = {
				x: event.clientX,
				y: event.clientY
			};
			if (dx === 0 && dy === 0) return;
			dragging.current = true;
			const mode = useGameStore.getState().cameraMode;
			const sens = mode === "first" ? .0026 : .0034;
			camYaw.current -= dx * sens;
			pitch.current = Math.max(mode === "first" ? -1.05 : -.15, Math.min(mode === "first" ? 1.15 : .9, pitch.current - dy * sens));
		};
		const up = (event) => {
			if (lookPointer.current !== event.pointerId) return;
			lookPointer.current = null;
			lastPointerPos.current = null;
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RigidBody, {
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
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CapsuleCollider, { args: [.4, .28] }, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 263,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("group", {
			ref: visual,
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("mesh", {
					castShadow: true,
					position: [
						0,
						0,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("capsuleGeometry", { args: [
						.28,
						.78,
						6,
						10
					] }, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 266,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meshStandardMaterial", {
						color: cloth,
						roughness: .78
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 267,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 265,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("mesh", {
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
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("capsuleGeometry", { args: [
						.07,
						.36,
						4,
						8
					] }, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 270,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meshStandardMaterial", {
						color: skin,
						roughness: .7
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 271,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 269,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("mesh", {
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
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("capsuleGeometry", { args: [
						.07,
						.36,
						4,
						8
					] }, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 274,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meshStandardMaterial", {
						color: skin,
						roughness: .7
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 275,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 273,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("mesh", {
					castShadow: true,
					position: [
						0,
						.62,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("sphereGeometry", { args: [
						.2,
						16,
						14
					] }, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 278,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meshStandardMaterial", {
						color: skin,
						roughness: .62
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 279,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 277,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("mesh", {
					position: [
						0,
						.64,
						.16
					],
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("boxGeometry", { args: [
						.07,
						.045,
						.06
					] }, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 282,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meshStandardMaterial", {
						color: WORLD.skinDeep,
						roughness: .5
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 283,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 281,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$4,
			lineNumber: 264,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 256,
		columnNumber: 5
	}, this);
}
var _jsxFileName$3 = "/app/applet/src/game/World.tsx";
var BOX_COLOR = {
	sand: WORLD.sand,
	stone: WORLD.stone,
	clay: WORLD.clay,
	dark: WORLD.dark
};
function Stone({ position, size, color, rotation }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RigidBody, {
		type: "fixed",
		colliders: "cuboid",
		position,
		rotation,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("mesh", {
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("boxGeometry", { args: size }, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 23,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meshStandardMaterial", {
				color: BOX_COLOR[color],
				roughness: .92,
				metalness: .02
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 24,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 22,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$3,
		lineNumber: 21,
		columnNumber: 5
	}, this);
}
function Chimney({ position, height }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RigidBody, {
		type: "fixed",
		colliders: false,
		position,
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CuboidCollider, {
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
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 33,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("mesh", {
				position: [
					0,
					height / 2,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("cylinderGeometry", { args: [
					.28,
					.42,
					height,
					10
				] }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 35,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meshStandardMaterial", {
					color: WORLD.copper,
					metalness: .62,
					roughness: .38
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 36,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 34,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("mesh", {
				position: [
					0,
					height + .08,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("cylinderGeometry", { args: [
					.36,
					.3,
					.22,
					10
				] }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 39,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meshStandardMaterial", {
					color: WORLD.copperDark,
					metalness: .5,
					roughness: .42,
					emissive: WORLD.gemEmissive,
					emissiveIntensity: .4
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 40,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 38,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("pointLight", {
				position: [
					0,
					height + .2,
					0
				],
				color: WORLD.gem,
				intensity: 1.6,
				distance: 7,
				decay: 2
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 48,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 32,
		columnNumber: 5
	}, this);
}
function Palm({ position }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RigidBody, {
		type: "fixed",
		colliders: false,
		position,
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CuboidCollider, {
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
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 62,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("mesh", {
				position: [
					0,
					1.05,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("cylinderGeometry", { args: [
					.1,
					.16,
					2.1,
					6
				] }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 64,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meshStandardMaterial", {
					color: WORLD.trunk,
					roughness: .9
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 65,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 63,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("mesh", {
				position: [
					0,
					2.25,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("sphereGeometry", { args: [
					.48,
					8,
					6
				] }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 68,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meshStandardMaterial", {
					color: WORLD.leaf,
					roughness: .82
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 69,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 67,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("mesh", {
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
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("coneGeometry", { args: [
					.16,
					.85,
					5
				] }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 72,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meshStandardMaterial", {
					color: WORLD.leaf,
					roughness: .8
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 73,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 71,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("mesh", {
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
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("coneGeometry", { args: [
					.15,
					.8,
					5
				] }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 76,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meshStandardMaterial", {
					color: WORLD.leaf,
					roughness: .8
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 77,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 75,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 61,
		columnNumber: 5
	}, this);
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("mesh", {
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
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("icosahedronGeometry", { args: [.36, 1] }, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 110,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meshStandardMaterial", {
			color: recorded ? "#8d7350" : WORLD.gem,
			emissive: recorded ? "#3a2a16" : WORLD.gemEmissive,
			emissiveIntensity: recorded ? .25 : 1.15,
			roughness: .35,
			metalness: .2
		}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 111,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 95,
		columnNumber: 5
	}, this);
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RigidBody, {
			type: "fixed",
			colliders: false,
			position: [
				0,
				-.5,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CuboidCollider, { args: [
				40,
				.5,
				40
			] }, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 149,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 148,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("mesh", {
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
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("planeGeometry", { args: [80, 80] }, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 152,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meshStandardMaterial", {
				color: WORLD.ground,
				roughness: 1,
				roughnessMap: texture ?? void 0
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 153,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 151,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("mesh", {
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
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("planeGeometry", { args: [3.2, 8] }, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 156,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meshStandardMaterial", {
				color: WORLD.groundAlt,
				roughness: .95
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 157,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 155,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("mesh", {
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
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("planeGeometry", { args: [1.15, 11] }, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 160,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meshStandardMaterial", {
				color: WORLD.water,
				roughness: .22,
				metalness: .18
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 161,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 159,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("mesh", {
			position: [
				4.7,
				.08,
				7.4
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("cylinderGeometry", { args: [
				.9,
				.95,
				.16,
				16
			] }, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 164,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meshStandardMaterial", {
				color: WORLD.dark,
				roughness: .88
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 165,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 163,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("mesh", {
			position: [
				4.7,
				.15,
				7.4
			],
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("cylinderGeometry", { args: [
				.62,
				.62,
				.06,
				16
			] }, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 168,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meshStandardMaterial", {
				color: WORLD.water,
				roughness: .2,
				metalness: .2
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 169,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 167,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 147,
		columnNumber: 5
	}, this);
}
function Bounds() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
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
	].map((wall) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RigidBody, {
		type: "fixed",
		position: [
			wall[0],
			wall[1],
			wall[2]
		],
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CuboidCollider, { args: [
			wall[3],
			wall[4],
			wall[5]
		] }, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 186,
			columnNumber: 11
		}, this)
	}, wall.join(","), false, {
		fileName: _jsxFileName$3,
		lineNumber: 185,
		columnNumber: 9
	}, this)) }, void 0, false, {
		fileName: _jsxFileName$3,
		lineNumber: 183,
		columnNumber: 5
	}, this);
}
function World() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Ground, {}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 196,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bounds, {}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 197,
			columnNumber: 7
		}, this),
		BOXES.map((box) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stone, { ...box }, box.position.join(":") + box.size.join("x"), false, {
			fileName: _jsxFileName$3,
			lineNumber: 199,
			columnNumber: 9
		}, this)),
		CHIMNEYS.map((chimney) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Chimney, { ...chimney }, chimney.position.join(":"), false, {
			fileName: _jsxFileName$3,
			lineNumber: 202,
			columnNumber: 9
		}, this)),
		PALMS.map((position) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Palm, { position }, position.join(":"), false, {
			fileName: _jsxFileName$3,
			lineNumber: 205,
			columnNumber: 9
		}, this)),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MemoryGem, {}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 207,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 195,
		columnNumber: 5
	}, this);
}
var _jsxFileName$2 = "/app/applet/src/game/Scene.tsx";
function Scene({ onReady }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("color", {
			attach: "background",
			args: [WORLD.sky]
		}, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 14,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("fog", {
			attach: "fog",
			args: [
				WORLD.fog,
				16,
				52
			]
		}, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 15,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("hemisphereLight", { args: [
			"#ffe0b8",
			"#6b4a32",
			.55
		] }, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 16,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ambientLight", { intensity: .28 }, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 17,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("directionalLight", {
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
		}, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 18,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Physics, {
				gravity: [
					0,
					-22,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(World, {}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 35,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Player, { onReady }, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 36,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 34,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 33,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 13,
		columnNumber: 5
	}, this);
}
var _jsxFileName$1 = "/app/applet/src/game/ui/Hud.tsx";
function Joystick() {
	const pad = (0, import_react.useRef)(null);
	const pointer = (0, import_react.useRef)(null);
	const [knob, setKnob] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const archiveOpen = useGameStore((s) => s.archiveOpen);
	(0, import_react.useEffect)(() => {
		if (archiveOpen) {
			pointer.current = null;
			setKnob({
				x: 0,
				y: 0
			});
			setStick(0, 0, false);
		}
	}, [archiveOpen]);
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
	function resetJoystick(event) {
		if (event && event.currentTarget && event.currentTarget.hasPointerCapture(event.pointerId)) try {
			event.currentTarget.releasePointerCapture(event.pointerId);
		} catch {}
		pointer.current = null;
		setKnob({
			x: 0,
			y: 0
		});
		setStick(0, 0, false);
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		ref: pad,
		"data-ui": true,
		className: "relative size-32 rounded-full border border-border bg-surface/80",
		onPointerDown: (event) => {
			try {
				event.currentTarget.setPointerCapture(event.pointerId);
			} catch {}
			pointer.current = event.pointerId;
			place(event);
		},
		onPointerMove: (event) => {
			if (pointer.current !== event.pointerId) return;
			place(event);
		},
		onPointerUp: (event) => {
			if (pointer.current !== event.pointerId) return;
			resetJoystick(event);
		},
		onPointerCancel: (event) => {
			resetJoystick(event);
		},
		onLostPointerCapture: (event) => {
			resetJoystick(event);
		},
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "absolute top-1/2 left-1/2 size-12 rounded-full bg-accent",
			style: { transform: `translate(calc(-50% + ${knob.x * 36}px), calc(-50% + ${knob.y * 36}px))` }
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 90,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 62,
		columnNumber: 5
	}, this);
}
function HoldButton({ label, hold, disabled, onPress }) {
	const pointerIdRef = (0, import_react.useRef)(null);
	const archiveOpen = useGameStore((s) => s.archiveOpen);
	(0, import_react.useEffect)(() => {
		if (archiveOpen) {
			pointerIdRef.current = null;
			setHold(hold, false);
		}
	}, [archiveOpen, hold]);
	function releaseHold(event) {
		if (event && event.currentTarget && pointerIdRef.current !== null) try {
			if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
		} catch {}
		pointerIdRef.current = null;
		setHold(hold, false);
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
		type: "button",
		"data-ui": true,
		disabled,
		className: "min-h-14 min-w-14 rounded-full border border-border bg-surface px-4 text-sm font-medium text-fg disabled:opacity-40",
		onPointerDown: (event) => {
			event.preventDefault();
			try {
				event.currentTarget.setPointerCapture(event.pointerId);
			} catch {}
			pointerIdRef.current = event.pointerId;
			setHold(hold, true);
			onPress?.();
		},
		onPointerUp: (event) => releaseHold(event),
		onPointerCancel: (event) => releaseHold(event),
		onLostPointerCapture: (event) => releaseHold(event),
		onContextMenu: (event) => event.preventDefault(),
		children: label
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 134,
		columnNumber: 5
	}, this);
}
function Badge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "rounded-full border border-border px-2 py-1 text-xs tracking-widest text-accent uppercase",
		children: CANON_LABEL[status]
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 162,
		columnNumber: 5
	}, this);
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "pointer-events-none absolute inset-0 z-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
				className: "hud-top pointer-events-none flex items-start justify-between gap-3 px-4 pt-4 pb-10",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "pointer-events-auto",
					"data-ui": true,
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs tracking-widest text-accent uppercase",
						children: ZONE_NAME
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 205,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "font-display text-2xl leading-none text-fg",
						children: playerName
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 206,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 204,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "pointer-events-auto flex gap-2",
					"data-ui": true,
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							className: "flex size-11 items-center justify-center rounded-lg border border-border bg-surface text-fg",
							onClick: () => setMuted(!muted),
							"aria-label": muted ? "Unmute the Hum" : "Mute the Hum",
							children: muted ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(VolumeX, { className: "size-5" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 215,
								columnNumber: 22
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Volume2, { className: "size-5" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 215,
								columnNumber: 55
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 209,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							className: "flex size-11 items-center justify-center rounded-lg border border-border bg-surface text-fg",
							onClick: toggleCamera,
							"aria-label": cameraMode === "third" ? "Switch to first person" : "Switch to third person",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Camera, { className: "size-5" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 223,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 217,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							className: "flex size-11 items-center justify-center rounded-lg border border-border bg-surface text-fg",
							onClick: () => setArchiveOpen(true),
							"aria-label": "Open archive",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BookOpen, { className: "size-5" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 231,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 225,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 208,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 203,
				columnNumber: 7
			}, this),
			notice ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "pointer-events-none absolute top-20 left-1/2 w-[min(24rem,calc(100%-2rem))] -translate-x-1/2 rounded-lg border border-border bg-surface px-4 py-3 text-center text-sm text-fg",
				children: ["Memory recorded — ", notice.title]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 237,
				columnNumber: 9
			}, this) : null,
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 rounded-lg bg-surface px-4 py-2 text-center text-sm text-fg md:block",
				children: nearMemory ? recorded ? "Already in the archive" : "Press E to record this memory" : cameraMode === "third" ? "WASD move · Shift run · Space jump · drag to look · C camera" : "WASD move · Shift run · Space jump · drag to look · C camera"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 242,
				columnNumber: 7
			}, this),
			nearMemory && !recorded ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "pointer-events-none absolute bottom-40 left-1/2 -translate-x-1/2 text-center text-sm text-fg md:hidden",
				children: "A memory is close"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 253,
				columnNumber: 9
			}, this) : null,
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-5 md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Joystick, {}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 259,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col items-end gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HoldButton, {
							label: "Run",
							hold: "run"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 261,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HoldButton, {
							label: recorded ? "Kept" : "Record",
							hold: "interact",
							disabled: !nearMemory || recorded,
							onPress: () => {
								if (nearMemory) tryRecord(MEMORY_ID);
							}
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 262,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HoldButton, {
							label: "Jump",
							hold: "jump"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 270,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 260,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 258,
				columnNumber: 7
			}, this),
			cameraMode === "first" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "pointer-events-none absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" }, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 275,
				columnNumber: 9
			}, this) : null,
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "vignette pointer-events-none absolute inset-0" }, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 278,
				columnNumber: 7
			}, this),
			archiveOpen ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "pointer-events-auto absolute inset-0 z-20 flex items-end justify-center bg-bg/80 sm:items-center",
				"data-ui": true,
				role: "dialog",
				"aria-modal": "true",
				"aria-labelledby": "archive-title",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "max-h-[86dvh] w-full max-w-lg overflow-y-auto rounded-t-xl border border-border bg-surface p-6 sm:rounded-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mb-5 flex items-start justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs tracking-widest text-accent uppercase",
								children: "Archive"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 291,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								id: "archive-title",
								className: "font-display text-4xl leading-none text-fg",
								children: "What was kept"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 292,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 290,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								className: "flex size-11 items-center justify-center rounded-lg border border-border text-fg",
								onClick: () => setArchiveOpen(false),
								"aria-label": "Close archive",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "size-5" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 302,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 296,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 289,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
							className: "mb-6 flex flex-col gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
								className: "text-sm font-medium text-fg",
								children: "Recorded by you"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 307,
								columnNumber: 15
							}, this), memories.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-sm text-muted",
								children: "Nothing yet. The golden fragment in the courtyard can be kept."
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 309,
								columnNumber: 17
							}, this) : memories.map((id) => {
								const record = recordById(id);
								if (!record) return null;
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
									className: "rounded-lg border border-border bg-bg p-4",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "mb-2 flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
											className: "font-medium text-fg",
											children: record.title
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 317,
											columnNumber: 25
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, { status: record.canonStatus }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 318,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 316,
										columnNumber: 23
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-sm text-muted",
										children: record.body
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 320,
										columnNumber: 23
									}, this)]
								}, id, true, {
									fileName: _jsxFileName$1,
									lineNumber: 315,
									columnNumber: 21
								}, this);
							})]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 306,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
							className: "mb-6 flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
									className: "text-sm font-medium text-fg",
									children: "How a record is marked"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 328,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
									className: "flex flex-col gap-2 text-sm text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-fg",
											children: "Canon"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 331,
											columnNumber: 19
										}, this), " — stated by the novels."] }, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 330,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-fg",
											children: "Interpretation"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 334,
											columnNumber: 19
										}, this), " — how the game pictures it."] }, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 333,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-fg",
											children: "Expansion"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 337,
											columnNumber: 19
										}, this), " — made for play."] }, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 336,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-fg",
											children: "Documented history"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 340,
											columnNumber: 19
										}, this), " — nonfiction, kept apart from the cosmology."] }, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 339,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 329,
									columnNumber: 15
								}, this),
								PLACE_NOTES.map((note) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
									className: "rounded-lg border border-border p-4",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "mb-2 flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
											className: "font-medium text-fg",
											children: note.title
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 346,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, { status: note.canonStatus }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 347,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 345,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-sm text-muted",
										children: note.body
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 349,
										columnNumber: 19
									}, this)]
								}, note.id, true, {
									fileName: _jsxFileName$1,
									lineNumber: 344,
									columnNumber: 17
								}, this))
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 327,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
							className: "mb-6 flex flex-col gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
								className: "text-sm font-medium text-fg",
								children: "Companion shelf"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 355,
								columnNumber: 15
							}, this), COMPANION_SHELF.map((note) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
								className: "rounded-lg border border-border bg-bg p-4",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mb-2 flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
										className: "font-medium text-fg",
										children: note.title
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 359,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, { status: note.canonStatus }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 360,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 358,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-sm text-muted",
									children: note.body
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 362,
									columnNumber: 19
								}, this)]
							}, note.id, true, {
								fileName: _jsxFileName$1,
								lineNumber: 357,
								columnNumber: 17
							}, this))]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 354,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							className: "text-sm text-fg underline decoration-border underline-offset-4",
							onClick: onLeave,
							children: "Leave the terrace"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 367,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 288,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 281,
				columnNumber: 9
			}, this) : null
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 202,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/game/Play.tsx";
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
		if (archiveOpen) resetInput();
	}, [archiveOpen]);
	function leave() {
		resetInput();
		useGameStore.getState().setArchiveOpen(false);
		useGameStore.getState().setNearMemory(false);
		onLeave();
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		className: "relative h-dvh w-full overflow-hidden bg-bg touch-none",
		onContextMenu: (event) => event.preventDefault(),
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Canvas, {
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
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Scene, { onReady: () => setReady(true) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 53,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 47,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Hud, { onLeave: leave }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 55,
				columnNumber: 7
			}, this),
			ready ? null : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Settling, { overlay: true }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 56,
				columnNumber: 23
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 43,
		columnNumber: 5
	}, this);
}
export { Play as default };
