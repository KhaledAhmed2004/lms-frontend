"use client";

import { ArrowLeft, Calendar, Clock, Eye } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { postsData } from "../components/AllPost";
import PostSection from "../components/PostSection";

export default function BlogPostDetails() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const post = postsData.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Post Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The blog post you&aposre looking for doesn&apost exist.
            </p>
            <button
              onClick={() => router.push("/user/blogs")}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Return to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  const relatedPosts = postsData
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  // Generate table of contents from content sections
  const tableOfContents =
    post.content_sections?.map((section, index) => ({
      id: `section-${index}`,
      heading: section.heading,
    })) || [];

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content Area */}
          <div className="lg:col-span-2">
            {/* Title and Meta */}
            <div className="mb-8">
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-lg text-gray-600 mb-6">{post.summary}</p>

              <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                {/* Author Info */}
                <div className="flex  gap-3 ">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {post.author.charAt(0)}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">{post.author}</p>
                    {post.author_role && (
                      <p className="text-sm text-gray-600">
                        {post.author_role}
                      </p>
                    )}
                  </div>
                </div>

                {/* Article Stats */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.read_time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Banner */}
            <div className="bg-linear-to-br from-blue-500 to-blue-700 rounded-lg h-64 md:h-80 mb-12 flex items-center justify-center overflow-hidden">
              <div className="text-center text-white">
                {/* Placeholder for illustration/image */}
                <div className="flex items-center justify-center">
                  <div className="w-32 h-32 bg-blue-400 rounded-lg opacity-50 flex items-center justify-center">
                    <span className="text-4xl">📚</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="mb-8">
              <div className="prose prose-lg max-w-none">
                {post.content_sections && post.content_sections.length > 0 ? (
                  <div className="space-y-10">
                    {post.content_sections.map((section, index) => (
                      <div key={index} id={`section-${index}`}>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                          {section.heading}
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-md">
                          {section.body}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {post.summary}
                  </p>
                )}
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-lg p-8  text-white mb-12 flex items-center justify-between">
              <div className="flex flex-col items-start">
                <h3 className="text-xl font-bold ">Ready to Start Learning?</h3>
                <p className="text-sm text-blue-100 ">
                  Book a free 30-minute trial session with one of our expert
                  tutors.
                </p>
              </div>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors transform hover:scale-105">
                {post.cta || "Book Free Trial"}
              </button>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Related Articles
                </h3>
                <div className="flex flex-wrap gap-4">
                  {relatedPosts.map((relatedPost) => (
                    <div key={relatedPost.id}>
                      <PostSection posts={[relatedPost]} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-4">
                TABLE OF CONTENTS
              </h4>
              <nav className="space-y-3">
                {tableOfContents.map((item, index) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-1 pl-4 border-l-2 border-transparent hover:border-blue-600"
                  >
                    {index + 1}. {item.heading}
                  </a>
                ))}
              </nav>

              {/* Article Stats Card */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Article Stats</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {post.views.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">8 min read</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
