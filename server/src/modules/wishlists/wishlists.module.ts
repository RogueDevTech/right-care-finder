import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WishlistsService } from "./wishlists.service";
import { WishlistsController } from "./wishlists.controller";
import { Wishlist } from "./entities/wishlist.entity";
import { WishlistItem } from "./entities/wishlist-item.entity";
import { UsersModule } from "../users/users.module";
import { ProductsModule } from "../products/products.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist, WishlistItem]),
    UsersModule,
    ProductsModule,
  ],
  providers: [WishlistsService],
  controllers: [WishlistsController],
  exports: [WishlistsService],
})
export class WishlistsModule {}
