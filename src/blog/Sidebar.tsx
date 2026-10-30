import React from 'react';
import { Radio, Play, Pause } from 'lucide-react';
import { ARTICLES, CATEGORIES } from '../data/cosmicData';
import { MOODS } from '../audio/moods';
import { ambient } from '../audio/ambientEngine';
import { useAmbient } from '../components/FrequencyConsole';
import { links } from './router';
import { NATURE } from './parts';

export const Sidebar: React.FC<{ onOpenRoom: () => void }> = ({ onOpenRoom }) => {
  const s = useAmbient();
  return (
    <aside className="space-y-6">
      {/* Frekans odası kartı */}
      <section className="rounded-2xl bg-ink text-paper p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#d9c49a] mb-2">
          <Radio className="w-3.5 h-3.5" />
          Frekans Odası
        </div>
        <p className="font-serif text-lg leading-snug mb-1">Okurken eşlik etsin.</p>
        <p className="text-sm text-paper/70 mb-4">Ruh haline göre canlı üretilen ambient müzik.</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {MOODS.map((m) => {
            const on = s.playing && s.mode === 'mood' && s.moodId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => (on ? ambient.stop() : ambient.startMood(m.id))}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border cursor-pointer transition-colors ${
                  on ? 'bg-paper text-ink border-paper' : 'border-paper/25 text-paper/85 hover:border-paper/60'
                }`}
              >
                {on ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {m.name}
              </button>
            );
          })}
        </div>
        <button onClick={onOpenRoom} className="text-xs text-[#d9c49a] hover:underline cursor-pointer">
          Odayı aç, katmanları ayarla →
        </button>
      </section>

      {/* Kategoriler */}
      <section className="rounded-2xl bg-card border border-line p-5">
        <h4 className="font-serif text-lg text-ink mb-3">Konular</h4>
        <ul className="space-y-1">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <a
                href={links.category(c.id)}
                className="flex items-center justify-between py-1.5 text-sm text-body hover:text-ink"
              >
                <span>{c.name}</span>
                <span className="text-xs text-muted">{ARTICLES.filter((a) => a.categoryId === c.id).length}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Etiketlerin anlamı */}
      <section className="rounded-2xl bg-card border border-line p-5">
        <h4 className="font-serif text-lg text-ink mb-3">Etiketler ne anlatıyor?</h4>
        <ul className="space-y-3">
          {Object.values(NATURE).map((n) => (
            <li key={n.label} className="text-sm">
              <span className={`inline-flex px-2 py-0.5 rounded-full border text-[11px] font-medium mb-1 ${n.cls}`}>
                {n.label}
              </span>
              <p className="text-body/90 leading-relaxed text-[13px]">{n.hint}</p>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
};
