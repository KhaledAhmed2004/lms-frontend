import { Plus } from "lucide-react";
import Link from "next/link";

export default function PostsHeader() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          All Posts
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Manage all posts and publishing status.
        </p>
      </div>
      <Link
        href="/admin/posts/new"
        className="inline-flex items-center gap-2 bg-[#0B31BD] hover:bg-[#0929a3] text-white text-sm sm:text-base font-semibold px-4 sm:px-5 py-2.5 rounded-lg shadow-sm transition-colors w-fit"
      >
        <Plus className="w-4 h-4" />
        New Post
      </Link>
    </div>
  );
}
