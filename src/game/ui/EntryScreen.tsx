import { useEffect, useState } from "react";
import { unlockAudio } from "@/game/audio";
import { MEMORY_ID } from "@/game/content";
import {
  CLOTHS,
  CLOTH_OPTIONS,
  SKINS,
  SKIN_OPTIONS,
  type ClothId,
  type SkinId,
} from "@/game/palette";
import { useGameStore } from "@/game/store";

type EntryProps = {
  onStart: () => void;
};

export function Settling({ overlay = false }: { overlay?: boolean }) {
  return (
    <div
      className={`${overlay ? "absolute inset-0 z-20" : "h-dvh"} flex items-center justify-center bg-bg px-6 text-center`}
    >
      <p className="font-display text-3xl text-fg">The terraces are settling…</p>
    </div>
  );
}

export function EntryScreen({ onStart }: EntryProps) {
  const savedName = useGameStore((s) => s.playerName);
  const memories = useGameStore((s) => s.memories);
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const setAvatar = useGameStore((s) => s.setAvatar);
  const resetSave = useGameStore((s) => s.resetSave);

  const [nameInput, setNameInput] = useState("");
  const [skin, setSkin] = useState<SkinId>("sand");
  const [cloth, setCloth] = useState<ClothId>("indigo");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const apply = () => {
      const state = useGameStore.getState();
      setNameInput(state.playerName);
      setSkin(state.avatar.skin);
      setCloth(state.avatar.cloth);
      setHydrated(true);
    };
    if (useGameStore.persist.hasHydrated()) apply();
    const unsub = useGameStore.persist.onFinishHydration(apply);
    void useGameStore.persist.rehydrate();
    return unsub;
  }, []);

  const recorded = memories.includes(MEMORY_ID);
  const hasSave = Boolean(savedName) || memories.length > 0;

  function begin() {
    const name = nameInput.trim();
    if (!name) return;
    setPlayerName(name);
    setAvatar({ skin, cloth });
    unlockAudio();
    onStart();
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-bg px-5 py-10">
      <div className="terrace-silhouette" aria-hidden="true">
        <span className="chimney" />
        <span className="step step-a" />
        <span className="step step-b" />
        <span className="step step-c" />
      </div>

      <form
        className="relative z-10 flex w-full max-w-md flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          begin();
        }}
      >
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium tracking-widest text-accent uppercase">N8G presents</p>
          <h1 className="font-display text-6xl leading-none text-fg sm:text-7xl">The Erased</h1>
          <p className="max-w-sm text-muted">
            The terraces are still here. The chimneys still carry the Hum.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="player-name" className="text-sm font-medium text-fg">
            Create your identity
          </label>
          <input
            id="player-name"
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            placeholder="Character name"
            maxLength={24}
            autoComplete="off"
            className="min-h-11 rounded-lg border border-border bg-surface px-4 text-fg placeholder:text-muted"
          />
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-medium text-fg">Skin</legend>
          <div className="flex gap-3" role="radiogroup" aria-label="Skin">
            {SKIN_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={skin === option.id}
                aria-label={option.label}
                onClick={() => setSkin(option.id)}
                className={`size-11 rounded-full border border-border ${
                  skin === option.id ? "ring-2 ring-accent ring-offset-2 ring-offset-bg" : ""
                }`}
                style={{ backgroundColor: SKINS[option.id] }}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-medium text-fg">Cloth</legend>
          <div className="flex gap-3" role="radiogroup" aria-label="Cloth">
            {CLOTH_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={cloth === option.id}
                aria-label={option.label}
                onClick={() => setCloth(option.id)}
                className={`size-11 rounded-full border border-border ${
                  cloth === option.id ? "ring-2 ring-accent ring-offset-2 ring-offset-bg" : ""
                }`}
                style={{ backgroundColor: CLOTHS[option.id] }}
              />
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          className="ui-fade min-h-12 rounded-lg bg-accent px-5 text-base font-medium text-bg transition-opacity duration-150 disabled:opacity-40"
          disabled={!hydrated || !nameInput.trim()}
        >
          {savedName ? "Start again in the terrace" : "Start in the terrace"}
        </button>

        <div className="flex flex-col gap-2 text-sm text-muted">
          <p>Walk, run and jump. Switch the camera. Record what the city still remembers.</p>
          <p>Progress stays on this device.</p>
          {recorded ? <p>You have already recorded “The chimney that sings”.</p> : null}
          {hasSave ? (
            <button
              type="button"
              className="self-start text-sm text-fg underline decoration-border underline-offset-4"
              onClick={() => {
                resetSave();
                setNameInput("");
                setSkin("sand");
                setCloth("indigo");
              }}
            >
              Forget this identity
            </button>
          ) : null}
        </div>
      </form>
    </main>
  );
}
