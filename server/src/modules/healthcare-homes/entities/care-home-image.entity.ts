import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { CareHome } from "./care-home.entity";

@Entity("care_home_images")
export class CareHomeImage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  alt: string;

  @Column({ default: false })
  isPrimary: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @ManyToOne(() => CareHome, (careHome) => careHome.images, { onDelete: "CASCADE" })
  careHome: CareHome;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
