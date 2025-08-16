import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { Category } from "./entities/category.entity";
import { Brand } from "./entities/brand.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
}

@Injectable()
export class ProductsService {
  private readonly MAX_PRICE = 99999999.99; // Maximum price that can be stored in the database (10^8 - 0.01)

  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
  ) {}

  private validatePrice(price: number) {
    if (price > this.MAX_PRICE) {
      throw new BadRequestException(
        `Price cannot exceed ${this.MAX_PRICE.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}`,
      );
    }
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { category, price, ...restData } = createProductDto;

    // Validate price
    this.validatePrice(price);

    const findCategories: Category = await this.categoriesRepository.findOne({
      where: { name: category },
    });

    if (!findCategories) {
      throw new NotFoundException(`Category with name '${category}' not found`);
    }

    const productCategory = this.productsRepository.create({
      ...restData,
      price,
      images: restData.images || [],
      category: findCategories,
    });

    const product = this.productsRepository.create(productCategory);
    return (await this.productsRepository.save(product)) as unknown as Product;
  }

  async findAll(
    page: number = 1,
    per_page: number = 10,
    filters?: ProductFilters,
  ): Promise<{
    data: Product[];
    total: number;
    page: number;
    per_page: number;
  }> {
    const queryBuilder = this.productsRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.brand", "brand");

    if (filters?.search) {
      queryBuilder.andWhere("product.name ILIKE :search", {
        search: `%${filters.search}%`,
      });
    }

    if (filters?.category) {
      queryBuilder.andWhere("category.name = :category", {
        category: filters.category,
      });
    }

    if (filters?.brand) {
      queryBuilder.andWhere("brand.name = :brand", { brand: filters.brand });
    }

    if (filters?.status) {
      if (filters.status === "active") {
        queryBuilder.andWhere("product.isActive = :isActive", {
          isActive: true,
        });
      } else if (filters.status === "draft") {
        queryBuilder.andWhere("product.isActive = :isActive", {
          isActive: false,
        });
      }
    }

    if (filters?.minPrice) {
      queryBuilder.andWhere("product.price >= :minPrice", {
        minPrice: filters.minPrice,
      });
    }

    if (filters?.maxPrice) {
      queryBuilder.andWhere("product.price <= :maxPrice", {
        maxPrice: filters.maxPrice,
      });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * per_page)
      .take(per_page)
      .orderBy("product.createdAt", "DESC")
      .getManyAndCount();

    return {
      data,
      total,
      page,
      per_page,
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ["category", "brand"],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    // Validate price if it's being updated
    if (updateProductDto.price !== undefined) {
      this.validatePrice(updateProductDto.price);
    }

    // Handle category update if provided
    if (updateProductDto.category) {
      const category = await this.categoriesRepository.findOne({
        where: { name: updateProductDto.category },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with name '${updateProductDto.category}' not found`,
        );
      }

      product.category = category;
      delete updateProductDto.category;
    }

    // Update other fields
    Object.assign(product, updateProductDto);

    return await this.productsRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  // Add wishlist status to products for a specific user
  async addWishlistStatusToProducts(
    products: Product[],
    userId?: string,
  ): Promise<Product[]> {
    if (!userId) {
      // If no user, all products are not wishlisted
      return products.map((product) => ({
        ...product,
        isWishlisted: false,
      }));
    }

    try {
      // Get wishlisted product IDs directly from database
      const wishlistedProducts = await this.productsRepository
        .createQueryBuilder("product")
        .innerJoin("product.wishlistItems", "wishlistItem")
        .innerJoin("wishlistItem.wishlist", "wishlist")
        .where("wishlist.user.id = :userId", { userId })
        .select("product.id")
        .getMany();

      const wishlistedProductIds = wishlistedProducts.map((p) => p.id);

      // Add wishlist status to each product
      return products.map((product) => ({
        ...product,
        isWishlisted: wishlistedProductIds.includes(product.id),
      }));
    } catch (error) {
      console.error("Error adding wishlist status to products:", error);
      // If error, return products without wishlist status
      return products.map((product) => ({
        ...product,
        isWishlisted: false,
      }));
    }
  }

  // Category methods
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return await this.categoriesRepository.save(category);
  }

  async findAllCategories(userId?: string): Promise<Category[]> {
    const categories = await this.categoriesRepository.find({
      relations: ["products"],
      order: {
        name: "ASC",
      },
    });

    // Add wishlist status to products in each category
    if (userId) {
      for (const category of categories) {
        if (category.products && category.products.length > 0) {
          category.products = await this.addWishlistStatusToProducts(
            category.products,
            userId,
          );
        }
      }
    } else {
      // If no user, set all products as not wishlisted
      for (const category of categories) {
        if (category.products && category.products.length > 0) {
          category.products = category.products.map((product) => ({
            ...product,
            isWishlisted: false,
          }));
        }
      }
    }

    return categories;
  }

  async findCategoryById(id: string, userId?: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ["products"],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Add wishlist status to products in the category
    if (userId && category.products && category.products.length > 0) {
      category.products = await this.addWishlistStatusToProducts(
        category.products,
        userId,
      );
    } else if (category.products && category.products.length > 0) {
      // If no user, set all products as not wishlisted
      category.products = category.products.map((product) => ({
        ...product,
        isWishlisted: false,
      }));
    }

    return category;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findCategoryById(id);

    // Update the category with new data
    Object.assign(category, updateCategoryDto);

    return await this.categoriesRepository.save(category);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ["products"],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (category.products && category.products.length > 0) {
      throw new BadRequestException(
        `Cannot delete category "${category.name}" because it has ${category.products.length} associated product(s). Please remove or reassign the products first.`,
      );
    }

    await this.categoriesRepository.delete(id);
  }

  // Brand methods
  async createBrand(createBrandDto: any): Promise<Brand> {
    const brand = this.brandsRepository.create(createBrandDto);
    return (await this.brandsRepository.save(brand)) as unknown as Brand;
  }

  async findAllBrands(userId?: string): Promise<Brand[]> {
    const brands = await this.brandsRepository.find({
      relations: ["products"],
    });

    // Add wishlist status to products in each brand
    if (userId) {
      for (const brand of brands) {
        if (brand.products && brand.products.length > 0) {
          brand.products = await this.addWishlistStatusToProducts(
            brand.products,
            userId,
          );
        }
      }
    } else {
      // If no user, set all products as not wishlisted
      for (const brand of brands) {
        if (brand.products && brand.products.length > 0) {
          brand.products = brand.products.map((product) => ({
            ...product,
            isWishlisted: false,
          }));
        }
      }
    }

    return brands;
  }

  async findBrandById(id: string, userId?: string): Promise<Brand> {
    const brand = await this.brandsRepository.findOne({
      where: { id },
      relations: ["products"],
    });
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    // Add wishlist status to products in the brand
    if (userId && brand.products && brand.products.length > 0) {
      brand.products = await this.addWishlistStatusToProducts(
        brand.products,
        userId,
      );
    } else if (brand.products && brand.products.length > 0) {
      // If no user, set all products as not wishlisted
      brand.products = brand.products.map((product) => ({
        ...product,
        isWishlisted: false,
      }));
    }

    return brand;
  }

  async updateBrand(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<Brand> {
    const brand = await this.findBrandById(id);

    // Update the brand with new data
    Object.assign(brand, updateBrandDto);

    return await this.brandsRepository.save(brand);
  }

  async deleteBrand(id: string): Promise<void> {
    const brand = await this.brandsRepository.findOne({
      where: { id },
      relations: ["products"],
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    if (brand.products && brand.products.length > 0) {
      throw new BadRequestException(
        `Cannot delete brand "${brand.name}" because it has ${brand.products.length} associated product(s). Please remove or reassign the products first.`,
      );
    }

    await this.brandsRepository.delete(id);
  }
}
