import { MapPin, X, Compass, Globe } from "lucide-react";
import { WORLD_REGIONS, type WorldRegion } from "@/game/regions";
import { useGameStore } from "@/game/store";

type WorldMapModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onTravel: (region: WorldRegion) => void;
};

export function WorldMapModal({ isOpen, onClose, onTravel }: WorldMapModalProps) {
  const memories = useGameStore((s) => s.memories);

  if (!isOpen) return null;

  return (
    <div
      className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-bg/85 p-4 sm:p-6"
      data-ui
      role="dialog"
      aria-modal="true"
      aria-labelledby="world-map-title"
    >
      <div className="flex max-h-[90dvh] w-full max-w-4xl flex-col rounded-xl border border-border bg-surface shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <Globe className="size-6 text-accent" />
            <div>
              <p className="text-xs tracking-widest text-accent uppercase">Global Navigation</p>
              <h2 id="world-map-title" className="font-display text-2xl leading-none text-fg sm:text-3xl">
                World Map & Regions
              </h2>
            </div>
          </div>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-lg border border-border bg-bg text-fg hover:border-accent"
            onClick={onClose}
            aria-label="Close world map"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto p-6 lg:grid-cols-2">
          {/* Left: Region List */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-muted">Select a territory to inspect or travel:</p>
            <div className="flex flex-col gap-2.5">
              {WORLD_REGIONS.map((region) => {
                const isUnlocked = region.unlockedByDefault || memories.length >= 2;
                return (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => {
                      if (isUnlocked) {
                        onTravel(region);
                        onClose();
                      }
                    }}
                    disabled={!isUnlocked}
                    className={`flex items-start justify-between gap-3 rounded-lg border p-4 text-left transition-all ${
                      isUnlocked
                        ? "border-border bg-bg hover:border-accent hover:bg-surface cursor-pointer"
                        : "border-border/40 bg-bg/40 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className={`mt-0.5 size-5 shrink-0 ${isUnlocked ? "text-accent" : "text-muted"}`} />
                      <div>
                        <h3 className="font-medium text-fg">{region.name}</h3>
                        <p className="text-xs text-muted">{region.subtitle}</p>
                      </div>
                    </div>
                    <span className="rounded border border-border px-2 py-0.5 text-xs text-accent">
                      {isUnlocked ? "Discovered" : "Locked"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Geographic Overview & Lore */}
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-bg p-6">
            <div className="flex items-center gap-2 text-accent">
              <Compass className="size-5" />
              <h3 className="font-medium text-fg">Territorial Codex</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              N8G: THE ERASED spans multiple continents, ancient settlements, and monumental boundaries established across seven canonical manuscripts and documented historical records.
            </p>
            <div className="rounded-lg border border-border bg-surface p-4">
              <h4 className="mb-1 font-medium text-fg">Exploration Advisory</h4>
              <p className="text-xs leading-relaxed text-muted">
                Traverse walkable ancient pathways, ride water channels, or use global telemetry to reposition across regions instantly. Discover memory fragments in each territory to unlock remote transit nodes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
