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
    <section className="relative pt-28 pb-12 lg:pb-16 overflow-hidden">
      {/* Background radial ambient lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-gradient-to-tr from-[#8e9cc4]/20 via-[#cdb88a]/15 to-[#9fb8a3]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Main Centerpiece Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] items-center gap-10 lg:gap-14">
        {/* Sol sütun: metin (mobilde görselin altında) */}
        <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#080d1a]/80 border border-[#cdb88a]/30 text-[#cdb88a] text-[10px] sm:text-xs tracking-[0.1em] font-mono mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#9fb8a3]" />
          <span>BİYOLOJİK & KOZMİK REZONANS MANİFESTOSU</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#cdb88a]" />
        </div>

        {/* Ana Başlık */}
        <h1 className="font-cinzel text-4xl sm:text-5xl xl:text-6xl font-black tracking-[0.12em] text-white drop- mb-4">
          KOZMİK LEVHA
        </h1>

        {/* Vurucu Slogan */}
        <p className="text-lg sm:text-xl xl:text-2xl font-medium tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#cdb88a] via-[#e2e8f0] to-[#8e9cc4] max-w-xl lg:mx-0 mx-auto mb-4 leading-relaxed drop-">
          "Nöronlardan Galaksilere, Yaşamın ve Frekansın Gizli Ağı."
        </p>

        {/* Açıklayıcı Metin */}
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed font-light">
          İnsan zihninin sinaptik ormanlarından evrenin ipliksi galaksi ağlarına; biyofotonların hücresel ışıltısından gezegenin manyetik titreşimine kadar varoluşun saklı geometrisine açılan kapı.
        </p>

        {/* CTA Butonları */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
          <button
            id="hero-explore-btn"
            onClick={onExploreClick}
            className="group relative px-6 py-3 rounded-full font-medium text-sm tracking-wider text-black bg-[#cdb88a] hover:bg-white transition-all duration-300 cursor-pointer flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-black group-hover:rotate-45 transition-transform" />
            <span>Kozmik Diline Dal</span>
          </button>

          <button
            id="hero-frequency-btn"
            onClick={onOpenFrequencyConsole}
            className="group px-6 py-3 rounded-full font-medium text-sm tracking-wider text-slate-200 bg-[#0c0f20]/80 hover:bg-[#161230] border border-[#8e9cc4]/50 hover:border-[#8e9cc4] transition-all duration-300 cursor-pointer flex items-center gap-2 backdrop-blur-md"
          >
            <Radio className="w-4 h-4 text-[#8e9cc4]" />
            <span>Frekans & Rezonans Odası</span>
          </button>

          <button
            id="hero-ambient-audio-btn"
            onClick={onToggleAudio}
            className={`px-5 py-3 rounded-full font-mono text-xs tracking-wider border transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              isAudioPlaying
                ? 'bg-[#9fb8a3]/15 border-[#9fb8a3] text-[#9fb8a3]'
                : 'bg-transparent border-slate-700/70 text-slate-300 hover:border-[#9fb8a3]/50 hover:text-[#9fb8a3]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isAudioPlaying ? 'Ambient Yayında' : 'Sakin Ambient Dinle'}</span>
          </button>
        </div>

        </div>

        {/* Sağ sütun: görsel */}
        <div className="order-1 lg:order-2 flex justify-center py-8 lg:py-0">
          {/* Hero Visual: Devasa merkezde konumlanmış parlayan kozmik-biyolojik ana illüstrasyon */}
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-[320px] lg:h-[320px] xl:w-[360px] xl:h-[360px] group flex items-center justify-center">
            {/* External Orbital Sacred Geometry Rings */}
            <div className="absolute inset-[-18px] sm:inset-[-24px] rounded-full border border-dashed border-[#cdb88a]/30 animate-spin-slow pointer-events-none" />
            <div className="absolute inset-[-34px] sm:inset-[-44px] rounded-full border border-[#8e9cc4]/25 animate-spin-reverse-slow pointer-events-none" />
          
            {/* Subtle celestial crosshairs */}
            <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#cdb88a]/30 to-transparent pointer-events-none" />
            <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[#8e9cc4]/30 to-transparent pointer-events-none" />

            {/* Deep Glow Behind Image */}
            <div className="absolute inset-0 rounded-full bg-[#cdb88a]/25 blur-2xl filter group-hover:bg-[#cdb88a]/40 transition-all duration-700 pointer-events-none" />
            <div className="absolute inset-4 rounded-full bg-[#8e9cc4]/25 blur-xl filter group-hover:bg-[#8e9cc4]/40 transition-all duration-700 pointer-events-none" />

            {/* Main Hero Emblem Disc */}
            <div className="relative w-full h-full rounded-full overflow-hidden p-1.5 bg-gradient-to-tr from-[#cdb88a] via-[#8e9cc4] to-[#9fb8a3] transition-transform duration-500 group-hover:scale-[1.02]">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#0d0f14] relative">
                <img
                  src={HERO_IMAGE}
                  alt="Kozmik Levha Nöron Ağları ve Galaktik Sarmal İllüstrasyonu"
                  referrerPolicy="no-referrer"
                  className="saturate-[0.6] w-full h-full object-cover rounded-full filter contrast-110 brightness-105 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f14]/60 via-transparent to-[#cdb88a]/15 pointer-events-none" />
              </div>
            </div>

            {/* Floating Bio-Orbital Chips */}
            <div className="hidden md:flex absolute -left-12 top-1/4 items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090e1c]/90 border border-[#cdb88a]/30 text-xs text-slate-200 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#cdb88a]" />
              <span className="font-mono text-[#cdb88a]">10¹¹</span> Nöron ~ Galaksi
            </div>

            <div className="hidden md:flex absolute -right-12 bottom-1/4 items-center gap-2 px-3 py-1.5 rounded-xl bg-[#110b24]/90 border border-[#8e9cc4]/40 text-xs text-slate-200 backdrop-blur-md">
              <Radio className="w-3.5 h-3.5 text-[#8e9cc4]" />
              <span className="font-mono text-slate-300">7.83 Hz</span> Schumann Nabzı
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={onExploreClick}
          className="order-3 lg:hidden flex flex-col items-center text-slate-400 hover:text-[#cdb88a] transition-colors cursor-pointer group"
        >
          <span className="text-[11px] tracking-[0.12em] font-mono uppercase mb-2 group-hover:tracking-[0.12em] transition-all">
            Aşağı Kaydır
          </span>
          <ArrowDown className="w-4 h-4 text-[#cdb88a]" />
        </button>
      </div>
    </section>
  );
};
