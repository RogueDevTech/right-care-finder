"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import AdminLayout from "@/components/layout/admin-layout";
import {
  useAdminActions,
  BlogPost,
  CreateBlogPostData,
} from "@/actions-client/admin";
import BlogEditor from "@/components/blog/BlogEditor";
import { errorToString } from "@/utils/error-to-string";
import styles from "./blog.module.scss";

export default function BlogPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // Form states
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);

  // Form data
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

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category: "",
  });

  const { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } =
    useAdminActions();

  useEffect(() => {
    loadBlogPosts();
  }, [currentPage, filters]);

  const loadBlogPosts = async () => {
    setIsLoading(true);
    try {
      const result = await getBlogPosts({
        page: currentPage,
        limit,
        search: filters.search || undefined,
        status: filters.status
          ? (filters.status as "draft" | "published" | "archived")
          : undefined,
        category: filters.category || undefined,
      });

      if (result.success && result.data) {
        setBlogPosts(result.data.data);
        setTotal(result.data.total);
      } else {
        toast.error(result.error ? errorToString(result.error, "Failed to load blog posts") : "Failed to load blog posts");
      }
    } catch (error) {
      console.error("Error loading blog posts:", error);
      toast.error("Failed to load blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingBlogPost) {
        const result = await updateBlogPost(editingBlogPost.id, blogForm);
        if (result.success) {
          toast.success("Blog post updated successfully");
          if (result.data) {
            setBlogPosts(
              blogPosts.map((post) =>
                post.id === editingBlogPost.id ? result.data! : post
              )
            );
          }
        } else {
          toast.error(result.error ? errorToString(result.error, "Failed to update blog post") : "Failed to update blog post");
        }
      } else {
        const result = await createBlogPost(blogForm);
        if (result.success && result.data) {
          toast.success("Blog post created successfully");
          setBlogPosts([result.data, ...blogPosts]);
          setTotal(total + 1);
        } else {
          toast.error(result.error ? errorToString(result.error, "Failed to create blog post") : "Failed to create blog post");
        }
      }

      resetBlogForm();
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast.error("Failed to save blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBlogPost = (blogPost: BlogPost) => {
    setEditingBlogPost(blogPost);
    setBlogForm({
      title: blogPost.title,
      content: blogPost.content,
      excerpt: blogPost.excerpt || "",
      featuredImage: blogPost.featuredImage || "",
      slug: blogPost.slug || "",
      status: blogPost.status,
      isActive: blogPost.isActive,
      tags: blogPost.tags || [],
      category: blogPost.category || "",
    });
    setShowBlogForm(true);
  };

  const handleDeleteBlogPost = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    setIsDeleting(id);
    try {
      const result = await deleteBlogPost(id);
      if (result.success) {
        toast.success("Blog post deleted successfully");
        setBlogPosts(blogPosts.filter((post) => post.id !== id));
        setTotal(total - 1);
      } else {
        toast.error(result.error ? errorToString(result.error, "Failed to delete blog post") : "Failed to delete blog post");
      }
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast.error("Failed to delete blog post");
    } finally {
      setIsDeleting(null);
    }
  };

  const resetBlogForm = () => {
    setBlogForm({
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
    setEditingBlogPost(null);
    setShowBlogForm(false);
  };

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !blogForm.tags?.includes(tag.trim())) {
      setBlogForm({
        ...blogForm,
        tags: [...(blogForm.tags || []), tag.trim()],
      });
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setBlogForm({
      ...blogForm,
      tags: blogForm.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "#10b981";
      case "draft":
        return "#f59e0b";
      case "archived":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const totalPages = Math.ceil(total / limit);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className={styles.blogContainer}>
          <div className={styles.header}>
            <div className={styles.skeletonBackButton}></div>
            <div className={styles.skeletonTitle}></div>
          </div>
          <div className={styles.skeletonContent}></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.blogContainer}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/admin" className={styles.backButton}>
              ← Back to Admin
            </Link>
            <h1>Blog Management</h1>
          </div>
          <Link href="/admin/blog/new" className={styles.addButton}>
            + Add Blog Post
          </Link>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <input
              type="text"
              placeholder="Search blog posts..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className={styles.filterSelect}
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <input
              type="text"
              placeholder="Category"
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className={styles.filterInput}
            />
          </div>
        </div>

        {/* Blog Form Modal (now used only for editing) */}
        {showBlogForm && editingBlogPost && (
          <div className={styles.formOverlay}>
            <div className={styles.form}>
              <div className={styles.formHeader}>
                <h3>Edit Blog Post</h3>
                <button className={styles.closeButton} onClick={resetBlogForm}>
                  ×
                </button>
              </div>
              <form onSubmit={handleBlogSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="title">
                    Title <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
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
                    type="text"
                    id="slug"
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
                  <label htmlFor="content">
                    Content <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <BlogEditor
                    content={blogForm.content}
                    onChange={(content) =>
                      setBlogForm({ ...blogForm, content })
                    }
                    placeholder="Write your blog post content here..."
                    height={400}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="featuredImage">Featured Image URL</label>
                  <input
                    type="url"
                    id="featuredImage"
                    value={blogForm.featuredImage}
                    onChange={(e) =>
                      setBlogForm({
                        ...blogForm,
                        featuredImage: e.target.value,
                      })
                    }
                    placeholder="https://example.com/image.jpg"
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="category">Category</label>
                  <input
                    type="text"
                    id="category"
                    value={blogForm.category}
                    onChange={(e) =>
                      setBlogForm({ ...blogForm, category: e.target.value })
                    }
                    placeholder="e.g., Health, Care, News"
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Tags</label>
                  <div className={styles.tagsContainer}>
                    <div className={styles.tagsList}>
                      {blogForm.tags?.map((tag, index) => (
                        <span key={index} className={styles.tag}>
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleTagRemove(tag)}
                            className={styles.tagRemove}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add a tag and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleTagAdd(e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                      className={styles.tagInput}
                    />
                  </div>
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

                  <div className={styles.formGroup}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={blogForm.isActive}
                        onChange={(e) =>
                          setBlogForm({
                            ...blogForm,
                            isActive: e.target.checked,
                          })
                        }
                        disabled={isSubmitting}
                      />
                      <span style={{ marginLeft: "0.5rem" }}>Active</span>
                    </label>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    onClick={resetBlogForm}
                    className={styles.cancelButton}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`${styles.saveButton} ${
                      isSubmitting ? styles.loading : ""
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Blog Posts List */}
        {blogPosts.length > 0 ? (
          <div className={styles.blogList}>
            {blogPosts.map((post) => (
              <div key={post.id} className={styles.blogCard}>
                <div className={styles.blogContent}>
                  <div className={styles.blogHeader}>
                    <h3 className={styles.blogTitle}>{post.title}</h3>
                    <div className={styles.blogMeta}>
                      <span
                        className={styles.status}
                        style={{ color: getStatusColor(post.status) }}
                      >
                        {post.status}
                      </span>
                      <span className={styles.views}>
                        {post.viewCount} views
                      </span>
                    </div>
                  </div>

                  {post.excerpt && (
                    <p className={styles.blogExcerpt}>{post.excerpt}</p>
                  )}

                  <div className={styles.blogDetails}>
                    <div className={styles.blogInfo}>
                      <span>
                        By {post.author.firstName} {post.author.lastName}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      {post.category && (
                        <>
                          <span>•</span>
                          <span className={styles.category}>
                            {post.category}
                          </span>
                        </>
                      )}
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className={styles.tags}>
                        {post.tags.map((tag, index) => (
                          <span key={index} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.blogActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditBlogPost(post)}
                    disabled={isDeleting === post.id}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteBlogPost(post.id)}
                    disabled={isDeleting === post.id}
                  >
                    {isDeleting === post.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>📝</div>
            <h3>No Blog Posts Found</h3>
            <p>
              Get started by creating your first blog post to share insights and
              updates with your audience.
            </p>
            <Link href="/admin/blog/new" className={styles.emptyStateButton}>
              + Create Your First Blog Post
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              Previous
            </button>
            <span className={styles.paginationInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.paginationButton}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
