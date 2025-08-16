import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { WishlistsService } from "./wishlists.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { BaseResponseDto } from "../../common/dto/base-response.dto";

@Controller("v1/wishlists")
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createWishlistDto: any) {
    return this.wishlistsService.create(req.user.id, createWishlistDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req) {
    const wishlists = await this.wishlistsService.findAll(req.user.id);
    return BaseResponseDto.success(
      "Wishlists retrieved successfully",
      wishlists
    );
  }

  @Get("public")
  findPublicWishlists() {
    return this.wishlistsService.findPublicWishlists();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  findOne(@Request() req, @Param("id") id: string) {
    return this.wishlistsService.findOne(id, req.user.id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  update(
    @Request() req,
    @Param("id") id: string,
    @Body() updateWishlistDto: any
  ) {
    return this.wishlistsService.update(id, req.user.id, updateWishlistDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  remove(@Request() req, @Param("id") id: string) {
    return this.wishlistsService.remove(id, req.user.id);
  }

  // Wishlist Items endpoints
  @Post(":id/items")
  @UseGuards(JwtAuthGuard)
  addItem(@Request() req, @Param("id") id: string, @Body() createItemDto: any) {
    return this.wishlistsService.addItem(id, req.user.id, createItemDto);
  }

  @Patch(":wishlistId/items/:itemId")
  @UseGuards(JwtAuthGuard)
  updateItem(
    @Request() req,
    @Param("wishlistId") wishlistId: string,
    @Param("itemId") itemId: string,
    @Body() updateItemDto: any
  ) {
    return this.wishlistsService.updateItem(
      wishlistId,
      itemId,
      req.user.id,
      updateItemDto
    );
  }

  @Delete(":wishlistId/items/:itemId")
  @UseGuards(JwtAuthGuard)
  removeItem(
    @Request() req,
    @Param("wishlistId") wishlistId: string,
    @Param("itemId") itemId: string
  ) {
    return this.wishlistsService.removeItem(wishlistId, itemId, req.user.id);
  }

  // Quick endpoints for frontend convenience
  @Get("check/:productId")
  @UseGuards(JwtAuthGuard)
  checkProductInWishlist(
    @Request() req,
    @Param("productId") productId: string
  ) {
    return this.wishlistsService.checkProductInWishlist(req.user.id, productId);
  }

  @Post("toggle/:productId")
  @UseGuards(JwtAuthGuard)
  async toggleProduct(@Request() req, @Param("productId") productId: string) {
    const result = await this.wishlistsService.toggleProduct(
      req.user.id,
      productId
    );
    return BaseResponseDto.success("Wishlist updated successfully", result);
  }
}
