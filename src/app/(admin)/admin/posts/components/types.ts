export type PostStatus = "Published" | "Draft" | "Scheduled";

export type PostRecord = {
  id: string;
  title: string;
  status: PostStatus;
  category: string;
  views: number;
  publishedAt?: string;
  tags: string[];
  slug: string;
  seoTitle: string;
  seoDescription: string;
  cta: "Book Free Trial" | "Apply as Tutor";
};
