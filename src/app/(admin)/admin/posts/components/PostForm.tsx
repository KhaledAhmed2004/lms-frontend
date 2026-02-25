"use client";

import { Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Editon from "./Editon";
import type { PostRecord, PostStatus } from "./types";

type PostFormProps = {
  title: string;
  post: PostRecord;
};

const statusOptions: PostStatus[] = ["Draft", "Published", "Scheduled"];
const ctaOptions: PostRecord["cta"][] = ["Book Free Trial", "Apply as Tutor"];

function StatusPill({
  status,
  active,
  onClick,
}: {
  status: PostStatus;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
        active
          ? "bg-[#0B31BD] text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {status}
    </button>
  );
}

export default function PostForm({ title, post }: PostFormProps) {
  const [postTitle, setPostTitle] = useState(post.title);
  const [status, setStatus] = useState<PostStatus>(post.status);
  const [category, setCategory] = useState(post.category);
  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [cta, setCta] = useState<PostRecord["cta"]>(post.cta);
  const [seoTitle, setSeoTitle] = useState(post.seoTitle);
  const [seoDescription, setSeoDescription] = useState(post.seoDescription);
  const [slug, setSlug] = useState(post.slug);
  const [content, setContent] = useState("");

  useEffect(() => {
    setPostTitle(post.title);
    setStatus(post.status);
    setCategory(post.category);
    setTags(post.tags || []);
    setCta(post.cta);
    setSeoTitle(post.seoTitle);
    setSeoDescription(post.seoDescription);
    setSlug(post.slug);
  }, [post]);

  const primaryActionLabel = useMemo(() => {
    if (status === "Draft") return "Save Draft";
    if (status === "Scheduled") return "Schedule Post";
    return "Publish Now";
  }, [status]);

  const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();

    const value = tagInput.trim();
    if (!value) return;
    if (tags.includes(value)) {
      setTagInput("");
      return;
    }

    setTags((prev) => [...prev, value]);
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Use the editor below to create and publish your post.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <label className="text-sm font-semibold text-gray-700">
              Post Title
            </label>
            <input
              value={postTitle}
              onChange={(event) => setPostTitle(event.target.value)}
              placeholder="Add a headline for your post"
              className="mt-2 w-full text-lg sm:text-xl font-semibold text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B31BD]"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4">
              <Editon
                value={content}
                onChange={setContent}
                placeholder="Start writing your article here. Use the toolbar above to format text, add images, and insert links..."
              />
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between gap-2">
              {statusOptions.map((option) => (
                <StatusPill
                  key={option}
                  status={option}
                  active={status === option}
                  onClick={() => setStatus(option)}
                />
              ))}
            </div>
            <button
              type="button"
              className="mt-3 w-full bg-[#0B31BD] hover:bg-[#0929a3] text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {primaryActionLabel}
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <label className="text-sm font-semibold text-gray-700">
              Category
            </label>
            <input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="e.g. Study Tips"
              className="w-full mt-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0B31BD]"
            />

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Tags
              </label>
              <input
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter"
                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0B31BD]"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#0B31BD] text-xs font-semibold"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-[#0B31BD] hover:text-[#0929a3]"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <label className="text-sm font-semibold text-gray-700">
              Featured Image
            </label>
            <div className="border mt-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-500">
              <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p className="font-semibold text-gray-700">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">
              SEO Settings
            </h3>
            {/* <div>
              <label className="text-xs font-semibold text-gray-500">
                SEO Title
              </label>
              <input
                value={seoTitle}
                onChange={(event) => setSeoTitle(event.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">
                Meta Description
              </label>
              <textarea
                value={seoDescription}
                onChange={(event) => setSeoDescription(event.target.value)}
                placeholder="Short description for search engines..."
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-20"
              />
            </div> */}
            <div>
              <label className="text-xs font-semibold text-gray-500">
                URL Slug
              </label>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-gray-500">/blog/</span>
                <input
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">CTA Button</h3>
            <div className="space-y-2">
              {ctaOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCta(option)}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                    cta === option
                      ? "border-[#0B31BD] bg-blue-50 text-[#0B31BD]"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {option}
                  <span className="block text-xs font-normal text-gray-500">
                    {option === "Book Free Trial"
                      ? "For student-focused posts"
                      : "For tutor recruitment posts"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
