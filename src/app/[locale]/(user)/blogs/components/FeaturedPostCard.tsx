"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import type { BlogPost } from "./types";

interface FeaturedPostCardProps {
  post: BlogPost;
}

export default function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  return (
    <Link href={`/blogs/${post.slug}`}>
      <div className="rounded-xl overflow-hidden mb-8 cursor-pointer hover:shadow-lg transition-shadow">
        {/* Featured Image Background */}
        <div
          className="relative bg-linear-to-br from-blue-600 to-blue-700 h-64"
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="relative p-8 h-full flex flex-col justify-end text-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Featured
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>

            <h2 className="text-white text-2xl font-bold mb-4 leading-tight">
              {post.title}
            </h2>

            <p className="text-blue-100 mb-6 line-clamp-2">{post.summary}</p>

            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center  text-blue-100 text-sm">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={post.author_avatar_url} alt={post.author} />
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col ">
                  <div className="flex items-center gap-2">
                    <span className="flex flex-col">
                      {post.author} {post.date}
                    </span>
                  </div>
                  <div className="">
                    <span>{post.read_time}</span>
                  </div>
                </div>
              </div>

              <button className="bg-white text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-blue-50 transition-colors w-fit flex items-center gap-2">
                Read Article
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
