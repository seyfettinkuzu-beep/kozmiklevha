import React from 'react';
import { X, Sparkles, Clock, User, Calendar, Activity, Share2, Check } from 'lucide-react';
import { Article } from '../types';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!article) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="article-reader-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl my-8 bg-[#050812] border border-[#cdb88a]/30 rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="saturate-[0.6] w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050812] via-[#050812]/50 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black text-slate-300 hover:text-white border border-white/20 transition-all cursor-pointer backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top badges */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-mono tracking-wider px-3 py-1 rounded-full bg-[#cdb88a]/20 text-[#cdb88a] border border-[#cdb88a]/40 backdrop-blur-md">
                {article.categoryName}
              </span>
              <span className="text-xs font-mono tracking-wider px-3 py-1 rounded-full bg-[#8e9cc4]/20 text-slate-300 border border-[#8e9cc4]/40 backdrop-blur-md flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#8e9cc4]" />
                {article.frequency}
              </span>
              <span className="text-xs font-mono tracking-wider px-3 py-1 rounded-full bg-black/70 text-[#9fb8a3] border border-[#9fb8a3]/40 backdrop-blur-md">
                {article.periodEra}
              </span>
            </div>

            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
              {article.title}
            </h2>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Metadata bar */}
          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pb-4 border-b border-slate-800 gap-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#cdb88a]" />
                {article.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {article.readTime}
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {article.date}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-[#cdb88a] text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#9fb8a3]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Bağlantı Kopyalandı' : 'Paylaş'}</span>
            </button>
          </div>

          {/* Key Findings Box */}
          <div className="p-5 rounded-2xl bg-[#0a0f20]/70 border border-[#cdb88a]/20">
            <h4 className="text-xs font-mono tracking-wider text-[#cdb88a] uppercase mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#9fb8a3]" />
              Temel Kozmik Bulgular
            </h4>
            <ul className="space-y-2.5">
              {article.highlights.map((h, i) => (
                <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#cdb88a] mt-2 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Full Narrative Content */}
          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            {article.content.map((paragraph, index) => (
              <p key={index} className="text-slate-300/90">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Quote / Manifesto Footer in article */}
          <div className="p-4 rounded-xl border-l-2 border-[#8e9cc4] bg-gradient-to-r from-[#8e9cc4]/10 to-transparent italic text-xs sm:text-sm text-slate-200">
            "Yukarıda olan neyse, aşağıda olan da odur; evrenin sınırsız derinlikleri, nöronlarımızdaki elektrik akımlarında kendi şarkısını fısıldar."
          </div>

          {/* Footer Action */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full text-xs font-medium tracking-wider bg-[#cdb88a] text-black hover:bg-white transition-all cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
