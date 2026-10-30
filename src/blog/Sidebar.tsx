import React from 'react';
import { Play, Pause, ChevronDown, Rss } from 'lucide-react';
import { ARTICLES, CATEGORIES } from '../data/cosmicData';
import { MOODS } from '../audio/moods';
import { ambient } from '../audio/ambientEngine';
import { useAmbient } from '../components/FrequencyConsole';
import { links } from './router';
import { SectionTitle, useSaved } from './parts';

const GLOSSARY = [
  ['Schumann rezonansı', "Şimşeklerin Dünya ile iyonosfer arasında oluşturduğu yaklaşık 7,83 Hz'lik doğal titreşim."],
  ['Biyofoton', 'Canlı hücrelerin yaydığı, gözle görülemeyecek kadar zayıf ışık.'],
  ['Kozmik ağ', 'Galaksileri ipliksi yapılarla birbirine bağlayan dev evren dokusu.'],
  ['Nükleosentez', 'Yıldızların içinde hafif elementlerden ağır elementlerin oluşması.'],
];

// Henüz okunma verisi yok; editörün seçtiği sıra.
const POPULAR = ['neuro-web', 'schumann-resonance', 'primordial-resonance', 'cosmic-noosphere'];


const SideHead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h4 className="font-sans font-extrabold text-[23px] tracking-[-0.01em] text-ink mb-5">{children}</h4>
);

/** Konu seçici: Quanta'daki gibi bir seçim kutusu */
const TopicPicker: React.FC = () => (
  <section>
    <SideHead>Konular</SideHead>
    <label className="relative block">
      <span className="sr-only">Konu seç</span>
      <select
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) window.location.hash = links.category(e.target.value);
        }}
        className="appearance-none w-full border border-line bg-white px-4 py-3.5 pr-10 text-[15px] text-muted cursor-pointer outline-none focus:border-gold"
      >
        <option value="" disabled>
          Bir konu seç
        </option>
        {CATEGORIES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 text-muted absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
    </label>
    <a href={links.home} className="inline-block mt-4 font-sans font-extrabold text-[15px] text-ink hover:text-gold">
      Tüm yazılar
    </a>
  </section>
);

/** Kaydedilenler (yalnız bu tarayıcıda) */
const SavedList: React.FC = () => {
  const { saved } = useSaved();
  const list = saved.map((id) => ARTICLES.find((a) => a.id === id)).filter(Boolean);
  if (!list.length) return null;
  return (
    <section>
      <SideHead>Kaydettiklerin</SideHead>
      <ul>
        {list.map((a) => (
          <li key={a!.id} className="border-b border-dotted border-[#c9c3b5]">
            <a href={links.article(a!.id)} className="block py-3 font-serif font-bold text-[15px] leading-snug text-ink hover:text-navy">
              {a!.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

/** Takip: hesaplar açıldığında bağlantılar eklenecek */
const SOCIAL: { name: string; icon: React.ReactNode; href?: string }[] = [
  {
    name: 'YouTube',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" />
        <path d="M10 9l5 3-5 3z" fill="#fff" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  { name: 'X', icon: <span className="text-[13px] font-bold leading-none">𝕏</span> },
  { name: 'RSS', icon: <Rss className="w-4 h-4" /> },
];
const Follow: React.FC = () => (
  <section>
    <SideHead>Bizi takip edin</SideHead>
    <ul>
      {SOCIAL.map((x) => {
        const inner = (
          <>
            <span className="w-11 h-11 shrink-0 rounded-full border-2 border-gold text-ink grid place-items-center">{x.icon}</span>
            <span className="flex-1 flex items-center justify-between py-3 border-b-2 border-dotted border-[#cfc9bb]">
              <span className="font-sans font-bold text-[18px] text-ink">{x.name}</span>
              {!x.href && <span className="text-[11px] tracking-[0.14em] uppercase text-muted">Yakında</span>}
            </span>
          </>
        );
        return (
          <li key={x.name}>
            {x.href ? (
              <a href={x.href} target="_blank" rel="noreferrer" className="flex items-center gap-4 py-1.5 hover:opacity-80">
                {inner}
              </a>
            ) : (
              <div className="flex items-center gap-4 py-1.5 opacity-90">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  </section>
);

export const Sidebar: React.FC<{ onOpenRoom: () => void; showPopular?: boolean }> = ({ onOpenRoom, showPopular = true }) => {
  const s = useAmbient();
  const popular = POPULAR.map((id) => ARTICLES.find((a) => a.id === id)!).filter(Boolean);
  return (
    <aside className="space-y-12 lg:border-l lg:border-line lg:pl-12">
      <TopicPicker />
      <SavedList />
      {showPopular && (
        <section>
          <SectionTitle>Öne çıkanlar</SectionTitle>
          <ul>
            {popular.map((a, i) => (
              <li key={a.id} className="border-b border-line">
                <a href={links.article(a.id)} className="group grid grid-cols-[34px_1fr] gap-2 py-4">
                  <span className="font-serif font-extrabold text-[22px] leading-none text-gold">{i + 1}</span>
                  <span>
                    <span className="block font-serif font-bold text-[15.5px] leading-snug text-ink group-hover:text-navy transition-colors">
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
              <dt className="font-serif font-bold text-[15.5px] text-ink">{t}</dt>
              <dd className="text-[13.5px] leading-relaxed text-body mt-1">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Follow />

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
