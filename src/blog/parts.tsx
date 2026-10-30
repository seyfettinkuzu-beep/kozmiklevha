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

/** "YAZAN KOZMİK LEVHA | 30 EKİM 2026 | 6 DK" satırı */
export const Byline: React.FC<{ a: Article; date?: boolean; className?: string }> = ({ a, date = true, className = '' }) => (
  <div className={`byline flex flex-wrap items-center gap-x-3 gap-y-2 ${className}`}>
    <span>
      <i className="font-read normal-case tracking-normal text-[13.5px]">Yazan</i>{' '}
      <b className="text-ink font-semibold">{a.author}</b>
    </span>
    {date && (
      <>
        <span className="w-px h-3 bg-gold" />
        <span>{a.date}</span>
      </>
    )}
    <span className="w-px h-3 bg-gold" />
    <span>{a.readTime.replace(' okuma', '')}</span>
    <NatureBadge nature={a.nature} />
  </div>
);

/** Yatay liste satırı: solda fotoğraf, sağda etiket, başlık, özet, künye */
export const PostRow: React.FC<{ a: Article }> = ({ a }) => (
  <article className="group grid sm:grid-cols-[minmax(0,270px)_1fr] gap-4 sm:gap-7 py-7 border-b border-line">
    <a href={links.article(a.id)} className="block overflow-hidden bg-line">
      <img
        src={a.image}
        alt=""
        loading="lazy"
        className="w-full h-44 object-cover group-hover:scale-[1.03] transition-transform duration-500"
      />
    </a>
    <div>
      <Kicker a={a} />
      <a href={links.article(a.id)}>
        <h2 className="headline text-[22px] sm:text-[25px] leading-[1.12] mt-3.5 mb-2.5 group-hover:text-navy transition-colors">
          {a.title}
        </h2>
      </a>
      <p className="text-[14.5px] leading-relaxed text-body mb-4">{a.excerpt}</p>
      <Byline a={a} date={false} />
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
