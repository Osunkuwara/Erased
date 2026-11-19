import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import type { Mesh } from "three";
import * as THREE from "three";
import { tryRecord } from "@/game/actions";
import { RECORDS } from "@/game/content";
import { BOXES, CHIMNEYS, PALMS, type BoxSpec } from "@/game/layout";
import { WORLD } from "@/game/palette";
import { useGameStore } from "@/game/store";

const BOX_COLOR: Record<BoxSpec["color"], string> = {
  sand: WORLD.sand,
  stone: WORLD.stone,
  clay: WORLD.clay,
  dark: WORLD.dark,
};

function Stone({ position, size, color, rotation }: BoxSpec) {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={BOX_COLOR[color]} roughness={0.92} metalness={0.02} />
      </mesh>
    </RigidBody>
  );
}

function Chimney({ position, height }: { position: [number, number, number]; height: number }) {
  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      <CuboidCollider args={[0.42, height / 2, 0.42]} position={[0, height / 2, 0]} />
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.42, height, 10]} />
        <meshStandardMaterial color={WORLD.copper} metalness={0.62} roughness={0.38} />
      </mesh>
      <mesh position={[0, height + 0.08, 0]}>
        <cylinderGeometry args={[0.36, 0.3, 0.22, 10]} />
        <meshStandardMaterial
          color={WORLD.copperDark}
          metalness={0.5}
          roughness={0.42}
          emissive={WORLD.gemEmissive}
          emissiveIntensity={0.4}
        />
      </mesh>
      <pointLight
        position={[0, height + 0.2, 0]}
        color={WORLD.gem}
        intensity={1.6}
        distance={7}
        decay={2}
      />
    </RigidBody>
  );
}

function Palm({ position }: { position: [number, number, number] }) {
  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      <CuboidCollider args={[0.18, 1.05, 0.18]} position={[0, 1.05, 0]} />
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.16, 2.1, 6]} />
        <meshStandardMaterial color={WORLD.trunk} roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.25, 0]} castShadow>
        <sphereGeometry args={[0.48, 8, 6]} />
        <meshStandardMaterial color={WORLD.leaf} roughness={0.82} />
      </mesh>
      <mesh position={[0.42, 2.05, 0]} rotation={[0.3, 0, 0.8]} castShadow>
        <coneGeometry args={[0.16, 0.85, 5]} />
        <meshStandardMaterial color={WORLD.leaf} roughness={0.8} />
      </mesh>
      <mesh position={[-0.38, 2.02, 0.12]} rotation={[0.2, 0.4, -0.9]} castShadow>
        <coneGeometry args={[0.15, 0.8, 5]} />
        <meshStandardMaterial color={WORLD.leaf} roughness={0.8} />
      </mesh>
    </RigidBody>
  );
}

function MemoryGem({ id, position }: { id: string; position: { x: number; y: number; z: number } }) {
  const ref = useRef<Mesh>(null);
  const recorded = useGameStore((s) => s.memories.includes(id));

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.rotation.y = clock.elapsedTime * 0.55;
    mesh.position.y = (position.y || 0) + 1.42 + Math.sin(clock.elapsedTime * 1.6 + position.x) * 0.06;
  });

  return (
    <mesh
      ref={ref}
      position={[position.x, (position.y || 0) + 1.42, position.z]}
      castShadow
      onClick={(event) => {
        event.stopPropagation();
        tryRecord(id);
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      <icosahedronGeometry args={[0.36, 1]} />
      <meshStandardMaterial
        color={recorded ? "#8d7350" : WORLD.gem}
        emissive={recorded ? "#3a2a16" : WORLD.gemEmissive}
        emissiveIntensity={recorded ? 0.25 : 1.15}
        roughness={0.35}
        metalness={0.2}
      />
    </mesh>
  );
}

function WorldRegions() {
  return (
    <>
      {/* The Quarry (North-West) */}
      <RigidBody type="fixed" colliders="cuboid" position={[-14, 1.2, -10]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[8, 2.4, 8]} />
          <meshStandardMaterial color={WORLD.stone} roughness={0.9} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid" position={[-14, 2.8, -10]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[5, 1.2, 5]} />
          <meshStandardMaterial color={WORLD.clay} roughness={0.88} />
        </mesh>
      </RigidBody>

      {/* House of Remembering & Council Ring (South-East) */}
      <RigidBody type="fixed" colliders="cuboid" position={[14, 1.5, -10]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[4.5, 4.8, 3, 16]} />
          <meshStandardMaterial color={WORLD.dark} roughness={0.85} />
        </mesh>
      </RigidBody>

      {/* Pelan Island & Second Dome (East) */}
      <RigidBody type="fixed" colliders="cuboid" position={[24, 0.8, 14]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[12, 1.6, 12]} />
          <meshStandardMaterial color={WORLD.sand} roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* The Ice Wall & Sealed Vault (Far South) */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, 6, -28]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[36, 12, 4]} />
          <meshStandardMaterial color="#c2e3ed" roughness={0.3} metalness={0.2} emissive="#48829c" emissiveIntensity={0.2} />
        </mesh>
      </RigidBody>
      {/* Vault Door */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, 2.5, -26]}>
        <mesh castShadow>
          <cylinderGeometry args={[2.5, 2.5, 0.6, 24]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#222c33" metalness={0.8} roughness={0.2} />
        </mesh>
      </RigidBody>
    </>
  );
}

function Ground() {
  const texture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const image = ctx.createImageData(size, size);
    for (let i = 0; i < image.data.length; i += 4) {
      const n = 150 + Math.random() * 90;
      image.data[i] = n;
      image.data[i + 1] = n;
      image.data[i + 2] = n;
      image.data[i + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(16, 16);
    return tex;
  }, []);

  return (
    <>
      <RigidBody type="fixed" colliders={false} position={[0, -0.5, 0]}>
        <CuboidCollider args={[60, 0.5, 60]} />
      </RigidBody>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color={WORLD.ground} roughness={1} roughnessMap={texture ?? undefined} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 5]} receiveShadow>
        <planeGeometry args={[3.2, 12]} />
        <meshStandardMaterial color={WORLD.groundAlt} roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4.8, 0.025, 3]}>
        <planeGeometry args={[1.15, 20]} />
        <meshStandardMaterial color={WORLD.water} roughness={0.22} metalness={0.18} />
      </mesh>
      <mesh position={[4.7, 0.08, 7.4]} receiveShadow>
        <cylinderGeometry args={[0.9, 0.95, 0.16, 16]} />
        <meshStandardMaterial color={WORLD.dark} roughness={0.88} />
      </mesh>
      <mesh position={[4.7, 0.15, 7.4]}>
        <cylinderGeometry args={[0.62, 0.62, 0.06, 16]} />
        <meshStandardMaterial color={WORLD.water} roughness={0.2} metalness={0.2} />
      </mesh>
    </>
  );
}

function Bounds() {
  const walls: [number, number, number, number, number, number][] = [
    [0, 3, -42, 50, 3, 0.5],
    [0, 3, 34, 50, 3, 0.5],
    [-40, 3, 0, 0.5, 3, 40],
    [40, 3, 0, 0.5, 3, 40],
  ];
  return (
    <>
      {walls.map((wall) => (
        <RigidBody key={wall.join(",")} type="fixed" position={[wall[0], wall[1], wall[2]]}>
          <CuboidCollider args={[wall[3], wall[4], wall[5]]} />
        </RigidBody>
      ))}
    </>
  );
}

export function World() {
  const memoryRecords = useMemo(() => RECORDS.filter((r) => r.position), []);

  return (
    <>
      <Ground />
      <Bounds />
      <WorldRegions />
      {BOXES.map((box) => (
        <Stone key={box.position.join(":") + box.size.join("x")} {...box} />
      ))}
      {CHIMNEYS.map((chimney) => (
        <Chimney key={chimney.position.join(":")} {...chimney} />
      ))}
      {PALMS.map((position) => (
        <Palm key={position.join(":")} position={position} />
      ))}
      {memoryRecords.map((record) => (
        <MemoryGem key={record.id} id={record.id} position={record.position!} />
      ))}
    </>
  );
}
