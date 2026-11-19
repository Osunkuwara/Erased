import { i as __toESM } from "../_runtime.mjs";
import { y as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/routes-4hLiTYmq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
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
var ZONE_NAME = "Terraced City & World Regions";
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
		body: "The chimneys of the Terraced City do not vent smoke; they draw aether, breathe air, warm houses, sing in harmony, and remember the names of the dead sung into them by grieving families.",
		canonStatus: "canon",
		zone: "terraced-city",
		position: {
			x: 1.7,
			y: 0,
			z: 4.2
		}
	},
	{
		id: "quarry-basalt-seam",
		title: "The Great Quarry and Stone",
		body: "At the great quarry above the city, master mason Kesi taught Asha that every stone carries the shape of the block it is willing to become. You do not cut it; you ask.",
		canonStatus: "canon",
		zone: "the-quarry",
		position: {
			x: -14,
			y: 0,
			z: -10
		}
	},
	{
		id: "council-ring-totems",
		title: "The Council Ring and Totems",
		body: "Carved from a single outcrop of sandstone and black basalt, the Council Ring holds twenty-four Custodians and Queen Nefret, keeping the seven ancient totems and the seed of light.",
		canonStatus: "canon",
		zone: "council-ring",
		position: {
			x: 14,
			y: 0,
			z: -10
		}
	},
	{
		id: "pelan-island-Elohim",
		title: "Pelan Island and the Elohim",
		body: "East across warm waters lies Pelan, where Yakub and the sixty thousand Elohim gently tuned the folded light in the blood across generations, birthing new peoples.",
		canonStatus: "canon",
		zone: "pelan-island",
		position: {
			x: 24,
			y: 0,
			z: 14
		}
	},
	{
		id: "ice-wall-vault",
		title: "The Ice Wall and the Sealed Vault",
		body: "Beyond the southern sea rises the endless Ice Wall. Through its gap lies the Ancestral Republic, 178 dome-worlds under a sky membrane, and the Sealed Vault where the Architects stored seven thousand years of memory.",
		canonStatus: "canon",
		zone: "ice-wall",
		position: {
			x: 0,
			y: 0,
			z: -28
		}
	},
	{
		id: "mojako-gate-return",
		title: "The Mojako Gate and the Mercy Years",
		body: "Deep beneath the foundations lies the Mojako Gate, opening only for the forgotten. In 1914 a bell struck a hundred-year mercy period, bringing the return of the Hum through every child born.",
		canonStatus: "canon",
		zone: "mojako-gate",
		position: {
			x: 0,
			y: 0,
			z: -18
		}
	},
	{
		id: "operation-legacy-vault",
		title: "Operation Legacy & Hanslope Park",
		body: "As colonies moved toward independence, the British Colonial Office ran Operation Legacy to destroy or hide records that might embarrass the empire. 8,800 files sat hidden at Hanslope Park for fifty years until Kenyan survivors sued in 2011.",
		canonStatus: "documented_history",
		zone: "companion",
		position: {
			x: -6,
			y: 0,
			z: 10
		}
	},
	{
		id: "great-zimbabwe-mapungubwe",
		title: "Great Zimbabwe & Mapungubwe",
		body: "Great Zimbabwe's granite walls and Mapungubwe's Golden Rhino stand as monuments to precolonial African civilization, long misattributed by colonial visitors before UNESCO and modern archaeology confirmed their African origin.",
		canonStatus: "documented_history",
		zone: "companion",
		position: {
			x: 8,
			y: 0,
			z: 14
		}
	},
	{
		id: "timbuktu-manuscripts",
		title: "Timbuktu Manuscripts & Abdel Kader Haidara",
		body: "During the 2012 occupation of northern Mali, librarian Abdel Kader Haidara and local families smuggled over 4,000 ancient manuscripts south to Bamako in metal boxes hidden under fruit and vegetables along the Niger.",
		canonStatus: "documented_history",
		zone: "companion",
		position: {
			x: -12,
			y: 0,
			z: 4
		}
	},
	{
		id: "benin-bronzes",
		title: "Benin Bronzes, 1897",
		body: "Sacked during the 1897 British punitive expedition, thousands of cast brass plaques from the Royal Palace of Benin were scattered to global museums. Restitution efforts are returning ownership to the Oba of Benin.",
		canonStatus: "documented_history",
		zone: "companion",
		position: {
			x: 12,
			y: 0,
			z: 6
		}
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
var _jsxFileName$1 = "/app/applet/src/game/ui/EntryScreen.tsx";
function Settling({ overlay = false }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: `${overlay ? "absolute inset-0 z-20" : "h-dvh"} flex items-center justify-center bg-bg px-6 text-center`,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "font-display text-3xl text-fg",
			children: "The terraces are settling…"
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 23,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 20,
		columnNumber: 5
	}, this);
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		className: "relative flex min-h-dvh items-center justify-center overflow-hidden bg-bg px-5 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "terrace-silhouette",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "chimney" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 69,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "step step-a" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 70,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "step step-b" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 71,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "step step-c" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 72,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 68,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
			className: "relative z-10 flex w-full max-w-md flex-col gap-5",
			onSubmit: (event) => {
				event.preventDefault();
				begin();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs font-medium tracking-widest text-accent uppercase",
							children: "N8G presents"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 83,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "font-display text-6xl leading-none text-fg sm:text-7xl",
							children: "The Erased"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 84,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "max-w-sm text-muted",
							children: "The terraces are still here. The chimneys still carry the Hum."
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 85,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 82,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						htmlFor: "player-name",
						className: "text-sm font-medium text-fg",
						children: "Create your identity"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 91,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
						id: "player-name",
						value: nameInput,
						onChange: (event) => setNameInput(event.target.value),
						placeholder: "Character name",
						maxLength: 24,
						autoComplete: "off",
						className: "min-h-11 rounded-lg border border-border bg-surface px-4 text-fg placeholder:text-muted"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 94,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 90,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("fieldset", {
					className: "flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("legend", {
						className: "text-sm font-medium text-fg",
						children: "Skin"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 106,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex gap-3",
						role: "radiogroup",
						"aria-label": "Skin",
						children: SKIN_OPTIONS.map((option) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							role: "radio",
							"aria-checked": skin === option.id,
							"aria-label": option.label,
							onClick: () => setSkin(option.id),
							className: `size-11 rounded-full border border-border ${skin === option.id ? "ring-2 ring-accent ring-offset-2 ring-offset-bg" : ""}`,
							style: { backgroundColor: SKINS[option.id] }
						}, option.id, false, {
							fileName: _jsxFileName$1,
							lineNumber: 109,
							columnNumber: 15
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 107,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 105,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("fieldset", {
					className: "flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("legend", {
						className: "text-sm font-medium text-fg",
						children: "Cloth"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 126,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex gap-3",
						role: "radiogroup",
						"aria-label": "Cloth",
						children: CLOTH_OPTIONS.map((option) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							role: "radio",
							"aria-checked": cloth === option.id,
							"aria-label": option.label,
							onClick: () => setCloth(option.id),
							className: `size-11 rounded-full border border-border ${cloth === option.id ? "ring-2 ring-accent ring-offset-2 ring-offset-bg" : ""}`,
							style: { backgroundColor: CLOTHS[option.id] }
						}, option.id, false, {
							fileName: _jsxFileName$1,
							lineNumber: 129,
							columnNumber: 15
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 127,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 125,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "submit",
					className: "ui-fade min-h-12 rounded-lg bg-accent px-5 text-base font-medium text-bg transition-opacity duration-150 disabled:opacity-40",
					disabled: !hydrated || !nameInput.trim(),
					children: savedName ? "Start again in the terrace" : "Start in the terrace"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 145,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col gap-2 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Walk, run and jump. Switch the camera. Record what the city still remembers." }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 154,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Progress stays on this device." }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 155,
							columnNumber: 11
						}, this),
						recorded ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "You have already recorded “The chimney that sings”." }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 156,
							columnNumber: 23
						}, this) : null,
						hasSave ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							className: "self-start text-sm text-fg underline decoration-border underline-offset-4",
							onClick: () => {
								resetSave();
								setNameInput("");
								setSkin("sand");
								setCloth("indigo");
							},
							children: "Forget this identity"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 158,
							columnNumber: 13
						}, this) : null
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 153,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 75,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 67,
		columnNumber: 5
	}, this);
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
var _jsxFileName = "/app/applet/src/routes/index.tsx?tsr-split=component";
var Play = (0, import_react.lazy)(() => import("./Play-QtIQwa1p.mjs"));
function Home() {
	const [live, setLive] = (0, import_react.useState)(false);
	if (!live) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EntryScreen, { onStart: () => setLive(true) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 6,
		columnNumber: 21
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Settling, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 7,
			columnNumber: 30
		}, this),
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Play, { onLeave: () => setLive(false) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 8,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 7,
		columnNumber: 10
	}, this);
}
export { WORLD as a, MEMORY_ID as c, ZONE_NAME as d, recordById as f, setHumLevel as h, SKINS as i, PLACE_NOTES as l, chime as m, Settling as n, CANON_LABEL as o, useGameStore as p, CLOTHS as r, COMPANION_SHELF as s, routes_exports as t, RECORDS as u };
