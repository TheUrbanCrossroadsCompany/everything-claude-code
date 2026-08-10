// Synthesizes the 15s sound-effects track as a stereo 44.1kHz WAV.
// Layers: ocean ambience, lighthouse-beam hum, word-impact booms, whoosh
// transitions, UI ticks for the 5 steps, riser into the finale, and a
// shimmer chime under "NEW LIFE."
const fs = require('fs');
const path = require('path');

const SR = 44100, DUR = 15, N = SR * DUR;
const L = new Float32Array(N), R = new Float32Array(N);

// deterministic noise
let seed = 12345;
function rand() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff * 2 - 1; }

function addSample(i, l, r) { if (i >= 0 && i < N) { L[i] += l; R[i] += r; } }

// ---------- ocean ambience: brown noise, slow swell LFO ----------
(function ocean() {
  let bl = 0, br = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    bl += rand() * 0.02; bl *= 0.999;
    br += rand() * 0.02; br *= 0.999;
    const swell = 0.5 + 0.5 * Math.sin(2 * Math.PI * t / 7 + 1.2);
    const amp = 0.10 + 0.08 * swell;
    addSample(i, bl * amp * 1.6, br * amp * 1.6);
  }
})();

// ---------- lighthouse hum: low drone w/ slow beat ----------
(function hum() {
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const a = 0.035 * (0.6 + 0.4 * Math.sin(2 * Math.PI * t * 0.45));
    const s = Math.sin(2 * Math.PI * 55 * t) * 0.6 + Math.sin(2 * Math.PI * 110 * t) * 0.3;
    addSample(i, s * a, s * a);
  }
})();

// ---------- impact boom: pitch-dropping sine + click + noise thud ----------
function boom(t0, gain = 1, f0 = 160, f1 = 45, dur = 0.7) {
  const s0 = Math.floor(t0 * SR), n = Math.floor(dur * SR);
  let phase = 0;
  for (let j = 0; j < n; j++) {
    const p = j / n, t = j / SR;
    const f = f0 + (f1 - f0) * Math.min(1, p * 3);
    phase += 2 * Math.PI * f / SR;
    const env = Math.exp(-p * 7);
    let s = Math.sin(phase) * env * 0.9;
    if (t < 0.02) s += rand() * (1 - t / 0.02) * 0.8;      // click transient
    s += rand() * Math.exp(-p * 18) * 0.25;                 // body noise
    addSample(s0 + j, s * gain * 0.55, s * gain * 0.55);
  }
}

// ---------- whoosh: band-swept noise (simple resonant one-pole pair) ----------
function whoosh(t0, dur = 0.6, gain = 1, dir = 1) {
  const s0 = Math.floor(t0 * SR), n = Math.floor(dur * SR);
  let lp = 0, lp2 = 0;
  for (let j = 0; j < n; j++) {
    const p = j / n;
    const env = Math.sin(Math.PI * p) ** 1.5;
    const cutoff = dir > 0 ? 0.02 + 0.25 * p : 0.27 - 0.25 * p;
    lp += cutoff * (rand() - lp);
    lp2 += cutoff * (lp - lp2);
    const s = lp2 * env * 3.2 * gain;
    const pan = dir > 0 ? p : 1 - p; // sweep across stereo field
    addSample(s0 + j, s * (1 - pan * 0.7), s * (0.3 + pan * 0.7));
  }
}

// ---------- tick/pop for step icons ----------
function tick(t0, pitch = 900, gain = 1) {
  const s0 = Math.floor(t0 * SR), n = Math.floor(0.09 * SR);
  for (let j = 0; j < n; j++) {
    const p = j / n, t = j / SR;
    const env = Math.exp(-p * 22);
    const s = (Math.sin(2 * Math.PI * pitch * t) * 0.7 + rand() * 0.3) * env;
    addSample(s0 + j, s * gain * 0.4, s * gain * 0.4);
  }
}

// ---------- riser: rising filtered noise + sine sweep ----------
function riser(t0, dur = 1.6, gain = 1) {
  const s0 = Math.floor(t0 * SR), n = Math.floor(dur * SR);
  let lp = 0;
  for (let j = 0; j < n; j++) {
    const p = j / n, t = j / SR;
    const env = p * p;
    lp += (0.01 + 0.3 * p) * (rand() - lp);
    const f = 180 + 700 * p * p;
    const s = (lp * 2.2 + Math.sin(2 * Math.PI * f * t) * 0.25) * env;
    addSample(s0 + j, s * gain * 0.5, s * gain * 0.5);
  }
}

// ---------- shimmer chime: detuned sine arpeggio w/ long decay ----------
function shimmer(t0, gain = 1) {
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5 E5 G5 C6 E6
  notes.forEach((f, k) => {
    const nt0 = t0 + k * 0.12, s0 = Math.floor(nt0 * SR), n = Math.floor(1.8 * SR);
    for (let j = 0; j < n; j++) {
      const p = j / n, t = j / SR;
      const env = Math.exp(-p * 3.2) * Math.min(1, j / 200);
      const s = (Math.sin(2 * Math.PI * f * t) + 0.4 * Math.sin(2 * Math.PI * f * 1.005 * t)) * env;
      const pan = k / (notes.length - 1);
      addSample(s0 + j, s * gain * 0.10 * (1 - pan * 0.6), s * gain * 0.10 * (0.4 + pan * 0.6));
    }
  });
}

// ---------- wave crash: big noise splash ----------
function crash(t0, gain = 1) {
  const s0 = Math.floor(t0 * SR), n = Math.floor(1.4 * SR);
  let lp = 0;
  for (let j = 0; j < n; j++) {
    const p = j / n;
    const env = Math.exp(-p * 3.5) * Math.min(1, j / (0.05 * SR));
    lp += 0.35 * (rand() - lp);
    const s = lp * env * 2.4;
    addSample(s0 + j, s * gain * 0.5, s * gain * 0.45);
  }
}

// ================= timeline =================
crash(0.0, 0.9);                       // opening wave
boom(0.45, 1.0);                       // THE MOMENT
boom(1.05, 1.0);                       // YOU DECIDE
boom(1.65, 1.0);                       // YOU DESERVE
boom(2.30, 1.25, 150, 40, 0.9);        // BETTER,
whoosh(3.15, 0.55, 1.0, 1);            // transition -> scene 2
boom(4.15, 1.4, 140, 38, 1.0);         // SHIFT. slam
crash(4.2, 0.5);
whoosh(5.75, 0.5, 0.9, -1);            // -> quote box
tick(6.25, 600, 1.2);                  // box lands
crash(7.0, 0.45);
whoosh(8.35, 0.5, 0.9, 1);             // -> steps
tick(8.80, 800, 1.3);                  // step 1
tick(9.25, 850, 1.3);
tick(9.70, 900, 1.3);
tick(10.15, 950, 1.3);
tick(10.60, 1000, 1.4);                // step 5
riser(10.9, 1.45, 1.0);                // build into finale
boom(12.35, 1.5, 130, 36, 1.1);        // NEW LIFE. hit
shimmer(12.45, 1.0);
crash(12.4, 0.5);
shimmer(13.4, 0.55);                   // closer line sparkle

// ---------- fade in/out, soft-clip, write WAV ----------
const fadeN = Math.floor(0.15 * SR), tailN = Math.floor(0.8 * SR);
for (let i = 0; i < fadeN; i++) { const g = i / fadeN; L[i] *= g; R[i] *= g; }
for (let i = 0; i < tailN; i++) { const g = i / tailN; L[N - 1 - i] *= g; R[N - 1 - i] *= g; }

const pcm = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  const sl = Math.tanh(L[i] * 1.2), sr = Math.tanh(R[i] * 1.2);
  pcm.writeInt16LE(Math.round(sl * 32000), i * 4);
  pcm.writeInt16LE(Math.round(sr * 32000), i * 4 + 2);
}
const hdr = Buffer.alloc(44);
hdr.write('RIFF', 0); hdr.writeUInt32LE(36 + pcm.length, 4); hdr.write('WAVE', 8);
hdr.write('fmt ', 12); hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20);
hdr.writeUInt16LE(2, 22); hdr.writeUInt32LE(SR, 24); hdr.writeUInt32LE(SR * 4, 28);
hdr.writeUInt16LE(4, 32); hdr.writeUInt16LE(16, 34);
hdr.write('data', 36); hdr.writeUInt32LE(pcm.length, 40);
fs.writeFileSync(path.join(__dirname, 'sfx.wav'), Buffer.concat([hdr, pcm]));
console.log('sfx.wav written');
