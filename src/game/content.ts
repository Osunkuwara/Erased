export type CanonStatus = "canon" | "interpretation" | "expansion" | "documented_history";

export type ContentRecord = {
  id: string;
  title: string;
  body: string;
  canonStatus: CanonStatus;
  zone: string;
  position?: { x: number; y: number; z: number };
};

export const MEMORY_ID = "terrace-hum-fragment-01";

export const MEMORY_ANCHOR = { x: 1.7, y: 0, z: 4.2 };

export const ZONE_NAME = "Terraced City & World Regions";

export const CANON_LABEL: Record<CanonStatus, string> = {
  canon: "Canon",
  interpretation: "Interpretation",
  expansion: "Expansion",
  documented_history: "Documented history",
};

export const RECORDS: ContentRecord[] = [
  {
    id: MEMORY_ID,
    title: "The chimney that sings",
    body: "The chimneys of the Terraced City do not vent smoke; they draw aether, breathe air, warm houses, sing in harmony, and remember the names of the dead sung into them by grieving families.",
    canonStatus: "canon",
    zone: "terraced-city",
    position: { x: 1.7, y: 0, z: 4.2 },
  },
  {
    id: "quarry-basalt-seam",
    title: "The Great Quarry and Stone",
    body: "At the great quarry above the city, master mason Kesi taught Asha that every stone carries the shape of the block it is willing to become. You do not cut it; you ask.",
    canonStatus: "canon",
    zone: "the-quarry",
    position: { x: -14, y: 0, z: -10 },
  },
  {
    id: "council-ring-totems",
    title: "The Council Ring and Totems",
    body: "Carved from a single outcrop of sandstone and black basalt, the Council Ring holds twenty-four Custodians and Queen Nefret, keeping the seven ancient totems and the seed of light.",
    canonStatus: "canon",
    zone: "council-ring",
    position: { x: 14, y: 0, z: -10 },
  },
  {
    id: "pelan-island-Elohim",
    title: "Pelan Island and the Elohim",
    body: "East across warm waters lies Pelan, where Yakub and the sixty thousand Elohim gently tuned the folded light in the blood across generations, birthing new peoples.",
    canonStatus: "canon",
    zone: "pelan-island",
    position: { x: 24, y: 0, z: 14 },
  },
  {
    id: "ice-wall-vault",
    title: "The Ice Wall and the Sealed Vault",
    body: "Beyond the southern sea rises the endless Ice Wall. Through its gap lies the Ancestral Republic, 178 dome-worlds under a sky membrane, and the Sealed Vault where the Architects stored seven thousand years of memory.",
    canonStatus: "canon",
    zone: "ice-wall",
    position: { x: 0, y: 0, z: -28 },
  },
  {
    id: "mojako-gate-return",
    title: "The Mojako Gate and the Mercy Years",
    body: "Deep beneath the foundations lies the Mojako Gate, opening only for the forgotten. In 1914 a bell struck a hundred-year mercy period, bringing the return of the Hum through every child born.",
    canonStatus: "canon",
    zone: "mojako-gate",
    position: { x: 0, y: 0, z: -18 },
  },
  {
    id: "operation-legacy-vault",
    title: "Operation Legacy & Hanslope Park",
    body: "As colonies moved toward independence, the British Colonial Office ran Operation Legacy to destroy or hide records that might embarrass the empire. 8,800 files sat hidden at Hanslope Park for fifty years until Kenyan survivors sued in 2011.",
    canonStatus: "documented_history",
    zone: "companion",
    position: { x: -6, y: 0, z: 10 },
  },
  {
    id: "great-zimbabwe-mapungubwe",
    title: "Great Zimbabwe & Mapungubwe",
    body: "Great Zimbabwe's granite walls and Mapungubwe's Golden Rhino stand as monuments to precolonial African civilization, long misattributed by colonial visitors before UNESCO and modern archaeology confirmed their African origin.",
    canonStatus: "documented_history",
    zone: "companion",
    position: { x: 8, y: 0, z: 14 },
  },
  {
    id: "timbuktu-manuscripts",
    title: "Timbuktu Manuscripts & Abdel Kader Haidara",
    body: "During the 2012 occupation of northern Mali, librarian Abdel Kader Haidara and local families smuggled over 4,000 ancient manuscripts south to Bamako in metal boxes hidden under fruit and vegetables along the Niger.",
    canonStatus: "documented_history",
    zone: "companion",
    position: { x: -12, y: 0, z: 4 },
  },
  {
    id: "benin-bronzes",
    title: "Benin Bronzes, 1897",
    body: "Sacked during the 1897 British punitive expedition, thousands of cast brass plaques from the Royal Palace of Benin were scattered to global museums. Restitution efforts are returning ownership to the Oba of Benin.",
    canonStatus: "documented_history",
    zone: "companion",
    position: { x: 12, y: 0, z: 6 },
  },
];

export function recordById(id: string) {
  return RECORDS.find((record) => record.id === id);
}

export const PLACE_NOTES = RECORDS.filter(
  (record) => record.canonStatus === "interpretation" || record.canonStatus === "expansion",
);

export const COMPANION_SHELF = RECORDS.filter((record) => record.canonStatus === "documented_history");
