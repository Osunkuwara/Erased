import { i as __toESM } from "../_runtime.mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DhP25J7r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var ctx = null;
var humGain = null;
function audioCtor() {
	if (typeof window === "undefined") return void 0;
	if (typeof AudioContext !== "undefined") return AudioContext;
	return window.webkitAudioContext;
}
function unlockAudio() {
	const Ctor = audioCtor();
	if (!Ctor) return;
	let audio = ctx;
	if (!audio) {
		audio = new Ctor();
		const filter = audio.createBiquadFilter();
		filter.type = "lowpass";
		filter.frequency.value = 220;
		const gain = audio.createGain();
		gain.gain.value = 0;
		const low = audio.createOscillator();
		low.type = "sine";
		low.frequency.value = 58;
		const mid = audio.createOscillator();
		mid.type = "triangle";
		mid.frequency.value = 87;
		const midGain = audio.createGain();
		midGain.gain.value = .35;
		low.connect(filter);
		mid.connect(midGain);
		midGain.connect(filter);
		filter.connect(gain);
		gain.connect(audio.destination);
		low.start();
		mid.start();
		ctx = audio;
		humGain = gain;
	}
	audio.resume();
}
function setHumLevel(level, muted) {
	if (!ctx || !humGain) return;
	const next = muted ? 0 : Math.max(0, Math.min(.06, level));
	humGain.gain.setTargetAtTime(next, ctx.currentTime, .18);
}
function chime() {
	if (!ctx) return;
	const now = ctx.currentTime;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = "sine";
	osc.frequency.setValueAtTime(392, now);
	osc.frequency.exponentialRampToValueAtTime(784, now + .18);
	gain.gain.setValueAtTime(1e-4, now);
	gain.gain.exponentialRampToValueAtTime(.07, now + .03);
	gain.gain.exponentialRampToValueAtTime(1e-4, now + .7);
	osc.connect(gain);
	gain.connect(ctx.destination);
	osc.start(now);
	osc.stop(now + .72);
}
var initial = {
	playerName: "",
	cameraMode: "third",
	memories: [],
	avatar: {
		skin: "sand",
		cloth: "indigo"
	},
	muted: false
};
var useGameStore = create()(persist((set, get) => ({
	...initial,
	nearMemory: false,
	archiveOpen: false,
	justRecordedId: null,
	setPlayerName: (playerName) => set({ playerName }),
	setCameraMode: (cameraMode) => set({ cameraMode }),
	toggleCamera: () => set({ cameraMode: get().cameraMode === "third" ? "first" : "third" }),
	setAvatar: (avatar) => set({ avatar }),
	setNearMemory: (nearMemory) => set({ nearMemory }),
	setArchiveOpen: (archiveOpen) => set({ archiveOpen }),
	setMuted: (muted) => set({ muted }),
	recordMemory: (id) => {
		const { memories } = get();
		if (memories.includes(id)) return false;
		set({
			memories: [...memories, id],
			justRecordedId: id
		});
		return true;
	},
	clearNotice: () => set({ justRecordedId: null }),
	resetSave: () => {
		set({
			...initial,
			nearMemory: false,
			archiveOpen: false,
			justRecordedId: null
		});
		useGameStore.persist.clearStorage();
	}
}), {
	name: "n8g-erased-player-save",
	version: 1,
	skipHydration: true,
	storage: createJSONStorage(() => localStorage),
	partialize: (state) => ({
		playerName: state.playerName,
		cameraMode: state.cameraMode,
		memories: state.memories,
		avatar: state.avatar,
		muted: state.muted
	})
}));
var MEMORY_ID = "terrace-hum-fragment-01";
var MEMORY_ANCHOR = {
	x: 1.7,
	y: 0,
	z: 4.2
};
var ZONE_NAME = "Terraced City";
var CANON_LABEL = {
	canon: "Canon",
	interpretation: "Interpretation",
	expansion: "Expansion",
	documented_history: "Documented history"
};
var RECORDS = [
	{
		id: MEMORY_ID,
		title: "The chimney that sings",
		body: "The chimneys of the Terraced City are functional, not ornamental. They are bound to the Hum, and that sound is part of how the city knows itself.",
		canonStatus: "canon",
		zone: "terraced-city"
	},
	{
		id: "terrace-greybox-layout",
		title: "Courtyard reading",
		body: "The walkable courtyard, ramp and block masses are a gameplay picture of the terraces. They are not a measured plan from the novels.",
		canonStatus: "interpretation",
		zone: "terraced-city"
	},
	{
		id: "memory-record-act",
		title: "Recording a fragment",
		body: "Keeping a fragment on your person is a game action. The novels do not describe this archive.",
		canonStatus: "expansion",
		zone: "terraced-city"
	},
	{
		id: "operation-legacy",
		title: "Operation Legacy",
		body: "As empires withdrew, colonial administrations destroyed and concealed official records. This note belongs to the nonfiction companion. It is not part of the city's cosmology.",
		canonStatus: "documented_history",
		zone: "companion"
	}
];
function recordById(id) {
	return RECORDS.find((record) => record.id === id);
}
var PLACE_NOTES = RECORDS.filter((record) => record.canonStatus === "interpretation" || record.canonStatus === "expansion");
var COMPANION_SHELF = RECORDS.filter((record) => record.canonStatus === "documented_history");
var WORLD = {
	ground: "#b08968",
	groundAlt: "#c4a27c",
	sand: "#c7a67d",
	stone: "#a88866",
	clay: "#9a704f",
	dark: "#5c4638",
	copper: "#b87343",
	copperDark: "#7c4e2e",
	water: "#7e8b80",
	leaf: "#6d7a48",
	trunk: "#6a4b34",
	fog: "#e4c7a4",
	sky: "#e7c9a6",
	gem: "#e4c27a",
	gemEmissive: "#c47a32",
	skinDeep: "#2a211b"
};
var SKINS = {
	sand: "#c48a62",
	deep: "#6b3a2a",
	olive: "#8d6a45"
};
var CLOTHS = {
	indigo: "#3e4d68",
	copper: "#a8643c",
	cream: "#efe2cf"
};
var SKIN_OPTIONS = [
	{
		id: "sand",
		label: "Sand"
	},
	{
		id: "deep",
		label: "Deep"
	},
	{
		id: "olive",
		label: "Olive"
	}
];
var CLOTH_OPTIONS = [
	{
		id: "indigo",
		label: "Indigo"
	},
	{
		id: "copper",
		label: "Copper"
	},
	{
		id: "cream",
		label: "Cream"
	}
];
function Settling({ overlay = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `${overlay ? "absolute inset-0 z-20" : "h-dvh"} flex items-center justify-center bg-bg px-6 text-center`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-3xl text-fg",
			children: "The terraces are settling…"
		})
	});
}
function EntryScreen({ onStart }) {
	const savedName = useGameStore((s) => s.playerName);
	const memories = useGameStore((s) => s.memories);
	const setPlayerName = useGameStore((s) => s.setPlayerName);
	const setAvatar = useGameStore((s) => s.setAvatar);
	const resetSave = useGameStore((s) => s.resetSave);
	const [nameInput, setNameInput] = (0, import_react.useState)("");
	const [skin, setSkin] = (0, import_react.useState)("sand");
	const [cloth, setCloth] = (0, import_react.useState)("indigo");
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const apply = () => {
			const state = useGameStore.getState();
			setNameInput(state.playerName);
			setSkin(state.avatar.skin);
			setCloth(state.avatar.cloth);
			setHydrated(true);
		};
		if (useGameStore.persist.hasHydrated()) apply();
		const unsub = useGameStore.persist.onFinishHydration(apply);
		useGameStore.persist.rehydrate();
		return unsub;
	}, []);
	const recorded = memories.includes(MEMORY_ID);
	const hasSave = Boolean(savedName) || memories.length > 0;
	function begin() {
		const name = nameInput.trim();
		if (!name) return;
		setPlayerName(name);
		setAvatar({
			skin,
			cloth
		});
		unlockAudio();
		onStart();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative flex min-h-dvh items-center justify-center overflow-hidden bg-bg px-5 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "terrace-silhouette",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "chimney" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "step step-a" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "step step-b" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "step step-c" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "relative z-10 flex w-full max-w-md flex-col gap-5",
			onSubmit: (event) => {
				event.preventDefault();
				begin();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-widest text-accent uppercase",
							children: "N8G presents"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-6xl leading-none text-fg sm:text-7xl",
							children: "The Erased"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-sm text-muted",
							children: "The terraces are still here. The chimneys still carry the Hum."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "player-name",
						className: "text-sm font-medium text-fg",
						children: "Create your identity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "player-name",
						value: nameInput,
						onChange: (event) => setNameInput(event.target.value),
						placeholder: "Character name",
						maxLength: 24,
						autoComplete: "off",
						className: "min-h-11 rounded-lg border border-border bg-surface px-4 text-fg placeholder:text-muted"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					className: "flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "text-sm font-medium text-fg",
						children: "Skin"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-3",
						role: "radiogroup",
						"aria-label": "Skin",
						children: SKIN_OPTIONS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "radio",
							"aria-checked": skin === option.id,
							"aria-label": option.label,
							onClick: () => setSkin(option.id),
							className: `size-11 rounded-full border border-border ${skin === option.id ? "ring-2 ring-accent ring-offset-2 ring-offset-bg" : ""}`,
							style: { backgroundColor: SKINS[option.id] }
						}, option.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					className: "flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "text-sm font-medium text-fg",
						children: "Cloth"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-3",
						role: "radiogroup",
						"aria-label": "Cloth",
						children: CLOTH_OPTIONS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "radio",
							"aria-checked": cloth === option.id,
							"aria-label": option.label,
							onClick: () => setCloth(option.id),
							className: `size-11 rounded-full border border-border ${cloth === option.id ? "ring-2 ring-accent ring-offset-2 ring-offset-bg" : ""}`,
							style: { backgroundColor: CLOTHS[option.id] }
						}, option.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "ui-fade min-h-12 rounded-lg bg-accent px-5 text-base font-medium text-bg transition-opacity duration-150 disabled:opacity-40",
					disabled: !hydrated || !nameInput.trim(),
					children: savedName ? "Start again in the terrace" : "Start in the terrace"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Walk, run and jump. Switch the camera. Record what the city still remembers." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Progress stays on this device." }),
						recorded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "You have already recorded “The chimney that sings”." }) : null,
						hasSave ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "self-start text-sm text-fg underline decoration-border underline-offset-4",
							onClick: () => {
								resetSave();
								setNameInput("");
								setSkin("sand");
								setCloth("indigo");
							},
							children: "Forget this identity"
						}) : null
					]
				})
			]
		})]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
var Play = (0, import_react.lazy)(() => import("./Play-CnFAut_V.mjs"));
function Home() {
	const [live, setLive] = (0, import_react.useState)(false);
	if (!live) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryScreen, { onStart: () => setLive(true) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settling, {}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { onLeave: () => setLive(false) })
	});
}
//#endregion
export { WORLD as a, MEMORY_ANCHOR as c, ZONE_NAME as d, recordById as f, setHumLevel as h, SKINS as i, MEMORY_ID as l, chime as m, Settling as n, CANON_LABEL as o, useGameStore as p, CLOTHS as r, COMPANION_SHELF as s, routes_exports as t, PLACE_NOTES as u };
