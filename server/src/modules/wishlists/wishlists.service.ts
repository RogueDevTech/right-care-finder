import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Wishlist } from "./entities/wishlist.entity";
import { WishlistItem } from "./entities/wishlist-item.entity";
import { ProductsService } from "../products/products.service";

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    @InjectRepository(WishlistItem)
    private wishlistItemsRepository: Repository<WishlistItem>,
    private productsService: ProductsService,
  ) {}

  async create(userId: string, createWishlistDto: any): Promise<Wishlist> {
    const wishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      user: { id: userId },
    });
    const result = await this.wishlistsRepository.save(wishlist);
    return result as unknown as Wishlist;
  }

  async findAll(userId: string): Promise<Wishlist[]> {
    return await this.wishlistsRepository.find({
      where: { user: { id: userId } },
      relations: ["items", "items.product"],
    });
  }

  async findPublicWishlists(): Promise<Wishlist[]> {
    try {
      return await this.wishlistsRepository.find({
        where: { isPublic: true },
        relations: ["user", "items", "items.product"],
      });
    } catch (error) {
      console.error("Error fetching public wishlists:", error);
      return [];
    }
  }

  async findOne(id: string, userId: string): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ["user", "items", "items.product"],
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }

    if (wishlist.user.id !== userId && !wishlist.isPublic) {
      throw new ForbiddenException("You do not have access to this wishlist");
    }

    return wishlist;
  }

  async update(
    id: string,
    userId: string,
    updateWishlistDto: any,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne(id, userId);
    Object.assign(wishlist, updateWishlistDto);
    return this.wishlistsRepository.save(wishlist);
  }

  async remove(id: string, userId: string): Promise<void> {
    const wishlist = await this.findOne(id, userId);
    await this.wishlistsRepository.remove(wishlist);
  }

  async addItem(
    wishlistId: string,
    userId: string,
    createItemDto: any,
  ): Promise<WishlistItem> {
    const wishlist = await this.findOne(wishlistId, userId);
    const product = await this.productsService.findOne(createItemDto.productId);

    const wishlistItem = this.wishlistItemsRepository.create({
      ...createItemDto,
      wishlist,
      product,
    });

    const result = await this.wishlistItemsRepository.save(wishlistItem);
    return result as unknown as WishlistItem;
  }

  async updateItem(
    wishlistId: string,
    itemId: string,
    userId: string,
    updateItemDto: any,
  ): Promise<WishlistItem> {
    await this.findOne(wishlistId, userId);
    const item = await this.wishlistItemsRepository.findOne({
      where: { id: itemId, wishlist: { id: wishlistId } },
    });

    if (!item) {
      throw new NotFoundException(`Wishlist item with ID ${itemId} not found`);
    }

    Object.assign(item, updateItemDto);
    return this.wishlistItemsRepository.save(item);
  }

  async removeItem(
    wishlistId: string,
    itemId: string,
    userId: string,
  ): Promise<void> {
    await this.findOne(wishlistId, userId);
    const item = await this.wishlistItemsRepository.findOne({
      where: { id: itemId, wishlist: { id: wishlistId } },
    });

    if (!item) {
      throw new NotFoundException(`Wishlist item with ID ${itemId} not found`);
    }

    await this.wishlistItemsRepository.remove(item);
  }

  async checkProductInWishlist(
    userId: string,
    productId: string,
  ): Promise<boolean> {
    const wishlists = await this.findAll(userId);
    return wishlists.some((wishlist) =>
      wishlist.items.some((item) => item.product.id === productId),
    );
  }

  async toggleProduct(
    userId: string,
    productId: string,
  ): Promise<{ added: boolean; removed: boolean }> {
    const wishlists = (await this.findAll(userId)) || [];
    let defaultWishlist = wishlists.find((w) => w.name === "My Wishlist");

    // Create default wishlist if it doesn't exist
    if (!defaultWishlist) {
      defaultWishlist = await this.create(userId, { name: "My Wishlist" });
    }

    // Check if product is already in wishlist
    const existingItem = (defaultWishlist.items || []).find(
      (item) => item.product.id === productId,
    );

    if (existingItem) {
      // Remove from wishlist
      await this.removeItem(defaultWishlist.id, existingItem.id, userId);
      return { added: false, removed: true };
    } else {
      // Add to wishlist
      await this.addItem(defaultWishlist.id, userId, { productId });
      return { added: true, removed: false };
    }
  }
}
