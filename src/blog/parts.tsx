import React from 'react';
import { Article, CategoryId } from '../types';
import { links } from './router';

export const CAT_COLOR: Record<CategoryId, string> = {
  neuro: '#3f63b5',
  biology: '#3f8a5f',
  resonance: '#7a5cc4',
  alchemy: '#c08a2e',
};

export const NATURE: Record<NonNullable<Article['nature']>, { label: string; hint: string; cls: string }> = {
  bilim: {
    label: 'Bilim',
    hint: 'Bilim dünyasında yerleşik, ölçülmüş ve doğrulanmış bilgiler.',
    cls: 'bg-[#e7f2ea] text-[#2f6b47]',
  },
  yorum: {
    label: 'Bilim + Yorum',
    hint: 'Gerçek bir bilimsel bulgudan yola çıkar, ama yorum ve yorumdan doğan iddialar henüz kanıtlanmış değildir.',
    cls: 'bg-[#e9edf8] text-[#33509a]',
  },
  dusunce: {
    label: 'Düşünce',
    hint: 'Felsefi, spekülatif ya da inanç temelli fikirler. Merak ve tefekkür için; bilimsel kanıt iddiası taşımaz.',
    cls: 'bg-[#f7eedb] text-[#8a6420]',
  },
};

export const NatureBadge: React.FC<{ nature?: Article['nature']; className?: string }> = ({ nature, className = '' }) => {
  if (!nature) return null;
  const n = NATURE[nature];
  return (
    <span
      title={n.hint}
      className={`inline-flex items-center px-2 py-[3px] rounded-[3px] text-[10.5px] font-bold uppercase tracking-[0.08em] ${n.cls} ${className}`}
    >
      {n.label}
    </span>
  );
};

/** Konu etiketi: büyük harf, altında konunun renginde kalın çizgi */
export const Kicker: React.FC<{ a: Pick<Article, 'categoryId' | 'categoryName'>; link?: boolean }> = ({ a, link = true }) => {
  const inner = (
    <span className="kicker" style={{ color: CAT_COLOR[a.categoryId] }}>
      <span>{a.categoryName}</span>
    </span>
  );
  return link ? (
    <a href={links.category(a.categoryId)} className="hover:opacity-80 transition-opacity">
      {inner}
    </a>
  ) : (
    inner
  );
};

/** Kaydedilen yazılar (yalnız bu tarayıcıda) */
const SAVED_KEY = 'kl-kaydedilenler';
const readSaved = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
  } catch {
    return [];
  }
};
export const useSaved = () => {
  const [saved, setSaved] = React.useState<string[]>(readSaved);
  React.useEffect(() => {
    const on = () => setSaved(readSaved());
    window.addEventListener('kl-saved', on);
    return () => window.removeEventListener('kl-saved', on);
  }, []);
  const toggle = (id: string) => {
    const next = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id];
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    } catch {
      /* depolama kapalıysa yalnız bu oturumda tut */
    }
    setSaved(next);
    window.dispatchEvent(new Event('kl-saved'));
  };
  return { saved, toggle };
};

export const SaveButton: React.FC<{ id: string }> = ({ id }) => {
  const { saved, toggle } = useSaved();
  const on = saved.includes(id);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggle(id);
      }}
      aria-label={on ? 'Kaydedilenlerden çıkar' : 'Sonra okumak için kaydet'}
      title={on ? 'Kaydedildi' : 'Sonra oku'}
      className="inline-flex items-center cursor-pointer text-ink hover:text-gold transition-colors"
    >
      <svg width="11" height="13" viewBox="0 0 11 13" aria-hidden>
        <path d="M1 1h9v11L5.5 9 1 12z" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

const Bar = () => <span className="w-[1.5px] h-3.5 bg-gold" />;

/** "Yazan KOZMİK LEVHA | 30 EKİM 2026 | 6 DK | [kaydet]" satırı */
export const Byline: React.FC<{ a: Article; date?: boolean; className?: string; save?: boolean }> = ({
  a,
  date = true,
  className = '',
  save = true,
}) => (
  <div className={`byline flex flex-wrap items-center gap-x-3 gap-y-2 ${className}`}>
    <span>
      <i className="font-read normal-case tracking-normal text-[13.5px] text-ink">Yazan</i>{' '}
      <span>{a.author}</span>
    </span>
    {date && (
      <>
        <Bar />
        <span>{a.date}</span>
      </>
    )}
    <Bar />
    <span>{a.readTime.replace(' okuma', '')}</span>
    {save && (
      <>
        <Bar />
        <SaveButton id={a.id} />
      </>
    )}
    <NatureBadge nature={a.nature} className="ml-1" />
  </div>
);

/** Yatay liste satırı: solda fotoğraf; sağda etiket, başlık, künye, özet */
export const PostRow: React.FC<{ a: Article }> = ({ a }) => (
  <article className="group grid sm:grid-cols-[minmax(0,46%)_1fr] gap-5 sm:gap-8 py-8 first:pt-6">
    <a href={links.article(a.id)} className="block overflow-hidden bg-line self-start">
      <img
        src={a.image}
        alt=""
        loading="lazy"
        className="w-full aspect-[16/9] object-cover group-hover:scale-[1.03] transition-transform duration-500"
      />
    </a>
    <div>
      <Kicker a={a} />
      <a href={links.article(a.id)}>
        <h2 className="headline text-[22px] sm:text-[25px] leading-[1.15] mt-3.5 mb-3 group-hover:text-navy transition-colors">
          {a.title}
        </h2>
      </a>
      <Byline a={a} />
      <p className="text-[15px] leading-[1.75] text-body mt-3.5">{a.excerpt}</p>
    </div>
  </article>
);

/** Dikey kart (üçlü sıralar için) */
export const PostCard: React.FC<{ a: Article }> = ({ a }) => (
  <article className="group">
    <a href={links.article(a.id)} className="block overflow-hidden bg-line mb-4">
      <img
        src={a.image}
        alt=""
        loading="lazy"
        className="w-full h-40 object-cover group-hover:scale-[1.03] transition-transform duration-500"
      />
    </a>
    <Kicker a={a} />
    <a href={links.article(a.id)}>
      <h3 className="headline text-[19px] leading-[1.18] mt-3 mb-2 group-hover:text-navy transition-colors">
        {a.title}
      </h3>
    </a>
    <p className="text-[14px] leading-relaxed text-body mb-3 line-clamp-3">{a.excerpt}</p>
    <Byline a={a} date={false} />
  </article>
);

export const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`text-[13px] tracking-[0.2em] uppercase font-bold text-ink border-t-[3px] border-ink pt-3 ${className}`}>
    {children}
  </div>
);

/** Logosuz yazı markası */
export const Wordmark: React.FC<{ size?: 'lg' | 'sm'; light?: boolean }> = ({ size = 'lg', light = false }) => (
  <span className={`whitespace-nowrap ${size === 'lg' ? 'text-[20px] sm:text-[22px]' : 'text-[17px]'}`}>
    <span className={`font-cinzel font-bold tracking-[0.1em] ${light ? 'text-[#f3ecdf]' : 'text-ink'}`}>KOZMİK</span>{' '}
    <span className="font-['Cormorant_Garamond'] italic font-medium text-gold" style={{ fontSize: '1.05em' }}>
      levha
    </span>
  </span>
);
