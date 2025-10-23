import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("blog_posts")
export class BlogPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "text", nullable: true })
  excerpt: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  featuredImage: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  slug: string;

  @Column({ type: "varchar", length: 50, default: "draft" })
  status: "draft" | "published" | "archived";

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @Column({ type: "json", nullable: true })
  tags: string[];

  @Column({ type: "varchar", length: 100, nullable: true })
  category: string;

  @Column({ type: "int", default: 0 })
  viewCount: number;

  @Column({ type: "timestamp", nullable: true })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "uuid" })
  createdBy: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "createdBy" })
  author: User;
}
