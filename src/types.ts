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

export type CosmicPeriodId = 'all' | 'primordial' | 'stelliferous' | 'planetary' | 'biophotonic' | 'neural';

export interface CosmicPeriod {
  id: CosmicPeriodId;
  name: string;
  temporalRange: string;
  tagline: string;
  description: string;
  color: 'cyan' | 'purple' | 'green' | 'amber';
  accentColorHex: string;
  glowColor: string;
}

export interface Article {
  id: string;
  categoryId: CategoryId;
  categoryName: string;
  periodId: CosmicPeriodId;
  periodEra: string;
  title: string;
  excerpt: string;
  content: string[];
  readTime: string;
  frequency: string;
  author: string;
  date: string;
  image: string;
  /** Görsel künyesi (kaynak ve lisans) */
  credit?: string;
  /** Manşette görsel yerine oynayan sessiz döngü video (public/ altındaki yollar) */
  video?: { mp4: string; webm?: string; poster: string; credit: string };
  highlights: string[];
  tag: string;
  /** bilim: yerleşik bilgi · yorum: bilimsel bulgu + yorum · dusunce: spekülatif/felsefi */
  nature?: 'bilim' | 'yorum' | 'dusunce';
}

export interface ResonanceTrack {
  id: string;
  name: string;
  freq: number;
  description: string;
  targetCategory: CategoryId;
  harmonicNote: string;
}
