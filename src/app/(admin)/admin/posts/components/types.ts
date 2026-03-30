export type PostStatus = "Published" | "Draft";

export type PostRecord = {
  _id: string;
  title: string;
  status: 'draft' | 'published';
  category: string;
  tags: string[];
  featuredImage: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
