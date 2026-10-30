import React from 'react';
import { Waves, Target, Flame, CloudRain, Moon, Play, Pause, Ear } from 'lucide-react';
import { MOODS, MoodId } from '../audio/moods';
import { ambient } from '../audio/ambientEngine';
import { useAmbient } from './FrequencyConsole';

const ICONS: Record<MoodId, React.ElementType> = {
  sakin: Waves,
  odak: Target,
  motivasyon: Flame,
  huzun: CloudRain,
  uyku: Moon,
};

interface MoodSectionProps {
  onOpenConsole: () => void;
}

export const MoodSection: React.FC<MoodSectionProps> = ({ onOpenConsole }) => {
  const s = useAmbient();

  const listen = (id: MoodId) => {
    if (s.playing && s.mode === 'mood' && s.moodId === id) {
      ambient.stop();
      return;
    }
    ambient.startMood(id);
    onOpenConsole();
  };

  return (
    <section id="seslerin-tesiri" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[#cdb88a] uppercase mb-3">
          <Ear className="w-3.5 h-3.5" />
          <span>Sesin İnsana Tesiri</span>
        </div>
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white tracking-wide mb-4">
          Bir şarkı seni neden ağlatır, neden koşturur?
        </h2>
        <div className="space-y-3 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
          <p>
            Tek bir ses tonu, ne kadar özel bir frekansta olursa olsun, kulağa düz bir uğultu gibi gelir. Bizi
            ağlatan, coşturan ya da sakinleştiren şey seslerin <em>kendisi</em> değil, birbirleriyle kurdukları{' '}
            <strong className="text-white font-medium">ilişkidir</strong>.
          </p>
          <p>
            <strong className="text-white font-medium">Tempo</strong> kalbe ve adıma eşlik eder: yavaş ritim
            gevşetir, hızlı ritim harekete geçirir. <strong className="text-white font-medium">Akorlar</strong>{' '}
            duyguya renk verir: majör aydınlık, minör hüzünlü gelir.{' '}
            <strong className="text-white font-medium">Beklenti</strong> ise en güçlü olanıdır: beyin bir sonraki
            notayı tahmin eder, müzik o beklentiyi bir süre bekletip çözdüğünde tüyler diken diken olur.
          </p>
          <p>
            Aşağıdaki beş ses ortamı bu ilkelerle, tarayıcında canlı olarak üretilir. Birini seç, kulaklığını tak
            ve birkaç dakika ver.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {MOODS.map((m) => {
          const Icon = ICONS[m.id];
          const playing = s.playing && s.mode === 'mood' && s.moodId === m.id;
          return (
            <article
              key={m.id}
              className="group relative flex flex-col rounded-2xl p-5 bg-[#060a14]/80 border border-slate-800 backdrop-blur-md transition-all hover:-translate-y-1"
              style={playing ? { borderColor: m.accent, boxShadow: `0 0 28px ${m.accent}44` } : undefined}
            >
              <div
                className="absolute inset-x-0 top-0 h-24 rounded-t-2xl opacity-20 pointer-events-none"
                style={{ background: `linear-gradient(180deg, ${m.accent}, transparent)` }}
              />
              <Icon className="relative w-6 h-6 mb-3" style={{ color: m.accent }} />
              <h3 className="relative font-cinzel text-lg font-bold text-white">{m.name}</h3>
              <div className="relative text-[11px] font-mono mb-3" style={{ color: m.accent }}>
                {m.effectTitle}
              </div>
              <p className="relative text-xs text-slate-300 font-light leading-relaxed mb-4">{m.effects[0].text}</p>
              <blockquote className="relative mt-auto mb-4 pl-3 border-l-2 text-sm text-slate-200 italic leading-snug" style={{ borderColor: m.accent }}>
                {m.words[0]}
              </blockquote>
              <button
                onClick={() => listen(m.id)}
                className="relative w-full py-2.5 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all"
                style={
                  playing
                    ? { background: m.accent, color: '#000' }
                    : { border: `1px solid ${m.accent}88`, color: m.accent }
                }
              >
                {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {playing ? 'Durdur' : 'Dinle'}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
};
