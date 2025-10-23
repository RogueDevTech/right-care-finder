import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from "@nestjs/common";
import { BlogService } from "./blog.service";
import { CreateBlogPostDto } from "./dto/create-blog-post.dto";
import { UpdateBlogPostDto } from "./dto/update-blog-post.dto";
import { BlogPostQueryDto } from "./dto/blog-post-query.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";

interface AuthenticatedRequest {
  user: {
    id: string;
  };
}

@Controller("v1/blog")
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(
    @Body() createBlogPostDto: CreateBlogPostDto,
    @Request() req: AuthenticatedRequest
  ) {
    return this.blogService.create(createBlogPostDto, req.user.id);
  }

  @Get()
  findAll(@Query() query: BlogPostQueryDto) {
    return this.blogService.findAll(query);
  }

  @Get("categories")
  getCategories() {
    return this.blogService.getCategories();
  }

  @Get("tags")
  getTags() {
    return this.blogService.getTags();
  }

  @Get("slug/:slug")
  findBySlug(@Param("slug") slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateBlogPostDto: UpdateBlogPostDto,
    @Request() req: AuthenticatedRequest
  ) {
    return this.blogService.update(id, updateBlogPostDto, req.user.id);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(
    @Param("id", ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest
  ) {
    return this.blogService.remove(id, req.user.id);
  }
}
