"use client";

import { useParams } from "next/navigation";
import { useBlog } from "@/hooks/api/use-blogs";
import PostForm from "../../components/PostForm";

export default function EditPostPage() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const { data: post, isLoading, isError } = useBlog(id);

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">
        Loading post...
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-900">Post not found</h1>
        <p className="text-sm text-gray-500 mt-2">
          We could not find a post with id {id || ""}.
        </p>
      </div>
    );
  }

  return <PostForm title="Edit Post" post={post} />;
}
