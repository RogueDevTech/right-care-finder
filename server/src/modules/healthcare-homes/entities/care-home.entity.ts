import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { CareType } from "./care-type.entity";
import { CareHomeImage } from "./care-home-image.entity";
import { CareHomeReview } from "./care-home-review.entity";
import { CareHomeFacility } from "./care-home-facility.entity";
import { User } from "../../users/entities/user.entity";

@Entity("care_homes")
export class CareHome {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column("text", { array: true, default: [] })
  description: string[];

  @Column()
  addressLine1: string; // Building number and street name

  @Column({ nullable: true })
  addressLine2: string; // Apartment, suite, etc.

  @Column()
  city: string;

  @Column({ nullable: true })
  region: string; // County/State

  @Column()
  postcode: string;

  @Column({ nullable: true })
  country: string; // Default to "United Kingdom"

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  weeklyPrice: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  monthlyPrice: number;

  @Column({ default: 0 })
  totalBeds: number;

  @Column({ default: 0 })
  availableBeds: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column("text", { array: true, nullable: true, default: [] })
  specializations: string[];

  @Column({ nullable: true })
  cqcRating: string; // Outstanding, Good, Requires Improvement, Inadequate

  @Column({ nullable: true })
  lastInspectionDate: Date;

  @Column({ nullable: true })
  ageRestriction: string; // e.g., "65+", "18+", etc.

  @Column({ nullable: true })
  acceptingNewResidents: boolean;

  @Column("jsonb", { nullable: true })
  openingHours: Record<string, any>;

  @Column("jsonb", { nullable: true })
  contactInfo: Record<string, any>;

  @Column("decimal", { precision: 3, scale: 2, nullable: true })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @ManyToOne(() => CareType, (careType) => careType.careHomes)
  careType: CareType;

  @OneToMany(() => CareHomeImage, (image) => image.careHome, { cascade: true })
  images: CareHomeImage[];

  @OneToMany(() => CareHomeReview, (review) => review.careHome, {
    cascade: true,
  })
  reviews: CareHomeReview[];

  @ManyToMany(() => CareHomeFacility)
  @JoinTable({
    name: "care_home_facilities_junction",
    joinColumn: { name: "care_home_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "facility_id", referencedColumnName: "id" },
  })
  facilities: CareHomeFacility[];

  @ManyToOne(() => User, { nullable: true })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
