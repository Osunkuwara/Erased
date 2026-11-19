const GAME_KEYS = new Set([
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
  "KeyE",
]);

const keys = new Set<string>();
const holds = { jump: false, run: false, interact: false };
const stick = { x: 0, y: 0, active: false };
let override: Set<string> | null = null;
let blocked = false;

export function setKeyOverride(codes: string[] | null) {
  override = codes ? new Set(codes) : null;
}

export function setInputBlocked(next: boolean) {
  blocked = next;
}

export function setHold(name: keyof typeof holds, active: boolean) {
  holds[name] = active;
}

export function setStick(x: number, y: number, active: boolean) {
  stick.x = x;
  stick.y = y;
  stick.active = active;
}

export function resetInput() {
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

export function readMove() {
  if (blocked) {
    return { x: 0, z: 0, run: false, jump: false, interact: false };
  }

  let x = 0;
  let z = 0;
  const down = (code: string) => (override ? override.has(code) : keys.has(code));

  if (down("KeyD") || down("ArrowRight")) x += 1;
  if (down("KeyA") || down("ArrowLeft")) x -= 1;
  if (down("KeyW") || down("ArrowUp")) z += 1;
  if (down("KeyS") || down("ArrowDown")) z -= 1;

  if (!override && stick.active) {
    x += stick.x;
    z += -stick.y;
  }

  let jump = down("Space") || (!override && holds.jump);
  let run = down("ShiftLeft") || down("ShiftRight") || (!override && holds.run);
  let interact = down("KeyE") || (!override && holds.interact);

  if (!override && typeof navigator !== "undefined" && navigator.getGamepads) {
    const pads = navigator.getGamepads();
    for (const pad of pads) {
      if (!pad) continue;
      let gx = pad.axes[0] ?? 0;
      let gy = pad.axes[1] ?? 0;
      const mag = Math.hypot(gx, gy);
      if (mag < 0.18) {
        gx = 0;
        gy = 0;
      } else {
        const scale = (mag - 0.18) / (0.82 * mag);
        gx *= scale;
        gy *= scale;
      }
      x += gx;
      z += -gy;
      if (pad.buttons[0]?.pressed) jump = true;
      if (pad.buttons[1]?.pressed) interact = true;
      if ((pad.buttons[7]?.value ?? 0) > 0.45) run = true;
    }
  }

  const len = Math.hypot(x, z);
  if (len > 1) {
    x /= len;
    z /= len;
  }

  return { x, z, run, jump, interact };
}

export function bindInput(target: Window) {
  const down = (event: KeyboardEvent) => {
    if (!GAME_KEYS.has(event.code)) return;
    event.preventDefault();
    if (override) return;
    keys.add(event.code);
  };
  const up = (event: KeyboardEvent) => {
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
