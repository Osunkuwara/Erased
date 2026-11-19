import { Suspense } from "react";
import { Physics } from "@react-three/rapier";
import { Player } from "@/game/Player";
import { WORLD } from "@/game/palette";
import { World } from "@/game/World";

type SceneProps = {
  onReady: () => void;
};

export function Scene({ onReady }: SceneProps) {
  return (
    <>
      <color attach="background" args={[WORLD.sky]} />
      <fog attach="fog" args={[WORLD.fog, 16, 52]} />
      <hemisphereLight args={["#ffe0b8", "#6b4a32", 0.55]} />
      <ambientLight intensity={0.28} />
      <directionalLight
        position={[16, 24, 10]}
        intensity={1.45}
        color="#ffd7a8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={48}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-bias={-0.0006}
      />
      <Suspense fallback={null}>
        <Physics gravity={[0, -22, 0]}>
          <World />
          <Player onReady={onReady} />
        </Physics>
      </Suspense>
    </>
  );
}
