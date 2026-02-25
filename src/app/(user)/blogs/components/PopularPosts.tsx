"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "./types";

interface PopularPostsProps {
  posts: BlogPost[];
}

export default function PopularPosts({ posts }: PopularPostsProps) {
  const topPosts = posts.slice(0, 4);

  return (
    <div className="bg-white rounded-lg p-6 sticky top-4">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        📌 Popular Posts
      </h3>

      <div className="space-y-4">
        {topPosts.map((post, index) => (
          <Link key={post.id} href={`/blogs/${post.slug}`}>
            <div className="pb-4 border-b last:border-b-0 hover:bg-gray-50 -mx-6 px-6 py-2 cursor-pointer transition-colors">
              <div className="flex gap-3">
                <div className="text-lg font-bold text-gray-300 w-6 shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm line-clamp-2 hover:text-blue-600">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Eye className="w-3 h-3" />
                    <span>{post.views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA Box */}
      <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-lg p-6 mt-6 text-center text-white">
        <p className="text-sm font-semibold mb-3">
          Ready to improve your grades?
        </p>
        <p className="text-xs text-blue-100 mb-4">
          Book a free trial session with one of our expert tutors.
        </p>
        <button className="w-full bg-white text-blue-600 py-2 rounded-md font-semibold hover:bg-blue-50 transition-colors text-sm">
          Book Free Trial
        </button>
      </div>
    </div>
  );
}
