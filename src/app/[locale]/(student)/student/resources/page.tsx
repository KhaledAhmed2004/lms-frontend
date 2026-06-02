// // ============================================================
// // OLD DESIGN START — uncomment this block to revert
// // ============================================================
// import React, { useState } from "react";
// import { Search } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
//
// export default function Resources() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [selectedGrade, setSelectedGrade] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedMaterialType, setSelectedMaterialType] = useState("");
//   const [sortBy, setSortBy] = useState("relevance");
//
//   const resources = [
//     {
//       id: 1,
//       title: "Quadratic Equations – Solution Methods",
//       subject: "Mathematics",
//       grade: "Grade 9-10",
//       state: "BW",
//       type: "PDF",
//       description:
//         "Comprehensive tutorial on various solution methods for quadratic equations with practice problems and solutions.",
//       source: "MUNDO",
//       tag: "Class Test",
//       badgeColor: "bg-yellow-100",
//     },
//     {
//       id: 2,
//       title: "Forest Ecosystem - Interactive Simulation",
//       subject: "Biology",
//       grade: "Grade 7-8",
//       state: "nationwide",
//       type: "Video",
//       description:
//         "Interactive simulation for understanding biotic chains and material cycles in forest ecosystems.",
//       source: "Wiki",
//     },
//     {
//       id: 3,
//       title: "Weimar Republic - Source Collection",
//       subject: "History",
//       grade: "Grade 11-13",
//       state: "BW",
//       type: "PDF",
//       description:
//         "Curated collection of primary sources on the Weimar Republic with didactic notes.",
//       source: "Sarb",
//       badgeColor: "bg-yellow-100",
//     },
//     {
//       id: 4,
//       title: "Introduction to Python Programming",
//       subject: "Computer Science",
//       grade: "Grade 9-12",
//       state: "nationwide",
//       type: "Video",
//       description:
//         "Friendly video series covering Python basics, loops, functions, and data structures.",
//       source: "MUNDO",
//     },
//     {
//       id: 5,
//       title: "Climate Change and Its Effects",
//       subject: "Geography",
//       grade: "Grade 9-10",
//       state: "nationwide",
//       type: "Video",
//       description:
//         "Detailed analysis of climate change causes, effects, and mitigation strategies with current data.",
//       source: "MUNDO",
//     },
//     {
//       id: 6,
//       title: "Shakespeare's Hamlet - Analysis Guide",
//       subject: "English",
//       grade: "Grade 11-13",
//       state: "BW",
//       type: "PDF",
//       description:
//         "Curated collection of primary sources on classic literature with didactic notes.",
//       source: "Sarb",
//       badgeColor: "bg-yellow-100",
//     },
//   ];
//
//   const filteredResources = resources.filter((resource) => {
//     return (
//       (!searchQuery ||
//         resource.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
//       (!selectedSubject || resource.subject === selectedSubject) &&
//       (!selectedGrade || resource.grade === selectedGrade) &&
//       (!selectedState || resource.state === selectedState) &&
//       (!selectedMaterialType || resource.type === selectedMaterialType)
//     );
//   });
//
//   return (
//     <div className="space-y-4 sm:space-y-5 lg:space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6">
//         <h1 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
//           Resource Search
//         </h1>
//         <p className="text-sm text-gray-600">
//           Find educational materials from open education databases - filtered
//           by subject, grade, state, and material type
//         </p>
//       </div>
//
//       {/* Search Bar */}
//       <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6">
//         <div className="relative">
//           <Search
//             className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//             size={20}
//           />
//           <Input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search by topic, keyword, competencies..."
//             className="pl-12 h-11 text-base"
//           />
//         </div>
//       </div>
//
//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
//           <div>
//             <label className="text-sm font-medium text-gray-700 block mb-2">
//               Subject
//             </label>
//             <Select
//               value={selectedSubject || "all-subjects"}
//               onValueChange={(value) =>
//                 setSelectedSubject(value === "all-subjects" ? "" : value)
//               }
//             >
//               <SelectTrigger className="h-10 w-full">
//                 <SelectValue placeholder="Select subject" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all-subjects">All Subjects</SelectItem>
//                 <SelectItem value="Mathematics">Mathematics</SelectItem>
//                 <SelectItem value="Biology">Biology</SelectItem>
//                 <SelectItem value="History">History</SelectItem>
//                 <SelectItem value="Computer Science">
//                   Computer Science
//                 </SelectItem>
//                 <SelectItem value="Geography">Geography</SelectItem>
//                 <SelectItem value="English">English</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//
//           <div>
//             <label className="text-sm font-medium text-gray-700 block mb-2">
//               Grade
//             </label>
//             <Select
//               value={selectedGrade || "all-grades"}
//               onValueChange={(value) =>
//                 setSelectedGrade(value === "all-grades" ? "" : value)
//               }
//             >
//               <SelectTrigger className="h-10 w-full">
//                 <SelectValue placeholder="Select grade" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all-grades">All Grades</SelectItem>
//                 <SelectItem value="Grade 7-8">Grade 7-8</SelectItem>
//                 <SelectItem value="Grade 9-10">Grade 9-10</SelectItem>
//                 <SelectItem value="Grade 9-12">Grade 9-12</SelectItem>
//                 <SelectItem value="Grade 11-13">Grade 11-13</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//
//           <div>
//             <label className="text-sm font-medium text-gray-700 block mb-2">
//               State
//             </label>
//             <Select
//               value={selectedState || "all-states"}
//               onValueChange={(value) =>
//                 setSelectedState(value === "all-states" ? "" : value)
//               }
//             >
//               <SelectTrigger className="h-10 w-full">
//                 <SelectValue placeholder="Select state" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all-states">All States</SelectItem>
//                 <SelectItem value="BW">BW</SelectItem>
//                 <SelectItem value="nationwide">Nationwide</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//
//           <div>
//             <label className="text-sm font-medium text-gray-700 block mb-2">
//               Material Type
//             </label>
//             <Select
//               value={selectedMaterialType || "all-types"}
//               onValueChange={(value) =>
//                 setSelectedMaterialType(value === "all-types" ? "" : value)
//               }
//             >
//               <SelectTrigger className="h-10 w-full">
//                 <SelectValue placeholder="Select type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all-types">All Types</SelectItem>
//                 <SelectItem value="PDF">PDF</SelectItem>
//                 <SelectItem value="Video">Video</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//
//           <div>
//             <label className="text-sm font-medium text-gray-700 block mb-2">
//               Exam Type
//             </label>
//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger className="h-10 w-full">
//                 <SelectValue placeholder="Sort" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="relevance">Relevance</SelectItem>
//                 <SelectItem value="newest">Newest</SelectItem>
//                 <SelectItem value="popular">Popular</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//
//         {/* Results Count */}
//         <div className="mb-6 flex items-center justify-between">
//           <p className="text-sm text-gray-600">
//             <span className="font-semibold text-gray-900">
//               {filteredResources.length}
//             </span>{" "}
//             results found
//           </p>
//           <div>
//             <label className="text-sm font-medium text-gray-700 block mb-2">
//               Sort By
//             </label>
//
//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger className="h-10 w-40">
//                 <SelectValue placeholder="Sort" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="relevance">Relevance</SelectItem>
//                 <SelectItem value="newest">Newest</SelectItem>
//                 <SelectItem value="popular">Popular</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//
//         {/* Resource Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredResources.length > 0 ? (
//             filteredResources.map((resource) => (
//               <div
//                 key={resource.id}
//                 className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-gray-300 overflow-hidden group"
//               >
//                 {/* Card Header */}
//                 <div className="p-5 pb-4 border-b border-gray-100">
//                   <div className="flex items-start justify-between gap-3 mb-3">
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-blue-600 transition-colors">
//                         {resource.title}
//                       </h3>
//                     </div>
//                     <span
//                       className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${
//                         resource.type === "PDF"
//                           ? "bg-blue-100 text-blue-700"
//                           : "bg-purple-100 text-purple-700"
//                       }`}
//                     >
//                       {resource.type === "PDF" ? "📄 PDF" : "▶️ Video"}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-500 leading-relaxed">
//                     {resource.subject} • {resource.grade} • {resource.state}
//                   </p>
//                 </div>
//
//                 {/* Card Body */}
//                 <div className="p-5">
//                   <p className="text-xs text-gray-600 mb-4 leading-relaxed">
//                     {resource.description}
//                   </p>
//
//                   {resource.badgeColor && (
//                     <div
//                       className={`text-xs font-medium px-3 py-1.5 rounded-full inline-block mb-4 ${resource.badgeColor} text-amber-900`}
//                     >
//                       ⭐ {resource.tag}
//                     </div>
//                   )}
//
//                   <div className="flex items-center justify-between pt-3 border-t border-gray-100">
//                     <p className="text-xs text-gray-500">
//                       Source:{" "}
//                       <span className="font-medium text-gray-700">
//                         {resource.source}
//                       </span>
//                     </p>
//                     <button className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline">
//                       View
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="col-span-full text-center py-12">
//               <p className="text-gray-500">
//                 No resources found matching your criteria
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// // ============================================================
// // OLD DESIGN END
// // ============================================================

// NEW DESIGN — "Study Finder" two-phase UI
"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { Search, Loader2, ExternalLink, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useOERResources,
  useOERFilterOptions,
  OERResource,
} from "@/hooks/api/use-oer-resources";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const getTypeBadgeColor = (type: string) => {
  const map: Record<string, string> = {
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
  return map[type] || "bg-gray-100 text-gray-700";
};

const getSourceColor = (source: string) => {
  const s = source.toLowerCase();
  if (s.includes("mundo")) return "bg-orange-100 text-orange-700";
  if (s.includes("oersi")) return "bg-blue-100 text-blue-700";
  if (s.includes("wirlernen")) return "bg-green-100 text-green-700";
  return "bg-gray-100 text-gray-700";
};

const ResourceCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
    <div className="flex gap-2">
      <div className="h-6 w-14 bg-gray-200 rounded-full"></div>
      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
      <div className="h-6 w-14 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

export default function Resources() {
  const t = useTranslations("resources");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, selectedSubject, selectedGrade, selectedType]);

  const { data: filterOptions } = useOERFilterOptions();

  const {
    data: resourcesData,
    isLoading,
    isFetching,
    isError,
  } = useOERResources(
    {
      query: debouncedQuery || undefined,
      subject: selectedSubject || undefined,
      grade: selectedGrade || undefined,
      type: selectedType || undefined,
      page: currentPage,
      limit: 12,
    },
    hasSearched
  );

  const resources = resourcesData?.data || [];
  const pagination = resourcesData?.pagination;

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setHasSearched(true);
    }
  };

  const handleFilterChange = useCallback(
    (setter: (v: string) => void, value: string, clearValue: string) => {
      const resolved = value === clearValue ? "" : value;
      setter(resolved);
      if (!hasSearched) setHasSearched(true);
    },
    [hasSearched]
  );

  const handleBackToHome = () => {
    setHasSearched(false);
    setSearchInput("");
    setSearchQuery("");
    setSelectedSubject("");
    setSelectedGrade("");
    setSelectedState("");
    setSelectedType("");
    setCurrentPage(1);
  };

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (pagination && currentPage < pagination.totalPage)
      setCurrentPage((p) => p + 1);
  }, [currentPage, pagination]);

  // ---- PHASE 1: Hero / Landing ----
  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 text-center">
          {t('studyFinder').split(' ')[0]} <span className="text-[#0B31BD]">{t('studyFinder').split(' ')[1]}</span>
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mb-8 text-center">
          {t('allResourcesInOnePlace')}
        </p>

        <form
          onSubmit={handleSearch}
          className="w-full max-w-2xl flex items-center border-2 border-gray-300 rounded-lg bg-white focus-within:border-[#0B31BD] transition-colors"
        >
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="flex-1 px-5 py-3.5 text-base text-gray-900 placeholder:text-gray-400 bg-transparent outline-none rounded-l-lg"
          />
          <button
            type="submit"
            className="m-1.5 p-3 bg-gray-700 hover:bg-[#0B31BD] text-white rounded-lg transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>
    );
  }

  // ---- PHASE 2: Results ----
  return (
    <div className="space-y-4">
      {/* Top bar: search left, title right */}
      <div className="flex items-center gap-4 flex-wrap">
        <form
          onSubmit={handleSearch}
          className="flex-1 min-w-[240px] flex items-center border border-gray-300 rounded-lg bg-white focus-within:border-[#0B31BD] transition-colors"
        >
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setSearchQuery(e.target.value);
            }}
            placeholder={t('searchPlaceholder')}
            className="flex-1 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-transparent outline-none rounded-l-lg"
          />
          {isFetching && !isLoading ? (
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin mr-3" />
          ) : null}
          <button
            type="submit"
            className="m-1 p-2 bg-[#0B31BD] hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        <button
          onClick={handleBackToHome}
          className="text-xl sm:text-2xl font-bold text-[#0B31BD] hover:opacity-80 transition whitespace-nowrap"
        >
          {t('studyFinder')}
        </button>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select
          value={selectedSubject || "all-subjects"}
          onValueChange={(v) =>
            handleFilterChange(setSelectedSubject, v, "all-subjects")
          }
        >
          <SelectTrigger className="h-9 w-[130px] text-xs">
            <SelectValue placeholder={t('subject')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-subjects">{t('subject')}</SelectItem>
            {filterOptions?.subjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedGrade || "all-grades"}
          onValueChange={(v) =>
            handleFilterChange(setSelectedGrade, v, "all-grades")
          }
        >
          <SelectTrigger className="h-9 w-[120px] text-xs">
            <SelectValue placeholder={t('grade')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-grades">{t('grade')}</SelectItem>
            {filterOptions?.grades.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedState || "all-states"}
          onValueChange={(v) =>
            handleFilterChange(setSelectedState, v, "all-states")
          }
        >
          <SelectTrigger className="h-9 w-[120px] text-xs">
            <SelectValue placeholder={t('state')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-states">{t('state')}</SelectItem>
            <SelectItem value="BW">{t('stateBW')}</SelectItem>
            <SelectItem value="nationwide">{t('stateNationwide')}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedType || "all-types"}
          onValueChange={(v) =>
            handleFilterChange(setSelectedType, v, "all-types")
          }
        >
          <SelectTrigger className="h-9 w-[140px] text-xs">
            <SelectValue placeholder={t('materialType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-types">{t('materialType')}</SelectItem>
            {filterOptions?.types.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Error state */}
      {isError ? (
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600 mb-2">{t('failedToLoad')}</p>
          <p className="text-sm text-red-500">{t('tryAgainLater')}</p>
        </div>
      ) : null}

      {/* Loading state */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <ResourceCardSkeleton key={i} />
          ))}
        </div>
      ) : null}

      {/* Result cards — full width, single column (same card design as old) */}
      {!isLoading && resources.length > 0 ? (
        <div className="space-y-4">
          {resources.map((resource: OERResource) => (
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
                    className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${getTypeBadgeColor(
                      resource.type
                    )}`}
                  >
                    {resource.type}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {resource.subject}
                  {resource.grade ? ` • ${resource.grade}` : ""}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <p className="text-xs text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {resource.description || t('noDescription')}
                </p>

                {resource.author ? (
                  <p className="text-xs text-gray-500 mb-3">
                    {t('createdBy')} <span className="font-medium">{resource.author}</span>
                  </p>
                ) : null}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full italic ${getSourceColor(
                      resource.source
                    )}`}
                  >
                    {resource.source}
                  </span>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {t('view')} <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Empty state */}
      {!isLoading && !isError && resources.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-1">{t('noResourcesFound')}</p>
          <p className="text-sm text-gray-400">
            {t('tryAdjustingFilters')}
          </p>
        </div>
      ) : null}

      {/* Pagination */}
      {pagination && pagination.totalPage > 1 ? (
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t('previous')}
          </button>
          <span className="text-sm text-gray-600">
            {t('page')} {currentPage} {t('of')} {pagination.totalPage}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= pagination.totalPage}
            className="px-4 py-2 text-sm font-medium text-white bg-[#0B31BD] rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t('next')}
          </button>
        </div>
      ) : null}
    </div>
  );
}