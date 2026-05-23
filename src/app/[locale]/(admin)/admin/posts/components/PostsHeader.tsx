import { Plus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function PostsHeader() {
  const t = useTranslations("postsHeader");
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {t("title")}
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          {t("description")}
        </p>
      </div>
      <Link
        href="/admin/posts/new"
        className="inline-flex items-center gap-2 bg-[#0B31BD] hover:bg-[#0929a3] text-white text-sm sm:text-base font-semibold px-4 sm:px-5 py-2.5 rounded-lg shadow-sm transition-colors w-fit"
      >
        <Plus className="w-4 h-4" />
        {t("newPost")}
      </Link>
    </div>
  );
}
