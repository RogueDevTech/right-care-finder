import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./category.entity";
import { Brand } from "./brand.entity";
import { OrderItem } from "../../orders/entities/order-item.entity";
import { WishlistItem } from "../../wishlists/entities/wishlist-item.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column("text")
  description: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  salePrice: number;

  @Column({ unique: true })
  sku: string;

  @Column()
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  @Column("text", { array: true, nullable: true, default: [] })
  images: string[];

  @Column("jsonb", { nullable: true })
  specifications: Record<string, any>;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToOne(() => Brand, (brand) => brand.products)
  brand: Brand;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => WishlistItem, (wishlistItem) => wishlistItem.product)
  wishlistItems: WishlistItem[];

  // Virtual property for wishlist status (not stored in database)
  isWishlisted?: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
