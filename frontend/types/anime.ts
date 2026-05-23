export interface ANNAnimeInfo {
  "#text"?: string;
  type: string;
  lang?: string;
  src?: string;
  img?: {
    src: string;
    width: string;
    height: string;
  };
}

export interface ANNDetailsParsed {
  id: string;
  name: string;
  type: string;
  info?: ANNAnimeInfo | ANNAnimeInfo[];
  [key: string]: any;
}

export interface FeaturedAnime {
  id: string;
  category: string;
  icon: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readingTime: number;
  image?: string;
  genres: string[];
  precision?: string;
}
