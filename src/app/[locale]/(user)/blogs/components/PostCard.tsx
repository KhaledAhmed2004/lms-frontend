"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "./types";

interface PostCardProps {
  post: BlogPost;
}

const categoryColors: Record<
  string,
  { bg: string; text: string; badge: string }
> = {
  Math: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  Languages: {
    bg: "bg-green-50",
    text: "text-green-600",
    badge: "bg-green-100 text-green-700",
  },
  "Study Tips": {
    bg: "bg-purple-50",
    text: "text-purple-600",
    badge: "bg-purple-100 text-purple-700",
  },
  "Exam Prep": {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
  },
  Abitur: {
    bg: "bg-pink-50",
    text: "text-pink-600",
    badge: "bg-pink-100 text-pink-700",
  },
};

export default function PostCard({ post }: PostCardProps) {
  const colors = categoryColors[post.category] || categoryColors.Math;

  return (
    <Link href={`/blogs/${post.slug}`}>
      <div
        className={`bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col`}
      >
        {/* Image Container */}
        <div className={`${colors.bg} h-40 relative overflow-hidden`}>
          {post.image_url ? (
            <Image
              src={post.image_url}
              alt={post.title}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)",
              }}
            />
          )}
          <div className="absolute top-4 left-4">
            <span
              className={`${colors.badge} px-3 py-1 rounded-full text-xs font-semibold`}
            >
              {post.category}
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col ">
          <h3 className={`${colors.text} text-lg font-bold mb-2 line-clamp-2 `}>
            {post.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {post.summary}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={post.author_avatar_url} alt={post.author} />
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{post.views.toLocaleString()} views</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
