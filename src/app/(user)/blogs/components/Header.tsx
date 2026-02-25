"use client";

import { Search } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <div className="mb-12">
      {/* Header Section */}
      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-gray-600 tracking-wide mb-2">
          SCHÄFER TUTORING BLOG
        </p>
        <h1 className="text-4xl font-bold mb-3">
          Learning Resources & Study Tips
        </h1>
        <p className="text-gray-600">
          Expert advice from our tutors to help students achieve their goals.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search articles, topics, subjects..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
