import React from 'react';
import { Play, Pause } from 'lucide-react';
import { ARTICLES } from '../data/cosmicData';
import { MOODS } from '../audio/moods';
import { ambient } from '../audio/ambientEngine';
import { useAmbient } from '../components/FrequencyConsole';
import { links } from './router';
import { SectionTitle } from './parts';

const GLOSSARY = [
  ['Schumann rezonansı', "Şimşeklerin Dünya ile iyonosfer arasında oluşturduğu yaklaşık 7,83 Hz'lik doğal titreşim."],
  ['Biyofoton', 'Canlı hücrelerin yaydığı, gözle görülemeyecek kadar zayıf ışık.'],
  ['Kozmik ağ', 'Galaksileri ipliksi yapılarla birbirine bağlayan dev evren dokusu.'],
  ['Nükleosentez', 'Yıldızların içinde hafif elementlerden ağır elementlerin oluşması.'],
];

// Henüz okunma verisi yok; editörün seçtiği sıra.
const POPULAR = ['neuro-web', 'schumann-resonance', 'primordial-resonance', 'cosmic-noosphere'];

export const Sidebar: React.FC<{ onOpenRoom: () => void; showPopular?: boolean }> = ({ onOpenRoom, showPopular = true }) => {
  const s = useAmbient();
  const popular = POPULAR.map((id) => ARTICLES.find((a) => a.id === id)!).filter(Boolean);
  return (
    <aside className="space-y-10">
      {showPopular && (
        <section>
          <SectionTitle>Öne çıkanlar</SectionTitle>
          <ul>
            {popular.map((a, i) => (
              <li key={a.id} className="border-b border-line">
                <a href={links.article(a.id)} className="group grid grid-cols-[34px_1fr] gap-2 py-4">
                  <span className="font-serif font-extrabold text-[26px] leading-none text-gold">{i + 1}</span>
                  <span>
                    <span className="block font-serif font-bold text-[17px] leading-snug text-ink group-hover:text-navy transition-colors">
                      {a.title}
                    </span>
                    <span className="byline block mt-1.5">{a.categoryName}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <SectionTitle>Kozmik sözlük</SectionTitle>
        <dl>
          {GLOSSARY.map(([t, d]) => (
            <div key={t} className="mt-4">
              <dt className="font-serif font-bold text-[17px] text-ink">{t}</dt>
              <dd className="text-[13.5px] leading-relaxed text-body mt-1">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-night text-[#efe8da] p-6 rounded-[4px]">
        <div className="text-[11px] tracking-[0.2em] uppercase font-bold text-[#c9a96b]">Frekans Odası</div>
        <div className="flex items-end gap-[3px] h-9 my-3" aria-hidden>
          {[30, 70, 45, 90, 55, 75, 40, 85, 50, 65, 35, 60].map((h, i) => (
            <i key={i} className="flex-1 bg-[#c9a96b]/85" style={{ height: `${h}%` }} />
          ))}
        </div>
        <p className="font-serif text-xl">Okurken eşlik etsin.</p>
        <p className="text-[12.5px] text-[#a9a294] mt-1 mb-4">Ruh haline göre canlı üretilen ambient müzik.</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {MOODS.map((m) => {
            const on = s.playing && s.mode === 'mood' && s.moodId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => (on ? ambient.stop() : ambient.startMood(m.id))}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border cursor-pointer transition-colors ${
                  on ? 'bg-[#efe8da] text-night border-[#efe8da]' : 'border-[#efe8da]/25 text-[#efe8da]/85 hover:border-[#efe8da]/60'
                }`}
              >
                {on ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {m.name}
              </button>
            );
          })}
        </div>
        <button onClick={onOpenRoom} className="text-xs text-[#c9a96b] hover:underline cursor-pointer">
          Odayı aç, katmanları ayarla →
        </button>
      </section>
    </aside>
  );
};
