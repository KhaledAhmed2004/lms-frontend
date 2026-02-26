import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import type { PostRecord } from "./types";

type PostsTableProps = {
  posts: PostRecord[];
};

const statusStyles: Record<PostRecord["status"], string> = {
  Published: "bg-green-50 text-green-700",
  Draft: "bg-gray-100 text-gray-700",
  Scheduled: "bg-orange-50 text-orange-700",
};

export default function PostsTable({ posts }: PostsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[720px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => {
              const showViews = post.status === "Published";
              const rowBorder =
                index !== posts.length - 1 ? "border-b border-gray-200" : "";

              return (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className={`px-6 py-4 text-sm ${rowBorder}`}>
                    <p className="font-semibold text-gray-900">{post.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Published: {post.publishedAt || "-"}
                    </p>
                  </td>
                  <td className={`px-6 py-4 text-sm ${rowBorder}`}>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        statusStyles[post.status]
                      }`}
                    >
                      {post.status}
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
                    {showViews ? post.views.toLocaleString() : "-"}
                  </td>
                  <td className={`px-6 py-4 text-sm ${rowBorder}`}>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/posts/edit/${post.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-[#0B31BD] rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                        aria-label="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
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
