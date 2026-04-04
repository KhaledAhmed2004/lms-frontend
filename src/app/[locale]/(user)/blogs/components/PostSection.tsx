"use client";

import PostCard from "./PostCard";
import type { BlogPost } from "./types";

interface PostSectionProps {
  posts: BlogPost[];
}

export default function PostSection({ posts }: PostSectionProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No posts found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
