import React, { useMemo, useState } from 'react';
import { ArrowLeft, Link2, Check, MessageCircle } from 'lucide-react';
import { ARTICLES, CATEGORIES, PHOTOS } from '../data/cosmicData';
import { Article } from '../types';
import { links } from './router';
import { Byline, CAT_COLOR, Kicker, NATURE, NatureBadge, PostCard, PostRow, SectionTitle, Wordmark } from './parts';
import { Sidebar } from './Sidebar';

const FEATURED_ID = 'stardust-alchemy';

const norm = (t: string) =>
  t
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i');

const Wrap: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`max-w-[1240px] mx-auto px-4 sm:px-10 ${className}`}>{children}</div>
);

/** Tam genişlik manşet görseli + künye */
const HeroImage: React.FC<{ a: Article; eager?: boolean }> = ({ a, eager }) => (
  <figure>
    <img
      src={a.image}
      alt=""
      loading={eager ? 'eager' : 'lazy'}
      className="w-full h-[300px] sm:h-[460px] lg:h-[560px] object-cover object-center block"
    />
    {a.credit && (
      <figcaption className="max-w-[1320px] mx-auto px-4 sm:px-10 pt-2 text-right text-[11px] text-muted">
        {a.credit}
      </figcaption>
    )}
  </figure>
);

/** Merak Kabinesi: tarihi bir görsel, müze etiketi gibi künyesiyle */
const Cabinet: React.FC = () => (
  <section className="bg-soft py-12 sm:py-16">
    <Wrap className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
      <img src={PHOTOS.cajal} alt="Cajal'ın korteks çizimleri" className="w-full max-h-[440px] object-contain mix-blend-multiply" />
      <div>
        <span className="kicker" style={{ color: '#b08a45' }}>
          <span>Merak Kabinesi · No. 01</span>
        </span>
        <h2 className="headline text-[30px] sm:text-[44px] leading-[1.05] mt-4 mb-4">
          Bir Hekimin Mikroskop Başında Çizdiği Beyin
        </h2>
        <p className="font-read text-[17px] sm:text-lg leading-[1.75] text-[#3a3a3a]">
          Santiago Ramón y Cajal 1890'larda beyin dokusunu boyayıp mikroskopla inceledi ve gördüğü nöronları tek tek elle
          çizdi. Bu çizimler beynin ayrı hücrelerden oluşan bir ağ olduğunu gösterdi; Cajal 1906'da Nobel Tıp Ödülü'nü
          aldı ve modern sinirbilimin kurucularından sayılır.
        </p>
        <div className="byline mt-5 pt-4 border-t border-[#d9ccb0] leading-relaxed">
          İnsan korteksindeki nöron katmanları · S. Ramón y Cajal, 1899 civarı · Kamu malı
        </div>
      </div>
    </Wrap>
  </section>
);

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
      <Wrap className="py-10">
        <SectionTitle>Arama</SectionTitle>
        <h1 className="headline text-3xl mt-4 mb-1">“{query}”</h1>
        <p className="byline mb-4">{results.length} yazı bulundu</p>
        {results.length ? (
          <div className="max-w-4xl">
            {results.map((a) => (
              <PostRow key={a.id} a={a} />
            ))}
          </div>
        ) : (
          <p className="text-body mt-6">Bu kelimeyle eşleşen bir yazı yok. Başka bir kelime deneyin.</p>
        )}
      </Wrap>
    );
  }

  const featured = ARTICLES.find((a) => a.id === FEATURED_ID) ?? ARTICLES[0];
  const rest = ARTICLES.filter((a) => a.id !== featured.id);
  const listed = rest.slice(0, 3);
  const trio = rest.slice(3);

  return (
    <>
      <a href={links.article(featured.id)} className="block group">
        <HeroImage a={featured} eager />
      </a>
      <section className="max-w-[880px] mx-auto px-4 sm:px-6 pt-8 pb-12 sm:pb-14 text-left sm:text-center border-b border-line">
        <Kicker a={featured} />
        <a href={links.article(featured.id)}>
          <h1 className="headline text-[34px] sm:text-[52px] lg:text-[62px] leading-[1.03] mt-5 mb-4 hover:text-navy transition-colors">
            {featured.title}
          </h1>
        </a>
        <p className="text-[16.5px] sm:text-[19px] leading-relaxed text-body max-w-[720px] sm:mx-auto mb-5">{featured.excerpt}</p>
        <Byline a={featured} className="sm:justify-center" />
      </section>

      <Wrap className="grid lg:grid-cols-[1fr_330px] gap-12 lg:gap-16 py-12 sm:py-14">
        <section>
          <SectionTitle>Son yazılar</SectionTitle>
          {listed.map((a) => (
            <PostRow key={a.id} a={a} />
          ))}
        </section>
        <Sidebar onOpenRoom={onOpenRoom} />
      </Wrap>

      <Cabinet />

      {trio.length > 0 && (
        <Wrap className="py-12 sm:py-16">
          <SectionTitle className="mb-8">Daha fazla</SectionTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {trio.map((a) => (
              <PostCard key={a.id} a={a} />
            ))}
          </div>
        </Wrap>
      )}
    </>
  );
};

// ---------- Kategori ----------
export const CategoryPage: React.FC<{ id: string; onOpenRoom: () => void }> = ({ id, onOpenRoom }) => {
  const cat = CATEGORIES.find((c) => c.id === id);
  const list = ARTICLES.filter((a) => a.categoryId === id);
  if (!cat) return <NotFound />;
  return (
    <>
      <section className="border-b border-line">
        <Wrap className="py-10 sm:py-14 max-w-[880px]">
          <span className="kicker" style={{ color: CAT_COLOR[cat.id] }}>
            <span>Konu</span>
          </span>
          <h1 className="headline text-[38px] sm:text-[56px] leading-[1.02] mt-5 mb-3">{cat.name}</h1>
          <p className="font-read italic text-xl text-body mb-3">{cat.subtitle}</p>
          <p className="text-[15.5px] leading-relaxed text-body">{cat.description}</p>
        </Wrap>
      </section>
      <Wrap className="grid lg:grid-cols-[1fr_330px] gap-12 lg:gap-16 py-10">
        <section>
          <SectionTitle>{list.length} yazı</SectionTitle>
          {list.map((a) => (
            <PostRow key={a.id} a={a} />
          ))}
        </section>
        <Sidebar onOpenRoom={onOpenRoom} showPopular={false} />
      </Wrap>
    </>
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
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line text-[13px] text-ink hover:border-[#3f8a5f] hover:text-[#3f8a5f]"
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
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line text-[13px] text-ink hover:border-navy hover:text-navy cursor-pointer"
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
    <article className="pb-6">
      <HeroImage a={a} eager />
      <header className="max-w-[860px] mx-auto px-4 sm:px-6 pt-8 pb-8 text-left sm:text-center">
        <Kicker a={a} />
        <h1 className="headline text-[34px] sm:text-[52px] leading-[1.04] mt-5 mb-4">{a.title}</h1>
        <p className="text-[17px] sm:text-[19px] leading-relaxed text-body mb-5">{a.excerpt}</p>
        <Byline a={a} className="sm:justify-center" />
      </header>

      <div className="max-w-[700px] mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 py-4 border-y border-line mb-8">
          <a href={links.home} className="inline-flex items-center gap-1 text-[13px] text-muted hover:text-ink">
            <ArrowLeft className="w-4 h-4" /> Tüm yazılar
          </a>
          <ShareBar a={a} />
        </div>

        {nature && (
          <div className="mb-8 p-4 bg-[#faf8f4] border-l-[3px] border-gold text-[14px] text-body flex flex-wrap gap-3 items-start">
            <NatureBadge nature={a.nature} />
            <span className="flex-1 min-w-[200px]">{nature.hint}</span>
          </div>
        )}

        <div className="reading">
          {a.content.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <aside className="my-10 pt-5 border-t-[3px] border-ink">
          <div className="text-[13px] tracking-[0.2em] uppercase font-bold text-ink mb-4">Kısaca</div>
          <ul className="space-y-3">
            {a.highlights.map((h, i) => (
              <li key={i} className="flex gap-3 text-[15.5px] text-body leading-relaxed">
                <span className="mt-2.5 w-1.5 h-1.5 bg-gold shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-t border-line">
          <span className="byline">
            Etiket: <span className="text-ink">{a.tag}</span>
          </span>
          <ShareBar a={a} />
        </div>
      </div>

      <Wrap className="mt-12 mb-10">
        <SectionTitle className="mb-8">Bunları da okuyun</SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {related.map((r) => (
            <PostCard key={r.id} a={r} />
          ))}
        </div>
      </Wrap>
    </article>
  );
};

// ---------- Hakkında ----------
export const AboutPage: React.FC = () => (
  <div className="max-w-[700px] mx-auto px-4 sm:px-6 py-12">
    <span className="kicker" style={{ color: '#b08a45' }}>
      <span>Hakkında</span>
    </span>
    <h1 className="headline text-[36px] sm:text-[48px] leading-[1.05] mt-5 mb-8">Kozmik Levha nedir?</h1>
    <div className="reading">
      <p>
        Kozmik Levha, evrenle zihin arasındaki şaşırtıcı benzerlikleri, sesin ve frekansın insana tesirini, yıldızlardan
        hücrelerimize uzanan gizli bağları merak eden herkes için bir defter. Burada gizemli ve ilginç bilgileri
        araştırıp sade bir dille paylaşıyoruz.
      </p>
      <p>
        Merakın en iyi dostu dürüstlüktür. Bu yüzden her yazının üzerinde bir etiket var: <strong>Bilim</strong>{' '}
        yerleşik ve ölçülmüş bilgileri, <strong>Bilim + Yorum</strong> gerçek bir bulgudan yola çıkan ama henüz
        kanıtlanmamış yorumları, <strong>Düşünce</strong> ise felsefi ve spekülatif fikirleri anlatır.
      </p>
      <p>
        Okurken eşlik etmesi için bir de Frekans Odası hazırladık: ruh halinize göre tarayıcınızda canlı üretilen
        ambient müzikler. Sağ üstteki düğmeden açabilirsiniz.
      </p>
      <p>
        Fotoğraflar NASA, ESA, CSA ve Wikimedia Commons katkıcılarının paylaşıma açık gerçek gözlem ve bilim
        görüntüleridir; her görselin künyesi altında yazılıdır.
      </p>
    </div>
    <a href={links.home} className="inline-flex items-center gap-1 text-sm text-navy hover:underline mt-2">
      <ArrowLeft className="w-4 h-4" /> Yazılara dön
    </a>
  </div>
);

const NotFound: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 py-20 text-center">
    <h1 className="headline text-3xl mb-3">Bu sayfa bulunamadı</h1>
    <a href={links.home} className="text-navy hover:underline">
      Ana sayfaya dön
    </a>
  </div>
);

export const SiteFooter: React.FC = () => (
  <footer className="bg-night text-[#a8a294]">
    <Wrap className="py-10 flex flex-col md:flex-row gap-6 md:items-center justify-between">
      <div>
        <Wordmark size="sm" light />
        <p className="text-[13px] mt-2 max-w-sm">Evrenin ve zihnin gizli bağları üzerine merak defteri.</p>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] font-bold tracking-[0.14em] uppercase text-[#d9d2c4]">
        {CATEGORIES.map((c) => (
          <a key={c.id} href={links.category(c.id)} className="hover:text-white">
            {c.name}
          </a>
        ))}
        <a href={links.about} className="hover:text-white">
          Hakkında
        </a>
      </div>
    </Wrap>
    <div className="border-t border-white/10">
      <Wrap className="py-4 text-[11.5px] flex flex-col sm:flex-row gap-2 justify-between">
        <span>© 2026 Kozmik Levha</span>
        <span>Görseller: NASA, ESA, CSA, S. Ramón y Cajal ve Wikimedia Commons katkıcıları</span>
      </Wrap>
    </div>
  </footer>
);
