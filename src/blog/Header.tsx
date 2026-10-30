import React, { useState } from 'react';
import { Search, X, Radio, Volume2, VolumeX, Menu } from 'lucide-react';
import { CATEGORIES } from '../data/cosmicData';
import { links, Route } from './router';

interface HeaderProps {
  route: Route;
  query: string;
  onQuery: (q: string) => void;
  onOpenRoom: () => void;
  audioOn: boolean;
  onToggleAudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({ route, query, onQuery, onOpenRoom, audioOn, onToggleAudio }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeCat = route.name === 'category' ? route.id : null;

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          <a href={links.home} onClick={() => onQuery('')} className="flex items-baseline gap-3 shrink-0">
            <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.08em] text-ink whitespace-nowrap">
              Kozmik Levha
            </span>
            <span className="hidden md:inline text-xs text-muted italic font-serif">
              gizemli bilgilerin defteri
            </span>
          </a>

          <div className="flex items-center gap-1 sm:gap-2">
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-card border border-line rounded-full pl-3 pr-1 py-1">
                <Search className="w-4 h-4 text-muted" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    onQuery(e.target.value);
                    if (route.name !== 'home') window.location.hash = links.home;
                  }}
                  placeholder="Yazılarda ara…"
                  className="bg-transparent outline-none text-sm text-ink placeholder:text-muted w-32 sm:w-48"
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    onQuery('');
                  }}
                  aria-label="Aramayı kapat"
                  className="p-1 rounded-full hover:bg-line/60 cursor-pointer"
                >
                  <X className="w-4 h-4 text-muted" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Ara"
                className="p-2 rounded-full text-body hover:bg-line/60 cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onToggleAudio}
              aria-label={audioOn ? 'Sesi kapat' : 'Sakin ambient müzik çal'}
              title={audioOn ? 'Sesi kapat' : 'Sakin ambient müzik çal'}
              className={`p-2 rounded-full cursor-pointer ${audioOn ? 'bg-navy text-paper' : 'text-body hover:bg-line/60'}`}
            >
              {audioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenRoom}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-paper text-sm font-medium hover:bg-navy transition-colors cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              Frekans Odası
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menü"
              className="md:hidden p-2 rounded-full text-body hover:bg-line/60 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Kategori menüsü */}
        <nav
          className={`${menuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:items-center gap-1 md:gap-6 pb-3 md:pb-0 md:h-11 text-sm`}
          aria-label="Kategoriler"
        >
          <a
            href={links.home}
            onClick={() => {
              onQuery('');
              setMenuOpen(false);
            }}
            className={`py-2 md:py-0 md:h-full flex items-center border-b-2 ${
              route.name === 'home' ? 'border-gold text-ink font-medium' : 'border-transparent text-body hover:text-ink'
            }`}
          >
            Son Yazılar
          </a>
          {CATEGORIES.map((c) => (
            <a
              key={c.id}
              href={links.category(c.id)}
              onClick={() => setMenuOpen(false)}
              className={`py-2 md:py-0 md:h-full flex items-center border-b-2 ${
                activeCat === c.id ? 'border-gold text-ink font-medium' : 'border-transparent text-body hover:text-ink'
              }`}
            >
              {c.name}
            </a>
          ))}
          <a
            href={links.about}
            onClick={() => setMenuOpen(false)}
            className={`py-2 md:py-0 md:h-full flex items-center border-b-2 md:ml-auto ${
              route.name === 'about' ? 'border-gold text-ink font-medium' : 'border-transparent text-body hover:text-ink'
            }`}
          >
            Hakkında
          </a>
          <button
            onClick={() => {
              setMenuOpen(false);
              onOpenRoom();
            }}
            className="sm:hidden mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-ink text-paper text-sm font-medium cursor-pointer"
          >
            <Radio className="w-4 h-4" />
            Frekans Odası
          </button>
        </nav>
      </div>
    </header>
  );
};
