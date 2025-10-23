"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

interface SafeHTMLRendererProps {
  content: string;
  className?: string;
  allowImages?: boolean;
  allowLinks?: boolean;
  allowTables?: boolean;
}

export const SafeHTMLRenderer = ({
  content,
  className = "prose prose-lg max-w-none",
  allowImages = true,
  allowLinks = true,
  allowTables = true,
}: SafeHTMLRendererProps) => {
  const [sanitizedContent, setSanitizedContent] = useState<string>("");

  useEffect(() => {
    if (!content) {
      setSanitizedContent("");
      return;
    }

    // Configure allowed tags and attributes
    const allowedTags = [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "b",
      "i",
      "s",
      "strike",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "div",
      "span",
    ];

    const allowedAttributes = ["class", "id", "style"];

    // Add conditional tags based on props
    if (allowImages) {
      allowedTags.push("img");
      allowedAttributes.push("src", "alt", "title", "width", "height");
    }

    if (allowLinks) {
      allowedTags.push("a");
      allowedAttributes.push("href", "target", "rel");
    }

    if (allowTables) {
      allowedTags.push("table", "thead", "tbody", "tr", "th", "td");
      allowedAttributes.push("colspan", "rowspan");
    }

    // Sanitize the HTML content
    const cleanHTML = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: allowedAttributes,
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      SANITIZE_DOM: true,
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
    });

    setSanitizedContent(cleanHTML);
  }, [content, allowImages, allowLinks, allowTables]);

  if (!sanitizedContent) {
    return (
      <div className={`${className} text-gray-500 italic`}>
        No content available
      </div>
    );
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

// HTML renderer for blog content
export const BlogContentRenderer = ({ content }: { content: string }) => {
  return (
    <SafeHTMLRenderer
      content={content}
      className="blog-content prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-4 prose-blockquote:py-2 prose-img:rounded-lg prose-img:shadow-sm"
      allowImages={true}
      allowLinks={true}
      allowTables={true}
    />
  );
};

// Compact renderer for blog previews
export const BlogPreviewRenderer = ({ content }: { content: string }) => {
  return (
    <SafeHTMLRenderer
      content={content}
      className="blog-preview prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-medium prose-p:text-gray-600 prose-p:text-sm prose-p:leading-relaxed prose-a:text-blue-600 prose-strong:text-gray-900"
      allowImages={true}
      allowLinks={true}
      allowTables={false}
    />
  );
};

export default SafeHTMLRenderer;
