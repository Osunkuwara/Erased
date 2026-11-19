import { useEffect, useRef, useState, type PointerEvent } from "react";
import { BookOpen, Camera, Volume2, VolumeX, X } from "lucide-react";
import { tryRecord } from "@/game/actions";
import {
  CANON_LABEL,
  COMPANION_SHELF,
  MEMORY_ID,
  PLACE_NOTES,
  ZONE_NAME,
  recordById,
} from "@/game/content";
import { setHold, setStick } from "@/game/input";
import { useGameStore } from "@/game/store";

function Joystick() {
  const pad = useRef<HTMLDivElement>(null);
  const pointer = useRef<number | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  function place(event: PointerEvent<HTMLDivElement>) {
    const rect = pad.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let x = (event.clientX - cx) / (rect.width / 2);
    let y = (event.clientY - cy) / (rect.height / 2);
    const mag = Math.hypot(x, y);
    if (mag < 0.12) {
      x = 0;
      y = 0;
    } else if (mag > 1) {
      x /= mag;
      y /= mag;
    }
    setKnob({ x, y });
    setStick(x, y, mag >= 0.12);
  }

  return (
    <div
      ref={pad}
      data-ui
      className="relative size-32 rounded-full border border-border bg-surface/80"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        pointer.current = event.pointerId;
        place(event);
      }}
      onPointerMove={(event) => {
        if (pointer.current !== event.pointerId) return;
        place(event);
      }}
      onPointerUp={(event) => {
        if (pointer.current !== event.pointerId) return;
        pointer.current = null;
        setKnob({ x: 0, y: 0 });
        setStick(0, 0, false);
      }}
      onPointerCancel={() => {
        pointer.current = null;
        setKnob({ x: 0, y: 0 });
        setStick(0, 0, false);
      }}
    >
      <span
        className="absolute top-1/2 left-1/2 size-12 rounded-full bg-accent"
        style={{ transform: `translate(calc(-50% + ${knob.x * 36}px), calc(-50% + ${knob.y * 36}px))` }}
      />
    </div>
  );
}

function HoldButton({
  label,
  hold,
  disabled,
  onPress,
}: {
  label: string;
  hold: "jump" | "run" | "interact";
  disabled?: boolean;
  onPress?: () => void;
}) {
  return (
    <button
      type="button"
      data-ui
      disabled={disabled}
      className="min-h-14 min-w-14 rounded-full border border-border bg-surface px-4 text-sm font-medium text-fg disabled:opacity-40"
      onPointerDown={(event) => {
        event.preventDefault();
        setHold(hold, true);
        onPress?.();
      }}
      onPointerUp={() => setHold(hold, false)}
      onPointerLeave={() => setHold(hold, false)}
      onPointerCancel={() => setHold(hold, false)}
      onContextMenu={(event) => event.preventDefault()}
    >
      {label}
    </button>
  );
}

function Badge({ status }: { status: keyof typeof CANON_LABEL }) {
  return (
    <span className="rounded-full border border-border px-2 py-1 text-xs tracking-widest text-accent uppercase">
      {CANON_LABEL[status]}
    </span>
  );
}

export function Hud({ onLeave }: { onLeave: () => void }) {
  const playerName = useGameStore((s) => s.playerName);
  const cameraMode = useGameStore((s) => s.cameraMode);
  const toggleCamera = useGameStore((s) => s.toggleCamera);
  const nearMemory = useGameStore((s) => s.nearMemory);
  const memories = useGameStore((s) => s.memories);
  const archiveOpen = useGameStore((s) => s.archiveOpen);
  const setArchiveOpen = useGameStore((s) => s.setArchiveOpen);
  const muted = useGameStore((s) => s.muted);
  const setMuted = useGameStore((s) => s.setMuted);
  const justRecordedId = useGameStore((s) => s.justRecordedId);
  const clearNotice = useGameStore((s) => s.clearNotice);

  const recorded = memories.includes(MEMORY_ID);

  useEffect(() => {
    if (!justRecordedId) return;
    const timer = window.setTimeout(clearNotice, 4200);
    return () => window.clearTimeout(timer);
  }, [justRecordedId, clearNotice]);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.code === "KeyC") toggleCamera();
      if (event.code === "Escape") setArchiveOpen(false);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [setArchiveOpen, toggleCamera]);

  const notice = justRecordedId ? recordById(justRecordedId) : undefined;

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <header className="hud-top pointer-events-none flex items-start justify-between gap-3 px-4 pt-4 pb-10">
        <div className="pointer-events-auto" data-ui>
          <p className="text-xs tracking-widest text-accent uppercase">{ZONE_NAME}</p>
          <p className="font-display text-2xl leading-none text-fg">{playerName}</p>
        </div>
        <div className="pointer-events-auto flex gap-2" data-ui>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-lg border border-border bg-surface text-fg"
            onClick={() => setMuted(!muted)}
            aria-label={muted ? "Unmute the Hum" : "Mute the Hum"}
          >
            {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-lg border border-border bg-surface text-fg"
            onClick={toggleCamera}
            aria-label={cameraMode === "third" ? "Switch to first person" : "Switch to third person"}
          >
            <Camera className="size-5" />
          </button>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-lg border border-border bg-surface text-fg"
            onClick={() => setArchiveOpen(true)}
            aria-label="Open archive"
          >
            <BookOpen className="size-5" />
          </button>
        </div>
      </header>

      {notice ? (
        <p className="pointer-events-none absolute top-20 left-1/2 w-[min(24rem,calc(100%-2rem))] -translate-x-1/2 rounded-lg border border-border bg-surface px-4 py-3 text-center text-sm text-fg">
          Memory recorded — {notice.title}
        </p>
      ) : null}

      <p className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 rounded-lg bg-surface px-4 py-2 text-center text-sm text-fg md:block">
        {nearMemory
          ? recorded
            ? "Already in the archive"
            : "Press E to record this memory"
          : cameraMode === "third"
            ? "WASD move · Shift run · Space jump · drag to look · C camera"
            : "WASD move · Shift run · Space jump · drag to look · C camera"}
      </p>

      {nearMemory && !recorded ? (
        <p className="pointer-events-none absolute bottom-40 left-1/2 -translate-x-1/2 text-center text-sm text-fg md:hidden">
          A memory is close
        </p>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-5 md:hidden">
        <Joystick />
        <div className="flex flex-col items-end gap-3">
          <HoldButton label="Run" hold="run" />
          <HoldButton
            label={recorded ? "Kept" : "Record"}
            hold="interact"
            disabled={!nearMemory || recorded}
            onPress={() => {
              if (nearMemory) tryRecord(MEMORY_ID);
            }}
          />
          <HoldButton label="Jump" hold="jump" />
        </div>
      </div>

      {cameraMode === "first" ? (
        <span className="pointer-events-none absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
      ) : null}

      <div className="vignette pointer-events-none absolute inset-0" />

      {archiveOpen ? (
        <div
          className="pointer-events-auto absolute inset-0 z-20 flex items-end justify-center bg-bg/80 sm:items-center"
          data-ui
          role="dialog"
          aria-modal="true"
          aria-labelledby="archive-title"
        >
          <div className="max-h-[86dvh] w-full max-w-lg overflow-y-auto rounded-t-xl border border-border bg-surface p-6 sm:rounded-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-widest text-accent uppercase">Archive</p>
                <h2 id="archive-title" className="font-display text-4xl leading-none text-fg">
                  What was kept
                </h2>
              </div>
              <button
                type="button"
                className="flex size-11 items-center justify-center rounded-lg border border-border text-fg"
                onClick={() => setArchiveOpen(false)}
                aria-label="Close archive"
              >
                <X className="size-5" />
              </button>
            </div>

            <section className="mb-6 flex flex-col gap-3">
              <h3 className="text-sm font-medium text-fg">Recorded by you</h3>
              {memories.length === 0 ? (
                <p className="text-sm text-muted">Nothing yet. The golden fragment in the courtyard can be kept.</p>
              ) : (
                memories.map((id) => {
                  const record = recordById(id);
                  if (!record) return null;
                  return (
                    <article key={id} className="rounded-lg border border-border bg-bg p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <h4 className="font-medium text-fg">{record.title}</h4>
                        <Badge status={record.canonStatus} />
                      </div>
                      <p className="text-sm text-muted">{record.body}</p>
                    </article>
                  );
                })
              )}
            </section>

            <section className="mb-6 flex flex-col gap-3">
              <h3 className="text-sm font-medium text-fg">How a record is marked</h3>
              <ul className="flex flex-col gap-2 text-sm text-muted">
                <li>
                  <span className="text-fg">Canon</span> — stated by the novels.
                </li>
                <li>
                  <span className="text-fg">Interpretation</span> — how the game pictures it.
                </li>
                <li>
                  <span className="text-fg">Expansion</span> — made for play.
                </li>
                <li>
                  <span className="text-fg">Documented history</span> — nonfiction, kept apart from the cosmology.
                </li>
              </ul>
              {PLACE_NOTES.map((note) => (
                <article key={note.id} className="rounded-lg border border-border p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h4 className="font-medium text-fg">{note.title}</h4>
                    <Badge status={note.canonStatus} />
                  </div>
                  <p className="text-sm text-muted">{note.body}</p>
                </article>
              ))}
            </section>

            <section className="mb-6 flex flex-col gap-3">
              <h3 className="text-sm font-medium text-fg">Companion shelf</h3>
              {COMPANION_SHELF.map((note) => (
                <article key={note.id} className="rounded-lg border border-border bg-bg p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h4 className="font-medium text-fg">{note.title}</h4>
                    <Badge status={note.canonStatus} />
                  </div>
                  <p className="text-sm text-muted">{note.body}</p>
                </article>
              ))}
            </section>

            <button
              type="button"
              className="text-sm text-fg underline decoration-border underline-offset-4"
              onClick={onLeave}
            >
              Leave the terrace
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
