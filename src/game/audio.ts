let ctx: AudioContext | null = null;
let humGain: GainNode | null = null;

function audioCtor(): typeof AudioContext | undefined {
  if (typeof window === "undefined") return undefined;
  if (typeof AudioContext !== "undefined") return AudioContext;
  const legacy = window as unknown as { webkitAudioContext?: typeof AudioContext };
  return legacy.webkitAudioContext;
}

export function unlockAudio() {
  const Ctor = audioCtor();
  if (!Ctor) return;
  let audio = ctx;
  if (!audio) {
    audio = new Ctor();
    const filter = audio.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 220;
    const gain = audio.createGain();
    gain.gain.value = 0;
    const low = audio.createOscillator();
    low.type = "sine";
    low.frequency.value = 58;
    const mid = audio.createOscillator();
    mid.type = "triangle";
    mid.frequency.value = 87;
    const midGain = audio.createGain();
    midGain.gain.value = 0.35;
    low.connect(filter);
    mid.connect(midGain);
    midGain.connect(filter);
    filter.connect(gain);
    gain.connect(audio.destination);
    low.start();
    mid.start();
    ctx = audio;
    humGain = gain;
  }
  void audio.resume();
}

export function setHumLevel(level: number, muted: boolean) {
  if (!ctx || !humGain) return;
  const next = muted ? 0 : Math.max(0, Math.min(0.06, level));
  humGain.gain.setTargetAtTime(next, ctx.currentTime, 0.18);
}

export function chime() {
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(392, now);
  osc.frequency.exponentialRampToValueAtTime(784, now + 0.18);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.07, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.72);
}
