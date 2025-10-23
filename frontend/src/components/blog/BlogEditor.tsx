"use client";

import React, { useState, useRef } from "react";

interface BlogEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

// Professional WYSIWYG Toolbar Component (inspired by RichTextEditor.com)
const ToolbarPlugin = () => {
  return (
    <div className="flex items-center gap-0 p-2 border-b bg-white border-gray-200 flex-wrap shadow-sm relative z-10 overflow-visible">
      {/* Text Formatting Group */}
      <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center text-sm font-bold border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-all duration-150 bg-white group relative"
          onClick={() => document.execCommand("bold")}
          title="Make text bold (Ctrl+B)"
        >
          <strong className="text-gray-700">B</strong>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[99999]">
            Bold Text
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center text-sm italic border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-all duration-150 bg-white ml-1 group relative"
          onClick={() => document.execCommand("italic")}
          title="Make text italic (Ctrl+I)"
        >
          <em className="text-gray-700">I</em>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[99999]">
            Italic Text
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center text-sm underline border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-all duration-150 bg-white ml-1 group relative"
          onClick={() => document.execCommand("underline")}
          title="Underline text (Ctrl+U)"
        >
          <u className="text-gray-700">U</u>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[99999]">
            Underline Text
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center text-sm border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-all duration-150 bg-white ml-1 group relative"
          onClick={() => document.execCommand("strikeThrough")}
          title="Strikethrough text"
        >
          <span className="text-gray-700 line-through">S</span>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[99999]">
            Strikethrough Text
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
      </div>

      {/* Headings Group */}
      <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
        <div className="relative group">
          <select
            className="h-8 px-2 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => {
              const value = e.target.value;
              if (value === "p") {
                document.execCommand("formatBlock", false, "p");
              } else {
                document.execCommand("formatBlock", false, value);
              }
            }}
            title="Change text format and heading level"
          >
            <option value="p">Normal</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
          </select>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[99999]">
            Text Format
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      </div>

      {/* Lists Group */}
      <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center text-sm border border-gray-300 rounded hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700 transition-all duration-150 bg-white group relative"
          onClick={() => document.execCommand("insertUnorderedList")}
          title="Create bullet list"
        >
          <span className="text-gray-700">•</span>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[99999]">
            Bullet List
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center text-sm border border-gray-300 rounded hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700 transition-all duration-150 bg-white ml-1 group relative"
          onClick={() => document.execCommand("insertOrderedList")}
          title="Create numbered list"
        >
          <span className="text-gray-700">1.</span>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[99999]">
            Numbered List
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center text-sm border border-gray-300 rounded hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700 transition-all duration-150 bg-white ml-1 group relative"
          onClick={() => document.execCommand("outdent")}
          title="Decrease indent level"
        >
          <span className="text-gray-700">←</span>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[99999]">
            Decrease Indent
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center text-sm border border-gray-300 rounded hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700 transition-all duration-150 bg-white ml-1 group relative"
          onClick={() => document.execCommand("indent")}
          title="Increase indent level"
        >
          <span className="text-gray-700">→</span>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[99999]">
            Increase Indent
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
      </div>

      {/* Alignment Group */}
      <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center text-sm border border-gray-300 rounded hover:bg-green-50 hover:border-green-400 hover:text-green-700 transition-all duration-150 bg-white group relative"
          onClick={() => document.execCommand("justifyLeft")}
          title="Align text to the left"
        >
          <span className="text-gray-700">⬅</span>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[99999]">
            Align Left
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center text-sm border border-gray-300 rounded hover:bg-green-50 hover:border-green-400 hover:text-green-700 transition-all duration-150 bg-white ml-1 group relative"
          onClick={() => document.execCommand("justifyCenter")}
          title="Center align text"
        >
          <span className="text-gray-700">↔</span>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[99999]">
            Center Align
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center text-sm border border-gray-300 rounded hover:bg-green-50 hover:border-green-400 hover:text-green-700 transition-all duration-150 bg-white ml-1 group relative"
          onClick={() => document.execCommand("justifyRight")}
          title="Align text to the right"
        >
          <span className="text-gray-700">➡</span>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[99999]">
            Align Right
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center text-sm border border-gray-300 rounded hover:bg-green-50 hover:border-green-400 hover:text-green-700 transition-all duration-150 bg-white ml-1 group relative"
          onClick={() => document.execCommand("justifyFull")}
          title="Justify text (align to both sides)"
        >
          <span className="text-gray-700">⬌</span>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[99999]">
            Justify Text
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
      </div>

      {/* Media Group */}
      <div className="flex items-center">
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center text-sm border border-gray-300 rounded hover:bg-orange-50 hover:border-orange-400 hover:text-orange-700 transition-all duration-150 bg-white group relative"
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) {
              document.execCommand("createLink", false, url);
            }
          }}
          title="Insert a link to a webpage"
        >
          <span className="text-gray-700">🔗</span>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[99999]">
            Insert Link
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center text-sm border border-gray-300 rounded hover:bg-pink-50 hover:border-pink-400 hover:text-pink-700 transition-all duration-150 bg-white ml-1 group relative"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = async (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                // Handle image upload
                const formData = new FormData();
                formData.append("image", file);
                try {
                  const response = await fetch("/api/upload-image", {
                    method: "POST",
                    body: formData,
                  });
                  const data = await response.json();
                  if (data.url) {
                    document.execCommand("insertImage", false, data.url);
                  }
                } catch (error) {
                  console.error("Image upload failed:", error);
                }
              }
            };
            input.click();
          }}
          title="Upload and insert an image"
        >
          <span className="text-gray-700">🖼️</span>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[99999]">
            Insert Image
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center text-sm border border-gray-300 rounded hover:bg-yellow-50 hover:border-yellow-400 hover:text-yellow-700 transition-all duration-150 bg-white ml-1 group relative"
          onClick={() => document.execCommand("insertHorizontalRule")}
          title="Insert a horizontal line divider"
        >
          <span className="text-gray-700">—</span>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[99999]">
            Horizontal Line
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
      </div>
    </div>
  );
};

export const BlogEditor = ({
  content,
  onChange,
  placeholder = "Start writing your blog post...",
  height = 400,
}: BlogEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Image upload error:", error);
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIFVwbG9hZCBGYWlsZWQ8L3RleHQ+PC9zdmc+";
    }
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      onChange(htmlContent);
    }
  };

  const handleInput = () => {
    handleEditorChange();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    handleEditorChange();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        const imageUrl = await handleImageUpload(file);
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = file.name;
        img.style.maxWidth = "100%";
        img.style.height = "auto";

        // Insert image at cursor position
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(img);
          range.setStartAfter(img);
          range.setEndAfter(img);
          selection.removeAllRanges();
          selection.addRange(range);
        }

        handleEditorChange();
      }
    }
  };

  // Initialize editor content only once
  React.useEffect(() => {
    if (editorRef.current && !isInitialized) {
      if (content) {
        editorRef.current.innerHTML = content;
      }
      setIsInitialized(true);
    }
  }, [content, isInitialized]);

  return (
    <div className="blog-editor relative z-20">
      {/* Editor Controls */}
      <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm relative z-0">
        <div className="flex space-x-2">
          <button
            onClick={() => setIsPreview(false)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm ${
              !isPreview
                ? "bg-[#1c7c8a] text-white shadow-md hover:bg-[#166d7a]"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm ${
              isPreview
                ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            👁️ Preview
          </button>
        </div>

        <div className="text-sm text-blue-700 font-medium">
          {!isPreview ? "Rich text editor" : "Preview mode"}
        </div>
      </div>

      {/* WYSIWYG Editor */}
      {!isPreview ? (
        <div
          className="border border-gray-300 rounded-lg shadow-sm bg-white relative"
          style={{ height: height }}
        >
          <ToolbarPlugin />
          <div
            ref={editorRef}
            contentEditable
            className="p-4 focus:outline-none resize-none"
            style={{
              minHeight: height - 50,
              fontSize: "16px",
              lineHeight: "1.6",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              border: "none",
              outline: "none",
              direction: "ltr",
              textAlign: "left",
            }}
            onInput={handleInput}
            onPaste={handlePaste}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            suppressContentEditableWarning={true}
          />
          {!content && (
            <div className="absolute top-16 left-4 text-gray-400 pointer-events-none select-none">
              {placeholder}
            </div>
          )}
        </div>
      ) : (
        <div
          className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
          style={{ minHeight: height }}
          dangerouslySetInnerHTML={{
            __html:
              content ||
              '<p class="text-gray-500 italic">No content to preview</p>',
          }}
        />
      )}

      {/* Editor Info */}
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-2">
          <div className="text-amber-600 text-lg">💡</div>
          <div className="text-sm text-amber-800">
            <strong>Tip:</strong> Use the toolbar to format your text. Click
            &quot;Preview&quot; to see how it will look to readers. You can drag
            and drop images directly into the editor.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
