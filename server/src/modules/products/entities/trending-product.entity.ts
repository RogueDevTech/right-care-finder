import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Product } from "./product.entity";

@Entity("trending_products")
export class TrendingProduct {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Product, { eager: true, onDelete: "CASCADE" })
  product: Product;

  @Column({ type: "text", nullable: true })
  customImage: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 