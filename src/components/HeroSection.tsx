import React from 'react';
import { Sparkles, Compass, Radio, ArrowDown, Zap } from 'lucide-react';
import { HERO_IMAGE } from '../data/cosmicData';

interface HeroSectionProps {
  onExploreClick: () => void;
  onOpenFrequencyConsole: () => void;
  onToggleAudio: () => void;
  isAudioPlaying: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onOpenFrequencyConsole,
  onToggleAudio,
  isAudioPlaying,
}) => {
  return (
    <section className="relative min-h-screen pt-28 pb-16 flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
      {/* Background radial ambient lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[600px] sm:h-[850px] bg-gradient-to-tr from-[#b000ff]/20 via-[#00f0ff]/15 to-[#00ff88]/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />

      {/* Main Centerpiece Container */}
      <div className="relative max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#080d1a]/80 border border-[#00f0ff]/30 text-[#00f0ff] text-xs sm:text-sm tracking-[0.2em] font-mono mb-8 shadow-[0_0_20px_rgba(0,240,255,0.2)] backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#00ff88] animate-spin-slow" />
          <span>BİYOLOJİK & KOZMİK REZONANS MANİFESTOSU</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
        </div>

        {/* Hero Visual: Devasa merkezde konumlanmış parlayan kozmik-biyolojik ana illüstrasyon */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[420px] md:h-[420px] mb-8 group flex items-center justify-center">
          {/* External Orbital Sacred Geometry Rings */}
          <div className="absolute inset-[-20px] sm:inset-[-30px] rounded-full border border-dashed border-[#00f0ff]/30 animate-spin-slow pointer-events-none" />
          <div className="absolute inset-[-40px] sm:inset-[-55px] rounded-full border border-[#b000ff]/25 animate-spin-reverse-slow pointer-events-none" />
          
          {/* Subtle celestial crosshairs */}
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent pointer-events-none" />
          <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[#b000ff]/30 to-transparent pointer-events-none" />

          {/* Deep Glow Behind Image */}
          <div className="absolute inset-0 rounded-full bg-[#00f0ff]/25 blur-2xl filter group-hover:bg-[#00f0ff]/40 transition-all duration-700 pointer-events-none" />
          <div className="absolute inset-4 rounded-full bg-[#b000ff]/25 blur-xl filter group-hover:bg-[#b000ff]/40 transition-all duration-700 pointer-events-none" />

          {/* Main Hero Emblem Disc */}
          <div className="relative w-full h-full rounded-full overflow-hidden p-1.5 bg-gradient-to-tr from-[#00f0ff] via-[#b000ff] to-[#00ff88] shadow-[0_0_45px_rgba(0,240,255,0.4),0_0_80px_rgba(176,0,255,0.3)] transition-transform duration-500 group-hover:scale-[1.02]">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#030508] relative">
              <img
                src={HERO_IMAGE}
                alt="Kozmik Levha Nöron Ağları ve Galaktik Sarmal İllüstrasyonu"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full filter contrast-110 brightness-105 group-hover:scale-105 transition-transform duration-700"
              />

              {/* Shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030508]/60 via-transparent to-[#00f0ff]/15 pointer-events-none" />
            </div>
          </div>

          {/* Floating Bio-Orbital Chips */}
          <div className="hidden md:flex absolute -left-12 top-1/4 items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090e1c]/90 border border-[#00f0ff]/30 shadow-[0_0_15px_rgba(0,240,255,0.25)] text-xs text-slate-200 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
            <span className="font-mono text-[#00f0ff]">10¹¹</span> Nöron ~ Galaksi
          </div>

          <div className="hidden md:flex absolute -right-12 bottom-1/4 items-center gap-2 px-3 py-1.5 rounded-xl bg-[#110b24]/90 border border-[#b000ff]/40 shadow-[0_0_15px_rgba(176,0,255,0.25)] text-xs text-slate-200 backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 text-[#b000ff]" />
            <span className="font-mono text-purple-300">7.83 Hz</span> Schumann Nabzı
          </div>
        </div>

        {/* Ana Başlık */}
        <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-black tracking-[0.18em] text-white drop-shadow-[0_0_25px_rgba(0,240,255,0.4)] mb-4">
          KOZMİK LEVHA
        </h1>

        {/* Vurucu Slogan */}
        <p className="text-xl sm:text-2xl md:text-3xl font-medium tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#e2e8f0] to-[#b000ff] max-w-3xl mx-auto mb-6 leading-relaxed drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
          "Nöronlardan Galaksilere, Yaşamın ve Frekansın Gizli Ağı."
        </p>

        {/* Açıklayıcı Metin */}
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          İnsan zihninin sinaptik ormanlarından evrenin ipliksi galaksi ağlarına; biyofotonların hücresel ışıltısından gezegenin manyetik titreşimine kadar varoluşun saklı geometrisine açılan kapı.
        </p>

        {/* CTA Butonları */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 mb-14">
          <button
            id="hero-explore-btn"
            onClick={onExploreClick}
            className="group relative px-7 py-3.5 rounded-full font-medium text-sm tracking-wider text-black bg-[#00f0ff] hover:bg-white shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:shadow-[0_0_35px_rgba(255,255,255,0.8)] transition-all duration-300 cursor-pointer flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-black group-hover:rotate-45 transition-transform" />
            <span>Kozmik Diline Dal</span>
          </button>

          <button
            id="hero-frequency-btn"
            onClick={onOpenFrequencyConsole}
            className="group px-7 py-3.5 rounded-full font-medium text-sm tracking-wider text-purple-200 bg-[#0c0f20]/80 hover:bg-[#161230] border border-[#b000ff]/50 hover:border-[#b000ff] shadow-[0_0_20px_rgba(176,0,255,0.3)] hover:shadow-[0_0_30px_rgba(176,0,255,0.6)] transition-all duration-300 cursor-pointer flex items-center gap-2 backdrop-blur-md"
          >
            <Radio className="w-4 h-4 text-[#b000ff] group-hover:animate-ping" />
            <span>Frekans & Rezonans Odası</span>
          </button>

          <button
            id="hero-ambient-audio-btn"
            onClick={onToggleAudio}
            className={`px-5 py-3.5 rounded-full font-mono text-xs tracking-wider border transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              isAudioPlaying
                ? 'bg-[#00ff88]/15 border-[#00ff88] text-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.4)]'
                : 'bg-transparent border-slate-700/70 text-slate-300 hover:border-[#00ff88]/50 hover:text-[#00ff88]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isAudioPlaying ? 'Ambient Yayında' : 'Sakin Ambient Dinle'}</span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={onExploreClick}
          className="flex flex-col items-center text-slate-400 hover:text-[#00f0ff] transition-colors cursor-pointer group"
        >
          <span className="text-[11px] tracking-[0.25em] font-mono uppercase mb-2 group-hover:tracking-[0.3em] transition-all">
            Aşağı Kaydır
          </span>
          <ArrowDown className="w-4 h-4 text-[#00f0ff] animate-bounce" />
        </button>
      </div>
    </section>
  );
};
