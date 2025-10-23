# Blog Components

This directory contains the blog-related components for the Right Care Finder application.

## Components

### BlogEditor

A Markdown editor component using @uiw/react-md-editor that allows admins to create and edit blog posts with Markdown formatting.

**Features:**

- Markdown editor with live preview
- Preview mode toggle
- Drag & drop image upload
- No API key required
- Responsive design

**Usage:**

```tsx
import { BlogEditor } from "@/components/blog";

<BlogEditor
  content={blogContent}
  onChange={(content) => setBlogContent(content)}
  placeholder="Start writing your blog post..."
  height={400}
/>;
```

### SafeHTMLRenderer

Safely renders HTML content with XSS protection using DOMPurify, and Markdown content using @uiw/react-md-editor.

**Features:**

- HTML sanitization with DOMPurify
- Markdown rendering with MDEditor
- Configurable allowed tags and attributes
- Multiple renderer variants (full content, preview)

**Usage:**

```tsx
import { BlogContentRenderer } from "@/components/blog";

<BlogContentRenderer content={htmlContent} />;
```

### BlogPostDisplay

A complete blog post display component with metadata and formatting.

**Features:**

- Featured image support
- Author information
- Publication date
- Tags and categories
- View count
- Responsive layout

**Usage:**

```tsx
import { BlogPostDisplay } from "@/components/blog";

<BlogPostDisplay post={blogPost} showFullContent={true} />;
```

## API Endpoints

### Image Upload

- **Endpoint:** `/api/upload-image`
- **Method:** POST
- **Content-Type:** multipart/form-data
- **Response:** JSON with uploaded image URL

**Features:**

- File type validation (JPEG, PNG, GIF, WebP)
- File size limit (5MB)
- Automatic filename generation
- Error handling

## Setup Requirements

1. **No API Key Required:** The Markdown editor works out of the box
2. **Upload Directory:** The `/public/uploads` directory will be created automatically
3. **Dependencies:** All required packages are already installed

## Security

- All HTML content is sanitized using DOMPurify
- Image uploads are validated for type and size
- XSS protection is built-in
- Only safe HTML tags and attributes are allowed

## Styling

The components use Tailwind CSS classes and are designed to work with your existing design system. The blog content uses the `prose` classes for optimal typography.
