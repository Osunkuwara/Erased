import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ClothId, SkinId } from "@/game/palette";

export type CameraMode = "third" | "first";

export type Avatar = {
  skin: SkinId;
  cloth: ClothId;
};

type Saved = {
  playerName: string;
  cameraMode: CameraMode;
  memories: string[];
  avatar: Avatar;
  muted: boolean;
};

type GameState = Saved & {
  nearMemory: boolean;
  archiveOpen: boolean;
  worldMapOpen: boolean;
  currentRegion: string;
  justRecordedId: string | null;
  setPlayerName: (name: string) => void;
  setCameraMode: (mode: CameraMode) => void;
  toggleCamera: () => void;
  setAvatar: (avatar: Avatar) => void;
  setNearMemory: (near: boolean) => void;
  setArchiveOpen: (open: boolean) => void;
  setWorldMapOpen: (open: boolean) => void;
  setCurrentRegion: (region: string) => void;
  setMuted: (muted: boolean) => void;
  recordMemory: (id: string) => boolean;
  clearNotice: () => void;
  resetSave: () => void;
};

const initial: Saved = {
  playerName: "",
  cameraMode: "third",
  memories: [],
  avatar: { skin: "sand", cloth: "indigo" },
  muted: false,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initial,
      nearMemory: false,
      archiveOpen: false,
      worldMapOpen: false,
      currentRegion: "terraced-city",
      justRecordedId: null,
      setPlayerName: (playerName) => set({ playerName }),
      setCameraMode: (cameraMode) => set({ cameraMode }),
      toggleCamera: () =>
        set({ cameraMode: get().cameraMode === "third" ? "first" : "third" }),
      setAvatar: (avatar) => set({ avatar }),
      setNearMemory: (nearMemory) => set({ nearMemory }),
      setArchiveOpen: (archiveOpen) => set({ archiveOpen }),
      setWorldMapOpen: (worldMapOpen) => set({ worldMapOpen }),
      setCurrentRegion: (currentRegion) => set({ currentRegion }),
      setMuted: (muted) => set({ muted }),
      recordMemory: (id) => {
        const { memories } = get();
        if (memories.includes(id)) return false;
        set({ memories: [...memories, id], justRecordedId: id });
        return true;
      },
      clearNotice: () => set({ justRecordedId: null }),
      resetSave: () => {
        set({ ...initial, nearMemory: false, archiveOpen: false, worldMapOpen: false, currentRegion: "terraced-city", justRecordedId: null });
        void useGameStore.persist.clearStorage();
      },
    }),
    {
      name: "n8g-erased-player-save",
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        playerName: state.playerName,
        cameraMode: state.cameraMode,
        memories: state.memories,
        avatar: state.avatar,
        muted: state.muted,
      }),
    },
  ),
);
