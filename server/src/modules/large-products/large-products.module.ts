import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsService } from "./large-products.service";
import { ProductsController } from "./large-products.controller";
import { Product } from "./entities/product.entity";
import { Category } from "./entities/category.entity";
import { Brand } from "./entities/brand.entity";
@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Brand])],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
