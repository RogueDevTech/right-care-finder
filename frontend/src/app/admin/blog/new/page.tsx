"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import AdminLayout from "@/components/layout/admin-layout";
import { BlogEditor } from "@/components/blog";
import { useAdminActions, CreateBlogPostData } from "@/actions-client/admin";
import styles from "./page.module.scss";

export default function NewBlogPostPage() {
  const router = useRouter();
  const { createBlogPost } = useAdminActions();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blogForm, setBlogForm] = useState<CreateBlogPostData>({
    title: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    slug: "",
    status: "draft",
    isActive: true,
    tags: [],
    category: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: CreateBlogPostData = {
        ...blogForm,
        // normalize tags if user typed a comma-separated string into category/tags input
        tags: blogForm.tags?.map((t) => t.trim()).filter(Boolean) ?? [],
      };

      const result = await createBlogPost(payload);
      if (result.success) {
        toast.success("Blog post created");
        router.push("/admin/blog");
      } else {
        toast.error(result.error || "Failed to create blog post");
      }
    } catch {
      toast.error("Unexpected error while creating blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/admin/blog" className={styles.backLink}>
              ← Back to Blog
            </Link>
            <h1>Create New Blog Post</h1>
          </div>
          <button
            type="submit"
            form="new-blog-form"
            className={styles.saveButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Post"}
          </button>
        </div>

        <form
          id="new-blog-form"
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <div className={styles.formGroup}>
            <label htmlFor="title">
              Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              id="title"
              type="text"
              value={blogForm.title}
              onChange={(e) =>
                setBlogForm({ ...blogForm, title: e.target.value })
              }
              placeholder="Enter blog post title"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="slug">Slug (Optional)</label>
            <input
              id="slug"
              type="text"
              value={blogForm.slug}
              onChange={(e) =>
                setBlogForm({ ...blogForm, slug: e.target.value })
              }
              placeholder="Auto-generated from title if empty"
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              value={blogForm.excerpt}
              onChange={(e) =>
                setBlogForm({ ...blogForm, excerpt: e.target.value })
              }
              placeholder="Brief description of the blog post"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              Content <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div className={styles.blogEditor}>
              <BlogEditor
                content={blogForm.content}
                onChange={(content) => setBlogForm({ ...blogForm, content })}
                placeholder="Write your blog post content here..."
                height={500}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="featuredImage">Featured Image URL</label>
            <input
              id="featuredImage"
              type="url"
              value={blogForm.featuredImage}
              onChange={(e) =>
                setBlogForm({ ...blogForm, featuredImage: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <input
              id="category"
              type="text"
              value={blogForm.category}
              onChange={(e) =>
                setBlogForm({ ...blogForm, category: e.target.value })
              }
              placeholder="e.g., News, Tips, Guides"
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              id="tags"
              type="text"
              value={(blogForm.tags || []).join(", ")}
              onChange={(e) =>
                setBlogForm({
                  ...blogForm,
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
              placeholder="e.g., elderly care, advice, home"
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={blogForm.status}
                onChange={(e) =>
                  setBlogForm({
                    ...blogForm,
                    status: e.target.value as
                      | "draft"
                      | "published"
                      | "archived",
                  })
                }
                disabled={isSubmitting}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className={styles.checkboxGroup}>
              <input
                id="isActive"
                type="checkbox"
                checked={blogForm.isActive}
                onChange={(e) =>
                  setBlogForm({ ...blogForm, isActive: e.target.checked })
                }
                disabled={isSubmitting}
              />
              <label htmlFor="isActive">Active</label>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
