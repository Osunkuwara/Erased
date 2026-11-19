import { chime } from "@/game/audio";
import { useGameStore } from "@/game/store";

export function tryRecord(id: string) {
  const fresh = useGameStore.getState().recordMemory(id);
  if (fresh && !useGameStore.getState().muted) chime();
  return fresh;
}
