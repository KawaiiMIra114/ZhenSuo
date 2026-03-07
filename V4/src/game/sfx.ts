let audioCtx: AudioContext | null = null;

function ctx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function envelope(gainNode: GainNode, durationMs: number, gain: number) {
  const now = ctx().currentTime;
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.linearRampToValueAtTime(gain, now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
}

export function playTone(freq: number, durationMs: number, type: OscillatorType, gain = 0.02) {
  const ac = ctx();
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(g);
  g.connect(ac.destination);
  envelope(g, durationMs, gain);
  osc.start();
  osc.stop(ac.currentTime + durationMs / 1000 + 0.05);
}

let lowHum: { osc: OscillatorNode; gain: GainNode } | null = null;

export function startLowHum() {
  if (lowHum) return;
  const ac = ctx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = 'sine';
  osc.frequency.value = 27;
  gain.gain.value = 0.002;
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start();
  lowHum = { osc, gain };
}

export function stopLowHum() {
  if (!lowHum) return;
  const ac = ctx();
  lowHum.gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.2);
  lowHum.osc.stop(ac.currentTime + 0.25);
  lowHum = null;
}

export function playRouteTick() {
  playTone(880, 60, 'triangle', 0.008);
}

export function playGlitchPing() {
  playTone(2000, 200, 'square', 0.01);
}

export function playEndingBreath() {
  playTone(180, 180, 'sine', 0.004);
}
