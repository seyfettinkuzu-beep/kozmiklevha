import React, { useState, useEffect } from 'react';
import { Sparkles, Activity, Volume2, VolumeX, Menu, X, Search } from 'lucide-react';
import { CategoryId } from '../types';

interface NavbarProps {
  activeCategory: CategoryId | 'all';
  onSelectCategory: (cat: CategoryId | 'all') => void;
  onOpenFrequencyConsole: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenFrequencyConsole,
  isAudioPlaying,
  onToggleAudio,
  searchQuery,
  onSearchChange,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: CategoryId; label: string; glow: string }[] = [
    { id: 'neuro', label: 'NöroKozmos', glow: 'hover:text-[#00f0ff] hover:drop-shadow-[0_0_8px_#00f0ff]' },
    { id: 'biology', label: 'Kozmik Biyoloji', glow: 'hover:text-[#00ff88] hover:drop-shadow-[0_0_8px_#00ff88]' },
    { id: 'resonance', label: 'Frekans & Rezonans', glow: 'hover:text-[#b000ff] hover:drop-shadow-[0_0_8px_#b000ff]' },
    { id: 'alchemy', label: 'Mistik Kimya', glow: 'hover:text-[#00f0ff] hover:drop-shadow-[0_0_8px_#00f0ff]' },
  ];

  const handleNavClick = (id: CategoryId) => {
    onSelectCategory(id);
    setMobileMenuOpen(false);
    const element = document.getElementById('icerik-alani');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#030508]/85 backdrop-blur-md border-b border-[#00f0ff]/20 shadow-[0_4px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(0,240,255,0.08)]'
          : 'bg-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Sol Taraf: Parlayan Neon Tipografiyle KOZMİK LEVHA Logosu */}
        <button
          id="logo-button"
          onClick={() => {
            onSelectCategory('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          {/* Logo Amblem: Nöro-kozmik parlayan çekirdek */}
          <div className="relative w-10 h-10 rounded-full flex items-center justify-center p-0.5 border border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:border-[#00f0ff] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.7)] transition-all duration-300 overflow-hidden bg-[#050912]">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#b000ff]/40 via-[#00f0ff]/30 to-[#00ff88]/30 animate-spin-slow opacity-80" />
            <Sparkles className="w-5 h-5 text-[#00f0ff] relative z-10 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.25em] text-white group-hover:text-[#00f0ff] transition-colors duration-300 drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]">
                KOZMİK LEVHA
              </span>
            </div>
            <p className="text-[10px] tracking-[0.22em] text-[#00f0ff]/80 font-mono uppercase">
              Evrensel Biliş & Frekans
            </p>
          </div>
        </button>

        {/* Sağ Taraf: Minimalist Navigasyon Menüsü */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Ana Menü">
          {navItems.map((item) => {
            const isActive = activeCategory === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm tracking-wider font-medium transition-all duration-300 py-1.5 px-1 relative ${
                  isActive
                    ? 'text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.75)]'
                    : 'text-slate-300/90 ' + item.glow
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#00f0ff] via-[#b000ff] to-[#00ff88] shadow-[0_0_8px_#00f0ff]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Eylemler: Arama, Frekans Butonu, Ambient Ses */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center bg-[#070b14]/90 border border-[#00f0ff]/40 rounded-full px-3 py-1.5 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Search className="w-4 h-4 text-[#00f0ff] mr-2" />
                <input
                  type="text"
                  placeholder="Kozmik arşivde ara..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="bg-transparent text-xs text-white placeholder-slate-400 outline-none w-36 sm:w-44 font-sans"
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    onSearchChange('');
                  }}
                  className="text-slate-400 hover:text-white ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="search-open-btn"
                onClick={() => setSearchOpen(true)}
                title="Arşivde Ara"
                className="p-2 rounded-full text-slate-300 hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 transition-all border border-transparent hover:border-[#00f0ff]/30"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Frekans Konsolu Butonu */}
          <button
            id="frequency-console-btn"
            onClick={onOpenFrequencyConsole}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide bg-[#0c1220]/70 border border-[#b000ff]/30 text-purple-200 hover:border-[#b000ff] hover:text-white hover:shadow-[0_0_18px_rgba(176,0,255,0.4)] transition-all cursor-pointer backdrop-blur-md"
          >
            <Activity className="w-3.5 h-3.5 text-[#b000ff] animate-pulse" />
            <span>Frekans Odası</span>
          </button>

          {/* Ambient Tone Toggle */}
          <button
            id="audio-toggle-btn"
            onClick={onToggleAudio}
            title={isAudioPlaying ? 'Kozmik Rezonansı Sustur' : '432 Hz Kozmik Akort Dinle'}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              isAudioPlaying
                ? 'bg-[#00f0ff]/15 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.5)] animate-pulse'
                : 'bg-transparent border-slate-700/80 text-slate-400 hover:text-[#00f0ff] hover:border-[#00f0ff]/50'
            }`}
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            id="mobile-audio-toggle"
            onClick={onToggleAudio}
            className={`p-2 rounded-full border text-xs ${
              isAudioPlaying
                ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]'
                : 'border-slate-800 text-slate-400'
            }`}
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-200 hover:text-[#00f0ff] focus:outline-none"
            aria-label="Menüyü Aç/Kapat"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu with Glassmorphism */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="lg:hidden bg-[#04070e]/95 backdrop-blur-2xl border-b border-[#00f0ff]/30 px-6 py-6 space-y-4 shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
        >
          {/* Mobile search */}
          <div className="flex items-center bg-[#090f1d] border border-[#00f0ff]/30 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-[#00f0ff] mr-2" />
            <input
              type="text"
              placeholder="Kozmik konularda ara..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
            />
          </div>

          <div className="pt-2 flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left py-2 px-3 rounded-lg text-base font-medium transition-all ${
                  activeCategory === item.id
                    ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'text-slate-300 hover:text-[#00f0ff] hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  onOpenFrequencyConsole();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-sm text-purple-300 hover:text-white"
              >
                <Activity className="w-4 h-4 text-[#b000ff]" />
                <span>Frekans & Rezonans Odası</span>
              </button>
              <span className="text-[10px] font-mono text-[#00ff88] border border-[#00ff88]/30 px-2 py-0.5 rounded">
                Ağ Aktif
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
