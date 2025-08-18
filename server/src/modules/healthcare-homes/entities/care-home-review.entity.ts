import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { CareHome } from "./care-home.entity";
import { User } from "../../users/entities/user.entity";

@Entity("care_home_reviews")
export class CareHomeReview {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  comment: string;

  @Column({ type: "int", default: 5 })
  rating: number;

  @Column({ default: true })
  isVerified: boolean;

  @Column({ default: false })
  isAnonymous: boolean;

  @Column("jsonb", { nullable: true })
  reviewData: Record<string, any>;

  @ManyToOne(() => CareHome, (careHome) => careHome.reviews, { onDelete: "CASCADE" })
  careHome: CareHome;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
