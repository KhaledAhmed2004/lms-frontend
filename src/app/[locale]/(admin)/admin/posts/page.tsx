"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { useAdminBlogs } from "@/hooks/api/use-blogs";
import PostsHeader from "./components/PostsHeader";
import PostsStats from "./components/PostsStats";
import PostsTable from "./components/PostsTable";
import { useTranslations } from "next-intl";

export default function PostsPage() {
  const t = useTranslations("postsPage");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: blogsResponse, isLoading } = useAdminBlogs({
    page: currentPage,
    limit: itemsPerPage,
  });

  const posts = blogsResponse?.data ?? [];
  const pagination = blogsResponse?.pagination;
  const totalPages = pagination?.totalPage ?? 1;
  const total = pagination?.total ?? 0;

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  const startIndex = ((pagination?.page ?? 1) - 1) * itemsPerPage;
  const endIndex = startIndex + posts.length;

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <PostsHeader />
      <PostsStats
        totalPosts={total}
        published={publishedCount}
        drafts={draftCount}
      />

      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          {t("loading")}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          {t("noPosts")}
        </div>
      ) : (
        <>
          <PostsTable posts={posts} />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 flex-1">
              {t("showing")} {startIndex + 1} to {Math.min(endIndex, total)} of {total}{" "}
              {t("results")}
            </p>
            <Pagination className="justify-end mx-0 w-1/2">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={page === currentPage}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    if (
                      (page === 2 && currentPage > 3) ||
                      (page === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    return null;
                  },
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
}
