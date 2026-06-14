export type ContentSection = {
  heading: string;
  body: string;
};

export type BlogPost = {
  id: string;
  title: string;
  author: string;
  author_role?: string;
  date: string;
  read_time: string;
  views: number;
  category: string;
  tags: string[];
  featured: boolean;
  summary: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  cta: string;
  status: string;
  content_sections?: ContentSection[];
  image_url?: string;
  author_avatar_url?: string;
};

export type PostStatus = "Published" | "Draft" | "Scheduled";

export type PlatformMetadata = {
  categories: string[];
  tags: string[];
};
