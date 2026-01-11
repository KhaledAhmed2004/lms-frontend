"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Search, Loader2, ExternalLink, BookOpen } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  useOERResources,
  useOERFilterOptions,
  OERResource,
} from "@/hooks/api/use-oer-resources";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Resource type badge color mapping
const getTypeBadgeColor = (type: string) => {
  const typeColors: Record<string, string> = {
    Video: "bg-purple-100 text-purple-700",
    PDF: "bg-blue-100 text-blue-700",
    Document: "bg-blue-100 text-blue-700",
    text: "bg-blue-100 text-blue-700",
    Interactive: "bg-green-100 text-green-700",
    application: "bg-green-100 text-green-700",
    Audio: "bg-orange-100 text-orange-700",
    audio: "bg-orange-100 text-orange-700",
    Image: "bg-pink-100 text-pink-700",
    image: "bg-pink-100 text-pink-700",
  };
  return typeColors[type] || "bg-gray-100 text-gray-700";
};

// Resource type icon mapping
const getTypeIcon = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes("video")) return "▶️";
  if (lowerType.includes("pdf") || lowerType.includes("text") || lowerType.includes("document")) return "📄";
  if (lowerType.includes("audio")) return "🎵";
  if (lowerType.includes("image")) return "🖼️";
  if (lowerType.includes("interactive") || lowerType.includes("application")) return "🎮";
  return "📚";
};

// Skeleton loader for cards
const ResourceCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
    <div className="p-5 pb-4 border-b border-gray-100">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
    <div className="p-5">
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="h-3 bg-gray-200 rounded w-20"></div>
        <div className="h-3 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  </div>
);

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedSubject, selectedGrade, selectedType]);

  // Fetch filter options
  const { data: filterOptions } = useOERFilterOptions();

  // Fetch resources
  const {
    data: resourcesData,
    isLoading,
    isFetching,
    isError,
  } = useOERResources({
    query: debouncedSearchQuery || undefined,
    subject: selectedSubject || undefined,
    grade: selectedGrade || undefined,
    type: selectedType || undefined,
    page: currentPage,
    limit: 12,
  });

  const resources = resourcesData?.data || [];
  const pagination = resourcesData?.pagination;

  // Pagination handlers
  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (pagination && currentPage < pagination.totalPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, pagination]);

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
            Resource Search
          </h1>
        </div>
        <p className="text-sm text-gray-600">
          Find educational materials from German OER platforms (OERSI, WirLernenOnline, MUNDO) -
          filtered by subject, grade, and material type
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, keyword, competencies..."
            className="pl-12 h-11 text-base"
          />
          {isFetching && !isLoading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" size={20} />
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Subject
            </label>
            <Select
              value={selectedSubject || "all-subjects"}
              onValueChange={(value) =>
                setSelectedSubject(value === "all-subjects" ? "" : value)
              }
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-subjects">All Subjects</SelectItem>
                {filterOptions?.subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Grade
            </label>
            <Select
              value={selectedGrade || "all-grades"}
              onValueChange={(value) =>
                setSelectedGrade(value === "all-grades" ? "" : value)
              }
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-grades">All Grades</SelectItem>
                {filterOptions?.grades.map((grade) => (
                  <SelectItem key={grade.id} value={grade.id}>
                    {grade.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Material Type
            </label>
            <Select
              value={selectedType || "all-types"}
              onValueChange={(value) =>
                setSelectedType(value === "all-types" ? "" : value)
              }
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">All Types</SelectItem>
                {filterOptions?.types.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSubject("");
                setSelectedGrade("");
                setSelectedType("");
                setCurrentPage(1);
              }}
              className="h-10 px-4 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count & Sort */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </span>
            ) : (
              <>
                <span className="font-semibold text-gray-900">
                  {pagination?.total || 0}
                </span>{" "}
                results found
              </>
            )}
          </p>
          {pagination && pagination.totalPage > 1 && (
            <p className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPage}
            </p>
          )}
        </div>

        {/* Error State */}
        {isError && (
          <div className="text-center py-12 bg-red-50 rounded-lg mb-6">
            <p className="text-red-600 mb-2">Failed to load resources</p>
            <p className="text-sm text-red-500">Please try again later</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ResourceCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Resource Cards Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.length > 0 ? (
              resources.map((resource: OERResource) => (
                <div
                  key={resource.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-gray-300 overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="p-5 pb-4 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                          {resource.title}
                        </h3>
                      </div>
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${getTypeBadgeColor(
                          resource.type
                        )}`}
                      >
                        {getTypeIcon(resource.type)} {resource.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {resource.subject}
                      {resource.grade && ` • ${resource.grade}`}
                    </p>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <p className="text-xs text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {resource.description || "No description available"}
                    </p>

                    {resource.author && (
                      <p className="text-xs text-gray-500 mb-3">
                        By: <span className="font-medium">{resource.author}</span>
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded font-medium">
                          {resource.source}
                        </span>
                        {resource.license && (
                          <span className="text-xs text-gray-400" title={resource.license}>
                            OER
                          </span>
                        )}
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        View <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">
                  No resources found matching your criteria
                </p>
                <p className="text-sm text-gray-400">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPage > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {pagination.totalPage}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= pagination.totalPage}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
