import React from 'react';
import { Clock } from 'lucide-react';
import { Article } from '../types';
import { links } from './router';

export const NATURE: Record<NonNullable<Article['nature']>, { label: string; hint: string; cls: string }> = {
  bilim: {
    label: 'Bilim',
    hint: 'Bilim dünyasında yerleşik, ölçülmüş ve doğrulanmış bilgiler.',
    cls: 'bg-sage/10 text-sage border-sage/30',
  },
  yorum: {
    label: 'Bilim + Yorum',
    hint: 'Gerçek bir bilimsel bulgudan yola çıkar, ama yorum ve yorumdan doğan iddialar henüz kanıtlanmış değildir.',
    cls: 'bg-navy/10 text-navy border-navy/25',
  },
  dusunce: {
    label: 'Düşünce',
    hint: 'Felsefi, spekülatif ya da inanç temelli fikirler. Merak ve tefekkür için; bilimsel kanıt iddiası taşımaz.',
    cls: 'bg-gold/10 text-gold border-gold/30',
  },
};

export const NatureBadge: React.FC<{ nature?: Article['nature']; className?: string }> = ({ nature, className = '' }) => {
  if (!nature) return null;
  const n = NATURE[nature];
  return (
    <span
      title={n.hint}
      className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium ${n.cls} ${className}`}
    >
      {n.label}
    </span>
  );
};

export const Meta: React.FC<{ a: Article }> = ({ a }) => (
  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
    <span>{a.date}</span>
    <span className="w-1 h-1 rounded-full bg-line" />
    <span className="inline-flex items-center gap-1">
      <Clock className="w-3 h-3" />
      {a.readTime}
    </span>
  </div>
);

export const CategoryLink: React.FC<{ a: Article }> = ({ a }) => (
  <a
    href={links.category(a.categoryId)}
    className="text-[11px] font-semibold uppercase tracking-wider text-gold hover:text-ink transition-colors"
  >
    {a.categoryName}
  </a>
);

/** Liste kartı (dikey) */
export const PostCard: React.FC<{ a: Article }> = ({ a }) => (
  <article className="group flex flex-col bg-card border border-line rounded-2xl overflow-hidden hover:border-gold/50 hover:shadow-[0_8px_30px_-12px_rgba(31,36,51,0.18)] transition-all">
    <a href={links.article(a.id)} className="block aspect-[16/10] overflow-hidden bg-line/40">
      <img
        src={a.image}
        alt=""
        loading="lazy"
        className="w-full h-full object-cover saturate-[0.7] group-hover:scale-[1.03] transition-transform duration-500"
      />
    </a>
    <div className="flex flex-col flex-1 p-5">
      <div className="flex items-center justify-between gap-2 mb-2">
        <CategoryLink a={a} />
        <NatureBadge nature={a.nature} />
      </div>
      <a href={links.article(a.id)} className="block">
        <h3 className="font-serif text-xl leading-snug font-semibold text-ink group-hover:text-navy transition-colors mb-2">
          {a.title}
        </h3>
      </a>
      <p className="text-sm text-body leading-relaxed line-clamp-3 mb-4">{a.excerpt}</p>
      <div className="mt-auto">
        <Meta a={a} />
      </div>
    </div>
  </article>
);

/** Kenar listesi için küçük satır */
export const PostRow: React.FC<{ a: Article; index?: number }> = ({ a, index }) => (
  <a href={links.article(a.id)} className="group flex gap-3 py-3 border-b border-line last:border-0">
    {index !== undefined && (
      <span className="font-serif text-2xl leading-none text-gold/70 w-6 shrink-0">{index + 1}</span>
    )}
    <div>
      <div className="font-serif text-[15px] leading-snug text-ink group-hover:text-navy transition-colors">
        {a.title}
      </div>
      <div className="text-[11px] text-muted mt-1">{a.categoryName}</div>
    </div>
  </a>
);
