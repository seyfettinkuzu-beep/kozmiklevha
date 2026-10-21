import React, { useState, useEffect, useRef } from 'react';
import { Radio, X, Volume2, Play, Pause, Activity, Sparkles } from 'lucide-react';
import { RESONANCE_TRACKS } from '../data/cosmicData';
import { ResonanceTrack } from '../types';

interface FrequencyConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FrequencyConsole: React.FC<FrequencyConsoleProps> = ({ isOpen, onClose }) => {
  const [selectedTrack, setSelectedTrack] = useState<ResonanceTrack>(RESONANCE_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);

  // Web Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize and update Web Audio synth
  useEffect(() => {
    if (!isPlaying) {
      if (oscRef.current && gainRef.current) {
        try {
          const now = audioCtxRef.current ? audioCtxRef.current.currentTime : 0;
          gainRef.current.gain.setTargetAtTime(0, now, 0.08);
          setTimeout(() => {
            if (oscRef.current) {
              oscRef.current.stop();
              oscRef.current.disconnect();
              oscRef.current = null;
            }
          }, 120);
        } catch {
          // ignore cleanup errors
        }
      }
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // If already playing, stop previous oscillator
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // If frequency is very low (e.g. 7.83 Hz), play a pleasant carrier (136.1 Hz Ohm tone) modulated by 7.83Hz
      if (selectedTrack.freq < 20) {
        osc.frequency.setValueAtTime(136.1, ctx.currentTime); // Earth tone carrier
      } else {
        osc.frequency.setValueAtTime(selectedTrack.freq, ctx.currentTime);
      }

      osc.type = 'sine';

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.setTargetAtTime(volume, ctx.currentTime, 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
    } catch (e) {
      console.error('Web Audio init error:', e);
    }

    return () => {
      // cleanup on unmount
    };
  }, [isPlaying, selectedTrack]);

  // Update volume
  useEffect(() => {
    if (gainRef.current && audioCtxRef.current && isPlaying) {
      gainRef.current.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.05);
    }
  }, [volume, isPlaying]);

  // Clean up audio on close
  useEffect(() => {
    if (!isOpen && isPlaying) {
      setIsPlaying(false);
    }
  }, [isOpen]);

  // Canvas wave visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isOpen) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 400);
      const height = (canvas.height = 100);

      ctx.clearRect(0, 0, width, height);

      // Center baseline
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      if (isPlaying) {
        // Draw primary resonant sine wave
        ctx.beginPath();
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 12;

        const waveFreq = selectedTrack.freq > 100 ? (selectedTrack.freq / 80) : 4;
        const amplitude = Math.min(35, volume * 90);

        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * 0.035 * (waveFreq / 4) + phase) * amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Secondary harmonic wave in purple
        ctx.beginPath();
        ctx.strokeStyle = '#b000ff';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#b000ff';
        ctx.shadowBlur = 8;
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.cos(x * 0.05 * (waveFreq / 4) - phase * 1.5) * (amplitude * 0.6);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        phase += 0.08;
      } else {
        // Flat resting line
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isOpen, isPlaying, selectedTrack, volume]);

  if (!isOpen) return null;

  return (
    <div
      id="frequency-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
    >
      <div className="relative w-full max-w-2xl bg-[#060914] border border-[#b000ff]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(176,0,255,0.25)] overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#b000ff]/20 via-[#00f0ff]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0e081e] border border-[#b000ff]/40 shadow-[0_0_15px_rgba(176,0,255,0.3)]">
              <Radio className="w-5 h-5 text-[#b000ff] animate-pulse" />
            </div>
            <div>
              <h3 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
                Frekans & Rezonans Odası
                <Sparkles className="w-4 h-4 text-[#00f0ff]" />
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Biyo-elektromanyetik Armonik Dalga Sentezleyicisi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Waveform Visualizer */}
        <div className="mb-6 p-4 rounded-2xl bg-[#03050a] border border-[#00f0ff]/25 relative overflow-hidden shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 text-[#00f0ff]">
              <Activity className="w-3.5 h-3.5" />
              Canlı Dalga Biçimi: {selectedTrack.freq} Hz
            </span>
            <span>{isPlaying ? 'REZONANS AKTİF' : 'BEKLEMEDE'}</span>
          </div>

          <div className="w-full h-24 flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>
        </div>

        {/* Track Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {RESONANCE_TRACKS.map((track) => {
            const isSelected = selectedTrack.id === track.id;
            return (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0f0e26] border-[#b000ff] shadow-[0_0_20px_rgba(176,0,255,0.3)]'
                    : 'bg-[#060a14]/60 border-slate-800 hover:border-slate-700 hover:bg-[#090f1f]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-cinzel text-sm font-bold text-white">
                    {track.name}
                  </span>
                  <span className="text-[11px] font-mono text-[#00f0ff] px-2 py-0.5 rounded bg-[#00f0ff]/10">
                    {track.freq} Hz
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-light">
                  {track.description}
                </p>
                <div className="mt-2 text-[10px] font-mono text-purple-300">
                  {track.harmonicNote}
                </div>
              </button>
            );
          })}
        </div>

        {/* Player Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#090e1c]/80 border border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-5 py-2.5 rounded-full font-medium text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-[#00ff88] text-black font-semibold shadow-[0_0_20px_rgba(0,255,136,0.6)]'
                  : 'bg-[#00f0ff] text-black font-semibold shadow-[0_0_20px_rgba(0,240,255,0.6)]'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Titreşimi Duraklat' : 'Frekansı Başlat'}</span>
            </button>

            <span className="text-xs font-mono text-slate-400">
              {isPlaying ? 'Saf Sinüs Dalga Akordu' : 'Oynatmaya Hazır'}
            </span>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Volume2 className="w-4 h-4 text-slate-400" />
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full sm:w-28 accent-[#00f0ff] cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-400 w-8">
              {Math.round(volume * 200)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
