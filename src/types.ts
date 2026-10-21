export type CategoryId = 'neuro' | 'biology' | 'resonance' | 'alchemy';

export interface Category {
  id: CategoryId;
  name: string;
  subtitle: string;
  description: string;
  color: 'cyan' | 'purple' | 'green';
  accentColorHex: string;
  iconName: string;
  image: string;
  stats: string;
}

export interface Article {
  id: string;
  categoryId: CategoryId;
  categoryName: string;
  title: string;
  excerpt: string;
  content: string[];
  readTime: string;
  frequency: string;
  author: string;
  date: string;
  image: string;
  highlights: string[];
  tag: string;
}

export interface ResonanceTrack {
  id: string;
  name: string;
  freq: number;
  description: string;
  targetCategory: CategoryId;
  harmonicNote: string;
}
