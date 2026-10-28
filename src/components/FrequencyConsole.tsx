import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  Radio,
  X,
  Volume2,
  Play,
  Pause,
  Sparkles,
  Waves,
  Target,
  Flame,
  CloudRain,
  Moon,
  Activity,
  Music,
  Leaf,
  Headphones,
  Timer,
  Info,
} from 'lucide-react';
import { RESONANCE_TRACKS } from '../data/cosmicData';
import { ambient, LayerKey } from '../audio/ambientEngine';
import { MOODS, MoodId } from '../audio/moods';

interface FrequencyConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOOD_ICONS: Record<MoodId, React.ElementType> = {
  sakin: Waves,
  odak: Target,
  motivasyon: Flame,
  huzun: CloudRain,
  uyku: Moon,
};

const LAYERS: { key: LayerKey; label: string; icon: React.ElementType }[] = [
  { key: 'pulse', label: 'Ritim', icon: Activity },
  { key: 'melody', label: 'Melodi', icon: Music },
  { key: 'nature', label: 'Doğa sesi', icon: Leaf },
  { key: 'binaural', label: 'Binaural', icon: Headphones },
];

const SLEEP_OPTIONS = [0, 15, 30, 60];

export const useAmbient = () => useSyncExternalStore(ambient.subscribe, ambient.getState);

export const FrequencyConsole: React.FC<FrequencyConsoleProps> = ({ isOpen, onClose }) => {
  const s = useAmbient();
  const [tab, setTab] = useState<'mood' | 'tone'>('mood');
  const [selectedMood, setSelectedMood] = useState<MoodId>(s.moodId);
  const [sleepMinutes, setSleepMinutes] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const mood = MOODS.find((m) => m.id === (s.mode === 'mood' ? s.moodId : selectedMood)) ?? MOODS[0];
  const moodPlaying = s.playing && s.mode === 'mood';

  useEffect(() => {
    if (s.mode === 'mood') setSelectedMood(s.moodId);
  }, [s.mode, s.moodId]);

  useEffect(() => {
    if (!s.sleepEndsAt) setSleepMinutes(0);
  }, [s.sleepEndsAt]);

  // Escape ile kapat
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Canlı görselleştirici: gerçek ses çıkışını çizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isOpen) return;
    const g = canvas.getContext('2d');
    if (!g) return;
    let raf = 0;
    let freqData: Uint8Array<ArrayBuffer> | null = null;
    let timeData: Uint8Array<ArrayBuffer> | null = null;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      const an = ambient.analyser;
      const accent = s.mode === 'tone' ? '#b000ff' : mood.accent;

      if (an && s.playing) {
        if (!freqData || freqData.length !== an.frequencyBinCount) {
          freqData = new Uint8Array(an.frequencyBinCount);
          timeData = new Uint8Array(an.fftSize);
        }
        an.getByteFrequencyData(freqData);
        an.getByteTimeDomainData(timeData!);

        // Frekans çubukları (logaritmik), ortadan aynalı
        const bars = Math.floor(w / 6);
        for (let i = 0; i < bars; i++) {
          const pos = Math.pow(i / bars, 2) * freqData.length * 0.5;
          const v = freqData[Math.floor(pos)] / 255;
          const bh = v * h * 0.45;
          g.fillStyle = accent;
          g.globalAlpha = 0.15 + v * 0.55;
          g.fillRect(i * 6, h / 2 - bh, 4, bh * 2);
        }
        g.globalAlpha = 1;

        // Dalga biçimi
        g.beginPath();
        g.strokeStyle = '#ffffff';
        g.lineWidth = 1.5;
        g.shadowColor = accent;
        g.shadowBlur = 10;
        const td = timeData!;
        for (let x = 0; x < w; x++) {
          const v = td[Math.floor((x / w) * td.length)] / 128 - 1;
          const y = h / 2 + v * h * 0.8;
          if (x === 0) g.moveTo(x, y);
          else g.lineTo(x, y);
        }
        g.stroke();
        g.shadowBlur = 0;
      } else {
        g.strokeStyle = 'rgba(255,255,255,0.2)';
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(0, h / 2);
        g.lineTo(w, h / 2);
        g.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [isOpen, s.playing, s.mode, mood.accent]);

  if (!isOpen) return null;

  const pickMood = (id: MoodId) => {
    setSelectedMood(id);
    if (s.playing) ambient.startMood(id);
  };

  const togglePlay = () => {
    if (moodPlaying) ambient.stop();
    else ambient.startMood(selectedMood);
  };

  const remaining = s.sleepEndsAt ? Math.max(0, Math.ceil((s.sleepEndsAt - Date.now()) / 60000)) : 0;

  return (
    <div
      id="frequency-modal"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#060914] border border-[#b000ff]/40 rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 shadow-[0_0_60px_rgba(176,0,255,0.25)]"
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-30 transition-colors duration-1000"
          style={{ background: s.mode === 'tone' ? '#b000ff' : mood.accent }}
        />

        {/* Başlık */}
        <div className="relative flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0e081e] border border-[#b000ff]/40">
              <Radio className={`w-5 h-5 text-[#b000ff] ${s.playing ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                Frekans & Rezonans Odası
                <Sparkles className="w-4 h-4 text-[#00f0ff]" />
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {s.tuning} Hz akortlu, canlı üretilen ambient müzik
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sekmeler */}
        <div className="relative flex gap-2 mb-5 p-1 rounded-full bg-[#03050a] border border-slate-800 w-fit">
          {(
            [
              ['mood', 'Ruh Hali Müzikleri'],
              ['tone', 'Saf Tonlar'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                tab === id ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Görselleştirici */}
        <div className="relative mb-5 p-3 rounded-2xl bg-[#03050a] border border-[#00f0ff]/20">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span style={{ color: s.mode === 'tone' ? '#c084fc' : mood.accent }}>
              {s.mode === 'tone'
                ? `Saf ton: ${s.toneFreq} Hz`
                : s.mode === 'mood'
                  ? `${mood.name} · ${mood.bpm} vuruş/dk`
                  : 'Beklemede'}
            </span>
            <span>
              {s.playing ? 'YAYINDA' : 'SESSİZ'}
              {remaining > 0 && ` · ${remaining} dk sonra kapanır`}
            </span>
          </div>
          <canvas ref={canvasRef} className="w-full h-24 block" />
        </div>

        {tab === 'mood' ? (
          <>
            {/* Ruh hali kartları */}
            <div className="relative grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
              {MOODS.map((m) => {
                const Icon = MOOD_ICONS[m.id];
                const active = selectedMood === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => pickMood(m.id)}
                    className={`p-3 rounded-xl border text-left sm:text-center transition-all cursor-pointer ${
                      active ? 'bg-[#0f0e26]' : 'bg-[#060a14]/60 border-slate-800 hover:border-slate-600'
                    } ${m.id === 'uyku' ? 'col-span-2 sm:col-span-1' : ''}`}
                    style={
                      active ? { borderColor: m.accent, boxShadow: `0 0 18px ${m.accent}55` } : undefined
                    }
                  >
                    <Icon className="w-5 h-5 mb-1.5 sm:mx-auto" style={{ color: m.accent }} />
                    <div className="font-cinzel text-sm font-bold text-white">{m.name}</div>
                  </button>
                );
              })}
            </div>

            <div className="relative mb-4 px-1">
              <div className="text-[11px] font-mono mb-1" style={{ color: mood.accent }}>
                {mood.tagline}
              </div>
              <p className="text-sm text-slate-300 font-light leading-relaxed">{mood.description}</p>
            </div>

            {/* Katmanlar */}
            <div className="relative flex flex-wrap gap-2 mb-4">
              {LAYERS.map(({ key, label, icon: Icon }) => {
                const unavailable =
                  (key === 'nature' && mood.nature === 'none') || (key === 'pulse' && mood.pulse === 'none');
                const on = s.layers[key] && !unavailable;
                return (
                  <button
                    key={key}
                    disabled={unavailable}
                    onClick={() => ambient.setLayer(key, !s.layers[key])}
                    title={key === 'binaural' ? `Kulaklıkla dinleyin: iki kulak arasında ${mood.binauralBeat} Hz fark` : undefined}
                    className={`px-3 py-1.5 rounded-full text-xs border flex items-center gap-1.5 transition-all ${
                      unavailable
                        ? 'opacity-30 cursor-not-allowed border-slate-800 text-slate-500'
                        : on
                          ? 'border-white/60 text-white bg-white/10 cursor-pointer'
                          : 'border-slate-700 text-slate-400 hover:text-white cursor-pointer'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                    {key === 'binaural' && on && <span className="font-mono text-[10px]">{mood.binauralBeat} Hz</span>}
                  </button>
                );
              })}
            </div>

            {/* Akort + zamanlayıcı */}
            <div className="relative flex flex-wrap items-center gap-x-5 gap-y-3 mb-5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span>Akort</span>
                {([432, 440] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => ambient.setTuning(t)}
                    className={`px-2.5 py-1 rounded-md font-mono cursor-pointer border ${
                      s.tuning === t ? 'border-[#00f0ff] text-[#00f0ff]' : 'border-slate-800 hover:text-white'
                    }`}
                  >
                    {t} Hz
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-3.5 h-3.5" />
                <span>Kapat</span>
                {SLEEP_OPTIONS.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setSleepMinutes(m);
                      ambient.setSleepTimer(m);
                    }}
                    className={`px-2 py-1 rounded-md font-mono cursor-pointer border ${
                      sleepMinutes === m ? 'border-[#00f0ff] text-[#00f0ff]' : 'border-slate-800 hover:text-white'
                    }`}
                  >
                    {m === 0 ? 'yok' : `${m} dk`}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {RESONANCE_TRACKS.map((track) => {
                const active = s.mode === 'tone' && s.toneFreq === track.freq;
                return (
                  <button
                    key={track.id}
                    onClick={() => (active ? ambient.stop() : ambient.startTone(track.freq))}
                    className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      active
                        ? 'bg-[#0f0e26] border-[#b000ff] shadow-[0_0_20px_rgba(176,0,255,0.3)]'
                        : 'bg-[#060a14]/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-cinzel text-sm font-bold text-white">{track.name}</span>
                      <span className="text-[11px] font-mono text-[#00f0ff] px-2 py-0.5 rounded bg-[#00f0ff]/10 flex items-center gap-1">
                        {active ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        {track.freq} Hz
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">{track.description}</p>
                  </button>
                );
              })}
            </div>
            <p className="relative text-[11px] text-slate-500 mb-5 px-1 leading-relaxed">
              Bunlar tek bir sinüs dalgasıdır. Geleneksel olarak anlam yüklenen bu tonların ruh hali üzerinde
              kendi başlarına belirgin bir etkisi bilimsel olarak gösterilmemiştir; ruh halini asıl etkileyen
              akor, ritim ve melodidir. 7.83 Hz duyulamadığı için iki kulağa farklı tonlarla (kulaklıkla) verilir.
            </p>
          </>
        )}

        {/* Oynatıcı */}
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#090e1c]/80 border border-slate-800">
          {tab === 'mood' ? (
            <button
              onClick={togglePlay}
              className="w-full sm:w-auto px-6 py-3 rounded-full font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer text-black"
              style={{ background: mood.accent, boxShadow: `0 0 22px ${mood.accent}99` }}
            >
              {moodPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {moodPlaying ? 'Durdur' : `${mood.name} müziğini başlat`}
            </button>
          ) : (
            <span className="text-xs text-slate-400">Bir tona dokunarak başlatın veya durdurun.</span>
          )}

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Volume2 className="w-4 h-4 text-slate-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={s.volume}
              onChange={(e) => ambient.setVolume(parseFloat(e.target.value))}
              className="w-full sm:w-32 accent-[#00f0ff] cursor-pointer"
              aria-label="Ses seviyesi"
            />
          </div>
        </div>

        {tab === 'mood' && (
          <p className="relative mt-4 text-[11px] text-slate-500 flex gap-2 leading-relaxed">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            Müzik tarayıcınızda her an yeniden üretilir, hiç tekrar etmez. Tıbbi bir iddia taşımaz; etkisi kişiden
            kişiye değişir. Binaural katmanı için kulaklık gerekir.
          </p>
        )}
      </div>
    </div>
  );
};
