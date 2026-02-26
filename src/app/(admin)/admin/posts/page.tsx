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
import PostsHeader from "./components/PostsHeader";
import PostsStats from "./components/PostsStats";
import PostsTable from "./components/PostsTable";
import { postsData } from "./components/posts-data";

export default function PostsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const publishedCount = postsData.filter(
    (post) => post.status === "Published",
  ).length;
  const draftCount = postsData.filter((post) => post.status === "Draft").length;
  const totalViews = postsData.reduce((sum, post) => sum + post.views, 0);
  const totalPages = Math.max(1, Math.ceil(postsData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visiblePosts = postsData.slice(startIndex, endIndex);

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <PostsHeader />
      <PostsStats
        totalPosts={postsData.length}
        published={publishedCount}
        drafts={draftCount}
        totalViews={totalViews}
      />
      <PostsTable posts={visiblePosts} />
      <div className="flex items-center  justify-between">
        <p className="text-sm text-gray-500  flex-1">
          Showing {startIndex + 1} to {Math.min(endIndex, postsData.length)} of{" "}
          {postsData.length} results
        </p>
        <Pagination className=" justify-end mx-0 w-1/2 ">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
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
            })}

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
    </div>
  );
}
