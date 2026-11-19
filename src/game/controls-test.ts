import { setKeyOverride } from "@/game/input";

export type ControlsProbe = {
  getYaw: () => number;
  getSpeed: () => number;
  setKeys: (codes: string[]) => void;
  getPos?: () => { x: number; y: number; z: number; near: boolean };
};

declare global {
  interface Window {
    __controlsTest?: ControlsProbe;
  }
}

const probe = { yaw: 0, speed: 0, x: 0, y: 0, z: 0, near: false };

export function publishProbe() {
  window.__controlsTest = {
    getYaw: () => probe.yaw,
    getSpeed: () => probe.speed,
    setKeys: (codes) => setKeyOverride(codes.length ? codes : null),
    getPos: () => ({ x: probe.x, y: probe.y, z: probe.z, near: probe.near }),
  };
}

export function writeProbe(yaw: number, speed: number, x = 0, y = 0, z = 0, near = false) {
  probe.yaw = yaw;
  probe.speed = speed;
  probe.x = x;
  probe.y = y;
  probe.z = z;
  probe.near = near;
}

export function clearProbe() {
  delete window.__controlsTest;
}
