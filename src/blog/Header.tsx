import React, { useEffect, useState } from 'react';
import { Search, X, Radio, Volume2, VolumeX, Menu } from 'lucide-react';
import { CATEGORIES } from '../data/cosmicData';
import { links, Route } from './router';
import { CAT_COLOR, Wordmark } from './parts';

interface HeaderProps {
  route: Route;
  query: string;
  onQuery: (q: string) => void;
  onOpenRoom: () => void;
  audioOn: boolean;
  onToggleAudio: () => void;
  /** Sayfa en üstte bir video/görselle başlıyorsa menü onun üzerine biner */
  overlay?: boolean;
}

const SHORT: Record<string, string> = {
  neuro: 'NöroKozmos',
  biology: 'Biyoloji',
  resonance: 'Frekans',
  alchemy: 'Kimya',
};

export const Header: React.FC<HeaderProps> = ({ route, query, onQuery, onOpenRoom, audioOn, onToggleAudio, overlay = false }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  // Videonun üstündeyken şeffaf ve açık renk; kaydırınca ya da menü açılınca beyaz
  const clear = overlay && !scrolled && !menuOpen;
  const activeCat = route.name === 'category' ? route.id : null;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 ${
        clear ? 'bg-transparent text-white' : 'bg-white/95 backdrop-blur text-ink border-b border-line'
      }`}
    >
      <div className="max-w-[1080px] mx-auto px-5 sm:px-10">
        <div className="h-[64px] sm:h-[70px] flex items-center justify-between gap-6">
          <a href={links.home} onClick={() => onQuery('')} className="shrink-0">
            <Wordmark light={clear} />
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-[12px] font-bold tracking-[0.14em] uppercase">
            {CATEGORIES.map((c) => (
              <a
                key={c.id}
                href={links.category(c.id)}
                className="relative py-2 hover:opacity-70 transition-opacity"
                style={activeCat === c.id ? { boxShadow: `inset 0 -3px 0 ${CAT_COLOR[c.id]}` } : undefined}
              >
                {SHORT[c.id] ?? c.name}
              </a>
            ))}
            <a
              href={links.about}
              className="py-2 hover:opacity-70"
              style={route.name === 'about' ? { boxShadow: 'inset 0 -3px 0 #b08a45' } : undefined}
            >
              Hakkında
            </a>
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            {searchOpen ? (
              <div className={`flex items-center gap-2 border rounded-full pl-3 pr-1 py-1 ${clear ? 'border-white/40 bg-black/20' : 'border-line'}`}>
                <Search className={`w-4 h-4 ${clear ? 'text-white/80' : 'text-muted'}`} />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    onQuery(e.target.value);
                    if (route.name !== 'home') window.location.hash = links.home;
                  }}
                  placeholder="Yazılarda ara…"
                  className={`bg-transparent outline-none text-sm w-28 sm:w-44 ${clear ? 'text-white placeholder:text-white/60' : 'text-ink placeholder:text-muted'}`}
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    onQuery('');
                  }}
                  aria-label="Aramayı kapat"
                  className="p-1 rounded-full hover:bg-line cursor-pointer"
                >
                  <X className="w-4 h-4 text-muted" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Ara"
                className={`p-2 rounded-full cursor-pointer ${clear ? 'hover:bg-white/15' : 'hover:bg-line/60'}`}
              >
                <Search className="w-[18px] h-[18px]" />
              </button>
            )}
            <button
              onClick={onToggleAudio}
              aria-label={audioOn ? 'Sesi kapat' : 'Sakin ambient müzik çal'}
              title={audioOn ? 'Sesi kapat' : 'Sakin ambient müzik çal'}
              className={`p-2 rounded-full cursor-pointer ${audioOn ? (clear ? 'bg-white text-night' : 'bg-night text-[#f0e4c8]') : clear ? 'hover:bg-white/15' : 'hover:bg-line/60'}`}
            >
              {audioOn ? <Volume2 className="w-[18px] h-[18px]" /> : <VolumeX className="w-[18px] h-[18px]" />}
            </button>
            <button
              onClick={onOpenRoom}
              className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold transition-colors cursor-pointer ${clear ? 'bg-white/15 border border-white/40 text-white hover:bg-white/25 backdrop-blur' : 'bg-night text-[#f0e4c8] hover:bg-ink'}`}
            >
              <Radio className="w-4 h-4" />
              Frekans Odası
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menü"
              className={`lg:hidden p-2 rounded-full cursor-pointer ${clear ? 'hover:bg-white/15' : 'hover:bg-line/60'}`}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="lg:hidden flex flex-col pb-4 text-[13px] font-bold tracking-[0.14em] uppercase text-ink">
            {CATEGORIES.map((c) => (
              <a
                key={c.id}
                href={links.category(c.id)}
                onClick={() => setMenuOpen(false)}
                className="py-3 border-t border-line flex items-center gap-3"
              >
                <span className="w-2 h-2" style={{ background: CAT_COLOR[c.id] }} />
                {c.name}
              </a>
            ))}
            <a href={links.about} onClick={() => setMenuOpen(false)} className="py-3 border-t border-line">
              Hakkında
            </a>
            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenRoom();
              }}
              className="sm:hidden mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-night text-[#f0e4c8] normal-case tracking-normal text-sm font-semibold cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              Frekans Odası
            </button>
          </nav>
        )}
      </div>
      {/* konu renklerinden ince şerit (yalnız beyaz menüde) */}
      <div className={`h-[3px] grid grid-cols-4 transition-opacity ${clear ? 'opacity-0' : 'opacity-100'}`}>
        <span className="bg-c-neuro" />
        <span className="bg-c-bio" />
        <span className="bg-c-res" />
        <span className="bg-c-alc" />
      </div>
    </header>
  );
};
