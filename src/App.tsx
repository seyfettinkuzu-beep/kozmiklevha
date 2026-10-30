import React, { useEffect, useState } from 'react';
import { FrequencyConsole, useAmbient } from './components/FrequencyConsole';
import { ambient } from './audio/ambientEngine';
import { ARTICLES, CATEGORIES } from './data/cosmicData';
import { useRoute } from './blog/router';
import { Header } from './blog/Header';
import { AboutPage, ArticlePage, CategoryPage, HomePage, SiteFooter } from './blog/pages';

const SITE = 'Kozmik Levha';

export default function App() {
  const route = useRoute();
  const [query, setQuery] = useState('');
  const [roomOpen, setRoomOpen] = useState(false);
  const audio = useAmbient();

  const toggleAudio = () => {
    if (audio.playing) ambient.stop();
    else ambient.startMood('sakin');
  };

  // Sekme başlığı sayfaya göre değişsin (paylaşımda ve geçmişte anlamlı görünür)
  useEffect(() => {
    let title = `${SITE} — Gizemli bilgilerin defteri`;
    if (route.name === 'article') {
      const a = ARTICLES.find((x) => x.id === route.id);
      if (a) title = `${a.title} | ${SITE}`;
    } else if (route.name === 'category') {
      const c = CATEGORIES.find((x) => x.id === route.id);
      if (c) title = `${c.name} | ${SITE}`;
    } else if (route.name === 'about') {
      title = `Hakkında | ${SITE}`;
    }
    document.title = title;
  }, [route]);

  const openRoom = () => setRoomOpen(true);
  // Ana sayfa ve yazı sayfaları en üstte video/görselle başlar; menü onun üzerine biner
  const overlay = (route.name === 'home' && !query.trim()) || route.name === 'article';

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header
        route={route}
        query={query}
        onQuery={setQuery}
        onOpenRoom={openRoom}
        audioOn={audio.playing}
        onToggleAudio={toggleAudio}
        overlay={overlay}
      />
      <main className={`flex-1 ${overlay ? '' : 'pt-[67px] sm:pt-[73px]'}`}>
        {route.name === 'home' && <HomePage query={query} onOpenRoom={openRoom} />}
        {route.name === 'article' && <ArticlePage id={route.id} />}
        {route.name === 'category' && <CategoryPage id={route.id} onOpenRoom={openRoom} />}
        {route.name === 'about' && <AboutPage />}
      </main>
      <SiteFooter />
      <FrequencyConsole isOpen={roomOpen} onClose={() => setRoomOpen(false)} />
    </div>
  );
}
