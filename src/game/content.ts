export type CanonStatus = "canon" | "interpretation" | "expansion" | "documented_history";

export type ContentRecord = {
  id: string;
  title: string;
  body: string;
  canonStatus: CanonStatus;
  zone: string;
};

export const MEMORY_ID = "terrace-hum-fragment-01";

export const MEMORY_ANCHOR = { x: 1.7, y: 0, z: 4.2 };

export const ZONE_NAME = "Terraced City";

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
    body: "The chimneys of the Terraced City are functional, not ornamental. They are bound to the Hum, and that sound is part of how the city knows itself.",
    canonStatus: "canon",
    zone: "terraced-city",
  },
  {
    id: "terrace-greybox-layout",
    title: "Courtyard reading",
    body: "The walkable courtyard, ramp and block masses are a gameplay picture of the terraces. They are not a measured plan from the novels.",
    canonStatus: "interpretation",
    zone: "terraced-city",
  },
  {
    id: "memory-record-act",
    title: "Recording a fragment",
    body: "Keeping a fragment on your person is a game action. The novels do not describe this archive.",
    canonStatus: "expansion",
    zone: "terraced-city",
  },
  {
    id: "operation-legacy",
    title: "Operation Legacy",
    body: "As empires withdrew, colonial administrations destroyed and concealed official records. This note belongs to the nonfiction companion. It is not part of the city's cosmology.",
    canonStatus: "documented_history",
    zone: "companion",
  },
];

export function recordById(id: string) {
  return RECORDS.find((record) => record.id === id);
}

export const PLACE_NOTES = RECORDS.filter(
  (record) => record.canonStatus === "interpretation" || record.canonStatus === "expansion",
);

export const COMPANION_SHELF = RECORDS.filter((record) => record.canonStatus === "documented_history");
