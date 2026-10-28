// Tarayıcıda canlı ambient müzik üreten motor (Web Audio API).
// Hiçbir ses dosyası kullanmaz: akorlar, melodi, ritim ve doğa sesleri
// her an yeniden sentezlenir, bu yüzden müzik hiç tekrar etmez.

import { Mood, MoodId, getMood } from './moods';

export type LayerKey = 'pulse' | 'melody' | 'nature' | 'binaural';
export type Tuning = 432 | 440;

export interface AmbientState {
  playing: boolean;
  mode: 'mood' | 'tone' | null;
  moodId: MoodId;
  toneFreq: number | null;
  layers: Record<LayerKey, boolean>;
  volume: number;
  tuning: Tuning;
  sleepEndsAt: number | null;
}

type Listener = () => void;

interface Voice {
  stop: (t: number, release: number) => void;
}

const midiToFreq = (m: number, a4: number) => a4 * Math.pow(2, (m - 69) / 12);
const rand = (a: number, b: number) => a + Math.random() * (b - a);

class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private musicBus!: GainNode;
  private reverb!: ConvolverNode;
  private reverbIn!: GainNode;
  analyser: AnalyserNode | null = null;

  private noise: { white?: AudioBuffer; brown?: AudioBuffer } = {};

  private timer: number | null = null;
  private nextStepTime = 0;
  private step = 0;
  private chordIndex = -1;
  private padVoices: Voice[] = [];
  private natureStop: ((t: number) => void) | null = null;
  private binauralStop: ((t: number) => void) | null = null;
  private toneStop: ((t: number) => void) | null = null;
  private lastMelodyIdx = 3;
  private sleepTimer: number | null = null;

  private state: AmbientState = {
    playing: false,
    mode: null,
    moodId: 'sakin',
    toneFreq: null,
    layers: { ...getMood('sakin').defaults },
    volume: 0.7,
    tuning: 432,
    sleepEndsAt: null,
  };
  private listeners = new Set<Listener>();

  // ---------- React bağlantısı ----------
  subscribe = (fn: Listener) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
  getState = () => this.state;
  private set(patch: Partial<AmbientState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l());
  }

  // ---------- Kurulum ----------
  private ensure(): AudioContext {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return this.ctx;
    }
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    this.ctx = ctx;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;
    comp.attack.value = 0.02;
    comp.release.value = 0.4;

    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.85;

    this.master.connect(comp);
    comp.connect(this.analyser);
    this.analyser.connect(ctx.destination);

    this.musicBus = ctx.createGain();
    this.musicBus.gain.value = 1;
    this.musicBus.connect(this.master);

    this.reverb = ctx.createConvolver();
    this.reverb.buffer = this.makeImpulse(5.5, 2.6);
    this.reverbIn = ctx.createGain();
    this.reverbIn.gain.value = 1;
    const reverbOut = ctx.createGain();
    reverbOut.gain.value = 0.9;
    this.reverbIn.connect(this.reverb);
    this.reverb.connect(reverbOut);
    reverbOut.connect(this.master);

    this.noise.white = this.makeNoise('white');
    this.noise.brown = this.makeNoise('brown');
    return ctx;
  }

  private makeImpulse(seconds: number, decay: number): AudioBuffer {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  private makeNoise(kind: 'white' | 'brown'): AudioBuffer {
    const ctx = this.ctx!;
    const len = ctx.sampleRate * 8;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        if (kind === 'white') d[i] = w;
        else {
          last = (last + 0.02 * w) / 1.02;
          d[i] = last * 3.5;
        }
      }
    }
    return buf;
  }

  /** Bir sesi hem kuru hem yankı (reverb) yoluna bağlar. */
  private route(node: AudioNode, wet: number, dry = 1) {
    const ctx = this.ctx!;
    if (dry > 0) {
      const d = ctx.createGain();
      d.gain.value = dry;
      node.connect(d);
      d.connect(this.musicBus);
    }
    if (wet > 0) {
      const w = ctx.createGain();
      w.gain.value = wet;
      node.connect(w);
      w.connect(this.reverbIn);
    }
  }

  private freq(m: number) {
    return midiToFreq(m, this.state.tuning);
  }

  // ---------- Dışarıya açık kontroller ----------
  startMood(id: MoodId) {
    const ctx = this.ensure();
    const mood = getMood(id);
    const switching = this.state.playing;
    this.stopSources(switching ? 2.5 : 0.1);
    this.set({
      playing: true,
      mode: 'mood',
      moodId: id,
      toneFreq: null,
      layers: { ...mood.defaults },
    });
    this.fadeMaster(this.state.volume, switching ? 1.5 : 2.5);

    this.step = 0;
    this.chordIndex = -1;
    this.nextStepTime = ctx.currentTime + (switching ? 0.8 : 0.1);
    this.startNature(mood, this.nextStepTime);
    if (this.state.layers.binaural) this.startBinaural(mood, this.nextStepTime);
    this.startScheduler();
  }

  startTone(freq: number) {
    const ctx = this.ensure();
    this.stopSources(0.3);
    this.set({ playing: true, mode: 'tone', toneFreq: freq });
    this.fadeMaster(this.state.volume, 0.8);
    const t = ctx.currentTime + 0.05;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(0.18, t + 1.2);
    out.connect(this.master);

    const oscs: OscillatorNode[] = [];
    if (freq < 20) {
      // Duyulamayan 7.83 Hz farkı, iki kulağa ayrı ayrı verilen duyulabilir tonlarla
      // (binaural) oluşturulur: sol 136.1 Hz, sağ 136.1 + 7.83 Hz.
      const merger = ctx.createChannelMerger(2);
      [136.1, 136.1 + freq].forEach((f, ch) => {
        const o = ctx.createOscillator();
        o.frequency.value = f;
        o.connect(merger, 0, ch);
        o.start(t);
        oscs.push(o);
      });
      merger.connect(out);
    } else {
      const o = ctx.createOscillator();
      o.frequency.value = freq;
      o.connect(out);
      o.start(t);
      oscs.push(o);
    }
    this.toneStop = (when) => {
      out.gain.cancelScheduledValues(when);
      out.gain.setTargetAtTime(0.0001, when, 0.15);
      oscs.forEach((o) => o.stop(when + 1));
    };
  }

  stop() {
    if (!this.ctx || !this.state.playing) return;
    this.fadeMaster(0, 1.2);
    const ctx = this.ctx;
    const t = ctx.currentTime + 1.5;
    this.stopScheduler();
    this.clearSleep();
    this.padVoices.forEach((v) => v.stop(ctx.currentTime, 1.2));
    this.padVoices = [];
    this.natureStop?.(t);
    this.natureStop = null;
    this.binauralStop?.(t);
    this.binauralStop = null;
    this.toneStop?.(t);
    this.toneStop = null;
    this.set({ playing: false, mode: null, toneFreq: null });
  }

  setVolume(v: number) {
    this.set({ volume: v });
    if (this.ctx && this.state.playing) this.fadeMaster(v, 0.15);
  }

  setTuning(t: Tuning) {
    if (t === this.state.tuning) return;
    this.set({ tuning: t });
    // Akort bir sonraki akorda devreye girer; binaural taşıyıcıyı da yenile.
    if (this.state.playing && this.state.mode === 'mood' && this.state.layers.binaural) {
      this.binauralStop?.(this.ctx!.currentTime);
      this.startBinaural(getMood(this.state.moodId), this.ctx!.currentTime + 0.1);
    }
  }

  setLayer(key: LayerKey, on: boolean) {
    this.set({ layers: { ...this.state.layers, [key]: on } });
    if (!this.ctx || !this.state.playing || this.state.mode !== 'mood') return;
    const mood = getMood(this.state.moodId);
    const now = this.ctx.currentTime;
    if (key === 'nature') {
      if (on) this.startNature(mood, now + 0.05);
      else {
        this.natureStop?.(now);
        this.natureStop = null;
      }
    }
    if (key === 'binaural') {
      if (on) this.startBinaural(mood, now + 0.05);
      else {
        this.binauralStop?.(now);
        this.binauralStop = null;
      }
    }
  }

  /** Dakika cinsinden uyku zamanlayıcısı; 0 kapatır. */
  setSleepTimer(minutes: number) {
    this.clearSleep();
    if (!minutes) return;
    const ms = minutes * 60_000;
    this.set({ sleepEndsAt: Date.now() + ms });
    this.sleepTimer = window.setTimeout(() => {
      // Son 30 saniyede yavaşça kıs, sonra durdur.
      if (this.ctx) this.fadeMaster(0, 30);
      this.sleepTimer = window.setTimeout(() => this.stop(), 31_000);
    }, Math.max(0, ms - 30_000));
  }

  private clearSleep() {
    if (this.sleepTimer) window.clearTimeout(this.sleepTimer);
    this.sleepTimer = null;
    if (this.state.sleepEndsAt) this.set({ sleepEndsAt: null });
  }

  private fadeMaster(target: number, seconds: number) {
    const ctx = this.ctx!;
    const g = this.master.gain;
    const now = ctx.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(target, now + seconds);
  }

  private stopSources(release: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.stopScheduler();
    this.padVoices.forEach((v) => v.stop(now, release));
    this.padVoices = [];
    this.natureStop?.(now);
    this.natureStop = null;
    this.binauralStop?.(now);
    this.binauralStop = null;
    this.toneStop?.(now);
    this.toneStop = null;
  }

  // ---------- Zamanlayıcı (sekizlik notalar) ----------
  private startScheduler() {
    this.stopScheduler();
    const tick = () => {
      if (!this.ctx) return;
      const mood = getMood(this.state.moodId);
      const stepDur = 60 / mood.bpm / 2;
      // Sekme arka plandayken tarayıcı zamanlayıcıları yavaşlatır; daha ileriyi planla.
      const ahead = document.hidden ? 1.5 : 0.2;
      while (this.nextStepTime < this.ctx.currentTime + ahead) {
        this.scheduleStep(mood, this.step, this.nextStepTime, stepDur);
        this.step++;
        this.nextStepTime += stepDur;
      }
    };
    tick();
    this.timer = window.setInterval(tick, 50);
  }

  private stopScheduler() {
    if (this.timer) window.clearInterval(this.timer);
    this.timer = null;
  }

  private scheduleStep(mood: Mood, step: number, t: number, stepDur: number) {
    const stepsPerChord = mood.barsPerChord * 4 * 2;
    const inChord = step % stepsPerChord;
    const beatInBar = Math.floor(step / 2) % 4;
    const onBeat = step % 2 === 0;
    const { layers } = this.state;

    if (inChord === 0) {
      this.chordIndex = (this.chordIndex + 1) % mood.chords.length;
      this.changeChord(mood, t, stepsPerChord * stepDur);
    }
    const chord = mood.chords[this.chordIndex];

    // Bas
    if (mood.bassPulse && layers.pulse) {
      const root = chord[0] >= 47 ? chord[0] - 12 : chord[0];
      this.pluckBass(this.freq(root), t, stepDur * 0.9);
    }

    // Ritim
    if (layers.pulse) {
      if (mood.pulse === 'heartbeat' && onBeat) {
        this.thump(t, 58, 0.32);
        this.thump(t + 0.2, 52, 0.18);
      } else if (mood.pulse === 'soft') {
        if (onBeat && beatInBar % 2 === 0) this.thump(t, 60, 0.22);
        this.shaker(t, onBeat ? 0.025 : 0.04);
      } else if (mood.pulse === 'drive') {
        if (onBeat) this.kick(t);
        else this.hat(t);
        if (onBeat && (beatInBar === 1 || beatInBar === 3)) this.clap(t);
      }
    }

    // Arpej ve melodi
    if (layers.melody) {
      if (mood.arpeggio) {
        const notes = chord
          .slice(1)
          .map((n) => {
            let x = n;
            while (x < 64) x += 12;
            return x;
          })
          .sort((a, b) => a - b);
        const pattern = [0, 1, 2, 3, 2, 1, 0, 2];
        const idx = pattern[step % pattern.length] % notes.length;
        const up = Math.floor(inChord / 8) % 2 === 1 ? 12 : 0;
        this.pluck(this.freq(notes[idx] + up), t, mood.id === 'motivasyon' ? 0.045 : 0.035, 0.6);
      }
      if (onBeat && Math.random() < mood.melodyChance) {
        this.playMelody(mood, chord, t, inChord === 0);
      }
    }
  }

  private changeChord(mood: Mood, t: number, dur: number) {
    const ctx = this.ctx!;
    const attack = Math.min(4, dur * 0.35);
    this.padVoices.forEach((v) => v.stop(t, attack * 1.2));
    this.padVoices = [];

    const chord = mood.chords[this.chordIndex];
    const perVoice = 0.075 / Math.sqrt(chord.length);
    chord.forEach((n, i) => {
      this.padVoices.push(this.padVoice(this.freq(n), t, attack, i === 0 ? perVoice * 1.1 : perVoice, mood));
    });
    // Alt oktav sinüs bas: sıcaklık verir
    if (!mood.bassPulse) {
      const root = chord[0] >= 47 ? chord[0] - 12 : chord[0];
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = this.freq(root);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.14, t + attack);
      o.connect(g);
      this.route(g, 0.1);
      o.start(t);
      this.padVoices.push({
        stop: (when, rel) => {
          g.gain.cancelScheduledValues(when);
          g.gain.setTargetAtTime(0, when, rel / 3);
          o.stop(when + rel * 2);
        },
      });
    }
  }

  // ---------- Ses kaynakları ----------
  private padVoice(f: number, t: number, attack: number, gain: number, mood: Mood): Voice {
    const ctx = this.ctx!;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = mood.padBrightness * rand(0.85, 1.15);
    filter.Q.value = 0.6;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = rand(0.04, 0.11);
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = mood.padBrightness * 0.45;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const vca = ctx.createGain();
    vca.gain.setValueAtTime(0.0001, t);
    vca.gain.linearRampToValueAtTime(gain, t + attack);

    const oscs = [-7, 6].map((detune) => {
      const o = ctx.createOscillator();
      o.type = mood.padWave;
      o.frequency.value = f;
      o.detune.value = detune + rand(-2, 2);
      o.connect(filter);
      return o;
    });
    filter.connect(vca);

    const pan = ctx.createStereoPanner();
    pan.pan.value = rand(-0.45, 0.45);
    vca.connect(pan);
    this.route(pan, 0.55);

    oscs.forEach((o) => o.start(t));
    lfo.start(t);
    return {
      stop: (when, rel) => {
        vca.gain.cancelScheduledValues(when);
        vca.gain.setTargetAtTime(0, when, rel / 3);
        const end = when + rel * 2;
        oscs.forEach((o) => o.stop(end));
        lfo.stop(end);
      },
    };
  }

  private playMelody(mood: Mood, chord: number[], t: number, chordStart: boolean) {
    const scale = mood.melodyScale;
    let idx: number;
    if (chordStart) {
      // Akor değişirken akora ait bir notaya in: kulağa "doğru" gelir.
      const pcs = new Set(chord.map((n) => n % 12));
      const candidates = scale.map((n, i) => ({ n, i })).filter((x) => pcs.has(x.n % 12));
      idx = candidates.length
        ? candidates.reduce((best, c) =>
            Math.abs(c.i - this.lastMelodyIdx) < Math.abs(best.i - this.lastMelodyIdx) ? c : best,
          ).i
        : this.lastMelodyIdx;
    } else {
      const move = [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)];
      idx = Math.min(scale.length - 1, Math.max(0, this.lastMelodyIdx + move));
    }
    this.lastMelodyIdx = idx;
    const f = this.freq(scale[idx]);
    if (mood.melodyStyle === 'piano') this.piano(f, t);
    else this.bell(f, t, mood.id === 'motivasyon' ? 0.06 : 0.07);
  }

  private bell(f: number, t: number, gain: number) {
    const ctx = this.ctx!;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(gain, t + 0.01);
    out.gain.exponentialRampToValueAtTime(0.0001, t + 3.5);
    const pan = ctx.createStereoPanner();
    pan.pan.value = rand(-0.6, 0.6);
    out.connect(pan);
    this.route(pan, 0.75, 0.6);
    [
      [1, 1],
      [2, 0.35],
      [3.01, 0.12],
    ].forEach(([mult, g]) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f * mult;
      const og = ctx.createGain();
      og.gain.value = g;
      o.connect(og);
      og.connect(out);
      o.start(t);
      o.stop(t + 3.6);
    });
  }

  private piano(f: number, t: number) {
    const ctx = this.ctx!;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(f * 6, t);
    filter.frequency.exponentialRampToValueAtTime(f * 1.5, t + 1.5);
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(0.09, t + 0.008);
    out.gain.exponentialRampToValueAtTime(0.03, t + 0.4);
    out.gain.exponentialRampToValueAtTime(0.0001, t + 4);
    filter.connect(out);
    const pan = ctx.createStereoPanner();
    pan.pan.value = rand(-0.3, 0.3);
    out.connect(pan);
    this.route(pan, 0.6, 0.8);
    (['triangle', 'sine'] as OscillatorType[]).forEach((type, i) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = f * (i === 0 ? 1 : 2.003);
      const og = ctx.createGain();
      og.gain.value = i === 0 ? 1 : 0.25;
      o.connect(og);
      og.connect(filter);
      o.start(t);
      o.stop(t + 4.1);
    });
  }

  private pluck(f: number, t: number, gain: number, decay: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.sin(t * 1.3) * 0.5;
    o.connect(g);
    g.connect(pan);
    this.route(pan, 0.45, 0.8);
    o.start(t);
    o.stop(t + decay + 0.05);
  }

  private pluckBass(f: number, t: number, dur: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = f;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, t);
    filter.frequency.exponentialRampToValueAtTime(200, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(filter);
    filter.connect(g);
    this.route(g, 0, 1);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private thump(t: number, f: number, gain: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(f * 1.6, t);
    o.frequency.exponentialRampToValueAtTime(f, t + 0.08);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    o.connect(g);
    this.route(g, 0.1, 1);
    o.start(t);
    o.stop(t + 0.4);
  }

  private kick(t: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.55, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    o.connect(g);
    this.route(g, 0, 1);
    o.start(t);
    o.stop(t + 0.5);
  }

  private noiseHit(t: number, type: BiquadFilterType, f: number, gain: number, dur: number, wet: number) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise.white!;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = f;
    filter.Q.value = type === 'bandpass' ? 1.2 : 0.7;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter);
    filter.connect(g);
    this.route(g, wet, 1);
    src.start(t, Math.random() * 6);
    src.stop(t + dur + 0.02);
  }

  private hat(t: number) {
    this.noiseHit(t, 'highpass', 8000, 0.07, 0.06, 0.05);
  }
  private clap(t: number) {
    this.noiseHit(t, 'bandpass', 1600, 0.16, 0.18, 0.35);
  }
  private shaker(t: number, gain: number) {
    this.noiseHit(t, 'highpass', 6000, gain, 0.08, 0.2);
  }

  private startNature(mood: Mood, t: number) {
    if (!this.state.layers.nature || mood.nature === 'none') return;
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    const out = ctx.createGain();
    out.gain.setValueAtTime(0, t);
    const nodes: AudioScheduledSourceNode[] = [src];

    if (mood.nature === 'rain') {
      src.buffer = this.noise.white!;
      filter.type = 'bandpass';
      filter.frequency.value = 2500;
      filter.Q.value = 0.4;
      out.gain.linearRampToValueAtTime(0.09, t + 3);
    } else {
      // Dalga: kahverengi gürültü, yavaşça kabarıp çekilir.
      src.buffer = this.noise.brown!;
      filter.type = 'lowpass';
      filter.frequency.value = 700;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = mood.id === 'uyku' ? 0.055 : 0.08;
      const lfoAmp = ctx.createGain();
      lfoAmp.gain.value = 0.11;
      const lfoFilt = ctx.createGain();
      lfoFilt.gain.value = 450;
      lfo.connect(lfoAmp);
      lfo.connect(lfoFilt);
      const swell = ctx.createGain();
      swell.gain.value = 0.15;
      lfoAmp.connect(swell.gain);
      lfoFilt.connect(filter.frequency);
      src.connect(filter);
      filter.connect(swell);
      swell.connect(out);
      out.gain.linearRampToValueAtTime(1, t + 4);
      lfo.start(t);
      nodes.push(lfo);
    }
    if (mood.nature === 'rain') {
      src.connect(filter);
      filter.connect(out);
    }
    out.connect(this.master);
    src.start(t, Math.random() * 6);
    this.natureStop = (when) => {
      out.gain.cancelScheduledValues(when);
      out.gain.setTargetAtTime(0, when, 0.8);
      nodes.forEach((n) => n.stop(when + 4));
    };
  }

  private startBinaural(mood: Mood, t: number) {
    const ctx = this.ctx!;
    const carrier = this.freq(mood.binauralCarrier + 12);
    const merger = ctx.createChannelMerger(2);
    const out = ctx.createGain();
    out.gain.setValueAtTime(0, t);
    out.gain.linearRampToValueAtTime(0.06, t + 3);
    const oscs = [carrier, carrier + mood.binauralBeat].map((f, ch) => {
      const o = ctx.createOscillator();
      o.frequency.value = f;
      o.connect(merger, 0, ch);
      o.start(t);
      return o;
    });
    merger.connect(out);
    out.connect(this.master);
    this.binauralStop = (when) => {
      out.gain.cancelScheduledValues(when);
      out.gain.setTargetAtTime(0, when, 0.5);
      oscs.forEach((o) => o.stop(when + 3));
    };
  }
}

export const ambient = new AmbientEngine();
