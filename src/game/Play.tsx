import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { setHumLevel } from "@/game/audio";
import { bindInput, resetInput, setInputBlocked } from "@/game/input";
import { Scene } from "@/game/Scene";
import { useGameStore } from "@/game/store";
import { Hud } from "@/game/ui/Hud";
import { Settling } from "@/game/ui/EntryScreen";

type PlayProps = {
  onLeave: () => void;
};

export default function Play({ onLeave }: PlayProps) {
  const [ready, setReady] = useState(false);
  const archiveOpen = useGameStore((s) => s.archiveOpen);

  useEffect(() => {
    const unbind = bindInput(window);
    return () => {
      unbind();
      setHumLevel(0, true);
      document.body.style.cursor = "";
    };
  }, []);

  useEffect(() => {
    setInputBlocked(archiveOpen);
    if (archiveOpen) {
      resetInput();
    }
  }, [archiveOpen]);

  function leave() {
    resetInput();
    useGameStore.getState().setArchiveOpen(false);
    useGameStore.getState().setNearMemory(false);
    onLeave();
  }

  return (
    <main
      className="relative h-dvh w-full overflow-hidden bg-bg touch-none"
      onContextMenu={(event) => event.preventDefault()}
    >
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        dpr={[1, 1.5]}
        camera={{ fov: 62, near: 0.08, far: 120, position: [0, 4, 15] }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Scene onReady={() => setReady(true)} />
      </Canvas>
      <Hud onLeave={leave} />
      {ready ? null : <Settling overlay />}
    </main>
  );
}
