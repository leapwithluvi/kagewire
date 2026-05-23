export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image?: string;
  icon: string;
  author?: string;
  readingTime?: number; // dalam menit
  isFeatured?: boolean;
}
