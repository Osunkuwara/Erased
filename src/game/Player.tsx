import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, useRapier, type RapierRigidBody } from "@react-three/rapier";
import type { KinematicCharacterController } from "@dimforge/rapier3d-compat";
import type { Group } from "three";
import * as THREE from "three";
import { tryRecord } from "@/game/actions";
import { setHumLevel } from "@/game/audio";
import { clearProbe, publishProbe, writeProbe } from "@/game/controls-test";
import { MEMORY_ANCHOR, MEMORY_ID } from "@/game/content";
import { readMove } from "@/game/input";
import { HUM_SOURCES } from "@/game/layout";
import { dampAngle } from "@/game/math";
import { CLOTHS, SKINS, WORLD } from "@/game/palette";
import { useGameStore } from "@/game/store";

const WALK = 4.6;
const RUN = 7.6;
const INTERACT_RADIUS = 3.2;

type PlayerProps = {
  onReady: () => void;
};

export function Player({ onReady }: PlayerProps) {
  const body = useRef<RapierRigidBody>(null);
  const visual = useRef<Group>(null);
  const ctrl = useRef<KinematicCharacterController | null>(null);
  const { world } = useRapier();
  const move = useMemo(() => ({ x: 0, y: 0, z: 0 }), []);
  const desired = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);

  const bodyYaw = useRef(0);
  const camYaw = useRef(0);
  const pitch = useRef(0.32);
  const dragging = useRef(false);
  const lookPointer = useRef<number | null>(null);
  const coyote = useRef(0.14);
  const jumpBuffer = useRef(0);
  const jumpPrev = useRef(false);
  const interactPrev = useRef(false);
  const vy = useRef(0);
  const booted = useRef(false);
  const published = useRef(false);
  const readySent = useRef(false);
  const nearRef = useRef(false);
  const modePrev = useRef(useGameStore.getState().cameraMode);

  useEffect(() => {
    const controller = world.createCharacterController(0.04);
    controller.enableSnapToGround(0.4);
    controller.enableAutostep(0.45, 0.2, true);
    controller.setSlideEnabled(true);
    controller.setMaxSlopeClimbAngle((48 * Math.PI) / 180);
    controller.setMinSlopeSlideAngle((36 * Math.PI) / 180);
    ctrl.current = controller;
    return () => {
      world.removeCharacterController(controller);
      ctrl.current = null;
      clearProbe();
    };
  }, [world]);

  useEffect(() => {
    const down = (event: PointerEvent) => {
      if (useGameStore.getState().archiveOpen) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-ui]")) return;
      if (event.pointerType === "mouse" && event.button !== 0 && event.button !== 2) return;
      lookPointer.current = event.pointerId;
    };
    const movePointer = (event: PointerEvent) => {
      if (lookPointer.current !== event.pointerId) return;
      if (event.movementX === 0 && event.movementY === 0) return;
      dragging.current = true;
      const mode = useGameStore.getState().cameraMode;
      const sens = mode === "first" ? 0.0026 : 0.0034;
      camYaw.current -= event.movementX * sens;
      const max = mode === "first" ? 1.15 : 0.9;
      const min = mode === "first" ? -1.05 : -0.15;
      pitch.current = Math.max(min, Math.min(max, pitch.current - event.movementY * sens));
    };
    const up = (event: PointerEvent) => {
      if (lookPointer.current !== event.pointerId) return;
      lookPointer.current = null;
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
    const dt = Math.min(delta, 0.1);
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
    const moving = wx * wx + wz * wz > 0.0001;
    if (moving) {
      const inv = 1 / Math.hypot(wx, wz);
      wx *= inv;
      wz *= inv;
    }

    const grounded = controller.computedGrounded();
    if (grounded) coyote.current = 0.14;
    else coyote.current = Math.max(0, coyote.current - dt);

    if (input.jump && !jumpPrev.current) jumpBuffer.current = 0.14;
    jumpPrev.current = input.jump;
    jumpBuffer.current = Math.max(0, jumpBuffer.current - dt);

    if (jumpBuffer.current > 0 && (grounded || coyote.current > 0) && vy.current <= 0.2) {
      vy.current = 7.4;
      jumpBuffer.current = 0;
      coyote.current = 0;
    }

    vy.current -= 22 * dt;
    if (vy.current < -18) vy.current = -18;
    if (grounded && vy.current < 0) vy.current = -2;

    if (vy.current > 0) controller.disableSnapToGround();
    else controller.enableSnapToGround(0.4);

    const air = grounded || coyote.current > 0 ? 1 : 0.7;
    move.x = wx * speed * air * dt;
    move.y = vy.current * dt;
    move.z = wz * speed * air * dt;
    controller.computeColliderMovement(collider, move);
    const deltaMove = controller.computedMovement();
    const p = rb.translation();
    const nx = p.x + deltaMove.x;
    const ny = p.y + deltaMove.y;
    const nz = p.z + deltaMove.z;
    rb.setNextKinematicTranslation({ x: nx, y: ny, z: nz });

    if (store.cameraMode === "first") {
      bodyYaw.current = camYaw.current;
    } else if (moving) {
      bodyYaw.current = dampAngle(bodyYaw.current, Math.atan2(-wx, -wz), 12, dt);
    }

    if (store.cameraMode === "third" && !dragging.current && !moving) {
      camYaw.current = dampAngle(camYaw.current, bodyYaw.current, 6, dt);
      pitch.current += (0.32 - pitch.current) * (1 - Math.exp(-3 * dt));
    }

    if (visual.current) {
      visual.current.rotation.y = bodyYaw.current + Math.PI;
      visual.current.visible = store.cameraMode !== "first";
      visual.current.position.y =
        0.12 + (moving ? Math.sin(state.clock.elapsedTime * (input.run ? 14 : 9)) * 0.035 : 0);
    }

    if (store.cameraMode === "first") {
      const c = Math.cos(pitch.current);
      const s = Math.sin(pitch.current);
      const eyeY = ny + 0.5;
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
      look.set(nx, ny + 0.85, nz);
    }

    const cam = state.camera;
    if (!booted.current) {
      cam.position.copy(desired);
      booted.current = true;
    } else {
      cam.position.lerp(desired, 1 - Math.exp(-8 * dt));
    }
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
    setHumLevel(Math.max(0.005, 0.048 - nearest * 0.0035), useGameStore.getState().muted);

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

  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={[0, 1.35, 9]}
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider args={[0.4, 0.28]} />
      <group ref={visual}>
        <mesh castShadow position={[0, 0, 0]}>
          <capsuleGeometry args={[0.28, 0.78, 6, 10]} />
          <meshStandardMaterial color={cloth} roughness={0.78} />
        </mesh>
        <mesh castShadow position={[0.32, 0.12, 0]} rotation={[0, 0, 0.18]}>
          <capsuleGeometry args={[0.07, 0.36, 4, 8]} />
          <meshStandardMaterial color={skin} roughness={0.7} />
        </mesh>
        <mesh castShadow position={[-0.32, 0.12, 0]} rotation={[0, 0, -0.18]}>
          <capsuleGeometry args={[0.07, 0.36, 4, 8]} />
          <meshStandardMaterial color={skin} roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, 0.62, 0]}>
          <sphereGeometry args={[0.2, 16, 14]} />
          <meshStandardMaterial color={skin} roughness={0.62} />
        </mesh>
        <mesh position={[0, 0.64, 0.16]}>
          <boxGeometry args={[0.07, 0.045, 0.06]} />
          <meshStandardMaterial color={WORLD.skinDeep} roughness={0.5} />
        </mesh>
      </group>
    </RigidBody>
  );
}
