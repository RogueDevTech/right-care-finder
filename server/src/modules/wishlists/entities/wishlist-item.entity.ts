import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Wishlist } from "./wishlist.entity";
import { Product } from "../../products/entities/product.entity";

@Entity("wishlist_items")
export class WishlistItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { nullable: true })
  notes: string;

  @Column({ default: 1 })
  quantity: number;

  @Column({ default: false })
  isPurchased: boolean;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.items)
  wishlist: Wishlist;

  @ManyToOne(() => Product, (product) => product.wishlistItems)
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
