// Ruh hali tanımları: her biri akor dizisi, tempo ve katman ayarlarıyla
// tarayıcıda canlı üretilen bir ambient müzik "tarifi"dir.

export type MoodId = 'sakin' | 'odak' | 'motivasyon' | 'huzun' | 'uyku';

export type PulseStyle = 'none' | 'heartbeat' | 'soft' | 'drive';
export type NatureStyle = 'none' | 'rain' | 'waves';
export type MelodyStyle = 'bell' | 'piano';

export interface Mood {
  id: MoodId;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  bpm: number;
  barsPerChord: number;
  /** Akorlar MIDI nota numaraları olarak (en alttaki nota bas sesidir). */
  chords: number[][];
  /** Melodinin gezindiği dizi notaları (MIDI). */
  melodyScale: number[];
  melodyStyle: MelodyStyle;
  /** Her vuruşta melodi notası çalma olasılığı. */
  melodyChance: number;
  /** Sekizlik arpej (akor notalarını sırayla çalma). */
  arpeggio: boolean;
  pulse: PulseStyle;
  bassPulse: boolean;
  padBrightness: number;
  padWave: OscillatorType;
  nature: NatureStyle;
  /** Kulaklıkla dinlenen binaural ritim farkı (Hz). */
  binauralBeat: number;
  binauralCarrier: number;
  defaults: { pulse: boolean; melody: boolean; nature: boolean; binaural: boolean };
  /** Bu sesin insana nasıl tesir ettiği (sade ve dürüst anlatım). */
  effectTitle: string;
  effects: { title: string; text: string }[];
  /** Duyguya eşlik eden sözler (özgün). */
  words: string[];
}

export const MOODS: Mood[] = [
  {
    id: 'sakin',
    name: 'Sakin',
    tagline: 'Dalga sesi · 60 vuruş · yumuşak akorlar',
    description: 'Kalp atışına yakın yavaş bir nabız, majör-7 akorlar ve uzaktan gelen çan sesleri. Gevşemek, nefes almak için.',
    accent: '#8fb3c4',
    bpm: 60,
    barsPerChord: 2,
    chords: [
      [50, 57, 61, 64], // Dmaj9
      [43, 50, 54, 57, 59], // Gmaj9
      [47, 54, 57, 62], // Bm7
      [45, 52, 59, 61], // Aadd9
    ],
    melodyScale: [74, 76, 78, 81, 83, 86, 88],
    melodyStyle: 'bell',
    melodyChance: 0.22,
    arpeggio: false,
    pulse: 'heartbeat',
    bassPulse: false,
    padBrightness: 900,
    padWave: 'sawtooth',
    nature: 'waves',
    binauralBeat: 10,
    binauralCarrier: 50,
    defaults: { pulse: true, melody: true, nature: true, binaural: false },
    effectTitle: 'Yavaş ritim, yavaşlayan nefes',
    effects: [
      { title: 'Tempo nefesi sürükler', text: 'Dakikada 60 vuruş, dinlenen bir kalbin hızına yakındır. Beden yavaş bir ritme kendiliğinden uyum sağlamaya meyillidir; nefes uzar, omuzlar iner.' },
      { title: 'Sürpriz yok, tehlike yok', text: 'Akorlar yumuşakça birbirine geçer, ani ses yoktur. Beyin çevreyi sürekli tehlikeye karşı tarar; tahmin edilebilir sesler ona "her şey yolunda" der.' },
      { title: 'Dalga sesi zihni boşaltır', text: 'Düzenli kabarıp çekilen dalga sesi, dikkatini dağıtan diğer küçük sesleri örter ve düşüncelerin arka plana çekilmesine yardım eder.' },
    ],
    words: [
      'Her şeyi bugün çözmek zorunda değilsin. Şu an sadece nefes al.',
      'Dalga gelir, dalga gider. Sen kıyısın; kalırsın.',
      'Yavaşlamak geri kalmak değildir. Bazen en hızlı yol, durup dinlemektir.',
      'Omuzlarını bırak. Taşıdığın yükün bir kısmını bu an yere koyabilirsin.',
      'Gökyüzü fırtınayı da taşır, maviliği de. İkisi de geçer, gökyüzü kalır.',
      'Bir nefes al, dört saniye tut, yavaşça bırak. Sakinlik bir yer değil, bir yoldur.',
    ],
  },
  {
    id: 'odak',
    name: 'Odak',
    tagline: 'Yağmur · 72 vuruş · düzenli arpej',
    description: 'Tekrar eden, şaşırtmayan bir arpej ve arkada yağmur. Dikkat dağıtmadan zihni meşgul tutan bir ses perdesi; çalışırken arka planda.',
    accent: '#9fb8a3',
    bpm: 72,
    barsPerChord: 2,
    chords: [
      [48, 55, 58, 62, 63], // Cm9
      [44, 51, 55, 60], // Abmaj7
      [51, 55, 58, 62], // Ebmaj7
      [46, 53, 60, 62], // Bbsus2
    ],
    melodyScale: [72, 75, 77, 79, 82, 84],
    melodyStyle: 'bell',
    melodyChance: 0.05,
    arpeggio: true,
    pulse: 'soft',
    bassPulse: false,
    padBrightness: 1100,
    padWave: 'triangle',
    nature: 'rain',
    binauralBeat: 14,
    binauralCarrier: 48,
    defaults: { pulse: false, melody: true, nature: true, binaural: false },
    effectTitle: 'Tahmin edilebilir ses, serbest kalan zihin',
    effects: [
      { title: 'Tekrar, dikkati korur', text: 'Arpej hep aynı düzende döner. Beyin onu kısa sürede çözer ve takip etmeyi bırakır; kalan dikkat işine kalır. Sözsüz müzik bu yüzden çalışırken daha az böler.' },
      { title: 'Yağmur, gürültüyü örter', text: 'Geniş frekanslı yağmur sesi, telefon titreşimi ya da uzaktaki konuşma gibi dikkat dağıtıcı sesleri yumuşak bir perdeyle kapatır.' },
      { title: 'Ritim bir saat gibi çalışır', text: 'Sabit tempo, zaman algısına bir çerçeve verir. Birçok kişi düzenli bir ritimle işe daha kolay başladığını ve daha uzun devam ettiğini fark eder.' },
    ],
    words: [
      'Tek bir iş. Tek bir adım. Şimdi sadece önündeki satır var.',
      'Odak bir kas gibidir; her geri dönüşte biraz daha güçlenir.',
      'Dağılan dikkatini suçlama, nazikçe geri çağır. Bu da odaklanmaktır.',
      'Büyük işler, küçük ve sıkıcı dakikaların toplamıdır.',
      'Şu an yaptığın şey, yarınki seni kuruyor.',
      'Kusursuz yapmaya değil, bitirmeye odaklan. Düzeltmek sonra gelir.',
    ],
  },
  {
    id: 'motivasyon',
    name: 'Motivasyon',
    tagline: 'Davul · 112 vuruş · yükselen majör',
    description: 'Her vuruşta kick davul, sekizlik bas ve I–V–vi–IV dizisi. Spor, yürüyüş ya da güne enerjik başlamak için.',
    accent: '#d4a35f',
    bpm: 112,
    barsPerChord: 2,
    chords: [
      [52, 59, 64, 68, 71], // E
      [47, 54, 59, 63, 66], // B
      [49, 56, 61, 64, 68], // C#m
      [45, 52, 57, 59, 61], // Aadd9
    ],
    melodyScale: [76, 78, 80, 83, 85, 88, 90],
    melodyStyle: 'bell',
    melodyChance: 0.3,
    arpeggio: true,
    pulse: 'drive',
    bassPulse: true,
    padBrightness: 1800,
    padWave: 'sawtooth',
    nature: 'none',
    binauralBeat: 18,
    binauralCarrier: 52,
    defaults: { pulse: true, melody: true, nature: false, binaural: false },
    effectTitle: 'Ritim bedeni harekete çağırır',
    effects: [
      { title: 'Vuruş, adımı çeker', text: 'Dakikada 110–130 vuruş tempolu yürüyüş ve koşu hızına yakındır. İnsanlar adımlarını farkında olmadan ritme uydurur; hareket kolaylaşır.' },
      { title: 'Müzik yorgunluğu örter', text: 'Spor sırasında ritmik müzik dinleyenler, aynı eforu daha az yorucu algıladıklarını söyler. Dikkat bedendeki sinyallerden müziğe kayar.' },
      { title: 'Majör ve yükselen dizi', text: 'I–V–vi–IV akor dizisi popüler marşların ve şarkıların iskeletidir. Kulağımız bu çözülmeleri "ilerleme" ve "zafer" duygusuyla ilişkilendirmeyi öğrenmiştir.' },
    ],
    words: [
      'Başlamak için hazır hissetmeyi bekleme. Başla, hazır olma hissi yolda gelir.',
      'Dün yapamadığın şey, bugün sadece bir deneme uzağında.',
      'Yorulduğunda durma, dinlen. Bırakmak başka, nefeslenmek başka.',
      'Kimse seni senin kadar iyi tanımıyor. Sınırlarını da sen çizmezsen kimse çizemez.',
      'Bir adım daha. Sonra bir adım daha. Dağlar böyle aşılır.',
      'Zorluk seni durdurmak için değil, ne kadar güçlü olduğunu göstermek için orada.',
      'Mükemmel gün yok. Sadece bugün var ve bugün yeterince iyi.',
    ],
  },
  {
    id: 'huzun',
    name: 'Hüzün',
    tagline: 'Yağmur · 64 vuruş · minör piyano',
    description: 'Minör akorlar ve seyrek piyano notaları. İçe dönmek, duygularla baş başa kalmak isteyenler için.',
    accent: '#a097c9',
    bpm: 64,
    barsPerChord: 2,
    chords: [
      [45, 52, 59, 60, 64], // Am(add9)
      [41, 48, 52, 57], // Fmaj7
      [48, 55, 59, 64], // Cmaj7
      [43, 50, 55, 59, 62], // G
    ],
    melodyScale: [69, 71, 72, 74, 76, 79, 81],
    melodyStyle: 'piano',
    melodyChance: 0.38,
    arpeggio: false,
    pulse: 'none',
    bassPulse: false,
    padBrightness: 750,
    padWave: 'sawtooth',
    nature: 'rain',
    binauralBeat: 6,
    binauralCarrier: 45,
    defaults: { pulse: false, melody: true, nature: true, binaural: false },
    effectTitle: 'Hüzünlü müzik neden iyi gelir?',
    effects: [
      { title: 'Duygu karşılık bulur', text: 'Üzgünken neşeli müzik çoğu zaman uzak gelir. Minör akorlar duygunu yansıttığında anlaşıldığını hissedersin; araştırmalar hüzünlü müziğin birçok kişiye teselli verdiğini gösteriyor.' },
      { title: 'Güvenli bir hüzün', text: 'Müzikteki hüzün gerçek bir kayıp taşımaz. Bu yüzden kişi duygusuna güvenle yaklaşabilir, ağlayabilir, rahatlayabilir. Buna "hüzünlü müzik paradoksu" denir.' },
      { title: 'Seyrek notalar, düşünmeye alan', text: 'Piyano notaları arasında bırakılan boşluklar, zihne kendi anılarını ve düşüncelerini yerleştirebileceği yer açar.' },
    ],
    words: [
      'Hüzün de bir misafirdir. Kapıyı açarsan oturur, dinlenir ve gider.',
      'Ağlamak zayıflık değil; kalbin kendini temizleme biçimidir.',
      'Kaybettiğin şeyi bu kadar özlüyorsan, onu ne kadar sevdiğindendir.',
      'Bugün iyi olmak zorunda değilsin. Sadece bugünü geçirmen yeterli.',
      'Yağmurdan sonra toprak daha güzel kokar.',
      'En karanlık gece bile sabahı durduramaz.',
    ],
  },
  {
    id: 'uyku',
    name: 'Uyku',
    tagline: 'Okyanus · çok yavaş · koyu tonlar',
    description: 'Ritimsiz, her 20 saniyede bir değişen derin akorlar ve uzaktan dalga sesi. Zamanlayıcıyla birlikte kullanın.',
    accent: '#7f8bb8',
    bpm: 48,
    barsPerChord: 4,
    chords: [
      [41, 48, 52, 55, 57], // Fmaj9
      [38, 45, 48, 52, 53], // Dm9
      [46, 53, 57, 62], // Bbmaj7
      [48, 55, 62, 65], // Csus
    ],
    melodyScale: [77, 79, 81, 84, 86],
    melodyStyle: 'bell',
    melodyChance: 0.07,
    arpeggio: false,
    pulse: 'none',
    bassPulse: false,
    padBrightness: 550,
    padWave: 'sawtooth',
    nature: 'waves',
    binauralBeat: 4,
    binauralCarrier: 41,
    defaults: { pulse: false, melody: true, nature: true, binaural: false },
    effectTitle: 'Yavaşlayan ses, gevşeyen beden',
    effects: [
      { title: 'Ritim yok, uyanıklık sinyali yok', text: 'Uyku modunda davul ya da belirgin vuruş yoktur. Beynin takip edeceği bir olay olmadığında dikkat kendiliğinden gevşer.' },
      { title: 'Okyanus sesi, gece seslerini örter', text: 'Yavaş dalga sesi, araba ya da kapı gibi ani gece seslerini maskeler. Düzenli arka plan sesi uykunun bölünmesini azaltabilir.' },
      { title: 'Zamanlayıcı ile yavaşça sessizlik', text: 'Ses son 30 saniyede kısılarak kapanır; ani bir kesinti seni uyandırmaz. 30 dakika çoğu kişi için yeterlidir.' },
    ],
    words: [
      'Bugün olanlar bugünde kaldı. Yarın yeni bir sayfa.',
      'Yapamadıklarını değil, yaptıklarını say. Bugün yeterince yaptın.',
      'Gözlerini kapat. Evren senin uykunda da dönmeye devam edecek.',
      'Dinlenmek de üretmektir; beden gece kendini onarır.',
      'Her nefeste biraz daha ağırlaş. Yatak seni taşıyor.',
      'İyi geceler. Yıldızlar nöbette.',
    ],
  },
];

export const getMood = (id: MoodId): Mood => MOODS.find((m) => m.id === id) ?? MOODS[0];
