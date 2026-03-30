"use client";

import { Upload, X, Loader2 } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Editon from "./Editon";
import { useCreateBlog, useUpdateBlog } from "@/hooks/api/use-blogs";
import type { PostRecord } from "./types";

type PostFormProps = {
  title: string;
  post?: PostRecord;
};

type FormStatus = "draft" | "published";
const statusOptions: FormStatus[] = ["draft", "published"];

function StatusPill({
  status,
  active,
  onClick,
}: {
  status: FormStatus;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
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
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const isEditMode = !!post;

  const [postTitle, setPostTitle] = useState(post?.title ?? "");
  const [status, setStatus] = useState<FormStatus>(post?.status ?? "draft");
  const [category, setCategory] = useState(post?.category ?? "");
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState(post?.content ?? "");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    post?.featuredImage || null,
  );

  const isPending = createBlog.isPending || updateBlog.isPending;

  const primaryActionLabel = useMemo(() => {
    if (isPending)
      return status === "draft" ? "Saving..." : "Publishing...";
    if (isEditMode) return status === "draft" ? "Update Draft" : "Update & Publish";
    if (status === "draft") return "Save Draft";
    return "Publish Now";
  }, [status, isPending, isEditMode]);

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

  const handleImageSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be under 5MB");
        return;
      }

      setFeaturedImage(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    },
    [],
  );

  const handleRemoveImage = useCallback(() => {
    setFeaturedImage(null);
    if (imagePreview && imagePreview.startsWith("blob:"))
      URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [imagePreview]);

  const handleSubmit = async () => {
    if (!postTitle.trim()) {
      toast.error("Post title is required");
      return;
    }
    if (!content.trim()) {
      toast.error("Post content is required");
      return;
    }
    if (!category.trim()) {
      toast.error("Category is required");
      return;
    }

    try {
      if (isEditMode) {
        await updateBlog.mutateAsync({
          id: post._id,
          title: postTitle.trim(),
          content,
          status,
          category: category.trim(),
          tags,
          featuredImage: featuredImage ?? undefined,
        });
        toast.success("Post updated successfully");
      } else {
        await createBlog.mutateAsync({
          title: postTitle.trim(),
          content,
          status,
          category: category.trim(),
          tags,
          featuredImage: featuredImage ?? undefined,
        });
        toast.success(
          status === "draft"
            ? "Draft saved successfully"
            : "Post published successfully",
        );
      }
      router.push("/admin/posts");
    } catch {
      toast.error("Failed to save post. Please try again.");
    }
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
              disabled={isPending}
              onClick={handleSubmit}
              className="mt-3 w-full bg-[#0B31BD] hover:bg-[#0929a3] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative mt-2">
                <img
                  src={imagePreview}
                  alt="Featured preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border mt-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-500 hover:border-gray-400 transition-colors cursor-pointer"
              >
                <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <p className="font-semibold text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
