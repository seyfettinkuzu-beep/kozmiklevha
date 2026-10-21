import React, { useState, useMemo } from 'react';
import { Sparkles, BrainCircuit, Dna, Radio, ArrowRight, Clock, Activity, RotateCcw } from 'lucide-react';
import { Category, Article, CategoryId, CosmicPeriodId } from '../types';
import { COSMIC_PERIODS } from '../data/cosmicData';
import { CosmicTimeline } from './CosmicTimeline';

interface ContentGridProps {
  categories: Category[];
  articles: Article[];
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (cat: CategoryId | 'all') => void;
  onOpenArticle: (article: Article) => void;
  searchQuery: string;
}

export const ContentGrid: React.FC<ContentGridProps> = ({
  categories,
  articles,
  selectedCategory,
  onSelectCategory,
  onOpenArticle,
  searchQuery,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<CosmicPeriodId>('all');

  // Count articles per period
  const articleCountByPeriod = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach((art) => {
      counts[art.periodId] = (counts[art.periodId] || 0) + 1;
    });
    return counts;
  }, [articles]);

  // Filter articles based on category, cosmic period, and search query
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesCategory = selectedCategory === 'all' || art.categoryId === selectedCategory;
      const matchesPeriod = selectedPeriod === 'all' || art.periodId === selectedPeriod;
      const matchesSearch =
        searchQuery.trim() === '' ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.periodEra.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesPeriod && matchesSearch;
    });
  }, [articles, selectedCategory, selectedPeriod, searchQuery]);

  const getCategoryIcon = (id: CategoryId) => {
    switch (id) {
      case 'neuro':
        return <BrainCircuit className="w-5 h-5 text-[#00f0ff]" />;
      case 'biology':
        return <Dna className="w-5 h-5 text-[#00ff88]" />;
      case 'resonance':
        return <Radio className="w-5 h-5 text-[#b000ff]" />;
      case 'alchemy':
        return <Sparkles className="w-5 h-5 text-[#00f0ff]" />;
    }
  };

  const getCardBorderClass = (color: 'cyan' | 'purple' | 'green') => {
    switch (color) {
      case 'cyan':
        return 'border-[#00f0ff]/20 hover:border-[#00f0ff]/60 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)]';
      case 'purple':
        return 'border-[#b000ff]/20 hover:border-[#b000ff]/60 hover:shadow-[0_0_25px_rgba(176,0,255,0.2)]';
      case 'green':
        return 'border-[#00ff88]/20 hover:border-[#00ff88]/60 hover:shadow-[0_0_25px_rgba(0,255,136,0.2)]';
    }
  };

  const getTagColorClass = (color: 'cyan' | 'purple' | 'green') => {
    switch (color) {
      case 'cyan':
        return 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30';
      case 'purple':
        return 'bg-[#b000ff]/10 text-purple-300 border-[#b000ff]/30';
      case 'green':
        return 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30';
    }
  };

  const currentPeriodObj = COSMIC_PERIODS.find((p) => p.id === selectedPeriod);

  return (
    <section id="icerik-alani" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Category Nav Filters Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-slate-800/80 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00f0ff] uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
            <span>Kozmik Bilgi Matrisi</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-bold tracking-wide text-white">
            Öne Çıkan Keşifler & Doktrinler
          </h2>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            id="filter-all"
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider transition-all duration-300 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#00f0ff] text-black font-semibold shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                : 'bg-[#080d19]/80 text-slate-300 border border-slate-800 hover:border-[#00f0ff]/40 hover:text-[#00f0ff]'
            }`}
          >
            Tüm Külliyat
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`filter-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#b000ff] text-white font-semibold shadow-[0_0_20px_rgba(176,0,255,0.6)]'
                  : 'bg-[#080d19]/80 text-slate-300 border border-slate-800 hover:border-[#b000ff]/40 hover:text-white'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Horizontal Scroll Cosmic Timeline */}
      <CosmicTimeline
        periods={COSMIC_PERIODS}
        selectedPeriod={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
        articleCountByPeriod={articleCountByPeriod}
      />

      {/* Category Pillars (Quick Architecture Display - visible on all categories) */}
      {selectedCategory === 'all' && selectedPeriod === 'all' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {categories.map((cat) => (
            <div
              key={cat.id}
              id={`category-card-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`group relative rounded-2xl p-6 bg-[#060a14]/70 backdrop-blur-xl border transition-all duration-500 cursor-pointer flex flex-col justify-between overflow-hidden ${getCardBorderClass(
                cat.color
              )}`}
            >
              {/* Background faint glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00f0ff]/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0a1020] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getCategoryIcon(cat.id)}
                  </div>
                  <span className="text-[10px] font-mono tracking-wider text-slate-400 border border-slate-800 rounded px-2 py-0.5">
                    {cat.stats}
                  </span>
                </div>

                <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-[#00f0ff] transition-colors mb-1.5">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#00f0ff]/80 font-mono mb-3">
                  {cat.subtitle}
                </p>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-light">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 group-hover:text-[#00f0ff] transition-colors">
                <span>Konuları İncele</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Filter Indicators Header */}
      {(selectedPeriod !== 'all' || selectedCategory !== 'all' || searchQuery.trim() !== '') && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 p-4 rounded-2xl bg-[#070b16]/70 border border-[#00f0ff]/20">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono">Filtrelenen Sonuçlar:</span>
            {selectedPeriod !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] font-mono">
                <span>Dönem: {currentPeriodObj?.name}</span>
                <button
                  onClick={() => setSelectedPeriod('all')}
                  className="hover:text-white ml-1 cursor-pointer"
                  title="Dönem filtresini kaldır"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b000ff]/15 border border-[#b000ff]/40 text-purple-200 font-mono">
                <span>Kategori: {categories.find((c) => c.id === selectedCategory)?.name}</span>
                <button
                  onClick={() => onSelectCategory('all')}
                  className="hover:text-white ml-1 cursor-pointer"
                  title="Kategori filtresini kaldır"
                >
                  ×
                </button>
              </span>
            )}
            {searchQuery.trim() !== '' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-200 font-mono">
                <span>Arama: "{searchQuery}"</span>
              </span>
            )}
            <span className="text-slate-500 font-mono text-[11px] ml-1">
              ({filteredArticles.length} makale listeleniyor)
            </span>
          </div>

          <button
            onClick={() => {
              onSelectCategory('all');
              setSelectedPeriod('all');
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tüm Filtreleri Temizle</span>
          </button>
        </div>
      )}

      {/* Articles Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredArticles.map((article) => {
          const category = categories.find((c) => c.id === article.categoryId);
          const color = category ? category.color : 'cyan';

          return (
            <article
              key={article.id}
              id={`article-card-${article.id}`}
              className={`group relative rounded-2xl overflow-hidden bg-[#060913]/80 backdrop-blur-xl border transition-all duration-500 flex flex-col justify-between ${getCardBorderClass(
                color
              )}`}
            >
              {/* Card Image Area with Glassmorphism Overlays */}
              <div className="relative h-60 w-full overflow-hidden bg-[#020408]">
                <img
                  src={article.image}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-black/30 pointer-events-none" />

                {/* Top Overlay Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span
                    className={`text-[11px] font-mono tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md ${getTagColorClass(
                      color
                    )}`}
                  >
                    {article.tag}
                  </span>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#030508]/80 border border-slate-700/70 text-[11px] font-mono text-purple-300 backdrop-blur-md">
                    <Activity className="w-3 h-3 text-[#b000ff]" />
                    <span>{article.frequency}</span>
                  </div>
                </div>

                {/* Category Pill and Temporal Era on bottom of image */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs tracking-wider uppercase font-cinzel text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {article.categoryName}
                  </span>
                  <span className="text-[10px] font-mono text-[#00f0ff] bg-black/70 px-2 py-0.5 rounded border border-[#00f0ff]/30 backdrop-blur-md">
                    {article.periodEra}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white group-hover:text-[#00f0ff] transition-colors duration-300 mb-3 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-sm text-slate-300/80 leading-relaxed font-light mb-6">
                    {article.excerpt}
                  </p>

                  {/* Micro Highlights */}
                  <div className="space-y-2 mb-6">
                    {article.highlights.slice(0, 2).map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] mt-1.5 shrink-0" />
                        <span className="line-clamp-2">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-5 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {article.readTime}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenArticle(article)}
                    className="flex items-center gap-2 text-xs font-medium tracking-wider text-[#00f0ff] group-hover:text-white group-hover:bg-[#00f0ff]/20 px-3.5 py-1.5 rounded-full border border-[#00f0ff]/30 hover:border-[#00f0ff] transition-all cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.15)]"
                  >
                    <span>Yazıyı İncele</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-16 bg-[#080d19]/40 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm mb-4">
            Aradığınız kriterlere uygun kozmik metin bulunamadı.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {selectedPeriod !== 'all' && (
              <button
                onClick={() => setSelectedPeriod('all')}
                className="px-4 py-2 rounded-full text-xs text-amber-300 border border-amber-400/40 hover:bg-amber-400/10 cursor-pointer transition-all"
              >
                Kozmik Dönem Filtresini Sıfırla
              </button>
            )}
            {selectedCategory !== 'all' && (
              <button
                onClick={() => onSelectCategory('all')}
                className="px-4 py-2 rounded-full text-xs text-purple-300 border border-purple-400/40 hover:bg-purple-400/10 cursor-pointer transition-all"
              >
                Kategori Filtresini Sıfırla
              </button>
            )}
            <button
              onClick={() => {
                onSelectCategory('all');
                setSelectedPeriod('all');
              }}
              className="px-4 py-2 rounded-full text-xs text-[#00f0ff] border border-[#00f0ff]/40 hover:bg-[#00f0ff]/10 cursor-pointer transition-all"
            >
              Tüm Külliyatı Göster
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
