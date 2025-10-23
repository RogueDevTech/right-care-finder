"use client";

import { BlogContentRenderer } from "./SafeHTMLRenderer";

interface BlogPostDisplayProps {
  post: {
    id: number;
    title: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    author: {
      firstName: string;
      lastName: string;
    };
    createdAt: string;
    category?: string;
    tags?: string[];
    viewCount: number;
  };
  showFullContent?: boolean;
}

export const BlogPostDisplay = ({
  post,
  showFullContent = true,
}: BlogPostDisplayProps) => {
  return (
    <article className="blog-post">
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="mb-6">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Post Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

        {/* Post Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <span>
            By {post.author.firstName} {post.author.lastName}
          </span>
          <span>•</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>•</span>
          <span>{post.viewCount} views</span>
          {post.category && (
            <>
              <span>•</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {post.category}
              </span>
            </>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <div className="text-lg text-gray-600 italic border-l-4 border-blue-500 pl-4 mb-6">
            {post.excerpt}
          </div>
        )}
      </header>

      {/* Post Content */}
      {showFullContent ? (
        <div className="blog-content-wrapper">
          <BlogContentRenderer content={post.content} />
        </div>
      ) : (
        <div className="blog-preview-wrapper">
          <BlogContentRenderer content={post.content} />
        </div>
      )}
    </article>
  );
};

export default BlogPostDisplay;
