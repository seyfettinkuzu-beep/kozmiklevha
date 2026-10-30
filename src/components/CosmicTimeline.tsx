import React, { useRef, useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Orbit,
  Flame,
  Sparkles,
  Radio,
  Dna,
  BrainCircuit,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { CosmicPeriod, CosmicPeriodId } from '../types';

interface CosmicTimelineProps {
  periods: CosmicPeriod[];
  selectedPeriod: CosmicPeriodId;
  onSelectPeriod: (id: CosmicPeriodId) => void;
  articleCountByPeriod: Record<string, number>;
}

export const CosmicTimeline: React.FC<CosmicTimelineProps> = ({
  periods,
  selectedPeriod,
  onSelectPeriod,
  articleCountByPeriod,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [periods]);

  // Scroll active item into view smoothly on change
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector<HTMLElement>(`[data-period-id="${selectedPeriod}"]`);
      if (activeEl) {
        const container = scrollContainerRef.current;
        const targetScroll = activeEl.offsetLeft - container.clientWidth / 2 + activeEl.clientWidth / 2;
        container.scrollTo({
          left: Math.max(0, targetScroll),
          behavior: 'smooth',
        });
      }
    }
    checkScroll();
  }, [selectedPeriod]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 350);
    }
  };

  // Mouse drag-to-scroll implementation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
    checkScroll();
  };

  const getPeriodIcon = (id: CosmicPeriodId, isSelected: boolean) => {
    const size = "w-5 h-5";
    switch (id) {
      case 'all':
        return <Orbit className={`${size} ${isSelected ? 'text-[#cdb88a]' : 'text-slate-400'}`} />;
      case 'primordial':
        return <Flame className={`${size} ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />;
      case 'stelliferous':
        return <Sparkles className={`${size} ${isSelected ? 'text-[#cdb88a]' : 'text-slate-400'}`} />;
      case 'planetary':
        return <Radio className={`${size} ${isSelected ? 'text-[#8e9cc4]' : 'text-slate-400'}`} />;
      case 'biophotonic':
        return <Dna className={`${size} ${isSelected ? 'text-[#9fb8a3]' : 'text-slate-400'}`} />;
      case 'neural':
        return <BrainCircuit className={`${size} ${isSelected ? 'text-[#cdb88a]' : 'text-slate-400'}`} />;
    }
  };

  const currentPeriodObj = periods.find((p) => p.id === selectedPeriod) || periods[0];

  return (
    <div className="relative mb-14 rounded-3xl bg-[#050813]/80 border border-[#cdb88a]/20 p-5 sm:p-7 backdrop-blur-2xl overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 left-1/3 w-96 h-96 bg-[#cdb88a]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-[#8e9cc4]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header of the Timeline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#cdb88a] uppercase mb-1">
            <Clock className="w-3.5 h-3.5 text-[#cdb88a]" />
            <span>Kozmik Evrim Çizelgesi</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">13.8 Milyar Yıllık Süreç</span>
          </div>
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wide text-white">
            Kozmik Zaman Döngüleri ile Filtrele
          </h3>
        </div>

        {/* Scroll Navigation Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {selectedPeriod !== 'all' && (
            <button
              onClick={() => onSelectPeriod('all')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-[#cdb88a] bg-white/5 hover:bg-[#cdb88a]/10 border border-white/10 hover:border-[#cdb88a]/40 transition-all cursor-pointer mr-2"
              title="Tüm dönemleri göster"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Sıfırla</span>
            </button>
          )}

          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Zaman çizelgesini sola kaydır"
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              canScrollLeft
                ? 'bg-[#090e1c] border-[#cdb88a]/40 text-[#cdb88a] hover:bg-[#cdb88a]/20'
                : 'bg-black/30 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Zaman çizelgesini sağa kaydır"
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              canScrollRight
                ? 'bg-[#090e1c] border-[#cdb88a]/40 text-[#cdb88a] hover:bg-[#cdb88a]/20'
                : 'bg-black/30 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track Container */}
      <div className="relative py-4">
        {/* Continuous Horizontal Timeline Backbone Line */}
        <div className="absolute top-[68px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-slate-800 to-transparent pointer-events-none" />

        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          className={`flex items-stretch gap-4 sm:gap-6 overflow-x-auto pb-5 pt-2 select-none no-scrollbar cursor-grab active:cursor-grabbing scroll-smooth relative z-10 ${
            isDragging ? 'cursor-grabbing' : ''
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {periods.map((period, idx) => {
            const isSelected = selectedPeriod === period.id;
            const articleCount =
              period.id === 'all'
                ? Object.values(articleCountByPeriod).reduce<number>((a, b) => a + (Number(b) || 0), 0)
                : articleCountByPeriod[period.id] || 0;

            // Specific glow styling based on period
            const getGlowStyles = () => {
              if (!isSelected) {
                return {
                  cardBorder: 'border-slate-800/80 hover:border-slate-600',
                  cardBg: 'bg-[#060a16]/60 hover:bg-[#090f20]/70',
                  nodeRing: 'border-slate-700 bg-[#080d1a] text-slate-400 group-hover:border-slate-400',
                  badge: 'text-slate-400 bg-white/5 border-slate-800',
                  accentText: 'text-slate-300',
                };
              }

              switch (period.color) {
                case 'amber':
                  return {
                    cardBorder: 'border-amber-500/60',
                    cardBg: 'bg-gradient-to-b from-[#1c1208]/90 to-[#0c0905]/95',
                    nodeRing: 'border-amber-400 bg-amber-500/20 text-amber-300 scale-110',
                    badge: 'text-amber-300 bg-amber-500/20 border-amber-400/50',
                    accentText: 'text-amber-200',
                  };
                case 'purple':
                  return {
                    cardBorder: 'border-[#8e9cc4]/60',
                    cardBg: 'bg-gradient-to-b from-[#160824]/90 to-[#0b0514]/95',
                    nodeRing: 'border-[#8e9cc4] bg-[#8e9cc4]/20 text-slate-200 scale-110',
                    badge: 'text-slate-300 bg-[#8e9cc4]/20 border-[#8e9cc4]/50',
                    accentText: 'text-slate-200',
                  };
                case 'green':
                  return {
                    cardBorder: 'border-[#9fb8a3]/60',
                    cardBg: 'bg-gradient-to-b from-[#081a13]/90 to-[#040f0a]/95',
                    nodeRing: 'border-[#9fb8a3] bg-[#9fb8a3]/20 text-[#9fb8a3] scale-110',
                    badge: 'text-[#9fb8a3] bg-[#9fb8a3]/20 border-[#9fb8a3]/50',
                    accentText: 'text-[#9fb8a3]',
                  };
                case 'cyan':
                default:
                  return {
                    cardBorder: 'border-[#cdb88a]/60',
                    cardBg: 'bg-gradient-to-b from-[#081524]/90 to-[#040c14]/95',
                    nodeRing: 'border-[#cdb88a] bg-[#cdb88a]/20 text-[#cdb88a] scale-110',
                    badge: 'text-[#cdb88a] bg-[#cdb88a]/20 border-[#cdb88a]/50',
                    accentText: 'text-[#cdb88a]',
                  };
              }
            };

            const styles = getGlowStyles();

            return (
              <div
                key={period.id}
                data-period-id={period.id}
                onClick={() => onSelectPeriod(period.id)}
                className={`group relative flex-shrink-0 w-64 sm:w-72 rounded-2xl p-4 sm:p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${styles.cardBg} ${styles.cardBorder}`}
              >
                {/* Active Sleek Glowing Indicator Laser Line */}
                {isSelected && (
                  <div className="absolute -top-[1px] left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#cdb88a] to-transparent" />
                )}

                {/* Top Timeline Node & Year Tag */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  {/* Glowing Node Button */}
                  <div
                    className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 relative ${styles.nodeRing}`}
                  >
                    {getPeriodIcon(period.id, isSelected)}
                    {isSelected && (
                      <span className="absolute inset-0 rounded-full opacity-40 bg-current pointer-events-none" />
                    )}
                  </div>

                  {/* Temporal Range Badge */}
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border ${styles.badge}`}
                    >
                      {period.temporalRange}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 mt-1">
                      {articleCount} Metin
                    </span>
                  </div>
                </div>

                {/* Middle Content */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      {idx === 0 ? 'Genel Bakış' : `Evre 0${idx}`}
                    </span>
                  </div>
                  <h4
                    className={`font-cinzel text-base font-bold transition-colors ${
                      isSelected ? styles.accentText : 'text-white group-hover:text-[#cdb88a]'
                    }`}
                  >
                    {period.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 font-light leading-relaxed">
                    {period.tagline}
                  </p>
                </div>

                {/* Active Glowing Indicator Indicator Dot/Pill */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className={isSelected ? styles.accentText : 'text-slate-400 group-hover:text-slate-300'}>
                    {isSelected ? '● Seçili Dönem' : '○ Döneme Git'}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-current" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sleek Indicator & Readout Strip */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#cdb88a]" />
          <span className="text-slate-400 font-mono">Aktif Kozmik Katman:</span>
          <span className="text-white font-semibold font-cinzel tracking-wide">
            {currentPeriodObj.name}
          </span>
          <span className="hidden md:inline text-slate-600">•</span>
          <span className="hidden md:inline text-slate-400 font-light truncate max-w-md">
            {currentPeriodObj.description}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-[#cdb88a] bg-[#cdb88a]/10 px-3 py-1 rounded-full border border-[#cdb88a]/30">
          <span>{currentPeriodObj.temporalRange}</span>
        </div>
      </div>
    </div>
  );
};
