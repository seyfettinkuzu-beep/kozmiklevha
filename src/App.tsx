import React, { useState } from 'react';
import { CosmicBackground } from './components/CosmicBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ContentGrid } from './components/ContentGrid';
import { FrequencyConsole, useAmbient } from './components/FrequencyConsole';
import { ambient } from './audio/ambientEngine';
import { ArticleModal } from './components/ArticleModal';
import { MoodSection } from './components/MoodSection';
import { Footer } from './components/Footer';
import { CATEGORIES, ARTICLES } from './data/cosmicData';
import { CategoryId, Article } from './types';
import { Sparkles, Radio, Activity, Eye, Zap, Waves } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [frequencyConsoleOpen, setFrequencyConsoleOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const audio = useAmbient();
  const isAudioPlaying = audio.playing;

  // Üst menüdeki ses düğmesi: "Sakin" ambient müziği açar/kapatır.
  const toggleAmbientAudio = () => {
    if (audio.playing) ambient.stop();
    else ambient.startMood('sakin');
  };

  const scrollToContent = () => {
    const el = document.getElementById('icerik-alani');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0d0f14] text-slate-100 selection:bg-[#cdb88a] selection:text-black">
      {/* Background Interactive Cosmic Canvas */}
      <CosmicBackground />

      {/* Global Navbar */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onOpenFrequencyConsole={() => setFrequencyConsoleOpen(true)}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={toggleAmbientAudio}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection
          onExploreClick={scrollToContent}
          onOpenFrequencyConsole={() => setFrequencyConsoleOpen(true)}
          onToggleAudio={toggleAmbientAudio}
          isAudioPlaying={isAudioPlaying}
        />

        {/* Interactive Cosmic Manifesto & Resonance Strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#070b16]/90 via-[#0a0d20]/80 to-[#0d071d]/90 border border-[#cdb88a]/20 backdrop-blur-2xl relative overflow-hidden">
            {/* Glow background accents */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#cdb88a]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#8e9cc4]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left text */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[#9fb8a3] uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#9fb8a3]" />
                  <span>Kozmik Levha Prensibi</span>
                </div>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  "Mikrokozmos neyse, Makrokozmos da odur."
                </h2>
                <p className="text-sm text-slate-300 font-light leading-relaxed">
                  Evrenin nöronal dokusu, canlıların yaydığı biyofoton titreşimleri ve iyonosferin rezonans frekansları birbirinden bağımsız değildir. Her hücre, galaktik ağın minyatür bir yankısıdır.
                </p>

                <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#cdb88a]" />
                    <span className="text-slate-200">Fraktal Geometri</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8e9cc4]" />
                    <span className="text-slate-200">Harmonik Akort</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9fb8a3]" />
                    <span className="text-slate-200">Biyolüminesans</span>
                  </div>
                </div>
              </div>

              {/* Right Quick Interactive Console Card */}
              <div className="lg:col-span-5 bg-[#03060f]/80 border border-[#8e9cc4]/30 rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-[#8e9cc4] flex items-center gap-1.5">
                    <Radio className="w-4 h-4" />
                    Canlı Ambient Jeneratörü
                  </span>
                  <span className="text-[10px] font-mono bg-[#9fb8a3]/10 text-[#9fb8a3] border border-[#9fb8a3]/30 px-2 py-0.5 rounded">
                    432 Hz Kalibre
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-2">
                      <Waves className="w-4 h-4 text-[#cdb88a]" />
                      Müzik Modları
                    </span>
                    <span className="font-mono text-[#cdb88a]">5 Ruh Hali</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#8e9cc4]" />
                      Katmanlar
                    </span>
                    <span className="font-mono text-slate-300">Ritim · Melodi · Doğa</span>
                  </div>
                </div>

                <button
                  onClick={() => setFrequencyConsoleOpen(true)}
                  className="w-full py-2.5 rounded-xl font-medium text-xs tracking-wider text-white bg-gradient-to-r from-[#8e9cc4] to-[#cdb88a] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-200" />
                  <span>Rezonans Odasını Aç</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Sesin İnsana Tesiri: ruh hali müzikleri */}
        <MoodSection onOpenConsole={() => setFrequencyConsoleOpen(true)} />

        {/* Content Grid (Categories & Featured Articles) */}
        <ContentGrid
          categories={CATEGORIES}
          articles={ARTICLES}
          selectedCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onOpenArticle={(art) => setSelectedArticle(art)}
          searchQuery={searchQuery}
        />
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={setActiveCategory}
        onOpenFrequencyConsole={() => setFrequencyConsoleOpen(true)}
      />

      {/* Frequency Console Modal */}
      <FrequencyConsole
        isOpen={frequencyConsoleOpen}
        onClose={() => setFrequencyConsoleOpen(false)}
      />

      {/* Full Article Reader Modal */}
      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
}
