import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, Activity, Radio, BrainCircuit, Dna } from 'lucide-react';
import { CategoryId } from '../types';

interface FooterProps {
  onSelectCategory: (cat: CategoryId | 'all') => void;
  onOpenFrequencyConsole: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onSelectCategory, 
  onOpenFrequencyConsole,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="relative mt-24 border-t border-[#00f0ff]/15 bg-[#020408]/90 backdrop-blur-xl">
      {/* Background glow banner */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/40 to-transparent shadow-[0_0_15px_#00f0ff]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand & Manifesto Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border border-[#00f0ff]/40 shadow-[0_0_12px_rgba(0,240,255,0.4)] bg-[#050912]">
                <Sparkles className="w-4 h-4 text-[#00f0ff]" />
              </div>
              <span className="font-cinzel text-xl font-bold tracking-[0.2em] text-white">
                KOZMİK LEVHA
              </span>
            </div>

            <p className="text-sm text-slate-400 font-light leading-relaxed max-w-md">
              Nöron ağları ile galaktik iplikçiklerin, biyofotonik hücresel ışımayla elektromanyetik rezonansın kesişim noktasında duran modern kozmik idrak platformu.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-[#00ff88]">
                <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                Matris Frekansı: 432 Hz
              </span>
              <span>•</span>
              <span className="text-[#00f0ff]">Rezonans Aktif</span>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-cinzel text-sm font-bold tracking-wider text-white">
              Doktrin ve Kategoriler
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onSelectCategory('neuro')}
                  className="hover:text-[#00f0ff] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>NöroKozmos (Beyin & Galaksi)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('biology')}
                  className="hover:text-[#00ff88] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Dna className="w-3.5 h-3.5 text-[#00ff88]" />
                  <span>Kozmik Biyoloji (Biyofotonik)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('resonance')}
                  className="hover:text-[#b000ff] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5 text-[#b000ff]" />
                  <span>Frekans & Rezonans (Schumann)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('alchemy')}
                  className="hover:text-[#00f0ff] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>Mistik Kimya (Yıldız Tozu)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFrequencyConsole}
                  className="hover:text-purple-300 transition-colors flex items-center gap-2 cursor-pointer text-purple-400 pt-1"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Frekans & Rezonans Sentezleyici</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-cinzel text-sm font-bold tracking-wider text-white">
              Kozmik Bülten & İletim
            </h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Evrensel fraktal araştırmalar, biyofoton analizleri ve frekans haritaları düzenli olarak e-posta kutunuza iletilsin.
            </p>

            {subscribed ? (
              <div className="p-3.5 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center gap-2 text-xs text-[#00ff88]">
                <Check className="w-4 h-4 shrink-0" />
                <span>Kozmik frekans ağına başarıyla kaydoldunuz.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Kozmik koordinat (e-posta)..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-[#090d18] border border-slate-800 focus:border-[#00f0ff] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00f0ff] hover:bg-white text-black text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                >
                  <span>Katıl</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright & coordinates */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} KOZMİK LEVHA — Tüm Kozmik Hakları Saklıdır.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition-colors">Galaktik Koordinat: Orion Kolu 0.001AU</span>
            <span>•</span>
            <span className="text-[#00f0ff]/70">Derin Uzay Sürümü v2.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
