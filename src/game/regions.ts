export type WorldRegion = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  atmosphere: string;
  canonStatus: "canon" | "interpretation" | "expansion";
  coordinates: { x: number; y: number; z: number };
  unlockedByDefault: boolean;
};

export const WORLD_REGIONS: WorldRegion[] = [
  {
    id: "terraced-city",
    name: "The Terraced City",
    subtitle: "Region 1 — The Starting Settlement",
    description: "Layered pale stone terraces, sandstone residences, ancient water channels, and copper-capped chimneys that sing in harmony with the Hum.",
    atmosphere: "Red savanna warmth, drifting sandstone dust, resonant aether hum.",
    canonStatus: "canon",
    coordinates: { x: 0, y: 1.35, z: 9 },
    unlockedByDefault: true,
  },
  {
    id: "the-quarry",
    name: "The Quarry",
    subtitle: "Region 2 — The Stone Seams",
    description: "Where master masons learned that every stone carries the shape of the block it is willing to become.",
    atmosphere: "Massive granite outcrops, echoes of chisel and song.",
    canonStatus: "canon",
    coordinates: { x: -14, y: 0.5, z: -10 },
    unlockedByDefault: true,
  },
  {
    id: "council-ring",
    name: "Council Ring & House of Remembering",
    subtitle: "Region 3 — The Custodians",
    description: "Carved from a single outcrop of sandstone and black basalt, holding twenty-four Custodians and Queen Nefret.",
    atmosphere: "Solemn quiet, torch-lit monoliths, ancient totems.",
    canonStatus: "canon",
    coordinates: { x: 14, y: 0.5, z: -10 },
    unlockedByDefault: true,
  },
  {
    id: "pelan-island",
    name: "Pelan Island",
    subtitle: "Region 4 — The Cradle of Light",
    description: "Warm coastal waters where Yakub and the sixty thousand Elohim gently tuned the folded light in the blood.",
    atmosphere: "Ocean breeze, white sand beaches, volcanic stone springs.",
    canonStatus: "canon",
    coordinates: { x: 24, y: 0.5, z: 14 },
    unlockedByDefault: true,
  },
  {
    id: "ice-wall",
    name: "The Ice Wall & Rim",
    subtitle: "Region 5 — The Great Boundary",
    description: "A monumental wall of glacial blue ice guarding the outer rim and the threshold to the dome-worlds.",
    atmosphere: "Howling polar winds, crystalline blue fractures, monumental scale.",
    canonStatus: "canon",
    coordinates: { x: 0, y: 0.5, z: -28 },
    unlockedByDefault: true,
  },
  {
    id: "ancestral-republic",
    name: "The Ancestral Republic",
    subtitle: "Region 6 — The Dome Worlds",
    description: "One hundred and seventy-eight enclosed dome-worlds under a shimmering sky membrane, preserving ancient civilisation.",
    atmosphere: "Polished black basalt, silver domes, silent technological majesty.",
    canonStatus: "canon",
    coordinates: { x: -22, y: 0.5, z: -22 },
    unlockedByDefault: false,
  },
  {
    id: "sealed-vault",
    name: "The Sealed Vault",
    subtitle: "Region 7 — Seven Thousand Years",
    description: "Monumental subterranean chamber containing seven millennia of uncorrupted historical records and artifact caches.",
    atmosphere: "Echoing metallic seals, amber illumination, absolute stillness.",
    canonStatus: "canon",
    coordinates: { x: 22, y: 0.5, z: -22 },
    unlockedByDefault: false,
  },
  {
    id: "great-tree",
    name: "The Great Tree & Lemuria",
    subtitle: "Region 8 — The World Roots",
    description: "Colossal ebony root networks connecting ancient worlds, associated with Asgard and the earliest botanical archives.",
    atmosphere: "Deep forest shadow, glowing fungal phosphorescence, towering canopy.",
    canonStatus: "canon",
    coordinates: { x: -26, y: 0.5, z: 18 },
    unlockedByDefault: false,
  },
  {
    id: "mojako-gate",
    name: "The Mojako Gate & The Ditoro",
    subtitle: "Region 9 — The River of Time",
    description: "Engraved black-stone gate opening only for the forgotten into the dreamtime and the flowing river of time.",
    atmosphere: "Temporal stillness, resonant bronze bells, starlit void.",
    canonStatus: "canon",
    coordinates: { x: 0, y: 0.5, z: -18 },
    unlockedByDefault: true,
  },
];
