export const WORLD = {
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
  skinDeep: "#2a211b",
} as const;

export type SkinId = "sand" | "deep" | "olive";
export type ClothId = "indigo" | "copper" | "cream";

export const SKINS: Record<SkinId, string> = {
  sand: "#c48a62",
  deep: "#6b3a2a",
  olive: "#8d6a45",
};

export const CLOTHS: Record<ClothId, string> = {
  indigo: "#3e4d68",
  copper: "#a8643c",
  cream: "#efe2cf",
};

export const SKIN_OPTIONS: { id: SkinId; label: string }[] = [
  { id: "sand", label: "Sand" },
  { id: "deep", label: "Deep" },
  { id: "olive", label: "Olive" },
];

export const CLOTH_OPTIONS: { id: ClothId; label: string }[] = [
  { id: "indigo", label: "Indigo" },
  { id: "copper", label: "Copper" },
  { id: "cream", label: "Cream" },
];
