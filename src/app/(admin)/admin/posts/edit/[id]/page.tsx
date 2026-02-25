"use client";

import { useParams } from "next/navigation";
import PostForm from "../../components/PostForm";
import { postsData } from "../../components/posts-data";

export default function EditPostPage() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const post = postsData.find((item) => item.id === id);

  if (!id || !post) {
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
