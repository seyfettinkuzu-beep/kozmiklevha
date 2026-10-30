// Basit hash yönlendirici: GitHub Pages'te sunucu ayarı gerektirmez.
// #/              → ana sayfa
// #/yazi/:id      → yazı sayfası
// #/kategori/:id  → kategori sayfası
// #/hakkinda      → hakkında
import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'article'; id: string }
  | { name: 'category'; id: string }
  | { name: 'about' };

const parse = (): Route => {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (parts[0] === 'yazi' && parts[1]) return { name: 'article', id: parts[1] };
  if (parts[0] === 'kategori' && parts[1]) return { name: 'category', id: parts[1] };
  if (parts[0] === 'hakkinda') return { name: 'about' };
  return { name: 'home' };
};

export const useRoute = () => {
  const [route, setRoute] = useState<Route>(parse);
  useEffect(() => {
    const onChange = () => {
      setRoute(parse());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
};

export const links = {
  home: '#/',
  article: (id: string) => `#/yazi/${encodeURIComponent(id)}`,
  category: (id: string) => `#/kategori/${encodeURIComponent(id)}`,
  about: '#/hakkinda',
};
