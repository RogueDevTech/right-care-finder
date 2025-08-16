import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
  Request,
} from "@nestjs/common";
import { ProductsService } from "./large-products.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../auth/guards/optional-jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";
import { BaseResponseDto } from "../../common/dto/base-response.dto";
import { Product } from "./entities/product.entity";
import { Category } from "./entities/category.entity";
import { Brand } from "./entities/brand.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller("v1/products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Category endpoints
  @Post("categories")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<BaseResponseDto<Category>> {
    const category =
      await this.productsService.createCategory(createCategoryDto);
    return BaseResponseDto.success("Category created successfully", category);
  }

  @Get("categories")
  @UseGuards(OptionalJwtAuthGuard)
  async findAllCategories(
    @Request() req?: any
  ): Promise<BaseResponseDto<Category[]>> {
    const userId = req?.user?.id;
    const categories = await this.productsService.findAllCategories(userId);
    return BaseResponseDto.success(
      "Categories retrieved successfully",
      categories
    );
  }

  @Get("categories/:id")
  @UseGuards(OptionalJwtAuthGuard)
  async findCategoryById(
    @Param("id") id: string,
    @Request() req?: any
  ): Promise<BaseResponseDto<Category>> {
    const userId = req?.user?.id;
    const category = await this.productsService.findCategoryById(id, userId);
    return BaseResponseDto.success("Category retrieved successfully", category);
  }

  @Put("categories/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateCategory(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<BaseResponseDto<Category>> {
    const category = await this.productsService.updateCategory(
      id,
      updateCategoryDto
    );
    return BaseResponseDto.success("Category updated successfully", category);
  }

  @Delete("categories/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteCategory(
    @Param("id") id: string
  ): Promise<BaseResponseDto<null>> {
    await this.productsService.deleteCategory(id);
    return BaseResponseDto.success("Category deleted successfully", null);
  }

  // Brand endpoints
  @Post("brands")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createBrand(
    @Body() createBrandDto: CreateBrandDto
  ): Promise<BaseResponseDto<Brand>> {
    const brand = await this.productsService.createBrand(createBrandDto);
    return BaseResponseDto.success("Brand created successfully", brand);
  }

  @Get("brands")
  @UseGuards(OptionalJwtAuthGuard)
  async findAllBrands(@Request() req?: any): Promise<BaseResponseDto<Brand[]>> {
    const userId = req?.user?.id;
    const brands = await this.productsService.findAllBrands(userId);
    return BaseResponseDto.success("Brands retrieved successfully", brands);
  }

  @Get("brands/:id")
  @UseGuards(OptionalJwtAuthGuard)
  async findBrandById(
    @Param("id") id: string,
    @Request() req?: any
  ): Promise<BaseResponseDto<Brand>> {
    const userId = req?.user?.id;
    const brand = await this.productsService.findBrandById(id, userId);
    return BaseResponseDto.success("Brand retrieved successfully", brand);
  }

  @Put("brands/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateBrand(
    @Param("id") id: string,
    @Body() updateBrandDto: UpdateBrandDto
  ): Promise<BaseResponseDto<Brand>> {
    const brand = await this.productsService.updateBrand(id, updateBrandDto);
    return BaseResponseDto.success("Brand updated successfully", brand);
  }

  @Delete("brands/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteBrand(@Param("id") id: string): Promise<BaseResponseDto<null>> {
    await this.productsService.deleteBrand(id);
    return BaseResponseDto.success("Brand deleted successfully", null);
  }

  // Product endpoints
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createProductDto: CreateProductDto
  ): Promise<BaseResponseDto<Product>> {
    const product = await this.productsService.create(createProductDto);
    return BaseResponseDto.success("Product created successfully", product);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(
    @Query("page") page?: number,
    @Query("per_page") per_page?: number,
    @Query("search") search?: string,
    @Query("category") category?: string,
    @Query("brand") brand?: string,
    @Query("status") status?: string,
    @Query("minPrice") minPrice?: number,
    @Query("maxPrice") maxPrice?: number,
    @Request() req?: any
  ): Promise<
    BaseResponseDto<{
      data: Product[];
      total: number;
      page: number;
      per_page: number;
    }>
  > {
    const result = await this.productsService.findAll(
      Number(page) || 1,
      Number(per_page) || 10,
      {
        search,
        category,
        brand,
        status,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      }
    );

    // Add wishlist status to products if user is authenticated
    const userId = req?.user?.id;
    const productsWithWishlistStatus =
      await this.productsService.addWishlistStatusToProducts(
        result.data,
        userId
      );

    return BaseResponseDto.success("Products retrieved successfully", {
      data: productsWithWishlistStatus,
      total: result.total,
      page: result.page,
      per_page: result.per_page,
    });
  }

  @Get(":id")
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(
    @Param("id") id: string,
    @Request() req?: any
  ): Promise<BaseResponseDto<Product>> {
    const product = await this.productsService.findOne(id);

    // Add wishlist status to product if user is authenticated
    const userId = req?.user?.id;
    const productsWithWishlistStatus =
      await this.productsService.addWishlistStatusToProducts([product], userId);

    return BaseResponseDto.success(
      "Product retrieved successfully",
      productsWithWishlistStatus[0]
    );
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<BaseResponseDto<Product>> {
    const product = await this.productsService.update(id, updateProductDto);
    return BaseResponseDto.success("Product updated successfully", product);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param("id") id: string): Promise<BaseResponseDto<void>> {
    await this.productsService.remove(id);
    return BaseResponseDto.success("Product deleted successfully");
  }
}
