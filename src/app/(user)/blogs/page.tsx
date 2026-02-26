"use client";

import { useMemo, useState } from "react";
import { platformMetadata, postsData } from "./components/AllPost";
import FeaturedPostCard from "./components/FeaturedPostCard";
import Header from "./components/Header";
import PopularPosts from "./components/PopularPosts";
import PostSection from "./components/PostSection";

export default function Blogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const featuredPost = useMemo(() => {
    return postsData.find((post) => post.featured);
  }, []);

  const filteredPosts = useMemo(() => {
    return postsData.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !selectedCategory || post.category === selectedCategory;
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [searchQuery, selectedCategory, selectedTag]);

  const nonFeaturedPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen pt-12 bg-white">
      <div className="mx-auto">
        {/* Header with Search and Filters */}
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {/* Main Content */}
        <div className="space-y-8 bg-gray-100 py-12">
          {/* Filters */}
          <div className="space-x-4 max-w-7xl mx-auto p-4 gap-2 flex flex-wrap items-center justify-start">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 md:border-r border-gray-300 pr-4">
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === ""
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              {platformMetadata?.categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            {/* Tags Filter */}
            <div className="flex flex-wrap gap-2">
              {platformMetadata?.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTag === tag
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 max-w-7xl mx-auto p-4 lg:grid-cols-3 gap-8 ">
            <div className="lg:col-span-2">
              {/* Featured Post */}
              {featuredPost &&
                searchQuery === "" &&
                selectedCategory === "" &&
                selectedTag === "" && <FeaturedPostCard post={featuredPost} />}

              {/* Posts Grid */}
              <PostSection posts={nonFeaturedPosts} />
            </div>

            {/* Sidebar - Popular Posts */}
            <div className="lg:col-span-1">
              <PopularPosts posts={postsData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
