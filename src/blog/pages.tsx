import React, { useMemo, useState } from 'react';
import { ArrowLeft, Link2, Check, MessageCircle } from 'lucide-react';
import { ARTICLES, CATEGORIES } from '../data/cosmicData';
import { Article } from '../types';
import { links } from './router';
import { CategoryLink, Meta, NatureBadge, NATURE, PostCard } from './parts';
import { Sidebar } from './Sidebar';

const norm = (t: string) =>
  t
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i');

// ---------- Ana sayfa ----------
export const HomePage: React.FC<{ query: string; onOpenRoom: () => void }> = ({ query, onOpenRoom }) => {
  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = norm(query);
    return ARTICLES.filter((a) =>
      norm([a.title, a.excerpt, a.tag, a.categoryName, ...a.content, ...a.highlights].join(' ')).includes(q),
    );
  }, [query]);

  if (results) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-serif text-2xl text-ink mb-1">“{query}” için sonuçlar</h1>
        <p className="text-sm text-muted mb-8">{results.length} yazı bulundu</p>
        {results.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((a) => (
              <PostCard key={a.id} a={a} />
            ))}
          </div>
        ) : (
          <p className="text-body">Bu kelimeyle eşleşen bir yazı yok. Başka bir kelime deneyin.</p>
        )}
      </div>
    );
  }

  const [featured, ...rest] = ARTICLES;
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Karşılama */}
      <section className="py-10 sm:py-14 border-b border-line text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Nöronlardan galaksilere</p>
        <h1 className="font-serif text-3xl sm:text-5xl text-ink leading-tight max-w-3xl mx-auto">
          Evrenin ve zihnin gizli bağlarını araştırıyoruz.
        </h1>
        <p className="text-body mt-4 max-w-2xl mx-auto leading-relaxed">
          Kozmik ağdan beyin dalgalarına, yıldız tozundan sesin insana tesirine: merak uyandıran bilgiler, sade bir
          dille ve neyin kanıtlanmış, neyin yorum olduğunu belirterek.
        </p>
      </section>

      {/* Öne çıkan yazı */}
      <section className="py-10">
        <a
          href={links.article(featured.id)}
          className="group grid md:grid-cols-[1.25fr_1fr] gap-6 md:gap-10 items-center"
        >
          <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-line/40">
            <img
              src={featured.image}
              alt=""
              className="w-full h-full object-cover saturate-[0.7] group-hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gold">Öne çıkan</span>
              <NatureBadge nature={featured.nature} />
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl leading-tight text-ink group-hover:text-navy transition-colors mb-3">
              {featured.title}
            </h2>
            <p className="text-body leading-relaxed mb-4">{featured.excerpt}</p>
            <Meta a={featured} />
          </div>
        </a>
      </section>

      {/* Son yazılar + kenar */}
      <section className="pb-16 grid lg:grid-cols-[1fr_300px] gap-10">
        <div>
          <h2 className="font-serif text-2xl text-ink mb-6 pb-3 border-b border-line">Son Yazılar</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {rest.map((a) => (
              <PostCard key={a.id} a={a} />
            ))}
          </div>
        </div>
        <Sidebar onOpenRoom={onOpenRoom} />
      </section>
    </div>
  );
};

// ---------- Kategori ----------
export const CategoryPage: React.FC<{ id: string; onOpenRoom: () => void }> = ({ id, onOpenRoom }) => {
  const cat = CATEGORIES.find((c) => c.id === id);
  const list = ARTICLES.filter((a) => a.categoryId === id);
  if (!cat) return <NotFound />;
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <header className="mb-10 pb-8 border-b border-line max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-gold mb-2">Konu</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink mb-2">{cat.name}</h1>
        <p className="font-serif italic text-lg text-body mb-3">{cat.subtitle}</p>
        <p className="text-body leading-relaxed">{cat.description}</p>
      </header>
      <div className="grid lg:grid-cols-[1fr_300px] gap-10">
        <div className="grid sm:grid-cols-2 gap-6 content-start">
          {list.map((a) => (
            <PostCard key={a.id} a={a} />
          ))}
        </div>
        <Sidebar onOpenRoom={onOpenRoom} />
      </div>
    </div>
  );
};

// ---------- Yazı ----------
const ShareBar: React.FC<{ a: Article }> = ({ a }) => {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;
  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${a.title} — ${url}`)}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line text-sm text-body hover:border-sage hover:text-sage"
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp
      </a>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            /* pano erişimi yoksa sessiz geç */
          }
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line text-sm text-body hover:border-navy hover:text-navy cursor-pointer"
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
        {copied ? 'Kopyalandı' : 'Linki kopyala'}
      </button>
    </div>
  );
};

export const ArticlePage: React.FC<{ id: string }> = ({ id }) => {
  const a = ARTICLES.find((x) => x.id === id);
  if (!a) return <NotFound />;
  const related = ARTICLES.filter((x) => x.id !== a.id && x.categoryId === a.categoryId)
    .concat(ARTICLES.filter((x) => x.id !== a.id && x.categoryId !== a.categoryId))
    .slice(0, 3);
  const nature = a.nature ? NATURE[a.nature] : null;

  return (
    <article className="pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
        <a href={links.home} className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink mb-6">
          <ArrowLeft className="w-4 h-4" /> Tüm yazılar
        </a>
        <div className="flex items-center gap-3 mb-4">
          <CategoryLink a={a} />
          <NatureBadge nature={a.nature} />
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl leading-[1.15] text-ink mb-4">{a.title}</h1>
        <p className="font-serif text-lg sm:text-xl text-body leading-relaxed mb-6">{a.excerpt}</p>
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-line">
          <div className="text-sm">
            <span className="text-ink font-medium">{a.author}</span>
            <div className="mt-1">
              <Meta a={a} />
            </div>
          </div>
          <ShareBar a={a} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 my-8">
        <img src={a.image} alt="" className="w-full aspect-[16/8] object-cover rounded-2xl saturate-[0.7]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {nature && (
          <div className="mb-8 p-4 rounded-xl border border-line bg-card text-sm text-body flex gap-3">
            <NatureBadge nature={a.nature} className="shrink-0 h-fit" />
            <span>{nature.hint}</span>
          </div>
        )}

        <div className="reading">
          {a.content.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <aside className="my-10 p-6 rounded-2xl bg-card border border-line">
          <h3 className="font-serif text-lg text-ink mb-3">Kısaca</h3>
          <ul className="space-y-2.5">
            {a.highlights.map((h, i) => (
              <li key={i} className="flex gap-3 text-[15px] text-body leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-t border-line">
          <span className="text-sm text-muted">
            Etiket: <span className="text-body">{a.tag}</span>
          </span>
          <ShareBar a={a} />
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
        <h2 className="font-serif text-2xl text-ink mb-6 pb-3 border-b border-line">Bunları da okuyun</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((r) => (
            <PostCard key={r.id} a={r} />
          ))}
        </div>
      </section>
    </article>
  );
};

// ---------- Hakkında ----------
export const AboutPage: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
    <p className="text-xs uppercase tracking-[0.2em] text-gold mb-2">Hakkında</p>
    <h1 className="font-serif text-3xl sm:text-4xl text-ink mb-6">Kozmik Levha nedir?</h1>
    <div className="reading">
      <p>
        Kozmik Levha, evrenle zihin arasındaki şaşırtıcı benzerlikleri, sesin ve frekansın insana tesirini, yıldızlardan
        hücrelerimize uzanan gizli bağları merak eden herkes için bir defter. Burada gizemli ve ilginç bilgileri
        araştırıp sade bir dille paylaşıyoruz.
      </p>
      <p>
        Merakın en iyi dostu dürüstlüktür. Bu yüzden her yazının üzerinde bir etiket var: <strong>Bilim</strong>{' '}
        yerleşik ve ölçülmüş bilgileri, <strong>Bilim + Yorum</strong> gerçek bir bulgudan yola çıkan ama henüz
        kanıtlanmamış yorumları, <strong>Düşünce</strong> ise felsefi ve spekülatif fikirleri anlatır. Böylece hayret
        ederken neyin gerçek, neyin ihtimal olduğunu bilirsiniz.
      </p>
      <p>
        Okurken eşlik etmesi için bir de Frekans Odası hazırladık: ruh halinize göre tarayıcınızda canlı üretilen
        ambient müzikler. Sağ üstteki düğmeden açabilirsiniz.
      </p>
    </div>
    <a href={links.home} className="inline-flex items-center gap-1 text-sm text-navy hover:underline mt-4">
      <ArrowLeft className="w-4 h-4" /> Yazılara dön
    </a>
  </div>
);

const NotFound: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 py-20 text-center">
    <h1 className="font-serif text-3xl text-ink mb-3">Bu sayfa bulunamadı</h1>
    <a href={links.home} className="text-navy hover:underline">
      Ana sayfaya dön
    </a>
  </div>
);

export const SiteFooter: React.FC = () => (
  <footer className="border-t border-line bg-card">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row gap-6 justify-between">
      <div>
        <div className="font-cinzel text-lg font-bold text-ink">Kozmik Levha</div>
        <p className="text-sm text-muted mt-1 max-w-sm">Evrenin ve zihnin gizli bağları üzerine merak defteri.</p>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {CATEGORIES.map((c) => (
          <a key={c.id} href={links.category(c.id)} className="text-body hover:text-ink">
            {c.name}
          </a>
        ))}
        <a href={links.about} className="text-body hover:text-ink">
          Hakkında
        </a>
      </div>
    </div>
    <div className="text-center text-xs text-muted pb-6">© 2026 Kozmik Levha</div>
  </footer>
);

