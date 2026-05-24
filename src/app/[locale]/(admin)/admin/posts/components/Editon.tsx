"use client";

import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

type EditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function Editon({ value, onChange, placeholder }: EditorProps) {
  const t = useTranslations("editor");
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: placeholder || "",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: value,
    onUpdate: ({ editor: editorInstance }) => {
      onChange(editorInstance.getHTML());
    },
    editorProps: {
      attributes: {
        class: "min-h-[320px] text-sm text-gray-700 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const html = editor.getHTML();
    if (value !== html) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 px-3 py-2 bg-gray-50">
        <button
          type="button"
          title={t("heading1")}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-2 py-1 rounded text-xs font-semibold ${
            editor.isActive("heading", { level: 1 })
              ? "bg-[#0B31BD] text-white"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          H1
        </button>
        <button
          type="button"
          title={t("heading2")}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-2 py-1 rounded text-xs font-semibold ${
            editor.isActive("heading", { level: 2 })
              ? "bg-[#0B31BD] text-white"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          H2
        </button>
        <button
          type="button"
          title={t("heading3")}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`px-2 py-1 rounded text-xs font-semibold ${
            editor.isActive("heading", { level: 3 })
              ? "bg-[#0B31BD] text-white"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          H3
        </button>
        <button
          type="button"
          title={t("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded text-xs font-semibold ${
            editor.isActive("bold")
              ? "bg-[#0B31BD] text-white"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          B
        </button>
        <button
          type="button"
          title={t("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded text-xs font-semibold ${
            editor.isActive("italic")
              ? "bg-[#0B31BD] text-white"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          I
        </button>
        <button
          type="button"
          title={t("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 rounded text-xs font-semibold ${
            editor.isActive("underline")
              ? "bg-[#0B31BD] text-white"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          U
        </button>
        <button
          type="button"
          title={t("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded text-xs font-semibold ${
            editor.isActive("bulletList")
              ? "bg-[#0B31BD] text-white"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          •
        </button>
        <button
          type="button"
          title={t("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded text-xs font-semibold ${
            editor.isActive("orderedList")
              ? "bg-[#0B31BD] text-white"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          1.
        </button>
        <button
          type="button"
          title={t("quote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 rounded text-xs font-semibold ${
            editor.isActive("blockquote")
              ? "bg-[#0B31BD] text-white"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          “
        </button>
      </div>
      <div className="px-3 py-2 min-h-[320px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
