import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BlogPost } from "./entities/blog-post.entity";
import { CreateBlogPostDto } from "./dto/create-blog-post.dto";
import { UpdateBlogPostDto } from "./dto/update-blog-post.dto";
import { BlogPostQueryDto } from "./dto/blog-post-query.dto";
import { BlogPostResponseDto } from "./dto/blog-post-response.dto";

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>
  ) {}

  async create(
    createBlogPostDto: CreateBlogPostDto,
    userId: string
  ): Promise<BlogPostResponseDto> {
    // Generate slug if not provided
    if (!createBlogPostDto.slug) {
      createBlogPostDto.slug = this.generateSlug(createBlogPostDto.title);
    }

    // Check if slug already exists
    const existingPost = await this.blogPostRepository.findOne({
      where: { slug: createBlogPostDto.slug },
    });

    if (existingPost) {
      createBlogPostDto.slug = `${createBlogPostDto.slug}-${Date.now()}`;
    }

    const blogPostData = {
      ...createBlogPostDto,
      createdBy: userId,
    };

    // Set publishedAt if status is published
    if (createBlogPostDto.status === "published") {
      (blogPostData as any).publishedAt = new Date();
    }

    const blogPost = this.blogPostRepository.create(blogPostData);

    const savedPost = await this.blogPostRepository.save(blogPost);
    return this.mapToResponseDto(savedPost);
  }

  async findAll(query: BlogPostQueryDto): Promise<{
    data: BlogPostResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      category,
      tag,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = query;

    const queryBuilder = this.blogPostRepository
      .createQueryBuilder("blogPost")
      .leftJoinAndSelect("blogPost.author", "author")
      .where("blogPost.isActive = :isActive", { isActive: true });

    if (search) {
      queryBuilder.andWhere(
        "(blogPost.title ILIKE :search OR blogPost.content ILIKE :search OR blogPost.excerpt ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    if (status) {
      queryBuilder.andWhere("blogPost.status = :status", { status });
    }

    if (category) {
      queryBuilder.andWhere("blogPost.category = :category", { category });
    }

    if (tag) {
      queryBuilder.andWhere("blogPost.tags @> :tag", {
        tag: JSON.stringify([tag]),
      });
    }

    queryBuilder
      .orderBy(`blogPost.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [posts, total] = await queryBuilder.getManyAndCount();

    return {
      data: posts.map((post) => this.mapToResponseDto(post)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<BlogPostResponseDto> {
    const blogPost = await this.blogPostRepository.findOne({
      where: { id, isActive: true },
      relations: ["author"],
    });

    if (!blogPost) {
      throw new NotFoundException("Blog post not found");
    }

    // Increment view count
    await this.blogPostRepository.update(id, {
      viewCount: blogPost.viewCount + 1,
    });

    return this.mapToResponseDto(blogPost);
  }

  async findBySlug(slug: string): Promise<BlogPostResponseDto> {
    const blogPost = await this.blogPostRepository.findOne({
      where: { slug, isActive: true },
      relations: ["author"],
    });

    if (!blogPost) {
      throw new NotFoundException("Blog post not found");
    }

    // Increment view count
    await this.blogPostRepository.update(blogPost.id, {
      viewCount: blogPost.viewCount + 1,
    });

    return this.mapToResponseDto(blogPost);
  }

  async update(
    id: number,
    updateBlogPostDto: UpdateBlogPostDto,
    userId: string
  ): Promise<BlogPostResponseDto> {
    const blogPost = await this.blogPostRepository.findOne({
      where: { id, isActive: true },
    });

    if (!blogPost) {
      throw new NotFoundException("Blog post not found");
    }

    // Check if user is the author or admin
    if (blogPost.createdBy !== userId) {
      throw new BadRequestException("You can only update your own blog posts");
    }

    // Generate slug if title is being updated and no slug provided
    if (updateBlogPostDto.title && !updateBlogPostDto.slug) {
      updateBlogPostDto.slug = this.generateSlug(updateBlogPostDto.title);

      // Check if new slug already exists
      const existingPost = await this.blogPostRepository.findOne({
        where: { slug: updateBlogPostDto.slug },
      });

      if (existingPost && existingPost.id !== id) {
        updateBlogPostDto.slug = `${updateBlogPostDto.slug}-${Date.now()}`;
      }
    }

    const updateData = { ...updateBlogPostDto };

    // Set publishedAt if status is being changed to published
    if (
      updateBlogPostDto.status === "published" &&
      blogPost.status !== "published"
    ) {
      (updateData as any).publishedAt = new Date();
    }

    await this.blogPostRepository.update(id, updateData);
    const updatedPost = await this.blogPostRepository.findOne({
      where: { id },
      relations: ["author"],
    });

    return this.mapToResponseDto(updatedPost);
  }

  async remove(id: number, userId: string): Promise<void> {
    const blogPost = await this.blogPostRepository.findOne({
      where: { id, isActive: true },
    });

    if (!blogPost) {
      throw new NotFoundException("Blog post not found");
    }

    // Check if user is the author or admin
    if (blogPost.createdBy !== userId) {
      throw new BadRequestException("You can only delete your own blog posts");
    }

    // Soft delete
    await this.blogPostRepository.update(id, { isActive: false });
  }

  async getCategories(): Promise<string[]> {
    const result = await this.blogPostRepository
      .createQueryBuilder("blogPost")
      .select("DISTINCT blogPost.category", "category")
      .where("blogPost.isActive = :isActive", { isActive: true })
      .andWhere("blogPost.category IS NOT NULL")
      .getRawMany();

    return result.map((item) => item.category).filter(Boolean);
  }

  async getTags(): Promise<string[]> {
    const result = await this.blogPostRepository
      .createQueryBuilder("blogPost")
      .select("blogPost.tags")
      .where("blogPost.isActive = :isActive", { isActive: true })
      .andWhere("blogPost.tags IS NOT NULL")
      .getMany();

    const allTags = result.flatMap((post) => post.tags || []);
    return [...new Set(allTags)];
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  private mapToResponseDto(blogPost: BlogPost): BlogPostResponseDto {
    return {
      id: blogPost.id,
      title: blogPost.title,
      content: blogPost.content,
      excerpt: blogPost.excerpt,
      featuredImage: blogPost.featuredImage,
      slug: blogPost.slug,
      status: blogPost.status,
      isActive: blogPost.isActive,
      tags: blogPost.tags,
      category: blogPost.category,
      viewCount: blogPost.viewCount,
      publishedAt: blogPost.publishedAt,
      createdAt: blogPost.createdAt,
      updatedAt: blogPost.updatedAt,
      createdBy: blogPost.createdBy,
      author: {
        id: blogPost.author.id,
        firstName: blogPost.author.firstName,
        lastName: blogPost.author.lastName,
        email: blogPost.author.email,
      },
    };
  }
}
