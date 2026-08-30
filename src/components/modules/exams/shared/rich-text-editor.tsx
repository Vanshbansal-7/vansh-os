"use client";

import React, { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import ImageResize from "tiptap-extension-resize-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Unlink,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const MenuBar = ({ editor }: { editor: any }) => {
  const [showLinkInput, setShowLinkInput] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const setLink = useCallback(() => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  }, [editor, linkUrl]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        if (src) {
          editor.chain().focus().setImage({ src }).run();
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/[0.08] bg-[#10131E] rounded-t-2xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("bold") ? "bg-purple-600/30 text-purple-400" : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
        }`}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("italic") ? "bg-purple-600/30 text-purple-400" : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
        }`}
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("strike") ? "bg-purple-600/30 text-purple-400" : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
        }`}
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      
      <div className="w-[1px] h-4 bg-white/[0.1] mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("heading", { level: 1 }) ? "bg-purple-600/30 text-purple-400" : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
        }`}
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("heading", { level: 2 }) ? "bg-purple-600/30 text-purple-400" : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
        }`}
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-4 bg-white/[0.1] mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("bulletList") ? "bg-purple-600/30 text-purple-400" : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
        }`}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("orderedList") ? "bg-purple-600/30 text-purple-400" : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
        }`}
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("taskList") ? "bg-purple-600/30 text-purple-400" : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
        }`}
      >
        <CheckSquare className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("blockquote") ? "bg-purple-600/30 text-purple-400" : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
        }`}
      >
        <Quote className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-4 bg-white/[0.1] mx-1" />

      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={`p-1.5 rounded-lg transition-colors ${
            editor.isActive("link") || showLinkInput ? "bg-purple-600/30 text-purple-400" : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
          }`}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        {showLinkInput && (
          <div className="absolute top-full left-0 mt-1 flex items-center gap-1 bg-[#151828] border border-purple-500/30 rounded-lg p-1 z-50 shadow-xl">
            <input
              type="url"
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="bg-transparent text-xs text-white px-2 py-1 outline-none w-32 placeholder-slate-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setLink();
                }
              }}
            />
            <button
              type="button"
              onClick={setLink}
              className="px-2 py-1 bg-purple-600 text-white text-[10px] font-bold rounded cursor-pointer"
            >
              Add
            </button>
          </div>
        )}
      </div>
      
      {editor.isActive("link") && (
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <Unlink className="w-4 h-4" />
        </button>
      )}

      <input 
        type="file" 
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden" 
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
      >
        <ImageIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export function RichTextEditor({ content, onChange, placeholder = "Write something...", readOnly = false }: RichTextEditorProps) {
  const editor = useEditor({
    editable: !readOnly,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      ImageResize.configure({
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-sm sm:prose-base focus:outline-none max-w-none min-h-[150px] p-4 text-slate-300",
      },
    },
  });

  // Effect to update content if it changes externally (e.g. switching notes)
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`flex flex-col w-full bg-[#151828] ${readOnly ? '' : 'border border-white/[0.08] rounded-2xl shadow-sm'} tiptap-wrapper`}>
      {!readOnly && <MenuBar editor={editor} />}
      <div className={`editor-container ${readOnly ? 'read-only' : 'overflow-y-auto max-h-[60vh] min-h-[40vh]'}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
