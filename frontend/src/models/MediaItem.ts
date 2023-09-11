import moment from 'moment';
import { Subtitle, SubtitleEntry } from './Subtitle';
import Topic from './Topic';

export type MediaItemType = 'video' | 'article';

export type MediaItemState = 'pending' | 'processing' | 'processed' | 'failed';

export const ISO639_1 = {
  ab: 'Abkhazian',
  aa: 'Afar',
  af: 'Afrikaans',
  ak: 'Akan',
  sq: 'Albanian',
  am: 'Amharic',
  ar: 'Arabic',
  an: 'Aragonese',
  hy: 'Armenian',
  as: 'Assamese',
  av: 'Avaric',
  ae: 'Avestan',
  ay: 'Aymara',
  az: 'Azerbaijani',
  bm: 'Bambara',
  ba: 'Bashkir',
  eu: 'Basque',
  be: 'Belarusian',
  bn: 'Bengali',
  bh: 'Bihari languages',
  bi: 'Bislama',
  nb: 'Norwegian Bokmål',
  bs: 'Bosnian',
  br: 'Breton',
  bg: 'Bulgarian',
  my: 'Burmese',
  es: 'Spanish',
  ca: 'Valencian',
  km: 'Central Khmer',
  ch: 'Chamorro',
  ce: 'Chechen',
  ny: 'Nyanja',
  zh: 'Chinese',
  za: 'Zhuang',
  cu: 'Old Slavonic',
  cv: 'Chuvash',
  kw: 'Cornish',
  co: 'Corsican',
  cr: 'Cree',
  hr: 'Croatian',
  cs: 'Czech',
  da: 'Danish',
  dv: 'Maldivian',
  nl: 'Flemish',
  dz: 'Dzongkha',
  en: 'English',
  eo: 'Esperanto',
  et: 'Estonian',
  ee: 'Ewe',
  fo: 'Faroese',
  fj: 'Fijian',
  fi: 'Finnish',
  fr: 'French',
  ff: 'Fulah',
  gd: 'Scottish Gaelic',
  gl: 'Galician',
  lg: 'Ganda',
  ka: 'Georgian',
  de: 'German',
  ki: 'Kikuyu',
  el: 'Greek, Modern (1453-)',
  kl: 'Kalaallisut',
  gn: 'Guarani',
  gu: 'Gujarati',
  ht: 'Haitian Creole',
  ha: 'Hausa',
  he: 'Hebrew',
  hz: 'Herero',
  hi: 'Hindi',
  ho: 'Hiri Motu',
  hu: 'Hungarian',
  is: 'Icelandic',
  io: 'Ido',
  ig: 'Igbo',
  id: 'Indonesian',
  ia: 'Interlingua (International Auxiliary Language Association)',
  ie: 'Occidental',
  iu: 'Inuktitut',
  ik: 'Inupiaq',
  ga: 'Irish',
  it: 'Italian',
  ja: 'Japanese',
  jv: 'Javanese',
  kn: 'Kannada',
  kr: 'Kanuri',
  ks: 'Kashmiri',
  kk: 'Kazakh',
  rw: 'Kinyarwanda',
  ky: 'Kyrgyz',
  kv: 'Komi',
  kg: 'Kongo',
  ko: 'Korean',
  kj: 'Kwanyama',
  ku: 'Kurdish',
  lo: 'Lao',
  la: 'Latin',
  lv: 'Latvian',
  lb: 'Luxembourgish',
  li: 'Limburgish',
  ln: 'Lingala',
  lt: 'Lithuanian',
  lu: 'Luba-Katanga',
  mk: 'Macedonian',
  mg: 'Malagasy',
  ms: 'Malay',
  ml: 'Malayalam',
  mt: 'Maltese',
  gv: 'Manx',
  mi: 'Maori',
  mr: 'Marathi',
  mh: 'Marshallese',
  ro: 'Romanian',
  mn: 'Mongolian',
  na: 'Nauru',
  nv: 'Navajo',
  nd: 'North Ndebele',
  nr: 'South Ndebele',
  ng: 'Ndonga',
  ne: 'Nepali',
  se: 'Northern Sami',
  no: 'Norwegian',
  nn: 'Nynorsk, Norwegian',
  ii: 'Sichuan Yi',
  oc: 'Occitan (post 1500)',
  oj: 'Ojibwa',
  or: 'Oriya',
  om: 'Oromo',
  os: 'Ossetic',
  pi: 'Pali',
  pa: 'Punjabi',
  ps: 'Pushto',
  fa: 'Persian',
  pl: 'Polish',
  pt: 'Portuguese',
  qu: 'Quechua',
  rm: 'Romansh',
  rn: 'Rundi',
  ru: 'Russian',
  sm: 'Samoan',
  sg: 'Sango',
  sa: 'Sanskrit',
  sc: 'Sardinian',
  sr: 'Serbian',
  sn: 'Shona',
  sd: 'Sindhi',
  si: 'Sinhalese',
  sk: 'Slovak',
  sl: 'Slovenian',
  so: 'Somali',
  st: 'Sotho, Southern',
  su: 'Sundanese',
  sw: 'Swahili',
  ss: 'Swati',
  sv: 'Swedish',
  tl: 'Tagalog',
  ty: 'Tahitian',
  tg: 'Tajik',
  ta: 'Tamil',
  tt: 'Tatar',
  te: 'Telugu',
  th: 'Thai',
  bo: 'Tibetan',
  ti: 'Tigrinya',
  to: 'Tonga (Tonga Islands)',
  ts: 'Tsonga',
  tn: 'Tswana',
  tr: 'Turkish',
  tk: 'Turkmen',
  tw: 'Twi',
  ug: 'Uyghur',
  uk: 'Ukrainian',
  ur: 'Urdu',
  uz: 'Uzbek',
  ve: 'Venda',
  vi: 'Vietnamese',
  vo: 'Volapük',
  wa: 'Walloon',
  cy: 'Welsh',
  fy: 'Western Frisian',
  wo: 'Wolof',
  xh: 'Xhosa',
  yi: 'Yiddish',
  yo: 'Yoruba',
  zu: 'Zulu',
};

class MediaItem {
  public id: string;

  public title: string;

  public url: string;

  public item_type: MediaItemType;

  public state: MediaItemState;

  public published_at: moment.Moment;

  public video_url?: string;

  public thumbnail_url?: string;

  public subtitles: Subtitle[];

  public transcript: SubtitleEntry[];

  public metadata?: { [key: string]: any };

  public topics: Topic[];

  constructor(json: any) {
    this.id = json.id;
    this.title = json.title;
    this.url = json.url;
    this.item_type = json.item_type;
    this.state = json.state;

    this.published_at = moment(json.published_at);
    this.video_url = json.video_url;
    this.thumbnail_url = json.thumbnail_url;

    this.topics = [];

    if (json.topics) {
      this.topics = json.topics;
    }

    this.subtitles = json.subtitle_urls.map(surl => {
      const parts = surl.split('.');
      parts.pop();
      const langPart = parts.pop();
      const lang = langPart.split('-')[0];

      return {
        url: surl,
        languageCode: lang,
        languageLabel: ISO639_1[lang],
      };
    });

    this.transcript = json.transcript;
    this.metadata = json.metadata || {};
  }
}

export default MediaItem;
