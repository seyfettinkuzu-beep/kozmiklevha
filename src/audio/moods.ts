// Ruh hali tanımları: her biri akor dizisi, tempo ve katman ayarlarıyla
// tarayıcıda canlı üretilen bir ambient müzik "tarifi"dir.

export type MoodId = 'sakin' | 'odak' | 'motivasyon' | 'huzun' | 'uyku';

export type PulseStyle = 'none' | 'heartbeat' | 'soft' | 'drive';
export type NatureStyle = 'none' | 'rain' | 'waves';
export type MelodyStyle = 'bell' | 'piano';

export interface Mood {
  id: MoodId;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  bpm: number;
  barsPerChord: number;
  /** Akorlar MIDI nota numaraları olarak (en alttaki nota bas sesidir). */
  chords: number[][];
  /** Melodinin gezindiği dizi notaları (MIDI). */
  melodyScale: number[];
  melodyStyle: MelodyStyle;
  /** Her vuruşta melodi notası çalma olasılığı. */
  melodyChance: number;
  /** Sekizlik arpej (akor notalarını sırayla çalma). */
  arpeggio: boolean;
  pulse: PulseStyle;
  bassPulse: boolean;
  padBrightness: number;
  padWave: OscillatorType;
  nature: NatureStyle;
  /** Kulaklıkla dinlenen binaural ritim farkı (Hz). */
  binauralBeat: number;
  binauralCarrier: number;
  defaults: { pulse: boolean; melody: boolean; nature: boolean; binaural: boolean };
}

export const MOODS: Mood[] = [
  {
    id: 'sakin',
    name: 'Sakin',
    tagline: 'Dalga sesi · 60 vuruş · yumuşak akorlar',
    description: 'Kalp atışına yakın yavaş bir nabız, majör-7 akorlar ve uzaktan gelen çan sesleri. Gevşemek, nefes almak için.',
    accent: '#00f0ff',
    bpm: 60,
    barsPerChord: 2,
    chords: [
      [50, 57, 61, 64], // Dmaj9
      [43, 50, 54, 57, 59], // Gmaj9
      [47, 54, 57, 62], // Bm7
      [45, 52, 59, 61], // Aadd9
    ],
    melodyScale: [74, 76, 78, 81, 83, 86, 88],
    melodyStyle: 'bell',
    melodyChance: 0.22,
    arpeggio: false,
    pulse: 'heartbeat',
    bassPulse: false,
    padBrightness: 900,
    padWave: 'sawtooth',
    nature: 'waves',
    binauralBeat: 10,
    binauralCarrier: 50,
    defaults: { pulse: true, melody: true, nature: true, binaural: false },
  },
  {
    id: 'odak',
    name: 'Odak',
    tagline: 'Yağmur · 72 vuruş · düzenli arpej',
    description: 'Tekrar eden, şaşırtmayan bir arpej ve arkada yağmur. Dikkat dağıtmadan zihni meşgul tutan bir ses perdesi; çalışırken arka planda.',
    accent: '#00ff88',
    bpm: 72,
    barsPerChord: 2,
    chords: [
      [48, 55, 58, 62, 63], // Cm9
      [44, 51, 55, 60], // Abmaj7
      [51, 55, 58, 62], // Ebmaj7
      [46, 53, 60, 62], // Bbsus2
    ],
    melodyScale: [72, 75, 77, 79, 82, 84],
    melodyStyle: 'bell',
    melodyChance: 0.05,
    arpeggio: true,
    pulse: 'soft',
    bassPulse: false,
    padBrightness: 1100,
    padWave: 'triangle',
    nature: 'rain',
    binauralBeat: 14,
    binauralCarrier: 48,
    defaults: { pulse: false, melody: true, nature: true, binaural: false },
  },
  {
    id: 'motivasyon',
    name: 'Motivasyon',
    tagline: 'Davul · 112 vuruş · yükselen majör',
    description: 'Her vuruşta kick davul, sekizlik bas ve I–V–vi–IV dizisi. Spor, yürüyüş ya da güne enerjik başlamak için.',
    accent: '#f59e0b',
    bpm: 112,
    barsPerChord: 2,
    chords: [
      [52, 59, 64, 68, 71], // E
      [47, 54, 59, 63, 66], // B
      [49, 56, 61, 64, 68], // C#m
      [45, 52, 57, 59, 61], // Aadd9
    ],
    melodyScale: [76, 78, 80, 83, 85, 88, 90],
    melodyStyle: 'bell',
    melodyChance: 0.3,
    arpeggio: true,
    pulse: 'drive',
    bassPulse: true,
    padBrightness: 1800,
    padWave: 'sawtooth',
    nature: 'none',
    binauralBeat: 18,
    binauralCarrier: 52,
    defaults: { pulse: true, melody: true, nature: false, binaural: false },
  },
  {
    id: 'huzun',
    name: 'Hüzün',
    tagline: 'Yağmur · 64 vuruş · minör piyano',
    description: 'Minör akorlar ve seyrek piyano notaları. İçe dönmek, duygularla baş başa kalmak isteyenler için.',
    accent: '#b000ff',
    bpm: 64,
    barsPerChord: 2,
    chords: [
      [45, 52, 59, 60, 64], // Am(add9)
      [41, 48, 52, 57], // Fmaj7
      [48, 55, 59, 64], // Cmaj7
      [43, 50, 55, 59, 62], // G
    ],
    melodyScale: [69, 71, 72, 74, 76, 79, 81],
    melodyStyle: 'piano',
    melodyChance: 0.38,
    arpeggio: false,
    pulse: 'none',
    bassPulse: false,
    padBrightness: 750,
    padWave: 'sawtooth',
    nature: 'rain',
    binauralBeat: 6,
    binauralCarrier: 45,
    defaults: { pulse: false, melody: true, nature: true, binaural: false },
  },
  {
    id: 'uyku',
    name: 'Uyku',
    tagline: 'Okyanus · çok yavaş · koyu tonlar',
    description: 'Ritimsiz, her 20 saniyede bir değişen derin akorlar ve uzaktan dalga sesi. Zamanlayıcıyla birlikte kullanın.',
    accent: '#6366f1',
    bpm: 48,
    barsPerChord: 4,
    chords: [
      [41, 48, 52, 55, 57], // Fmaj9
      [38, 45, 48, 52, 53], // Dm9
      [46, 53, 57, 62], // Bbmaj7
      [48, 55, 62, 65], // Csus
    ],
    melodyScale: [77, 79, 81, 84, 86],
    melodyStyle: 'bell',
    melodyChance: 0.07,
    arpeggio: false,
    pulse: 'none',
    bassPulse: false,
    padBrightness: 550,
    padWave: 'sawtooth',
    nature: 'waves',
    binauralBeat: 4,
    binauralCarrier: 41,
    defaults: { pulse: false, melody: true, nature: true, binaural: false },
  },
];

export const getMood = (id: MoodId): Mood => MOODS.find((m) => m.id === id) ?? MOODS[0];
