"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useDeleteBlog } from "@/hooks/api/use-blogs";
import type { PostRecord } from "./types";
import { useTranslations, useLocale } from "next-intl";

type PostsTableProps = {
  posts: PostRecord[];
};

const statusStyles: Record<string, string> = {
  published: "bg-green-50 text-green-700",
  draft: "bg-gray-100 text-gray-700",
};

export default function PostsTable({ posts }: PostsTableProps) {
  const t = useTranslations("postsTable");
  const ts = useTranslations("postForm.status");
  const locale = useLocale();
  const deleteBlog = useDeleteBlog();

  function formatDate(dateString: string) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(locale === "de" ? "de-DE" : "en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const handleDelete = (post: PostRecord) => {
    if (!confirm(t("deleteConfirm", { title: post.title }))) return;

    deleteBlog.mutate(post._id, {
      onSuccess: () => toast.success(t("deleteSuccess")),
      onError: () => toast.error(t("deleteError")),
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[720px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                {t("colTitle")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                {t("colStatus")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                {t("colCategory")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                {t("colCreated")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                {t("colActions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => {
              const rowBorder =
                index !== posts.length - 1 ? "border-b border-gray-200" : "";

              return (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className={`px-6 py-4 text-sm ${rowBorder}`}>
                    <p className="font-semibold text-gray-900">{post.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {post.tags.length > 0
                        ? post.tags.slice(0, 3).join(", ")
                        : "-"}
                    </p>
                  </td>
                  <td className={`px-6 py-4 text-sm ${rowBorder}`}>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        statusStyles[post.status] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ts(post.status)}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 text-sm text-gray-700 ${rowBorder}`}
                  >
                    {post.category}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm text-gray-700 ${rowBorder}`}
                  >
                    {formatDate(post.createdAt)}
                  </td>
                  <td className={`px-6 py-4 text-sm ${rowBorder}`}>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/posts/edit/${post._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-[#0B31BD] rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        {t("edit")}
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(post)}
                        disabled={deleteBlog.isPending}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                        aria-label={t("delete")}
                      >
                        {deleteBlog.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
