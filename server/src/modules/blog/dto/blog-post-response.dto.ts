export class BlogPostResponseDto {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  slug?: string;
  status: "draft" | "published" | "archived";
  isActive: boolean;
  tags?: string[];
  category?: string;
  viewCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
