export type BoxSpec = {
  position: [number, number, number];
  size: [number, number, number];
  color: "sand" | "stone" | "clay" | "dark";
  rotation?: [number, number, number];
};

export const BOXES: BoxSpec[] = [
  { position: [0, 0.47, -2.5], size: [4.2, 0.3, 5.2], color: "sand", rotation: [0.22, 0, 0] },
  { position: [0, 0.55, -8.2], size: [16, 1.1, 6.2], color: "stone" },
  { position: [0, 1.15, -13.1], size: [18, 2.3, 4.4], color: "clay" },
  { position: [-10.2, 0.9, -9.2], size: [5.2, 1.8, 5], color: "sand" },
  { position: [9.2, 1.15, -10.2], size: [5, 2.3, 5.4], color: "stone" },
  { position: [-8, 1.5, 3.4], size: [4.2, 3, 4.2], color: "clay" },
  { position: [-8, 3.15, 3.4], size: [4.6, 0.38, 4.6], color: "dark" },
  { position: [7.6, 1.35, 1.2], size: [3.6, 2.7, 4.8], color: "sand" },
  { position: [7.6, 2.85, 1.2], size: [4, 0.34, 5.2], color: "dark" },
  { position: [-6.4, 1.1, -1.6], size: [3.2, 2.2, 3], color: "stone" },
  { position: [-2.3, 1.55, 6.3], size: [0.7, 3.1, 0.75], color: "dark" },
  { position: [2.3, 1.55, 6.3], size: [0.7, 3.1, 0.75], color: "dark" },
  { position: [0, 3.2, 6.3], size: [5.4, 0.5, 0.85], color: "clay" },
  { position: [1.7, 0.45, 4.2], size: [1.15, 0.9, 1.15], color: "dark" },
  { position: [-12, 2.4, -18.5], size: [3.2, 4.8, 3.2], color: "stone" },
  { position: [-6, 3.1, -19], size: [3.4, 6.2, 3.2], color: "clay" },
  { position: [0.5, 2.2, -18.2], size: [4, 4.4, 3], color: "sand" },
  { position: [6.5, 3.4, -19.2], size: [3, 6.8, 3.2], color: "dark" },
  { position: [12, 2.6, -18], size: [3.6, 5.2, 3.4], color: "stone" },
];

export const CHIMNEYS: { position: [number, number, number]; height: number }[] = [
  { position: [-3.5, 0, 5.5], height: 3.5 },
  { position: [0.6, 1.1, -8.2], height: 3.3 },
  { position: [-10.2, 1.8, -9.2], height: 2.6 },
  { position: [9.2, 2.3, -10.2], height: 3.1 },
];

export const HUM_SOURCES = CHIMNEYS.map((chimney) => ({
  x: chimney.position[0],
  z: chimney.position[2],
}));

export const PALMS: [number, number, number][] = [
  [-5.2, 0, 8.2],
  [5.4, 0, 8.6],
  [4.6, 0, -0.4],
];
