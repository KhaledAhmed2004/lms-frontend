"use client";

import { useParams } from "next/navigation";
import { useBlog } from "@/hooks/api/use-blogs";
import PostForm from "../../components/PostForm";
import { useTranslations } from "next-intl";

export default function EditPostPage() {
  const t = useTranslations("postsEdit");
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const { data: post, isLoading, isError } = useBlog(id);

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">
        {t("loading")}
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("notFound")}</h1>
        <p className="text-sm text-gray-500 mt-2">
          {t("notFoundDesc", { id: id || "" })}
        </p>
      </div>
    );
  }

  return <PostForm title={t("title")} post={post} />;
}
